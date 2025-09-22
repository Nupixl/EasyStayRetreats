/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

export default nextConfig;
