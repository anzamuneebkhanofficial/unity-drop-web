/** @format */

import axios from 'axios';
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
const apiWrapper = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, body, config = {}) => apiClient.post(url, body, config),
  put: (url, body, config = {}) => apiClient.put(url, body, config),
  patch: (url, body, config = {}) => apiClient.patch(url, body, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};
export default apiWrapper;
