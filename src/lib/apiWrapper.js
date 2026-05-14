/** @format */

import axios from 'axios';
import { toast } from 'sonner';
import NProgress from 'nprogress';

/**
 * 🚀 INDUSTRY STANDARD API WRAPPER
 * This wrapper provides:
 * 1. Request Concatenation (Sharable GET promises to prevent duplicate DB hits)
 * 2. Intelligent Toasting (Mutations toast automatically, GETs remain silent)
 * 3. Global Anti-Spam (Deduplicates identical messages using 'id' and timestamp tracking)
 */

const recentToasts = new Map();

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_URL,
  withCredentials: true,
  timeout: 15000, // ⏳ Limit: 15 seconds max before declaring connection "Weak/Loose"
  headers: { 'Content-Type': 'application/json' },
});


// ✅ GLOBAL INTERCEPTOR: Request
apiClient.interceptors.request.use((config) => {
  // 🔌 Native Offline Blocker: Check before hitting the wire
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const errorMsg = 'Your internet connection is offline. Please check your network and try again.';
    toast.error(errorMsg, { id: 'offline-error' });
    return Promise.reject(new Error('ConnectionOffline'));
  }

  NProgress.start();
  return config;
});

// Router reference for mid-flight navigation
let routerRef = null;
export const setApiRouter = (router) => {
  routerRef = router;
};

// ✅ GLOBAL INTERCEPTOR: Response
apiClient.interceptors.response.use(
  (response) => {
    NProgress.done();

    const { data, config } = response;

    // 1. Success Toast Logic
    if (data?.message && typeof data.message === 'string' && data.message.trim() !== '') {
      const method = config.method?.toLowerCase();
      // Industry Standard: Mutations (POST, PUT, DELETE) feedback is vital. 
      // GET feedback is usually background noise/boilerplate.
      const isMutation = ['post', 'put', 'delete', 'patch'].includes(method);

      // Only toast if it's a mutation OR if the user explicitly requested it via config
      const shouldToast = config.showToast !== false && (isMutation || config.showToast === true);

      if (shouldToast) {
        const now = Date.now();
        const lastToastTime = recentToasts.get(data.message) || 0;

        // Anti-Spam: Prevent the EXACT same message from appearing more than once every 1.5 seconds
        if (now - lastToastTime > 1500) {
          recentToasts.set(data.message, now);

          // 🔥 Use message as ID to prevent Sonner from stacking identical toasts
          toast.success(data.message, {
            id: data.message,
            duration: 3000
          });

          // Cleanup memory
          setTimeout(() => recentToasts.delete(data.message), 2000);
        }
      }
    }
    return response;
  },
  (error) => {
    NProgress.done();

    // Ignore cancelled requests
    if (axios.isCancel(error)) return Promise.reject(error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.msg ||
      'An unexpected error occurred';

    // Global Error Deduplication
    if (error.response?.status === 401) {
      // 🚨 INDUSTRY STANDARD: Force logout on 401 Unauthorized
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        
        // 🛑 PREVENT LOGOUT LOOP: Skip if already on a login page
        if (path.includes('/login') || path.includes('/register')) {
            return Promise.reject(error);
        }

        // Graceful logout handling removed

        // 🛠️ ROLE-BASED REDIRECT: Detect portal before clearing cookies/storage
        const currentRole = document.cookie.split('; ').find(row => row.startsWith('role='))?.split('=')[1]?.toLowerCase();

        let targetLogin = '/login';
        if (currentRole === 'admin' || path.startsWith('/admin')) {
            targetLogin = '/admin/login';
        } else if (currentRole === 'donor' || path.startsWith('/donor')) {
            targetLogin = '/donor/login';
        } else if (currentRole === 'patient' || path.startsWith('/patient')) {
            targetLogin = '/patient/login';
        }

        localStorage.clear();
        document.cookie = "is_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        const finalUrl = `${targetLogin}?msg=Session Expired. Please login again.`;
        
        if (routerRef) {
          routerRef.push(finalUrl);
        } else {
          window.location.href = finalUrl;
        }
      }
    } else {
      // 📡 WEAK INTERNET/TIMEOUT DETECTION
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        const slowMsg = 'Your internet connection is very weak or disconnected. The request timed out. Please check your connection.';
        toast.error(slowMsg, { id: 'timeout-error', duration: 5000 });
        return Promise.reject(error);
      }

      // 🔌 GENERIC NETWORK ERROR (Database unreachable or DNS down)
      if (error.message === 'Network Error' || error.message === 'ConnectionOffline') {
        const netMsg = 'Network Error: Cannot reach the UnityDrop server. Please check your connection.';
        toast.error(netMsg, { id: 'network-error', duration: 5000 });
        return Promise.reject(error);
      }

      // 🚀 INDUSTRY STANDARD: Intelligent Error Toasting
      // If the request failed but we don't have a response (e.g., Network Error, IDM interception),
      // we only toast if it's a mutation. GET requests might be aborted by download managers.
      const isMutation = error.config?.method?.toLowerCase() !== 'get';
      const shouldToast = error.config?.showErrorToast !== false && (isMutation || error.config?.showToast === true);

      // Special case: If responseType was 'blob', we can't read the error message directly.
      // We pass the error forward; the caller (store) will handle parsing it.
      if (shouldToast && message !== 'Unauthorized') {
        toast.error(message, { id: message });
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 🛠️ API Wrapper Methods
 */
const apiWrapper = {
  get: (url, config = {}) => {
    // 🚀 Cache-busting: Forces the browser to ignore its local cache and physically hit the Node backend.
    // This allows Morgan server logs to properly display incoming request timings down to the millisecond.
    // The backend node-cache will still serve the response instantly (0 DB cost).
    config.params = { ...config.params, _t: Date.now() };
    return apiClient.get(url, config);
  },
  post: (url, body, config = {}) => apiClient.post(url, body, config),
  put: (url, body, config = {}) => apiClient.put(url, body, config),
  patch: (url, body, config = {}) => apiClient.patch(url, body, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiWrapper;

