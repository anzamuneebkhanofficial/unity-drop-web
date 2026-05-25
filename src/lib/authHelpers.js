import Cookies from 'js-cookie';
const clearBrowserAuth = () => {
  Cookies.remove('role');
  Cookies.remove('accessToken');
  Cookies.remove('is_auth');
  localStorage.clear();
};
export const performFullCleanup = () => {
  clearBrowserAuth();
};
