import { createClient } from "@supabase/supabase-js";

// Server-only client — uses the service role key, which bypasses row-level
// security. Never import this file into a "use client" component; it
// should only ever run in server components, server actions, and API
// routes. The env vars are set in Vercel project settings, not committed.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
