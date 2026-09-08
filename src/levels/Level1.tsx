import { useMemo, useState } from "react";
import { ORGANS, LEVEL1_WRONG_FEEDBACK, type Quiz } from "../game/content";
import { useGame } from "../game/store";
import { RespiratoryDiagram } from "../components/Art";
import { QuizBlock } from "../components/Quiz";
import { Card, Chip, OxiSpeech } from "../components/UI";

function shuffle<T>(arr: T[], seed = Math.random()) {
  const a = [...arr];
  let s = seed * 10000;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Level1() {
  const g = useGame();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);

  const questions = useMemo(() => {
    const order = shuffle(ORGANS);
    return order.map((o) => {
      const distract = shuffle(ORGANS.filter((x) => x.id !== o.id))
        .slice(0, 3)
        .map((x) => x.nama);
      const opts = shuffle([o.nama, ...distract]);
      const q: Quiz & { no: number } = {
        no: o.no,
        q: `Organ nomor ${o.no} adalah…`,
        options: opts,
        answer: opts.indexOf(o.nama),
        explain: `${o.emoji} ${o.nama} — ${o.fungsi} 💡 ${o.seru}`,
        hint: LEVEL1_WRONG_FEEDBACK[o.id],
      };
      return q;
    });
  }, []);

  const cur = questions[idx];

  const handleDone = (firstTry: boolean) => {
    if (firstTry) setCorrect((c) => c + 1);
    setSolved((s) => [...s, cur.no]);
    if (idx + 1 >= questions.length) {
      g.finishLevel(1, { correct: firstTry ? correct + 1 : correct, total: questions.length });
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
      <Card className="p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <Chip tone="sky">🫁 Peta Tubuh</Chip>
          <Chip tone="amber">
            Soal {idx + 1}/{questions.length}
          </Chip>
        </div>
        <div className="rounded-2xl bg-sky-50 p-1">
          <RespiratoryDiagram activeNo={cur.no} solved={solved} className="h-[42vh] max-h-[520px] min-h-[280px]" />
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-sky-700">
          Nomor kuning berkedip adalah organ yang ditanyakan.
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        <OxiSpeech
          text={idx === 0 ? "Hai! Aku OXI. Ayo kenali para penjaga pernapasan di tubuh manusia!" : "Kerja bagus! Lanjut ke organ berikutnya ya."}
          mood={idx === 0 ? "happy" : "excited"}
          size={72}
        />
        <Card className="p-4 sm:p-5">
          <QuizBlock key={idx} quiz={cur} onDone={handleDone} retry header={`Kota Organ Pernapasan • Organ #${cur.no}`} />
        </Card>
        <div className="flex flex-wrap gap-2">
          {ORGANS.map((o) => (
            <span
              key={o.id}
              className={`rounded-full border px-2.5 py-1 text-xs font-bold transition ${
                solved.includes(o.no)
                  ? "border-emerald-300/50 bg-emerald-500/25 text-emerald-800"
                  : "border-sky-100 bg-sky-50 text-slate-500/70"
              }`}
            >
              {o.no}. {o.nama}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
