// Boss battle: turn-based with animated attacks.
import { getState, update } from '../store.js';
import { t } from '../i18n.js';
import { toast, vibrate } from '../ui/components.js';
import { navigate } from '../router.js';
import { startBattle, playerAttack, fleeBattle, buyHeal, healCost } from '../game/boss.js';
import { bossForChapter, playerPower, xpForLevel, bossNextLevel } from '../game/engine.js';

const BOSS_ART = [
  // original SVG monsters per chapter (looped for >5)
  `<svg viewBox="0 0 120 120" class="boss-svg" role="img" aria-label="Sloth Goblin">
     <ellipse cx="60" cy="70" rx="34" ry="30" fill="#65a30d"/>
     <circle cx="48" cy="52" r="6" fill="#fef08a"/><circle cx="72" cy="52" r="6" fill="#fef08a"/>
     <circle cx="48" cy="52" r="2.5" fill="#1f2937"/><circle cx="72" cy="52" r="2.5" fill="#1f2937"/>
     <path d="M45 78 q15 12 30 0" stroke="#1f2937" stroke-width="3" fill="none"/>
     <path d="M30 70 q-14 4 -10 18" stroke="#65a30d" stroke-width="8" fill="none" stroke-linecap="round"/>
     <path d="M90 70 q14 4 10 18" stroke="#65a30d" stroke-width="8" fill="none" stroke-linecap="round"/>
   </svg>`,
  `<svg viewBox="0 0 120 120" class="boss-svg" role="img" aria-label="Procrastination Ogre">
     <ellipse cx="60" cy="66" rx="40" ry="36" fill="#a16207"/>
     <circle cx="46" cy="50" r="7" fill="#fff"/><circle cx="74" cy="50" r="7" fill="#fff"/>
     <circle cx="48" cy="51" r="3" fill="#1f2937"/><circle cx="72" cy="51" r="3" fill="#1f2937"/>
     <rect x="44" y="74" width="32" height="8" rx="4" fill="#713f12"/>
     <path d="M40 74 l4 -8 M52 74 l4 -8 M64 74 l4 -8 M76 74 l4 -8" stroke="#fef08a" stroke-width="3"/>
   </svg>`,
  `<svg viewBox="0 0 120 120" class="boss-svg" role="img" aria-label="Doubt Serpent">
     <path d="M20 90 q20 -50 40 -60 q25 -12 40 10 q-10 30 -30 40 q-20 12 -50 10z" fill="#7c3aed"/>
     <circle cx="62" cy="34" r="8" fill="#f5d0fe"/><circle cx="62" cy="34" r="3" fill="#1f2937"/>
     <path d="M70 30 l12 -6 M70 36 l12 2" stroke="#e9d5ff" stroke-width="3"/>
     <circle cx="40" cy="60" r="4" fill="#a78bfa"/><circle cx="52" cy="74" r="4" fill="#a78bfa"/>
   </svg>`,
  `<svg viewBox="0 0 120 120" class="boss-svg" role="img" aria-label="Chaos Drake">
     <path d="M60 18 l14 20 22 4 -16 16 4 22 -24 -12 -24 12 4 -22 -16 -16 22 -4z" fill="#dc2626"/>
     <circle cx="52" cy="46" r="5" fill="#fef08a"/><circle cx="68" cy="46" r="5" fill="#fef08a"/>
     <circle cx="52" cy="46" r="2" fill="#1f2937"/><circle cx="68" cy="46" r="2" fill="#1f2937"/>
     <path d="M50 60 q10 6 20 0" stroke="#7f1d1d" stroke-width="3" fill="none"/>
   </svg>`,
  `<svg viewBox="0 0 120 120" class="boss-svg" role="img" aria-label="Apathy Titan">
     <rect x="26" y="22" width="68" height="76" rx="16" fill="#334155"/>
     <rect x="38" y="38" width="18" height="10" rx="5" fill="#94a3b8"/>
     <rect x="64" y="38" width="18" height="10" rx="5" fill="#94a3b8"/>
     <rect x="44" y="62" width="32" height="6" rx="3" fill="#1e293b"/>
     <path d="M30 30 l8 -10 M90 30 l-8 -10" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
   </svg>`,
];

let battle = null;
let floaters = [];

export default function render(root) {
  const s = getState();
  const result = startBattle();
  if (!result.ok) {
    if (result.reason === 'dead') {
      root.innerHTML = deadHTML(s);
      bindDead(root);
      return () => {};
    }
    // locked: show teaser
    const need = bossNextLevel();
    root.innerHTML = `
      <div class="screen center-screen">
        <div class="locked-art">🔒</div>
        <h2>${t('next_boss_at')} ${need}</h2>
        <p class="muted">${t('chapter')} ${s.boss.chapter} · ${t('level')} ${s.hero.level}/${need}</p>
        <div class="xp-bar big"><div class="xp-fill" style="width:${Math.min(100, Math.round((s.hero.xp / xpForLevel(s.hero.level)) * 100))}%"></div></div>
        <button class="btn btn-primary" id="btn-home">${t('nav_home')}</button>
      </div>`;
    root.querySelector('#btn-home').addEventListener('click', () => navigate('/home'));
    return () => {};
  }

  battle = { boss: result.boss };
  paintBattle(root);
  return () => { battle = null; };
}

function paintBattle(root) {
  const s = getState();
  const b = battle.boss;
  const art = BOSS_ART[(b.chapter - 1) % BOSS_ART.length];
  const bossPct = Math.round((s.boss.hp / s.boss.maxHp) * 100);
  const heroPct = Math.round((s.hero.hp / s.hero.maxHp) * 100);
  const power = playerPower();

  root.innerHTML = `
  <div class="screen battle-screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-flee">← ${t('flee')}</button>
      <h2>${t('chapter')} ${b.chapter}</h2>
      <span class="badge badge-gold">🪙 ${s.hero.gold}</span>
    </header>

    <div class="battle-arena">
      <div class="fighter boss-fighter" id="boss-fighter">
        ${art}
        <div class="fighter-name">${b.name}</div>
        <div class="hp-bar boss"><div class="hp-fill" style="width:${bossPct}%"></div></div>
        <div class="hp-text">${t('boss_hp')}: ${s.boss.hp}/${s.boss.maxHp}</div>
      </div>
      <div class="vs-badge">VS</div>
      <div class="fighter hero-fighter" id="hero-fighter">
        <div class="hero-emoji">${{ warrior: '🦸', mage: '🧙', archer: '🏹' }[s.profile.heroClass] ?? '🦸'}</div>
        <div class="fighter-name">${escapeHtml(s.profile.name)}</div>
        <div class="hp-bar hero"><div class="hp-fill" style="width:${heroPct}%"></div></div>
        <div class="hp-text">${t('your_hp')}: ${s.hero.hp}/${s.hero.maxHp}</div>
      </div>
    </div>

    <div class="battle-log" id="battle-log" aria-live="polite"></div>

    <div class="battle-controls">
      <button class="btn btn-danger btn-lg" id="btn-attack">⚔️ ${t('attack')} <span class="power-hint">${power}</span></button>
      <button class="btn btn-ghost" id="btn-heal">🧪 +40 HP (${healCost()} 🪙)</button>
    </div>
  </div>`;

  root.querySelector('#btn-attack').addEventListener('click', doAttack);
  root.querySelector('#btn-heal').addEventListener('click', () => {
    const r = buyHeal();
    if (r.ok) { toast('Healed +40 HP', 'success'); vibrate(15); paintBattle(root); }
    else if (r.reason === 'gold') toast(t('not_enough_gold'), 'error');
    else toast('HP already full', 'info');
  });
  root.querySelector('#btn-flee').addEventListener('click', () => {
    fleeBattle();
    toast('Fled! -5 HP', 'info');
    navigate('/home');
  });
}

function doAttack() {
  const root = document.getElementById('app');
  const res = playerAttack();
  if (!res.ok) return;
  vibrate([25, 30, 25]);

  // animate hero lunge
  const hero = root.querySelector('#hero-fighter');
  const bossF = root.querySelector('#boss-fighter');
  hero?.classList.add('lunge');
  setTimeout(() => hero?.classList.remove('lunge'), 350);

  floatDamage(root, bossF, `-${res.dmg}`);
  log(root, `${t('your_turn')}: ${res.dmg} ${t('damage')}`);

  if (res.bossDefeated) {
    setTimeout(() => {
      bossF?.classList.add('defeated');
      const rewards = res.rewards;
      toast(`${t('boss_defeated')} +${rewards.xp} XP · +${rewards.gold} 🪙`, 'success');
      paintVictory(root, rewards);
    }, 500);
    return;
  }

  // boss counter after short delay
  setTimeout(() => {
    bossF?.classList.add('lunge');
    setTimeout(() => bossF?.classList.remove('lunge'), 350);
    floatDamage(root, hero, `-${res.counter}`);
    log(root, `${t('boss_turn')}: ${res.counter} ${t('damage')}`);
    if (res.heroDead) {
      paintDefeat(root);
    } else {
      paintBattle(root);
    }
  }, 700);
}

function floatDamage(root, target, text) {
  if (!target) return;
  const f = document.createElement('div');
  f.className = 'damage-float';
  f.textContent = text;
  target.appendChild(f);
  setTimeout(() => f.remove(), 1000);
}

function log(root, msg) {
  const el = root.querySelector('#battle-log');
  if (!el) return;
  const line = document.createElement('div');
  line.textContent = msg;
  el.prepend(line);
  while (el.children.length > 6) el.lastChild.remove();
}

function paintVictory(root, rewards) {
  const s = getState();
  root.innerHTML = `
    <div class="screen center-screen">
      <div class="done-art">👑</div>
      <h1>${t('victory')}</h1>
      <div class="done-stats card">
        <div class="done-row"><span data-i18n="xp_earned"></span><b>+${rewards.xp}</b></div>
        <div class="done-row"><span data-i18n="gold_earned"></span><b>+${rewards.gold}</b></div>
        <div class="done-row"><span>${t('boss_hp')}</span><b>+25% ${t('your_hp').split(' ')[0]}</b></div>
      </div>
      <p class="muted">${t('next_boss_at')} ${bossNextLevel()} (${t('level')} ${s.hero.level})</p>
      <button class="btn btn-primary btn-lg" id="btn-home">${t('nav_home')}</button>
    </div>`;
  root.querySelector('#btn-home').addEventListener('click', () => navigate('/home'));
}

function paintDefeat(root) {
  root.innerHTML = deadHTML(getState());
  bindDead(root);
}

function deadHTML(s) {
  return `
    <div class="screen center-screen">
      <div class="done-art">💀</div>
      <h1>${t('defeated')}</h1>
      <p class="muted">The boss got you. Revive to keep fighting.</p>
      <button class="btn btn-primary btn-lg" id="btn-revive">❤️ Revive (50% HP)</button>
      <button class="btn btn-ghost" id="btn-home">${t('nav_home')}</button>
    </div>`;
}

function bindDead(root) {
  root.querySelector('#btn-revive')?.addEventListener('click', () => {
    update((st) => { st.hero.hp = Math.round(st.hero.maxHp * 0.5); });
    toast('Revived!', 'success');
    navigate('/boss');
  });
  root.querySelector('#btn-home')?.addEventListener('click', () => navigate('/home'));
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
