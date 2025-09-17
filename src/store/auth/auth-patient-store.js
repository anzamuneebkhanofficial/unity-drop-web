/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';

export const usePatientAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      success: null,
      warnings: [],
      totalDonors: 0,
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
      aiSuggestions: [],
      totalAISuggestions: 0,
      responses: [],

      resetMessages: () => set({ error: null, success: null }),

      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/patient/patient-login', {
            email,
            password,
            captchaToken,
          });
          const data = res.data;
          if (data?.status === 'success' && data?.user) {
            Cookies.set('role', data?.user?.role, { expires: 1 });
            // console.log('data', data);
            set({ user: data?.user, success: data?.message });
            return data?.user;
          } else {
            set({ error: data.message || data.error });
            return null;
          }
        } catch (err) {
          set({ error: err.response?.data?.error });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      register: async (formData, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/patient/patient-register',
            formData,
            captchaToken
          );
          const data = res.data;
          if (data.patient && data.message) {
            set({ success: data.message });
            return data.patient;
          } else {
            set({ error: data.message || data.error });
            return null;
          }
        } catch (err) {
          set({ error: err.response?.data?.error });
          return null;
        } finally {
          set({ loading: false });
        }
      },
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
            set({ success: data.message });
            return true;
          } else {
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
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put('/patient/patient-change-password', {
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
          await apiWrapper.post('/patient/patient-logout', {});
          Cookies.remove('role');
          Cookies.remove('accessToken');
          Cookies.remove('is_auth');
          localStorage.removeItem('patient-auth-storage');
          //localStorage.clear();
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
            '/patient/patient-password-reset-link',
            {
              email,
              captchaToken,
            }
          );
          set({ success: res.data.message });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
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
            `/patient/patient-password-reset/${id}/${token}`,
            { password, password_confirmation, captchaToken }
          );
          set({ success: res.data.message });
          return true;
        } catch (err) {
          set({ error: err?.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(
            '/patient/patient-delete-ourself'
          );
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
          const res = await apiWrapper.get('/patient/get-stats');
          set({
            totalDonors: res.data.totalDonors,
            loading: false,
          });
        } catch (err) {
          set({ loading: false, error: err.response?.data?.error });
        }
      },
      updateProfile: async (formData) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.put(
            '/patient/patient-update-profile',
            formData
          );
          set({
            success: res.data.message,
            PatientCaught: res.data.user,
          });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      getPatient: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.get('/patient/get-patient');
          set({
            user: res.data.user,
            PatientCaught: res.data.user,
          });
          return res.data.user;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      fetchDonors: async (page = 1, limit = 10) => {
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
      fetchDonorById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(
            `/patient/get-donor-by-id-for-patient/${id}`
          );
          if (res.data.success) {
            return res.data.donor;
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
      sendBloodRequest: async (donorId, message) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            `/patient/send-blood-request-to-donor/${donorId}`,
            { message }
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
            error: err.response?.data?.error,
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      fetchRequests: async () => {
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
          set({ errorRequests: err.response?.data?.error });
        } finally {
          set({ loadingRequests: false });
        }
      },
      fetchWarnings: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/patient/get-patient-warnings');
          if (res.data.success) {
            set({ warnings: res.data.warnings });
          } else {
            set({ error: res.data.message });
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
          const res = await apiWrapper.post('/patient/feedback/add', {
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
          const res = await apiWrapper.get('/patient/suggestions-ai');
          const data = res.data;

          if (data.success) {
            set({
              aiSuggestions: data.results || [],
              totalAISuggestions: data.total || 0, // 👈 added total
              success: data.message,
            });
          } else {
            set({
              aiSuggestions: [],
              totalAISuggestions: 0,
              error: data.message,
            });
          }
        } catch (err) {
          set({
            aiSuggestions: [],
            totalAISuggestions: 0,
            error: err.response?.data?.error,
          });
        } finally {
          set({ loading: false });
        }
      },
      fetchAdminDonorResponses: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(
            '/patient/get-admin-donor-responses'
          );
          if (res.data.success) {
            set({ responses: res.data.responses });
          } else {
            set({ error: res.data.message });
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
      name: 'patient-auth-storage',
      partialize: (state) => ({
        user: state?.user
          ? {
              fullName: state?.user?.fullName || null,
              role: state?.user?.role || null,
            }
          : null,
      }),
      getStorage: () => localStorage,
    }
  )
);
