// Headless smoke test v2: step-by-step logging, resilient to crashes.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };

const server = createServer((req, res) => {
  let path = join(dist, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!existsSync(path)) path = join(dist, 'index.html');
  try {
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(readFileSync(path));
  } catch (e) { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(4173, r));

const log = [];
const step = (name, ok, extra = '') => { log.push(`${ok ? '✅' : '❌'} ${name} ${extra}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (err) => log.push('💥 PAGEERROR: ' + err.message));
page.on('crash', () => log.push('💥 PAGE CRASHED'));
page.on('console', (m) => { if (m.type() === 'error') log.push('🖨 console.error: ' + m.text().slice(0, 200)); });

async function tryClick(sel, name, timeout = 5000) {
  try {
    await page.click(sel, { timeout });
    return true;
  } catch (e) {
    step(name, false, '(click failed: ' + e.message.split('\n')[0].slice(0, 80) + ')');
    return false;
  }
}
async function tryEval(name, fn) {
  try {
    const v = await page.evaluate(fn);
    step(name, true, String(v).slice(0, 60));
    return v;
  } catch (e) {
    step(name, false, '(eval failed)');
    return null;
  }
}

try {
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1000);

  await tryEval('onboarding shown', () => !!document.querySelector('.onboard-card'));
  await tryClick('#btn-next', 'onboard next 1'); await page.waitForTimeout(200);
  await tryClick('#btn-next', 'onboard next 2'); await page.waitForTimeout(200);
  await tryClick('#btn-next', 'onboard next 3'); await page.waitForTimeout(300);

  await tryEval('hero form shown', () => !!document.querySelector('#btn-create'));
  await page.fill('#hero-name', 'TestHero');
  await tryClick('#btn-create', 'create hero'); await page.waitForTimeout(600);

  await tryEval('home shown', () => !!document.querySelector('.hero-card'));
  await tryEval('greeting', () => document.querySelector('.hello')?.textContent);

  // add workout habit
  await tryClick('#fab-add', 'fab add'); await page.waitForTimeout(300);
  await page.fill('#f-title', 'Morning Run');
  await tryClick('#f-type .chip[data-value="workout"]', 'select workout type');
  await page.waitForTimeout(150);
  await tryClick('#btn-save', 'save habit'); await page.waitForTimeout(400);

  await tryEval('habit row count', () => document.querySelectorAll('.habit-row').length);
  await tryClick('.habit-start', 'start workout'); await page.waitForTimeout(600);

  await tryEval('workout screen shown', () => !!document.querySelector('.timer-ring'));
  await tryEval('timer initial', () => document.querySelector('#timer-text')?.textContent);

  await tryClick('#btn-toggle', 'toggle timer start'); await page.waitForTimeout(4000);
  await tryEval('timer after 4s', () => document.querySelector('#timer-text')?.textContent);
  await tryEval('reps counted', () => document.querySelector('#reps-count')?.textContent);
  await tryEval('phase text', () => document.querySelector('#phase-text')?.textContent);

  await tryClick('#btn-finish', 'finish early'); await page.waitForTimeout(600);
  await tryEval('workout done screen', () => !!document.querySelector('.workout-done'));
  await tryEval('done stats', () => document.querySelector('.done-stats')?.textContent?.replace(/\s+/g, ' ').slice(0, 100));
  await tryClick('#btn-done', 'done button'); await page.waitForTimeout(400);

  // simple habit
  await tryClick('#fab-add', 'fab add 2'); await page.waitForTimeout(200);
  await page.fill('#f-title', 'Drink Water');
  await tryClick('#btn-save', 'save habit 2'); await page.waitForTimeout(400);
  await tryClick('.habit-complete', 'complete simple habit'); await page.waitForTimeout(500);
  await tryEval('done habits count', () => document.querySelectorAll('.habit-row.done').length);

  // boss
  await tryClick('.tab-btn[data-path="/boss"]', 'boss tab'); await page.waitForTimeout(400);
  await tryEval('boss screen', () => !!document.querySelector('.center-screen') || !!document.querySelector('.battle-arena'));

  // hero, shop, quests
  await tryClick('.tab-btn[data-path="/hero"]', 'hero tab'); await page.waitForTimeout(300);
  await tryEval('hero detail', () => !!document.querySelector('.hero-detail'));
  await tryClick('.tab-btn[data-path="/shop"]', 'shop tab'); await page.waitForTimeout(300);
  await tryEval('shop cards', () => document.querySelectorAll('.shop-card').length);
  await tryClick('.tab-btn[data-path="/more"]', 'more tab'); await page.waitForTimeout(200);
  await tryClick('.menu-row .menu-icon', 'first menu item'); await page.waitForTimeout(300);
  await tryEval('quest rows', () => document.querySelectorAll('.quest-row').length);

  mkdirSync(join(root, 'store', 'screenshots'), { recursive: true });
  const shots = [
    ['#/home', 'home'], ['#/boss', 'boss'], ['#/hero', 'hero'],
    ['#/shop', 'shop'], ['#/quests', 'quests'], ['#/calendar', 'calendar'],
    ['#/settings', 'settings'],
  ];
  for (const [hash, name] of shots) {
    try {
      await page.goto('http://localhost:4173/' + hash, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(root, 'store', 'screenshots', name + '.png') });
      step('screenshot ' + name, true);
    } catch (e) { step('screenshot ' + name, false, e.message.split('\n')[0].slice(0, 60)); }
  }
} catch (e) {
  log.push('💥 FATAL: ' + e.message);
}

console.log(log.join('\n'));
try { await browser.close(); } catch (e) { /* noop */ }
server.close();
process.exit(0);
