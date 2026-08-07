import { createClient } from '@supabase/supabase-js';
import { env } from './env';

let supabase: any = null;

if (env.supabaseUrl && env.supabaseServiceKey) {
  supabase = createClient(
    env.supabaseUrl,
    env.supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
} else {
  console.warn('Supabase credentials not provided. PDF upload will not work.');
}

export default supabase;
