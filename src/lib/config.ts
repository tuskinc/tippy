/**
 * Centralized configuration management with environment variable validation
 * This ensures all sensitive configuration is properly handled and validated
 */

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  mapbox: {
    token: string;
  };
  googleAI: {
    apiKey: string;
    model: string;
    visionModel: string;
  };
  openai: {
    apiKey: string;
  };
}

// Validate and get environment variables
function getRequiredEnvVar(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return import.meta.env[name] || defaultValue;
}

// Export configuration object
export const config: AppConfig = {
  supabase: {
    url: getRequiredEnvVar('VITE_SUPABASE_URL'),
    anonKey: getRequiredEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  mapbox: {
    token: getOptionalEnvVar('VITE_MAPBOX_TOKEN'),
  },
  googleAI: {
    apiKey: getOptionalEnvVar('VITE_GOOGLE_AI_API_KEY'),
    model: getOptionalEnvVar('VITE_GOOGLE_AI_MODEL', 'gemini-pro'),
    visionModel: getOptionalEnvVar('VITE_GOOGLE_AI_VISION_MODEL', 'gemini-pro-vision'),
  },
  openai: {
    apiKey: getOptionalEnvVar('VITE_OPENAI_API_KEY'),
  },
};

// Validation function to check if all required config is present
export function validateConfig(): void {
  try {
    // This will throw an error if any required config is missing
    const _ = config;
    console.log('✅ Configuration validated successfully');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    throw error;
  }
}

// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Check if we're in production mode
export const isProduction = import.meta.env.PROD; 