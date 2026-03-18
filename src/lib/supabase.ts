import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.error('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and restart the Vite server.');
}

// We override the global fetch to catch and report CORS/Network errors clearly
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  try {
    return await fetch(url, options);
  } catch (err: any) {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      throw new Error('Missing Supabase configuration. Please check your .env file and restart the server.');
    }
    // Network or CORS error
    if (err.message === 'Failed to fetch') {
      throw new Error('Network error: Failed to connect to Supabase. This could be caused by an adblocker (e.g., Brave Shields) or a VPN/Firewall blocking the connection.');
    }
    throw err;
  }
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  { auth: { persistSession: true }, global: { fetch: customFetch } }
);
