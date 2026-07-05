import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/web/instituciones")({
  head: () => ({ meta: [{ title: "Para instituciones educativas — Hey Ely" }] }),
  component: () => (
    <article className="prose max-w-none">
      <h1 className="text-4xl font-extrabold">Hey Ely para instituciones educativas</h1>
      <p className="text-lg text-muted-foreground">Herramientas para rectores, psicorientadores y coordinadores.</p>
      <ul className="mt-6 space-y-2 text-sm">
        <li className="card-soft p-4">Panel con estadísticas por grado, edad y curso.</li>
        <li className="card-soft p-4">Encuestas diagnósticas (ansiedad, autoestima, bullying, ciberbullying, etc.).</li>
        <li className="card-soft p-4">Alertas automáticas cuando la IA detecta riesgo, sin exponer las conversaciones.</li>
        <li className="card-soft p-4">Publicación de noticias para la comunidad estudiantil.</li>
      </ul>
    </article>
  ),
});
