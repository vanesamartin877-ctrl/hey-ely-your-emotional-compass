import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/session";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/alertas")({ component: Alerts });

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-destructive/15 text-destructive",
  in_progress: "bg-yellow-100 text-yellow-800",
  attended: "bg-green-100 text-green-800",
  closed: "bg-secondary text-secondary-foreground",
};
const STATUS_LABEL: Record<string, string> = { pending: "Pendiente", in_progress: "En proceso", attended: "Atendida", closed: "Cerrada" };

function Alerts() {
  const { user } = useSession();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["alerts"], enabled: !!user,
    queryFn: async () => (await supabase.from("alerts").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function changeStatus(id: string, status: string) {
    await supabase.from("alerts").update({ status: status as any }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["alerts"] });
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold flex items-center gap-2"><AlertCircle className="text-destructive" /> Alertas</h1>
      <div className="mt-2 card-soft p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Shield className="h-4 w-4" /> Las alertas son generadas automáticamente cuando la IA detecta situaciones de riesgo. Las conversaciones nunca se muestran.
      </div>

      <div className="mt-4 space-y-2">
        {data?.length === 0 && <div className="card-soft p-6 text-center text-muted-foreground">No hay alertas por ahora.</div>}
        {data?.map((a: any) => (
          <div key={a.id} className="card-soft p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2 text-destructive"><AlertCircle className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="font-bold text-sm capitalize">{a.category.replace("_", " ")} · nivel {a.risk_level}</div>
                <div className="text-xs text-muted-foreground">Un estudiante requiere seguimiento. Se generó el {new Date(a.created_at).toLocaleString()}.</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[a.status]}`}>{STATUS_LABEL[a.status]}</span>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {["pending", "in_progress", "attended", "closed"].map((s) => (
                <button key={s} disabled={a.status === s} onClick={() => changeStatus(a.id, s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${a.status === s ? "bg-primary text-primary-foreground" : "border hover:bg-secondary"}`}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
