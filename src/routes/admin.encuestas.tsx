import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/lib/session";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Send, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/encuestas")({ component: Surveys });

function Surveys() {
  const { user } = useSession();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", description: "", category: "Ansiedad", questions: "" });

  const { data: inst } = useQuery({
    queryKey: ["my-inst", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("institutions").select("id").eq("admin_user_id", user!.id).maybeSingle()).data,
  });
  const { data } = useQuery({
    queryKey: ["surveys", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("surveys").select("*").eq("admin_user_id", user!.id).order("created_at", { ascending: false })).data ?? [],
  });

  async function create() {
    if (!user || !inst) return;
    const questions = f.questions.split("\n").filter(Boolean).map((q) => ({ text: q, options: ["Nunca", "A veces", "Frecuente", "Siempre"] }));
    const { error } = await supabase.from("surveys").insert({
      admin_user_id: user.id, institution_id: inst.id, title: f.title, description: f.description, category: f.category, questions,
    });
    if (error) return toast.error(error.message);
    toast.success("Encuesta creada");
    setOpen(false); setF({ title: "", description: "", category: "Ansiedad", questions: "" });
    qc.invalidateQueries();
  }
  async function publish(id: string, published: boolean) {
    await supabase.from("surveys").update({ published: !published }).eq("id", id);
    qc.invalidateQueries();
  }
  async function del(id: string) {
    await supabase.from("surveys").delete().eq("id", id);
    qc.invalidateQueries();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Encuestas</h1>
        <button onClick={() => setOpen(!open)} className="rounded-full bg-primary text-primary-foreground px-4 py-2 font-bold flex items-center gap-2"><Plus className="h-4 w-4" /> Nueva</button>
      </div>

      {open && (
        <div className="mt-4 card-soft p-5 space-y-2">
          <input placeholder="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="w-full rounded-2xl border p-3" />
          <input placeholder="Descripción" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full rounded-2xl border p-3" />
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="w-full rounded-2xl border p-3">
            {["Ansiedad", "Estrés", "Autoestima", "Bullying", "Ciberbullying", "Relaciones familiares", "Proyecto de vida", "Clima escolar", "Bienestar emocional"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea placeholder="Una pregunta por línea..." value={f.questions} onChange={(e) => setF({ ...f, questions: e.target.value })} rows={5} className="w-full rounded-2xl border p-3" />
          <button onClick={create} className="rounded-full bg-primary text-primary-foreground px-4 py-2 font-bold">Crear encuesta</button>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {data?.map((s: any) => (
          <div key={s.id} className="card-soft p-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs uppercase font-bold text-primary">{s.category}</div>
              <div className="font-bold">{s.title}</div>
              <div className="text-xs text-muted-foreground">{Array.isArray(s.questions) ? s.questions.length : 0} preguntas</div>
            </div>
            <button onClick={() => publish(s.id, s.published)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${s.published ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
              <Send className="h-3 w-3 inline mr-1" /> {s.published ? "Publicada" : "Publicar"}
            </button>
            <button onClick={() => del(s.id)} className="rounded-full border p-2 hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
