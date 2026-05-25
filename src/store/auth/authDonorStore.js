/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import { performFullCleanup } from '@/lib/authHelpers';
export const useDonorAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      success: null,
      totalPatients: 0,
      pendingRequests: 0,
      totalApproved: 0,
      totalRejected: 0,
      totalRequests: 0,
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Registration failed' });
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
            return true;
          }
          else {
            set({ error: data.message });
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
          const res = await apiWrapper.post('/donor/donor-login', {
            email,
            password,
            captchaToken,
          }, { showToast: false });
          const data = res.data;
          if (data.status) {
            Cookies.set('role', data.user.role, { expires: 1 });
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('login_success', data.message || 'Donor logged in successfully');
            }
            set({
              user: data.user,
              DonorCaught: data.user,
              requests: [],
              patients: [],
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
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to request reset link',
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
          await apiWrapper.post(
            `/donor/donor-password-reset/${id}/${token}`,
            { password, password_confirmation, captchaToken }
          );
          return true;
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to reset password',
          });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      changePassword: async (password, password_confirmation) => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.put('/donor/donor-change-password', {
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
        performFullCleanup();
        set({
          user: null,
          DonorCaught: null,
          requests: [],
          patients: [],
          loading: false,
          error: null,
          success: null,
        });
        apiWrapper.post('/donor/donor-logout', {}).catch((err) => {
          console.warn('Asynchronous donor logout API call failed:', err);
        });

        return true;
      },
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to get donor profile', fetchingDonor: false });
          return null;
        }
      },
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          await apiWrapper.delete('/donor/donor-delete-ourself');
          performFullCleanup();
          set({ user: null, DonorCaught: null, requests: [], patients: [] });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to delete account' });
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
            DonorCaught: res.data.user,
          });
          return true;

        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to update profile' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      fetchPatients: async (page = 1, limit = 10) => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const { name, bloodGroup, location } = get().filters;
          const query = { page, limit };
          if (name) query.name = name;
          if (bloodGroup) query.bloodGroup = bloodGroup;
          if (location) query.location = location;
          const res = await apiWrapper.get(
            '/donor/filter-all-patients',
            {
              params: query,
            }
          );
          const data = res.data;
          if (data.success) {
            set({
              patients: data.patients || [],
              totalPages: data.pagination?.totalPages || data.totalPages || 0,
              currentPage: data.pagination?.currentPage || data.currentPage || 1,
            });
          } else {
            set({ error: data.message });
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch patients',
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
            return {
              patient: res.data.patient,
              status: res.data.status
            };
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch patient details',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
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
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Something went wrong while fetching requests.',
          });
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
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Something went wrong while updating status.',
          });
        } finally {
          set({ loadingRequests: false });
        }
      },
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
            error: err.response?.data?.message || err.response?.data?.error || 'Something went wrong',
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
          const res = await apiWrapper.get('/donor/get-stats');
          const data = res.data;
          set({
            totalPatients: data.totalPatients || 0,
            pendingRequests: data.pendingRequests || 0,
            totalApproved: data.totalApproved || 0,
            totalRejected: data.totalRejected || 0,
            totalRequests: data.totalRequests || 0,
            fetchingStats: false,
          });
        } catch (err) {
          set({ fetchingStats: false, error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch stats' });
        }
      },

    }),
    {
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