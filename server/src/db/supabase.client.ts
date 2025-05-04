import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { config } from '../config/environment';
// import { environment } from '../config/environment';

// Get Supabase URL and key from environment
const supabaseUrl =  config.supabase.url;
const supabaseKey = config.supabase.serviceKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 