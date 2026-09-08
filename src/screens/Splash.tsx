import { useState } from "react";
import { useGame } from "../game/store";
import { CharBoy, CharGirl, Oxi } from "../components/Art";
import { Btn } from "../components/UI";
import { audio } from "../game/audio";

export function SplashScreen() {
  const g = useGame();
  const has = g.data.name.length > 0;
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden p-3 sm:p-6">
      <div className="anim-up relative z-10 w-full max-w-3xl">
        <div className="text-center">
          <h1 className="title-3d text-[2.6rem] sm:text-6xl md:text-7xl">
            PETUALANGAN
            <br />
            <span className="o2">O₂</span>
          </h1>
        </div>

        <div className="relative mx-auto mt-3 flex max-w-md items-center justify-center">
          <img src={`${import.meta.env.BASE_URL}images/wood-sign.png`} alt="" className="h-28 w-auto object-contain sm:h-36" />
          <div className="absolute inset-0 flex items-center justify-center px-10 text-center sm:px-14">
            <p className="font-display text-sm font-extrabold leading-tight text-amber-950 drop-shadow sm:text-lg">
              Misi Menjelajahi
              <br />
              Sistem Pernapasan Manusia
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-center gap-1 sm:gap-6">
          <div className="relative anim-float">
            <Oxi size={150} />
            <div className="speech absolute -right-2 top-4 rounded-2xl px-3 py-1.5 font-display text-xs font-extrabold sm:-right-8 sm:text-sm">
              Hai!
              <br />
              Aku OXI!
            </div>
          </div>
          <div className="hidden sm:block">
            <CharBoy size={150} />
          </div>
          <div className="hidden sm:block">
            <CharGirl size={150} />
          </div>
          <div className="flex sm:hidden">
            <CharBoy size={110} />
            <CharGirl size={110} />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <Btn
            variant="primary"
            size="xl"
            className="w-full max-w-md !from-amber-300 !to-orange-500"
            onClick={() => {
              audio.unlock();
              if (g.settings.music) audio.setMusic(true);
              g.go(has ? "home" : "name");
            }}
          >
            ▶ MULAI PETUALANGAN
          </Btn>
          {has && (
            <button onClick={() => g.go("name")} className="font-display text-sm font-bold text-sky-900 underline underline-offset-4">
              Bukan {g.data.name}? Ganti nama
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NameScreen() {
  const g = useGame();
  const [val, setVal] = useState(g.data.name);
  const submit = () => {
    if (!val.trim()) return;
    audio.unlock();
    g.setName(val);
    if (g.settings.music) audio.setMusic(true);
    g.sfx("win");
    g.fireConfetti();
    g.go("map");
  };
  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4">
      <div className="anim-pop panel relative w-full max-w-xl overflow-hidden p-5 text-center sm:p-8">
        <button
          onClick={() => g.go("splash")}
          className="btn3d absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-emerald-400 text-xl font-black text-white shadow-lg"
          aria-label="Kembali"
        >
          ←
        </button>
        <div className="absolute right-2 top-2 anim-bob">
          <Oxi size={88} />
        </div>
        <h2 className="mx-auto mt-6 max-w-sm font-display text-2xl font-extrabold text-sky-700 sm:text-4xl">
          Siapa nama
          <br />
          Penjelajah O₂
          <br />
          hari ini?
        </h2>
        <input
          value={val}
          autoFocus
          maxLength={18}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Contoh: Budi"
          className="mt-6 w-full rounded-full border-4 border-sky-100 bg-sky-50 px-5 py-4 text-center font-display text-xl font-bold text-sky-900 outline-none transition placeholder:text-sky-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
        />
        <div className="mt-5">
          <Btn variant="success" size="xl" className="w-full max-w-xs" disabled={!val.trim()} onClick={submit}>
            🚀 MULAI
          </Btn>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <CharBoy size={120} />
          <CharGirl size={120} />
        </div>
      </div>
    </div>
  );
}
