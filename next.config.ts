import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Разрешаем изображения из локальной папки uploads
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true,
  },
  // Увеличиваем лимит для API
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  // Для деплоя на Render
  output: 'standalone',
};

export default nextConfig;
