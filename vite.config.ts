import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Validate required environment variables
  const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !env[varName]);
  
  if (missingVars.length > 0 && mode === 'production') {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'import.meta.env.VITE_GOOGLE_AI_API_KEY': JSON.stringify(env.VITE_GOOGLE_AI_API_KEY || ''),
      'import.meta.env.VITE_GOOGLE_AI_MODEL': JSON.stringify(env.VITE_GOOGLE_AI_MODEL || 'gemini-pro'),
      'import.meta.env.VITE_GOOGLE_AI_VISION_MODEL': JSON.stringify(env.VITE_GOOGLE_AI_VISION_MODEL || 'gemini-pro-vision'),
      'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(env.VITE_MAPBOX_TOKEN || ''),
      'import.meta.env.VITE_DEMO_MODE': JSON.stringify(env.VITE_DEMO_MODE || ''),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
});
