/**
 * Configuration for Hospitable MCP Server
 */

const config = {
  // Hospitable API Configuration
  hospitable: {
    apiKey: process.env.HOSPITABLE_API_KEY,
    baseUrl: process.env.HOSPITABLE_API_URL || 'https://api.hospitable.com/v1',
    rateLimitDelay: 100, // milliseconds between requests
    timeout: 30000 // 30 seconds
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },

  // Sync Configuration
  sync: {
    enabled: process.env.HOSPITABLE_SYNC_ENABLED === 'true',
    batchSize: 10, // number of properties to sync in parallel
    retryAttempts: 3,
    retryDelay: 1000 // milliseconds
  },

  // MCP Server Configuration
  server: {
    name: 'hospitable-mcp-server',
    version: '1.0.0',
    description: 'MCP server for Hospitable API integration with Supabase',
    port: process.env.MCP_PORT || 3001
  }
};

// Validation
const validateConfig = () => {
  const errors = [];

  if (!config.hospitable.apiKey) {
    errors.push('HOSPITABLE_API_KEY is required');
  }

  if (!config.supabase.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  if (!config.supabase.key) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }
};

module.exports = {
  config,
  validateConfig
};
