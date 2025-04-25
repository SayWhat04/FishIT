import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { environment } from '../environments/environment';

// Get Supabase URL and key from environment
const supabaseUrl = environment.supabase.url;
const supabaseKey = environment.supabase.key;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 