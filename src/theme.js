// Theme: light/dark/system via CSS variables on :root / [data-theme].
import { getState } from './store.js';

export function applyTheme(force) {
  const pref = force ?? getState().settings.theme;
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#10131a' : '#f6f7fb');
}

export function watchTheme() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getState().settings.theme === 'system') applyTheme();
  });
}
