import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile } from "@/lib/session";
import { ElyMascot } from "@/components/brand";
import { toast } from "sonner";
import { Lock, Check } from "lucide-react";

export const Route = createFileRoute("/app/mascota")({ component: PetsPage });

const PETS = [
  { key: "ely", name: "Ely", emoji: "🐘", cost: 0 },
  { key: "gato", name: "Michi", emoji: "🐱", cost: 100 },
  { key: "perro", name: "Rocky", emoji: "🐶", cost: 150 },
  { key: "conejo", name: "Nube", emoji: "🐰", cost: 200 },
  { key: "panda", name: "Bao", emoji: "🐼", cost: 300 },
  { key: "zorro", name: "Kori", emoji: "🦊", cost: 400 },
  { key: "capibara", name: "Capi", emoji: "🦫", cost: 500 },
  { key: "pinguino", name: "Piu", emoji: "🐧", cost: 600 },
  { key: "buho", name: "Owly", emoji: "🦉", cost: 700 },
  { key: "axolote", name: "Axo", emoji: "🦎", cost: 800 },
  { key: "dragon", name: "Draki", emoji: "🐉", cost: 1000 },
  { key: "robot", name: "Byte", emoji: "🤖", cost: 1200 },
];

function PetsPage() {
  const { user } = useSession(); const { profile, setProfile } = useProfile(user?.id);
  const [pet, setPet] = useState<{ active_pet: string; unlocked_pets: string[] } | null>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("pets").select("active_pet,unlocked_pets").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setPet({ active_pet: data.active_pet, unlocked_pets: data.unlocked_pets as string[] });
    });
  }, [user]);

  async function selectOrBuy(p: typeof PETS[0]) {
    if (!user || !pet || !profile) return;
    const unlocked = pet.unlocked_pets.includes(p.key);
    if (unlocked) {
      const { error } = await supabase.from("pets").update({ active_pet: p.key }).eq("user_id", user.id);
      if (error) return toast.error(error.message);
      setPet({ ...pet, active_pet: p.key });
      toast.success(`Ahora te acompaña ${p.name}`);
      return;
    }
    if (profile.xp < p.cost) return toast.error(`Necesitas ${p.cost - profile.xp} XP más`);
    const newUnlocked = [...pet.unlocked_pets, p.key];
    await supabase.from("pets").update({ unlocked_pets: newUnlocked, active_pet: p.key }).eq("user_id", user.id);
    const newXp = profile.xp - p.cost;
    await supabase.from("profiles").update({ xp: newXp }).eq("id", user.id);
    setPet({ active_pet: p.key, unlocked_pets: newUnlocked });
    setProfile({ ...profile, xp: newXp });
    toast.success(`¡Desbloqueaste a ${p.name}!`);
  }

  const active = PETS.find((p) => p.key === pet?.active_pet) ?? PETS[0];

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Tu mascota</h1>
      <p className="text-muted-foreground">Desbloquea nuevas mascotas con XP.</p>

      <div className="mt-6 card-soft p-6 gradient-mint text-white flex items-center gap-4">
        {active.key === "ely" ? <ElyMascot className="w-32" /> : <div className="text-8xl">{active.emoji}</div>}
        <div>
          <div className="text-sm opacity-90">Tu compañero/a</div>
          <div className="text-3xl font-extrabold">{active.name}</div>
          <div className="text-sm">Tienes {profile?.xp ?? 0} XP</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {PETS.map((p) => {
          const unlocked = pet?.unlocked_pets.includes(p.key);
          const isActive = pet?.active_pet === p.key;
          return (
            <button key={p.key} onClick={() => selectOrBuy(p)}
              className={`card-soft p-4 text-center transition ${isActive ? "ring-2 ring-primary" : ""} ${!unlocked ? "opacity-70" : "hover:scale-105"}`}>
              <div className="text-5xl">{p.emoji}</div>
              <div className="mt-1 font-bold text-sm">{p.name}</div>
              {isActive ? <div className="text-xs text-primary font-bold flex items-center justify-center gap-1"><Check className="h-3 w-3" /> Activo</div>
                : unlocked ? <div className="text-xs text-muted-foreground">Toca para elegir</div>
                : <div className="text-xs flex items-center justify-center gap-1"><Lock className="h-3 w-3" /> {p.cost} XP</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
