import { useEffect, useRef, useState } from "react";
import type { Quiz } from "../game/content";
import { useGame } from "../game/store";
import { Btn, TimerBar } from "./UI";
import { Oxi } from "./Art";

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuizBlock({
  quiz,
  onDone,
  retry = false,
  header,
  timeLimit,
  compact = false,
}: {
  quiz: Quiz;
  onDone: (firstTry: boolean) => void;
  retry?: boolean;
  header?: string;
  timeLimit?: number;
  compact?: boolean;
}) {
  const g = useGame();
  const [tried, setTried] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [firstTry, setFirstTry] = useState(true);
  const [left, setLeft] = useState(timeLimit ?? 0);
  const start = useRef(Date.now());

  useEffect(() => {
    setTried([]);
    setStatus("idle");
    setFirstTry(true);
    setLeft(timeLimit ?? 0);
    start.current = Date.now();
  }, [quiz, timeLimit]);

  useEffect(() => {
    if (!timeLimit || status === "correct") return;
    const t = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 0.1) {
          window.clearInterval(t);
          return 0;
        }
        return +(l - 0.1).toFixed(1);
      });
    }, 100);
    return () => window.clearInterval(t);
  }, [timeLimit, status, quiz]);

  useEffect(() => {
    if (timeLimit && left === 0 && status !== "correct") {
      setStatus("wrong");
      setFirstTry(false);
      g.registerAnswer(false, 99999);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const pick = (i: number, e: React.MouseEvent) => {
    if (status === "correct" || (status === "wrong" && !retry)) return;
    const origin = { x: e.clientX, y: e.clientY };
    const elapsed = Date.now() - start.current;
    if (i === quiz.answer) {
      setStatus("correct");
      g.registerAnswer(true, firstTry ? elapsed : 99999, origin);
    } else {
      setTried((t) => [...t, i]);
      setFirstTry(false);
      setStatus("wrong");
      g.registerAnswer(false, elapsed, origin);
    }
  };

  const done = status === "correct" || (status === "wrong" && !retry);

  return (
    <div className={`w-full ${compact ? "" : "anim-up"}`}>
      {header && <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-sky-600 sm:text-sm">{header}</div>}

      {timeLimit && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">⏱️</span>
          <TimerBar value={left} max={timeLimit} danger={left < timeLimit * 0.25} />
          <span className="w-10 text-right font-display text-sm font-bold text-sky-700">{left.toFixed(0)}s</span>
        </div>
      )}

      <p className="mb-3 font-display text-lg font-bold leading-snug text-sky-900 sm:text-xl">{quiz.q}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {quiz.options.map((opt, i) => {
          const isAnswer = i === quiz.answer;
          const wasTried = tried.includes(i);
          const reveal = status === "correct" || (status === "wrong" && !retry);
          let cls = "border-sky-100 bg-white hover:bg-sky-50 text-sky-900";
          if (wasTried) cls = "border-rose-300 bg-rose-50 text-rose-800 opacity-80";
          if (reveal && isAnswer) cls = "border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300";
          return (
            <button
              key={i}
              onClick={(e) => pick(i, e)}
              disabled={done || wasTried}
              className={`btn3d flex items-start gap-3 rounded-2xl border-2 p-3 text-left font-semibold shadow-sm transition sm:p-4 ${cls}`}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sky-100 font-display text-sm font-extrabold text-sky-700">
                {LETTERS[i]}
              </span>
              <span className="text-sm leading-snug sm:text-base">{opt}</span>
              {reveal && isAnswer && <span className="ml-auto text-lg">✅</span>}
              {wasTried && <span className="ml-auto text-lg">❌</span>}
            </button>
          );
        })}
      </div>

      {status === "wrong" && (
        <div className="anim-pop mt-3 flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
          <Oxi size={52} mood="think" />
          <div className="text-sm font-semibold text-amber-900 sm:text-base">
            <b className="font-display">Belum tepat!</b>{" "}
            {retry ? quiz.hint ?? "Coba perhatikan lagi dan pilih jawaban lain. Kamu pasti bisa!" : quiz.explain}
          </div>
        </div>
      )}

      {status === "correct" && (
        <div className="anim-pop mt-3 flex items-start gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3">
          <Oxi size={52} mood="excited" />
          <div className="text-sm font-semibold text-emerald-800 sm:text-base">
            <b className="font-display">Tepat sekali! 🎉</b> {quiz.explain}
          </div>
        </div>
      )}

      {done && (
        <div className="mt-4 flex justify-end">
          <Btn variant="success" size="lg" onClick={() => onDone(status === "correct" && firstTry)}>
            Lanjut ▶
          </Btn>
        </div>
      )}
    </div>
  );
}
