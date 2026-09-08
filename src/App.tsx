import { useEffect, useState } from "react";
import { GameProvider, useGame } from "./game/store";
import { LEVELS } from "./game/content";
import { Background, BottomNav, Chip, FXLayer, TopHUD } from "./components/UI";
import { GameOverOverlay, HelpOverlay, LevelResultModal, PauseOverlay } from "./components/Overlays";
import { NameScreen, SplashScreen } from "./screens/Splash";
import { HomeScreen } from "./screens/Home";
import { MapScreen } from "./screens/MapScreen";
import { LearnScreen } from "./screens/Learn";
import { BadgesScreen, ScoresScreen, SettingsScreen, TeacherScreen } from "./screens/Info";
import { CertificateScreen, FinalScreen } from "./screens/Final";
import Level1 from "./levels/Level1";
import Level2 from "./levels/Level2";
import Level3 from "./levels/Level3";
import Level4 from "./levels/Level4";
import Level5 from "./levels/Level5";
import Level6 from "./levels/Level6";
import Level7 from "./levels/Level7";
import Level8 from "./levels/Level8";

const LEVEL_COMPONENTS: Record<number, () => React.JSX.Element> = {
  1: Level1,
  2: Level2,
  3: Level3,
  4: Level4,
  5: Level5,
  6: Level6,
  7: Level7,
  8: Level8,
};

function LevelHost() {
  const g = useGame();
  const [attempt, setAttempt] = useState(0);
  const meta = LEVELS.find((l) => l.id === g.currentLevel)!;
  const Comp = LEVEL_COMPONENTS[g.currentLevel] ?? Level1;

  const restart = () => {
    g.startLevel(g.currentLevel);
    setAttempt((a) => a + 1);
  };

  useEffect(() => setAttempt(0), [g.currentLevel]);

  /* pintasan keyboard: Esc / P = jeda */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "escape" || k === "p") {
        if (!g.gameOver && !g.levelResult) g.setPaused(!g.paused);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [g]);

  return (
    <div className="min-h-[100dvh] pb-14">
      <TopHUD showLives onBack={() => g.go("map")} onPause={() => g.setPaused(true)} onHelp={() => g.setHelpOpen(true)} />
      <div className="mx-auto mt-3 max-w-6xl px-2 sm:px-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br text-xl ${meta.warna}`}>{meta.emoji}</span>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-extrabold text-sky-900 sm:text-xl">
              Level {meta.id} — {meta.nama}
            </div>
            <div className="truncate text-xs font-semibold text-sky-700 sm:text-sm">{meta.sub}</div>
          </div>
          <div className="ml-auto hidden sm:block">
            <Chip tone="violet">🔥 Combo: {g.combo}</Chip>
          </div>
        </div>
        <div className="panel p-3 sm:p-4">
          <Comp key={`${g.currentLevel}-${attempt}`} />
        </div>
      </div>

      <PauseOverlay onRestart={restart} />
      <GameOverOverlay onRestart={restart} />
      <LevelResultModal onRetry={restart} />
    </div>
  );
}

function Router() {
  const g = useGame();
  switch (g.screen) {
    case "splash":
      return <SplashScreen />;
    case "name":
      return <NameScreen />;
    case "home":
      return <HomeScreen />;
    case "map":
      return <MapScreen />;
    case "level":
      return <LevelHost />;
    case "learn":
      return <LearnScreen />;
    case "badges":
      return <BadgesScreen />;
    case "scores":
      return <ScoresScreen />;
    case "settings":
      return <SettingsScreen />;
    case "teacher":
      return <TeacherScreen />;
    case "final":
      return <FinalScreen />;
    case "certificate":
      return <CertificateScreen />;
    default:
      return <HomeScreen />;
  }
}

function Shell() {
  const g = useGame();
  return (
    <div className={g.shake ? "anim-shake" : ""} style={{ ["--sp" as string]: `${g.shake?.power ?? 6}px` }}>
      <Background />
      <Router />
      <BottomNav />
      <HelpOverlay />
      <FXLayer />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
