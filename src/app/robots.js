export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/admin/register'],
      disallow: [
        '/admin/dashboard/', 
        '/donor/dashboard/', 
        '/patient/dashboard/',
        '/api/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
