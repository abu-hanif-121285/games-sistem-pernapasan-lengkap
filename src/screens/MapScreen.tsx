import { useState } from "react";
import { LEVELS } from "../game/content";
import { useGame } from "../game/store";
import { MonsterPolusi, StarRow } from "../components/Art";
import { Btn, Chip, Modal, TopHUD } from "../components/UI";

const NODE: { bg: string; text: string }[] = [
  { bg: "from-sky-300 to-sky-500", text: "text-sky-950" },
  { bg: "from-lime-300 to-green-500", text: "text-green-950" },
  { bg: "from-yellow-300 to-amber-400", text: "text-amber-950" },
  { bg: "from-orange-300 to-orange-500", text: "text-orange-950" },
  { bg: "from-pink-300 to-rose-400", text: "text-rose-950" },
  { bg: "from-emerald-300 to-emerald-500", text: "text-emerald-950" },
  { bg: "from-amber-400 to-yellow-700", text: "text-amber-950" },
  { bg: "from-violet-400 to-purple-600", text: "text-white" },
];

export function MapScreen() {
  const g = useGame();
  const [preview, setPreview] = useState<number | null>(null);
  const lv = LEVELS.find((l) => l.id === preview);

  return (
    <div className="min-h-[100dvh] pb-24">
      <TopHUD onBack={() => g.go("home")} />

      <div className="mx-auto mt-3 max-w-4xl px-3">
        <div className="banner mx-auto mb-4 w-fit rounded-2xl px-6 py-2 font-display text-xl font-extrabold sm:text-3xl">Peta Petualangan</div>

        <div className="relative">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 46" preserveAspectRatio="none">
            <path
              d="M12 12 C 28 4, 40 18, 50 12 S 78 4, 88 12 M12 34 C 28 26, 40 40, 50 34 S 78 26, 88 34 M12 12 Q 8 23 12 34 M88 12 Q 92 23 88 34"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.1"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {LEVELS.map((l) => {
              const stars = g.data.levelStars[l.id] ?? 0;
              const open = g.unlocked(l.id);
              const n = NODE[l.id - 1];
              return (
                <button
                  key={l.id}
                  disabled={!open}
                  onClick={() => {
                    g.sfx("click");
                    setPreview(l.id);
                  }}
                  className={`anim-up flex flex-col items-center ${open ? "" : "opacity-55"}`}
                >
                  <div
                    className={`node-circle relative grid aspect-square w-[min(42vw,160px)] place-items-center rounded-full bg-gradient-to-b ${n.bg} ${n.text} ${
                      open && stars === 0 ? "ring-glow" : ""
                    }`}
                  >
                    {l.id === 8 && open ? (
                      <MonsterPolusi size={88} />
                    ) : (
                      <div className="text-center">
                        <div className="font-display text-2xl font-black sm:text-3xl">{open ? l.id : "🔒"}</div>
                        <div className="px-2 font-display text-[11px] font-extrabold leading-tight sm:text-sm">{l.nama}</div>
                      </div>
                    )}
                    {l.id === 8 && open && (
                      <div className="absolute bottom-3 px-2 text-center font-display text-[11px] font-extrabold text-white drop-shadow sm:text-sm">
                        Boss Battle O₂
                      </div>
                    )}
                  </div>
                  <div className="mt-1">
                    <StarRow value={stars} size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Modal open={preview !== null} onClose={() => setPreview(null)}>
        {lv && (
          <div className="text-center">
            <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br text-4xl ${lv.warna}`}>{lv.emoji}</div>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-sky-800">
              Level {lv.id} — {lv.nama}
            </h3>
            <p className="font-display text-base font-bold text-sky-600">{lv.sub}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm font-semibold text-slate-600">{lv.deskripsi}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Chip tone="amber">💡 {lv.tips}</Chip>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-sm font-bold text-slate-600">Bintang terbaik:</span>
              <StarRow value={g.data.levelStars[lv.id] ?? 0} size={22} />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Btn variant="ghost" onClick={() => setPreview(null)}>
                ← Kembali
              </Btn>
              <Btn variant="success" size="lg" onClick={() => g.startLevel(lv.id)}>
                ▶ MAIN LEVEL {lv.id}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
