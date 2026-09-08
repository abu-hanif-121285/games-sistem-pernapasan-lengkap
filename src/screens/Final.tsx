import { useEffect } from "react";
import { BADGES, LEVELS, scoreCategory } from "../game/content";
import { useGame } from "../game/store";
import { Oxi, StarRow } from "../components/Art";
import { Btn, Card, Chip, TopHUD } from "../components/UI";

export function FinalScreen() {
  const g = useGame();
  const scores = LEVELS.map((l) => g.data.levelScore[l.id] ?? 0);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / LEVELS.length);
  const cat = scoreCategory(avg);

  useEffect(() => {
    g.fireConfetti();
    const t = window.setTimeout(() => g.fireConfetti(), 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[100dvh] pb-28">
      <TopHUD onBack={() => g.go("home")} />
      <div className="mx-auto mt-4 max-w-3xl px-3">
        <Card className="relative overflow-hidden p-5 text-center sm:p-7">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="relative">
            <div className="anim-pop text-6xl">🎉</div>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-sky-900 sm:text-5xl">SELAMAT, {g.data.name}!</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm font-semibold text-slate-700 sm:text-base">
              “Kamu telah membantu OXI menyelesaikan perjalanan melalui sistem pernapasan!”
            </p>

            <div className="mt-4 flex justify-center">
              <div className="anim-float">
                <Oxi size={124} mood="excited" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat v={g.data.xp} l="Total XP" e="⚡" c="text-sky-700" />
              <Stat v={g.data.coins} l="Total Koin" e="🪙" c="text-amber-700" />
              <Stat v={`${g.totalStars}/24`} l="Bintang" e="⭐" c="text-amber-600" />
              <Stat v={`${avg}%`} l="Keberhasilan" e="📊" c="text-emerald-700" />
            </div>

            <div className="mt-4 rounded-3xl border border-amber-300/40 bg-gradient-to-br from-amber-500/25 to-orange-600/15 p-4">
              <div className="font-display text-sm font-bold uppercase tracking-widest text-amber-700">🏆 GELAR</div>
              <div className="font-display text-2xl font-extrabold text-sky-900 sm:text-3xl">PAHLAWAN SISTEM PERNAPASAN</div>
              <div className={`mt-1 font-display text-lg font-extrabold ${cat.color}`}>
                {cat.emoji} {cat.label} — {cat.desc}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 font-display text-base font-extrabold text-sky-900">Badge yang diperoleh</div>
              <div className="flex flex-wrap justify-center gap-2">
                {BADGES.map((b) => {
                  const has = g.data.badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
                        has ? "border-amber-300/50 bg-amber-500/20" : "border-sky-100 bg-sky-50 opacity-50 grayscale"
                      }`}
                    >
                      <span className="text-2xl">{has ? b.emoji : "🔒"}</span>
                      <span className="font-display text-xs font-extrabold text-sky-900 sm:text-sm">{b.nama}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {LEVELS.map((l) => (
                <div key={l.id} className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2">
                  <span>{l.emoji}</span>
                  <span className="min-w-0 flex-1 truncate text-left font-display text-sm font-bold text-sky-900">
                    {l.id}. {l.nama}
                  </span>
                  <StarRow value={g.data.levelStars[l.id] ?? 0} size={14} />
                  <span className="w-9 text-right font-display text-sm font-extrabold text-sky-900">{g.data.levelScore[l.id] ?? 0}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-cyan-300/30 bg-cyan-500/12 p-4 text-sm font-semibold leading-relaxed text-sky-900 sm:text-base">
              “Bernapas adalah proses yang sangat penting bagi kehidupan. Jagalah kesehatan sistem pernapasan dengan menghindari asap
              rokok dan polusi, berolahraga, serta menjaga kebersihan lingkungan.”
              <div className="mt-2 font-display text-lg font-extrabold text-sky-700">🌬️ Terima kasih, Pahlawan O₂!</div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Btn
                variant="primary"
                size="lg"
                onClick={() => {
                  g.resetProgress();
                  g.go("map");
                }}
              >
                🔄 MAIN LAGI
              </Btn>
              <Btn variant="success" size="lg" onClick={() => g.go("learn")}>
                📚 ULANGI MATERI
              </Btn>
              <Btn variant="warn" size="lg" onClick={() => g.go("badges")}>
                🏆 LIHAT BADGE
              </Btn>
              <Btn variant="violet" size="lg" onClick={() => g.go("certificate")}>
                📜 SERTIFIKAT
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ v, l, e, c }: { v: string | number; l: string; e: string; c: string }) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3">
      <div className="text-xl">{e}</div>
      <div className={`font-display text-xl font-extrabold sm:text-2xl ${c}`}>{v}</div>
      <div className="text-[11px] font-bold text-sky-600">{l}</div>
    </div>
  );
}

export function CertificateScreen() {
  const g = useGame();
  const scores = LEVELS.map((l) => g.data.levelScore[l.id] ?? 0);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / LEVELS.length);
  const cat = scoreCategory(avg);
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-[100dvh] pb-28">
      <div className="no-print">
        <TopHUD onBack={() => g.go("final")} />
      </div>
      <div className="mx-auto mt-4 max-w-3xl px-3">
        <div className="rounded-[28px] border-[6px] border-amber-300/70 bg-gradient-to-br from-[#0b2447] to-[#123055] p-5 shadow-2xl sm:p-8 print:border-amber-500 print:bg-white print:text-slate-900">
          <div className="rounded-[20px] border-2 border-dashed border-amber-200/50 p-4 text-center sm:p-7">
            <div className="font-display text-xs font-extrabold uppercase tracking-[0.3em] text-amber-700 print:text-amber-700">
              Sertifikat Petualangan
            </div>
            <div className="mt-2 text-5xl">🏆</div>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-sky-900 sm:text-4xl print:text-slate-900">
              PAHLAWAN SISTEM PERNAPASAN
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-600 print:text-slate-600">Diberikan kepada</p>
            <div className="mt-1 font-display text-3xl font-extrabold text-sky-700 underline decoration-amber-300/60 decoration-4 underline-offset-8 sm:text-5xl print:text-sky-800">
              {g.data.name}
            </div>
            <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-relaxed text-slate-700 print:text-slate-700">
              atas keberhasilannya menyelesaikan misi <b>🌬️ Petualangan O₂</b> — menjelajahi sistem pernapasan manusia, memahami jalur
              udara, proses inspirasi–ekspirasi, peran diafragma, pertukaran gas di alveolus, gangguan pernapasan, serta cara menjaga
              kesehatan organ pernapasan.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Nilai Akhir", `${avg}`],
                ["Predikat", `${cat.emoji} ${cat.label}`],
                ["Bintang", `${g.totalStars}/24`],
                ["Total XP", `${g.data.xp}`],
              ].map(([l, v]) => (
                <div key={l} className="rounded-2xl border border-amber-200/30 bg-sky-50 p-2 print:border-slate-300 print:bg-slate-50">
                  <div className="text-[10px] font-bold uppercase text-amber-700 print:text-slate-500">{l}</div>
                  <div className="font-display text-base font-extrabold text-sky-900 print:text-slate-900">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-1">
              {BADGES.filter((b) => g.data.badges.includes(b.id)).map((b) => (
                <span key={b.id} className="text-2xl" title={b.nama}>
                  {b.emoji}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between gap-3">
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-500 print:text-slate-600">Tanggal</div>
                <div className="font-display text-sm font-extrabold text-sky-900 print:text-slate-900">{today}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">🌬️</div>
                <div className="border-t border-amber-200/60 px-6 pt-1 font-display text-xs font-extrabold text-amber-800 print:text-slate-800">
                  OXI — Pemandu Petualangan
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="no-print mt-4 flex flex-wrap justify-center gap-2">
          <Btn variant="ghost" onClick={() => g.go("final")}>
            ← Kembali
          </Btn>
          <Btn variant="warn" size="lg" onClick={() => window.print()}>
            🖨️ Cetak / Simpan PDF
          </Btn>
        </div>
        <div className="no-print mt-3 flex justify-center">
          <Chip tone="sky">Tips: pilih “Simpan sebagai PDF” pada jendela cetak</Chip>
        </div>
      </div>
    </div>
  );
}
