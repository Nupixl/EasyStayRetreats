/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webflow Cloud configuration
  basePath: process.env.BASE_PATH || '/app',
  assetPrefix: process.env.ASSETS_PREFIX || '/app',
  
  // React configuration
  reactStrictMode: true,
  
  // Skip type checking during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  
  // Webflow Cloud specific optimizations - use standalone for server-side rendering
  output: 'standalone',
  
  // Image optimization for Webflow Cloud
  images: {
    unoptimized: true, // Webflow Cloud handles image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "assets.website-files.com"
      },
      {
        protocol: "https",
        hostname: "easystayretreats.homes"
      },
      {
        protocol: "https",
        hostname: "**.supabase.co"
      }
    ]
  },
  
  // Trailing slash for consistent routing
  trailingSlash: true,
  
  // Environment-specific configuration
  env: {
    BASE_URL: process.env.BASE_URL || 'https://your-site.webflow.io',
    ASSETS_PREFIX: process.env.ASSETS_PREFIX || '/app',
  },
};

module.exports = nextConfig;
