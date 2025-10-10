const cloudMountPath = process.env.CLOUD_MOUNT_PATH?.trim();
const normalizedBasePath =
  cloudMountPath && cloudMountPath !== "/" ? cloudMountPath : undefined;

const cosmicDeployUrl = process.env.COSMIC_DEPLOY_URL?.trim();
const assetPrefix =
  cosmicDeployUrl && normalizedBasePath
    ? `${cosmicDeployUrl}${normalizedBasePath}`
    : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    return [
      {
        source: "/pixl",
        destination: "/api/pixl",
      },
    ];
  },
};

if (
  process.env.NODE_ENV === "development" &&
  process.env.WEBFLOW_USE_CLOUDFLARE_DEV === "true"
) {
  // Defer the ESM-only import to keep this config in CommonJS.
  (async () => {
    const { initOpenNextCloudflareForDev } = await import(
      "@opennextjs/cloudflare"
    );
    initOpenNextCloudflareForDev();
  })().catch((error) => {
    console.warn(
      "Failed to enable OpenNext Cloudflare dev integration:",
      error
    );
  });
}

module.exports = nextConfig;
