// Daily quests: deterministic per-day generation from the user's habits.
import { getState, update } from '../store.js';
import { todayStr, uid, addXp, addGold } from './engine.js';
import { evaluateAchievements } from './achievements.js';

// Simple seeded PRNG (mulberry32) so quests are stable all day.
function seededRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromDate(dateStr) {
  let h = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const TEMPLATES = [
  (habit) => ({ kind: 'complete', habitId: habit.id, target: 1,
    text: `Complete “${habit.title}”`, xp: 20, gold: 8 }),
  (habit) => habit.type === 'counter' || habit.type === 'reading'
    ? { kind: 'progress', habitId: habit.id, target: Math.max(5, Math.round((habit.target || 10) * 0.6)),
        text: `Log ${Math.max(5, Math.round((habit.target || 10) * 0.6))} on “${habit.title}”`, xp: 30, gold: 12 }
    : null,
  (habit) => habit.type === 'workout'
    ? { kind: 'minutes', habitId: habit.id, target: Math.max(10, Math.round((habit.duration || 20) / 2)),
        text: `Exercise ${Math.max(10, Math.round((habit.duration || 20) / 2))} min on “${habit.title}”`, xp: 35, gold: 15 }
    : null,
];

export function ensureQuestsForToday() {
  const s = getState();
  const today = todayStr();
  if (s.quests.date === today && s.quests.list.length > 0) return;

  const rnd = seededRandom(seedFromDate(today));
  const pool = [];
  const habits = s.habits.length ? s.habits : [{ id: 'any', title: 'Any habit', type: 'simple' }];
  habits.forEach((h) => {
    TEMPLATES.forEach((tpl) => {
      const q = tpl(h);
      if (q) pool.push(q);
    });
  });
  // shuffle deterministically
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, 3).map((q) => ({ ...q, id: uid(), progress: 0, done: false, claimed: false }));
  update((st) => { st.quests = { date: today, list: picked }; });
}

export function progressQuest(matchFn, amount = 1) {
  update((s) => {
    s.quests.list.forEach((q) => {
      if (!q.done && matchFn(q)) {
        q.progress = Math.min(q.target, q.progress + amount);
        if (q.progress >= q.target) q.done = true;
      }
    });
  });
}

export function claimQuest(questId) {
  const s = getState();
  const q = s.quests.list.find((x) => x.id === questId);
  if (!q || !q.done || q.claimed) return false;
  update((st) => {
    const sq = st.quests.list.find((x) => x.id === questId);
    if (sq) sq.claimed = true;
  });
  addXp(q.xp);
  addGold(q.gold);
  update((st) => { st.questsClaimed = (st.questsClaimed || 0) + 1; });
  evaluateAchievements();
  return true;
}
