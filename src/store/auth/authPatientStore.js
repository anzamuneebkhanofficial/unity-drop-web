/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import { performFullCleanup } from '@/lib/authHelpers';
export const usePatientAuthStore = create(
  persist(
    (set, get) => ({
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
      totalResults: 0,
      requests: [],
      fetchingPatient: false,
      fetchingStats: false,
      loading: false,
      error: null,
      success: null,
      loadingRequests: false,
      errorRequests: null,
      successRequests: null,
      resetMessages: () => set({ error: null, success: null }),
      setFilters: (filters) => set({ filters }),
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Registration failed' });
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
            return true;
          }
          else {
            set({ error: data.message || data.error });
            return false;
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Verification failed';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/patient/patient-login', {
            email,
            password,
            captchaToken,
          }, { showToast: false });
          const data = res.data;
          if (data?.status === true && data?.user) {
            Cookies.set('role', data?.user?.role, { expires: 1 });
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
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Login failed',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      requestResetLink: async (email, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.post(
            '/patient/patient-password-reset-link',
            {
              email,
              captchaToken,
            }
          );
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to request reset link' });
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
          await apiWrapper.post(
            `/patient/patient-password-reset/${id}/${token}`,
            { password, password_confirmation, captchaToken }
          );
          return true;

        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to reset password' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.put('/patient/patient-change-password', {
            password,
            password_confirmation,
          });
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to change password',
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('logout_success', 'Patient logged out successfully');
          }
          await apiWrapper.post(
            '/patient/patient-logout',
            {},
            { showToast: false, showErrorToast: false }
          );
        } catch (err) {
          console.warn('Patient logout API notice:', err);
        } finally {
          performFullCleanup();
          set({
            user: null,
            PatientCaught: null,
            donors: [],
            requests: [],
            loading: false,
            error: null,
            success: null,
          });
        }

        return true;
      },
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.delete(
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
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to delete account',
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
          set({ fetchingStats: false, error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch stats' });
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
            user: res.data.user,
            PatientCaught: res.data.user,
            loading: false,
          });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to update profile', loading: false });
          return false;
        }
      },
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to get patient profile', fetchingPatient: false });
          return null;
        }
      },
      fetchDonors: async (page = 1, limit = 10) => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const { name, bloodGroup, location } = get().filters;
          const query = { page, limit };
          if (name) query.name = name;
          if (bloodGroup) query.bloodGroup = bloodGroup;
          if (location) query.location = location;
          const res = await apiWrapper.get(
            '/patient/filter-donors',
            {
              params: query,
            }
          );
          const data = res.data;
          if (data.success) {
            set({
              donors: data.donors || [],
              totalPages: data.pagination?.totalPages || data.totalPages || 0,
              currentPage: data.pagination?.currentPage || data.currentPage || 1,
              totalResults: data.pagination?.totalResults || data.totalDocs || 0,
            });
          } else {
            set({ error: data.message });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch donors',
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
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch donor details',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
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
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to send blood request',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
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
            error: err.response?.data?.message || err.response?.data?.error || 'Something went wrong',
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
          set({ errorRequests: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch requests' });
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
          set({
            errorRequests:
              err.response?.data?.message || err.response?.data?.error || 'Failed to update request status',
          });
        } finally {
          set({ loadingRequests: false });
        }
      },
    }),
    {
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
