// Hero screen: stats, inventory, equipped items.
import { getState } from '../store.js';
import { t } from '../i18n.js';
import { avatarSVG, itemIconSVG } from '../ui/character.js';
import { weeklyBarsSVG, statsSummaryHTML } from '../ui/charts.js';
import { navigate } from '../router.js';
import { totalItemPower } from '../game/items.js';
import { playerPower } from '../game/engine.js';
import { ACHIEVEMENTS } from '../game/achievements.js';

export default function render(root) {
  const s = getState();
  const equippedPower = totalItemPower();

  const groups = { weapon: 'Weapons', armour: 'Armour', pet: 'Pets', skin: 'Skins' };

  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('nav_char')}</h2>
      <span></span>
    </header>

    <section class="card hero-detail">
      <div class="avatar-wrap big">${avatarSVG({ heroClass: s.profile.heroClass, color: s.profile.color, size: 130 })}</div>
      <h2>${escapeHtml(s.profile.name)}</h2>
      <div class="muted">${t('class_' + s.profile.heroClass)} · ${t('level')} ${s.hero.level}</div>
      <div class="power-line">⚔️ ${t('your_turn') === 'Your turn' ? 'Power' : 'Power'}: <b>${playerPower()}</b> <span class="muted">(items +${equippedPower})</span></div>
    </section>

    <section class="card">
      <div class="card-head"><h2>Stats</h2></div>
      <div class="stat-bars">
        ${['str', 'int', 'agi', 'sta'].map((k) => `
          <div class="stat-bar-row">
            <span class="stat-bar-label">${{ str: '💪 Strength', int: '🧠 Intelligence', agi: '⚡ Agility', sta: '❤️ Stamina' }[k]}</span>
            <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100, s.hero.stats[k] * 8)}%"></div></div>
            <b>${s.hero.stats[k]}</b>
          </div>`).join('')}
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>${t('stats')}</h2></div>
      ${statsSummaryHTML()}
      <div class="card-head" style="margin-top:1rem"><h2>Last 7 days</h2></div>
      ${weeklyBarsSVG()}
    </section>

    <section class="card">
      <div class="card-head"><h2>Inventory</h2></div>
      ${Object.entries(groups).map(([kind, label]) => `
        <h3 class="inv-group">${label}</h3>
        <div class="item-grid">
          ${s.items.filter((i) => i.kind === kind).map((i) => `
            <div class="item-card ${i.owned ? '' : 'locked'} ${i.equipped ? 'equipped' : ''}">
              <div class="item-icon">${itemIconSVG(i.icon, 44)}</div>
              <div class="item-name">${i.name}</div>
              ${i.power ? `<div class="item-power">+${i.power}</div>` : ''}
              <div class="item-state">${i.equipped ? t('equipped') : i.owned ? t('owned') : '🔒'}</div>
            </div>`).join('')}
        </div>`).join('')}
    </section>

    <section class="card">
      <div class="card-head"><h2>${t('achievements')}</h2></div>
      <div class="ach-grid">
        ${ACHIEVEMENTS.map((a) => `
          <div class="ach-card ${s.achievements[a.key] ? 'unlocked' : ''}">
            <div class="ach-icon">${a.icon}</div>
            <div class="ach-name">${a.name}</div>
            <div class="ach-desc">${a.desc}</div>
          </div>`).join('')}
      </div>
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));
  return () => {};
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
