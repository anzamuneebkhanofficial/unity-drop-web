import Cookies from 'js-cookie';
const clearBrowserAuth = () => {
  const cookieOptions = { path: '/' };
  Cookies.remove('role');
  Cookies.remove('accessToken');
  Cookies.remove('is_auth');
  Cookies.remove('role', cookieOptions);
  Cookies.remove('accessToken', cookieOptions);
  Cookies.remove('is_auth', cookieOptions);
  localStorage.clear();
};
export const performFullCleanup = () => {
  clearBrowserAuth();
};
