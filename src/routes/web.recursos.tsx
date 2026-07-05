import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/web/recursos")({
  head: () => ({ meta: [{ title: "Recursos — Hey Ely" }] }),
  component: PublicResources,
});

function PublicResources() {
  const { data } = useQuery({
    queryKey: ["public-resources"],
    queryFn: async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div>
      <h1 className="text-4xl font-extrabold">Biblioteca de recursos</h1>
      <p className="mt-2 text-muted-foreground">Artículos y guías sobre bienestar emocional.</p>
      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {data?.map((r: any) => (
          <div key={r.id} className="card-soft p-5">
            <div className="text-3xl">{r.cover_emoji}</div>
            <div className="mt-2 text-xs uppercase font-bold text-primary">{r.category}</div>
            <div className="text-lg font-bold">{r.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
