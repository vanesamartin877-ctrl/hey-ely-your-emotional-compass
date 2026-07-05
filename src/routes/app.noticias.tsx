import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/noticias")({ component: NewsPage });

function NewsPage() {
  const { data } = useQuery({
    queryKey: ["student-news"],
    queryFn: async () => (await supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Noticias</h1>
      <p className="text-muted-foreground">Novedades de tu institución.</p>
      <div className="mt-4 space-y-3">
        {data?.length === 0 && <div className="card-soft p-6 text-center text-muted-foreground">Aún no hay noticias.</div>}
        {data?.map((n: any) => (
          <article key={n.id} className="card-soft p-5">
            <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</div>
            <h2 className="text-xl font-bold">{n.title}</h2>
            <p className="mt-2 text-sm whitespace-pre-wrap">{n.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
