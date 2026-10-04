import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthContext } from "./auth-context";
import { supabase } from "./supabase";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!supabase) return;
    let authEventReceived = false;
    // Keep this synchronous: SDK calls inside this callback can deadlock.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      authEventReceived = true;
      setError(null);
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setRecovery(false);
    });
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (!authEventReceived) setUser(data.session?.user ?? null);
        setLoading(false);
        if (error)
          setError("Your session could not be restored. Please log in again.");
      })
      .catch(() => {
        if (active) {
          setLoading(false);
          setError("Account connection unavailable. Please try again.");
        }
      });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  async function signOut() {
    if (!supabase) return true;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      setError("Could not log out. Check your connection and try again.");
      return false;
    }
    return true;
  }
  return (
    <AuthContext.Provider value={{ user, loading, recovery, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
