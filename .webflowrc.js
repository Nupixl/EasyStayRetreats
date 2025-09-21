module.exports = {
  // Authentication
  authToken: process.env.WF_AUTH_TOKEN,
  
  // Site configuration
  siteId: process.env.WF_SITE_ID || '609dfa12a141dd6e70976d48',
  
  // DevLink configuration
  devlink: {
    // Root directory for components
    rootDir: 'src/components',
    
    // Components to sync
    components: [
      'PropertyCard',
      'SearchFilters', 
      'SearchResults',
      'EnhancedSearchFilters',
      'Footer'
    ],
    
    // Pages to sync
    pages: [
      'search-properties'
    ],
    
    // Auto-sync on changes
    watch: true,
    
    // Generate TypeScript definitions
    typescript: true,
    
    // Output directory for generated files
    outputDir: 'src/components/_Builtin'
  },
  
  // Cloud configuration
  cloud: {
    // Framework type
    framework: 'nextjs',
    
    // Build configuration
    build: {
      command: 'npm run build',
      outputDirectory: '.next',
      installCommand: 'npm ci --prefer-offline --no-audit'
    },
    
    // Environment variables
    environment: {
      NODE_ENV: 'production',
      BASE_PATH: '/app',
      ASSETS_PREFIX: '/app'
    }
  },
  
  // Performance optimizations
  performance: {
    // Skip clean installs when possible
    skipCleanInstall: true,
    
    // Use npm cache
    useCache: true,
    
    // Parallel builds
    parallel: true
  }
};
