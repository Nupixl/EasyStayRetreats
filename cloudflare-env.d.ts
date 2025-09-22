/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      GOOGLE_MAPS_API_KEY: string;
    }
  }
}

export {};
