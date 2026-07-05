import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type SessionState = {
  user: User | null;
  loading: boolean;
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, loading: true });
  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setState({ user: data.session?.user ?? null, loading: false });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState({ user: session?.user ?? null, loading: false });
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return state;
}

export type ProfileRow = {
  id: string;
  full_name: string;
  user_type: "admin" | "student" | "natural";
  email: string | null;
  age: number | null;
  grade: string | null;
  course: string | null;
  position: string | null;
  institution_id: string | null;
  xp: number;
  level: number;
  streak_days: number;
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setProfile(null); setLoading(false); return; }
    let alive = true;
    setLoading(true);
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle().then(({ data }) => {
      if (!alive) return;
      setProfile(data as ProfileRow | null);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [userId]);
  return { profile, loading, setProfile };
}

export function xpForNextLevel(level: number) { return 100 + level * 50; }
export function computeLevel(xp: number) {
  let lvl = 1, remaining = xp;
  while (remaining >= xpForNextLevel(lvl)) { remaining -= xpForNextLevel(lvl); lvl++; }
  return { level: lvl, xpIntoLevel: remaining, nextLevelXp: xpForNextLevel(lvl) };
}
