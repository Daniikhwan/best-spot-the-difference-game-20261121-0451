// input.js — mouse, touch and keyboard input for both panels.
// Clicks are converted into scene coordinates (600 x 440 logical space)
// and handed to the game as a single onSceneClick(x, y) call.
import { PANEL_W, PANEL_H } from './config.js';

export function bindPanels(canvasL, canvasR, onSceneClick) {
  const handler = (canvas) => (ev) => {
    ev.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * PANEL_W;
    const y = ((ev.clientY - rect.top) / rect.height) * PANEL_H;
    if (x >= 0 && x <= PANEL_W && y >= 0 && y <= PANEL_H) onSceneClick(x, y);
  };
  canvasL.addEventListener('pointerdown', handler(canvasL));
  canvasR.addEventListener('pointerdown', handler(canvasR));
}

export function bindKeys(actions) {
  window.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    const key = ev.key.toLowerCase();
    if (key === 'h') actions.hint();
    else if (key === 'm') actions.mute();
    else if (key === 'escape') actions.menu();
    else if (key === 'enter') actions.confirm();
    else if (key >= '1' && key <= '5') actions.pickLevel(Number(key));
  });
}
