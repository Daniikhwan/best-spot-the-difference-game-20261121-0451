// art.js — small shared drawing primitives used by every scene.
// Scenes stay readable because they compose these instead of raw paths.
export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rr(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star(ctx, cx, cy, spikes, outer, inner, fill) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// Vertical sky gradient for a scene.
export function sky(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// A puffy cloud made of three circles.
export function cloud(ctx, x, y, s, fill = 'rgba(255,255,255,0.92)') {
  circle(ctx, x, y, 16 * s, fill);
  circle(ctx, x + 16 * s, y - 6 * s, 20 * s, fill);
  circle(ctx, x + 34 * s, y, 15 * s, fill);
  circle(ctx, x + 17 * s, y + 6 * s, 18 * s, fill);
}

// A simple bird: two arcs like a distant "v" with a tiny body.
export function bird(ctx, x, y, s, color = '#37474f') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 10 * s, y);
  ctx.stroke();
}

// A five-petal flower on a stem.
export function flower(ctx, x, y, s, petal, center = '#ffca28') {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 16 * s);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 6 * s, y + Math.sin(a) * 6 * s, 5.5 * s, petal);
  }
  circle(ctx, x, y, 4.5 * s, center);
}

// Text with a soft outline so it stays readable over art.
export function label(ctx, text, x, y, size, fill = '#ffffff', align = 'center') {
  ctx.font = `bold ${size}px Trebuchet MS, Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}
