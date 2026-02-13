// Environment Configuration
// This file centralizes all environment variables and configuration settings

// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL || window.location.origin,
  ANTI_STOCK_API_BASE: import.meta.env.VITE_ANTISTOCK_API_BASE || 'https://api.antistock.io',
  
  // API Keys and Secrets
  ANTI_STOCK_API_KEY: import.meta.env.VITE_ANTISTOCK_API_KEY || '',
  ANTI_STOCK_SHOP_ID: import.meta.env.VITE_ANTISTOCK_SHOP_ID || '',
  
  // Timeout settings
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000', 10),
  
  // Retry settings
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRIES || '3', 10),
};

// Application Configuration
export const APP_CONFIG = {
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.MODE === 'development',
  IS_PROD: import.meta.env.MODE === 'production',
  
  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  
  // Application settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CheatVault Launcher',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// Third-party service configurations
export const SERVICE_CONFIG = {
  // Analytics
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  
  // CDN and asset settings
  CDN_BASE_URL: import.meta.env.VITE_CDN_BASE_URL || '',
  
  // WebSocket settings
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || '',
};

// Validation functions
export const validateConfig = () => {
  const errors: string[] = [];
  
  // Validate required Antistock configuration
  if (!API_CONFIG.ANTI_STOCK_API_KEY) {
    errors.push('VITE_ANTISTOCK_API_KEY is required');
  }
  
  if (!API_CONFIG.ANTI_STOCK_SHOP_ID) {
    errors.push('VITE_ANTISTOCK_SHOP_ID is required');
  }
  
  if (errors.length > 0) {
    // This app can still render without optional integrations configured.
    // Keep the error visible in the console, but don't crash production builds
    // unless explicitly requested.
    console.warn('Configuration validation warnings:', errors);

    const strict =
      (import.meta.env.VITE_STRICT_CONFIG || '').toLowerCase() === 'true' ||
      (import.meta.env.VITE_STRICT_CONFIG || '').toLowerCase() === '1';

    if (strict) {
      throw new Error(`Invalid configuration: ${errors.join(', ')}`);
    }
  }
  
  return errors.length === 0;
};

// Initialize configuration validation
if (typeof window !== 'undefined') {
  validateConfig();
}

export default {
  API_CONFIG,
  APP_CONFIG,
  SERVICE_CONFIG,
  validateConfig,
};
