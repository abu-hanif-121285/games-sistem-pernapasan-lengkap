import { useGame } from "../game/store";
import { Oxi } from "../components/Art";
import { TopHUD } from "../components/UI";

const MENU: { key: Parameters<ReturnType<typeof useGame>["go"]>[0]; label: string; emoji: string; active?: boolean }[] = [
  { key: "home", label: "Home", emoji: "🏠" },
  { key: "map", label: "Petualangan", emoji: "🗺️" },
  { key: "learn", label: "Belajar", emoji: "📚" },
  { key: "badges", label: "Badge", emoji: "🏆" },
  { key: "scores", label: "Nilai", emoji: "📊" },
  { key: "settings", label: "Pengaturan", emoji: "⚙️" },
];

export function HomeScreen() {
  const g = useGame();
  return (
    <div className="min-h-[100dvh] pb-6">
      <TopHUD />
      <div className="mx-auto mt-4 grid max-w-5xl gap-4 px-3 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-2">
          {MENU.map((m) => {
            const active = m.key === "home";
            return (
              <button
                key={m.key}
                onClick={() => g.go(m.key)}
                className={`btn3d flex items-center gap-3 rounded-2xl border-b-4 px-4 py-3 text-left font-display text-lg font-extrabold shadow-md ${
                  active
                    ? "border-amber-400 bg-gradient-to-r from-amber-300 to-orange-400 text-amber-950"
                    : "border-sky-700 bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                {m.label}
              </button>
            );
          })}
          <button
            onClick={() => g.go("teacher")}
            className="btn3d mt-1 flex items-center gap-3 rounded-2xl border-b-4 border-sky-700 bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3 text-left font-display text-lg font-extrabold text-white shadow-md"
          >
            <span className="text-2xl">👩‍🏫</span>
            Mode Guru
          </button>
        </aside>

        <div className="relative flex min-h-[52vh] flex-col items-center justify-center md:items-end">
          <div className="speech relative z-10 max-w-sm rounded-3xl p-4 text-center font-display text-lg font-extrabold leading-snug text-sky-800 sm:text-xl md:mr-40">
            Ayo, selesaikan semua level untuk menjadi Pahlawan Sistem Pernapasan!
          </div>
          <div className="anim-float mt-2 md:absolute md:bottom-0 md:right-4">
            <Oxi size={220} mood="excited" />
          </div>
        </div>
      </div>
    </div>
  );
}
