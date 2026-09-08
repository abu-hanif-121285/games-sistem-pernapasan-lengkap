import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useGame } from "../game/store";
import { Oxi, type OxiMood } from "./Art";

const VARIANTS: Record<string, string> = {
  primary: "from-amber-300 to-orange-500 text-white border-amber-100 shadow-orange-500/40",
  success: "from-lime-400 to-green-600 text-white border-lime-100 shadow-green-500/40",
  warn: "from-yellow-300 to-amber-500 text-amber-950 border-yellow-100 shadow-amber-400/40",
  danger: "from-rose-400 to-red-600 text-white border-rose-100 shadow-rose-500/40",
  violet: "from-violet-400 to-fuchsia-600 text-white border-violet-100 shadow-violet-500/40",
  ghost: "from-white to-sky-50 text-sky-800 border-white shadow-sky-300/30",
};

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof VARIANTS; size?: "sm" | "md" | "lg" | "xl" }) {
  const { sfx } = useGame();
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-xl",
    md: "px-5 py-3 text-base rounded-2xl",
    lg: "px-7 py-4 text-lg rounded-2xl",
    xl: "px-8 py-5 text-xl sm:text-2xl rounded-3xl",
  }[size];
  return (
    <button
      {...rest}
      onClick={(e) => {
        sfx("click");
        rest.onClick?.(e);
      }}
      className={`btn3d font-display font-bold no-select border-b-4 bg-gradient-to-b shadow-lg ${VARIANTS[variant]} ${sizes} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconBtn({
  children,
  label,
  active = true,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={`btn3d grid h-9 w-9 place-items-center rounded-full border-2 text-base sm:h-10 sm:w-10 ${
        active ? "border-white/70 bg-white/25 text-white" : "border-white/30 bg-white/10 text-white/50"
      }`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

export function Background() {
  const g = useGame();
  const img =
    g.screen === "splash" || g.screen === "name"
      ? `${import.meta.env.BASE_URL}images/splash-bg.jpg`
      : g.screen === "map"
        ? `${import.meta.env.BASE_URL}images/map-bg.jpg`
        : `${import.meta.env.BASE_URL}images/home-bg.jpg`;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300/25 via-transparent to-emerald-400/25" />
    </div>
  );
}

export function TopHUD({
  onBack,
  showLives = false,
  onPause,
  onHelp,
  title,
}: {
  onBack?: () => void;
  showLives?: boolean;
  onPause?: () => void;
  onHelp?: () => void;
  title?: string;
}) {
  const g = useGame();
  return (
    <div className="sticky top-0 z-40 w-full px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="hud-bar mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-1.5 rounded-full px-2 py-1.5 sm:gap-3 sm:px-3">
        {onBack && (
          <button onClick={onBack} className="btn3d rounded-full border-2 border-white/60 bg-white/20 px-2.5 py-1 text-xs font-bold sm:text-sm">
            ←
          </button>
        )}
        <div className="flex min-w-0 items-center gap-1.5">
          <img src={`${import.meta.env.BASE_URL}images/oxi.png`} alt="" className="h-8 w-8 rounded-full border-2 border-white bg-sky-200 object-cover sm:h-9 sm:w-9" />
          <span className="max-w-[92px] truncate font-display text-sm font-bold text-white sm:max-w-[180px] sm:text-base">
            {g.data.name || "Penjelajah"}
          </span>
        </div>

        <div className="flex items-center gap-0.5 rounded-full bg-white/20 px-1.5 py-0.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`text-sm sm:text-base ${i < (showLives ? g.lives : 3) ? "" : "opacity-25 grayscale"}`}>
              ❤️
            </span>
          ))}
        </div>

        <Stat icon="⭐" value={g.totalStars} />
        <Stat icon="🪙" value={g.data.coins} />
        <Stat icon="⚡" value={g.data.xp} label="XP" />

        <div className="ml-auto flex items-center gap-1.5">
          {onHelp && (
            <IconBtn label="Bantuan" onClick={onHelp}>
              ❓
            </IconBtn>
          )}
          <IconBtn label={g.settings.sfx ? "Matikan suara" : "Nyalakan suara"} active={g.settings.sfx} onClick={g.toggleSfx}>
            {g.settings.sfx ? "🔊" : "🔇"}
          </IconBtn>
          {onPause && (
            <IconBtn label="Jeda" onClick={onPause}>
              ⏸️
            </IconBtn>
          )}
        </div>
      </div>
      {title && <div className="mx-auto mt-2 max-w-5xl px-1 font-display text-sm text-sky-900">{title}</div>}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-display text-sm font-bold text-white sm:text-base">
      <span>{icon}</span>
      {label && <span className="text-[10px] opacity-90 sm:text-xs">{label}</span>}
      <span>{value}</span>
    </div>
  );
}

export function OxiSpeech({
  text,
  mood = "happy",
  size = 84,
  className = "",
  compact = false,
}: {
  text: string;
  mood?: OxiMood;
  size?: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className="anim-bob shrink-0">
        <Oxi size={size} mood={mood} />
      </div>
      <div className={`speech relative rounded-3xl ${compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm sm:text-base"} font-bold leading-snug`}>
        <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-3 border-l-3 border-sky-300 bg-white" />
        {text}
      </div>
    </div>
  );
}

export function FXLayer() {
  const { particles, floats, confetti } = useGame();
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 12px ${p.color}`,
              ["--dx" as string]: `${p.dx}px`,
              ["--dy" as string]: `${p.dy}px`,
              ["--dur" as string]: `${p.dur}ms`,
            } as React.CSSProperties
          }
        />
      ))}
      {floats.map((f) => (
        <span key={f.id} className="float-text font-display text-base sm:text-xl" style={{ left: f.x, top: f.y, color: f.color }}>
          {f.text}
        </span>
      ))}
      <ConfettiCanvas trigger={confetti} />
    </>
  );
}

type Piece = { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number; life: number };

function ConfettiCanvas({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pieces = useRef<Piece[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (trigger === 0) return;
    const colors = ["#22d3ee", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#f87171", "#fde68a"];
    const w = window.innerWidth;
    for (let i = 0; i < 150; i++) {
      pieces.current.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 240,
        vx: (Math.random() - 0.5) * 2.4,
        vy: 2 + Math.random() * 3.6,
        r: 5 + Math.random() * 7,
        c: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        life: 1,
      });
    }
  }, [trigger]);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = window.innerWidth + "px";
      cvs.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const h = window.innerHeight;
      pieces.current = pieces.current.filter((p) => p.y < h + 40 && p.life > 0);
      for (const p of pieces.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.95;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[85]" />;
}

export function Modal({
  open,
  children,
  onClose,
  wide = false,
}: {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-sky-950/45 p-3 backdrop-blur-sm anim-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`anim-pop panel my-auto w-full p-4 sm:p-6 ${wide ? "max-w-3xl" : "max-w-lg"}`}>
        {children}
      </div>
    </div>
  );
}

export function TimerBar({ value, max, danger = false }: { value: number; max: number; danger?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-sky-100 ring-1 ring-sky-200">
      <div
        className={`h-full rounded-full transition-[width] duration-200 ${
          danger || pct < 25 ? "bg-gradient-to-r from-rose-500 to-red-400" : "bg-gradient-to-r from-lime-400 to-emerald-400"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const NAV = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "map", icon: "🗺️", label: "Main" },
  { key: "learn", icon: "📚", label: "Belajar" },
  { key: "badges", icon: "🏆", label: "Badge" },
  { key: "scores", icon: "📊", label: "Nilai" },
  { key: "settings", icon: "⚙️", label: "Atur" },
] as const;

export function BottomNav() {
  const g = useGame();
  const hidden = ["splash", "name", "level", "certificate", "home"];
  if (hidden.includes(g.screen)) return null;
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <nav className="flex w-full max-w-lg items-center justify-between gap-0.5 rounded-2xl border-2 border-white bg-white/90 px-1.5 py-1.5 shadow-lg">
        {NAV.map((n) => {
          const active = g.screen === n.key;
          return (
            <button
              key={n.key}
              onClick={() => g.go(n.key)}
              className={`btn3d flex flex-1 flex-col items-center rounded-xl px-1 py-1.5 transition ${
                active ? "bg-sky-400 text-white" : "text-sky-800"
              }`}
            >
              <span className="text-lg leading-none">{n.icon}</span>
              <span className="mt-0.5 font-display text-[10px] font-bold">{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    rose: "bg-rose-100 text-rose-800 border-rose-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
  };
  return <span className={`rounded-full border px-3 py-1 font-display text-xs font-bold sm:text-sm ${tones[tone]}`}>{children}</span>;
}
