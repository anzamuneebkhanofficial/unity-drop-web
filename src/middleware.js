/** @format */
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('accessToken')?.value;
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

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
  // Default dashboards
  // ---------------------
  const defaultRoutes = {
    admin: '/admin/dashboard',
    donor: '/donor/dashboard',
    patient: '/patient/dashboard',
  };

  // ---------------------
  // Role route patterns
  // ---------------------
  const donorRoutes = ['/donor/dashboard'];
  const patientRoutes = ['/patient/dashboard'];

  // ---------------------
  // 1) Always allow home
  // ---------------------
  if (pathname === '/') return NextResponse.next();

  // ---------------------
  // 2) Public routes
  // ---------------------
  if (isPublic) {
    if (role && token) {
      const dashboard = defaultRoutes[role];
      if (dashboard && pathname !== dashboard) {
        return NextResponse.redirect(new URL(dashboard, req.url));
      }
    }
    return NextResponse.next();
  }

  // ---------------------
  // 3) Protected route check
  // ---------------------
  if (!role || !token) {
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
  if (role === 'admin') return NextResponse.next();

  if (role === 'donor') {
    const isAllowed = donorRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    );
    if (isAllowed) return NextResponse.next();
    if (pathname !== defaultRoutes.donor) {
      return NextResponse.redirect(new URL(defaultRoutes.donor, req.url));
    }
  }

  if (role === 'patient') {
    const isAllowed = patientRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    );
    if (isAllowed) return NextResponse.next();
    if (pathname !== defaultRoutes.patient) {
      return NextResponse.redirect(new URL(defaultRoutes.patient, req.url));
    }
  }

  // ---------------------
  // 5) Unknown role fallback
  // ---------------------
  return NextResponse.redirect(new URL('/donor/login', req.url));
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
