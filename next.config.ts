import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
    proxyClientMaxBodySize: 30 * 1024 * 1024,
    // Reuse previously rendered page segments on client navigations for 5 minutes.
    // Keeps home UI instant when returning from /posts/* without changing server ISR.
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Notion S3 이미지
      },
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: '**.notion-static.com',
      },
      {
        protocol: 'https',
        hostname: '**.notionusercontent.com',
      },
    ],
  },
};

export default nextConfig;
