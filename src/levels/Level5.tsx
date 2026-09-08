import { useEffect, useRef, useState } from "react";
import { LEVEL5_QUIZ } from "../game/content";
import { useGame } from "../game/store";
import { AlveolusBackdrop, Oxi } from "../components/Art";
import { QuizBlock } from "../components/Quiz";
import { Btn, Card, Chip, OxiSpeech, TimerBar } from "../components/UI";
import { useDragDrop } from "../components/DragDrop";

type Mol = { id: string; kind: "o2" | "co2"; zone: "alveolus" | "darah"; x: number; y: number };

const TARGET = 8;
const DURATION = 45;

function MolFace({ kind, small = false }: { kind: "o2" | "co2"; small?: boolean }) {
  const o2 = kind === "o2";
  return (
    <div
      className={`grid place-items-center rounded-full border-2 font-display font-extrabold shadow-lg ${
        small ? "h-11 w-11 text-xs" : "h-12 w-12 text-sm sm:h-14 sm:w-14 sm:text-base"
      } ${
        o2
          ? "border-cyan-100/80 bg-gradient-to-br from-cyan-300 to-sky-600 text-slate-900 shadow-cyan-400/50"
          : "border-slate-200/70 bg-gradient-to-br from-slate-400 to-slate-700 text-sky-900 shadow-slate-900/50"
      }`}
    >
      {o2 ? "O₂" : "CO₂"}
    </div>
  );
}

export default function Level5() {
  const g = useGame();
  const [stage, setStage] = useState<"intro" | "play" | "quiz">("intro");
  const [mols, setMols] = useState<Mol[]>([]);
  const [done, setDone] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [qi, setQi] = useState(0);
  const [qc, setQc] = useState(0);
  const [tip, setTip] = useState("Seret O₂ ke DARAH, dan CO₂ ke ALVEOLUS!");
  const uid = useRef(0);

  /* spawn molekul */
  useEffect(() => {
    if (stage !== "play") return;
    const spawn = () => {
      setMols((m) => {
        if (m.length >= 6) return m;
        const kind: "o2" | "co2" = Math.random() < 0.55 ? "o2" : "co2";
        return [
          ...m,
          {
            id: `m${uid.current++}`,
            kind,
            zone: kind === "o2" ? "alveolus" : "darah",
            x: 12 + Math.random() * 70,
            y: 15 + Math.random() * 60,
          },
        ];
      });
    };
    spawn();
    spawn();
    spawn();
    const t = window.setInterval(spawn, 1200);
    return () => window.clearInterval(t);
  }, [stage]);

  /* timer */
  useEffect(() => {
    if (stage !== "play") return;
    const t = window.setInterval(() => setTime((s) => Math.max(0, +(s - 0.1).toFixed(1))), 100);
    return () => window.clearInterval(t);
  }, [stage]);

  useEffect(() => {
    if (stage === "play" && (done >= TARGET || time === 0)) {
      setStage("quiz");
      g.sfx("levelup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, time, stage]);

  const onDrop = (id: string, zoneId: string | null) => {
    const mol = mols.find((m) => m.id === id);
    if (!mol || !zoneId || (zoneId !== "alveolus" && zoneId !== "darah")) return;
    const goal = mol.kind === "o2" ? "darah" : "alveolus";
    const px = window.innerWidth / 2;
    const py = window.innerHeight / 2;
    if (zoneId === goal) {
      setMols((m) => m.filter((x) => x.id !== id));
      setDone((d) => d + 1);
      g.addXp(40);
      g.addCoins(3);
      g.sfx("coin");
      g.burst(px, py, mol.kind === "o2" ? ["#22d3ee", "#a5f3fc"] : ["#94a3b8", "#cbd5e1"], 14, 0.9);
      setTip(mol.kind === "o2" ? "O₂ masuk ke darah dan diikat hemoglobin! 🩸" : "CO₂ keluar ke alveolus untuk dihembuskan! 💨");
    } else {
      setMistakes((x) => x + 1);
      g.sfx("wrong");
      g.doShake(8);
      setTip(mol.kind === "o2" ? "Ups! O₂ harus menuju DARAH ya." : "Ups! CO₂ harus menuju ALVEOLUS ya.");
    }
  };

  const dnd = useDragDrop(onDrop);

  const quizDone = (firstTry: boolean) => {
    const nc = qc + (firstTry ? 1 : 0);
    setQc(nc);
    if (qi + 1 >= LEVEL5_QUIZ.length) {
      const bonus = mistakes <= 2 ? 1 : 0;
      g.finishLevel(5, { correct: nc + bonus, total: LEVEL5_QUIZ.length + 1 });
    } else setQi((i) => i + 1);
  };

  const zoneNode = (z: "alveolus" | "darah", label: string, emoji: string, hint: string) => {
    const over = dnd.overZone === z;
    return (
      <div
        {...dnd.zoneProps(z)}
        className={`relative min-h-[160px] flex-1 overflow-hidden rounded-3xl border-2 transition sm:min-h-[190px] ${
          over ? "border-cyan-300 bg-cyan-400/15" : "border-sky-200"
        } ${z === "alveolus" ? "bg-sky-500/10" : "bg-rose-800/25"}`}
      >
        <div className="pointer-events-none absolute left-3 top-2 z-10">
          <div className="font-display text-sm font-extrabold text-sky-900 sm:text-base">
            {emoji} {label}
          </div>
          <div className="text-[11px] font-semibold text-sky-900/60">{hint}</div>
        </div>
        {z === "alveolus" ? (
          <div className="pointer-events-none absolute inset-0 opacity-70">
            {[
              [18, 60, 46],
              [58, 30, 34],
              [82, 66, 40],
            ].map(([x, y, r], i) => (
              <span
                key={i}
                className="anim-breathe absolute rounded-full border-2 border-sky-200/40 bg-sky-200/15"
                style={{ left: `${x}%`, top: `${y}%`, width: r, height: r, animationDelay: `${i * 0.7}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 opacity-80">
            {[10, 34, 58, 80].map((x, i) => (
              <span
                key={i}
                className="anim-float absolute h-6 w-6 rounded-full border-2 border-rose-200/60 bg-rose-500"
                style={{ left: `${x}%`, top: `${30 + (i % 2) * 32}%`, animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        )}
        {mols
          .filter((m) => m.zone === z)
          .map((m) => (
            <div
              key={m.id}
              {...dnd.itemProps(m.id, <MolFace kind={m.kind} />)}
              className="anim-pop absolute cursor-grab active:cursor-grabbing"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <div className={dnd.selected === m.id ? "scale-110 rounded-full ring-4 ring-amber-300" : "anim-bob"}>
                <MolFace kind={m.kind} />
              </div>
            </div>
          ))}
      </div>
    );
  };

  if (stage === "intro")
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="relative overflow-hidden p-5 text-center">
          <AlveolusBackdrop className="absolute inset-0 h-full w-full opacity-60" />
          <div className="relative">
            <div className="mb-2 text-5xl">🔬</div>
            <h2 className="font-display text-2xl font-extrabold text-sky-900 sm:text-3xl">LAB ALVEOLUS</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm font-semibold text-slate-700 sm:text-base">
              OXI sudah sampai di ujung perjalanan! Di sinilah keajaiban terjadi: dinding alveolus sangat tipis dan diselimuti
              pembuluh kapiler darah.
            </p>
            <div className="mx-auto mt-4 grid max-w-md gap-2 text-left">
              <div className="rounded-2xl border border-cyan-300/40 bg-cyan-500/15 p-3 text-sm font-bold text-cyan-50">
                🫧 O₂ berpindah: ALVEOLUS → DARAH
              </div>
              <div className="rounded-2xl border border-slate-300/30 bg-slate-500/20 p-3 text-sm font-bold text-slate-50">
                💨 CO₂ berpindah: DARAH → ALVEOLUS
              </div>
            </div>
            <div className="mt-5 flex justify-center">
              <Btn variant="primary" size="lg" onClick={() => setStage("play")}>
                🚀 Mulai Eksperimen
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    );

  if (stage === "quiz")
    return (
      <div className="mx-auto max-w-3xl">
        <OxiSpeech text="Pertukaran gas selesai! Sekarang buktikan pemahamanmu ya." mood="excited" size={70} className="mb-3" />
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip tone="emerald">✅ Transfer: {done}</Chip>
            <Chip tone="rose">⚠️ Salah: {mistakes}</Chip>
          </div>
          <QuizBlock key={qi} quiz={LEVEL5_QUIZ[qi]} onDone={quizDone} retry header={`Kuis ${qi + 1}/${LEVEL5_QUIZ.length}`} />
        </Card>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl">
      {dnd.ghost}
      <Card className="p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Chip tone="sky">
            🫧 Transfer {done}/{TARGET}
          </Chip>
          <Chip tone="rose">⚠️ {mistakes}</Chip>
          <div className="ml-auto flex w-full items-center gap-2 sm:w-52">
            <span>⏱️</span>
            <TimerBar value={time} max={DURATION} />
            <span className="w-8 font-display text-sm font-bold">{Math.ceil(time)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {zoneNode("alveolus", "ALVEOLUS", "🫁", "gelembung udara")}
          <div className="flex items-center justify-center gap-4 py-0.5">
            <span className="anim-bob font-display text-xs font-bold text-sky-700">O₂ ⬇ ke darah</span>
            <span className="anim-bob font-display text-xs font-bold text-slate-500" style={{ animationDelay: "0.6s" }}>
              CO₂ ⬆ ke alveolus
            </span>
          </div>
          {zoneNode("darah", "KAPILER DARAH", "🩸", "pembuluh darah")}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 p-2">
          <Oxi size={44} mood="wow" />
          <p className="text-xs font-bold text-slate-700 sm:text-sm">{tip}</p>
        </div>
      </Card>
    </div>
  );
}
