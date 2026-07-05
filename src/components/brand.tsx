import logoUrl from "@/assets/hey-ely-logo.png";
import mascotaUrl from "@/assets/ely-mascota.png";

export function ElyLogo({ className = "" }: { className?: string }) {
  return <img src={logoUrl} alt="Hey Ely" className={className} draggable={false} />;
}

export function ElyMascot({
  className = "",
  animated = true,
}: { className?: string; animated?: boolean }) {
  return (
    <img
      src={mascotaUrl}
      alt="Ely, tu mascota"
      className={`${animated ? "animate-bob" : ""} ${className}`}
      draggable={false}
    />
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logoUrl} alt="Hey Ely" width={size} height={size} className="rounded-2xl" />
      <span className="font-display text-xl font-extrabold text-gradient-ely">Hey Ely</span>
    </div>
  );
}
