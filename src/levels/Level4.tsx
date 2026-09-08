import { useMemo, useState } from "react";
import { LEVEL4_CHIPS } from "../game/content";
import { useGame } from "../game/store";
import { useDragDrop } from "../components/DragDrop";
import { BreathingScene } from "../components/Art";
import { Btn, Card, Chip, OxiSpeech } from "../components/UI";

type Zone = "pool" | "inspirasi" | "ekspirasi";
const chipById = (id: string) => LEVEL4_CHIPS.find((c) => c.id === id)!;

function ChipFace({ id, tone = "idle" }: { id: string; tone?: "idle" | "ok" | "bad" | "ghost" }) {
  const c = chipById(id);
  const tones = {
    idle: "from-white/16 to-white/6 border-sky-200 text-sky-900",
    ok: "from-emerald-400/40 to-teal-600/40 border-emerald-200/70 text-emerald-800",
    bad: "from-rose-500/40 to-red-700/40 border-rose-200/60 text-rose-800",
    ghost: "from-cyan-400/80 to-sky-700/80 border-white/60 text-sky-900",
  }[tone];
  return (
    <div className={`flex items-center gap-2 rounded-2xl border-2 bg-gradient-to-br px-3 py-2 shadow-lg ${tones}`}>
      <span className="text-lg">{c.icon}</span>
      <span className="font-display text-xs font-extrabold sm:text-sm">{c.text}</span>
    </div>
  );
}

type DnD = ReturnType<typeof useDragDrop>;

function Bucket({
  z,
  title,
  emoji,
  color,
  items,
  dnd,
  locked,
}: {
  z: Zone;
  title: string;
  emoji: string;
  color: string;
  items: string[];
  dnd: DnD;
  locked: string[];
}) {
  const over = dnd.overZone === z;
  return (
    <div
      {...dnd.zoneProps(z)}
      className={`flex min-h-[190px] flex-1 flex-col gap-2 rounded-3xl border-2 border-dashed p-3 transition ${
        over ? "scale-[1.02] border-cyan-300 bg-cyan-400/20" : "border-sky-200 bg-sky-50"
      }`}
    >
      <div className={`font-display text-base font-extrabold sm:text-lg ${color}`}>
        {emoji} {title}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((id) => (
          <div
            key={id}
            {...(locked.includes(id) ? {} : dnd.itemProps(id, <ChipFace id={id} tone="ghost" />))}
            className={`cursor-grab active:cursor-grabbing ${dnd.selected === id ? "scale-[1.03] rounded-2xl ring-2 ring-amber-300" : ""}`}
          >
            <ChipFace id={id} tone={locked.includes(id) ? "ok" : "idle"} />
          </div>
        ))}
        {items.length === 0 && <span className="py-6 text-center text-sm text-slate-500">Taruh kartu di sini</span>}
      </div>
    </div>
  );
}

export default function Level4() {
  const g = useGame();
  const shuffled = useMemo(() => [...LEVEL4_CHIPS].sort(() => Math.random() - 0.5).map((c) => c.id), []);
  const [place, setPlace] = useState<Record<string, Zone>>(() => Object.fromEntries(shuffled.map((id) => [id, "pool" as Zone])));
  const [locked, setLocked] = useState<string[]>([]);
  const [bad, setBad] = useState<string[]>([]);
  const [firstScore, setFirstScore] = useState<number | null>(null);
  const [checks, setChecks] = useState(0);
  const [msg, setMsg] = useState("Seret setiap kartu ke kelompok yang tepat: INSPIRASI atau EKSPIRASI!");

  const onDrop = (itemId: string, zoneId: string | null) => {
    if (locked.includes(itemId)) return;
    const z = (zoneId as Zone) ?? "pool";
    if (!["pool", "inspirasi", "ekspirasi"].includes(z)) return;
    setBad((b) => b.filter((x) => x !== itemId));
    setPlace((p) => ({ ...p, [itemId]: z }));
    g.sfx("pop");
  };

  const dnd = useDragDrop(onDrop);
  const inZone = (z: Zone) => shuffled.filter((id) => place[id] === z);

  const check = () => {
    if (inZone("pool").length > 0) {
      setMsg("Masih ada kartu yang belum dikelompokkan. Yuk selesaikan dulu!");
      g.sfx("wrong");
      g.doShake(6);
      return;
    }
    const okIds = shuffled.filter((id) => place[id] === chipById(id).group);
    setChecks((c) => c + 1);
    if (firstScore === null) setFirstScore(okIds.length);
    if (okIds.length === shuffled.length) {
      setLocked(shuffled);
      g.registerAnswer(true, 1, { x: window.innerWidth / 2, y: window.innerHeight / 3 });
      g.addXp(150);
      setMsg("🎉 Sempurna! Kamu paham rahasia diafragma!");
      window.setTimeout(() => g.finishLevel(4, { correct: firstScore ?? okIds.length, total: shuffled.length }), 900);
    } else {
      const wrongIds = shuffled.filter((id) => place[id] !== chipById(id).group);
      setBad(wrongIds);
      setLocked(okIds);
      setPlace((p) => {
        const n = { ...p };
        wrongIds.forEach((id) => (n[id] = "pool"));
        return n;
      });
      g.sfx("wrong");
      g.doShake(9);
      setMsg(`${wrongIds.length} kartu kembali ke bawah. Ingat: saat menarik napas semuanya MEMBESAR, saat menghembuskan semuanya MENGECIL.`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {dnd.ghost}
      <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <OxiSpeech text={msg} mood={msg.startsWith("🎉") ? "excited" : "think"} size={68} />
        <Chip tone="amber">Percobaan: {checks}</Chip>
      </div>

      <Card className="p-3 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_170px]">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Bucket z="inspirasi" title="INSPIRASI" emoji="🌬️" color="text-sky-700" items={inZone("inspirasi")} dnd={dnd} locked={locked} />
            <Bucket z="ekspirasi" title="EKSPIRASI" emoji="💨" color="text-amber-700" items={inZone("ekspirasi")} dnd={dnd} locked={locked} />
          </div>
          <div className="hidden rounded-2xl bg-sky-50 p-1 md:block">
            <BreathingScene phase="in" className="h-full w-full" />
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 p-3" {...dnd.zoneProps("pool")}>
          <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-sky-300/80">Kartu Kondisi</div>
          <div className="flex min-h-[64px] flex-wrap gap-2">
            {inZone("pool").length === 0 && <span className="self-center text-sm text-slate-500">Semua kartu sudah dikelompokkan ✔</span>}
            {inZone("pool").map((id) => (
              <div
                key={id}
                {...dnd.itemProps(id, <ChipFace id={id} tone="ghost" />)}
                className={`cursor-grab active:cursor-grabbing ${bad.includes(id) ? "anim-shake" : ""} ${
                  dnd.selected === id ? "scale-105 rounded-2xl ring-2 ring-amber-300" : ""
                }`}
              >
                <ChipFace id={id} tone={bad.includes(id) ? "bad" : "idle"} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Btn variant="success" size="lg" onClick={check}>
            🔍 Periksa Jawaban
          </Btn>
        </div>
      </Card>
    </div>
  );
}
