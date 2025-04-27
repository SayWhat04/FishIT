import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { environment } from '../config/environment';

// Get Supabase URL and key from environment
const supabaseUrl = environment.supabase.url;
const supabaseKey = environment.supabase.key;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 