// render.js — draws both panels each frame: the scene itself, the
// markers on found differences, hint pulses, miss flashes and the
// little particle burst that makes a find feel good.
// Canvases use a 2x backing store for crisp screenshots; all drawing
// happens in the 600 x 440 logical space.
import { PANEL_W, PANEL_H } from './config.js';

export class Renderer {
  constructor(canvasL, canvasR) {
    this.cl = canvasL;
    this.cr = canvasR;
    this.ctxL = canvasL.getContext('2d');
    this.ctxR = canvasR.getContext('2d');
    this.particles = [];
    this.misses = [];
    this.hintTarget = null;
    this.hintUntil = 0;
    this.shakeUntil = 0;
    this.shakeMag = 0;
  }

  burst(x, y) {
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 30,
        life: 0.7,
        max: 0.7,
        color: ['#ffd54f', '#69f0ae', '#40c4ff', '#ff80ab'][i % 4],
      });
    }
  }

  miss(x, y) {
    this.misses.push({ x, y, life: 0.8, max: 0.8 });
    this.shakeUntil = performance.now() + 180;
    this.shakeMag = 5;
  }

  hint(diff) {
    this.hintTarget = diff;
    this.hintUntil = performance.now() + 2600;
  }

  // Draw one panel: scene, then markers, then effects.
  drawPanel(ctx, sceneFn, applied, found, diffs, now, dt) {
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    if (now < this.shakeUntil) {
      const m = this.shakeMag * (1 - (this.shakeUntil - now) / 180);
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }
    sceneFn(ctx, PANEL_W, PANEL_H, applied);

    // Found markers: a green ring with the find number, on both panels.
    let n = 0;
    for (const d of diffs) {
      if (!found.has(d.id)) continue;
      n++;
      const pulse = 1 + 0.06 * Math.sin(now / 160);
      ctx.strokeStyle = '#00c853';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,200,83,0.16)';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00c853';
      ctx.beginPath();
      ctx.arc(d.x + d.r * 0.62, d.y - d.r * 0.62, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Trebuchet MS, Verdana, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(n), d.x + d.r * 0.62, d.y - d.r * 0.62 + 0.5);
    }

    // Hint pulse: a gold ring that breathes around the hinted difference.
    if (this.hintTarget && now < this.hintUntil) {
      const d = this.hintTarget;
      const p = 0.5 + 0.5 * Math.sin(now / 110);
      ctx.strokeStyle = `rgba(255,193,7,${0.55 + 0.45 * p})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 6 + 5 * p, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Miss flashes: a fading red X where the player clicked wrong.
    for (const m of this.misses) {
      const a = Math.max(0, m.life / m.max);
      ctx.strokeStyle = `rgba(229,57,53,${a})`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x - 10, m.y - 10);
      ctx.lineTo(m.x + 10, m.y + 10);
      ctx.moveTo(m.x + 10, m.y - 10);
      ctx.lineTo(m.x - 10, m.y + 10);
      ctx.stroke();
    }

    // Particles.
    for (const p of this.particles) {
      const a = Math.max(0, p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  draw(state, dt) {
    const now = performance.now();
    this.particles = this.particles.filter((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 160 * dt;
      return p.life > 0;
    });
    this.misses = this.misses.filter((m) => {
      m.life -= dt;
      return m.life > 0;
    });
    this.drawPanel(this.ctxL, state.sceneFn, state.appliedLeft, state.found, state.diffs, now, dt);
    this.drawPanel(this.ctxR, state.sceneFn, state.appliedRight, state.found, state.diffs, now, dt);
  }
}
