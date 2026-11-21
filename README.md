# Cari Bedanya! — Petualangan Nusantara

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Daniikhwan/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Daniikhwan/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game for
[make.fun's "Make the best spot the difference game" bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
Two near-identical pictures side by side — click every difference before the
timer runs out.

## The game

Five original Indonesian scenes, all drawn from code (no outside assets):

1. **Kebun Pagi** — a sunny morning garden, 5 differences, 90 seconds
2. **Pasar Senja** — a twilight market with string lights, 6 differences, 100 seconds
3. **Pelabuhan Tua** — an old harbor with a lighthouse, 7 differences, 110 seconds
4. **Hutan Bambu** — a bamboo forest with a panda and fireflies, 8 differences, 120 seconds
5. **Kota Neon** — a neon night city, 9 differences, 120 seconds

Each find earns points with a combo bonus; a wrong click costs 3 seconds.
Three hints per level highlight a remaining difference. Finish a level to earn
a time bonus and up to 3 stars.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

Mouse or touch to click differences; `H` for a hint, `M` to mute,
`Esc` for the menu. The game runs fully offline from static files in `game/`.

## Layout

- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.
- `game/index.html` — page shell, HUD, overlays and styles.
- `game/src/` — one job per file: `config.js` (levels), `random.js` (seeded
  RNG), `art.js` (drawing primitives), `scenes-garden-market.js` and
  `scenes-harbor-forest-city.js` (the five scenes and their differences),
  `render.js` (panels, markers, particles), `audio.js` (WebAudio sounds),
  `input.js` (mouse/touch/keyboard), `game.js` (state machine, score,
  timer, hints), `main.js` (bootstrap and screenshot modes).
- `screenshots/` — real renders of the game's own code in a browser.
- `vendor/makefun-game.ts` — the kit's copy, unchanged.

## License

MIT — see [LICENSE](LICENSE).
