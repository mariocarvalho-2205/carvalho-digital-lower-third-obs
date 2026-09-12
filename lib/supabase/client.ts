import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const TABLE_OVERLAYS = process.env.NODE_ENV === 'development' ? 'overlays_dev' : 'overlays';
export const TABLE_VARIATIONS = process.env.NODE_ENV === 'development' ? 'variations_dev' : 'variations';
