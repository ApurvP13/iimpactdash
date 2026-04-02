import { createClient } from "@supabase/supabase-js";
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVICE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — safe to use in client components for reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — server-only, never import in client components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
