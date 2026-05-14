/** @format */
import { NextResponse } from 'next/server';

export function middleware(req) {
  const role = req.cookies.get('role')?.value;
  const token = req.cookies.get('accessToken')?.value;
  const is_auth = req.cookies.get('is_auth')?.value;
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
    '/public-feedback',
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

  // ---------------------
  // 1) Truly Public Routes (No Auth/Redirect Logic)
  // ---------------------
  const trulyPublic = ['/'];
  if (trulyPublic.includes(pathname)) return NextResponse.next();

  // ---------------------
  // 2) Public routes
  // ---------------------
  if (isPublic) {
    if (role || is_auth || token) {
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
  if (!role || !is_auth || !token) {
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
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(defaultRoutes.admin, req.url));
  }

  if (role === 'donor') {
    if (pathname.startsWith('/donor')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(defaultRoutes.donor, req.url));
  }

  if (role === 'patient') {
    if (pathname.startsWith('/patient')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(defaultRoutes.patient, req.url));
  }

  // ---------------------
  // 5) Unknown role fallback
  // ---------------------
  return NextResponse.redirect(new URL('/donor/login', req.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};
