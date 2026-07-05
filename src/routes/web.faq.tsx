import { createFileRoute } from "@tanstack/react-router";
const faqs = [
  { q: "¿La IA lee un adulto mis conversaciones?", a: "No. Las conversaciones son 100% privadas. Solo si la IA detecta un riesgo grave se envía una alerta al equipo de orientación (sin la conversación)." },
  { q: "¿Es gratis?", a: "Sí, Hey Ely es gratis para los estudiantes." },
  { q: "¿Necesito estar en un colegio?", a: "No necesariamente. Puedes crear un perfil como usuario natural." },
  { q: "¿Cómo se protege mi información?", a: "Usamos autenticación segura y políticas estrictas de acceso a datos." },
];
export const Route = createFileRoute("/web/faq")({
  head: () => ({ meta: [{ title: "Preguntas frecuentes — Hey Ely" }] }),
  component: () => (
    <div>
      <h1 className="text-4xl font-extrabold">Preguntas frecuentes</h1>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <div key={f.q} className="card-soft p-5">
            <div className="font-bold">{f.q}</div>
            <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
