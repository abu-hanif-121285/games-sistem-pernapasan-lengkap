import { useState } from "react";
import { KASUS } from "../game/content";
import { useGame } from "../game/store";
import { QuizBlock } from "../components/Quiz";
import { Btn, Card, Chip, OxiSpeech } from "../components/UI";

const TOTAL = KASUS.reduce((s, k) => s + k.soal.length, 0);

export default function Level7() {
  const g = useGame();
  const [ci, setCi] = useState(0);
  const [si, setSi] = useState(-1); // -1 = layar cerita kasus
  const [correct, setCorrect] = useState(0);

  const kasus = KASUS[ci];

  const done = (firstTry: boolean) => {
    const nc = correct + (firstTry ? 1 : 0);
    setCorrect(nc);
    if (si + 1 < kasus.soal.length) {
      setSi((s) => s + 1);
    } else if (ci + 1 < KASUS.length) {
      setCi((c) => c + 1);
      setSi(-1);
      g.sfx("levelup");
    } else {
      g.finishLevel(7, { correct: nc, total: TOTAL });
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Chip tone="amber">🔍 Kasus {ci + 1}/{KASUS.length}</Chip>
        <Chip tone="emerald">✅ Terpecahkan: {correct}</Chip>
        <div className="ml-auto flex gap-1">
          {KASUS.map((_, i) => (
            <span key={i} className={`h-2.5 w-6 rounded-full ${i < ci ? "bg-emerald-400" : i === ci ? "bg-amber-300" : "bg-white/20"}`} />
          ))}
        </div>
      </div>

      <Card className="mb-3 overflow-hidden">
        <div className="flex items-start gap-3 bg-gradient-to-r from-amber-500/25 to-yellow-600/10 p-4">
          <span className="text-4xl sm:text-5xl">{kasus.emoji}</span>
          <div>
            <h3 className="font-display text-lg font-extrabold text-amber-800 sm:text-xl">{kasus.judul}</h3>
            <p className="mt-1 text-sm font-semibold leading-snug text-amber-900/90 sm:text-base">“{kasus.cerita}”</p>
          </div>
        </div>
      </Card>

      {si === -1 ? (
        <Card className="p-4 sm:p-5">
          <OxiSpeech text="Ayo jadi detektif! Kita cari penyebab, gejala, dan cara pencegahannya." mood="think" size={68} compact />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {kasus.soal.map((s) => (
              <div key={s.label} className="rounded-2xl border border-sky-100 bg-sky-50 p-3 text-center font-display text-sm font-bold text-slate-700">
                {s.label}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Btn variant="warn" size="lg" onClick={() => setSi(0)}>
              🕵️ Mulai Selidiki
            </Btn>
          </div>
        </Card>
      ) : (
        <Card className="p-4 sm:p-5">
          <QuizBlock
            key={`${ci}-${si}`}
            quiz={kasus.soal[si].quiz}
            onDone={done}
            retry
            header={`${kasus.soal[si].label} • Petunjuk ${si + 1}/${kasus.soal.length}`}
          />
        </Card>
      )}
    </div>
  );
}
