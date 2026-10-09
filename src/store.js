// Central app state: load/save via IndexedDB, pub/sub for re-render.
import { dbGet, dbSet, dbClear, STATE_KEY } from './db.js';

export const DEFAULT_STATE = () => ({
  version: 1,
  onboarded: false,
  profile: { name: '', heroClass: 'warrior', color: '#4ade80', createdAt: null },
  hero: {
    level: 1,
    xp: 0,
    gold: 0,
    hp: 100,
    maxHp: 100,
    stats: { str: 1, int: 1, agi: 1, sta: 1 },
    totalWorkouts: 0,
    totalHabitsDone: 0,
  },
  habits: [],
  logs: [],          // { id, habitId, date: 'YYYY-MM-DD', value, completedAt }
  quests: { date: null, list: [] },
  boss: { chapter: 1, unlocked: false, hp: 0, maxHp: 0, defeated: 0 },
  items: [],         // { id, name, kind, price, icon, owned, equipped }
  achievements: {},  // key -> ISO date
  questsClaimed: 0,
  freezes: 1,
  settings: { theme: 'system', lang: 'en', notifications: true },
});

let state = DEFAULT_STATE();
const listeners = new Set();
let saveTimer = null;

export function getState() {
  return state;
}

export function setState(patch) {
  state = { ...state, ...patch };
  notify();
  scheduleSave();
}

export function update(fn) {
  fn(state);
  notify();
  scheduleSave();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => {
    try { fn(state); } catch (e) { console.error(e); }
  });
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => save(), 250);
}

export async function save() {
  try {
    await dbSet(STATE_KEY, state);
  } catch (e) {
    console.error('save failed', e);
  }
}

export async function load() {
  try {
    const saved = await dbGet(STATE_KEY);
    if (saved && saved.version === 1) {
      state = { ...DEFAULT_STATE(), ...saved };
    }
  } catch (e) {
    console.error('load failed, using defaults', e);
  }
  return state;
}

export async function wipeAll() {
  await dbClear();
  state = DEFAULT_STATE();
  notify();
}
