import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/web/noticias")({
  head: () => ({ meta: [{ title: "Noticias — Hey Ely" }] }),
  component: () => (
    <div>
      <h1 className="text-4xl font-extrabold">Noticias</h1>
      <p className="mt-2 text-muted-foreground">Las noticias de cada institución se publican dentro de la aplicación. Inicia sesión para verlas.</p>
    </div>
  ),
});
