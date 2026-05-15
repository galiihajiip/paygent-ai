import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hanya izinkan external image domain jika diperlukan
  images: {
    remotePatterns: [],
  },
  // Biarkan ESLint dan TypeScript tetap aktif — fix error dengan benar
  // JANGAN set ignoreBuildErrors: true — ini bom waktu
};

/**
 * PRE-DEPLOY CHECKLIST (jalankan sebelum git push ke Vercel):
 *
 * npm run build          — pastikan 0 errors
 *
 * npm run lint           — fix semua warning
 *
 * npx tsc --noEmit       — pastikan TypeScript clean
 *
 * Set env vars di Vercel Dashboard sebelum deploy
 */
export default nextConfig;
