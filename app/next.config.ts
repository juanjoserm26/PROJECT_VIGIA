import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95, 100],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Menos picos de RAM al compilar la home (muchas secciones + webpack en Windows).
      config.parallelism = 1;
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
