import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../.env') });


function getEnvVar(key: string, required = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
}

export const config = {
  supabase: {
    url: getEnvVar('SUPABASE_URL'),
    serviceKey: getEnvVar('SUPABASE_SERVICE_KEY')
  },
  openRouter: {
    apiKey: getEnvVar('OPENROUTER_API_KEY'),
    url: getEnvVar('OPENROUTER_URL')
  },
  server: {
    port: getEnvVar('PORT', false) ? parseInt(getEnvVar('PORT', false)) : 3000
  }
};
