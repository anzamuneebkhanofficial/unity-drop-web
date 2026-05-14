/** @format */

import Cookies from 'js-cookie';

/**
 * Clears all authentication data from the browser.
 * Used by all auth stores (admin, donor, patient) during logout and account deletion.
 */
export const clearBrowserAuth = () => {
  Cookies.remove('role');
  Cookies.remove('accessToken');
  Cookies.remove('is_auth');
  localStorage.clear();
};

/**
 * Performs full browser cleanup during logout or account deletion.
 * Clears cookies and local storage.
 */
export const performFullCleanup = () => {
  clearBrowserAuth();
};
