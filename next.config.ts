import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Portfolio photos are served through Next's image optimizer at this quality.
    qualities: [80],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
  },
  async redirects() {
    return [
      // The previous site linked "Home" to /index.
      { source: "/index", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
