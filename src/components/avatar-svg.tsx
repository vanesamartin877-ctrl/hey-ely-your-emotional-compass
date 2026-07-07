import { useMemo } from "react";

export type AvatarConfig = {
  skin?: string;
  hair?: string;
  hairColor?: string;
  eyes?: string;
  outfit?: string;
  outfitColor?: string;
  accessory?: string;
  mood?: "happy" | "calm" | "excited" | "thinking" | "surprised" | "cool";
};

export const AVATAR_OPTIONS = {
  skin: ["#FCE0C7", "#F5CBA0", "#E0A97F", "#B67F4F", "#8A5A3B", "#5C3A22"],
  hair: ["short", "long", "curly", "ponytail", "buns", "spiky", "braids", "bald"],
  hairColor: ["#2C1810", "#5C3A22", "#B67F4F", "#E8B860", "#C97A9A", "#7A9AC9", "#9A7AC9", "#FE5F55"],
  eyes: ["normal", "happy", "wink", "sparkle", "star", "anime-sad"],
  outfit: ["hoodie", "tee", "jacket", "dress", "sweater", "overalls"],
  outfitColor: ["#8FB4E8", "#F3B4C6", "#B0DFC9", "#C7B4EA", "#F5D488", "#F19B84", "#222222", "#FFFFFF"],
  accessory: ["none", "glasses", "cap", "headphones", "earrings", "scarf", "crown"],
} as const;

// ============================================================
//  CHIBI TOCA-BOCA STYLE AVATAR
//  Proporciones: cabeza ENORME (~55% del alto), cuerpo pequeño,
//  brazos y piernas cortos. Ojos gigantes con brillos.
// ============================================================

export function AvatarSVG({ config, size = 160 }: { config: AvatarConfig; size?: number }) {
  const c = useMemo(() => ({
    skin: config.skin ?? AVATAR_OPTIONS.skin[1],
    hair: config.hair ?? "short",
    hairColor: config.hairColor ?? AVATAR_OPTIONS.hairColor[0],
    eyes: config.eyes ?? "normal",
    outfit: config.outfit ?? "hoodie",
    outfitColor: config.outfitColor ?? AVATAR_OPTIONS.outfitColor[0],
    accessory: config.accessory ?? "none",
    mood: config.mood ?? "happy",
  }), [config]);

  const S = { stroke: "#2A1B14", strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const thin = { stroke: "#2A1B14", strokeWidth: 1.8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  return (
    <svg viewBox="0 0 200 260" width={size} height={size} className="w-full h-full object-contain block drop-shadow-sm">
      {/* ================= CABELLO TRASERO ================= */}
      {c.hair === "long" && (
        <path d="M30 90 Q10 170 40 235 L70 235 Q55 185 60 130 Z M170 90 Q190 170 160 235 L130 235 Q145 185 140 130 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "ponytail" && (
        <path d="M155 70 C195 60 205 130 175 155 C160 145 150 120 150 95 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "braids" && (
        <>
          <path d="M42 110 Q22 170 40 220 Q52 225 58 215 Q45 175 60 125 Z" fill={c.hairColor} {...S} />
          <path d="M158 110 Q178 170 160 220 Q148 225 142 215 Q155 175 140 125 Z" fill={c.hairColor} {...S} />
        </>
      )}

      {/* ================= PIERNAS ================= */}
      {c.outfit === "dress" ? (
        <>
          <rect x="82" y="200" width="12" height="38" rx="5" fill={c.skin} {...S} />
          <rect x="106" y="200" width="12" height="38" rx="5" fill={c.skin} {...S} />
        </>
      ) : (
        <>
          <rect x="80" y="196" width="16" height="42" rx="6" fill={c.outfit === "overalls" ? c.outfitColor : "#3A5B8C"} {...S} />
          <rect x="104" y="196" width="16" height="42" rx="6" fill={c.outfit === "overalls" ? c.outfitColor : "#3A5B8C"} {...S} />
        </>
      )}
      {/* Zapatos */}
      <ellipse cx="88" cy="242" rx="12" ry="7" fill="#FFFFFF" {...S} />
      <ellipse cx="112" cy="242" rx="12" ry="7" fill="#FFFFFF" {...S} />
      <path d="M76 242 L100 242 M100 242 L124 242" stroke="#2A1B14" strokeWidth="1.5" />

      {/* ================= CUERPO ================= */}
      {c.outfit === "dress" ? (
        <path d="M70 172 Q100 165 130 172 L140 205 Q100 215 60 205 Z" fill={c.outfitColor} {...S} />
      ) : c.outfit === "jacket" ? (
        <>
          <path d="M70 168 Q100 162 130 168 L134 200 Q100 208 66 200 Z" fill={c.outfitColor} {...S} />
          <line x1="100" y1="170" x2="100" y2="204" stroke="#2A1B14" strokeWidth="2" />
          <path d="M84 172 L100 188 L116 172" fill="none" stroke="#2A1B14" strokeWidth="2" />
        </>
      ) : c.outfit === "sweater" ? (
        <>
          <path d="M70 168 Q100 162 130 168 L134 202 Q100 210 66 202 Z" fill={c.outfitColor} {...S} />
          <path d="M74 180 Q100 188 126 180" fill="none" stroke="#2A1B14" strokeWidth="1.5" opacity="0.6" />
        </>
      ) : c.outfit === "overalls" ? (
        <>
          <path d="M72 168 Q100 162 128 168 L130 202 Q100 210 70 202 Z" fill="#FFFFFF" {...S} />
          <path d="M78 172 Q100 168 122 172 L126 202 Q100 208 74 202 Z" fill={c.outfitColor} {...S} />
          <circle cx="86" cy="180" r="2" fill="#2A1B14" />
          <circle cx="114" cy="180" r="2" fill="#2A1B14" />
        </>
      ) : c.outfit === "hoodie" ? (
        <>
          <path d="M68 168 Q100 160 132 168 L136 202 Q100 210 64 202 Z" fill={c.outfitColor} {...S} />
          <path d="M82 168 Q100 180 118 168" fill="none" stroke="#2A1B14" strokeWidth="2" />
          <line x1="94" y1="172" x2="94" y2="186" stroke="#2A1B14" strokeWidth="1.5" />
          <line x1="106" y1="172" x2="106" y2="186" stroke="#2A1B14" strokeWidth="1.5" />
        </>
      ) : (
        <path d="M70 168 Q100 162 130 168 L134 200 Q100 208 66 200 Z" fill={c.outfitColor} {...S} />
      )}

      {/* ================= BRAZOS ================= */}
      <g>
        <path d="M66 172 Q54 178 52 200 Q52 208 60 208 Q68 206 70 198 Z" fill={c.outfit === "dress" ? c.skin : c.outfitColor} {...S} />
        <path d="M134 172 Q146 178 148 200 Q148 208 140 208 Q132 206 130 198 Z" fill={c.outfit === "dress" ? c.skin : c.outfitColor} {...S} />
        {/* Manos */}
        <circle cx="59" cy="209" r="7" fill={c.skin} {...S} />
        <circle cx="141" cy="209" r="7" fill={c.skin} {...S} />
      </g>

      {/* ================= CUELLO ================= */}
      <rect x="92" y="152" width="16" height="16" rx="4" fill={c.skin} {...S} />

      {/* ================= CABEZA (grande, redonda) ================= */}
      <ellipse cx="100" cy="88" rx="68" ry="72" fill={c.skin} {...S} />

      {/* Rubor gigante estilo chibi */}
      <ellipse cx="60" cy="112" rx="12" ry="8" fill="#FF9BB8" opacity="0.7" />
      <ellipse cx="140" cy="112" rx="12" ry="8" fill="#FF9BB8" opacity="0.7" />

      {/* ================= OJOS ================= */}
      {c.eyes === "normal" && (
        <g>
          {/* Contorno negro */}
          <ellipse cx="76" cy="98" rx="14" ry="19" fill="#2A1B14" />
          <ellipse cx="124" cy="98" rx="14" ry="19" fill="#2A1B14" />
          {/* Iris coloreado */}
          <ellipse cx="76" cy="100" rx="10" ry="15" fill={c.hairColor} />
          <ellipse cx="124" cy="100" rx="10" ry="15" fill={c.hairColor} />
          {/* Brillo grande */}
          <ellipse cx="72" cy="92" rx="5" ry="6" fill="#FFFFFF" />
          <ellipse cx="120" cy="92" rx="5" ry="6" fill="#FFFFFF" />
          {/* Brillo pequeño inferior */}
          <circle cx="80" cy="107" r="2.5" fill="#FFFFFF" />
          <circle cx="128" cy="107" r="2.5" fill="#FFFFFF" />
          {/* Punto de reflejo */}
          <circle cx="68" cy="96" r="1.2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="116" cy="96" r="1.2" fill="#FFFFFF" opacity="0.9" />
          {/* Pestañas */}
          <path d="M62 82 Q66 78 72 80 M90 82 Q86 78 80 80" fill="none" {...thin} />
          <path d="M110 82 Q114 78 120 80 M138 82 Q134 78 128 80" fill="none" {...thin} />
        </g>
      )}
      {c.eyes === "happy" && (
        <g>
          <path d="M62 100 Q76 82 90 100" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M110 100 Q124 82 138 100" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      )}
      {c.eyes === "wink" && (
        <g>
          <ellipse cx="76" cy="98" rx="14" ry="19" fill="#2A1B14" />
          <ellipse cx="76" cy="100" rx="10" ry="15" fill={c.hairColor} />
          <ellipse cx="72" cy="92" rx="5" ry="6" fill="#FFFFFF" />
          <circle cx="80" cy="107" r="2.5" fill="#FFFFFF" />
          <path d="M110 100 Q124 82 138 100" fill="none" stroke="#2A1B14" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      )}
      {c.eyes === "sparkle" && (
        <g>
          <ellipse cx="76" cy="98" rx="14" ry="19" fill="#2A1B14" />
          <ellipse cx="124" cy="98" rx="14" ry="19" fill="#2A1B14" />
          <polygon points="76,84 79,94 89,97 79,100 76,110 73,100 63,97 73,94" fill="#FFFFFF" />
          <polygon points="124,84 127,94 137,97 127,100 124,110 121,100 111,97 121,94" fill="#FFFFFF" />
        </g>
      )}
      {c.eyes === "star" && (
        <g>
          <ellipse cx="76" cy="98" rx="14" ry="14" fill="#F5D488" {...S} />
          <polygon points="76,86 80,94 88,95 82,101 84,109 76,105 68,109 70,101 64,95 72,94" fill="#FFFFFF" />
          <ellipse cx="124" cy="98" rx="14" ry="14" fill="#F5D488" {...S} />
          <polygon points="124,86 128,94 136,95 130,101 132,109 124,105 116,109 118,101 112,95 120,94" fill="#FFFFFF" />
        </g>
      )}
      {c.eyes === "anime-sad" && (
        <g>
          <ellipse cx="76" cy="98" rx="13" ry="17" fill="#2A1B14" />
          <ellipse cx="124" cy="98" rx="13" ry="17" fill="#2A1B14" />
          <ellipse cx="76" cy="100" rx="9" ry="13" fill="#7EAEE0" />
          <ellipse cx="124" cy="100" rx="9" ry="13" fill="#7EAEE0" />
          <ellipse cx="72" cy="92" rx="4" ry="5" fill="#FFFFFF" />
          <ellipse cx="120" cy="92" rx="4" ry="5" fill="#FFFFFF" />
          <path d="M72 118 Q74 128 78 122" fill="#8FB4E8" opacity="0.8" />
          <path d="M120 118 Q122 128 126 122" fill="#8FB4E8" opacity="0.8" />
        </g>
      )}

      {/* Nariz sutil */}
      <path d="M99 118 Q100 122 101 118" fill="none" stroke="#2A1B14" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* ================= BOCA ================= */}
      {c.mood === "happy" && (
        <path d="M92 128 Q100 138 108 128" fill="#B85B7A" stroke="#2A1B14" strokeWidth="2" strokeLinecap="round" />
      )}
      {c.mood === "calm" && (
        <path d="M94 130 Q100 132 106 130" fill="none" stroke="#2A1B14" strokeWidth="2.2" strokeLinecap="round" />
      )}
      {c.mood === "excited" && (
        <path d="M90 126 Q100 144 110 126 Q100 132 90 126 Z" fill="#B85B7A" stroke="#2A1B14" strokeWidth="2" />
      )}
      {c.mood === "thinking" && (
        <path d="M94 130 Q100 126 106 129" fill="none" stroke="#2A1B14" strokeWidth="2.2" strokeLinecap="round" />
      )}
      {c.mood === "surprised" && (
        <ellipse cx="100" cy="130" rx="4" ry="5" fill="#B85B7A" stroke="#2A1B14" strokeWidth="2" />
      )}
      {c.mood === "cool" && (
        <path d="M92 128 Q100 125 108 128" fill="none" stroke="#2A1B14" strokeWidth="2.4" strokeLinecap="round" />
      )}

      {/* ================= CABELLO DELANTERO ================= */}
      {c.hair === "short" && (
        <path d="M34 90 Q30 30 100 22 Q170 30 166 90 Q145 60 128 68 Q114 50 100 58 Q86 50 72 68 Q55 60 34 90 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "long" && (
        <path d="M32 92 Q30 28 100 20 Q170 28 168 92 Q148 62 130 72 Q114 50 100 60 Q86 50 70 72 Q52 62 32 92 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "curly" && (
        <path d="M32 96 C20 60 44 32 72 42 C82 22 118 22 128 42 C156 32 180 60 168 96 C150 74 136 82 122 68 C108 54 92 54 78 68 C64 82 50 74 32 96 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "ponytail" && (
        <path d="M34 90 Q30 30 100 22 Q170 30 166 90 Q145 60 128 68 Q114 50 100 58 Q86 50 72 68 Q55 60 34 90 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "buns" && (
        <>
          <circle cx="46" cy="40" r="22" fill={c.hairColor} {...S} />
          <circle cx="154" cy="40" r="22" fill={c.hairColor} {...S} />
          <path d="M40 88 Q34 40 100 32 Q166 40 160 88 Q142 62 126 70 Q112 52 100 60 Q88 52 74 70 Q58 62 40 88 Z" fill={c.hairColor} {...S} />
        </>
      )}
      {c.hair === "spiky" && (
        <path d="M34 92 L28 62 L48 68 L58 42 L76 58 L100 30 L124 58 L142 42 L152 68 L172 62 L166 92 Q100 68 34 92 Z" fill={c.hairColor} {...S} />
      )}
      {c.hair === "braids" && (
        <path d="M34 90 Q30 30 100 22 Q170 30 166 90 Q145 60 128 68 Q114 50 100 58 Q86 50 72 68 Q55 60 34 90 Z" fill={c.hairColor} {...S} />
      )}

      {/* ================= ACCESORIOS ================= */}
      {c.accessory === "glasses" && (
        <g>
          <circle cx="76" cy="100" r="18" fill="none" stroke="#2A1B14" strokeWidth="3" />
          <circle cx="124" cy="100" r="18" fill="none" stroke="#2A1B14" strokeWidth="3" />
          <line x1="94" y1="100" x2="106" y2="100" stroke="#2A1B14" strokeWidth="3" />
        </g>
      )}
      {c.accessory === "cap" && (
        <g>
          <path d="M36 56 Q100 8 164 56 Q140 42 100 42 Q60 42 36 56 Z" fill="#E85D75" {...S} />
          <path d="M140 54 Q186 56 194 66 L156 62 Z" fill="#C4425A" {...S} />
        </g>
      )}
      {c.accessory === "headphones" && (
        <g>
          <path d="M34 88 Q34 22 100 20 Q166 22 166 88" fill="none" stroke="#8B7EF1" strokeWidth="8" strokeLinecap="round" />
          <rect x="24" y="82" width="18" height="30" rx="8" fill="#8B7EF1" {...S} />
          <rect x="158" y="82" width="18" height="30" rx="8" fill="#8B7EF1" {...S} />
        </g>
      )}
      {c.accessory === "earrings" && (
        <>
          <circle cx="32" cy="115" r="5" fill="#F5C842" {...S} />
          <circle cx="168" cy="115" r="5" fill="#F5C842" {...S} />
        </>
      )}
      {c.accessory === "scarf" && (
        <path d="M64 152 Q100 168 136 152 Q142 178 124 180 L118 200 L108 200 L112 182 Q100 184 88 182 L92 200 L82 200 L76 180 Q58 178 64 152 Z" fill="#FE5F55" {...S} />
      )}
      {c.accessory === "crown" && (
        <g>
          <polygon points="58,32 70,12 84,28 100,6 116,28 130,12 142,32" fill="#F5D488" {...S} />
          <circle cx="70" cy="14" r="2.5" fill="#FE5F55" />
          <circle cx="100" cy="8" r="2.5" fill="#7EAEE0" />
          <circle cx="130" cy="14" r="2.5" fill="#B0DFC9" />
        </g>
      )}
    </svg>
  );
}
