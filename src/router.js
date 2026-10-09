// Tiny hash router with auth/onboarding guard.
import { getState } from './store.js';

const routes = new Map();
let currentCleanup = null;
let notFoundHandler = null;

export function route(path, handler) {
  routes.set(path, handler);
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

  const handler = routes.get(path) ?? notFoundHandler;
  if (!handler) return;
  const cleanup = handler(root, path) || null;
  if (typeof cleanup === 'function') currentCleanup = cleanup;
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}
