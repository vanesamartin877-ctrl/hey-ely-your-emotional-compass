import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/web/que-es")({
  head: () => ({ meta: [{ title: "¿Qué es Hey Ely?" }] }),
  component: () => (
    <article className="prose max-w-none">
      <h1 className="text-4xl font-extrabold">¿Qué es Hey Ely?</h1>
      <p className="text-lg text-muted-foreground">Una plataforma de bienestar emocional para adolescentes y jóvenes que combina IA empática, gamificación y recursos educativos.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="card-soft p-6">
          <h2 className="text-xl font-bold">Misión</h2>
          <p className="mt-2 text-sm text-muted-foreground">Acompañar a los adolescentes en su bienestar emocional, previniendo situaciones de riesgo y fortaleciendo habilidades socioemocionales.</p>
        </div>
        <div className="card-soft p-6">
          <h2 className="text-xl font-bold">Visión</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ser la plataforma de referencia en Latinoamérica para el cuidado emocional de la juventud.</p>
        </div>
      </div>
      <h2 className="mt-10 text-2xl font-bold">Beneficios</h2>
      <ul className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
        <li className="card-soft p-3">Chat privado con IA empática</li>
        <li className="card-soft p-3">Actividades y juegos de bienestar</li>
        <li className="card-soft p-3">Biblioteca de recursos educativos</li>
        <li className="card-soft p-3">Panel para instituciones educativas</li>
        <li className="card-soft p-3">Detección de alertas de riesgo</li>
        <li className="card-soft p-3">Botón de emergencia con líneas oficiales</li>
      </ul>
    </article>
  ),
});
