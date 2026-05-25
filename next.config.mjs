/** @type {import('next').NextConfig} */
const nextConfig = {
    // PPR is disabled as it requires Next.js Canary version.
    // Using stable Next.js 15 features for maximum reliability.
    reactStrictMode: true,
    experimental: {
        reactCompiler: true,
    },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `${process.env.API_URL || 'https://unity-drop-api.onrender.com'}/api/:path*`,
          },
        ];
    },
};

export default nextConfig;
