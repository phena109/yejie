const MUTE_KEY = "yejie-mute";

export type SfxId =
  | "ui"
  | "move"
  | "attack"
  | "hit"
  | "miss"
  | "skill"
  | "heal"
  | "victory"
  | "defeat"
  | "pause";

export type BgmId = "title" | "battle";

function loadMute(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

class GameAudio {
  muted = loadMute();
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private unlocked = false;
  private wanted: BgmId | null = null;
  private playing: BgmId | null = null;
  private timer = 0;
  private beat = 0;

  unlock(): void {
    if (this.unlocked && this.ctx && this.ctx.state === "running") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.master);
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.muted ? 0 : 0.22;
      this.bgmGain.connect(this.master);
    }
    void this.ctx.resume();
    this.unlocked = true;
    this.applyMute();
    if (this.wanted) this.setBgm(this.wanted);
  }

  setMuted(on: boolean): void {
    this.muted = on;
    try {
      localStorage.setItem(MUTE_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
    this.applyMute();
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private applyMute(): void {
    if (this.sfxGain) this.sfxGain.gain.value = this.muted ? 0 : 0.7;
    if (this.bgmGain) this.bgmGain.gain.value = this.muted ? 0 : 0.22;
  }

  play(id: SfxId): void {
    this.unlock();
    if (!this.ctx || !this.sfxGain || this.muted) return;
    const t = this.ctx.currentTime;
    switch (id) {
      case "ui":
        this.blip(880, 0.045, 0.11, "sine", t);
        break;
      case "move":
        this.noise(0.05, 0.06, t, 900);
        this.blip(180, 0.06, 0.08, "triangle", t);
        break;
      case "attack":
        this.noise(0.1, 0.1, t, 700);
        this.sweep(420, 160, 0.12, 0.12, t);
        break;
      case "hit":
        this.blip(140, 0.09, 0.16, "square", t);
        this.noise(0.08, 0.12, t, 400);
        break;
      case "miss":
        this.sweep(480, 220, 0.14, 0.07, t);
        this.blip(210, 0.1, 0.05, "sine", t + 0.04);
        break;
      case "skill":
        this.blip(520, 0.08, 0.1, "square", t);
        this.blip(780, 0.1, 0.1, "sine", t + 0.06);
        this.blip(1040, 0.12, 0.08, "sine", t + 0.12);
        break;
      case "heal":
        this.blip(392, 0.1, 0.09, "sine", t);
        this.blip(494, 0.12, 0.1, "sine", t + 0.08);
        this.blip(587, 0.16, 0.1, "sine", t + 0.16);
        break;
      case "victory":
        this.blip(523, 0.14, 0.12, "square", t);
        this.blip(659, 0.16, 0.12, "square", t + 0.12);
        this.blip(784, 0.28, 0.14, "square", t + 0.24);
        break;
      case "defeat":
        this.blip(330, 0.18, 0.12, "sawtooth", t);
        this.blip(247, 0.22, 0.12, "sawtooth", t + 0.16);
        this.blip(165, 0.4, 0.14, "sine", t + 0.32);
        break;
      case "pause":
        this.blip(220, 0.1, 0.08, "triangle", t);
        this.blip(165, 0.16, 0.08, "triangle", t + 0.1);
        break;
    }
  }

  setBgm(id: BgmId | null): void {
    this.wanted = id;
    if (id === this.playing) return;
    this.stopBgm();
    this.playing = id;
    if (!id || !this.unlocked || !this.ctx) return;
    this.beat = 0;
    const step = id === "battle" ? 280 : 520;
    const tick = () => {
      if (this.playing !== id || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      if (id === "title") this.titleBeat(t);
      else this.battleBeat(t);
      this.beat += 1;
      this.timer = window.setTimeout(tick, step);
    };
    tick();
  }

  private stopBgm(): void {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = 0;
    }
    this.playing = null;
  }

  private titleBeat(t: number): void {
    const n = this.beat % 8;
    const bass = [110, 0, 82, 0, 110, 0, 98, 0][n];
    if (bass) this.tone(this.bgmGain!, bass, 0.46, 0.045, "sine", t);
    if (n === 0 || n === 4) this.tone(this.bgmGain!, 220, 0.4, 0.02, "triangle", t);
    if (n === 6) this.tone(this.bgmGain!, 329, 0.28, 0.018, "sine", t);
  }

  private battleBeat(t: number): void {
    const n = this.beat % 8;
    const kick = n % 2 === 0;
    if (kick) {
      this.sweepTo(this.bgmGain!, 90, 42, 0.12, 0.1, t);
    } else {
      this.noiseTo(this.bgmGain!, 0.04, 0.025, t, 1800);
    }
    const riff = [0, 196, 0, 233, 0, 196, 175, 0][n];
    if (riff) this.tone(this.bgmGain!, riff, 0.18, 0.035, "square", t);
  }

  private blip(freq: number, dur: number, vol: number, type: OscillatorType, t: number): void {
    if (!this.sfxGain) return;
    this.tone(this.sfxGain, freq, dur, vol, type, t);
  }

  private sweep(from: number, to: number, dur: number, vol: number, t: number): void {
    if (!this.sfxGain) return;
    this.sweepTo(this.sfxGain, from, to, dur, vol, t);
  }

  private noise(dur: number, vol: number, t: number, cutoff: number): void {
    if (!this.sfxGain) return;
    this.noiseTo(this.sfxGain, dur, vol, t, cutoff);
  }

  private tone(out: GainNode, freq: number, dur: number, vol: number, type: OscillatorType, t: number): void {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private sweepTo(out: GainNode, from: number, to: number, dur: number, vol: number, t: number): void {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noiseTo(out: GainNode, dur: number, vol: number, t: number, cutoff: number): void {
    if (!this.ctx) return;
    const n = 2048;
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = cutoff;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(out);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}

export const audio = new GameAudio();
