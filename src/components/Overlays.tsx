import { BADGES, LEVELS, scoreCategory } from "../game/content";
import { useGame } from "../game/store";
import { Oxi, StarRow } from "./Art";
import { Btn, Card, Chip, Modal } from "./UI";

export function PauseOverlay({ onRestart }: { onRestart: () => void }) {
  const g = useGame();
  if (!g.paused || g.screen !== "level") return null;
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-sky-950/40 p-4 backdrop-blur-md anim-fade">
      <Card className="anim-pop w-full max-w-sm p-6 text-center">
        <div className="text-5xl">⏸️</div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-sky-800">Permainan Dijeda</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">Santai dulu, progresmu aman kok!</p>
        <div className="mt-5 grid gap-2">
          <Btn variant="success" size="lg" onClick={() => g.setPaused(false)}>
            ▶ Lanjutkan
          </Btn>
          <Btn variant="ghost" onClick={onRestart}>
            🔄 Ulangi Level
          </Btn>
          <Btn variant="ghost" onClick={() => g.go("map")}>
            🗺️ Kembali ke Peta
          </Btn>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={g.toggleSfx} className="btn3d rounded-xl bg-sky-100 px-3 py-2 text-sm font-bold text-sky-800">
            {g.settings.sfx ? "🔊 Suara ON" : "🔇 Suara OFF"}
          </button>
          <button onClick={g.toggleMusic} className="btn3d rounded-xl bg-sky-100 px-3 py-2 text-sm font-bold text-sky-800">
            {g.settings.music ? "🎵 Musik ON" : "🎵 Musik OFF"}
          </button>
        </div>
      </Card>
    </div>
  );
}

export function GameOverOverlay({ onRestart }: { onRestart: () => void }) {
  const g = useGame();
  if (!g.gameOver || g.screen !== "level") return null;
  return (
    <div className="fixed inset-0 z-[112] grid place-items-center bg-sky-950/45 p-4 backdrop-blur-md anim-fade">
      <Card className="anim-pop w-full max-w-md p-6 text-center">
        <div className="flex justify-center">
          <Oxi size={100} mood="sad" />
        </div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-rose-600">Nyawa OXI habis!</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm font-semibold text-slate-600">
          Tidak apa-apa! Setiap penjelajah hebat pernah gagal. Ayo coba lagi — kamu pasti bisa. 💪
        </p>
        <div className="mt-5 grid gap-2">
          <Btn variant="primary" size="lg" onClick={onRestart}>
            🔄 COBA LAGI
          </Btn>
          <Btn variant="ghost" onClick={() => g.go("learn")}>
            📚 Buka Materi Dulu
          </Btn>
          <Btn variant="ghost" onClick={() => g.go("map")}>
            🗺️ Kembali ke Peta
          </Btn>
        </div>
      </Card>
    </div>
  );
}

export function LevelResultModal({ onRetry }: { onRetry: () => void }) {
  const g = useGame();
  const r = g.levelResult;
  if (!r) return null;
  const meta = LEVELS.find((l) => l.id === r.level)!;
  const cat = scoreCategory(r.score);
  const isLast = LEVELS.every((l) => (g.data.levelStars[l.id] ?? 0) > 0);

  return (
    <Modal open>
      <div className="text-center">
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br text-3xl ${meta.warna}`}>{meta.emoji}</div>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-sky-800">Level {r.level} Selesai! 🎉</h2>
        <p className="font-display text-sm font-bold text-sky-600">{meta.nama}</p>

        <div className="mt-3 flex justify-center">
          <StarRow value={r.stars} size={40} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Box e="📊" v={r.score} l="Nilai" />
          <Box e="⚡" v={`+${r.xp}`} l="Bonus XP" />
          <Box e="🪙" v={`+${r.coins}`} l="Koin" />
        </div>

        <div className={`mt-3 font-display text-lg font-extrabold ${cat.color}`}>
          {cat.emoji} {cat.label}
        </div>
        <p className="text-sm font-semibold text-slate-600">
          {cat.desc} Kamu menjawab benar {r.correct} dari {r.total} tantangan.
        </p>

        {r.newBadges.length > 0 && (
          <div className="anim-pop mt-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
            <div className="font-display text-sm font-extrabold text-amber-800">🎖️ BADGE BARU TERBUKA!</div>
            <div className="mt-1 flex flex-wrap justify-center gap-2">
              {r.newBadges.map((id) => {
                const b = BADGES.find((x) => x.id === id)!;
                return (
                  <span key={id} className="flex items-center gap-1 rounded-xl bg-white px-2 py-1 font-display text-xs font-extrabold text-sky-800 shadow">
                    <span className="text-xl">{b.emoji}</span> {b.nama}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Btn variant="ghost" onClick={onRetry}>
            🔄 Ulangi Level
          </Btn>
          <Btn variant="success" size="lg" onClick={g.closeLevelResult}>
            {isLast ? "🏆 Lihat Hasil Akhir" : "🗺️ Lanjut ke Peta"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function Box({ e, v, l }: { e: string; v: string | number; l: string }) {
  return (
    <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-2">
      <div className="text-lg">{e}</div>
      <div className="font-display text-lg font-extrabold text-sky-800">{v}</div>
      <div className="text-[10px] font-bold text-sky-600">{l}</div>
    </div>
  );
}

export function HelpOverlay() {
  const g = useGame();
  const meta = LEVELS.find((l) => l.id === g.currentLevel);
  return (
    <Modal open={g.helpOpen} onClose={() => g.setHelpOpen(false)} wide>
      <div>
        <h2 className="font-display text-xl font-extrabold text-sky-800 sm:text-2xl">❓ Bantuan</h2>
        {g.screen === "level" && meta && (
          <div className="mt-2 rounded-2xl border-2 border-sky-100 bg-sky-50 p-3">
            <div className="font-display text-base font-extrabold text-sky-800">
              {meta.emoji} Level {meta.id} — {meta.nama}
            </div>
            <p className="text-sm font-semibold text-slate-600">{meta.deskripsi}</p>
            <p className="mt-1 text-sm font-bold text-amber-700">💡 {meta.tips}</p>
          </div>
        )}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ["🖱️ / 👆", "Ketuk tombol jawaban, atau seret kartu ke tempatnya. Di HP bisa juga ketuk kartu lalu ketuk kotak tujuan."],
            ["⌨️", "Level arcade: gunakan tombol ⬅️ ➡️ atau A / D untuk bergerak."],
            ["❤️", "Nyawa berkurang jika terkena polusi atau salah menjawab di Boss Battle."],
            ["⭐", "Bintang didapat dari persentase jawaban benar: 90%+ = 3 bintang."],
            ["⚡", "XP bertambah setiap jawaban benar. Jawab cepat & combo memberi bonus XP."],
            ["💾", "Progres, nama, badge, dan nilai tersimpan otomatis di perangkatmu."],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start gap-2 rounded-2xl border-2 border-sky-100 bg-white p-3">
              <span className="text-xl">{k}</span>
              <span className="text-sm font-semibold text-slate-700">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone="emerald">Tidak ada jawaban yang memalukan — semua salah pasti dijelaskan OXI 😊</Chip>
        </div>
        <div className="mt-4 flex justify-end">
          <Btn variant="primary" onClick={() => g.setHelpOpen(false)}>
            Mengerti!
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
