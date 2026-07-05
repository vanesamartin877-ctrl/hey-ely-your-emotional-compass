import { createFileRoute } from "@tanstack/react-router";
import { useSession, useProfile, computeLevel } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AvatarSVG } from "@/components/avatar-svg";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut, Save } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/perfil")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useSession(); const { profile, setProfile } = useProfile(user?.id);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");

  const { data: avatar } = useQuery({
    queryKey: ["avatar", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("avatars").select("config").eq("user_id", user!.id).maybeSingle()).data,
  });
  const { data: sessions } = useQuery({
    queryKey: ["sessions", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("game_sessions").select("*").eq("user_id", user!.id)).data ?? [],
  });
  const { data: doneMissions } = useQuery({
    queryKey: ["donem", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("mission_progress").select("*").eq("user_id", user!.id)).data ?? [],
  });

  if (!profile) return <div>Cargando...</div>;
  const { level, xpIntoLevel, nextLevelXp } = computeLevel(profile.xp);
  const pct = (xpIntoLevel / nextLevelXp) * 100;

  async function saveName() {
    if (!name.trim() || !user) return;
    await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setProfile(profile ? { ...profile, full_name: name } : null);
    toast.success("Nombre actualizado");
    qc.invalidateQueries();
  }

  async function logout() { await supabase.auth.signOut(); navigate({ to: "/auth" }); }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-soft p-6 gradient-hero text-white flex items-center gap-4">
        <div className="rounded-3xl bg-white/20 p-2">
          <AvatarSVG config={(avatar?.config as any) ?? {}} size={100} />
        </div>
        <div className="flex-1">
          <div className="text-sm opacity-90">Nivel {level}</div>
          <h1 className="text-3xl font-extrabold">{profile.full_name}</h1>
          <div className="text-sm opacity-95">{profile.xp} XP · Racha {profile.streak_days}</div>
          <div className="mt-2 h-2 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <Stat title="Misiones completadas" value={doneMissions?.length ?? 0} />
        <Stat title="Juegos jugados" value={sessions?.length ?? 0} />
        <Stat title="XP total" value={profile.xp} />
      </div>

      <div className="mt-6 card-soft p-6 space-y-3">
        <div className="text-lg font-bold">Configuración</div>
        <div>
          <label className="text-xs text-muted-foreground">Nombre</label>
          <div className="flex gap-2 mt-1">
            <input placeholder={profile.full_name} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-2xl border p-3" />
            <button onClick={saveName} className="rounded-full bg-primary text-primary-foreground px-4 font-bold"><Save className="h-4 w-4" /></button>
          </div>
        </div>
        <button onClick={logout} className="w-full rounded-full border p-3 font-bold flex items-center justify-center gap-2"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return <div className="card-soft p-4 text-center"><div className="text-3xl font-black">{value}</div><div className="text-xs text-muted-foreground">{title}</div></div>;
}
