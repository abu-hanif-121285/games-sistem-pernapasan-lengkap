import { useState } from "react";
import { LEVEL3_QUIZ } from "../game/content";
import { useGame } from "../game/store";
import { BreathingScene } from "../components/Art";
import { QuizBlock } from "../components/Quiz";
import { Btn, Card, Chip, OxiSpeech } from "../components/UI";

const INFO = {
  in: [
    { k: "Diafragma", v: "Berkontraksi & TURUN ⬇", c: "text-amber-700" },
    { k: "Rongga dada", v: "MEMBESAR 🔵", c: "text-sky-700" },
    { k: "Paru-paru", v: "MENGEMBANG 🎈", c: "text-rose-700" },
    { k: "Udara", v: "MASUK ke paru-paru 🌬️", c: "text-emerald-700" },
  ],
  out: [
    { k: "Diafragma", v: "Melemas & NAIK ⬆", c: "text-amber-700" },
    { k: "Rongga dada", v: "MENGECIL 🟠", c: "text-sky-700" },
    { k: "Paru-paru", v: "MENGEMPIS 🎐", c: "text-rose-700" },
    { k: "Udara", v: "KELUAR dari paru-paru 💨", c: "text-emerald-700" },
  ],
};

export default function Level3() {
  const g = useGame();
  const [phase, setPhase] = useState<"in" | "out">("out");
  const [cycles, setCycles] = useState(0);
  const [stage, setStage] = useState<"sim" | "quiz">("sim");
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);

  const breathe = (p: "in" | "out") => {
    if (p === phase) return;
    setPhase(p);
    g.sfx(p === "in" ? "breatheIn" : "breatheOut");
    if (p === "out") setCycles((c) => c + 1);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    g.burst(cx, cy, p === "in" ? ["#a7f3d0", "#67e8f9"] : ["#fca5a5", "#fdba74"], 12, 0.7);
  };

  const done = (firstTry: boolean) => {
    const nc = correct + (firstTry ? 1 : 0);
    setCorrect(nc);
    if (qi + 1 >= LEVEL3_QUIZ.length) g.finishLevel(3, { correct: nc, total: LEVEL3_QUIZ.length });
    else setQi((i) => i + 1);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
      <Card className="p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <Chip tone="amber">🌬️ Simulator Pernapasan</Chip>
          <Chip tone="sky">Siklus napas: {cycles}</Chip>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-slate-950/60 to-sky-950/30 p-2">
          <BreathingScene phase={phase} className="mx-auto h-[38vh] max-h-[420px] min-h-[260px] w-full" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn variant={phase === "in" ? "ghost" : "primary"} size="lg" onClick={() => breathe("in")} disabled={phase === "in"}>
            🌬️ Tarik Napas
          </Btn>
          <Btn variant={phase === "out" ? "ghost" : "warn"} size="lg" onClick={() => breathe("out")} disabled={phase === "out"}>
            💨 Hembuskan
          </Btn>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Card className="p-4">
          <div className="mb-2 font-display text-base font-extrabold text-sky-900 sm:text-lg">
            {phase === "in" ? "🫁 INSPIRASI — Menarik Napas" : "🫁 EKSPIRASI — Menghembuskan Napas"}
          </div>
          <div className="grid gap-2">
            {INFO[phase].map((r) => (
              <div key={r.k} className="anim-pop flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-3 py-2">
                <span className="text-sm font-bold text-slate-700 sm:text-base">{r.k}</span>
                <span className={`font-display text-sm font-extrabold sm:text-base ${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </Card>

        {stage === "sim" ? (
          <Card className="p-4">
            <OxiSpeech
              text={
                cycles < 2
                  ? `Coba tarik napas dan hembuskan ${2 - cycles} kali lagi sambil perhatikan diafragmanya ya!`
                  : "Keren! Sekarang kamu siap menjawab pertanyaannya."
              }
              mood={cycles < 2 ? "happy" : "excited"}
              size={64}
              compact
            />
            <div className="mt-3 flex justify-center">
              <Btn variant="success" size="lg" disabled={cycles < 2} onClick={() => setStage("quiz")}>
                {cycles < 2 ? `🔒 Lakukan ${2 - cycles} siklus lagi` : "📝 Mulai Kuis"}
              </Btn>
            </div>
          </Card>
        ) : (
          <Card className="p-4 sm:p-5">
            <QuizBlock key={qi} quiz={LEVEL3_QUIZ[qi]} onDone={done} retry header={`Kuis ${qi + 1}/${LEVEL3_QUIZ.length}`} />
          </Card>
        )}
      </div>
    </div>
  );
}
