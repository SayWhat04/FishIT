import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { config } from '../config/environment';


const supabaseUrl =  config.supabase.url;
const supabaseKey = config.supabase.serviceKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 