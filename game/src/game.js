// game.js — the state machine: menu, playing, level done, time up,
// all done. It owns score, combo, hints, the timer and the HUD,
// and asks render.js to draw the panels every frame.
import {
  LEVELS, HINTS_PER_LEVEL, MISS_TIME_PENALTY,
  POINTS_PER_FIND, COMBO_BONUS, TIME_BONUS_PER_SECOND,
} from './config.js';
import {
  drawGarden, GARDEN_DIFFS, drawMarket, MARKET_DIFFS,
} from './scenes-garden-market.js';
import {
  drawHarbor, HARBOR_DIFFS, drawBamboo, BAMBOO_DIFFS,
  drawNeonCity, NEON_DIFFS,
} from './scenes-harbor-forest-city.js';
import { Renderer } from './render.js';
import { SoundBank } from './audio.js';
import { bindPanels, bindKeys } from './input.js';

const SCENES = {
  drawGarden: { fn: drawGarden, diffs: GARDEN_DIFFS },
  drawMarket: { fn: drawMarket, diffs: MARKET_DIFFS },
  drawHarbor: { fn: drawHarbor, diffs: HARBOR_DIFFS },
  drawBamboo: { fn: drawBamboo, diffs: BAMBOO_DIFFS },
  drawNeonCity: { fn: drawNeonCity, diffs: NEON_DIFFS },
};

export class Game {
  constructor(doc) {
    this.doc = doc;
    this.sounds = new SoundBank();
    this.renderer = new Renderer(
      doc.getElementById('panel-left'),
      doc.getElementById('panel-right'),
    );
    this.state = 'menu';
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = 0;
    this.paused = false;
    this.lastTickSecond = -1;
    this.levelStars = {};
    this.toastTimer = 0;

    // HUD elements.
    this.el = {
      level: doc.getElementById('hud-level'),
      timerText: doc.getElementById('timer-text'),
      timerFill: doc.getElementById('timer-fill'),
      counter: doc.getElementById('hud-counter'),
      score: doc.getElementById('hud-score'),
      hints: doc.getElementById('hud-hints'),
      toast: doc.getElementById('toast'),
      overlays: {
        menu: doc.getElementById('overlay-menu'),
        done: doc.getElementById('overlay-done'),
        over: doc.getElementById('overlay-over'),
        final: doc.getElementById('overlay-final'),
      },
      doneTitle: doc.getElementById('done-title'),
      doneStars: doc.getElementById('done-stars'),
      doneDetail: doc.getElementById('done-detail'),
      finalScore: doc.getElementById('final-score'),
      finalStars: doc.getElementById('final-stars'),
      overDetail: doc.getElementById('over-detail'),
    };

    bindPanels(
      doc.getElementById('panel-left'),
      doc.getElementById('panel-right'),
      (x, y) => this.onSceneClick(x, y),
    );
    bindKeys({
      hint: () => this.useHint(),
      mute: () => this.toggleMute(),
      menu: () => this.showMenu(),
      confirm: () => this.confirm(),
      pickLevel: (n) => this.pickLevel(n),
    });

    doc.getElementById('btn-hint').addEventListener('click', () => this.useHint());
    doc.getElementById('btn-mute').addEventListener('click', () => this.toggleMute());
    doc.getElementById('btn-menu').addEventListener('click', () => this.showMenu());
    doc.getElementById('btn-next').addEventListener('click', () => this.nextLevel());
    doc.getElementById('btn-retry').addEventListener('click', () => this.startLevel(this.levelIndex));
    doc.getElementById('btn-over-menu').addEventListener('click', () => this.showMenu());
    doc.getElementById('btn-again').addEventListener('click', () => this.restartAll());
    doc.getElementById('btn-final-menu').addEventListener('click', () => this.showMenu());
    doc.getElementById('btn-start').addEventListener('click', () => this.startLevel(0));
    this.buildLevelButtons();

    this.showMenu();
    this._last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - this._last) / 1000);
      this._last = now;
      this.tick(dt);
      this.render(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get scene() {
    return SCENES[this.level.sceneFn];
  }

  get diffs() {
    return this.scene.diffs;
  }

  // Differences of any level, without changing the current game state
  // (used by the screenshot modes in main.js).
  diffsForLevel(i) {
    return SCENES[LEVELS[i].sceneFn].diffs;
  }

  appliedSet() {
    return new Set(this.diffs.map((d) => d.id));
  }

  buildLevelButtons() {
    const box = this.doc.getElementById('level-buttons');
    LEVELS.forEach((lv, i) => {
      const b = this.doc.createElement('button');
      b.className = 'level-btn';
      const stars = this.levelStars[lv.id] || 0;
      b.innerHTML = `<b>${lv.id}. ${lv.name}</b><span>${this.sceneDiffCount(i)} perbedaan · ${lv.timeLimit} detik${stars ? ' · ' + '★'.repeat(stars) : ''}</span>`;
      b.addEventListener('click', () => {
        this.sounds.ensure();
        this.sounds.click();
        this.startLevel(i);
      });
      box.appendChild(b);
    });
  }

  sceneDiffCount(i) {
    return SCENES[LEVELS[i].sceneFn].diffs.length;
  }

  showOverlay(name) {
    for (const [key, el] of Object.entries(this.el.overlays)) {
      el.classList.toggle('hidden', key !== name);
    }
  }

  hideOverlays() {
    for (const el of Object.values(this.el.overlays)) el.classList.add('hidden');
  }

  showMenu() {
    this.state = 'menu';
    this.paused = false;
    this.found = new Set();
    this.timeLeft = this.level.timeLimit;
    this.showOverlay('menu');
    this.updateHud();
  }

  startLevel(i, opts = {}) {
    this.levelIndex = i;
    const lv = this.level;
    this.found = new Set();
    if (opts.preFound === 'all') {
      this.found = new Set(this.diffs.map((d) => d.id));
    } else if (Array.isArray(opts.preFound)) {
      this.found = new Set(opts.preFound);
    }
    this.timeLeft = opts.timeLeft ?? lv.timeLimit;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.combo = 0;
    this.paused = !!opts.paused;
    this.lastTickSecond = -1;
    this.state = 'playing';
    this.hideOverlays();
    this.updateHud();
  }

  restartAll() {
    this.score = 0;
    this.levelStars = {};
    this.startLevel(0);
  }

  pickLevel(n) {
    if (this.state === 'menu' && n >= 1 && n <= LEVELS.length) this.startLevel(n - 1);
  }

  confirm() {
    if (this.state === 'menu') this.startLevel(0);
    else if (this.state === 'levelDone') this.nextLevel();
    else if (this.state === 'gameOver') this.startLevel(this.levelIndex);
    else if (this.state === 'allDone') this.showMenu();
  }

  onSceneClick(x, y) {
    if (this.state !== 'playing' || this.paused) return;
    this.sounds.ensure();
    let best = null;
    let bestDist = Infinity;
    for (const d of this.diffs) {
      if (this.found.has(d.id)) continue;
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist < d.r + 14 && dist < bestDist) {
        best = d;
        bestDist = dist;
      }
    }
    if (best) {
      this.found.add(best.id);
      const pts = POINTS_PER_FIND + this.combo * COMBO_BONUS;
      this.score += pts;
      this.combo += 1;
      this.sounds.find();
      this.renderer.burst(best.x, best.y);
      this.toast(`Ketemu! ${best.name}  +${pts}`);
      if (this.found.size === this.diffs.length) this.levelComplete();
    } else {
      this.combo = 0;
      this.timeLeft = Math.max(0, this.timeLeft - MISS_TIME_PENALTY);
      this.sounds.miss();
      this.renderer.miss(x, y);
      this.toast(`Bukan di situ!  −${MISS_TIME_PENALTY} detik`);
    }
    this.updateHud();
  }

  useHint() {
    if (this.state !== 'playing' || this.paused) return;
    this.sounds.ensure();
    if (this.hintsLeft <= 0) {
      this.toast('Petunjuk habis!');
      return;
    }
    const remaining = this.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const d = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.sounds.hint();
    this.renderer.hint(d);
    this.toast('Petunjuk: cari di lingkaran emas!');
    this.updateHud();
  }

  toggleMute() {
    this.sounds.ensure();
    const muted = this.sounds.toggleMute();
    this.doc.getElementById('btn-mute').textContent = muted ? 'Suara: Mati' : 'Suara: Hidup';
    this.toast(muted ? 'Suara dimatikan' : 'Suara dihidupkan');
  }

  levelComplete() {
    const lv = this.level;
    const bonus = Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.score += bonus;
    const frac = this.timeLeft / lv.timeLimit;
    const stars = frac >= 0.4 ? 3 : frac >= 0.15 ? 2 : 1;
    this.levelStars[lv.id] = Math.max(this.levelStars[lv.id] || 0, stars);
    this.state = 'levelDone';
    this.sounds.win();
    this.el.doneTitle.textContent = `Level ${lv.id} Selesai!`;
    this.el.doneStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    this.el.doneDetail.textContent =
      `${this.diffs.length}/${this.diffs.length} perbedaan ditemukan · ` +
      `Bonus waktu +${bonus} · Skor ${this.score}`;
    this.doc.getElementById('btn-next').textContent =
      this.levelIndex < LEVELS.length - 1 ? 'Level Berikutnya →' : 'Lihat Hasil Akhir →';
    this.showOverlay('done');
    this.updateHud();
  }

  nextLevel() {
    if (this.levelIndex < LEVELS.length - 1) this.startLevel(this.levelIndex + 1);
    else this.showFinal();
  }

  showFinal() {
    this.state = 'allDone';
    const total = Object.values(this.levelStars).reduce((a, b) => a + b, 0);
    this.el.finalScore.textContent = `Skor akhir: ${this.score}`;
    this.el.finalStars.textContent = `Bintang: ${'★'.repeat(total)}${'☆'.repeat(15 - total)} (${total}/15)`;
    this.showOverlay('final');
  }

  gameOver() {
    this.state = 'gameOver';
    this.sounds.miss();
    this.el.overDetail.textContent =
      `Waktu habis di level ${this.level.id} ${this.level.name} — ` +
      `kamu menemukan ${this.found.size}/${this.diffs.length} perbedaan. Skor ${this.score}.`;
    this.showOverlay('over');
  }

  tick(dt) {
    if (this.state !== 'playing' || this.paused) return;
    this.timeLeft -= dt;
    const sec = Math.ceil(this.timeLeft);
    if (this.timeLeft <= 10 && this.timeLeft > 0 && sec !== this.lastTickSecond) {
      this.lastTickSecond = sec;
      this.sounds.tick();
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.updateHud();
      this.gameOver();
      return;
    }
    this.updateHud();
  }

  render(dt) {
    const state = {
      sceneFn: this.scene.fn,
      appliedLeft: new Set(),
      appliedRight: this.appliedSet(),
      found: this.found,
      diffs: this.diffs,
    };
    this.renderer.draw(state, dt);
  }

  updateHud() {
    const lv = this.level;
    this.el.level.textContent = `Level ${lv.id} · ${lv.name}`;
    const sec = Math.max(0, Math.ceil(this.timeLeft));
    this.el.timerText.textContent = `${sec} dtk`;
    const frac = Math.max(0, this.timeLeft / lv.timeLimit);
    this.el.timerFill.style.width = `${frac * 100}%`;
    this.el.timerFill.classList.toggle('danger', this.timeLeft <= 10 && this.state === 'playing');
    this.el.counter.textContent = `Ditemukan ${this.found.size}/${this.diffs.length}`;
    this.el.score.textContent = `Skor ${this.score}`;
    this.el.hints.textContent = `Petunjuk ${this.hintsLeft}/${HINTS_PER_LEVEL}`;
  }

  toast(msg) {
    this.el.toast.textContent = msg;
    this.el.toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.el.toast.classList.remove('show'), 1800);
  }
}
