export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Base routes that any public user or crawler can access
  const routes = [
    '',
    '/admin/register', // Important public-facing routes
    // Add other public routes if they exist, like /about, /contact, etc.
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Note: We do not include protected dashboard routes (e.g., /admin/dashboard, /donor/dashboard)
  // in the sitemap because they require authentication and should not be indexed by Google.

  return routes;
}
