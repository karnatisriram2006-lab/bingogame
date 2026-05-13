import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* ── TypeScript / ESLint ── */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* ── Images ── */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Serve optimised images with proper cache headers
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /* ── Compression ── */
  compress: true,

  /* ── Powered-by header (security + performance) ── */
  poweredByHeader: false,

  /* ── HTTP headers ── */
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Long-term cache for Next.js static assets (hashed filenames)
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Static files (images, fonts, manifests, icons)
        source: '/(.*)\\.(png|jpg|jpeg|webp|avif|gif|svg|ico|woff|woff2|ttf|otf|json|txt|xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  /* ── Redirects ── */
  async redirects() {
    return [
      // Redirect www to non-www (canonical domain)
      // Uncomment when you have a custom domain:
      // {
      //   source: '/(.*)',
      //   has: [{ type: 'host', value: 'www.bingogameguys.com' }],
      //   destination: 'https://bingogameguys.com/:path*',
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
