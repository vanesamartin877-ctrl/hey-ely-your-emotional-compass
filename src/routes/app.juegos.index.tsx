import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/juegos")({ component: GamesIndex });

const games = [
  { key: "memorama", title: "Memorama de emociones", desc: "Encuentra las parejas de emociones.", emoji: "🎴", xp: 30 },
  { key: "respira", title: "Respiración guiada", desc: "4-7-8: inhala, sostén, exhala.", emoji: "🌬️", xp: 20 },
  { key: "trivia", title: "Trivia de bienestar", desc: "Preguntas sobre emociones y hábitos.", emoji: "🧠", xp: 25 },
];

function GamesIndex() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Juegos</h1>
      <p className="text-muted-foreground">Aprende habilidades socioemocionales jugando.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-3">
        {games.map((g) => (
          <Link key={g.key} to={`/app/juegos/${g.key}` as any} className="card-soft p-5 hover:scale-[1.02] transition">
            <div className="text-4xl">{g.emoji}</div>
            <div className="mt-2 font-bold">{g.title}</div>
            <div className="text-xs text-muted-foreground">{g.desc}</div>
            <div className="mt-2 text-xs font-bold text-primary">Hasta +{g.xp} XP</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
