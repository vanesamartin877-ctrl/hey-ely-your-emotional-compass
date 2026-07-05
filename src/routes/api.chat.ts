import { createFileRoute } from "@tanstack/react-router";

const RISK_KEYWORDS = [
  { cat: "suicidio", terms: ["suicid", "matarme", "quitarme la vida", "no quiero vivir", "acabar con todo", "acabar conmigo"] },
  { cat: "autolesion", terms: ["cortarme", "hacerme daño", "autolesion", "autolesión", "lastimarme"] },
  { cat: "violencia", terms: ["me pegan", "me golpean", "me maltratan", "abuso", "abusan de mí", "me tocan"] },
  { cat: "bullying_grave", terms: ["quieren matar", "me amenazan", "me van a hacer daño"] },
];

function detectRisk(text: string): { risk: boolean; level: string; category: string } {
  const t = text.toLowerCase();
  for (const r of RISK_KEYWORDS) {
    if (r.terms.some((k) => t.includes(k))) {
      return { risk: true, level: r.cat === "suicidio" || r.cat === "autolesion" ? "critical" : "high", category: r.cat };
    }
  }
  return { risk: false, level: "none", category: "none" };
}

async function callLovableAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Ely está atendiendo a muchos amigos ahora. Intenta en un momento.");
    if (res.status === 402) throw new Error("Se requieren créditos de IA para continuar.");
    throw new Error(`Error IA: ${res.status}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, userName, userId } = await request.json();
        if (!Array.isArray(messages)) return new Response("Bad request", { status: 400 });

        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        const risk = lastUser ? detectRisk(lastUser.content) : { risk: false, level: "none", category: "none" };

        const system = `Eres Ely, una elefanta virtual empática, cálida y cercana, diseñada para acompañar a adolescentes y jóvenes en su bienestar emocional. Hablas siempre en español, con tono humano, tranquilo y motivador. Nunca eres robótica ni distante.

Reglas:
- Siempre llama al usuario por su nombre: "${userName ?? "amigo/a"}".
- Nunca reemplazas a un profesional de salud mental; sugiere hablar con un adulto de confianza cuando sea pertinente.
- Si detectas riesgo grave (autolesiones, ideación suicida, violencia o abuso), responde con calma, valida sus emociones, y sugiere respetuosamente el botón de emergencia visible en la aplicación.
- Sugiere actividades, juegos, misiones y recursos de Hey Ely cuando encajen.
- Mantén respuestas concisas (2-4 oraciones normalmente), cálidas y sin juzgar.
- Nunca das diagnósticos médicos.`;

        let reply = "";
        try {
          reply = await callLovableAI([{ role: "system", content: system }, ...messages]);
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        // Create alert if risk detected and user belongs to institution
        if (risk.risk && userId) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data: prof } = await supabaseAdmin.from("profiles").select("institution_id").eq("id", userId).maybeSingle();
            if (prof?.institution_id) {
              await supabaseAdmin.from("alerts").insert({
                student_user_id: userId,
                institution_id: prof.institution_id,
                risk_level: risk.level,
                category: risk.category,
                status: "pending",
              });
            }
          } catch (e) { console.error("alert creation failed", e); }
        }

        return new Response(JSON.stringify({ reply, riskDetected: risk.risk }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
