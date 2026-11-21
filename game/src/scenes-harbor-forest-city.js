// scenes-harbor-forest-city.js — levels 3, 4 and 5: Pelabuhan Tua,
// Hutan Bambu and Kota Neon. Same contract as scenes-garden-market.js:
// draw(ctx, W, H, applied) — the right panel applies the listed diffs.

import { circle, rr, poly, star, sky, cloud, bird, label } from './art.js';
import { mulberry32 } from './random.js';

// ---------------------------------------------------------------------------
// Level 3 — Pelabuhan Tua (Old Harbor): 7 differences, 110 seconds
// ---------------------------------------------------------------------------
export const HARBOR_DIFFS = [
  { id: 'gull', x: 180, y: 80, r: 24, name: 'Burung camar' },
  { id: 'lamp', x: 80, y: 92, r: 22, name: 'Lampu mercusuar' },
  { id: 'flag', x: 80, y: 42, r: 20, name: 'Bendera mercusuar' },
  { id: 'sail', x: 380, y: 220, r: 32, name: 'Warna layar' },
  { id: 'fish', x: 480, y: 330, r: 24, name: 'Ikan melompat' },
  { id: 'crate', x: 500, y: 352, r: 24, name: 'Peti tambahan' },
  { id: 'anchor', x: 560, y: 388, r: 22, name: 'Jangkar' },
];

export function drawHarbor(ctx, W, H, applied) {
  sky(ctx, W, H, '#a8d8f0', '#fdf6d8');
  circle(ctx, 520, 70, 30, '#ffd54f');
  cloud(ctx, 250, 55, 1);
  cloud(ctx, 430, 90, 0.7);

  // Seagull — the difference.
  if (!applied.has('gull')) bird(ctx, 180, 80, 1.1);
  bird(ctx, 260, 110, 0.8);

  // Lighthouse on a rocky base, left side.
  ctx.fillStyle = '#78909c';
  poly(ctx, [[40, 320], [80, 288], [120, 320]], '#78909c');
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(64, 130, 32, 168);
  ctx.fillStyle = '#d32f2f';
  ctx.fillRect(64, 160, 32, 24);
  ctx.fillRect(64, 214, 32, 24);
  ctx.fillRect(64, 268, 32, 24);
  // Lamp room — its light colour is the difference.
  ctx.fillStyle = '#37474f';
  ctx.fillRect(58, 104, 44, 26);
  const lampColor = applied.has('lamp') ? '#69f0ae' : '#ff5252';
  circle(ctx, 80, 117, 10, lampColor);
  ctx.fillStyle = lampColor;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(80, 117, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  // Flag on the pole — the difference.
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 104); ctx.lineTo(80, 34);
  ctx.stroke();
  if (!applied.has('flag')) {
    poly(ctx, [[80, 34], [108, 42], [80, 52]], '#ff7043');
  }

  // Sea.
  ctx.fillStyle = '#4db6e8';
  ctx.fillRect(0, 300, W, 140);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(120 + i * 110, 322, 14, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(180 + i * 120, 352, 12, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Rowboat, constant.
  ctx.fillStyle = '#8d6e63';
  poly(ctx, [[196, 336], [244, 336], [232, 352], [208, 352]], '#8d6e63');
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(220, 336); ctx.lineTo(220, 312);
  ctx.stroke();

  // Sailboat — its sail colour is the difference.
  ctx.fillStyle = '#6d4c41';
  poly(ctx, [[336, 268], [424, 268], [408, 288], [352, 288]], '#6d4c41');
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(380, 268); ctx.lineTo(380, 172);
  ctx.stroke();
  const sailColor = applied.has('sail') ? '#ffd54f' : '#fafafa';
  poly(ctx, [[382, 176], [382, 262], [428, 262]], sailColor);
  poly(ctx, [[378, 186], [378, 262], [344, 262]], sailColor);
  circle(ctx, 380, 168, 4, '#ffd54f');

  // Jumping fish — the difference.
  if (!applied.has('fish')) {
    ctx.fillStyle = '#ff8a65';
    ctx.beginPath();
    ctx.ellipse(480, 330, 16, 8, -0.6, 0, Math.PI * 2);
    ctx.fill();
    poly(ctx, [[492, 322], [500, 316], [496, 328]], '#ff8a65');
    ctx.strokeStyle = '#b3e5fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(470, 344, 8, 0, Math.PI);
    ctx.stroke();
  }

  // Wooden dock, bottom right, with crates and an anchor.
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(380, 372, 220, 14);
  ctx.fillStyle = '#6d4c41';
  for (let x = 392; x < 600; x += 24) ctx.fillRect(x, 372, 3, 14);
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(396, 386, 10, 54);
  ctx.fillRect(560, 386, 10, 54);
  // Crates — one extra crate is the difference.
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(420, 340, 34, 32);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 2;
  ctx.strokeRect(420, 340, 34, 32);
  if (applied.has('crate')) {
    ctx.fillStyle = '#bcaaa4';
    ctx.fillRect(482, 336, 34, 36);
    ctx.strokeStyle = '#8d6e63';
    ctx.strokeRect(482, 336, 34, 36);
  }
  // Anchor — the difference.
  if (!applied.has('anchor')) {
    ctx.strokeStyle = '#455a64';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(560, 392, 10, 0, Math.PI);
    ctx.moveTo(560, 382); ctx.lineTo(560, 404);
    ctx.moveTo(550, 388); ctx.lineTo(570, 388);
    ctx.stroke();
    circle(ctx, 560, 378, 4, '#455a64');
  }
}

// ---------------------------------------------------------------------------
// Level 4 — Hutan Bambu (Bamboo Forest): 8 differences, 120 seconds
// ---------------------------------------------------------------------------
export const BAMBOO_DIFFS = [
  { id: 'firefly', x: 500, y: 120, r: 18, name: 'Kunang-kunang' },
  { id: 'mushroom', x: 140, y: 370, r: 22, name: 'Warna jamur' },
  { id: 'shoot', x: 330, y: 300, r: 20, name: 'Rebung di tangan panda' },
  { id: 'stone', x: 250, y: 380, r: 20, name: 'Batu di sungai' },
  { id: 'bird', x: 90, y: 100, r: 24, name: 'Burung di bambu' },
  { id: 'leaf', x: 420, y: 180, r: 18, name: 'Daun jatuh tambahan' },
  { id: 'stalk', x: 560, y: 200, r: 22, name: 'Batang bambu' },
  { id: 'beam', x: 200, y: 60, r: 26, name: 'Sinar matahari' },
];

export function drawBamboo(ctx, W, H, applied) {
  sky(ctx, W, H, '#1d4d2b', '#a8d88a');

  // Sunbeams through the canopy — one beam is the difference.
  ctx.fillStyle = 'rgba(255,244,180,0.20)';
  poly(ctx, [[120, 0], [170, 0], [260, 440], [180, 440]], 'rgba(255,244,180,0.20)');
  if (!applied.has('beam')) {
    poly(ctx, [[200, 0], [240, 0], [330, 440], [270, 440]], 'rgba(255,244,180,0.22)');
  }
  poly(ctx, [[420, 0], [455, 0], [520, 440], [470, 440]], 'rgba(255,244,180,0.16)');

  // Bamboo stalks — one thin stalk is the difference.
  const stalks = [
    { x: 40, w: 26, top: 60, leaf: true },
    { x: 110, w: 20, top: 110, leaf: true },
    { x: 190, w: 30, top: 30, leaf: true },
    { x: 270, w: 18, top: 130, leaf: false },
    { x: 350, w: 24, top: 80, leaf: true },
    { x: 430, w: 20, top: 120, leaf: true },
    { x: 500, w: 28, top: 50, leaf: true },
  ];
  for (const s of stalks) {
    ctx.fillStyle = '#558b2f';
    rr(ctx, s.x, s.top, s.w, 440 - s.top, 8, '#558b2f');
    ctx.fillStyle = '#33691e';
    for (let y = s.top + 46; y < 430; y += 62) {
      ctx.fillRect(s.x - 2, y, s.w + 4, 5);
    }
    if (s.leaf) {
      ctx.fillStyle = '#7cb342';
      ctx.beginPath();
      ctx.ellipse(s.x + s.w / 2 - 26, s.top + 26, 30, 10, -0.5, 0, Math.PI * 2);
      ctx.ellipse(s.x + s.w / 2 + 26, s.top + 34, 30, 10, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (!applied.has('stalk')) {
    ctx.fillStyle = '#689f38';
    rr(ctx, 552, 120, 14, 320, 6, '#689f38');
    ctx.fillStyle = '#33691e';
    for (let y = 170; y < 430; y += 58) ctx.fillRect(550, y, 18, 4);
  }

  // Bird on a stalk — the difference.
  if (!applied.has('bird')) bird(ctx, 90, 100, 1.1, '#1b5e20');

  // Ground and stream.
  ctx.fillStyle = '#2e5d33';
  ctx.fillRect(0, 400, W, 40);
  ctx.fillStyle = '#7fc4e8';
  ctx.beginPath();
  ctx.moveTo(0, 368);
  ctx.bezierCurveTo(150, 352, 260, 384, 400, 366);
  ctx.bezierCurveTo(480, 358, 540, 376, 600, 364);
  ctx.lineTo(600, 400);
  ctx.lineTo(0, 400);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 378); ctx.quadraticCurveTo(120, 372, 180, 380);
  ctx.moveTo(380, 374); ctx.quadraticCurveTo(440, 368, 500, 376);
  ctx.stroke();

  // Stones in the stream — one is the difference.
  if (!applied.has('stone')) {
    ctx.fillStyle = '#90a4ae';
    ctx.beginPath();
    ctx.ellipse(250, 380, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#78909c';
  ctx.beginPath();
  ctx.ellipse(330, 388, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // (the stone above is drawn again below the stream edge for depth)
  ctx.fillStyle = '#90a4ae';
  ctx.beginPath();
  ctx.ellipse(180, 392, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mushroom cluster — one cap changes colour.
  const capColor = applied.has('mushroom') ? '#1e88e5' : '#e53935';
  ctx.fillStyle = '#fff8e1';
  rr(ctx, 132, 372, 8, 18, 3, '#fff8e1');
  rr(ctx, 148, 376, 7, 14, 3, '#fff8e1');
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.arc(136, 372, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  ctx.arc(152, 376, 9, Math.PI, 0);
  ctx.fill();
  circle(ctx, 133, 366, 2.5, '#ffffff');
  circle(ctx, 140, 368, 2, '#ffffff');

  // Panda sitting and eating — the bamboo shoot is the difference.
  ctx.fillStyle = '#fafafa';
  ctx.beginPath();
  ctx.ellipse(330, 330, 34, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 330, 282, 24, '#fafafa');
  circle(ctx, 310, 262, 8, '#212121');
  circle(ctx, 350, 262, 8, '#212121');
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.ellipse(320, 276, 6, 9, 0.4, 0, Math.PI * 2);
  ctx.ellipse(340, 276, 6, 9, -0.4, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 322, 274, 2.5, '#ffffff');
  circle(ctx, 338, 274, 2.5, '#ffffff');
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.ellipse(330, 290, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!applied.has('shoot')) {
    ctx.strokeStyle = '#7cb342';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(330, 306);
    ctx.lineTo(330, 282);
    ctx.stroke();
    ctx.fillStyle = '#aed581';
    poly(ctx, [[330, 282], [338, 292], [330, 296]], '#aed581');
  }

  // Fireflies — one is the difference (seeded, same on both panels).
  const rng = mulberry32(20261121);
  ctx.fillStyle = '#ffee58';
  for (let i = 0; i < 10; i++) {
    const fx = 60 + rng() * 480;
    const fy = 60 + rng() * 180;
    circle(ctx, fx, fy, 3, '#ffee58');
    circle(ctx, fx, fy, 7, 'rgba(255,238,88,0.25)');
  }
  if (!applied.has('firefly')) {
    circle(ctx, 500, 120, 3.5, '#ffee58');
    circle(ctx, 500, 120, 9, 'rgba(255,238,88,0.3)');
  }

  // Falling leaves — one extra leaf only in the right panel.
  ctx.fillStyle = '#7cb342';
  const leafSpots = [[150, 150], [300, 90], [470, 210], [90, 260]];
  for (const [lx, ly] of leafSpots) {
    ctx.beginPath();
    ctx.ellipse(lx, ly, 8, 4, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  if (applied.has('leaf')) {
    ctx.beginPath();
    ctx.ellipse(420, 180, 8, 4, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Level 5 — Kota Neon (Neon Night City): 9 differences, 120 seconds
// ---------------------------------------------------------------------------
export const NEON_DIFFS = [
  { id: 'star', x: 100, y: 50, r: 18, name: 'Bintang' },
  { id: 'letter', x: 200, y: 150, r: 22, name: 'Huruf neon KOPI' },
  { id: 'window', x: 399, y: 194, r: 20, name: 'Jendela menyala' },
  { id: 'headlight', x: 520, y: 380, r: 20, name: 'Lampu mobil' },
  { id: 'antenna', x: 300, y: 60, r: 18, name: 'Lampu antena' },
  { id: 'cat', x: 450, y: 140, r: 22, name: 'Kucing di atap' },
  { id: 'crater', x: 520, y: 60, r: 24, name: 'Kawah bulan' },
  { id: 'lamp', x: 80, y: 350, r: 22, name: 'Lampu jalan' },
  { id: 'extraWindow', x: 221, y: 278, r: 20, name: 'Jendela tambahan' },
];

export function drawNeonCity(ctx, W, H, applied) {
  sky(ctx, W, H, '#0d1030', '#3b2a6b');

  // Moon with craters — one crater is the difference.
  circle(ctx, 520, 60, 28, '#fffde7');
  ctx.fillStyle = '#e0d9b8';
  circle(ctx, 512, 52, 5, '#e0d9b8');
  circle(ctx, 530, 70, 6, '#e0d9b8');
  if (!applied.has('crater')) circle(ctx, 524, 48, 4, '#e0d9b8');

  // Stars — one is the difference (seeded).
  const rng = mulberry32(777);
  for (let i = 0; i < 24; i++) {
    const sx = 20 + rng() * 560;
    const sy = 12 + rng() * 130;
    star(ctx, sx, sy, 4, 4, 1.6, 'rgba(255,255,255,0.9)');
  }
  if (!applied.has('star')) star(ctx, 100, 50, 4, 7, 2.8, '#ffffff');

  // Back skyline.
  ctx.fillStyle = '#1b1e4a';
  const back = [[0, 260, 70, 180], [80, 220, 60, 220], [150, 270, 80, 170], [240, 200, 70, 240], [320, 250, 60, 190], [390, 210, 80, 230], [480, 260, 60, 180], [550, 230, 50, 210]];
  for (const [x, top, w, bottom] of back) ctx.fillRect(x, top, w, bottom - top + 200);

  // Front buildings with lit windows.
  const fronts = [
    { x: 30, y: 190, w: 110, h: 250, lit: 0.55 },
    { x: 150, y: 150, w: 120, h: 290, lit: 0.6 },
    { x: 280, y: 110, w: 90, h: 330, lit: 0.5 },
    { x: 380, y: 170, w: 110, h: 270, lit: 0.55 },
    { x: 500, y: 200, w: 80, h: 240, lit: 0.5 },
  ];
  const wrng = mulberry32(4242);
  for (const b of fronts) {
    ctx.fillStyle = '#23264f';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    for (let wy = b.y + 16; wy < b.y + b.h - 14; wy += 26) {
      for (let wx = b.x + 12; wx < b.x + b.w - 14; wx += 26) {
        // The two special windows are handled below; the rest are seeded.
        if (wx === 392 && wy === 186) continue;
        if (wx === 214 && wy === 270) continue;
        ctx.fillStyle = wrng() < b.lit ? '#ffd54f' : '#12142e';
        ctx.fillRect(wx, wy, 14, 16);
      }
    }
  }
  // The window that goes dark — the difference.
  ctx.fillStyle = applied.has('window') ? '#12142e' : '#ffd54f';
  ctx.fillRect(392, 186, 14, 16);
  // The extra lit window — only in the right panel.
  if (applied.has('extraWindow')) {
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(214, 270, 14, 16);
  }

  // Neon sign KOPI on the second building — one letter changes colour.
  ctx.save();
  ctx.shadowColor = '#ff2e88';
  ctx.shadowBlur = 14;
  label(ctx, 'K', 176, 150, 30, '#ff2e88');
  label(ctx, 'O', 200, 150, 30, applied.has('letter') ? '#00e5ff' : '#ff2e88');
  label(ctx, 'P', 224, 150, 30, '#ff2e88');
  label(ctx, 'I', 246, 150, 30, '#ff2e88');
  ctx.restore();
  // Smaller signs.
  ctx.save();
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 10;
  label(ctx, '24 JAM', 325, 130, 18, '#00e5ff');
  ctx.restore();
  ctx.save();
  ctx.shadowColor = '#ffea00';
  ctx.shadowBlur = 10;
  label(ctx, 'RAMEN', 435, 190, 18, '#ffea00');
  ctx.restore();

  // Antenna on the tallest building — its light is the difference.
  ctx.strokeStyle = '#90a4ae';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(325, 110); ctx.lineTo(325, 66);
  ctx.stroke();
  if (!applied.has('antenna')) {
    circle(ctx, 325, 60, 5, '#ff5252');
    circle(ctx, 325, 60, 11, 'rgba(255,82,82,0.35)');
  }

  // Cat silhouette on a rooftop — the difference.
  if (!applied.has('cat')) {
    ctx.fillStyle = '#0a0c22';
    ctx.beginPath();
    ctx.ellipse(450, 138, 15, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 454, 126, 8, '#0a0c22');
    poly(ctx, [[447, 121], [450, 112], [454, 120]], '#0a0c22');
    poly(ctx, [[456, 120], [460, 112], [462, 121]], '#0a0c22');
    ctx.strokeStyle = '#0a0c22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(462, 142);
    ctx.quadraticCurveTo(474, 136, 470, 124);
    ctx.stroke();
  }

  // Street.
  ctx.fillStyle = '#14142a';
  ctx.fillRect(0, 360, W, 80);
  ctx.fillStyle = '#ffd54f';
  for (let x = 20; x < W; x += 60) ctx.fillRect(x, 396, 30, 5);

  // Streetlamp — the difference.
  if (!applied.has('lamp')) {
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, 400); ctx.lineTo(80, 330);
    ctx.quadraticCurveTo(80, 322, 92, 322);
    ctx.stroke();
    circle(ctx, 94, 326, 7, '#ffe082');
    circle(ctx, 94, 326, 16, 'rgba(255,224,130,0.3)');
  }

  // Car — one headlight is the difference.
  ctx.fillStyle = '#e53935';
  rr(ctx, 470, 356, 100, 26, 8, '#e53935');
  rr(ctx, 492, 336, 56, 24, 8, '#e53935');
  ctx.fillStyle = '#b3e5fc';
  ctx.fillRect(500, 340, 20, 16);
  ctx.fillRect(524, 340, 16, 16);
  ctx.fillStyle = '#212121';
  circle(ctx, 492, 384, 11, '#212121');
  circle(ctx, 548, 384, 11, '#212121');
  circle(ctx, 492, 384, 4, '#90a4ae');
  circle(ctx, 548, 384, 4, '#90a4ae');
  circle(ctx, 566, 366, 6, '#fff9c4');
  if (!applied.has('headlight')) {
    circle(ctx, 474, 366, 6, '#fff9c4');
    ctx.fillStyle = 'rgba(255,249,196,0.18)';
    poly(ctx, [[472, 362], [472, 372], [430, 380], [430, 354]], 'rgba(255,249,196,0.18)');
  }
}
