import { createFileRoute } from "@tanstack/react-router";
import { useSession, useProfile } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, ClipboardList, Bell, Gamepad2, BookOpen, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

const COLORS = ["#8FB4E8", "#F3B4C6", "#B0DFC9", "#C7B4EA", "#F5D488", "#F19B84"];

function AdminHome() {
  const { user } = useSession(); const { profile } = useProfile(user?.id);
  const { data: inst } = useQuery({
    queryKey: ["my-inst", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("institutions").select("*").eq("admin_user_id", user!.id).maybeSingle()).data,
  });
  const { data: students } = useQuery({
    queryKey: ["students", inst?.id],
    enabled: !!inst,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("institution_id", inst!.id).eq("user_type", "student")).data ?? [],
  });
  const { data: alerts } = useQuery({
    queryKey: ["alerts-count", inst?.id],
    enabled: !!inst,
    queryFn: async () => (await supabase.from("alerts").select("id,status").eq("institution_id", inst!.id)).data ?? [],
  });
  const { data: surveys } = useQuery({
    queryKey: ["surveys-count", inst?.id],
    enabled: !!inst,
    queryFn: async () => (await supabase.from("surveys").select("id").eq("institution_id", inst!.id)).data ?? [],
  });
  const { data: games } = useQuery({
    queryKey: ["adm-games", inst?.id],
    enabled: !!inst && !!students?.length,
    queryFn: async () => (await supabase.from("game_sessions").select("game_key,xp_earned").in("user_id", students!.map((s: any) => s.id))).data ?? [],
  });

  const byGrade = Object.entries((students ?? []).reduce<Record<string, number>>((acc, s: any) => {
    const g = s.grade ?? "S/G"; acc[g] = (acc[g] ?? 0) + 1; return acc;
  }, {})).map(([k, v]) => ({ name: k, value: v }));

  const byAge = Object.entries((students ?? []).reduce<Record<string, number>>((acc, s: any) => {
    const g = String(s.age ?? "?"); acc[g] = (acc[g] ?? 0) + 1; return acc;
  }, {})).map(([k, v]) => ({ name: k, value: v }));

  const avgXp = students?.length ? Math.round(students.reduce((a: number, s: any) => a + (s.xp ?? 0), 0) / students.length) : 0;

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Panel · {inst?.name ?? "Tu institución"}</h1>
      <p className="text-muted-foreground text-sm">{profile?.position} · {inst?.city}, {inst?.department}</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Users} label="Estudiantes" value={students?.length ?? 0} color="var(--ely-blue)" />
        <Stat icon={Bell} label="Alertas activas" value={alerts?.filter((a: any) => a.status !== "closed" && a.status !== "attended").length ?? 0} color="var(--ely-pink)" />
        <Stat icon={ClipboardList} label="Encuestas" value={surveys?.length ?? 0} color="var(--ely-mint)" />
        <Stat icon={TrendingUp} label="XP promedio" value={avgXp} color="var(--ely-lavender)" />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="card-soft p-5">
          <h3 className="font-bold">Estudiantes por grado</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byGrade}>
              <XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--ely-blue)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-soft p-5">
          <h3 className="font-bold">Distribución por edad</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byAge} dataKey="value" nameKey="name" outerRadius={80} label>
                {byAge.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="card-soft p-5">
          <h3 className="font-bold flex items-center gap-2"><Gamepad2 className="h-4 w-4" /> Actividad de juegos</h3>
          <div className="text-4xl font-black mt-2">{games?.length ?? 0}</div>
          <div className="text-xs text-muted-foreground">partidas jugadas</div>
        </div>
        <div className="card-soft p-5">
          <h3 className="font-bold flex items-center gap-2"><BookOpen className="h-4 w-4" /> Cobertura</h3>
          <div className="text-sm mt-2">
            Estudiantes activos con XP &gt; 0: <strong>{students?.filter((s: any) => s.xp > 0).length ?? 0}</strong> de {students?.length ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="card-soft p-4">
      <div className="rounded-2xl inline-flex p-2" style={{ background: color, color: "#fff" }}><Icon className="h-4 w-4" /></div>
      <div className="mt-2 text-3xl font-black">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
