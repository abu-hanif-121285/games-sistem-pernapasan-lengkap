import { memo } from "react";
import { ORGANS, type OrganId } from "../game/content";

export type OxiMood = "happy" | "excited" | "think" | "sad" | "wow";

export function Sprite({
  src,
  alt,
  size,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`pointer-events-none select-none object-contain ${className}`}
      style={size ? { width: size, height: Math.round(size * 1.28) } : undefined}
    />
  );
}

export const Oxi = memo(function Oxi({
  size = 96,
  mood = "happy",
  className = "",
}: {
  size?: number;
  mood?: OxiMood;
  className?: string;
}) {
  void mood;
  return <Sprite src={`${import.meta.env.BASE_URL}images/oxi.png`} alt="OXI si molekul oksigen" size={size} className={className} />;
});

export function CharBoy({ size = 140, className = "" }: { size?: number; className?: string }) {
  return <Sprite src={`${import.meta.env.BASE_URL}images/boy.png`} alt="Siswa laki-laki" size={size} className={className} />;
}

export function CharGirl({ size = 140, className = "" }: { size?: number; className?: string }) {
  return <Sprite src={`${import.meta.env.BASE_URL}images/girl.png`} alt="Siswa perempuan" size={size} className={className} />;
}

/** Posisi nomor pada foto paru-paru (persen). */
const MARKERS: { id: OrganId; no: number; left: string; top: string }[] = [
  { id: "hidung", no: 1, left: "49%", top: "7%" },
  { id: "faring", no: 2, left: "54%", top: "15%" },
  { id: "laring", no: 3, left: "50%", top: "21%" },
  { id: "trakea", no: 4, left: "50%", top: "31%" },
  { id: "bronkus", no: 5, left: "40%", top: "41%" },
  { id: "bronkiolus", no: 6, left: "30%", top: "51%" },
  { id: "alveolus", no: 7, left: "26%", top: "61%" },
  { id: "paru", no: 8, left: "70%", top: "48%" },
  { id: "diafragma", no: 9, left: "50%", top: "73%" },
];

export function RespiratoryDiagram({
  activeNo,
  solved = [],
  onPick,
  showLabels = false,
  className = "",
}: {
  activeNo?: number;
  solved?: number[];
  onPick?: (id: OrganId) => void;
  showLabels?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ aspectRatio: "3 / 4" }}>
      <img src={`${import.meta.env.BASE_URL}images/lungs.png`} alt="Sistem pernapasan manusia" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      {MARKERS.map((m) => {
        const organ = ORGANS.find((o) => o.id === m.id)!;
        const active = activeNo === m.no;
        const done = solved.includes(m.no);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onPick?.(m.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: m.left, top: m.top }}
            aria-label={organ.nama}
          >
            {active && <span className="anim-ring absolute inset-[-8px] rounded-full bg-amber-300/50" />}
            <span
              className={`relative grid h-7 w-7 place-items-center rounded-full border-[3px] font-display text-xs font-extrabold shadow-md sm:h-8 sm:w-8 sm:text-sm ${
                active
                  ? "border-white bg-amber-400 text-slate-900"
                  : done
                    ? "border-white bg-emerald-400 text-slate-900"
                    : "border-white bg-sky-500 text-white"
              }`}
            >
              {m.no}
            </span>
            {showLabels && (
              <span className="absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 font-display text-[10px] font-extrabold text-sky-800 shadow sm:text-xs">
                {organ.nama.split(" (")[0]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function BreathingScene({ phase, className = "" }: { phase: "in" | "out"; className?: string }) {
  const inhale = phase === "in";
  const T = "transform 1.25s cubic-bezier(0.4,0,0.2,1)";
  return (
    <svg viewBox="0 0 360 380" className={className} role="img" aria-label="Animasi paru-paru dan diafragma">
      <defs>
        <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="chest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(186,230,253,0.55)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0.2)" />
        </linearGradient>
      </defs>

      <g style={{ transition: T, transform: inhale ? "scale(1.07)" : "scale(1)", transformOrigin: "180px 210px" }}>
        <path d="M78 120 C60 170 58 260 74 310 L286 310 C302 260 300 170 282 120 Z" fill="url(#chest)" stroke="#7dd3fc" strokeWidth="3" />
        <g stroke="rgba(14,116,144,0.35)" strokeWidth="5" fill="none" strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M170 ${140 + i * 40} C 130 ${142 + i * 40} 96 ${160 + i * 40} 84 ${190 + i * 36}`} />
              <path d={`M190 ${140 + i * 40} C 230 ${142 + i * 40} 264 ${160 + i * 40} 276 ${190 + i * 36}`} />
            </g>
          ))}
        </g>
      </g>

      <rect x="164" y="30" width="32" height="86" rx="12" fill="#67e8f9" stroke="#0891b2" strokeWidth="2.5" />
      {[44, 58, 72, 86, 100].map((y) => (
        <path key={y} d={`M167 ${y} h26`} stroke="#0e7490" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      ))}
      <path d="M174 112 L134 140" stroke="#22d3ee" strokeWidth="14" strokeLinecap="round" />
      <path d="M186 112 L226 140" stroke="#22d3ee" strokeWidth="14" strokeLinecap="round" />

      <g style={{ transition: T, transform: inhale ? "scale(1.13)" : "scale(0.95)", transformOrigin: "180px 200px" }}>
        <path
          d="M172 124 C138 124 112 148 102 184 C92 220 92 254 104 268 C116 282 150 280 162 264 C170 252 172 224 172 190 Z"
          fill="url(#lg2)"
          stroke="#be123c"
          strokeWidth="3"
        />
        <path
          d="M188 124 C222 124 248 148 258 184 C268 220 268 254 256 268 C244 282 210 280 198 264 C190 252 188 224 188 190 Z"
          fill="url(#lg2)"
          stroke="#be123c"
          strokeWidth="3"
        />
      </g>

      <g style={{ transition: T, transform: inhale ? "translateY(26px) scaleY(0.45)" : "translateY(0) scaleY(1)", transformOrigin: "180px 300px" }}>
        <path d="M70 296 C120 352 240 352 290 296" stroke="#fb7185" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M70 296 C120 352 240 352 290 296" stroke="#fecdd3" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.75" />
      </g>
      <text x="180" y="368" textAnchor="middle" fontSize="17" fontWeight="800" fill="#be123c" fontFamily="Baloo 2, sans-serif">
        DIAFRAGMA {inhale ? "TURUN ⬇" : "NAIK ⬆"}
      </text>

      <g opacity="0.95">
        <path d={inhale ? "M180 4 L180 26" : "M180 26 L180 4"} stroke="#059669" strokeWidth="6" strokeLinecap="round" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 Z" fill="#059669" />
          </marker>
        </defs>
      </g>
    </svg>
  );
}

export function AlveolusBackdrop({ className = "" }: { className?: string }) {
  return <img src={`${import.meta.env.BASE_URL}images/alveolus.png`} alt="" className={`object-cover ${className}`} draggable={false} />;
}

export function MonsterPolusi({ size = 220, hurt = false }: { size?: number; hurt?: boolean; angry?: boolean }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/monster.png`}
      alt="Monster Polusi"
      width={size}
      height={Math.round(size * 1.2)}
      className={`object-contain ${hurt ? "anim-shake" : "anim-float-slow"}`}
      draggable={false}
    />
  );
}

export function StarRow({ value, size = 26 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{ fontSize: size, filter: i <= value ? "drop-shadow(0 0 6px rgba(251,191,36,.9))" : "grayscale(1) opacity(.35)" }}
          className={i <= value ? "anim-pop" : ""}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
