/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ تعطيل ESLint أثناء البناء
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ تجاهل أخطاء TypeScript أثناء البناء
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,

  // ✅ تحسينات للصور
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // ✅ السماح للـ Preview بالعمل
  allowedDevOrigins: [
    '*.space.z.ai',
    'preview-chat-*.space.z.ai',
  ],

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
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
        ],
      },
    ]
  },
}

export default nextConfig
