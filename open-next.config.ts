import type { NextConfig } from "next";

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Webflow Cloud specific configuration
  experimental: {
    // Enable experimental features for Webflow Cloud
    serverComponentsExternalPackages: [],
  },
});
