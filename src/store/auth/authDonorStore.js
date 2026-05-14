/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import { performFullCleanup } from '@/lib/authHelpers';

/*
 * 🧠 THE DONOR'S MEMORY BOX (useDonorAuthStore)
 * This is the place where the app saves everything for a blood donor.
 * It remembers who is logged in, their messages, and their settings.
 * It also keeps a copy in the browser so the info doesn't vanish when you refresh.
 */
export const useDonorAuthStore = create(
  persist(
    (set, get) => ({
      // These are the empty spots to hold the donor's information
      user: null,
      loading: false,
      error: null,
      success: null,

      totalPatients: 0,
      pendingRequests: 0,
      totalApproved: 0,
      DonorCaught: null,
      filters: {
        name: '',
        bloodGroup: '',
        location: '',
      },
      patients: [],
      totalPages: 0,
      currentPage: 1,
      requests: [],

      fetchingDonor: false,
      fetchingStats: false,

      /* 🧹 CLEAN MESSAGES
       * Clears any old error or success messages from the screen.
       */
      resetMessages: () => set({ error: null, success: null }),

      /* 🔍 SET SEARCH SETTINGS
       * Saves the name or blood type the donor is looking for.
       */
      setFilters: (filters) => set({ filters }),

      /* 📝 SIGN UP
       * Creates a new account for a donor and checks for any mistakes.
       */
      register: async (formData, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const payload = {
            ...formData,
            captchaToken,
          };
          const res = await apiWrapper.post('/donor/donor-register', payload);
          const data = res.data;
          if (data.donor && data.message) {
            return data.donor;
          }
          else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          set({ error: err.response?.data?.error || 'Registration failed' });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* ✅ CHECK EMAIL CODE
       * Checks the secret code sent to the donor's email to make sure it is real.
       */
      verifyEmail: async (email, otp, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/donor/verify-email-for-donor', {
            email,
            otp,
            captchaToken,
          });
          const data = res.data;
          if (data.status === 'success') {
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          set({ error: err.response?.data?.error || 'Verification failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔑 LOG IN
       * Checks email and password to let the donor into the app.
       * It also wipes out any old data from the last person who used the app.
       */
      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          // 🔕 showToast: false — suppress premature success toast on the login page.
          // The dashboard layout will fire the toast AFTER navigation completes.
          const res = await apiWrapper.post('/donor/donor-login', {
            email,
            password,
            captchaToken,
          }, { showToast: false });
          const data = res.data;
          if (data.status) {
            Cookies.set('role', data.user.role, { expires: 1 });

            // ✅ Store login success message for dashboard to show after redirect
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('login_success', data.message || 'Donor logged in successfully');
            }

            set({
              user: data.user,
              DonorCaught: data.user,
              requests: [],
              patients: [],
              feedbacks: []
            });

            return data.user;
          }
          else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          set({
            error:
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Login failed',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* 📧 FORGOT PASSWORD LINK
       * Sends a link to the donor's email if they can't remember their password.
       */
      requestResetLink: async (email, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/donor/donor-password-reset-link',
            {
              email,
              captchaToken,
            }
          );
          set({ success: res.data.message });
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔄 SET NEW PASSWORD
       * Uses the email link to save a brand new password.
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
            `/donor/donor-password-reset/${id}/${token}`,
            { password, password_confirmation, captchaToken }
          );
          return true;

        } catch (err) {
          set({
            error: err?.response?.data?.error,
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔐 CHANGE PASSWORD
       * Lets a logged-in donor pick a new password.
       */
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put('/donor/donor-change-password', {
            password,
            password_confirmation,
          });
          return true;

        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🚪 LOG OUT
       * Signs the donor out and wipes their personal data from the browser.
       */
      logout: async () => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.post('/donor/donor-logout', {});

          performFullCleanup();

          set({ user: null, DonorCaught: null, requests: [], patients: [] });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error || 'Logout failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 👤 GET PROFILE
       * Gets the details of the donor who is currently logged in.
       */
      getDonor: async () => {
        if (get().fetchingDonor || get().DonorCaught) return get().DonorCaught;
        set({ fetchingDonor: true, error: null });
        try {
          const res = await apiWrapper.get('/donor/get-donor');
          set({
            user: res.data.user,
            DonorCaught: res.data.user,
            fetchingDonor: false,
          });
          return res.data.user;
        } catch (err) {
          set({ error: err.response?.data?.error, fetchingDonor: false });
          return null;
        }
      },

      /* 🗑️ DELETE ACCOUNT
       * Permanently removes the donor's account and all their data.
       */
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete('/donor/donor-delete-ourself');

          performFullCleanup();

          set({ user: null, DonorCaught: null, requests: [], patients: [] });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* ✏️ EDIT PROFILE
       * Updates the donor's personal information like name or phone number.
       */
      updateProfile: async (formData) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put(
            '/donor/donor-update-profile',
            formData
          );
          set({
            user: res.data.user,
            DonorCaught: res.data.user,
          });
          return true;

        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔍 GET LIST OF PATIENTS
       * Gets a list of people who need blood so the donor can see them.
       */
      fetchPatients: async (page = 1, limit = 10) => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const { name, bloodGroup, location } = get().filters;

          const query = {};
          if (name) query.name = name;
          if (bloodGroup) query.bloodGroup = bloodGroup;
          if (location) query.location = location;

          if (!name && !bloodGroup && !location) {
            query.page = page;
            query.limit = limit;
          }

          const res = await apiWrapper.get(
            '/donor/get-all-patients-for-donor',
            {
              params: query,
            }
          );

          const data = res.data;

          if (data.success) {
            set({
              patients: data.patients,
              totalPages: data.totalPages,
              currentPage: data.currentPage,
            });
          } else {
            set({ error: data.message });
          }
        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
        } finally {
          set({ loading: false });
        }
      },

      /* 🩺 GET ONE PATIENT
       * Gets the full details of one specific patient.
       */
      fetchPatientById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(
            `/donor/get-patient-by-id-for-donor/${id}`
          );
          if (res.data.success) {
            return {
              patient: res.data.patient,
              status: res.data.status
            };
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

      /* 📥 GET BLOOD REQUESTS
       * Gets a list of patients who have asked this donor for help.
       */
      fetchRequests: async () => {
        if (get().loadingRequests) return;
        set({
          loadingRequests: true,
          errorRequests: null,
          successRequests: null,
        });

        try {
          const res = await apiWrapper.get(
            '/donor/get-all-patient-requests-for-donor'
          );

          if (res.data?.success) {
            set({
              requests: res.data.requests || [],
              successRequests:
                res.data.message || 'Requests fetched successfully',
            });
          } else {
            set({
              errorRequests:
                res.data?.message || 'Failed to fetch patient requests',
            });
          }
        } catch (err) {
          console.error('Fetch Requests Error:', err);
          set({
            errorRequests:
              err.response?.data?.error ||
              'Something went wrong while fetching requests.',
          });
        } finally {
          set({ loadingRequests: false });
        }
      },

      /* ✅❌ SAY YES OR NO
       * Lets the donor Approve or Reject a patient's request for blood.
       */
      updateRequestStatus: async (requestId, status) => {
        set({
          loadingRequests: true,
          errorRequests: null,
          successRequests: null,
        });

        try {
          const res = await apiWrapper.put(
            `/donor/update-patient-request-status-by-donor/${requestId}`,
            { status }
          );

          if (res.data?.success) {
            const updatedRequests = get().requests.map((req) =>
              req._id === requestId
                ? { ...req, status: res.data.request?.status || status }
                : req
            );

            set({
              requests: updatedRequests,
              successRequests:
                res.data.message ||
                (status === 'Approved'
                  ? 'Request approved successfully'
                  : 'Request rejected successfully'),
            });
          } else {
            set({
              errorRequests:
                res.data?.message || 'Failed to update request status',
            });
          }
        } catch (err) {
          console.error('Update Status Error:', err);
          set({
            errorRequests:
              err.response?.data?.error ||
              'Something went wrong while updating status.',
          });
        } finally {
          set({ loadingRequests: false });
        }
      },
      /* ⭐ SEND A REVIEW
       * Lets the donor send feedback, a rating, and an emoji.
       */
      addFeedback: async (message, rating, reaction) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/donor/feedback/add', {
            message,
            rating,
            reaction,
          });

          if (res.data.success) {
            set({ success: res.data.message });
            return true;
          } else {
            set({ error: res.data.message });
            return false;
          }
        } catch (err) {
          set({
            error: err.response?.data?.error || 'Something went wrong',
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },


      /* 📊 GET DASHBOARD NUMBERS
       * Gets the quick numbers for the donor's main screen.
       */
      fetchStats: async () => {
        if (get().fetchingStats) return;
        try {
          set({ fetchingStats: true });
          const res = await apiWrapper.get('/donor/get-stats');
          const data = res.data;
          set({
            totalPatients: data.totalPatients || 0,
            pendingRequests: data.pendingRequests || 0,
            totalApproved: data.totalApproved || 0,
            fetchingStats: false,
          });
        } catch (err) {
          set({ fetchingStats: false, error: err.response?.data?.error });
        }
      },

    }),
    {
      /* 📌 WHAT TO REMEMBER
       * This part tells the browser to keep remembering the donor's ID 
       * and name even if they close the window.
       */
      name: 'donor-auth-storage',
      partialize: (state) => ({
        user: state.user
          ? {
            _id: state.user._id || '',
            fullName: state.user.fullName || '',
            role: 'donor',
          }
          : null,
      }),
      getStorage: () => localStorage,
    }
  )
);