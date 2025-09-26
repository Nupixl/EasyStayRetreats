import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Values injected by Webflow Cloud at build/deploy time.
const cloudMountPath = process.env.CLOUD_MOUNT_PATH?.trim();
const normalizedBasePath =
  cloudMountPath && cloudMountPath !== "/" ? cloudMountPath : undefined;

const cosmicDeployUrl = process.env.COSMIC_DEPLOY_URL?.trim();
const assetPrefix =
  cosmicDeployUrl && normalizedBasePath
    ? `${cosmicDeployUrl}${normalizedBasePath}`
    : undefined;

const nextConfig: NextConfig = {
  basePath: normalizedBasePath,
  assetPrefix,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: normalizedBasePath ?? "",
    NEXT_PUBLIC_ASSET_PREFIX: assetPrefix ?? "",
  },
  images: {
    domains: ["a0.muscache.com"],
    loader: "custom",
    loaderFile: "./webflow-loader.js",
  },
  eslint: {
    // Legacy codebase has outstanding lint issues; skip blocking the CI build.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const rewrites = [
      {
        source: normalizedBasePath ? "/" : "/pixl",
        destination: "/api/pixl",
      },
    ];

    if (normalizedBasePath) {
      rewrites.push({ source: "/pixl", destination: "/api/pixl" });
    }

    return rewrites;
  },
};

if (
  process.env.NODE_ENV === "development" &&
  process.env.WEBFLOW_USE_CLOUDFLARE_DEV === "true"
) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
