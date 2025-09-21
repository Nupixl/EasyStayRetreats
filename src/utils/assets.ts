/**
 * Asset URL utilities for Webflow Cloud deployment
 */

// Get the base URL for assets based on environment
export function getAssetBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or fallback
  return process.env.BASE_URL || 'https://your-site.webflow.io';
}

// Get the asset prefix for the current environment
export function getAssetPrefix(): string {
  return process.env.ASSETS_PREFIX || '/app';
}

// Construct full asset URL
export function getAssetUrl(path: string): string {
  const baseUrl = getAssetBaseUrl();
  const prefix = getAssetPrefix();
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}${prefix}/${cleanPath}`;
}

// Webflow CDN URLs (these work in both local and production)
export const WEBFLOW_CDN_BASE = 'https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48';

// Get Webflow CDN asset URL
export function getWebflowAssetUrl(filename: string): string {
  return `${WEBFLOW_CDN_BASE}/${filename}`;
}

// Common asset paths
export const ASSETS = {
  icons: {
    icon1: getWebflowAssetUrl('648b412e0dd82235960411c4_icon-1.svg'),
    icon2: getWebflowAssetUrl('648b412e0dd82235960411ae_icon-2.svg'),
    icon3: getWebflowAssetUrl('648b412e0dd82235960411d2_icon-3.svg'),
    icon4: getWebflowAssetUrl('648b412e0dd82235960411c5_icon-4.svg'),
  },
  images: {
    logo: getWebflowAssetUrl('68bb182ed1f36235b955a696_Easy%20Stay%20Retreasts%20Logo.avif'),
    hero: getWebflowAssetUrl('609dfa12a141dd6575976d82_Villa0017.avif'),
  }
} as const;
