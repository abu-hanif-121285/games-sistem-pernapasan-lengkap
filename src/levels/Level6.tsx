import { useEffect, useRef, useState } from "react";
import { LEVEL6_QUIZ } from "../game/content";
import { useGame } from "../game/store";
import { QuizBlock } from "../components/Quiz";
import { Btn, Card, Chip, OxiSpeech, TimerBar } from "../components/UI";

type Item = { x: number; y: number; vy: number; good: boolean; icon: string; r: number; rot: number; vr: number };
type P = { x: number; y: number; vx: number; vy: number; life: number; c: string; r: number };
type Pop = { x: number; y: number; text: string; life: number; c: string };

const GOOD = ["O₂", "🌿", "💧", "😷", "🍎"];
const BAD = ["🚬", "🌫️", "🏭", "🗑️"];
const DURATION = 45;

export default function Level6() {
  const g = useGame();
  const [stage, setStage] = useState<"intro" | "play" | "quiz">("intro");
  const [hud, setHud] = useState({ caught: 0, hit: 0, time: DURATION, combo: 0 });
  const [qi, setQi] = useState(0);
  const [qc, setQc] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gRef = useRef(g);
  gRef.current = g;
  const state = useRef({
    W: 360,
    H: 480,
    px: 180,
    ptx: 180,
    items: [] as Item[],
    parts: [] as P[],
    pops: [] as Pop[],
    caught: 0,
    hit: 0,
    combo: 0,
    time: DURATION,
    spawn: 0,
    flash: 0,
    shake: 0,
    running: false,
    keys: new Set<string>(),
    last: 0,
  });

  const finishArcade = () => {
    state.current.running = false;
    setStage("quiz");
    g.sfx("levelup");
  };

  /* ---------- loop ---------- */
  useEffect(() => {
    if (stage !== "play") return;
    const cvs = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const S = state.current;
    S.running = true;
    S.last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      S.W = rect.width;
      S.H = rect.height;
      cvs.width = rect.width * dpr;
      cvs.height = rect.height * dpr;
      cvs.style.width = rect.width + "px";
      cvs.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S.px = Math.min(Math.max(S.px, 40), S.W - 40);
      S.ptx = S.px;
    };
    resize();
    window.addEventListener("resize", resize);

    const kd = (e: KeyboardEvent) => {
      S.keys.add(e.key.toLowerCase());
      if (["arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const ku = (e: KeyboardEvent) => S.keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const pointer = (e: PointerEvent) => {
      const rect = cvs.getBoundingClientRect();
      S.ptx = Math.min(Math.max(e.clientX - rect.left, 36), S.W - 36);
    };
    cvs.addEventListener("pointermove", pointer);
    cvs.addEventListener("pointerdown", pointer);

    const spawnItem = () => {
      const t = 1 - S.time / DURATION;
      const good = Math.random() < 0.58;
      const icon = good ? GOOD[(Math.random() * GOOD.length) | 0] : BAD[(Math.random() * BAD.length) | 0];
      S.items.push({
        x: 32 + Math.random() * Math.max(10, S.W - 64),
        y: -30,
        vy: 105 + Math.random() * 70 + t * 130,
        good,
        icon,
        r: 19,
        rot: (Math.random() - 0.5) * 0.6,
        vr: (Math.random() - 0.5) * 1.6,
      });
    };

    const burstP = (x: number, y: number, colors: string[], n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 190;
        S.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0.6 + Math.random() * 0.4, c: colors[i % colors.length], r: 2 + Math.random() * 4 });
      }
    };

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - S.last) / 1000);
      S.last = now;
      if (!S.running) return;

      const paused = gRef.current.paused || gRef.current.gameOver;
      if (!paused) {
        /* input */
        const sp = 460;
        if (S.keys.has("arrowleft") || S.keys.has("a")) S.ptx -= sp * dt;
        if (S.keys.has("arrowright") || S.keys.has("d")) S.ptx += sp * dt;
        S.ptx = Math.min(Math.max(S.ptx, 36), S.W - 36);
        S.px += (S.ptx - S.px) * Math.min(1, dt * 16);

        /* waktu & spawn */
        S.time = Math.max(0, S.time - dt);
        S.spawn -= dt;
        if (S.spawn <= 0) {
          spawnItem();
          S.spawn = Math.max(0.34, 0.95 - (1 - S.time / DURATION) * 0.55);
        }

        /* item */
        const py = S.H - 54;
        for (const it of S.items) {
          it.y += it.vy * dt;
          it.rot += it.vr * dt;
          const dx = it.x - S.px;
          const dy = it.y - py;
          if (Math.abs(dx) < 40 && Math.abs(dy) < 34) {
            it.y = 9999;
            if (it.good) {
              S.caught++;
              S.combo++;
              const bonus = S.combo >= 5 ? 3 : S.combo >= 3 ? 2 : 1;
              gRef.current.addXp(20 * bonus);
              gRef.current.addCoins(2);
              gRef.current.sfx(S.combo >= 3 ? "coin" : "pop");
              burstP(it.x, it.y, ["#34d399", "#22d3ee", "#a7f3d0", "#fbbf24"], 16);
              S.pops.push({ x: it.x, y: it.y, text: S.combo >= 3 ? `COMBO x${S.combo}! +${20 * bonus}` : `+${20 * bonus}`, life: 0.9, c: "#bbf7d0" });
            } else {
              S.hit++;
              S.combo = 0;
              S.flash = 1;
              S.shake = 14;
              burstP(it.x, it.y, ["#fb7185", "#f97316", "#94a3b8"], 18);
              S.pops.push({ x: it.x, y: it.y, text: "POLUSI! -1 ❤️", life: 1, c: "#fecaca" });
              gRef.current.loseLife();
            }
          } else if (it.y > S.H + 40) {
            it.y = 9999;
            if (it.good) S.combo = 0;
          }
        }
        S.items = S.items.filter((i) => i.y < 9000);

        for (const p of S.parts) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 620 * dt;
          p.life -= dt;
        }
        S.parts = S.parts.filter((p) => p.life > 0);
        for (const p of S.pops) {
          p.y -= 42 * dt;
          p.life -= dt;
        }
        S.pops = S.pops.filter((p) => p.life > 0);
        S.flash = Math.max(0, S.flash - dt * 2.4);
        S.shake = Math.max(0, S.shake - dt * 40);

        if (S.time <= 0) {
          S.running = false;
          window.setTimeout(finishArcade, 100);
        }
      }

      /* ---------- render ---------- */
      const { W, H } = S;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (S.shake > 0) ctx.translate((Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake);

      // langit
      const grd = ctx.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, "#0b2a4a");
      grd.addColorStop(0.6, "#0e3b5e");
      grd.addColorStop(1, "#07223d");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // garis lantai
      ctx.strokeStyle = "rgba(125,211,252,0.25)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, H - 22);
      ctx.lineTo(W, H - 22);
      ctx.stroke();

      // item
      for (const it of S.items) {
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        ctx.beginPath();
        ctx.fillStyle = it.good ? "rgba(52,211,153,0.22)" : "rgba(248,113,113,0.2)";
        ctx.arc(0, 0, it.r + 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = it.good ? "rgba(167,243,208,0.85)" : "rgba(254,205,211,0.75)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.font = `${it.icon.length > 2 ? 19 : 26}px "Baloo 2", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(it.icon, 0, 1);
        ctx.restore();
      }

      // partikel
      for (const p of S.parts) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // pemain (OXI keranjang)
      const py = H - 54;
      ctx.save();
      ctx.translate(S.px, py);
      ctx.shadowColor = "rgba(34,211,238,0.8)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#0ea5e9";
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(19, -12, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(-8, -5, 8, 0, Math.PI * 2);
      ctx.arc(9, -7, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(-7, -4, 4.2, 0, Math.PI * 2);
      ctx.arc(10, -6, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 6, 8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      // keranjang
      ctx.strokeStyle = "rgba(250,204,21,0.95)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 2, 38, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      ctx.restore();

      // teks pop
      for (const p of S.pops) {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
        ctx.font = 'bold 17px "Baloo 2", system-ui, sans-serif';
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(2,15,30,0.85)";
        ctx.strokeText(p.text, p.x, p.y);
        ctx.fillStyle = p.c;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      if (S.flash > 0) {
        ctx.fillStyle = `rgba(244,63,94,${S.flash * 0.35})`;
        ctx.fillRect(0, 0, W, H);
      }
      if (paused) {
        ctx.fillStyle = "rgba(2,12,26,0.6)";
        ctx.fillRect(0, 0, W, H);
      }
    };
    raf = requestAnimationFrame(loop);

    const sync = window.setInterval(() => {
      setHud({ caught: S.caught, hit: S.hit, time: S.time, combo: S.combo });
    }, 120);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(sync);
      window.clearInterval(sync);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      cvs.removeEventListener("pointermove", pointer);
      cvs.removeEventListener("pointerdown", pointer);
      S.running = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const quizDone = (firstTry: boolean) => {
    const nc = qc + (firstTry ? 1 : 0);
    setQc(nc);
    if (qi + 1 >= LEVEL6_QUIZ.length) {
      const b1 = state.current.caught >= 12 ? 1 : 0;
      const b2 = state.current.hit <= 1 ? 1 : 0;
      g.finishLevel(6, { correct: nc + b1 + b2, total: LEVEL6_QUIZ.length + 2 });
    } else setQi((i) => i + 1);
  };

  if (stage === "intro")
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-5 text-center">
          <div className="mb-1 text-5xl">🛡️</div>
          <h2 className="font-display text-2xl font-extrabold text-sky-900 sm:text-3xl">SERANGAN POLUSI!</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm font-semibold text-slate-700 sm:text-base">
            Lindungi paru-paru! Tangkap udara bersih dan hindari polusi selama {DURATION} detik.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/15 p-3 text-left text-sm font-bold text-emerald-800">
              ✅ TANGKAP: O₂ 🌿 💧 😷 🍎
            </div>
            <div className="rounded-2xl border border-rose-300/40 bg-rose-500/15 p-3 text-left text-sm font-bold text-rose-800">
              ⛔ HINDARI: 🚬 🌫️ 🏭 🗑️
            </div>
          </div>
          <p className="mt-3 text-xs font-bold text-sky-700">
            🎮 Kontrol: tombol ⬅️ ➡️ (atau A / D) • di HP: geser jari di layar permainan
          </p>
          <div className="mt-4 flex justify-center">
            <Btn variant="violet" size="lg" onClick={() => setStage("play")}>
              ▶ Mulai Bertahan
            </Btn>
          </div>
        </Card>
      </div>
    );

  if (stage === "quiz")
    return (
      <div className="mx-auto max-w-3xl">
        <OxiSpeech text="Kerja bagus, penjaga paru-paru! Sekarang jawab pertanyaannya ya." mood="excited" size={70} className="mb-3" />
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip tone="emerald">✅ Ditangkap: {hud.caught}</Chip>
            <Chip tone="rose">💥 Kena polusi: {hud.hit}</Chip>
          </div>
          <QuizBlock key={qi} quiz={LEVEL6_QUIZ[qi]} onDone={quizDone} retry header={`Kuis ${qi + 1}/${LEVEL6_QUIZ.length}`} />
        </Card>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Chip tone="emerald">✅ {hud.caught}</Chip>
        <Chip tone="rose">💥 {hud.hit}</Chip>
        {hud.combo >= 3 && <Chip tone="amber">🔥 Combo x{hud.combo}</Chip>}
        <div className="ml-auto flex w-full items-center gap-2 sm:w-56">
          <span>⏱️</span>
          <TimerBar value={hud.time} max={DURATION} />
          <span className="w-8 font-display text-sm font-bold">{Math.ceil(hud.time)}</span>
        </div>
      </div>
      <div ref={wrapRef} className="relative h-[58vh] max-h-[560px] min-h-[340px] w-full overflow-hidden rounded-3xl border-2 border-sky-200 shadow-2xl">
        <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      </div>
      <div className="mt-2 flex items-center justify-center gap-3 sm:hidden">
        <button
          className="btn3d rounded-2xl border-b-4 border-sky-200 bg-white/12 px-8 py-4 text-2xl"
          onPointerDown={() => state.current.keys.add("arrowleft")}
          onPointerUp={() => state.current.keys.delete("arrowleft")}
          onPointerLeave={() => state.current.keys.delete("arrowleft")}
          aria-label="Geser kiri"
        >
          ⬅️
        </button>
        <button
          className="btn3d rounded-2xl border-b-4 border-sky-200 bg-white/12 px-8 py-4 text-2xl"
          onPointerDown={() => state.current.keys.add("arrowright")}
          onPointerUp={() => state.current.keys.delete("arrowright")}
          onPointerLeave={() => state.current.keys.delete("arrowright")}
          aria-label="Geser kanan"
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
