import axios from 'axios';
import { toast } from 'sonner';
import NProgress from 'nprogress';
import { performFullCleanup } from './authHelpers';

const TOAST_DEBOUNCE_MS = 1500;
const recentToasts = new Map();

// Track concurrent active requests to prevent progress bar race conditions
let activeRequests = 0;
const startProgress = () => {
  if (activeRequests === 0) {
    NProgress.start();
  }
  activeRequests++;
};

const stopProgress = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    NProgress.done();
  }
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: starts progress without any artificial blocking or delays
apiClient.interceptors.request.use((config) => {
  startProgress();
  return config;
});

let routerRef = null;
export const setApiRouter = (router) => {
  routerRef = router;
};

const getRoleCookie = () =>
  typeof document !== 'undefined'
    ? document.cookie
        .split('; ')
        .find((row) => row.startsWith('role='))
        ?.split('=')[1]
        ?.toLowerCase()
    : null;

// Response Interceptor: handles success, cleanup, and standardized error responses
apiClient.interceptors.response.use(
  (response) => {
    stopProgress();
    const { data, config } = response;
    if (data?.message && typeof data.message === 'string' && data.message.trim()) {
      const method = config.method?.toLowerCase();
      const isMutation = ['post', 'put', 'delete', 'patch'].includes(method);
      const shouldToast = config.showToast !== false && (isMutation || config.showToast === true);

      if (shouldToast) {
        const now = Date.now();
        const lastToastTime = recentToasts.get(data.message) ?? 0;
        if (now - lastToastTime > TOAST_DEBOUNCE_MS) {
          recentToasts.set(data.message, now);
          toast.success(data.message, { id: data.message, duration: 3000 });
          setTimeout(() => recentToasts.delete(data.message), TOAST_DEBOUNCE_MS + 500);
        }
      }
    }
    return response;
  },

  (error) => {
    stopProgress();
    if (error._handled) return Promise.reject(error);
    if (axios.isCancel(error)) return Promise.reject(error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.msg ||
      'An unexpected error occurred';

    // 401 Unauthorized handling: clean state and redirect to appropriate login route
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.includes('/login') || path.includes('/register')) {
          return Promise.reject(error);
        }
        const role = getRoleCookie();
        let targetLogin = '/login';
        if (role === 'admin' || path.startsWith('/admin')) {
          targetLogin = '/admin/login';
        } else if (role === 'donor' || path.startsWith('/donor')) {
          targetLogin = '/donor/login';
        } else if (role === 'patient' || path.startsWith('/patient')) {
          targetLogin = '/patient/login';
        }
        performFullCleanup();
        const finalUrl = `${targetLogin}?msg=${encodeURIComponent('Session Expired. Please login again.')}`;
        if (routerRef) {
          routerRef.push(finalUrl);
        } else {
          window.location.href = finalUrl;
        }
      }
      return Promise.reject(error);
    }

    const isMutation = error.config?.method?.toLowerCase() !== 'get';
    const shouldToast =
      error.config?.showErrorToast !== false &&
      error.config?.showToast !== false &&
      (isMutation || error.config?.showToast === true);

    if (shouldToast && message !== 'Unauthorized') {
      if (!message.toLowerCase().includes('pending')) {
        toast.error(message, { id: message });
      }
    }

    return Promise.reject(error);
  }
);

const apiWrapper = {
  get: (url, config = {}) => {
    config.params = { ...config.params, _t: Date.now() };
    return apiClient.get(url, config);
  },
  post: (url, body, config = {}) => apiClient.post(url, body, config),
  put: (url, body, config = {}) => apiClient.put(url, body, config),
  patch: (url, body, config = {}) => apiClient.patch(url, body, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiWrapper;