/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_PATH?: string;
      ASSETS_PREFIX?: string;
      BASE_URL?: string;
    }
  }
}

export {};
