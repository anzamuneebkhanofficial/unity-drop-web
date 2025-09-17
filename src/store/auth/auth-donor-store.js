/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';

export const useDonorAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      success: null,
      warnings: [],
      totalPatients: 0,
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
      aiSuggestions: [],

      resetMessages: () => set({ error: null, success: null }),
      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/donor/donor-login', {
            email,
            password,
            captchaToken,
          });
          const data = res.data;
          if (data.status === 'success' && data.user) {
            Cookies.set('role', data.user.role, { expires: 1 });
            set({ user: data.user, success: data.message });
            return data.user;
          } else {
            set({ error: data.message || data.error });
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
      register: async (formData, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/donor/donor-register',
            formData,
            captchaToken
          );
          const data = res.data;
          // console.log('data Register', data);
          if (data.donor && data.message) {
            set({ success: data.message });
            return data.donor;
          } else {
            set({ error: data.message || data.error });
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
            set({ success: data.message });
            return true;
          } else {
            set({ error: data.message || data.error });
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
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put('/donor/donor-change-password', {
            password,
            password_confirmation,
          });
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
      logout: async () => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.post('/donor/donor-logout', {});
          Cookies.remove('role');
          Cookies.remove('accessToken');
          Cookies.remove('is_auth');
          localStorage.removeItem('donor-auth-storage');
          localStorage.clear();

          set({ user: null, success: 'Logout successful' });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
          set({ success: res.data.message });
          return true;
        } catch (err) {
          // console.log('err', err);
          // console.log('err', err?.response?.data?.message);
          // console.log('err', err?.response?.data?.messagePo);
          set({
            error: err?.response?.data?.error,
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete('/donor/donor-delete-ourself');
          set({ user: null, success: res.data.message });
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
      fetchStats: async () => {
        try {
          set({ loading: true });
          const res = await apiWrapper.get('/donor/get-stats');
          set({
            totalPatients: res.data.totalPatients,
            loading: false,
            // success: res.data.message,
          });
        } catch (err) {
          set({ loading: false, error: err.response?.data?.error });
        }
      },
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put('/donor/donor-change-password', {
            password,
            password_confirmation,
          });
          set({ success: res.data.message });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      updateProfile: async (formData) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put(
            '/donor/donor-update-profile',
            formData
          );
          set({
            user: res.data.user,
            success: res.data.message,
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
      getDonor: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.get('/donor/get-donor');
          set({
            user: res.data.user,
            // success: res.data.message,
            DonorCaught: res.data.user,
          });
          return res.data.user;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      fetchPatients: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const { name, bloodGroup, location } = get().filters;

          // Build query params
          const query = {};
          if (name) query.name = name;
          if (bloodGroup) query.bloodGroup = bloodGroup;
          if (location) query.location = location;

          // Only send pagination if no filters applied
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
              // success: data.message,
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
      fetchPatientById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(
            `/donor/get-patient-by-id-for-donor/${id}`
          );
          if (res.data.success) {
            set({
              // success: res.data.message,
            });
            return res.data.patient;
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
      setFilters: (filters) => set({ filters }),
      // Fetch all patient requests
      fetchRequests: async () => {
        set({ loadingRequests: true, errorRequests: null });
        try {
          const res = await apiWrapper.get(
            '/donor/get-all-patient-requests-for-donor'
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
          if (res.data.success) {
            // Update the request locally
            const updatedRequests = get().requests.map((req) =>
              req._id === requestId ? res.data.request : req
            );
            set({
              requests: updatedRequests,
              successRequests: res.data.message,
            });
          } else {
            set({
              errorRequests: res.data.message || res.data.error,
            });
          }
        } catch (err) {
          set({ errorRequests: err.response?.data?.error });
        } finally {
          set({ loadingRequests: false });
        }
      },
      fetchWarnings: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/donor/get-donor-warnings');
          if (res.data.success) {
            set({ warnings: res.data.warnings });
          } else {
            set({ error: res.data.messaga });
          }
        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
        } finally {
          set({ loading: false });
        }
      },
      addFeedback: async (message, rating) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/donor/feedback/add', {
            message,
            rating,
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
            error: err.response?.data?.error,
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      fetchAISuggestions: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.get('/donor/suggestions-ai');
          // console.log('res', res);
          if (res.data.success) {
            set({ aiSuggestions: res.data.results, success: res.data.message });
          } else {
            set({
              error: res.data.message,
            });
          }
        } catch (err) {
          set({
            error: err.response?.data?.error,
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'donor-auth-storage',
      partialize: (state) => ({
        user: state.user
          ? {
              fullName: state.user.fullName || '',
              role: 'donor',
            }
          : null,
      }),
      getStorage: () => localStorage,
    }
  )
);
