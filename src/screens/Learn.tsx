import { useEffect, useState } from "react";
import { AIR_PATH, MATERI, ORGANS } from "../game/content";
import { useGame } from "../game/store";
import { AlveolusBackdrop, BreathingScene, Oxi, RespiratoryDiagram } from "../components/Art";
import { Btn, Card, Chip, TopHUD } from "../components/UI";

function AutoBreath() {
  const [p, setP] = useState<"in" | "out">("in");
  useEffect(() => {
    const t = window.setInterval(() => setP((x) => (x === "in" ? "out" : "in")), 2600);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div>
      <BreathingScene phase={p} className="mx-auto h-[38vh] max-h-[380px] min-h-[240px] w-full" />
      <p className="text-center font-display text-sm font-extrabold text-sky-700">
        {p === "in" ? "🌬️ INSPIRASI — diafragma turun, udara masuk" : "💨 EKSPIRASI — diafragma naik, udara keluar"}
      </p>
    </div>
  );
}

function JalurVisual() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((x) => (x + 1) % AIR_PATH.length), 1100);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 p-2">
      {AIR_PATH.map((id, idx) => {
        const o = ORGANS.find((x) => x.id === id)!;
        const active = idx === i;
        return (
          <div key={id} className="flex items-center gap-1.5">
            <div
              className={`rounded-2xl border-2 px-2.5 py-2 text-center transition-all duration-300 ${
                active
                  ? "scale-110 border-cyan-200 bg-gradient-to-br from-cyan-400 to-sky-600 text-slate-900 shadow-[0_0_22px_rgba(34,211,238,.7)]"
                  : "border-sky-200 bg-sky-50 text-slate-700"
              }`}
            >
              <div className="text-lg">{o.emoji}</div>
              <div className="font-display text-[11px] font-extrabold">{o.nama.split(" (")[0]}</div>
            </div>
            {idx < AIR_PATH.length - 1 && <span className="text-cyan-300">→</span>}
          </div>
        );
      })}
    </div>
  );
}

function AlveolusVisual() {
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl bg-sky-50">
      <AlveolusBackdrop className="absolute inset-0 h-full w-full" />
      {[0, 1, 2].map((i) => (
        <span
          key={`o${i}`}
          className="absolute grid h-9 w-9 place-items-center rounded-full border-2 border-cyan-100/80 bg-gradient-to-br from-cyan-300 to-sky-600 font-display text-[10px] font-extrabold text-slate-900"
          style={{ left: `${18 + i * 12}%`, animation: `o2down 3.4s ease-in-out ${i * 0.9}s infinite` }}
        >
          O₂
        </span>
      ))}
      {[0, 1].map((i) => (
        <span
          key={`c${i}`}
          className="absolute grid h-9 w-9 place-items-center rounded-full border-2 border-slate-200/70 bg-gradient-to-br from-slate-400 to-slate-700 font-display text-[9px] font-extrabold text-white"
          style={{ left: `${58 + i * 14}%`, animation: `co2up 3.8s ease-in-out ${i * 1.2}s infinite` }}
        >
          CO₂
        </span>
      ))}
      <style>{`@keyframes o2down{0%{top:14%;opacity:0}15%{opacity:1}80%{opacity:1}100%{top:78%;opacity:0}}@keyframes co2up{0%{top:78%;opacity:0}15%{opacity:1}80%{opacity:1}100%{top:14%;opacity:0}}`}</style>
      <div className="absolute bottom-2 left-3 font-display text-xs font-extrabold text-rose-800">🩸 KAPILER DARAH</div>
      <div className="absolute left-3 top-2 font-display text-xs font-extrabold text-slate-700">🫁 ALVEOLUS</div>
    </div>
  );
}

const GANGGUAN = [
  { n: "Asma", e: "😮‍💨", d: "Saluran napas menyempit, napas berbunyi mengi." },
  { n: "Influenza", e: "🤧", d: "Infeksi virus: bersin, hidung tersumbat, demam." },
  { n: "Bronkitis", e: "😷", d: "Peradangan bronkus, batuk berdahak lama." },
  { n: "Pneumonia", e: "🫁", d: "Alveolus meradang dan terisi cairan." },
  { n: "TBC", e: "🩺", d: "Infeksi bakteri pada paru-paru, batuk lebih dari 3 minggu." },
  { n: "Emfisema", e: "🚭", d: "Alveolus rusak, sering karena asap rokok." },
];
const SEHAT = [
  { n: "Jauhi asap rokok", e: "🚭" },
  { n: "Pakai masker", e: "😷" },
  { n: "Olahraga teratur", e: "🏃" },
  { n: "Makan bergizi", e: "🥦" },
  { n: "Tanam pohon", e: "🌳" },
  { n: "Buka ventilasi", e: "🪟" },
];

export function LearnScreen() {
  const g = useGame();
  const [open, setOpen] = useState<number | null>(null);
  const m = open !== null ? MATERI[open] : null;

  return (
    <div className="min-h-[100dvh] pb-28">
      <TopHUD onBack={() => (open !== null ? setOpen(null) : g.go("home"))} />
      <div className="mx-auto mt-4 max-w-4xl px-3">
        {!m ? (
          <>
            <div className="mb-4 text-center">
              <h1 className="banner mx-auto w-fit rounded-2xl px-6 py-2 font-display text-2xl font-extrabold sm:text-3xl">📚 MODE BELAJAR</h1>
              <p className="text-sm font-semibold text-sky-700">Pilih materi yang ingin kamu pelajari bersama OXI</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {MATERI.map((mat, i) => (
                <button
                  key={mat.id}
                  onClick={() => {
                    g.sfx("click");
                    setOpen(i);
                  }}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="btn3d anim-up glass flex items-center gap-3 rounded-3xl p-4 text-left"
                >
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-3xl ${mat.warna}`}>{mat.emoji}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-extrabold text-sky-900 sm:text-lg">{mat.judul}</span>
                    <span className="line-clamp-2 block text-xs font-semibold text-slate-500">{mat.ringkas}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="anim-up">
            <Card className="overflow-hidden">
              <div className={`flex items-center gap-3 bg-gradient-to-r p-4 ${m.warna}`}>
                <span className="text-4xl">{m.emoji}</span>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">{m.judul}</h2>
                  <p className="text-xs font-bold text-white/90 sm:text-sm">{m.ringkas}</p>
                </div>
              </div>

              <div className="p-4">
                {m.visual === "sistem" && (
                  <div className="rounded-2xl bg-sky-50 p-2">
                    <RespiratoryDiagram showLabels className="h-[52vh] max-h-[560px] min-h-[340px]" />
                  </div>
                )}
                {m.visual === "jalur" && <JalurVisual />}
                {(m.visual === "napas" || m.visual === "diafragma") && <AutoBreath />}
                {m.visual === "alveolus" && <AlveolusVisual />}
                {m.visual === "intro" && (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="anim-float">
                      <Oxi size={120} mood="excited" />
                    </div>
                    <p className="text-center font-display text-base font-bold text-sky-700">
                      Setiap menit kamu bernapas 12–20 kali tanpa harus mengingatnya!
                    </p>
                  </div>
                )}
                {m.visual === "gangguan" && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {GANGGUAN.map((x) => (
                      <div key={x.n} className="flex items-start gap-3 rounded-2xl border border-rose-300/25 bg-rose-500/10 p-3">
                        <span className="text-2xl">{x.e}</span>
                        <div>
                          <div className="font-display text-sm font-extrabold text-rose-800">{x.n}</div>
                          <div className="text-xs font-semibold text-rose-800/80">{x.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {m.visual === "sehat" && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SEHAT.map((x) => (
                      <div key={x.n} className="anim-pop rounded-2xl border border-emerald-300/30 bg-emerald-500/12 p-3 text-center">
                        <div className="text-3xl">{x.e}</div>
                        <div className="mt-1 font-display text-xs font-extrabold text-emerald-800">{x.n}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid gap-2">
                  {m.poin.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-2xl border border-sky-100 bg-sky-50 p-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400/25 font-display text-xs font-extrabold text-sky-700">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold leading-snug text-sky-900 sm:text-base">{p}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <Chip tone="sky">
                    Materi {open! + 1}/{MATERI.length}
                  </Chip>
                  <div className="flex gap-2">
                    <Btn variant="ghost" disabled={open === 0} onClick={() => setOpen((o) => Math.max(0, (o ?? 0) - 1))}>
                      ← Sebelumnya
                    </Btn>
                    {open! < MATERI.length - 1 ? (
                      <Btn variant="primary" onClick={() => setOpen((o) => Math.min(MATERI.length - 1, (o ?? 0) + 1))}>
                        Berikutnya →
                      </Btn>
                    ) : (
                      <Btn variant="success" onClick={() => g.go("map")}>
                        🗺️ Ke Petualangan
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
