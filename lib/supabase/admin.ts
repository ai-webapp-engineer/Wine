import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-side admin tasks (Storage, bypass RLS).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
