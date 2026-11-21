// audio.js — all sound effects are synthesized with WebAudio, so the
// game ships no audio files and plays fully offline.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  tone(freq, dur, type = 'sine', vol = 0.16, when = 0, slideTo = null) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // Two-note chime when a difference is found.
  find() {
    this.tone(659, 0.14, 'sine', 0.18);
    this.tone(880, 0.22, 'sine', 0.18, 0.09);
  }

  // Low buzz for a wrong click.
  miss() {
    this.tone(140, 0.22, 'square', 0.1, 0, 90);
  }

  // Soft pluck when a hint is used.
  hint() {
    this.tone(520, 0.12, 'triangle', 0.14);
    this.tone(780, 0.16, 'triangle', 0.12, 0.07);
  }

  // Rising arpeggio when a level is cleared.
  win() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'sine', 0.16, i * 0.1));
  }

  // Short tick in the last ten seconds.
  tick() {
    this.tone(980, 0.05, 'square', 0.06);
  }

  // UI button blip.
  click() {
    this.tone(440, 0.07, 'triangle', 0.1);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}
