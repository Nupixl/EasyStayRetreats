import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure the base path and asset prefix to reflect the mount path of your environment
  // For example, if your app is mounted at /app, set basePath and assetPrefix to '/app'
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/app',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/app',
  
  // Additional Next.js configuration options
  output: 'standalone',
  reactStrictMode: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components'],
  },
};

export default nextConfig;
