import { createClient } from '@supabase/supabase-js';

// This automatically strips out any accidental trailing slashes or subpaths 
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl
  .replace(/\/rest\/v1\/?$/, '') // Removes /rest/v1/ if it was accidentally pasted
  .replace(/\/$/, '');           // Removes any trailing slash

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);