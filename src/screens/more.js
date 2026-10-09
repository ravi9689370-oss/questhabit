// More menu: quests, calendar, stats, settings, about.
import { t } from '../i18n.js';
import { navigate } from '../router.js';

const MENU = [
  { path: '/quests', icon: '📜', key: 'quests' },
  { path: '/calendar', icon: '📅', key: 'calendar' },
  { path: '/calendar', icon: '📊', key: 'stats', stats: true },
  { path: '/settings', icon: '⚙️', key: 'settings' },
  { path: '/premium', icon: '💎', key: 'premium' },
  { path: '/about', icon: 'ℹ️', key: 'about' },
];

export default function render(root) {
  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('nav_more')}</h2>
      <span></span>
    </header>

    <section class="card">
      <div class="menu-list">
        ${MENU.map((m) => `
          <a class="menu-row" href="#${m.path}">
            <span class="menu-icon">${m.icon}</span>
            <span data-i18n="${m.key}"></span>
            <span class="menu-arrow">›</span>
          </a>`).join('')}
      </div>
    </section>

    <section class="card about-card">
      <div class="muted">QuestHabit · offline-first RPG habit tracker</div>
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));

  // stats entry goes to calendar screen (has stats section)
  root.querySelectorAll('.menu-row').forEach((row) => {
    const item = MENU.find((m) => t(m.key) === row.querySelector('[data-i18n]')?.textContent);
    if (item?.stats) {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/calendar');
      });
    }
  });

  return () => {};
}
