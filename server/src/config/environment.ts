import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const environment = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || ''
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    url: process.env.OPENROUTER_URL || ''
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000
  }
};