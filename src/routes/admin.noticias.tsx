import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/lib/session";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/noticias")({ component: NewsAdmin });

function NewsAdmin() {
  const { user } = useSession();
  const qc = useQueryClient();
  const [f, setF] = useState({ title: "", body: "" });

  const { data: inst } = useQuery({
    queryKey: ["my-inst", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("institutions").select("id").eq("admin_user_id", user!.id).maybeSingle()).data,
  });
  const { data } = useQuery({
    queryKey: ["news-admin"], enabled: !!user,
    queryFn: async () => (await supabase.from("news").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function publish() {
    if (!user || !inst) return;
    if (!f.title.trim() || !f.body.trim()) return toast.error("Completa los campos");
    const { error } = await supabase.from("news").insert({ admin_user_id: user.id, institution_id: inst.id, title: f.title, body: f.body });
    if (error) return toast.error(error.message);
    toast.success("Noticia publicada");
    setF({ title: "", body: "" });
    qc.invalidateQueries();
  }
  async function del(id: string) { await supabase.from("news").delete().eq("id", id); qc.invalidateQueries(); }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Noticias</h1>

      <div className="mt-4 card-soft p-5 space-y-2">
        <div className="font-bold">Nueva noticia</div>
        <input placeholder="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="w-full rounded-2xl border p-3" />
        <textarea placeholder="Contenido" rows={4} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} className="w-full rounded-2xl border p-3" />
        <button onClick={publish} className="rounded-full bg-primary text-primary-foreground px-4 py-2 font-bold flex items-center gap-2"><Plus className="h-4 w-4" /> Publicar</button>
      </div>

      <div className="mt-4 space-y-2">
        {data?.map((n: any) => (
          <div key={n.id} className="card-soft p-4">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</div>
                <div className="font-bold">{n.title}</div>
                <p className="text-sm mt-1">{n.body}</p>
              </div>
              <button onClick={() => del(n.id)} className="rounded-full border p-2 hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
