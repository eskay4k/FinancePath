import { createClient } from "@supabase/supabase-js";
import { validAccountConfig } from "./auth-config";
const env = import.meta.env;
const url = env.VITE_SUPABASE_URL as string | undefined;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const supabase =
  validAccountConfig(url,key) && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;
