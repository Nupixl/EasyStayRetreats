/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webflow Cloud specific configuration
  basePath: '/app',
  assetPrefix: '/app',
  
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
  
  // Webflow Cloud specific optimizations
  output: 'standalone',
  
  // Image optimization for Webflow Cloud
  images: {
    unoptimized: true, // Webflow Cloud handles image optimization
  },
  
  // Trailing slash for consistent routing
  trailingSlash: true,
  
  // Bundle analyzer for optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size for Webflow Cloud's 10MB limit
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize for Webflow Cloud
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    BASE_URL: 'https://your-site.webflow.io',
    ASSETS_PREFIX: '/app',
  },
};

module.exports = nextConfig;
