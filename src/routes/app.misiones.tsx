import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile } from "@/lib/session";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/misiones")({ component: MissionsPage });

function periodKey(freq: string) {
  const d = new Date();
  if (freq === "daily") return `d-${d.toISOString().slice(0, 10)}`;
  if (freq === "weekly") {
    const first = new Date(d); first.setDate(d.getDate() - d.getDay());
    return `w-${first.toISOString().slice(0, 10)}`;
  }
  return `m-${d.getFullYear()}-${d.getMonth() + 1}`;
}

function MissionsPage() {
  const { user } = useSession();
  const { profile } = useProfile(user?.id);
  const qc = useQueryClient();

  const { data: missions } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => (await supabase.from("missions").select("*").eq("active", true).order("frequency")).data ?? [],
  });
  const { data: done } = useQuery({
    queryKey: ["mission-progress", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("mission_progress").select("mission_id,period_key").eq("user_id", user!.id)).data ?? [],
  });

  // Esta función se conserva intacta para ser llamada desde las pantallas individuales
  async function complete(m: any) {
    if (!user || !profile) return;
    const pk = periodKey(m.frequency);
    if (done?.some((d: any) => d.mission_id === m.id && d.period_key === pk)) return;
    const { error } = await supabase.from("mission_progress").insert({ user_id: user.id, mission_id: m.id, period_key: pk });
    if (error) return toast.error(error.message);
    await supabase.from("profiles").update({ xp: profile.xp + m.xp_reward }).eq("id", user.id);
    toast.success(`+${m.xp_reward} XP · ¡Bien hecho!`);
    qc.invalidateQueries();
  }

  // Muestra indicaciones claras del módulo y la actividad en lugar de navegar y romper la app
  function handleMissionClick(m: any) {
    let modulo = "Juegos";
    const ruta = m.route || "";

    // Detectamos el módulo según el texto de la ruta en la base de datos
    if (ruta.includes("chat")) modulo = "Chat AI";
    else if (ruta.includes("avatar")) modulo = "Avatar";
    else if (ruta.includes("mascota")) modulo = "Mascota";
    else if (ruta.includes("perfil")) modulo = "Perfil";
    else if (ruta.includes("noticias")) modulo = "Noticias";
    else if (ruta.includes("recursos")) modulo = "Recursos";

    // Mostramos la alerta con las indicaciones exactas paso a paso
    toast.info(`📍 Para cumplirla ve a: Módulo ${modulo} ➔ Actividad: "${m.title}"`, {
      duration: 6000,
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold flex items-center gap-2"><Sparkles className="text-primary" /> Misiones</h1>
      <p className="text-muted-foreground">Completa misiones para subir de nivel.</p>
      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {missions?.map((m: any) => {
          const pk = periodKey(m.frequency);
          const isDone = done?.some((d: any) => d.mission_id === m.id && d.period_key === pk);
          return (
            <div key={m.id} className={`card-soft p-4 flex items-center gap-3 ${isDone ? "opacity-60" : ""}`}>
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-primary">{m.frequency} · +{m.xp_reward} XP</div>
                <div className="font-bold">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.description}</div>
              </div>
              <button 
                onClick={() => handleMissionClick(m)} 
                disabled={isDone} 
                className={`rounded-full px-3 py-2 text-xs font-bold ${isDone ? "bg-secondary" : "bg-primary text-primary-foreground shadow-soft"}`}
              >
                {isDone ? <Check className="h-4 w-4" /> : "Completar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
