// scenes-garden-market.js — levels 1 and 2: Kebun Pagi and Pasar Senja.
// Every scene draws from one function: draw(ctx, W, H, applied) where
// `applied` is the set of difference ids the RIGHT panel applies.
// The LEFT panel always draws with an empty set. All decoration uses the
// same coordinates on both sides, so only the listed differences change.

import { circle, rr, poly, sky, cloud, bird, flower, label } from './art.js';
import { mulberry32 } from './random.js';

// ---------------------------------------------------------------------------
// Level 1 — Kebun Pagi (Morning Garden): 5 differences, 90 seconds
// ---------------------------------------------------------------------------
export const GARDEN_DIFFS = [
  { id: 'bird', x: 430, y: 68, r: 26, name: 'Burung di langit' },
  { id: 'sun', x: 92, y: 72, r: 36, name: 'Warna matahari' },
  { id: 'apple', x: 497, y: 196, r: 18, name: 'Apel di pohon' },
  { id: 'tulip', x: 180, y: 384, r: 20, name: 'Warna tulip' },
  { id: 'picket', x: 350, y: 330, r: 22, name: 'Papan pagar' },
];

export function drawGarden(ctx, W, H, applied) {
  sky(ctx, W, H, '#bfe6ff', '#fff3c4');

  // Sun — its colour is the difference.
  const sunColor = applied.has('sun') ? '#ff8f00' : '#ffd54f';
  ctx.strokeStyle = sunColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * i) / 4;
    ctx.beginPath();
    ctx.moveTo(92 + Math.cos(a) * 44, 72 + Math.sin(a) * 44);
    ctx.lineTo(92 + Math.cos(a) * 56, 72 + Math.sin(a) * 56);
    ctx.stroke();
  }
  circle(ctx, 92, 72, 34, sunColor);
  circle(ctx, 82, 62, 8, 'rgba(255,255,255,0.55)');

  cloud(ctx, 250, 58, 1);
  cloud(ctx, 452, 42, 0.75);

  // Birds — one of them is the difference.
  if (!applied.has('bird')) bird(ctx, 430, 68, 1.2);
  bird(ctx, 520, 104, 0.9);

  // Rolling hills.
  ctx.fillStyle = '#8ed081';
  ctx.beginPath();
  ctx.ellipse(170, 470, 320, 110, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#69b455';
  ctx.beginPath();
  ctx.ellipse(480, 490, 340, 120, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // House with a red roof, door, windows and a smoking chimney.
  ctx.fillStyle = '#fff3e0';
  ctx.fillRect(210, 215, 130, 115);
  poly(ctx, [[198, 218], [275, 148], [352, 218]], '#d32f2f');
  rr(ctx, 262, 272, 26, 58, 3, '#795548');
  circle(ctx, 284, 302, 3, '#ffd54f');
  // Windows with cross frames.
  ctx.fillStyle = '#b3e5fc';
  ctx.fillRect(224, 232, 26, 26);
  ctx.fillRect(300, 232, 26, 26);
  ctx.strokeStyle = '#fff3e0';
  ctx.lineWidth = 3;
  ctx.strokeRect(224, 232, 26, 26);
  ctx.strokeRect(300, 232, 26, 26);
  ctx.beginPath();
  ctx.moveTo(237, 232); ctx.lineTo(237, 258);
  ctx.moveTo(224, 245); ctx.lineTo(250, 245);
  ctx.moveTo(313, 232); ctx.lineTo(313, 258);
  ctx.moveTo(300, 245); ctx.lineTo(326, 245);
  ctx.stroke();
  // Chimney + smoke.
  rr(ctx, 314, 162, 18, 46, 2, '#b0bec5');
  circle(ctx, 322, 148, 10, 'rgba(255,255,255,0.85)');
  circle(ctx, 330, 132, 13, 'rgba(255,255,255,0.65)');
  circle(ctx, 340, 114, 16, 'rgba(255,255,255,0.45)');

  // Path from the door.
  poly(ctx, [[258, 330], [292, 330], [310, 440], [240, 440]], '#e8d9b0');

  // Tree with apples — one apple is the difference.
  rr(ctx, 470, 252, 18, 92, 4, '#6d4c41');
  circle(ctx, 480, 198, 56, '#2e7d32');
  circle(ctx, 438, 222, 40, '#388e3c');
  circle(ctx, 522, 222, 40, '#43a047');
  circle(ctx, 448, 192, 8, '#e53935');
  circle(ctx, 515, 215, 8, '#e53935');
  if (!applied.has('apple')) circle(ctx, 497, 196, 8, '#e53935');

  // Fence — one picket is the difference.
  ctx.strokeStyle = '#a1887f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(30, 322); ctx.lineTo(580, 322);
  ctx.moveTo(30, 340); ctx.lineTo(580, 340);
  ctx.stroke();
  for (let x = 44; x <= 576; x += 38) {
    if (applied.has('picket') && x === 350) continue;
    ctx.fillStyle = '#bcaaa4';
    ctx.fillRect(x, 308, 9, 42);
    poly(ctx, [[x - 1, 308], [x + 4.5, 298], [x + 10, 308]], '#bcaaa4');
  }

  // Cat sitting by the house.
  ctx.fillStyle = '#ff8a65';
  ctx.beginPath();
  ctx.ellipse(140, 372, 26, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 148, 344, 15, '#ff8a65');
  poly(ctx, [[136, 334], [140, 320], [146, 333]], '#ff8a65');
  poly(ctx, [[152, 333], [158, 320], [162, 334]], '#ff8a65');
  ctx.strokeStyle = '#ff8a65';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(162, 380);
  ctx.quadraticCurveTo(182, 372, 178, 352);
  ctx.stroke();
  ctx.fillStyle = '#37474f';
  circle(ctx, 143, 341, 2, '#37474f');
  circle(ctx, 153, 341, 2, '#37474f');

  // Butterfly.
  ctx.fillStyle = '#ab47bc';
  ctx.beginPath();
  ctx.ellipse(258, 348, 9, 6, -0.5, 0, Math.PI * 2);
  ctx.ellipse(272, 348, 9, 6, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4a148c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(265, 342); ctx.lineTo(265, 356);
  ctx.stroke();

  // Tulip row — one tulip changes colour.
  const tulipXs = [60, 120, 180, 240, 300, 420, 480, 540];
  tulipXs.forEach((x, i) => {
    let petal = i % 2 === 0 ? '#e53935' : '#ffca28';
    if (x === 180 && applied.has('tulip')) petal = '#8e24aa';
    flower(ctx, x, 384, 1, petal);
  });

  // Watering can by the fence.
  ctx.fillStyle = '#78909c';
  rr(ctx, 548, 396, 30, 18, 3, '#78909c');
  poly(ctx, [[578, 400], [592, 392], [592, 402], [578, 408]], '#78909c');
  ctx.strokeStyle = '#78909c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(548, 404, 10, Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Level 2 — Pasar Senja (Twilight Market): 6 differences, 100 seconds
// ---------------------------------------------------------------------------
export const MARKET_DIFFS = [
  { id: 'flag', x: 420, y: 84, r: 20, name: 'Bendera umbul-umbul' },
  { id: 'awning', x: 150, y: 148, r: 26, name: 'Warna tenda kiri' },
  { id: 'banana', x: 452, y: 302, r: 24, name: 'Pisang tambahan' },
  { id: 'basket', x: 108, y: 318, r: 22, name: 'Keranjang sepeda' },
  { id: 'cat', x: 500, y: 368, r: 24, name: 'Kucing di peti' },
  { id: 'lantern', x: 520, y: 92, r: 22, name: 'Lampion gantung' },
];

export function drawMarket(ctx, W, H, applied) {
  sky(ctx, W, H, '#7b5ea7', '#ff9e64');

  // Low sun and distant rooftops.
  circle(ctx, 520, 120, 30, '#ffb74d');
  ctx.fillStyle = '#5e4b8b';
  poly(ctx, [[0, 300], [0, 240], [60, 240], [90, 300]], '#5e4b8b');
  poly(ctx, [[520, 300], [520, 225], [580, 225], [600, 300], [600, 300]], '#5e4b8b');
  ctx.fillStyle = '#6d5a9e';
  ctx.fillRect(90, 262, 430, 38);

  // String lights sagging across the top.
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.quadraticCurveTo(300, 66, 600, 34);
  ctx.stroke();
  for (let x = 30; x <= 580; x += 50) {
    const t = x / 600;
    const y = 34 + 64 * t * (1 - t);
    circle(ctx, x, y + 6, 6, '#ffd54f');
    circle(ctx, x, y + 6, 10, 'rgba(255,213,79,0.25)');
  }

  // Bunting flags — one is the difference.
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 66);
  ctx.quadraticCurveTo(300, 92, 600, 66);
  ctx.stroke();
  const flagColors = ['#e53935', '#fdd835', '#43a047', '#1e88e5'];
  for (let i = 0; i < 12; i++) {
    const x = 28 + i * 48;
    if (applied.has('flag') && x === 420) continue;
    const t = x / 600;
    const y = 66 + 52 * t * (1 - t);
    poly(ctx, [[x - 9, y + 2], [x + 9, y + 2], [x, y + 20]], flagColors[i % 4]);
  }

  // Paper lantern hanging at the right — the difference.
  if (!applied.has('lantern')) {
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(520, 40); ctx.lineTo(520, 76);
    ctx.stroke();
    circle(ctx, 520, 92, 15, '#ef5350');
    ctx.fillStyle = '#ffcdd2';
    ctx.fillRect(514, 88, 12, 4);
    circle(ctx, 520, 92, 20, 'rgba(239,83,80,0.25)');
  }

  // Left stall with a striped awning — one stripe changes colour.
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(60, 260, 180, 92);
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(60, 260, 180, 10);
  for (let i = 0; i < 6; i++) {
    let c = i % 2 === 0 ? '#e53935' : '#fff8e1';
    if (applied.has('awning') && i === 2) c = '#ff80ab';
    ctx.fillStyle = c;
    ctx.fillRect(56 + i * 32, 138, 32, 34);
  }
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(52, 170, 196, 6);
  // Goods on the left stall: pumpkins and greens.
  circle(ctx, 100, 248, 14, '#fb8c00');
  circle(ctx, 130, 250, 12, '#fb8c00');
  circle(ctx, 165, 246, 13, '#7cb342');
  circle(ctx, 195, 250, 11, '#7cb342');
  circle(ctx, 220, 248, 12, '#fb8c00');

  // Right stall with a teal awning and fruit baskets.
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(350, 260, 190, 92);
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(350, 260, 190, 10);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#00897b' : '#fff8e1';
    ctx.fillRect(348 + i * 32, 138, 32, 34);
  }
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(344, 170, 202, 6);
  // Oranges and apples in baskets.
  circle(ctx, 392, 248, 12, '#fb8c00');
  circle(ctx, 412, 244, 12, '#fb8c00');
  circle(ctx, 402, 252, 12, '#f57c00');
  circle(ctx, 478, 248, 12, '#e53935');
  circle(ctx, 498, 244, 12, '#e53935');
  circle(ctx, 488, 252, 12, '#c62828');
  // Extra banana bunch — only in the right panel.
  if (applied.has('banana')) {
    ctx.strokeStyle = '#fdd835';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(452, 296, 12, 0.3, Math.PI - 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(452, 306, 12, 0.3, Math.PI - 0.6);
    ctx.stroke();
  }

  // Vendor between the stalls.
  ctx.fillStyle = '#6d4c41';
  rr(ctx, 284, 268, 34, 62, 8, '#6d4c41');
  circle(ctx, 301, 246, 15, '#ffccbc');
  ctx.fillStyle = '#fdd835';
  ctx.beginPath();
  ctx.arc(301, 240, 16, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(285, 238, 32, 5);
  ctx.fillStyle = '#fff8e1';
  ctx.fillRect(290, 276, 22, 40);

  // Bicycle leaning on the left — its basket is the difference.
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(84, 356, 22, 0, Math.PI * 2);
  ctx.arc(150, 356, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(84, 356); ctx.lineTo(118, 322);
  ctx.lineTo(150, 356); ctx.lineTo(108, 356);
  ctx.moveTo(118, 322); ctx.lineTo(142, 322);
  ctx.moveTo(142, 322); ctx.lineTo(150, 356);
  ctx.stroke();
  if (!applied.has('basket')) {
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(96, 306, 24, 16);
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 2;
    ctx.strokeRect(96, 306, 24, 16);
  }

  // Crates on the right with a cat on top — the cat is the difference.
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(462, 352, 60, 34);
  ctx.fillRect(478, 322, 44, 30);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 2;
  ctx.strokeRect(462, 352, 60, 34);
  ctx.strokeRect(478, 322, 44, 30);
  if (!applied.has('cat')) {
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.ellipse(500, 314, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 504, 300, 9, '#37474f');
    poly(ctx, [[496, 294], [499, 284], [504, 293]], '#37474f');
    poly(ctx, [[506, 293], [511, 284], [513, 294]], '#37474f');
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(514, 318);
    ctx.quadraticCurveTo(526, 312, 522, 300);
    ctx.stroke();
  }

  // Cobblestone ground.
  ctx.fillStyle = '#6d5a7d';
  ctx.fillRect(0, 386, W, 54);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let x = 10; x < W; x += 44) {
    circle(ctx, x, 404, 7, 'rgba(255,255,255,0.08)');
    circle(ctx, x + 22, 424, 7, 'rgba(255,255,255,0.08)');
  }
}
