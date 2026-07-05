import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/web/familias")({
  head: () => ({ meta: [{ title: "Para familias y docentes — Hey Ely" }] }),
  component: () => (
    <article className="prose max-w-none">
      <h1 className="text-4xl font-extrabold">Para padres, docentes y estudiantes</h1>
      <p className="text-lg text-muted-foreground">Un espacio seguro para hablar de emociones y aprender a cuidarlas.</p>
      <p className="mt-6">Hey Ely respeta la privacidad de los estudiantes. Las conversaciones con la IA son privadas y nunca son leídas por adultos, salvo cuando se detecta una situación de riesgo, momento en el que se genera una alerta al equipo de orientación —sin exponer la conversación—.</p>
    </article>
  ),
});
