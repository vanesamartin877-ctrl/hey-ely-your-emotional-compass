import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/app/recursos")({ component: Resources });

function Resources() {
  const [cat, setCat] = useState<string>("Todos");
  const { data } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => (await supabase.from("resources").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const cats = ["Todos", ...Array.from(new Set(data?.map((r: any) => r.category) ?? []))];
  const filtered = cat === "Todos" ? data : data?.filter((r: any) => r.category === cat);
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Biblioteca</h1>
      <p className="text-muted-foreground">Aprende sobre bienestar emocional.</p>
      <div className="mt-4 flex gap-2 flex-wrap">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1 text-sm font-semibold ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{c}</button>
        ))}
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        {filtered?.map((r: any) => (
          <details key={r.id} className="card-soft p-5">
            <summary className="cursor-pointer list-none">
              <div className="text-3xl">{r.cover_emoji}</div>
              <div className="text-xs uppercase font-bold text-primary mt-1">{r.category}</div>
              <div className="text-lg font-bold">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.description}</div>
            </summary>
            <p className="mt-3 text-sm leading-relaxed">{r.content_body}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
