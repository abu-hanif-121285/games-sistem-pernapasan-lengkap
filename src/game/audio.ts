/**
 * Mesin audio sederhana berbasis Web Audio API.
 * Semua suara dibangkitkan secara sintetis -> tidak butuh file eksternal / internet.
 */

export type SoundName =
  | "click"
  | "hover"
  | "correct"
  | "wrong"
  | "win"
  | "levelup"
  | "coin"
  | "pop"
  | "hurt"
  | "whoosh"
  | "breatheIn"
  | "breatheOut"
  | "badge"
  | "boss";

type Note = { f: number; t: number; d: number; type?: OscillatorType; v?: number };

const MELODY: Record<SoundName, Note[]> = {
  click: [{ f: 620, t: 0, d: 0.07, type: "triangle", v: 0.25 }],
  hover: [{ f: 880, t: 0, d: 0.04, type: "sine", v: 0.09 }],
  correct: [
    { f: 659, t: 0, d: 0.11, type: "triangle", v: 0.28 },
    { f: 880, t: 0.09, d: 0.12, type: "triangle", v: 0.28 },
    { f: 1174, t: 0.18, d: 0.18, type: "triangle", v: 0.24 },
  ],
  wrong: [
    { f: 300, t: 0, d: 0.13, type: "sawtooth", v: 0.17 },
    { f: 220, t: 0.11, d: 0.2, type: "sawtooth", v: 0.15 },
  ],
  win: [
    { f: 523, t: 0, d: 0.12, type: "triangle", v: 0.26 },
    { f: 659, t: 0.11, d: 0.12, type: "triangle", v: 0.26 },
    { f: 784, t: 0.22, d: 0.12, type: "triangle", v: 0.26 },
    { f: 1046, t: 0.33, d: 0.3, type: "triangle", v: 0.3 },
    { f: 1318, t: 0.45, d: 0.35, type: "sine", v: 0.22 },
  ],
  levelup: [
    { f: 440, t: 0, d: 0.1, type: "square", v: 0.14 },
    { f: 587, t: 0.09, d: 0.1, type: "square", v: 0.14 },
    { f: 880, t: 0.18, d: 0.24, type: "square", v: 0.16 },
  ],
  coin: [
    { f: 1046, t: 0, d: 0.06, type: "square", v: 0.14 },
    { f: 1568, t: 0.05, d: 0.12, type: "square", v: 0.12 },
  ],
  pop: [{ f: 480, t: 0, d: 0.09, type: "sine", v: 0.3 }],
  hurt: [
    { f: 200, t: 0, d: 0.16, type: "sawtooth", v: 0.2 },
    { f: 120, t: 0.12, d: 0.24, type: "sawtooth", v: 0.18 },
  ],
  whoosh: [{ f: 260, t: 0, d: 0.28, type: "sine", v: 0.14 }],
  breatheIn: [{ f: 180, t: 0, d: 0.7, type: "sine", v: 0.12 }],
  breatheOut: [{ f: 150, t: 0, d: 0.7, type: "sine", v: 0.1 }],
  badge: [
    { f: 784, t: 0, d: 0.1, type: "triangle", v: 0.24 },
    { f: 1046, t: 0.1, d: 0.1, type: "triangle", v: 0.24 },
    { f: 1318, t: 0.2, d: 0.28, type: "triangle", v: 0.26 },
  ],
  boss: [
    { f: 110, t: 0, d: 0.3, type: "sawtooth", v: 0.2 },
    { f: 82, t: 0.22, d: 0.4, type: "sawtooth", v: 0.18 },
  ],
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private musicTimer: number | null = null;
  private step = 0;
  sfxOn = true;
  musicOn = true;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.85;
      this.master.connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.9;
      this.sfxBus.connect(this.master);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.0;
      this.musicBus.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  unlock() {
    this.ensure();
  }

  play(name: SoundName) {
    if (!this.sfxOn) return;
    const ctx = this.ensure();
    if (!ctx || !this.sfxBus) return;
    const now = ctx.currentTime;
    for (const n of MELODY[name]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = n.type ?? "sine";
      osc.frequency.setValueAtTime(n.f, now + n.t);
      if (name === "whoosh") osc.frequency.exponentialRampToValueAtTime(n.f * 3, now + n.t + n.d);
      if (name === "breatheIn") osc.frequency.exponentialRampToValueAtTime(n.f * 2.1, now + n.t + n.d);
      if (name === "breatheOut") osc.frequency.exponentialRampToValueAtTime(n.f * 0.55, now + n.t + n.d);
      const vol = n.v ?? 0.2;
      g.gain.setValueAtTime(0.0001, now + n.t);
      g.gain.exponentialRampToValueAtTime(vol, now + n.t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    }
  }

  /** Musik latar: arpeggio lembut, volume rendah supaya tidak mengganggu belajar. */
  startMusic() {
    const ctx = this.ensure();
    if (!ctx || !this.musicBus) return;
    if (this.musicTimer !== null) return;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(this.musicOn ? 0.16 : 0, ctx.currentTime + 1.2);
    const chords = [
      [261.6, 329.6, 392.0, 523.3],
      [220.0, 329.6, 440.0, 523.3],
      [174.6, 261.6, 349.2, 440.0],
      [196.0, 293.7, 392.0, 493.9],
    ];
    const tick = () => {
      if (!this.ctx || !this.musicBus || !this.musicOn) {
        this.step++;
        return;
      }
      const c = chords[Math.floor(this.step / 8) % chords.length];
      const f = c[this.step % 4] * (this.step % 8 >= 4 ? 2 : 1);
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc.connect(g);
      g.connect(this.musicBus);
      osc.start(now);
      osc.stop(now + 0.9);
      if (this.step % 8 === 0) {
        const bass = this.ctx.createOscillator();
        const bg = this.ctx.createGain();
        bass.type = "sine";
        bass.frequency.value = c[0] / 2;
        bg.gain.setValueAtTime(0.0001, now);
        bg.gain.exponentialRampToValueAtTime(0.22, now + 0.08);
        bg.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);
        bass.connect(bg);
        bg.connect(this.musicBus);
        bass.start(now);
        bass.stop(now + 1.8);
      }
      this.step++;
    };
    tick();
    this.musicTimer = window.setInterval(tick, 460);
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.ctx && this.musicBus) {
      this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicBus.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    }
  }

  setSfx(on: boolean) {
    this.sfxOn = on;
  }

  setMusic(on: boolean) {
    this.musicOn = on;
    if (on) this.startMusic();
    else this.stopMusic();
  }
}

export const audio = new AudioEngine();
