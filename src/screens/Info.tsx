import { useState } from "react";
import { BADGES, LEVELS, scoreCategory } from "../game/content";
import { useGame } from "../game/store";
import { StarRow } from "../components/Art";
import { Btn, Card, Chip, Modal, TopHUD } from "../components/UI";

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h} jam ${m % 60} mnt` : `${m} menit ${s % 60} dtk`;
};
const fmtDate = (t: number) => new Date(t).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

/* ---------------- BADGE ---------------- */
export function BadgesScreen() {
  const g = useGame();
  return (
    <div className="min-h-[100dvh] pb-28">
      <TopHUD onBack={() => g.go("home")} />
      <div className="mx-auto mt-4 max-w-4xl px-3">
        <div className="mb-4 text-center">
          <h1 className="banner mx-auto w-fit rounded-2xl px-6 py-2 font-display text-2xl font-extrabold sm:text-3xl">🏆 KOLEKSI BADGE</h1>
          <p className="text-sm font-semibold text-sky-700">
            Kamu sudah mengumpulkan {g.data.badges.length} dari {BADGES.length} badge
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b, i) => {
            const has = g.data.badges.includes(b.id);
            return (
              <Card
                key={b.id}
                className={`anim-up p-4 text-center transition ${has ? "" : "opacity-60"}`}
              >
                <div style={{ animationDelay: `${i * 60}ms` }}>
                  <div
                    className={`mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br text-5xl ${
                      has ? `${b.warna} shadow-[0_0_30px_rgba(56,189,248,.55)]` : "from-slate-700 to-slate-900 grayscale"
                    }`}
                  >
                    {has ? b.emoji : "🔒"}
                  </div>
                  <h3 className="mt-3 font-display text-base font-extrabold text-sky-900 sm:text-lg">{b.nama}</h3>
                  <p className="text-xs font-semibold text-sky-600">{b.syarat}</p>
                  <div className="mt-2">
                    <Chip tone={has ? "emerald" : "sky"}>{has ? "✅ Terbuka" : "🔒 Terkunci"}</Chip>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- NILAI ---------------- */
export function ScoresScreen() {
  const g = useGame();
  const done = LEVELS.filter((l) => (g.data.levelStars[l.id] ?? 0) > 0);
  const avg = done.length ? Math.round(done.reduce((a, l) => a + (g.data.levelScore[l.id] ?? 0), 0) / done.length) : 0;
  const cat = scoreCategory(avg);

  return (
    <div className="min-h-[100dvh] pb-28">
      <TopHUD onBack={() => g.go("home")} />
      <div className="mx-auto mt-4 max-w-4xl px-3">
        <div className="mb-4 text-center">
          <h1 className="banner mx-auto w-fit rounded-2xl px-6 py-2 font-display text-2xl font-extrabold sm:text-3xl">📊 NILAI & HASIL BELAJAR</h1>
        </div>

        <Card className="mb-4 p-4 text-center">
          <div className="font-display text-6xl font-extrabold text-sky-900">{avg}</div>
          <div className={`font-display text-xl font-extrabold ${cat.color}`}>
            {cat.emoji} {cat.label}
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-600">{cat.desc}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Chip tone="amber">⭐ {g.totalStars}/24 bintang</Chip>
            <Chip tone="sky">⚡ {g.data.xp} XP</Chip>
            <Chip tone="violet">🪙 {g.data.coins} koin</Chip>
            <Chip tone="emerald">⏱️ {fmtTime(g.data.playSeconds)}</Chip>
          </div>
        </Card>

        <Card className="mb-4 overflow-hidden">
          <h2 className="border-b border-sky-100 p-3 font-display text-lg font-extrabold text-sky-900">Nilai per Level</h2>
          <div className="divide-y divide-sky-100">
            {LEVELS.map((l) => {
              const sc = g.data.levelScore[l.id] ?? 0;
              const st = g.data.levelStars[l.id] ?? 0;
              const c = scoreCategory(sc);
              return (
                <div key={l.id} className="flex flex-wrap items-center gap-2 p-3">
                  <span className="text-xl">{l.emoji}</span>
                  <span className="min-w-0 flex-1 truncate font-display text-sm font-bold text-sky-900 sm:text-base">
                    {l.id}. {l.nama}
                  </span>
                  <StarRow value={st} size={15} />
                  {st > 0 ? (
                    <>
                      <span className="w-12 text-right font-display text-lg font-extrabold text-sky-900">{sc}</span>
                      <span className={`w-28 text-right text-xs font-bold ${c.color}`}>
                        {c.emoji} {c.label}
                      </span>
                    </>
                  ) : (
                    <span className="w-40 text-right text-xs font-bold text-slate-500">Belum dimainkan</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <h2 className="border-b border-sky-100 p-3 font-display text-lg font-extrabold text-sky-900">🏅 Papan Skor Tertinggi</h2>
          {g.scores.length === 0 ? (
            <p className="p-4 text-sm font-semibold text-slate-500">
              Belum ada skor. Selesaikan semua level untuk masuk papan skor!
            </p>
          ) : (
            <div className="divide-y divide-sky-100">
              {g.scores.slice(0, 10).map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-50 font-display text-sm font-extrabold text-amber-700">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-sm font-bold text-sky-900 sm:text-base">{s.name}</span>
                  <span className="hidden text-xs font-semibold text-slate-500 sm:inline">{fmtDate(s.date)}</span>
                  <span className="text-xs font-bold text-amber-700">⭐{s.stars}</span>
                  <span className="text-xs font-bold text-sky-700">⚡{s.xp}</span>
                  <span className="w-10 text-right font-display text-lg font-extrabold text-sky-900">{s.score}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- PENGATURAN ---------------- */
export function SettingsScreen() {
  const g = useGame();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="min-h-[100dvh] pb-28">
      <TopHUD onBack={() => g.go("home")} />
      <div className="mx-auto mt-4 max-w-2xl px-3">
        <h1 className="mb-4 text-center font-display text-2xl font-extrabold text-sky-900 sm:text-4xl">⚙️ PENGATURAN</h1>

        <Card className="mb-3 divide-y divide-sky-100">
          <Row label="🔊 Efek Suara" desc="Suara tombol, benar, salah, dan kemenangan">
            <Toggle on={g.settings.sfx} onClick={g.toggleSfx} />
          </Row>
          <Row label="🎵 Musik Latar" desc="Musik lembut selama bermain">
            <Toggle on={g.settings.music} onClick={g.toggleMusic} />
          </Row>
          <Row label="🧑‍🚀 Nama Penjelajah" desc={g.data.name || "Belum diisi"}>
            <Btn variant="ghost" size="sm" onClick={() => g.go("name")}>
              Ubah
            </Btn>
          </Row>
          <Row label="💾 Data Tersimpan" desc="Nama, XP, koin, bintang, badge, dan progres level">
            <Chip tone="emerald">LocalStorage ✔</Chip>
          </Row>
        </Card>

        <Card className="p-4">
          <h3 className="font-display text-lg font-extrabold text-rose-700">Zona Hati-hati</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Mengulang petualangan akan menghapus XP, koin, bintang, badge, dan progres levelmu. Nama tetap tersimpan.
          </p>
          <div className="mt-3">
            <Btn variant="danger" onClick={() => setConfirm(true)}>
              🔄 Reset Progres
            </Btn>
          </div>
        </Card>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)}>
        <div className="text-center">
          <div className="text-5xl">⚠️</div>
          <h3 className="mt-2 font-display text-xl font-extrabold text-sky-900">Yakin ingin mengulang dari awal?</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600">Semua progres akan kembali ke nol.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Btn variant="ghost" onClick={() => setConfirm(false)}>
              Batal
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                g.resetProgress();
                setConfirm(false);
                g.go("home");
              }}
            >
              Ya, Reset
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <div className="font-display text-base font-extrabold text-sky-900">{label}</div>
        <div className="truncate text-xs font-semibold text-sky-600">{desc}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`btn3d relative h-9 w-16 rounded-full border-2 transition ${on ? "border-emerald-200/60 bg-emerald-500/70" : "border-sky-200 bg-slate-700"}`}
      aria-label={on ? "Matikan" : "Nyalakan"}
    >
      <span
        className={`absolute top-0.5 grid h-7 w-7 place-items-center rounded-full bg-white text-xs transition-all ${on ? "left-[30px]" : "left-0.5"}`}
      >
        {on ? "🔊" : "🔇"}
      </span>
    </button>
  );
}

/* ---------------- MODE GURU ---------------- */
export function TeacherScreen() {
  const g = useGame();
  const rows = g.students.length ? g.students : [];
  return (
    <div className="min-h-[100dvh] pb-28">
      <TopHUD onBack={() => g.go("home")} />
      <div className="mx-auto mt-4 max-w-5xl px-3">
        <div className="mb-4 text-center">
          <h1 className="banner mx-auto w-fit rounded-2xl px-6 py-2 font-display text-2xl font-extrabold sm:text-3xl">👩‍🏫 MODE GURU</h1>
          <p className="text-sm font-semibold text-sky-700">Rekap sederhana progres siswa pada perangkat ini (LocalStorage)</p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-sky-50 font-display text-xs uppercase tracking-wide text-sky-700">
                <tr>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">Level Selesai</th>
                  <th className="p-3">Nilai</th>
                  <th className="p-3">XP</th>
                  <th className="p-3">⭐</th>
                  <th className="p-3">Badge</th>
                  <th className="p-3">Waktu Bermain</th>
                  <th className="p-3">Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-5 text-center font-semibold text-slate-500">
                      Belum ada data siswa. Data muncul otomatis setelah siswa menyelesaikan minimal satu level.
                    </td>
                  </tr>
                )}
                {rows.map((s) => {
                  const doneLv = LEVELS.filter((l) => (s.levelStars[l.id] ?? 0) > 0);
                  const cat = scoreCategory(s.avgScore);
                  return (
                    <tr key={s.name} className="font-semibold text-sky-900">
                      <td className="p-3 font-display font-extrabold text-sky-900">{s.name}</td>
                      <td className="p-3">
                        <span className="rounded-lg bg-cyan-500/20 px-2 py-1 text-xs font-bold text-sky-700">{doneLv.length}/8</span>
                        <span className="ml-2 text-xs text-slate-500">{doneLv.map((l) => l.id).join(", ") || "-"}</span>
                      </td>
                      <td className={`p-3 font-display font-extrabold ${cat.color}`}>
                        {s.avgScore} {cat.emoji}
                      </td>
                      <td className="p-3">{s.xp}</td>
                      <td className="p-3">{s.totalStars}</td>
                      <td className="p-3">
                        {s.badges.length ? s.badges.map((b) => BADGES.find((x) => x.id === b)?.emoji).join(" ") : "-"}
                      </td>
                      <td className="p-3 text-xs">{fmtTime(s.playSeconds)}</td>
                      <td className="p-3 text-xs">{fmtDate(s.lastPlayed)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mt-4 p-4">
          <h3 className="font-display text-base font-extrabold text-sky-900">Pedoman Penilaian</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            {[
              ["90–100", "🌟 Sangat Baik", "text-emerald-300"],
              ["80–89", "👍 Baik", "text-sky-300"],
              ["70–79", "🙂 Cukup", "text-amber-300"],
              ["< 70", "💪 Perlu Berlatih", "text-rose-300"],
            ].map(([r, l, c]) => (
              <div key={r} className="rounded-2xl border border-sky-100 bg-sky-50 p-3 text-center">
                <div className="font-display text-sm font-extrabold text-sky-900">{r}</div>
                <div className={`text-xs font-bold ${c}`}>{l}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-sky-600">
            Catatan: nilai dihitung dari persentase jawaban benar pada percobaan pertama di setiap level. Data tersimpan lokal tanpa
            server, sehingga aman dan dapat dipakai tanpa internet.
          </p>
        </Card>
      </div>
    </div>
  );
}
