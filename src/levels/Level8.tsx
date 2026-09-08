import { useMemo, useState } from "react";
import { BOSS_QUIZ } from "../game/content";
import { useGame } from "../game/store";
import { MonsterPolusi, Oxi } from "../components/Art";
import { QuizBlock } from "../components/Quiz";
import { Btn, Card, Chip } from "../components/UI";

const MAX_HP = 100;
const DMG = 20;

export default function Level8() {
  const g = useGame();
  const [stage, setStage] = useState<"intro" | "fight">("intro");
  const [hp, setHp] = useState(MAX_HP);
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [asked, setAsked] = useState(0);
  const [hurt, setHurt] = useState(false);
  const [beam, setBeam] = useState(false);
  const [msg, setMsg] = useState("Jawab benar untuk menembakkan O₂ ke Monster Polusi!");

  const bank = useMemo(() => [...BOSS_QUIZ].sort(() => Math.random() - 0.5), []);
  const quiz = bank[qi % bank.length];

  const onDone = (firstTry: boolean) => {
    const nAsked = asked + 1;
    setAsked(nAsked);
    if (firstTry) {
      const nc = correct + 1;
      setCorrect(nc);
      const nhp = Math.max(0, hp - DMG);
      setBeam(true);
      setHurt(true);
      g.sfx("boss");
      g.doShake(10);
      window.setTimeout(() => setBeam(false), 500);
      window.setTimeout(() => setHurt(false), 620);
      setHp(nhp);
      setMsg(nhp === 0 ? "🎉 BOSS DEFEATED! Udara kembali bersih!" : `Serangan O₂ tepat sasaran! Monster -${DMG} HP 💥`);
      if (nhp === 0) {
        window.setTimeout(() => g.finishLevel(8, { correct: nc, total: nAsked }), 1100);
        return;
      }
    } else {
      setMsg("Monster menyerang balik! Kamu kehilangan 1 ❤️. Tetap semangat!");
      g.loseLife();
    }
    setQi((i) => i + 1);
  };

  if (stage === "intro")
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-5 text-center">
          <div className="mb-2 flex justify-center">
            <MonsterPolusi size={170} angry />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-fuchsia-800 sm:text-3xl">👾 MONSTER POLUSI</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm font-semibold text-slate-700 sm:text-base">
            Monster ini ingin mengotori udara di paru-paru semua orang! Kalahkan dia dengan ilmu pernapasanmu.
          </p>
          <div className="mx-auto mt-3 grid max-w-md gap-2 text-left text-sm font-bold">
            <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/15 p-3 text-emerald-800">✅ Jawaban benar = Monster −20 HP</div>
            <div className="rounded-2xl border border-rose-300/40 bg-rose-500/15 p-3 text-rose-800">❌ Jawaban salah / waktu habis = kamu −1 ❤️</div>
            <div className="rounded-2xl border border-amber-300/40 bg-amber-500/15 p-3 text-amber-900">⏱️ Setiap soal punya waktu 20 detik</div>
          </div>
          <div className="mt-5 flex justify-center">
            <Btn variant="danger" size="lg" onClick={() => setStage("fight")}>
              ⚔️ Mulai Pertarungan
            </Btn>
          </div>
        </Card>
      </div>
    );

  const pct = (hp / MAX_HP) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="relative mb-3 overflow-hidden p-3 sm:p-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-700/15 to-slate-900/0" />
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-display text-sm font-extrabold text-fuchsia-800 sm:text-base">👾 MONSTER POLUSI</span>
              <span className="font-display text-sm font-extrabold text-rose-700">
                {hp}/{MAX_HP} HP
              </span>
            </div>
            <div className="h-5 w-full overflow-hidden rounded-full bg-slate-900/70 ring-1 ring-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-2 flex items-end justify-between">
          <div className="relative">
            <Oxi size={78} mood={hp === 0 ? "excited" : "happy"} />
            {beam && (
              <span className="absolute left-[70px] top-6 h-3 w-[46vw] max-w-[300px] origin-left animate-[fadeIn_.1s] rounded-full bg-gradient-to-r from-cyan-200 via-cyan-300 to-transparent shadow-[0_0_20px_#22d3ee]" />
            )}
          </div>
          <MonsterPolusi size={150} hurt={hurt} angry={hp > 40} />
        </div>

        <div className="relative mt-1 flex flex-wrap items-center gap-2">
          <Chip tone="violet">Soal ke-{asked + 1}</Chip>
          <Chip tone="emerald">Benar: {correct}</Chip>
          <span className="text-xs font-bold text-slate-700 sm:text-sm">{msg}</span>
        </div>
      </Card>

      {hp > 0 && (
        <Card className="p-4 sm:p-5">
          <QuizBlock key={qi} quiz={quiz} onDone={onDone} timeLimit={20} header="⚔️ Serangan Pengetahuan" />
        </Card>
      )}
      {hp === 0 && (
        <Card className="p-6 text-center">
          <div className="anim-pop text-6xl">🎉</div>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-emerald-700">BOSS DEFEATED!</h3>
          <p className="mt-1 font-semibold text-slate-700">Monster Polusi menghilang. Udara kembali bersih dan segar!</p>
        </Card>
      )}
    </div>
  );
}
