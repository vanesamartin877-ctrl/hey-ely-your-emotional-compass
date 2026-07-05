import { createFileRoute, Link } from "@tanstack/react-router";
import { ElyMascot } from "@/components/brand";
import { useSession, useProfile, computeLevel } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Target, Gamepad2, BookOpen, Sparkles, Newspaper, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Home });

function Home() {
  const { user } = useSession();
  const { profile } = useProfile(user?.id);

  const { data: missions } = useQuery({
    queryKey: ["home-missions"],
    queryFn: async () => (await supabase.from("missions").select("*").eq("active", true).limit(4)).data ?? [],
  });

  if (!profile) return <div className="text-center py-20">Cargando...</div>;
  const { level, xpIntoLevel, nextLevelXp } = computeLevel(profile.xp);
  const first = profile.full_name.split(" ")[0];
  const pct = Math.min(100, (xpIntoLevel / nextLevelXp) * 100);

  return (
    <div className="space-y-6">
      <div className="card-soft p-6 gradient-hero text-white flex items-center gap-4">
        <ElyMascot className="w-28 md:w-36 shrink-0" />
        <div className="flex-1">
          <div className="text-sm opacity-90">Nivel {level}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Hola, {first} 👋</h1>
          <p className="opacity-95 text-sm">Qué bueno verte hoy. ¿Cómo te sientes?</p>
          <div className="mt-3">
            <div className="h-2.5 rounded-full bg-white/25 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs mt-1 opacity-90">{xpIntoLevel} / {nextLevelXp} XP para el próximo nivel</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <QuickCard to="/app/chat" icon={MessageCircle} title="Hablar con Ely" desc="Estoy aquí para escucharte" />
        <QuickCard to="/app/misiones" icon={Target} title="Misiones" desc="Suma XP hoy" />
        <QuickCard to="/app/juegos" icon={Gamepad2} title="Jugar" desc="Aprende jugando" />
        <QuickCard to="/app/recursos" icon={BookOpen} title="Recursos" desc="Aprende algo nuevo" />
        <QuickCard to="/app/avatar" icon={Sparkles} title="Personaliza tu avatar" desc="Hazlo tuyo" />
        <QuickCard to="/app/noticias" icon={Newspaper} title="Noticias" desc="Tu institución" />
      </div>

      <div className="card-soft p-6">
        <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">Misiones sugeridas hoy</h2></div>
        <div className="mt-3 grid md:grid-cols-2 gap-2">
          {missions?.map((m: any) => (
            <Link key={m.id} to="/app/misiones" className="rounded-2xl border p-3 hover:bg-secondary">
              <div className="font-bold text-sm">{m.title}</div>
              <div className="text-xs text-muted-foreground">{m.description}</div>
              <div className="mt-1 text-xs font-bold text-primary">+{m.xp_reward} XP</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickCard({ to, icon: Icon, title, desc }: any) {
  return (
    <Link to={to} className="card-soft p-4 hover:scale-[1.02] transition">
      <div className="rounded-xl gradient-mint inline-flex p-2 text-white"><Icon className="h-5 w-5" /></div>
      <div className="mt-2 font-bold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </Link>
  );
}
