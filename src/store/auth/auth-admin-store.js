/** @format */
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import apiWrapper from '@/lib/apiWrapper';
import loading from '@/app/admin/dashboard/loading';
export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      AdminCaught: null,
      loading: false,
      badRequests: [],
      error: null,
      success: null,
      totalDonors: 0,
      totalPatients: 0,
      key: null,
      expiresAt: null,

      resetMessages: () => set({ error: null, success: null }),
      login: async (email, password, captchaToken) => {
        set({ loading: true, error: null, success: null });

        try {
          const res = await apiWrapper.post('/admin/admin-login', {
            email,
            password,
            captchaToken, // ✅ send captcha to backend
          });
          const data = res.data;
          // console.log('Login response:', data);

          if (data.status === 'success' && data.user) {
            Cookies.set('role', data.user.role, { expires: 1 }); // ✅ 24 hours exact

            set({
              user: data.user,
              success: data.message,
            });
            return data.user;
          } else {
            set({ error: data.message || data.error });
            return null;
          }
        } catch (err) {
          set({
            error: err.response?.data?.message,
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      generateSuperKey: async (superAdminId) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/admin/super/generate-key', {
            superAdminId,
          });
          const data = res.data;

          if (data.success) {
            set({
              key: data.key,
              expiresAt: data.expiresAt,
              success: data.message,
            });
            return { key: data.key, expiresAt: data.expiresAt };
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
      getSuperKey: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.get('/admin/super/get-key'); // make sure this route exists in backend
          const data = res.data;

          if (data.success) {
            set({ success: 'Super Key retrieved successfully' });
            return { key: data.key, expiresAt: data.expiresAt };
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
          const res = await apiWrapper.post('/admin/verify-email-for-admin', {
            email,
            otp,
            captchaToken,
          });
          const data = res.data;

          if (data.message) {
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
      register: async (formData, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/admin/register',
            formData,
            captchaToken
          );
          const data = res.data;
          if (!data.success) {
            // ❌ Validation or business rule failed
            set({ error: data.message || data.error });
            return null;
          }
          // ✅ Registration success
          set({ success: data.message });

          return data.newUser;
        } catch (err) {
          const backendError = err.response?.data?.error;
          set({ error: backendError });
          return null;
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
          // console.log('res', res);
          set({ success: res.data.message });
          return true;
        } catch (err) {
          // console.log('err', err);
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
          await apiWrapper.post('/admin/admin-logout', {});

          Cookies.remove('role');
          Cookies.remove('accessToken');
          Cookies.remove('is_auth');
          localStorage.removeItem('admin-auth-storage');
          localStorage.clear();

          set({ user: null, success: 'Logout successful' });

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
      requestResetLink: async (email, captchaToken) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post(
            '/admin/admin-password-reset-link',
            { email, captchaToken }
          );
          set({ success: res.data.message });
          return true;
        } catch (err) {
          error: err.response?.data?.error;
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
      getAdmin: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.get('/admin/get-admin');
          set({ AdminCaught: res.data.user, success: res.data.message });
          return res.data.user;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      deleteOurself: async () => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete('/admin/admin-delete-ourself');
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
      getDonors: async (page = 1, limit = 10, filters = {}) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/get-all-donors-from-admin', {
            params: { page, limit, ...filters }, // ✅ bloodGroup + location passed here
          });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return { donors: [], totalPages: 0, currentPage: 1 };
        } finally {
          set({ loading: false });
        }
      },
      getDonorById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(`/admin/getSingleDonor/${id}`);
          return res.data.donor;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return null;
        } finally {
          set({ loading: false });
        }
      },
      deleteDonorById: async (id) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.delete(`/admin/deleteSingleDonor/${id}`);
          set({ success: res.data.message });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      exportDonors: async (filters = {}, exportFormat = 'excel') => {
        set({ loading: true, error: null });
        try {
          const params = { ...filters, format: exportFormat };

          const res = await apiWrapper.get('/admin/export-donors', {
            params,
            responseType: 'blob',
          });

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

          return true;
        } catch (err) {
          // console.error(err);
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      getPatients: async (page = 1, limit = 10, filters = {}) => {
        set({ loading: true, error: null });
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
          set({ loading: false });
        }
      },
      fetchStats: async () => {
        try {
          set({ loading: true });
          const res = await apiWrapper.get('/admin/get-stats');
          set({
            totalDonors: res.data.totalDonors,
            totalPatients: res.data.totalPatients,
            loading: false,
            // success: res.data.message,
          });
        } catch (err) {
          // console.error('Error fetching stats:', err.message);
          set({ loading: false, error: err.response?.data?.error });
        }
      },
      getPatientById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get(`/admin/getSinglePatient/${id}`);
          return res.data.patient;
        } catch (err) {
          set({ error: err.response?.data?.error });
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
          set({ success: res.data.message });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      exportPatients: async (filters = {}, exportFormat = 'excel') => {
        set({ loading: true, error: null });
        try {
          const params = { ...filters, format: exportFormat };

          const res = await apiWrapper.get('/admin/export-patients', {
            params,
            responseType: 'blob',
          });

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

          return true;
        } catch (err) {
          // console.error(err);
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
            '/admin/admin-update-profile',
            formData
          );
          set({
            user: res.data.user,
            success: res.data.message,
            AdminCaught: res.data.user,
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
      fetchBadRequests: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/bad-requests');
          set({ badRequests: res.data.badRequests });
          return res.data.badRequests;
        } catch (err) {
          set({ error: err.response?.data?.error });
          return [];
        } finally {
          set({ loading: false });
        }
      },
      resolveBadRequest: async (badRequestId, action) => {
        set({ loading: true, error: null, success: null });
        try {
          const res = await apiWrapper.post('/admin/bad-requests/resolve', {
            badRequestId,
            action,
          });
          set({ success: res.data.message });

          // refresh the list after resolving
          await get().fetchBadRequests();

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
      getAllFeedbacks: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiWrapper.get('/admin/feedback/all');
          set({
            success: res.data.message,
          });
          return res.data; // contains { success, totalFeedbacks, feedbacks }
        } catch (err) {
          set({ error: err.response?.data?.error });
          return { feedbacks: [], totalFeedbacks: 0 };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user
          ? {
              fullName: state.user.fullName || '',
              role: 'admin',
            }
          : null,
      }),
      getStorage: () => localStorage,
    }
  )
);
