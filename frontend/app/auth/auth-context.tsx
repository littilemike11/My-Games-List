"use client";

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/supabase-client";
import type { Session } from "@supabase/supabase-js";
import { Profile } from "../types/models";
//  can potential remove profile from here, and instead do it in each component manually who needs it ( ie/navbar)
const AuthContext = createContext<{
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}>({
  session: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    const getProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.warn("Failed to fetch profile:", error.message);
      }

      setProfile(data);
    };

    getProfile();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
