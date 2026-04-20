import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // ✅ نشوف كل الأخطاء ونحلها
  },
  reactStrictMode: false,
};

export default nextConfig;
