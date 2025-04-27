import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
// import { environment } from '../config/environment';

// Get Supabase URL and key from environment
// const supabaseUrl = environment.supabase.url;
// const supabaseKey = environment.supabase.key;
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 