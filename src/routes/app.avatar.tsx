import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";
import { AvatarSVG, AVATAR_OPTIONS, type AvatarConfig } from "@/components/avatar-svg";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/app/avatar")({ component: AvatarPage });

function AvatarPage() {
  const { user } = useSession();
  const [config, setConfig] = useState<AvatarConfig>({});
  useEffect(() => {
    if (!user) return;
    supabase.from("avatars").select("config").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.config) setConfig(data.config as AvatarConfig);
    });
  }, [user]);

  async function save() {
    if (!user) return;
    const { error } = await supabase.from("avatars").upsert({ user_id: user.id, config });
    if (error) return toast.error(error.message);
    toast.success("Avatar guardado");
  }

  const set = (k: keyof AvatarConfig, v: any) => setConfig((c) => ({ ...c, [k]: v }));

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Tu avatar</h1>
      <p className="text-muted-foreground">Personaliza cómo te ve Ely.</p>
      <div className="mt-6 grid md:grid-cols-[280px_1fr] gap-6">
        <div className="card-soft p-6 flex flex-col items-center gradient-warm text-white">
          <AvatarSVG config={config} size={220} />
          <button onClick={save} className="mt-4 w-full rounded-full bg-white text-primary py-3 font-bold shadow-soft flex items-center justify-center gap-2">
            <Save className="h-4 w-4" /> Guardar
          </button>
        </div>
        <div className="space-y-4">
          <SelectRow label="Tono de piel" options={AVATAR_OPTIONS.skin} current={config.skin} onSelect={(v) => set("skin", v)} kind="color" />
          <SelectRow label="Cabello" options={[...AVATAR_OPTIONS.hair]} current={config.hair} onSelect={(v) => set("hair", v)} kind="label" />
          <SelectRow label="Color de cabello" options={AVATAR_OPTIONS.hairColor} current={config.hairColor} onSelect={(v) => set("hairColor", v)} kind="color" />
          <SelectRow label="Ojos" options={[...AVATAR_OPTIONS.eyes]} current={config.eyes} onSelect={(v) => set("eyes", v)} kind="label" />
          <SelectRow label="Prenda" options={[...AVATAR_OPTIONS.outfit]} current={config.outfit} onSelect={(v) => set("outfit", v)} kind="label" />
          <SelectRow label="Color de prenda" options={AVATAR_OPTIONS.outfitColor} current={config.outfitColor} onSelect={(v) => set("outfitColor", v)} kind="color" />
          <SelectRow label="Accesorio" options={[...AVATAR_OPTIONS.accessory]} current={config.accessory} onSelect={(v) => set("accessory", v)} kind="label" />
          <SelectRow label="Expresión" options={["happy", "calm", "excited", "thinking"]} current={config.mood} onSelect={(v) => set("mood", v as any)} kind="label" />
        </div>
      </div>
    </div>
  );
}

function SelectRow({ label, options, current, onSelect, kind }: { label: string; options: readonly string[]; current: any; onSelect: (v: string) => void; kind: "color" | "label" }) {
  return (
    <div className="card-soft p-4">
      <div className="text-sm font-bold mb-2">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button key={o} onClick={() => onSelect(o)}
            className={`rounded-2xl border-2 transition ${current === o ? "border-primary scale-110" : "border-transparent"} ${kind === "color" ? "h-9 w-9" : "px-3 py-1.5 text-xs font-semibold bg-secondary"}`}
            style={kind === "color" ? { backgroundColor: o } : undefined}
          >
            {kind === "label" ? o : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
