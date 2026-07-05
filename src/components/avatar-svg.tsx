import { useMemo } from "react";

export type AvatarConfig = {
  skin?: string;
  hair?: string;
  hairColor?: string;
  eyes?: string;
  outfit?: string;
  outfitColor?: string;
  accessory?: string;
  mood?: "happy" | "calm" | "excited" | "thinking";
};

export const AVATAR_OPTIONS = {
  skin: ["#F5D6BA", "#EAC199", "#D9A574", "#B67F4F", "#8A5A3B", "#5C3A22"],
  hair: ["short", "long", "curly", "ponytail", "buns", "bald"],
  hairColor: ["#2C1810", "#5C3A22", "#B67F4F", "#E8B860", "#C97A9A", "#7A9AC9", "#9A7AC9"],
  eyes: ["normal", "happy", "wink", "sparkle"],
  outfit: ["hoodie", "tee", "jacket", "dress"],
  outfitColor: ["#8FB4E8", "#F3B4C6", "#B0DFC9", "#C7B4EA", "#F5D488", "#F19B84"],
  accessory: ["none", "glasses", "cap", "headphones", "earrings"],
} as const;

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

  return (
    <svg 
      viewBox="0 0 200 200" 
      width={size} 
      height={size} 
      className="drop-shadow-md w-full h-full object-contain block"
    >
      {/* Fondo base invisible para forzar el enmarcado seguro de previsualización */}
      <rect width="200" height="200" fill="none" />

      {/* body */}
      {c.outfit === "dress" ? (
        <path d="M50 200 Q100 120 150 200 Z" fill={c.outfitColor} />
      ) : (
        <path d="M45 200 L45 165 Q45 140 70 138 L130 138 Q155 140 155 165 L155 200 Z" fill={c.outfitColor} />
      )}
      
      {c.outfit === "hoodie" && (
        <path d="M70 138 Q100 120 130 138 L125 155 L75 155 Z" fill={c.outfitColor} opacity="0.85" />
      )}

      {/* neck */}
      <rect x="90" y="115" width="20" height="25" fill={c.skin} />

      {/* head */}
      <ellipse cx="100" cy="85" rx="42" ry="45" fill={c.skin} />

      {/* hair */}
      {c.hair === "short" && <path d="M58 77 Q60 35 100 35 Q140 35 142 77 L142 63 Q120 50 100 50 Q80 50 58 63 Z" fill={c.hairColor} />}
      {c.hair === "long" && (
        <path d="M56 85 Q56 35 100 35 Q144 35 144 85 L144 140 L128 140 L128 85 Q128 63 100 63 Q72 63 72 85 L72 140 L56 140 Z" fill={c.hairColor} />
      )}
      {c.hair === "curly" && (
        <>
          <circle cx="70" cy="50" r="18" fill={c.hairColor} />
          <circle cx="100" cy="40" r="20" fill={c.hairColor} />
          <circle cx="130" cy="50" r="18" fill={c.hairColor} />
          <circle cx="60" cy="75" r="14" fill={c.hairColor} />
          <circle cx="140" cy="75" r="14" fill={c.hairColor} />
        </>
      )}
      {c.hair === "ponytail" && (
        <>
          <path d="M58 77 Q60 35 100 35 Q140 35 142 77 Z" fill={c.hairColor} />
          <ellipse cx="150" cy="105" rx="14" ry="28" fill={c.hairColor} transform="rotate(15 150 105)" />
        </>
      )}
      {c.hair === "buns" && (
        <>
          <path d="M58 77 Q60 45 100 45 Q140 45 142 77 Z" fill={c.hairColor} />
          <circle cx="65" cy="47" r="14" fill={c.hairColor} />
          <circle cx="135" cy="47" r="14" fill={c.hairColor} />
        </>
      )}

      {/* eyes */}
      {c.eyes === "normal" && (
        <>
          <circle cx="84" cy="87" r="4" fill="#2C1810" />
          <circle cx="116" cy="87" r="4" fill="#2C1810" />
        </>
      )}
      {c.eyes === "happy" && (
        <>
          <path d="M78 89 Q84 83 90 89" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M110 89 Q116 83 122 89" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {c.eyes === "wink" && (
        <>
          <circle cx="84" cy="87" r="4" fill="#2C1810" />
          <path d="M110 89 Q116 83 122 89" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {c.eyes === "sparkle" && (
        <>
          <circle cx="84" cy="87" r="5" fill="#2C1810" />
          <circle cx="86" cy="85" r="1.5" fill="#fff" />
          <circle cx="116" cy="87" r="5" fill="#2C1810" />
          <circle cx="118" cy="85" r="1.5" fill="#fff" />
        </>
      )}

      {/* blush */}
      <circle cx="76" cy="99" r="6" fill="#F3B4C6" opacity="0.6" />
      <circle cx="124" cy="99" r="6" fill="#F3B4C6" opacity="0.6" />

      {/* mouth */}
      {c.mood === "happy" && <path d="M88 107 Q100 117 112 107" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {c.mood === "calm" && <path d="M90 109 L110 109" stroke="#2C1810" strokeWidth="3" strokeLinecap="round" />}
      {c.mood === "excited" && <ellipse cx="100" cy="110" rx="8" ry="6" fill="#7a3a3a" />}
      {c.mood === "thinking" && <path d="M92 111 Q100 107 108 111" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />}

      {/* accessory */}
      {c.accessory === "glasses" && (
        <>
          <circle cx="84" cy="87" r="10" stroke="#2C1810" strokeWidth="2.5" fill="none" />
          <circle cx="116" cy="87" r="10" stroke="#2C1810" strokeWidth="2.5" fill="none" />
          <line x1="94" y1="87" x2="106" y2="87" stroke="#2C1810" strokeWidth="2.5" />
        </>
      )}
      {c.accessory === "cap" && <path d="M56 63 Q100 35 144 63 L144 71 L56 71 Z" fill="#7A9AC9" />}
      {c.accessory === "headphones" && (
        <>
          <path d="M58 73 Q58 45 100 45 Q142 45 142 73" stroke="#8B7EF1" strokeWidth="6" fill="none" />
          <rect x="52" y="71" width="14" height="20" rx="6" fill="#8B7EF1" />
          <rect x="134" y="71" width="14" height="20" rx="6" fill="#8B7EF1" />
        </>
      )}
      {c.accessory === "earrings" && (
        <>
          <circle cx="58" cy="95" r="3" fill="#F5C842" />
          <circle cx="142" cy="95" r="3" fill="#F5C842" />
        </>
      )}
    </svg>
  );
}
