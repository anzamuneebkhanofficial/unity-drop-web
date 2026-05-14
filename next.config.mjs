/** @type {import('next').NextConfig} */
const nextConfig = {
    // PPR is disabled as it requires Next.js Canary version.
    // Using stable Next.js 15 features for maximum reliability.
    reactStrictMode: true,
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://unity-drop-api.onrender.com/api/:path*',
          },
        ];
    },
};

export default nextConfig;
