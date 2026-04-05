/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ تحسينات للأداء
  reactStrictMode: true,

  // ✅ تحسينات للصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // ✅ تحسينات للـ build
  swcMinify: true,

  // ✅ تجنب مشاكل الـ compilation
  experimental: {
    // ✅ تعطيل بعض الأمور التي قد تسبب مشاكل
    optimizePackageImports: ['lucide-react'],
  },

  // ✅ إعدادات الـ logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // ✅ إعدادات الـ headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ]
  },
}

export default nextConfig
