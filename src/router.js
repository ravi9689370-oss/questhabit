// Tiny hash router with :param support and onboarding guard.
import { getState } from './store.js';
import { applyI18n } from './i18n.js';

const routes = new Map(); // pattern -> { regex, keys, handler }
let currentCleanup = null;
let notFoundHandler = null;

export function route(path, handler) {
  const keys = [];
  const regexStr = path.replace(/:[^/]+/g, (m) => {
    keys.push(m.slice(1));
    return '([^/]+)';
  });
  routes.set(path, { regex: new RegExp('^' + regexStr + '$'), keys, handler });
}

export function setNotFound(handler) {
  notFoundHandler = handler;
}

export function navigate(path) {
  if (location.hash.slice(1) === path) {
    render();
  } else {
    location.hash = path;
  }
}

export function currentPath() {
  return location.hash.slice(1) || '/home';
}

export function render() {
  const path = currentPath();
  if (currentCleanup) { try { currentCleanup(); } catch (e) { /* noop */ } currentCleanup = null; }

  const state = getState();
  const root = document.getElementById('app');

  // Onboarding gate
  if (!state.onboarded && path !== '/onboarding') {
    navigate('/onboarding');
    return;
  }
  if (state.onboarded && path === '/onboarding') {
    navigate('/home');
    return;
  }

  for (const [pattern, { regex, handler }] of routes) {
    if (regex.test(path)) {
      const cleanup = handler(root, path) || null;
      if (typeof cleanup === 'function') currentCleanup = cleanup;
      applyI18n(document);
      return;
    }
  }
  if (notFoundHandler) {
    const cleanup = notFoundHandler(root, path) || null;
    if (typeof cleanup === 'function') currentCleanup = cleanup;
    applyI18n(document);
  }
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}
