const config = {
  default: {
    adapter: {
      name: "@opennextjs/adapter-cloudflare",
      options: {
        wranglerConfig: "./wrangler.toml"
      }
    }
  }
};

export default config;
