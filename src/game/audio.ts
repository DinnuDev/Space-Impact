/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private sfxVol: number = 0.6;
  private musicVol: number = 0.35;
  
  // Music sequencer state
  private musicIntervalId: number | null = null;
  private currentStep: number = 0;
  private isMusicPlaying: boolean = false;
  private tempoBpm: number = 136;
  private isBossTheme: boolean = false;

  constructor() {
    // Initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVol, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVol = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx && !this.isMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVol = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx && !this.isMusicMuted) {
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVol, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVol, this.ctx.currentTime);
    }
    return this.isMusicMuted;
  }

  public getSettings() {
    return {
      muted: this.isMuted,
      musicMuted: this.isMusicMuted,
      sfxVol: this.sfxVol,
      musicVol: this.musicVol,
    };
  }

  // --- Retro Chiptune Sound Effects ---

  public playLaser(level: number = 1) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = level > 2 ? 'sawtooth' : 'square';
    const startFreq = 850 + level * 100;
    const endFreq = 160;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.1);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  public playMissileLaunch() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(750, t + 0.18);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.21);
  }

  public playLaserBeam() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, t);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(35, t);
    lfoGain.gain.setValueAtTime(120, t);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 0.36);
    osc.stop(t + 0.36);
  }

  public playBombExplosion() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Low sub rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, t);
    subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.8);
    subGain.gain.setValueAtTime(0.5, t);
    subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(t);
    subOsc.stop(t + 0.81);

    // Noise blast
    this.playNoiseExplosion(0.8, 180, 0.4);
  }

  public playEnemyExplosion(isLarge: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const duration = isLarge ? 0.45 : 0.22;
    const freqCutoff = isLarge ? 400 : 850;
    this.playNoiseExplosion(duration, freqCutoff, isLarge ? 0.4 : 0.25);
  }

  private playNoiseExplosion(duration: number, cutoff: number, volume: number) {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff * 2, t);
    filter.frequency.exponentialRampToValueAtTime(cutoff * 0.3, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  public playHit() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(80, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playPowerUp() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.09);
    });
  }

  public playBossWarning() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const alarmTime = t + i * 0.28;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, alarmTime);
      osc.frequency.setValueAtTime(440, alarmTime + 0.12);

      gain.gain.setValueAtTime(0.35, alarmTime);
      gain.gain.linearRampToValueAtTime(0.01, alarmTime + 0.24);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(alarmTime);
      osc.stop(alarmTime + 0.25);
    }
  }

  public playVictoryFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + (idx === 3 ? 0.45 : 0.18));

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + (idx === 3 ? 0.46 : 0.19));
    });
  }

  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [330, 311, 293, 277, 246]; // Sad descending minor scale
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.15;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  // --- Dynamic Procedural Chiptune Music Generator ---
  // Plays an authentic classic Nokia-style driving chiptune melody & bassline

  public startMusic(isBoss: boolean = false) {
    this.isBossTheme = isBoss;
    if (this.isMusicPlaying) return;

    this.initContext();
    this.isMusicPlaying = true;
    this.currentStep = 0;

    const stepIntervalMs = (60 / this.tempoBpm / 4) * 1000;
    this.musicIntervalId = window.setInterval(() => {
      this.tickMusicStep();
    }, stepIntervalMs);
  }

  public setBossMusic(isBoss: boolean) {
    this.isBossTheme = isBoss;
    this.tempoBpm = isBoss ? 152 : 136;
  }

  public stopMusic() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.isMusicPlaying = false;
  }

  private tickMusicStep() {
    if (!this.ctx || !this.musicGain || this.isMusicMuted || this.ctx.state !== 'running') {
      this.currentStep = (this.currentStep + 1) % 32;
      return;
    }

    const t = this.ctx.currentTime;
    const step = this.currentStep;

    // Bassline (Driving 8th notes)
    if (step % 2 === 0) {
      const bassNotesNormal = [110, 110, 130.81, 110, 98, 110, 146.83, 130.81]; // A, A, C, A, G, A, D, C
      const bassNotesBoss = [73.42, 73.42, 87.31, 73.42, 65.41, 73.42, 98.0, 87.31]; // Lower D minor aggressive
      const notes = this.isBossTheme ? bassNotesBoss : bassNotesNormal;
      const noteIdx = Math.floor(step / 4) % notes.length;
      const freq = notes[noteIdx];

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(freq, t);

      bassGain.gain.setValueAtTime(0.24, t);
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.start(t);
      bassOsc.stop(t + 0.13);
    }

    // Lead Arpeggio
    if (step % 4 === 0 || (this.isBossTheme && step % 2 === 0)) {
      const leadMelody = [
        440, 523.25, 659.25, 523.25, 440, 587.33, 659.25, 783.99,
        659.25, 523.25, 440, 392, 440, 523.25, 659.25, 880,
      ];
      const bossMelody = [
        293.66, 349.23, 440, 349.23, 293.66, 440, 587.33, 523.25,
        440, 349.23, 392, 440, 293.66, 349.23, 440, 587.33,
      ];
      const melody = this.isBossTheme ? bossMelody : leadMelody;
      const noteIdx = Math.floor(step / 2) % melody.length;
      const leadFreq = melody[noteIdx];

      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(leadFreq, t);

      leadGain.gain.setValueAtTime(0.12, t);
      leadGain.gain.exponentialRampToValueAtTime(0.01, t + 0.11);

      leadOsc.connect(leadGain);
      leadGain.connect(this.musicGain);

      leadOsc.start(t);
      leadOsc.stop(t + 0.12);
    }

    // Hi-hat / chiptune click
    if (step % 2 === 1) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      hatOsc.type = 'sawtooth';
      hatOsc.frequency.setValueAtTime(1400, t);

      hatGain.gain.setValueAtTime(0.04, t);
      hatGain.gain.linearRampToValueAtTime(0.001, t + 0.03);

      hatOsc.connect(hatGain);
      hatGain.connect(this.musicGain);

      hatOsc.start(t);
      hatOsc.stop(t + 0.035);
    }

    this.currentStep = (this.currentStep + 1) % 32;
  }
}

export const soundEngine = new SoundEngine();
