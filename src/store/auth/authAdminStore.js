/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import { performFullCleanup } from '@/lib/authHelpers';

/*
 * 🧠 THE MAIN ADMIN MEMORY BOX (useAdminAuthStore)
 * This creates a big memory box for the Admin Dashboard. 
 * It holds everything the admin needs to see, like the total number of users, 
 * lists of bad reports, and the admin's own details.
 * Because of a special rule at the bottom, it remembers this info even if you refresh the page.
 */
export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      // These are the empty spots where we will hold information later
      user: null,
      AdminCaught: null,
      loading: false,
      exportLoading: false,
      tableLoading: false,
      deletingLoading: false,

      feedbacks: [],
      totalFeedbacks: 0,
      totalFeedbackPages: 0,
      currentFeedbackPage: 1,
      error: null,
      success: null,
      totalDonors: 0,
      totalPatients: 0,
      totalAdmins: 0,
      totalSuperAdmins: 0,
      donorBloodGroups: [],
      patientBloodGroups: [],
      requestStats: [],
      fetchingAdmin: false,
      fetchingStats: false,

      /* 🧹 CLEANS UP MESSAGES
       * Clears any old success or error messages off the screen.
       */
      resetMessages: () => set({ error: null, success: null }),

      /* 📊 GET ADMIN STATUS
       * Checks if the admin quota limit has been reached.
       */
      getAdminStatus: async () => {
        try {
          const res = await apiWrapper.get('/admin/status');
          return res.data;
        } catch (err) {
          return { success: false, limitReached: true };
        }
      },

      /* 📝 CREATE NEW ADMIN
       * Signs up a brand new admin account.
       */
      register: async (formData, captchaToken) => {
        set({ loading: true, error: null, success: null });

        try {
          const payload = {
            ...formData,
            captchaToken,
          };

          const res = await apiWrapper.post('/admin/register', payload);
          const data = res.data;

          if (data.success && data.data) {
            set({
              user: data.data,
            });
            return data.data;
          }
          else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* ✅ CHECK EMAIL CODE
       * Checks if the secret code sent to the email is correct to turn the account on.
       */
      verifyEmail: async (email, otp, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/admin/verify-email-for-admin', {
            email,
            otp,
            captchaToken,
          });

          const data = res.data;

          if (data.success) {
            set({ success: data.message });
            return true;
          } else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage = err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🚪 LOG IN
       * Checks the email and password to let the admin inside the app. 
       * It also makes sure to clean up any leftover data from the last person.
       */
      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });

        try {
          // 🔕 showToast: false — suppress premature success toast on the login page.
          // The dashboard layout will fire the toast AFTER navigation completes.
          const res = await apiWrapper.post('/admin/admin-login', {
            email,
            password,
            captchaToken,
          }, { showToast: false });
          const data = res.data;


          if (data.status === true && data.user) {
            Cookies.set('role', data.user.role, { expires: 1 });

            // ✅ Store login success message for dashboard to show after redirect
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('login_success', data.message || 'Admin logged in successfully');
            }

            set({
              user: data.user,
              AdminCaught: data.user,
              feedbacks: []
            });
            return data.user;
          }
          else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed' });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* 📧 SEND PASSWORD LINK
       * Sends an email with a link to make a new password if the admin forgot it.
       */
      requestResetLink: async (email, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/admin/admin-password-reset-link',
            {
              email,
              captchaToken,
            }
          );

          const data = res.data;

          if (data.success) {
            return true;
          } else {
            set({ error: data.message });
            return false;
          }

        } catch (err) {
          const errorMessage = err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔄 MAKE NEW PASSWORD
       * Saves the brand new password using the link from the email.
       */
      resetPassword: async (
        id,
        token,
        password,
        password_confirmation,
        captchaToken
      ) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            `/admin/admin-password-reset/${id}/${token}`,
            { password, password_confirmation, captchaToken }
          );

          const data = res.data;

          if (data.success) {
            return true;
          } else {
            set({ error: data.message });
            return false;
          }

        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔐 CHANGE CURRENT PASSWORD
       * Lets an admin pick a new password while they are inside the app.
       */
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put('/admin/admin-change-password', {
            password,
            password_confirmation,
          });

          const data = res.data;

          if (data.success) {
            return true;
          } else {
            set({ error: data.message });
            return false;
          }

        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 👋 LOG OUT
       * Signs the admin out and totally destroys their keys and memory 
       * so the next person starts completely fresh.
       */
      logout: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/admin/admin-logout', {});
          const data = res.data;

          if (data.success) {
            performFullCleanup();

            set({ user: null, AdminCaught: null, feedbacks: [] });
            return true;


          } else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Logout failed',
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 👤 GET MY PROFILE
       * Gets FRESH profile details of the admin from the DB on every call.
       * We do NOT return the cached AdminCaught here — that would serve stale data.
       * This is called on every dashboard mount to pick up any privilege changes
       * the Super Admin may have made (e.g., canDelete updated from false → true).
       */
      getAdmin: async () => {
        if (get().fetchingAdmin) return null; // Prevent duplicate in-flight requests

        // ✅ Always fetch from server — never serve stale localStorage data
        set({ fetchingAdmin: true, error: null });

        try {
          const res = await apiWrapper.get('/admin/get-admin');
          const data = res.data;

          if (data.success) {
            // Update AdminCaught with the LATEST data from DB
            set({ AdminCaught: data.user, fetchingAdmin: false });
            return data.user;
          } else {
            set({ error: data.message, fetchingAdmin: false });
            return null;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage, fetchingAdmin: false });
          return null;
        }
      },

      /* 🗑️ DELETE MY ACCOUNT
       * Deletes the admin's own account and throws away all their data.
       */
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete('/admin/admin-delete-ourself');
          const data = res.data;

          if (data.success) {
            performFullCleanup();

            set({ user: null, AdminCaught: null, feedbacks: [] });
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔍 GET A LIST OF DONORS
       * Gets a list of people giving blood so the admin can see them on the screen.
       */
      getDonors: async (page = 1, limit = 10, filters = {}) => {
        if (get().tableLoading) return { donors: [], totalPages: 0, currentPage: 1 };
        set({ tableLoading: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/get-all-donors-from-admin', {
            params: { page, limit, ...filters },
          });

          const data = res.data;

          if (data.success) {
            return data;
          } else {
            set({ error: data.message });
            return { donors: [], totalPages: 0, currentPage: 1 };
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return { donors: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ tableLoading: false });
        }
      },

      /* 🩺 GET ONE DONOR
       * Gets the full details of one specific donor.
       */
      getDonorById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(`/admin/getSingleDonor/${id}`);
          const data = res.data;

          if (data.success) {
            return data.donor;
          } else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* ❌ DELETE ONE DONOR
       * Deletes a donor completely from the system.
       */
      deleteDonorById: async (id) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(`/admin/deleteSingleDonor/${id}`);
          const data = res.data;

          if (data.success) {
            await get().fetchStats(); // Updates the dashboard numbers right away
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 📥 DOWNLOAD DONORS FILE
       * Downloads the list of donors as a file (like Excel or PDF) to the computer.
       */
      exportDonors: async (filters = {}, exportFormat = 'excel') => {
        if (get().exportLoading) return false; // Stop if already downloading
        set({ exportLoading: true, error: null, success: null });
        try {
          const params = { ...filters, format: exportFormat };

          const res = await apiWrapper.get('/admin/export-donors', {
            params,
            responseType: 'blob',
            showToast: false, // Hide the small error popups
          });

          // Check if the answer is actually an error message
          if (res.data.type === 'application/json') {
            const text = await res.data.text();
            const data = JSON.parse(text);
            set({ error: data.message || 'Export failed' });
            return false;
          }

          const blob = new Blob([res.data], {
            type:
              exportFormat === 'excel'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = exportFormat === 'excel' ? 'donors.xlsx' : 'donors.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          set({ success: `Donors exported successfully as ${exportFormat.toUpperCase()}` });
          return true;
        } catch (err) {
          let message = 'Export failed';
          if (err.response?.data instanceof Blob) {
            const text = await err.response.data.text();
            try {
              const data = JSON.parse(text);
              message = data.message || data.error || message;
            } catch (e) { }
          } else if (err.code === 'ERR_CANCELED' || (err.name === 'AxiosError' && !err.response)) {
            // Ignore if a download manager interrupts it
            return false;
          } else {
            message = err.response?.data?.error || err.response?.data?.message || message;
          }
          set({ error: message });
          return false;
        } finally {
          set({ exportLoading: false });
        }
      },

      /* 🔍 GET A LIST OF PATIENTS
       * Gets a list of people who need blood so the admin can see them.
       */
      getPatients: async (page = 1, limit = 10, filters = {}) => {
        if (get().tableLoading) return { patients: [], totalPages: 0, currentPage: 1 };
        set({ tableLoading: true, error: null });
        try {
          const res = await apiWrapper.get(
            '/admin/get-all-patients-from-admin',
            {
              params: { page, limit, ...filters },
            }
          );
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return { patients: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ tableLoading: false });
        }
      },

      /* 🩺 GET ONE PATIENT
       * Gets the full details of one specific patient.
       */
      getPatientById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(`/admin/getSinglePatient/${id}`);
          const data = res.data;

          if (data.success) {
            return data.patient;
          } else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* ❌ DELETE ONE PATIENT
       * Deletes a patient completely from the system.
       */
      deletePatientById: async (id) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(
            `/admin/deleteSinglePatient/${id}`
          );
          const data = res.data;

          if (data.success) {
            await get().fetchStats(); // Updates dashboard numbers right away
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 📥 DOWNLOAD PATIENTS FILE
       * Downloads the list of patients as a file to the computer.
       */
      exportPatients: async (filters = {}, exportFormat = 'excel') => {
        if (get().exportLoading) return false;
        set({ exportLoading: true, error: null, success: null });
        try {
          const params = { ...filters, format: exportFormat };

          const res = await apiWrapper.get('/admin/export-patients', {
            params,
            responseType: 'blob',
            showToast: false,
          });

          if (!res.data) {
            set({ error: 'No data received for export' });
            return false;
          }

          // Check if the answer is actually an error message
          if (res.data.type === 'application/json') {
            const text = await res.data.text();
            const data = JSON.parse(text);
            set({ error: data.message || 'Export failed' });
            return false;
          }

          const blob = new Blob([res.data], {
            type:
              exportFormat === 'excel'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf',
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download =
            exportFormat === 'excel' ? 'patients.xlsx' : 'patients.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          set({ success: `Patients exported successfully as ${exportFormat.toUpperCase()}` });
          return true;
        } catch (err) {
          let message = 'Export failed';
          if (err.response?.data instanceof Blob) {
            const text = await err.response.data.text();
            try {
              const data = JSON.parse(text);
              message = data.message || data.error || message;
            } catch (e) { }
          } else if (err.code === 'ERR_CANCELED' || (err.name === 'AxiosError' && !err.response)) {
            // Ignore if a download manager interrupts it
            return false;
          } else {
            message = err.response?.data?.error || err.response?.data?.message || message;
          }
          set({ error: message });
          return false;
        } finally {
          set({ exportLoading: false });
        }
      },

      /* 📊 GET DASHBOARD NUMBERS
       * Gets the quick dashboard numbers (like how many total donors and patients exist).
       * Pass silent = true to refresh in the background without showing a loading spinner.
       */
      fetchStats: async (silent = false) => {
        if (get().fetchingStats) return;
        if (!silent) set({ fetchingStats: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/get-stats');
          const data = res.data;
          set({
            totalDonors: data.totalDonors || 0,
            totalPatients: data.totalPatients || 0,
            totalAdmins: data.totalAdmins || 0,
            totalSuperAdmins: data.totalSuperAdmins || 0,
            donorBloodGroups: data.donorBloodGroups || [],
            patientBloodGroups: data.patientBloodGroups || [],
            requestStats: data.requestStats || [],
            fetchingStats: false,
          });
        } catch (err) {
          set({ fetchingStats: false, error: err.response?.data?.error });
        }
      },

      /* ✏️ EDIT MY PROFILE
       * Changes the admin's personal details (like name or phone).
       */
      updateProfile: async (formData) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put(
            '/admin/admin-update-profile',
            formData
          );
          const data = res.data;

          if (data.success) {
            set({
              user: data.user,
              AdminCaught: data.user,
            });
            await get().fetchStats(); // Updates dashboard numbers
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },



      /* ⭐ GET ALL REVIEWS
       * Gets a list of reviews and comments left by users.
       * Pass silent = true to refresh in the background without showing a loading spinner.
       */
      getAllFeedbacks: async (page = 1, limit = 50, silent = false) => {
        if (get().loading && !silent) return { feedbacks: [], totalFeedbacks: 0 };
        if (!silent) set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(`/admin/feedback/all?page=${page}&limit=${limit}`);
          const data = res.data;

          if (data.success) {
            set({
              success: data.message,
              feedbacks: data.feedbacks,
              totalFeedbacks: data.totalFeedbacks,
              totalFeedbackPages: data.totalPages,
              currentFeedbackPage: data.currentPage
            });
            return data;
          } else {
            set({ error: data.message });
            return { feedbacks: [], totalFeedbacks: 0 };
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error;
          set({ error: errorMessage });
          return { feedbacks: [], totalFeedbacks: 0 };
        } finally {
          if (!silent) set({ loading: false });
        }
      },



      /* 👨‍💼 GET A LIST OF OTHER ADMINS
       * Gets a list of all the other admins in the system.
       */
      getAllAdmins: async (page = 1, limit = 10) => {
        if (get().loading) return { admins: [], totalPages: 0, currentPage: 1 };
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(`/admin/get-all-admins?page=${page}&limit=${limit}`);
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to fetch admins' });
          return { admins: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ loading: false });
        }
      },

      /* ❌ DELETE ANOTHER ADMIN
       * Deletes another admin's account from the system.
       */
      deleteAdminById: async (id) => {
        set({ loading: true });
        try {
          const res = await apiWrapper.delete(`/admin/deleteSingleAdmin/${id}`);
          if (res.data.success) {
            await get().fetchStats(); // Updates dashboard numbers
            set({ success: res.data.message });
            return true;
          }
          return false;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Delete failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🌐 GET PUBLIC FEEDBACKS
       * Gets public feedback submitted without logging in
       */
      getPublicFeedbacks: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/public-feedback');
          const data = res.data;

          if (data.success) {
            return data.feedbacks;
          } else {
            set({ error: data.message });
            return [];
          }
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error });
          return [];
        } finally {
          set({ loading: false });
        }
      },

      /* ✅ APPROVE OR REJECT AN ADMIN (Super Admin only) */
      updateAdminApproval: async (id, approvalStatus) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.patch(`/admin/admin-approval/${id}`, { approvalStatus });
          const data = res.data;
          if (data.success) {
            set({ success: data.message });
            return true;
          } else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Action failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔑 UPDATE ADMIN PRIVILEGES (Super Admin only) */
      updateAdminPrivileges: async (id, canDelete) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.patch(`/admin/admin-privileges/${id}`, { canDelete });
          const data = res.data;
          if (data.success) {
            set({ success: data.message });
            return true;
          } else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          set({ error: err.response?.data?.message || 'Privilege update failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      /* 📌 WHAT TO REMEMBER
       * This part tells the memory box exactly which pieces of information 
       * it must remember even if you close the browser or refresh the page.
       */
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        AdminCaught: state.AdminCaught,
        totalDonors: state.totalDonors,
        totalPatients: state.totalPatients,
        totalAdmins: state.totalAdmins,
        totalSuperAdmins: state.totalSuperAdmins,
        feedbacks: state.feedbacks,
        totalFeedbacks: state.totalFeedbacks,
        totalFeedbackPages: state.totalFeedbackPages,
        currentFeedbackPage: state.currentFeedbackPage,
      }),
      getStorage: () => localStorage,
    }
  )
);