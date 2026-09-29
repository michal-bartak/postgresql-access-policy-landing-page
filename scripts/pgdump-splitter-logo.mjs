// Generates the pgDump Splitter logo (src/data/icons/pgdump-splitter.svg).
// Usage: node scripts/pgdump-splitter-logo.mjs   — tweak the constants below and re-run.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(process.cwd() + '/');
const icons = require('@iconify-json/simple-icons/icons.json');
const d = icons.icons.postgresql.body.match(/ d="([^"]+)"/)[1];
const outer = d.split(/(?=M)/)[0];

const ANGLE = 25;          // tilt of the cuts from vertical, degrees
const CUTS = [8.8, 15.1, 21.4]; // positions along the cut normal (icon units) -> 4 pieces
const GAP = 1.8;           // extra gap opened at each cut (icon units)
const DROP = 1.5;          // each piece sits this much lower than the one on its left (icon units)
const SCALE = 3.3;         // elephant size inside the 128x128 icon
const [TX, TY] = [63, 64];  // elephant centre
const HEAD = '#336791';    // elephant fill (PostgreSQL blue)
const LINES = '#ffffff';   // outline / detail lines
const BG = ['#ffffff', '#e3edf7']; // background gradient, top-left -> bottom-right
const OUT = 'src/data/icons/pgdump-splitter.svg';

const a = (ANGLE * Math.PI) / 180;
const n = [Math.cos(a), Math.sin(a)];   // normal of the cut lines
const edges = [-60, ...CUTS, 80];
const k0 = (edges.length - 2) / 2;
const f = (v) => +v.toFixed(3);

const clips = [], pieces = [];
for (let i = 0; i < edges.length - 1; i++) {
  const k = i - k0;
  const dx = k * GAP * n[0];
  const dy = k * GAP * n[1] + k * DROP;
  clips.push(`    <clipPath id="p${i}"><rect x="${edges[i]}" y="-60" width="${edges[i + 1] - edges[i]}" height="140" transform="rotate(${ANGLE})"/></clipPath>`);
  pieces.push(`    <use href="#slonik" clip-path="url(#p${i})" transform="translate(${f(dx)} ${f(dy)})"/>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <!-- pgDump Splitter logo: the PostgreSQL elephant (outline from Simple Icons) sliced into ${edges.length - 1} pieces -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BG[0]}"/>
      <stop offset="1" stop-color="${BG[1]}"/>
    </linearGradient>
${clips.join('\n')}
    <g id="slonik"><path fill="${HEAD}" d="${outer}"/><path fill="${LINES}" d="${d}"/></g>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg)"/>
  <g transform="translate(${TX} ${TY}) scale(${SCALE}) translate(-12 -12)">
${pieces.join('\n')}
  </g>
</svg>
`;
writeFileSync(OUT, svg);
console.log(`Wrote ${OUT}`);
