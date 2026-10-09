// Achievements registry + evaluation. Original definitions.
import { getState, update } from '../store.js';

export const ACHIEVEMENTS = [
  { key: 'first_habit', icon: '🌱', name: 'First Step', desc: 'Complete your first habit' },
  { key: 'streak_3', icon: '🔥', name: 'Warming Up', desc: 'Reach a 3-day streak' },
  { key: 'streak_7', icon: '⚡', name: 'Unstoppable', desc: 'Reach a 7-day streak' },
  { key: 'level_5', icon: '⭐', name: 'Rising Hero', desc: 'Reach level 5' },
  { key: 'level_10', icon: '🌟', name: 'Local Legend', desc: 'Reach level 10' },
  { key: 'workouts_10', icon: '💪', name: 'Gym Rat', desc: 'Finish 10 workouts' },
  { key: 'gold_100', icon: '💰', name: 'Treasurer', desc: 'Hold 100 gold at once' },
  { key: 'boss_1', icon: '🗡️', name: 'Boss Slayer', desc: 'Defeat your first boss' },
  { key: 'boss_5', icon: '👑', name: 'Dragonbane', desc: 'Defeat 5 bosses' },
  { key: 'perfect_day', icon: '🎯', name: 'Perfect Day', desc: 'Complete all habits in one day' },
  { key: 'quests_5', icon: '📜', name: 'Questor', desc: 'Claim 5 daily quests' },
  { key: 'shop_1', icon: '🛍️', name: 'First Purchase', desc: 'Buy any item' },
];

export function evaluateAchievements() {
  const s = getState();
  const newly = [];
  const grant = (key) => {
    if (!s.achievements[key]) {
      update((st) => { st.achievements[key] = new Date().toISOString(); });
      newly.push(key);
    }
  };

  if (s.hero.totalHabitsDone >= 1) grant('first_habit');
  const bestStreak = Math.max(0, ...s.habits.map((h) => h.streak || 0));
  if (bestStreak >= 3) grant('streak_3');
  if (bestStreak >= 7) grant('streak_7');
  if (s.hero.level >= 5) grant('level_5');
  if (s.hero.level >= 10) grant('level_10');
  if (s.hero.totalWorkouts >= 10) grant('workouts_10');
  if (s.hero.gold >= 100) grant('gold_100');
  if (s.boss.defeated >= 1) grant('boss_1');
  if (s.boss.defeated >= 5) grant('boss_5');
  if ((s.questsClaimed || 0) >= 5) grant('quests_5');
  if (s.items.some((i) => i.owned)) grant('shop_1');

  // perfect day: all today's habits logged
  if (s.habits.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const doneToday = new Set(s.logs.filter((l) => l.date === today).map((l) => l.habitId));
    if (s.habits.every((h) => doneToday.has(h.id))) grant('perfect_day');
  }
  return newly;
}
