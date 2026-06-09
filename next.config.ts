import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Explicitly disable source maps in production to hide original TypeScript source files in DevTools
  productionBrowserSourceMaps: false,

  // Inject secure headers for web security hardening
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Clickjacking protection: prevents embedding this site in an iframe
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents CSS/JS MIME-type sniffing vulnerability
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Secure referrer policy
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()', // Disable hardware permissions
          },
        ],
      },
    ];
  },
};

export default nextConfig;
