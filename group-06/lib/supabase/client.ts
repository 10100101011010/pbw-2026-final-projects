import { createBrowserClient } from "@supabase/ssr";

// Client Component / browser Supabase client.
// Uses the public anon key — safe to expose, RLS is off so this
// client should ONLY ever be used for auth (signUp/signIn/signOut)
// and never for direct table reads/writes of sensitive data.
// All report/profile/admin data access goes through our API routes,
// which use the server client and enforce role checks manually.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
