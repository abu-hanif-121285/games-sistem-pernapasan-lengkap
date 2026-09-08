import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { audio, type SoundName } from "./audio";
import { BADGES, LEVELS } from "./content";

export type Screen =
  | "splash"
  | "name"
  | "home"
  | "map"
  | "level"
  | "learn"
  | "badges"
  | "scores"
  | "settings"
  | "teacher"
  | "final"
  | "certificate";

export type SaveData = {
  name: string;
  xp: number;
  coins: number;
  levelStars: Record<string, number>;
  levelScore: Record<string, number>;
  badges: string[];
  playSeconds: number;
  createdAt: number;
  lastPlayed: number;
  finished: boolean;
};

export type ScoreEntry = { name: string; score: number; xp: number; stars: number; date: number };
export type StudentRow = SaveData & { totalStars: number; avgScore: number };

const SAVE_KEY = "oxi_save_v2";
const SETTINGS_KEY = "oxi_settings_v2";
const SCORES_KEY = "oxi_scores_v2";
const CLASS_KEY = "oxi_class_v2";

const emptySave = (name = ""): SaveData => ({
  name,
  xp: 0,
  coins: 0,
  levelStars: {},
  levelScore: {},
  badges: [],
  playSeconds: 0,
  createdAt: Date.now(),
  lastPlayed: Date.now(),
  finished: false,
});

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}
function loadArr<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage penuh / private mode */
  }
}

export type Particle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  dur: number;
};
export type FloatText = { id: number; x: number; y: number; text: string; color: string };

export type LevelResult = { correct: number; total: number; extraNote?: string };

type Ctx = {
  data: SaveData;
  settings: { sfx: boolean; music: boolean };
  scores: ScoreEntry[];
  screen: Screen;
  currentLevel: number;
  lives: number;
  combo: number;
  bestCombo: number;
  paused: boolean;
  gameOver: boolean;
  helpOpen: boolean;
  particles: Particle[];
  floats: FloatText[];
  shake: { id: number; power: number } | null;
  confetti: number;
  levelResult: null | {
    level: number;
    score: number;
    stars: number;
    xp: number;
    coins: number;
    correct: number;
    total: number;
    newBadges: string[];
  };
  go: (s: Screen) => void;
  startLevel: (n: number) => void;
  setName: (n: string) => void;
  sfx: (n: SoundName) => void;
  toggleSfx: () => void;
  toggleMusic: () => void;
  setPaused: (v: boolean) => void;
  setHelpOpen: (v: boolean) => void;
  addXp: (n: number) => void;
  addCoins: (n: number) => void;
  loseLife: () => number;
  refillLives: () => void;
  registerAnswer: (correct: boolean, elapsedMs: number, origin?: { x: number; y: number }) => { xp: number; combo: number; label: string };
  finishLevel: (level: number, result: LevelResult) => void;
  closeLevelResult: () => void;
  burst: (x: number, y: number, colors?: string[], count?: number, power?: number) => void;
  floatText: (x: number, y: number, text: string, color?: string) => void;
  doShake: (power?: number) => void;
  fireConfetti: () => void;
  resetProgress: () => void;
  unlocked: (level: number) => boolean;
  totalStars: number;
  levelXpNeeded: number;
  playerLevel: number;
  xpIntoLevel: number;
  students: StudentRow[];
};

const GameCtx = createContext<Ctx | null>(null);

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame harus dipakai di dalam GameProvider");
  return c;
}

let uid = 1;

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SaveData>(() => load<SaveData>(SAVE_KEY, emptySave()));
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, { sfx: true, music: true }));
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadArr<ScoreEntry>(SCORES_KEY));
  const [students, setStudents] = useState<StudentRow[]>(() => loadArr<StudentRow>(CLASS_KEY));
  const [screen, setScreen] = useState<Screen>("splash");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [shake, setShake] = useState<{ id: number; power: number } | null>(null);
  const [confetti, setConfetti] = useState(0);
  const [levelResult, setLevelResult] = useState<Ctx["levelResult"]>(null);
  const sessionStart = useRef(Date.now());
  const dataRef = useRef(data);
  dataRef.current = data;
  const livesRef = useRef(3);
  const comboRef = useRef(0);

  /* ------- persistence ------- */
  useEffect(() => save(SAVE_KEY, data), [data]);
  useEffect(() => save(SETTINGS_KEY, settings), [settings]);
  useEffect(() => save(SCORES_KEY, scores), [scores]);
  useEffect(() => save(CLASS_KEY, students), [students]);

  useEffect(() => {
    audio.setSfx(settings.sfx);
    audio.musicOn = settings.music;
  }, [settings]);

  /* jam bermain */
  useEffect(() => {
    const t = window.setInterval(() => {
      if (screen !== "splash" && screen !== "name") {
        setData((d) => ({ ...d, playSeconds: d.playSeconds + 5, lastPlayed: Date.now() }));
      }
    }, 5000);
    return () => window.clearInterval(t);
  }, [screen]);

  const sfx = useCallback((n: SoundName) => audio.play(n), []);

  const go = useCallback(
    (s: Screen) => {
      audio.unlock();
      audio.play("click");
      setPaused(false);
      setGameOver(false);
      setScreen(s);
      if (s !== "level") {
        comboRef.current = 0;
        setCombo(0);
      }
    },
    [],
  );

  const startLevel = useCallback((n: number) => {
    audio.unlock();
    audio.play("whoosh");
    setCurrentLevel(n);
    livesRef.current = 3;
    comboRef.current = 0;
    setLives(3);
    setCombo(0);
    setGameOver(false);
    setPaused(false);
    setLevelResult(null);
    setScreen("level");
  }, []);

  const setName = useCallback((n: string) => {
    setData((d) => ({ ...d, name: n.trim().slice(0, 18) || "Penjelajah", createdAt: d.createdAt || Date.now() }));
  }, []);

  const toggleSfx = useCallback(() => {
    setSettings((s) => {
      const v = { ...s, sfx: !s.sfx };
      audio.setSfx(v.sfx);
      if (v.sfx) audio.play("click");
      return v;
    });
  }, []);

  const toggleMusic = useCallback(() => {
    setSettings((s) => {
      const v = { ...s, music: !s.music };
      audio.setMusic(v.music);
      return v;
    });
  }, []);

  /* ------- FX ------- */
  const burst = useCallback((x: number, y: number, colors = ["#38bdf8", "#22d3ee", "#a7f3d0", "#fbbf24"], count = 16, power = 1) => {
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const d = (40 + Math.random() * 90) * power;
      list.push({
        id: uid++,
        x,
        y,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d - 20 * power,
        size: 5 + Math.random() * 9,
        color: colors[i % colors.length],
        dur: 600 + Math.random() * 500,
      });
    }
    setParticles((p) => [...p.slice(-120), ...list]);
    const ids = new Set(list.map((l) => l.id));
    window.setTimeout(() => setParticles((p) => p.filter((q) => !ids.has(q.id))), 1200);
  }, []);

  const floatText = useCallback((x: number, y: number, text: string, color = "#fde68a") => {
    const id = uid++;
    setFloats((f) => [...f.slice(-12), { id, x, y, text, color }]);
    window.setTimeout(() => setFloats((f) => f.filter((q) => q.id !== id)), 1200);
  }, []);

  const doShake = useCallback((power = 8) => {
    setShake({ id: uid++, power });
    window.setTimeout(() => setShake(null), 460);
  }, []);

  const fireConfetti = useCallback(() => setConfetti((c) => c + 1), []);

  /* ------- ekonomi ------- */
  const addXp = useCallback((n: number) => setData((d) => ({ ...d, xp: Math.max(0, d.xp + n) })), []);
  const addCoins = useCallback((n: number) => setData((d) => ({ ...d, coins: Math.max(0, d.coins + n) })), []);

  const loseLife = useCallback(() => {
    const left = Math.max(0, livesRef.current - 1);
    livesRef.current = left;
    setLives(left);
    if (left === 0) setGameOver(true);
    audio.play("hurt");
    doShake(14);
    return left;
  }, [doShake]);

  const refillLives = useCallback(() => {
    livesRef.current = 3;
    setLives(3);
    setGameOver(false);
  }, []);

  const registerAnswer = useCallback(
    (correct: boolean, elapsedMs: number, origin?: { x: number; y: number }) => {
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      if (!correct) {
        comboRef.current = 0;
        setCombo(0);
        audio.play("wrong");
        doShake(10);
        burst(x, y, ["#fb7185", "#f97316"], 10, 0.7);
        return { xp: 0, combo: 0, label: "" };
      }
      const newCombo = comboRef.current + 1;
      comboRef.current = newCombo;
      setCombo(newCombo);
      setBestCombo((b) => Math.max(b, newCombo));
      const fast = elapsedMs < 6000;
      let xp = 100 + (fast ? 50 : 0);
      let label = "+100 XP";
      if (fast) label += " ⚡+50";
      if (newCombo === 3) {
        xp += 100;
        label += " 🔥Combo3 +100";
      } else if (newCombo >= 5 && newCombo % 5 === 0) {
        xp += 200;
        label += ` 🔥Combo${newCombo} +200`;
      }
      addXp(xp);
      addCoins(10);
      audio.play("correct");
      if (newCombo >= 3) audio.play("coin");
      burst(x, y, ["#34d399", "#22d3ee", "#fbbf24", "#f0abfc"], 20, 1.1);
      floatText(x, y, label, "#bbf7d0");
      return { xp, combo: newCombo, label };
    },
    [addCoins, addXp, burst, doShake, floatText],
  );

  const finishLevel = useCallback(
    (level: number, result: LevelResult) => {
      const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 100;
      const stars = pct >= 90 ? 3 : pct >= 75 ? 2 : 1;
      const bonusXp = 100 + stars * 50;
      const bonusCoins = 20 + stars * 10;
      const newBadges: string[] = [];
      const d = dataRef.current;

      const levelStars: Record<string, number> = { ...d.levelStars, [level]: Math.max(d.levelStars[level] ?? 0, stars) };
      const levelScore: Record<string, number> = { ...d.levelScore, [level]: Math.max(d.levelScore[level] ?? 0, pct) };
      const badges = [...d.badges];
      for (const b of BADGES) {
        if (b.id === "pahlawan") continue;
        if (b.level === level && !badges.includes(b.id)) {
          badges.push(b.id);
          newBadges.push(b.id);
        }
      }
      const allDone = LEVELS.every((l) => (levelStars[l.id] ?? 0) > 0);
      if (allDone && !badges.includes("pahlawan")) {
        badges.push("pahlawan");
        newBadges.push("pahlawan");
      }
      const next: SaveData = {
        ...d,
        xp: d.xp + bonusXp,
        coins: d.coins + bonusCoins,
        levelStars,
        levelScore,
        badges,
        finished: d.finished || allDone,
        lastPlayed: Date.now(),
      };
      dataRef.current = next;
      setData(next);

      audio.play("win");
      if (newBadges.length) window.setTimeout(() => audio.play("badge"), 500);
      setConfetti((c) => c + 1);
      setLevelResult({ level, score: pct, stars, xp: bonusXp, coins: bonusCoins, correct: result.correct, total: result.total, newBadges });
    },
    [],
  );

  const closeLevelResult = useCallback(() => {
    setLevelResult(null);
    audio.play("click");
    const cur = dataRef.current;
    const allDone = LEVELS.every((l) => (cur.levelStars[l.id] ?? 0) > 0);
    if (allDone) {
      const totalStars = LEVELS.reduce((s, l) => s + (cur.levelStars[l.id] ?? 0), 0);
      const scoreVals = LEVELS.map((l) => cur.levelScore[l.id] ?? 0);
      const avg = Math.round(scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length);
      setScores((prev) => {
        const entry = { name: cur.name, score: avg, xp: cur.xp, stars: totalStars, date: Date.now() };
        const dupe = prev.some((p) => p.name === entry.name && p.score === entry.score && p.xp === entry.xp);
        const next = dupe ? [...prev] : [...prev, entry];
        next.sort((a, b) => b.score - a.score || b.xp - a.xp);
        return next.slice(0, 20);
      });
      setScreen("final");
    } else {
      setScreen("map");
    }
  }, []);

  /* rekap siswa untuk mode guru — hanya diperbarui saat progres level berubah */
  useEffect(() => {
    const d = dataRef.current;
    if (!d.name) return;
    const totalStars = LEVELS.reduce((s, l) => s + (d.levelStars[l.id] ?? 0), 0);
    const done = LEVELS.filter((l) => (d.levelStars[l.id] ?? 0) > 0);
    if (done.length === 0) return;
    const avg = Math.round(done.reduce((a, l) => a + (d.levelScore[l.id] ?? 0), 0) / done.length);
    setStudents((prev) => {
      const row: StudentRow = { ...d, totalStars, avgScore: avg };
      const idx = prev.findIndex((p) => p.name.toLowerCase() === d.name.toLowerCase());
      const next = [...prev];
      if (idx >= 0) next[idx] = row;
      else next.push(row);
      return next.slice(-40);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.levelStars, data.levelScore, data.badges, data.name]);

  const resetProgress = useCallback(() => {
    const fresh = emptySave(dataRef.current.name);
    dataRef.current = fresh;
    setData(fresh);
    livesRef.current = 3;
    comboRef.current = 0;
    setLives(3);
    setCombo(0);
    audio.play("pop");
  }, []);

  const unlocked = useCallback(
    (level: number) => level === 1 || (data.levelStars[level - 1] ?? 0) > 0,
    [data.levelStars],
  );

  const totalStars = useMemo(
    () => LEVELS.reduce((s, l) => s + (data.levelStars[l.id] ?? 0), 0),
    [data.levelStars],
  );

  const playerLevel = Math.floor(data.xp / 500) + 1;
  const xpIntoLevel = data.xp % 500;

  const value: Ctx = {
    data,
    settings,
    scores,
    screen,
    currentLevel,
    lives,
    combo,
    bestCombo,
    paused,
    gameOver,
    helpOpen,
    particles,
    floats,
    shake,
    confetti,
    levelResult,
    go,
    startLevel,
    setName,
    sfx,
    toggleSfx,
    toggleMusic,
    setPaused,
    setHelpOpen,
    addXp,
    addCoins,
    loseLife,
    refillLives,
    registerAnswer,
    finishLevel,
    closeLevelResult,
    burst,
    floatText,
    doShake,
    fireConfetti,
    resetProgress,
    unlocked,
    totalStars,
    levelXpNeeded: 500,
    playerLevel,
    xpIntoLevel,
    students,
  };

  useEffect(() => {
    sessionStart.current = Date.now();
  }, []);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}
