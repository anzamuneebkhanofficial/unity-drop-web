/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import { performFullCleanup } from '@/lib/authHelpers';
export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      AdminCaught: null,
      loading: false,
      tableLoading: false,
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
      fetchingAdmin: false,
      fetchingStats: false,
      resetMessages: () => set({ error: null, success: null }),
      getAdminStatus: async () => {
        try {
          const res = await apiWrapper.get('/admin/status');
          return res.data;
        } catch {
          return { success: false, limitReached: true };
        }
      },
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
            return data.data;
          }
          else {
            set({ error: data.message });
            return null;
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || err.response?.data?.error || 'Registration failed',
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
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
          const res = await apiWrapper.post('/admin/admin-login', {
            email,
            password,
            captchaToken,
          }, { showToast: false });
          const data = res.data;
          if (data.status === true && data.user) {
            Cookies.set('role', data.user.role, { expires: 1 });
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Login failed' });
          return null;
        } finally {
          set({ loading: false });
        }
      },
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
          const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to request reset link';
          set({ error: errorMessage });
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to reset password';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to change password';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('logout_success', 'Admin logged out successfully');
          }
          await apiWrapper.post(
            '/admin/admin-logout',
            {},
            { showToast: false, showErrorToast: false }
          );
        } catch (err) {
          console.warn('Admin logout API notice:', err);
        } finally {
          performFullCleanup();
          set({
            user: null,
            AdminCaught: null,
            feedbacks: [],
            loading: false,
            error: null,
            success: null,
          });
        }

        return true;
      },
      getAdmin: async () => {
        if (get().fetchingAdmin) return null;
        set({ fetchingAdmin: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/get-admin');
          const data = res.data;
          if (data.success) {
            set({ AdminCaught: data.user, fetchingAdmin: false });
            return data.user;
          } else {
            set({ error: data.message, fetchingAdmin: false });
            return null;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error || 'Failed to get admin profile';
          set({ error: errorMessage, fetchingAdmin: false });
          return null;
        }
      },
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to delete account';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to fetch donors';
          set({ error: errorMessage });
          return { donors: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ tableLoading: false });
        }
      },
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to fetch donor details';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      deleteDonorById: async (id) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(`/admin/deleteSingleDonor/${id}`);
          const data = res.data;
          if (data.success) {
            await get().fetchStats();
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error || 'Failed to delete donor';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch patients' });
          return { patients: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ tableLoading: false });
        }
      },
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to fetch patient details';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      deletePatientById: async (id) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(
            `/admin/deleteSinglePatient/${id}`
          );
          const data = res.data;
          if (data.success) {
            await get().fetchStats();
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error || 'Failed to delete patient';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
            '/admin/admin-update-profile',
            formData
          );
          const data = res.data;

          if (data.success) {
            set({
              user: data.user,
              AdminCaught: data.user,
            });
            await get().fetchStats();
            return true;
          }
          else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.response?.data?.error || 'Failed to update profile';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
            err.response?.data?.message || err.response?.data?.error || 'Failed to fetch feedbacks';
          set({ error: errorMessage });
          return { feedbacks: [], totalFeedbacks: 0 };
        } finally {
          if (!silent) set({ loading: false });
        }
      },
      getAllAdmins: async (page = 1, limit = 10, filters = {}) => {
        if (get().loading) return { admins: [], totalPages: 0, currentPage: 1 };
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/get-all-admins', {
            params: { page, limit, ...filters },
          });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch admins' });
          return { admins: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ loading: false });
        }
      },
      deleteAdminById: async (id) => {
        set({ loading: true });
        try {
          const res = await apiWrapper.delete(`/admin/deleteSingleAdmin/${id}`);
          if (res.data.success) {
            await get().fetchStats();
            set({ success: res.data.message });
            return true;
          }
          return false;
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Delete failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
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
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Failed to fetch public feedback' });
          return [];
        } finally {
          set({ loading: false });
        }
      },
      updateAdminApproval: async (id, approvalStatus) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.patch(`/admin/admin-approval/${id}`, { approvalStatus }, { showToast: false, showErrorToast: false });
          const data = res.data;
          if (data.success) {
            set({ success: data.message });
            return true;
          } else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Action failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      updateAdminPrivileges: async (id, canDelete) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.patch(`/admin/admin-privileges/${id}`, { canDelete }, { showToast: false, showErrorToast: false });
          const data = res.data;
          if (data.success) {
            set({ success: data.message });
            return true;
          } else {
            set({ error: data.message });
            return false;
          }
        } catch (err) {
          set({ error: err.response?.data?.message || err.response?.data?.error || 'Privilege update failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      filterUsers: async (filters = {}) => {
        if (get().tableLoading) return null;
        set({ tableLoading: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/filter-users', {
            params: filters,
          });
          return res.data;
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Search failed';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ tableLoading: false });
        }
      },
    }),
    {
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
