/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import { performFullCleanup } from '@/lib/authHelpers';

/*
 * 🧠 THE PATIENT'S MEMORY BOX (usePatientAuthStore)
 * This is the place where the app saves everything for a patient.
 * It remembers who is logged in, their blood requests, and their settings.
 * It also keeps a copy in the browser so the info doesn't vanish if the page is refreshed.
 */
export const usePatientAuthStore = create(
  persist(
    (set, get) => ({
      // These are the empty spots to hold the patient's information
      user: null,

      totalDonors: 0,
      pendingMyRequests: 0,
      totalDonationsReceived: 0,
      PatientCaught: null,
      filters: {
        name: '',
        bloodGroup: '',
        location: '',
      },
      donors: [],
      totalPages: 0,
      currentPage: 1,
      requests: [],

      fetchingPatient: false,
      fetchingStats: false,

      /* 🧹 CLEAN MESSAGES
       * Clears any old error or success messages from the screen.
       */
      resetMessages: () => set({ error: null, success: null }),

      /* 🔍 SET SEARCH SETTINGS
       * Saves the name or blood type the patient is looking for.
       */
      setFilters: (filters) => set({ filters }),

      /* 📝 SIGN UP
       * Creates a new account for a patient and checks for any mistakes.
       */
      register: async (formData, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const payload = {
            ...formData,
            captchaToken,
          };
          const res = await apiWrapper.post(
            '/patient/patient-register',
            payload
          );
          const data = res.data;
          if (data.patient && data.message) {
            return data.patient;
          }
          else {
            set({ error: data.message || data.error });
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
       * Checks the secret code sent to the patient's email to make sure it is real.
       */
      verifyEmail: async (email, otp, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/patient/verify-email-for-patient',
            {
              email,
              otp,
              captchaToken,
            }
          );
          const data = res.data;
          if (data.status === 'success') {
            return true;
          }
          else {
            set({ error: data.message || data.error });
            return false;
          }
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔑 LOG IN
       * Checks email and password to let the patient into the app.
       * It also wipes out any old data from the last person who used the app.
       */
      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          // 🔕 showToast: false — suppress premature success toast on the login page.
          // The dashboard layout will fire the toast AFTER navigation completes.
          const res = await apiWrapper.post('/patient/patient-login', {
            email,
            password,
            captchaToken,
          }, { showToast: false });
          const data = res.data;
          if (data?.status === true && data?.user) {
            Cookies.set('role', data?.user?.role, { expires: 1 });

            // ✅ Store login success message for dashboard to show after redirect
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('login_success', data.message || 'Patient logged in successfully');
            }

            set({
              user: data?.user,
              PatientCaught: data?.user,
              donors: [],
              requests: [],
            });
            return data?.user;
          }
          else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          set({
            error:
              err.response?.data?.error ||
              err.response?.data?.message ||
              'Login failed',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* 📧 FORGOT PASSWORD LINK
       * Sends a link to the patient's email if they can't remember their password.
       */
      requestResetLink: async (email, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/patient/patient-password-reset-link',
            {
              email,
              captchaToken,
            }
          );
          return true;

        } catch (err) {
          set({ error: err.response?.data?.error });
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
            `/patient/patient-password-reset/${id}/${token}`,
            { password, password_confirmation, captchaToken }
          );
          return true;

        } catch (err) {
          set({ error: err?.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🔐 CHANGE PASSWORD
       * Lets a logged-in patient pick a new password.
       */
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put('/patient/patient-change-password', {
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
       * Signs the patient out and wipes their personal data from the browser.
       */
      logout: async () => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.post('/patient/patient-logout', {});

          performFullCleanup();

          set({
            user: null,
            PatientCaught: null,
            donors: [],
            requests: [],
          });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error || 'Logout failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      /* 🗑️ DELETE ACCOUNT
       * Permanently removes the patient's account and all their data.
       */
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(
            '/patient/patient-delete-ourself'
          );

          performFullCleanup();

          set({
            user: null,
            PatientCaught: null,
            donors: [],
            requests: [],
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

      /* 📊 GET DASHBOARD NUMBERS
       * Gets the quick numbers for the patient's main screen.
       */
      fetchStats: async () => {
        if (get().fetchingStats) return;
        try {
          set({ fetchingStats: true });
          const res = await apiWrapper.get('/patient/get-stats');
          const data = res.data;
          set({
            totalDonors: data.totalDonors || 0,
            pendingMyRequests: data.pendingMyRequests || 0,
            totalDonationsReceived: data.totalDonationsReceived || 0,
            fetchingStats: false,
          });
        } catch (err) {
          set({ fetchingStats: false, error: err.response?.data?.error });
        }
      },

      /* ✏️ EDIT PROFILE
       * Updates the patient's personal information like name or hospital info.
       */
      updateProfile: async (formData) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put(
            '/patient/patient-update-profile',
            formData
          );
          set({
            user: res.data.user,
            PatientCaught: res.data.user,
            loading: false,
          });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error, loading: false });
          return false;
        }
      },

      /* 👤 GET PROFILE
       * Gets the details of the patient who is currently logged in.
       */
      getPatient: async () => {
        if (get().fetchingPatient || get().PatientCaught) return get().PatientCaught;
        set({ fetchingPatient: true, error: null });
        try {
          const res = await apiWrapper.get('/patient/get-patient');
          set({
            user: res.data.user,
            PatientCaught: res.data.user,
            fetchingPatient: false,
          });
          return res.data.user;
        } catch (err) {
          set({ error: err.response?.data?.error, fetchingPatient: false });
          return null;
        }
      },

      /* 🔍 GET LIST OF DONORS
       * Gets a list of people who can give blood so the patient can see them.
       */
      fetchDonors: async (page = 1, limit = 10) => {
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
            '/patient/get-all-donors-for-patient',
            {
              params: query,
            }
          );

          const data = res.data;

          if (data.success) {
            set({
              donors: data.donors,
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

      /* 🩺 GET ONE DONOR
       * Gets the full details of one specific donor.
       */
      fetchDonorById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(
            `/patient/get-donor-by-id-for-patient/${id}`
          );

          if (res.data.success) {
            return {
              donor: res.data.donor,
              status: res.data.status,
            };
          } else {
            set({ error: res.data.message || 'Unknown error' });
            return null;
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch donor',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      /* 📤 SEND BLOOD REQUEST
       * Sends a message to a donor asking them to give blood.
       */
      sendBloodRequest: async (donorId, details) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            `/patient/send-blood-request-to-donor/${donorId}`,
            details
          );
          if (res.data.success) {
            set({ success: res.data.message });
            return res.data.request;
          } else {
            set({ error: res.data.message });
            return null;
          }
        } catch (err) {
          set({
            error: err.response?.data?.error || err.response?.data?.message,
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      /* ⭐ SEND A REVIEW
       * Lets the patient send feedback and a rating.
       */
      addFeedback: async (message, rating, reaction) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/patient/feedback/add', {
            message,
            rating,
            reaction,
          });
          if (res.data.success) {
            return true;
          }
          else {
            set({ error: res.data.message });
            return false;
          }
        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },


      /* 📥 GET ALL PAST REQUESTS
       * Gets a list of every blood request this patient has ever sent.
       */
      fetchRequests: async () => {
        if (get().loadingRequests) return;
        set({ loadingRequests: true, errorRequests: null });
        try {
          const res = await apiWrapper.get(
            '/patient/get-all-donor-requests-for-patient'
          );
          if (res.data.success) {
            set({ requests: res.data.requests });
          } else {
            set({
              errorRequests: res.data.message,
            });
          }
        } catch (err) {
          set({ errorRequests: err.response?.data?.error });
        } finally {
          set({ loadingRequests: false });
        }
      },

      /* ✅❌ UPDATE REQUEST STATUS
       * Changes the status of a request if needed.
       */
      updateRequestStatus: async (requestId, status) => {
        set({
          loadingRequests: true,
          errorRequests: null,
          successRequests: null,
        });
        try {
          const res = await apiWrapper.put(
            `/patient/update-donor-request-status-by-patient/${requestId}`,
            { status }
          );
          if (res.data.success) {
            const updatedRequests = get().requests.map((req) =>
              req._id === requestId ? res.data.request : req
            );
            set({
              requests: updatedRequests,
              successRequests: res.data.message,
            });
          } else {
            set({
              errorRequests: res.data.message,
            });
          }
        } catch (err) {
          set({
            errorRequests:
              err.response?.data?.error || err.response?.data?.message,
          });
        } finally {
          set({ loadingRequests: false });
        }
      },
    }),
    {
      /* 📌 WHAT TO REMEMBER
       * This part tells the browser to keep remembering the patient's ID 
       * and name even if they close the window.
       */
      name: 'patient-auth-storage',
      partialize: (state) => ({
        user: state?.user
          ? {
            _id: state?.user?._id || null,
            fullName: state?.user?.fullName || null,
            role: state?.user?.role || null,
          }
          : null,
      }),
      getStorage: () => localStorage,
    }
  )
);