// Generates Android launcher icons (all densities) + adaptive icon
// from resources/icon.svg, and the 512px Play Store icon.
// Run AFTER `npx cap add android`.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'resources/icon.svg'), 'utf8');

const DENSITIES = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4,
};

function render(size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  });
  return Buffer.from(resvg.render().asPng());
}

// 1. Play Store icon 512
const out512 = join(root, 'store', 'icon-512.png');
mkdirSync(join(root, 'store'), { recursive: true });
writeFileSync(out512, render(512));
console.log('store/icon-512.png (512x512)');

// 2. Android launcher icons
const resDir = join(root, 'android', 'app', 'src', 'main', 'res');
if (!existsSync(resDir)) {
  console.error('android/ not found — run `npx cap add android` first');
  process.exit(1);
}

for (const [dpi, mult] of Object.entries(DENSITIES)) {
  const size = Math.round(48 * mult);
  const dir = join(resDir, `mipmap-${dpi}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'ic_launcher.png'), render(size));
  writeFileSync(join(dir, 'ic_launcher_round.png'), render(size));

  // adaptive foreground (108dp base)
  const fgSize = Math.round(108 * mult);
  writeFileSync(join(dir, 'ic_launcher_foreground.png'), render(fgSize));
  console.log(`mipmap-${dpi}: ${size}px + adaptive fg ${fgSize}px`);
}

// 3. Adaptive icon background color → navy (matches icon bg)
const valuesDir = join(resDir, 'values');
mkdirSync(valuesDir, { recursive: true });
const colorsPath = join(valuesDir, 'colors.xml');
let colors = existsSync(colorsPath) ? readFileSync(colorsPath, 'utf8') : '';
if (colors.includes('ic_launcher_background')) {
  colors = colors.replace(/<color name="ic_launcher_background">.*?<\/color>/,
    '<color name="ic_launcher_background">#10131a</color>');
} else {
  colors = colors.replace('</resources>', '  <color name="ic_launcher_background">#10131a</color>\n</resources>');
  if (!colors.includes('</resources>')) {
    colors = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <color name="ic_launcher_background">#10131a</color>\n</resources>\n`;
  }
}
writeFileSync(colorsPath, colors);
console.log('colors.xml: ic_launcher_background = #10131a');
console.log('Icons generated ✔');
