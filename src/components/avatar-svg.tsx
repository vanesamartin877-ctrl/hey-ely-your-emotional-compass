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
    <svg viewBox="0 0 200 220" width={size} height={size} className="drop-shadow-md">
      {/* body */}
      <path d={c.outfit === "dress"
        ? "M60 200 Q100 130 140 200 Z"
        : "M55 210 L55 160 Q55 140 75 138 L125 138 Q145 140 145 160 L145 210 Z"}
        fill={c.outfitColor} />
      {c.outfit === "hoodie" && (
        <path d="M75 138 Q100 120 125 138 L125 150 L75 150 Z" fill={c.outfitColor} opacity="0.85" />
      )}
      {/* neck */}
      <rect x="90" y="118" width="20" height="22" fill={c.skin} />
      {/* head */}
      <ellipse cx="100" cy="90" rx="42" ry="46" fill={c.skin} />
      {/* hair */}
      {c.hair === "short" && <path d="M58 82 Q60 40 100 40 Q140 40 142 82 L142 68 Q120 55 100 55 Q80 55 58 68 Z" fill={c.hairColor} />}
      {c.hair === "long" && <>
        <path d="M56 90 Q56 40 100 40 Q144 40 144 90 L144 140 L128 140 L128 90 Q128 68 100 68 Q72 68 72 90 L72 140 L56 140 Z" fill={c.hairColor} />
      </>}
      {c.hair === "curly" && <>
        <circle cx="70" cy="55" r="18" fill={c.hairColor} />
        <circle cx="100" cy="45" r="20" fill={c.hairColor} />
        <circle cx="130" cy="55" r="18" fill={c.hairColor} />
        <circle cx="60" cy="80" r="14" fill={c.hairColor} />
        <circle cx="140" cy="80" r="14" fill={c.hairColor} />
      </>}
      {c.hair === "ponytail" && <>
        <path d="M58 82 Q60 40 100 40 Q140 40 142 82 Z" fill={c.hairColor} />
        <ellipse cx="150" cy="110" rx="14" ry="28" fill={c.hairColor} transform="rotate(15 150 110)" />
      </>}
      {c.hair === "buns" && <>
        <path d="M58 82 Q60 50 100 50 Q140 50 142 82 Z" fill={c.hairColor} />
        <circle cx="65" cy="52" r="14" fill={c.hairColor} />
        <circle cx="135" cy="52" r="14" fill={c.hairColor} />
      </>}
      {/* eyes */}
      {c.eyes === "normal" && <>
        <circle cx="84" cy="92" r="4" fill="#2C1810" />
        <circle cx="116" cy="92" r="4" fill="#2C1810" />
      </>}
      {c.eyes === "happy" && <>
        <path d="M78 94 Q84 88 90 94" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 94 Q116 88 122 94" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>}
      {c.eyes === "wink" && <>
        <circle cx="84" cy="92" r="4" fill="#2C1810" />
        <path d="M110 94 Q116 88 122 94" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>}
      {c.eyes === "sparkle" && <>
        <circle cx="84" cy="92" r="5" fill="#2C1810" />
        <circle cx="86" cy="90" r="1.5" fill="#fff" />
        <circle cx="116" cy="92" r="5" fill="#2C1810" />
        <circle cx="118" cy="90" r="1.5" fill="#fff" />
      </>}
      {/* blush */}
      <circle cx="76" cy="104" r="6" fill="#F3B4C6" opacity="0.6" />
      <circle cx="124" cy="104" r="6" fill="#F3B4C6" opacity="0.6" />
      {/* mouth */}
      {c.mood === "happy" && <path d="M88 112 Q100 122 112 112" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {c.mood === "calm" && <path d="M90 114 L110 114" stroke="#2C1810" strokeWidth="3" strokeLinecap="round" />}
      {c.mood === "excited" && <ellipse cx="100" cy="115" rx="8" ry="6" fill="#7a3a3a" />}
      {c.mood === "thinking" && <path d="M92 116 Q100 112 108 116" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {/* accessory */}
      {c.accessory === "glasses" && <>
        <circle cx="84" cy="92" r="10" stroke="#2C1810" strokeWidth="2.5" fill="none" />
        <circle cx="116" cy="92" r="10" stroke="#2C1810" strokeWidth="2.5" fill="none" />
        <line x1="94" y1="92" x2="106" y2="92" stroke="#2C1810" strokeWidth="2.5" />
      </>}
      {c.accessory === "cap" && <path d="M56 68 Q100 40 144 68 L144 76 L56 76 Z" fill="#7A9AC9" />}
      {c.accessory === "headphones" && <>
        <path d="M58 78 Q58 50 100 50 Q142 50 142 78" stroke="#8B7EF1" strokeWidth="6" fill="none" />
        <rect x="52" y="76" width="14" height="20" rx="6" fill="#8B7EF1" />
        <rect x="134" y="76" width="14" height="20" rx="6" fill="#8B7EF1" />
      </>}
      {c.accessory === "earrings" && <>
        <circle cx="58" cy="100" r="3" fill="#F5C842" />
        <circle cx="142" cy="100" r="3" fill="#F5C842" />
      </>}
    </svg>
  );
}
