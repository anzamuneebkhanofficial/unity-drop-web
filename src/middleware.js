/** @format */
import { NextResponse } from 'next/server';
const PUBLIC_ROUTES = [
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
const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  donor: '/donor/dashboard',
  patient: '/patient/dashboard',
};
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/') return NextResponse.next();
  const role = req.cookies.get('role')?.value;
  const token = req.cookies.get('accessToken')?.value;
  const is_auth = req.cookies.get('is_auth')?.value;
  const isAuthenticated = !!(role && token && is_auth);
  const isPublic = PUBLIC_ROUTES.some((route) =>
    route instanceof RegExp ? route.test(pathname) : route === pathname
  );
  // Public route — redirect authenticated users to their dashboard
  if (isPublic) {
    if (isAuthenticated) {
      const dashboard = ROLE_DASHBOARDS[role];
      if (dashboard && pathname !== dashboard) {
        return NextResponse.redirect(new URL(dashboard, req.url));
      }
    }
    return NextResponse.next();
  }
  // Protected route — require authentication
  if (!isAuthenticated) {
    if (pathname.startsWith('/admin')) return NextResponse.redirect(new URL('/admin/login', req.url));
    if (pathname.startsWith('/donor')) return NextResponse.redirect(new URL('/donor/login', req.url));
    if (pathname.startsWith('/patient')) return NextResponse.redirect(new URL('/patient/login', req.url));
    return NextResponse.next();
  }
  // Role-based access — redirect to own dashboard if accessing another role section
  const dashboard = ROLE_DASHBOARDS[role];
  const rolePrefix = `/${role}`;
  if (dashboard && !pathname.startsWith(rolePrefix)) {
    return NextResponse.redirect(new URL(dashboard, req.url));
  }
  return NextResponse.next();
}
export const config = {
  // Matcher middleware won't run for these at all
  matcher: [
    '/((?!api|_next/static|_next/image|icons|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|json|txt|xml|webmanifest|map)$).*)',
  ],
};