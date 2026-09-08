import { useMemo, useState } from "react";
import { AIR_PATH, ORGANS, type OrganId } from "../game/content";
import { useGame } from "../game/store";
import { useDragDrop } from "../components/DragDrop";
import { Btn, Card, Chip, OxiSpeech } from "../components/UI";
import { Oxi } from "../components/Art";

const byId = (id: string) => ORGANS.find((o) => o.id === id)!;

function CardFace({ id, tone = "idle" }: { id: string; tone?: "idle" | "ok" | "bad" | "ghost" }) {
  const o = byId(id);
  const tones = {
    idle: "from-cyan-500/30 to-sky-700/30 border-cyan-200/40 text-sky-900",
    ok: "from-emerald-400/40 to-teal-600/40 border-emerald-200/70 text-emerald-800",
    bad: "from-rose-500/40 to-red-700/40 border-rose-200/60 text-rose-800",
    ghost: "from-cyan-400/70 to-sky-700/70 border-white/60 text-sky-900",
  }[tone];
  return (
    <div className={`flex w-full items-center gap-2 rounded-2xl border-2 bg-gradient-to-br px-2.5 py-2 shadow-lg ${tones}`}>
      <span className="text-xl sm:text-2xl">{o.emoji}</span>
      <span className="font-display text-xs font-extrabold leading-tight sm:text-sm">{o.nama.split(" (")[0]}</span>
    </div>
  );
}

export default function Level2() {
  const g = useGame();
  const initialPool = useMemo(() => [...AIR_PATH].sort(() => Math.random() - 0.5), []);
  const [pool, setPool] = useState<string[]>(initialPool);
  const [slots, setSlots] = useState<(string | null)[]>(Array(7).fill(null));
  const [locked, setLocked] = useState<boolean[]>(Array(7).fill(false));
  const [wrongIdx, setWrongIdx] = useState<number[]>([]);
  const [checks, setChecks] = useState(0);
  const [firstScore, setFirstScore] = useState<number | null>(null);
  const [msg, setMsg] = useState("Seret kartu organ ke urutan yang benar. Bisa juga ketuk kartu lalu ketuk kotak tujuan!");

  const onDrop = (itemId: string, zoneId: string | null) => {
    setWrongIdx([]);
    if (!zoneId || zoneId === "pool") {
      setSlots((s) => s.map((v, i) => (v === itemId && !locked[i] ? null : v)));
      setPool((p) => (p.includes(itemId) ? p : [...p, itemId]));
      return;
    }
    const m = /^slot-(\d+)$/.exec(zoneId);
    if (!m) return;
    const target = Number(m[1]);
    if (locked[target]) return;
    g.sfx("pop");
    const next = [...slots];
    const from = next.indexOf(itemId);
    const displaced = next[target];
    next[target] = itemId;
    let newPool = pool.filter((x) => x !== itemId);
    if (from >= 0 && from !== target) next[from] = displaced ?? null;
    else if (displaced && !newPool.includes(displaced)) newPool = [...newPool, displaced];
    setSlots(next);
    setPool(newPool);
  };

  const dnd = useDragDrop(onDrop);

  const check = () => {
    if (slots.some((s) => s === null)) {
      setMsg("Semua kotak harus terisi dulu ya. Yuk lengkapi jalurnya!");
      g.sfx("wrong");
      g.doShake(6);
      return;
    }
    const ok = slots.map((s, i) => s === AIR_PATH[i]);
    const nCorrect = ok.filter(Boolean).length;
    setChecks((c) => c + 1);
    if (firstScore === null) setFirstScore(nCorrect);

    if (nCorrect === 7) {
      setLocked(Array(7).fill(true));
      g.registerAnswer(true, 1, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
      g.addXp(200);
      g.floatText(window.innerWidth / 2, window.innerHeight / 2 - 40, "+200 XP JALUR LENGKAP!", "#a7f3d0");
      setMsg("🎉 Hebat! OXI berhasil menemukan jalan menuju alveolus!");
      window.setTimeout(() => g.finishLevel(2, { correct: firstScore ?? nCorrect, total: 7 }), 900);
    } else {
      const bad = ok.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
      setWrongIdx(bad);
      setLocked(ok.map((v, i) => v || locked[i]));
      // kembalikan kartu yang salah ke pool
      setSlots((prev) => prev.map((v, i) => (ok[i] ? v : null)));
      setPool((p) => [...p, ...bad.map((i) => slots[i]!).filter(Boolean)]);
      g.sfx("wrong");
      g.doShake(9);
      setMsg(`Ada ${7 - nCorrect} kartu yang belum tepat. Ingat: udara masuk dari hidung dulu, berakhir di alveolus.`);
    }
  };

  const reset = () => {
    setPool([...AIR_PATH].sort(() => Math.random() - 0.5));
    setSlots(Array(7).fill(null));
    setLocked(Array(7).fill(false));
    setWrongIdx([]);
    setMsg("Diacak lagi! Susun ulang jalur udaranya ya.");
  };

  return (
    <div className="mx-auto max-w-5xl">
      {dnd.ghost}
      <OxiSpeech text={msg} mood={msg.startsWith("🎉") ? "excited" : "happy"} size={70} className="mb-3" />

      <Card className="p-3 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Chip tone="emerald">🛤️ Urutan Jalur Udara</Chip>
          <Chip tone="sky">Percobaan: {checks}</Chip>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {slots.map((item, i) => {
            const over = dnd.overZone === `slot-${i}`;
            const bad = wrongIdx.includes(i);
            return (
              <div
                key={i}
                {...dnd.zoneProps(`slot-${i}`)}
                className={`relative flex min-h-[86px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-1.5 transition ${
                  over ? "scale-105 border-cyan-300 bg-cyan-400/25" : bad ? "border-rose-400 bg-rose-500/15 anim-shake" : "border-sky-200 bg-sky-50"
                } ${locked[i] ? "border-solid border-emerald-300/70 bg-emerald-500/15" : ""}`}
              >
                <span className="absolute -top-2 -left-1 grid h-6 w-6 place-items-center rounded-full bg-slate-900 font-display text-xs font-extrabold text-sky-700 ring-2 ring-cyan-400/50">
                  {i + 1}
                </span>
                {item ? (
                  <div
                    {...(locked[i] ? {} : dnd.itemProps(item, <CardFace id={item} tone="ghost" />))}
                    className={`w-full cursor-grab active:cursor-grabbing ${dnd.selected === item ? "ring-2 ring-amber-300 rounded-2xl" : ""}`}
                  >
                    <CardFace id={item} tone={locked[i] ? "ok" : "idle"} />
                  </div>
                ) : (
                  <span className="text-2xl opacity-30">＋</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-3" {...dnd.zoneProps("pool")}>
          <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-sky-300/80">Kartu Organ</div>
          <div className="flex min-h-[70px] flex-wrap gap-2">
            {pool.length === 0 && <span className="self-center text-sm text-slate-500">Semua kartu sudah dipasang ✔</span>}
            {pool.map((id) => (
              <div
                key={id}
                {...dnd.itemProps(id, <CardFace id={id} tone="ghost" />)}
                className={`w-[46%] cursor-grab active:cursor-grabbing sm:w-[150px] ${
                  dnd.selected === id ? "scale-105 rounded-2xl ring-2 ring-amber-300" : ""
                }`}
              >
                <CardFace id={id as OrganId} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Btn variant="ghost" onClick={reset}>
            🔀 Acak Ulang
          </Btn>
          <Btn variant="success" size="lg" onClick={check}>
            🔍 Periksa Jalur
          </Btn>
        </div>
      </Card>

      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-3">
        <Oxi size={46} mood="think" />
        <p className="text-xs font-semibold text-slate-700 sm:text-sm">
          Petunjuk: udara masuk lewat <b>hidung</b> → melewati persimpangan <b>faring</b> → <b>laring</b> (pita suara) → pipa{" "}
          <b>trakea</b> → bercabang jadi <b>bronkus</b> → mengecil jadi <b>bronkiolus</b> → berakhir di gelembung <b>alveolus</b>.
        </p>
      </div>
    </div>
  );
}
