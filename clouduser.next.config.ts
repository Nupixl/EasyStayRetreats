/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development configuration without base path
  reactStrictMode: true,
  
  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components'],
  },
};

module.exports = nextConfig;