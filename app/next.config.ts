import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95, 100],
  },
  webpack: (config, { dev }) => {
    // Evita "PackFileCacheStrategy / Array buffer allocation failed" en PCs con poca RAM
    // o caché .next corrupta al usar `next dev --webpack`.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
