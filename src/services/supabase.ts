import { createClient } from '@supabase/supabase-js';

// Configure these in the deployment environment (or a local .env file):
// - VITE_SUPABASE_URL
// - VITE_SUPABASE_ANON_KEY
//
// The anon key is safe to expose in the browser only because Row Level
// Security restricts what it can read/write. Never put the service_role key here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
