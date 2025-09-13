/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development configuration without base path
  reactStrictMode: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components'],
  },
};

module.exports = nextConfig;
