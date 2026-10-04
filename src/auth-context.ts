import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  recovery: boolean;
  error: string | null;
  signOut: () => Promise<boolean>;
} | null>(null);
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is required");
  return value;
}
