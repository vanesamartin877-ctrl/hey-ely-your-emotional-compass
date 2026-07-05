import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/app/juegos/trivia")({ component: Trivia });

const QUESTIONS = [
  { q: "¿Qué técnica te ayuda a calmarte en un momento de ansiedad?", opts: ["Respirar profundo", "Ignorarlo", "Comer rápido"], correct: 0 },
  { q: "El bullying es...", opts: ["Una broma inofensiva", "Una forma de violencia repetida", "Un juego"], correct: 1 },
  { q: "Sentir tristeza a veces es...", opts: ["Malo", "Normal y humano", "Un fracaso"], correct: 1 },
  { q: "Ante una crisis emocional puedes...", opts: ["Aislarte totalmente", "Hablar con alguien de confianza", "Publicarlo en redes"], correct: 1 },
  { q: "La autoestima se construye...", opts: ["Comparándote", "Día a día con acciones", "Al azar"], correct: 1 },
];

function Trivia() {
  const { user } = useSession(); const { profile } = useProfile(user?.id);
  const [i, setI] = useState(0); const [score, setScore] = useState(0); const [done, setDone] = useState(false);

  async function answer(idx: number) {
    if (idx === QUESTIONS[i].correct) setScore((s) => s + 1);
    if (i + 1 < QUESTIONS.length) setI(i + 1);
    else {
      setDone(true);
      if (user && profile) {
        const xp = (score + (idx === QUESTIONS[i].correct ? 1 : 0)) * 5;
        await supabase.from("game_sessions").insert({ user_id: user.id, game_key: "trivia", score: score + (idx === QUESTIONS[i].correct ? 1 : 0), xp_earned: xp });
        await supabase.from("profiles").update({ xp: profile.xp + xp }).eq("id", user.id);
        toast.success(`+${xp} XP`);
      }
    }
  }
  function reset() { setI(0); setScore(0); setDone(false); }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/app/juegos" className="text-xs text-muted-foreground">← Volver</Link>
      <h1 className="mt-1 text-3xl font-extrabold">Trivia de bienestar</h1>
      {!done ? (
        <div className="card-soft p-6 mt-4">
          <div className="text-xs text-primary font-bold">Pregunta {i + 1} de {QUESTIONS.length}</div>
          <div className="mt-2 font-bold text-lg">{QUESTIONS[i].q}</div>
          <div className="mt-4 space-y-2">
            {QUESTIONS[i].opts.map((o, idx) => (
              <button key={idx} onClick={() => answer(idx)} className="w-full text-left rounded-2xl border p-3 hover:bg-secondary">{o}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-soft p-8 text-center mt-4">
          <div className="text-5xl">🎉</div>
          <div className="text-2xl font-extrabold mt-2">¡Acertaste {score}/{QUESTIONS.length}!</div>
          <button onClick={reset} className="mt-4 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold">Volver a jugar</button>
        </div>
      )}
    </div>
  );
}
