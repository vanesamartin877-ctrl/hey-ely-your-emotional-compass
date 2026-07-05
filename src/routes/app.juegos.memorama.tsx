import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/app/juegos/memorama")({ component: Memorama });

const EMOJIS = ["😊", "😢", "😡", "😨", "😍", "😴", "🤔", "😌"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function Memorama() {
  const { user } = useSession(); const { profile } = useProfile(user?.id);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { reset(); }, []);
  function reset() {
    const deck = [...EMOJIS, ...EMOJIS].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(deck); setFlipped([]); setMoves(0); setDone(false);
  }
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards((c) => c.map((card, i) => i === a || i === b ? { ...card, matched: true } : card));
          setFlipped([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((c) => c.map((card, i) => i === a || i === b ? { ...card, flipped: false } : card));
          setFlipped([]);
        }, 800);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched) && !done) {
      setDone(true);
      award();
    }
  }, [cards, done]);

  async function award() {
    if (!user || !profile) return;
    const xp = Math.max(10, 40 - moves);
    await supabase.from("game_sessions").insert({ user_id: user.id, game_key: "memorama", score: moves, xp_earned: xp });
    await supabase.from("profiles").update({ xp: profile.xp + xp }).eq("id", user.id);
    toast.success(`¡Ganaste! +${xp} XP`);
  }

  function flip(i: number) {
    if (flipped.length === 2 || cards[i].flipped || cards[i].matched) return;
    setCards((c) => c.map((card, idx) => idx === i ? { ...card, flipped: true } : card));
    setFlipped((f) => [...f, i]);
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/app/juegos" className="text-xs text-muted-foreground">← Volver a juegos</Link>
      <h1 className="mt-1 text-3xl font-extrabold">Memorama de emociones</h1>
      <p className="text-muted-foreground text-sm">Encuentra las parejas · Movimientos: {moves}</p>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => flip(i)} className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition ${c.flipped || c.matched ? "gradient-hero text-white" : "card-soft"}`}>
            {c.flipped || c.matched ? c.emoji : "❓"}
          </button>
        ))}
      </div>
      {done && <button onClick={reset} className="mt-4 w-full rounded-full bg-primary text-primary-foreground py-3 font-bold">Jugar otra vez</button>}
    </div>
  );
}
