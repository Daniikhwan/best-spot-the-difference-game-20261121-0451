// main.js — bootstrap. Starts the game, then honours the screenshot
// modes the maker uses to capture the entry's images:
//   ?shot=start            the title screen (default, no query)
//   ?shot=play&level=3     mid-play: 3 differences already found,
//                          several still unfound, counter visible
//   ?shot=end&level=1      the level-complete screen with 3 stars
// Shot modes pause the timer so the frame is stable for a screenshot.
import { Game } from './game.js';
import { LEVELS } from './config.js';

const game = new Game(document);
window.__game = game;

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const level = Math.min(
  LEVELS.length,
  Math.max(1, Number(params.get('level') || 3)),
);

if (shot === 'play') {
  const diffs = game.diffsForLevel(level - 1);
  const preFound = diffs.slice(0, 3).map((d) => d.id);
  game.startLevel(level - 1, { preFound, timeLeft: 75, paused: true });
} else if (shot === 'end') {
  game.startLevel(level - 1, { preFound: 'all', timeLeft: 45, paused: true });
  game.levelComplete();
}
