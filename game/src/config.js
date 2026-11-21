// config.js — level metadata: name, time limit, theme colours and
// the modules that draw each scene. One level = one original scene.
export const PANEL_W = 600;
export const PANEL_H = 440;

export const LEVELS = [
  {
    id: 1,
    name: 'Kebun Pagi',
    subtitle: 'Pagi yang cerah di kebun rumah',
    timeLimit: 90,
    sky: ['#bfe6ff', '#fff3c4'],
    accent: '#2e7d32',
    module: 'scenes-garden-market.js',
    sceneFn: 'drawGarden',
  },
  {
    id: 2,
    name: 'Pasar Senja',
    subtitle: 'Lampu-lampu mulai menyala di pasar',
    timeLimit: 100,
    sky: ['#7b5ea7', '#ff9e64'],
    accent: '#c62828',
    module: 'scenes-garden-market.js',
    sceneFn: 'drawMarket',
  },
  {
    id: 3,
    name: 'Pelabuhan Tua',
    subtitle: 'Kapal, mercusuar, dan camar',
    timeLimit: 110,
    sky: ['#a8d8f0', '#fdf6d8'],
    accent: '#1565c0',
    module: 'scenes-harbor-forest-city.js',
    sceneFn: 'drawHarbor',
  },
  {
    id: 4,
    name: 'Hutan Bambu',
    subtitle: 'Sunyi, hijau, dan kunang-kunang',
    timeLimit: 120,
    sky: ['#1d4d2b', '#a8d88a'],
    accent: '#33691e',
    module: 'scenes-harbor-forest-city.js',
    sceneFn: 'drawBamboo',
  },
  {
    id: 5,
    name: 'Kota Neon',
    subtitle: 'Malam di kota yang tak pernah tidur',
    timeLimit: 120,
    sky: ['#0d1030', '#3b2a6b'],
    accent: '#ff2e88',
    module: 'scenes-harbor-forest-city.js',
    sceneFn: 'drawNeonCity',
  },
];

export const HINTS_PER_LEVEL = 3;
export const MISS_TIME_PENALTY = 3; // seconds lost on a wrong click
export const POINTS_PER_FIND = 100;
export const COMBO_BONUS = 25; // per combo step, on top of the find
export const TIME_BONUS_PER_SECOND = 10;
