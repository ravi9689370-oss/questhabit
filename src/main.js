// App bootstrap: state, theme, i18n, router, tab bar.
import { load, subscribe, getState } from './store.js';
import { applyTheme, watchTheme } from './theme.js';
import { setLang, getLang, t } from './i18n.js';
import { startRouter, route, render, currentPath, navigate } from './router.js';
import { APP_NAME } from './config.js';
import { isNative } from './platform.js';

import onboarding from './screens/onboarding.js';
import home from './screens/home.js';
import habitForm from './screens/habit-form.js';
import workout from './screens/workout.js';
import battle from './screens/battle.js';
import character from './screens/character.js';
import shop from './screens/shop.js';
import quests from './screens/quests.js';
import calendar from './screens/calendar.js';
import settings from './screens/settings.js';
import premium from './screens/premium.js';
import about from './screens/about.js';
import more from './screens/more.js';

import './styles.css';

window.__APP_NAME__ = APP_NAME;
document.title = APP_NAME;

// routes
route('/onboarding', onboarding);
route('/home', home);
route('/habit/new', habitForm);
route('/habit/edit/:id', habitForm); // handled via path parse
route('/workout/:id', workout);
route('/boss', battle);
route('/hero', character);
route('/shop', shop);
route('/quests', quests);
route('/calendar', calendar);
route('/settings', settings);
route('/premium', premium);
route('/about', about);
route('/more', more);

// any /habit/edit/<id> path maps to the form screen (it parses the id itself)
route('/habit/edit', habitForm);

function notFound(root) {
  root.innerHTML = `
    <div class="screen center-screen">
      <div class="locked-art">🧭</div>
      <h2>404</h2>
      <p class="muted">Page not found</p>
      <button class="btn btn-primary" id="btn-home">${t('nav_home')}</button>
    </div>`;
  root.querySelector('#btn-home').addEventListener('click', () => navigate('/home'));
}

// ---- Tab bar (persistent, native-feel) ----
const TABS = [
  { path: '/home', icon: '🏠', key: 'nav_home' },
  { path: '/boss', icon: '🐉', key: 'nav_boss' },
  { path: '/hero', icon: '🦸', key: 'nav_char' },
  { path: '/shop', icon: '🛍️', key: 'nav_shop' },
  { path: '/more', icon: '☰', key: 'nav_more' },
];

function buildTabBar() {
  const bar = document.createElement('nav');
  bar.className = 'tab-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'Main navigation');
  bar.innerHTML = `<div class="tab-bar-inner">${TABS.map((tab) => `
    <button class="tab-btn" data-path="${tab.path}" aria-label="${tab.key}">
      <span class="tab-icon">${tab.icon}</span>
      <span data-i18n="${tab.key}"></span>
    </button>`).join('')}</div>`;
  document.body.appendChild(bar);

  bar.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.path));
  });
}

function highlightTab() {
  const path = currentPath();
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    const active = path === btn.dataset.path ||
      (btn.dataset.path === '/home' && path.startsWith('/habit')) ||
      (btn.dataset.path === '/hero' && (path === '/calendar' || path === '/quests'));
    btn.classList.toggle('active', !!active);
  });
}

// hide tab bar during onboarding
function syncTabBar() {
  const bar = document.querySelector('.tab-bar');
  if (!bar) return;
  const s = getState();
  const hide = !s.onboarded || currentPath() === '/onboarding' || currentPath().startsWith('/workout');
  bar.style.display = hide ? 'none' : 'flex';
}

async function boot() {
  const state = await load();
  setLang(state.settings.lang || 'en');
  applyTheme();
  watchTheme();
  buildTabBar();

  // re-render on state change (lightweight: only re-highlight; screens render themselves)
  subscribe(() => { syncTabBar(); });

  const originalRender = render;
  // wrap render to keep tab highlight in sync
  window.addEventListener('hashchange', () => {
    highlightTab();
    syncTabBar();
  });

  startRouter();
  highlightTab();
  syncTabBar();

  // global error boundary — honest logging, no silent failures
  window.addEventListener('error', (e) => {
    console.error('App error:', e.error ?? e.message);
  });
}

boot();
