/** @format */
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('accessToken')?.value;
  const auth = req.cookies.get('is_auth')?.value;
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

  // console.log('Middleware → Path:', pathname);
  // console.log(
  //   'auth:',
  //   auth,
  //   'token:',
  //   token ? 'yes' : 'no',
  //   'role:',
  //   role || 'none'
  // );

  // ---------------------
  // Public routes
  // ---------------------
  const publicRoutes = [
    '/admin/login',
    '/admin/email-verify',
    '/admin/register',
    '/admin/forgot-password',
    /^\/admin\/reset-password\/[^/]+\/[^/]+$/,
    '/donor/register',
    '/donor/email-verify',
    '/donor/login',
    '/donor/forgot-password',
    /^\/donor\/reset-password\/[^/]+\/[^/]+$/,
    '/patient/register',
    '/patient/email-verify',
    '/patient/login',
    '/patient/forgot-password',
    /^\/patient\/reset-password\/[^/]+\/[^/]+$/,
  ];

  const isPublic = publicRoutes.some((route) =>
    route instanceof RegExp ? route.test(pathname) : route === pathname
  );

  // ---------------------
  // Allowed routes per role
  // ---------------------
  const donorRoutes = ['/donor/dashboard'];

  const patientRoutes = [
    '/patient/dashboard',
    '/patient/dashboard/profile',
    '/patient/dashboard/profile/update',
    '/patient/dashboard/change-password',
    '/patient/dashboard/feedback',
    '/patient/dashboard/donors',
    '/patient/dashboard/responses',
  ];

  const defaultRoutes = {
    admin: '/admin/dashboard',
    donor: '/donor/dashboard',
    patient: '/patient/dashboard',
  };

  // ---------------------
  // 1) Allow public routes
  // ---------------------
  if (isPublic) {
    if (role) {
      // Logged-in user trying to access public route → redirect to their dashboard
      return NextResponse.redirect(
        new URL(defaultRoutes[role] || '/', req.url)
      );
    }
    return NextResponse.next();
  }

  // ---------------------
  // 2) Always allow home "/"
  // ---------------------
  if (pathname === '/') {
    return NextResponse.next();
  }

  // ---------------------
  // 3) Protected route check
  // ---------------------
  if (!role || !token) {
    // If not logged in, redirect to proper login page
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    } else if (pathname.startsWith('/donor')) {
      return NextResponse.redirect(new URL('/donor/login', req.url));
    } else {
      return NextResponse.redirect(new URL('/patient/login', req.url));
    }
  }

  // ---------------------
  // 4) Role-based access
  // ---------------------
  if (role === 'admin') {
    return NextResponse.next();
  }

  if (role === 'donor') {
    const isAllowed = donorRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
      // (route) => pathname === route
    );
    if (isAllowed) return NextResponse.next();
    return NextResponse.redirect(new URL(defaultRoutes.donor, req.url));
  }

  if (role === 'patient') {
    const isAllowed = patientRoutes.some((route) => pathname === route);
    if (isAllowed) return NextResponse.next();
    return NextResponse.redirect(new URL(defaultRoutes.patient, req.url));
  }

  // ---------------------
  // 5) Unknown role fallback
  // ---------------------
  return NextResponse.redirect(new URL('/donor/login', req.url));
}

// ---------------------
// Apply middleware to all routes except Next.js internals
// ---------------------
export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
