// Game engine: XP, levels, gold, stats, boss logic, rewards.
// Pure functions + state updates. No network. Original logic.
import { update, getState } from '../store.js';

export const DIFFICULTY = {
  easy:   { xp: 15, gold: 5,  mult: 1 },
  medium: { xp: 30, gold: 12, mult: 1.5 },
  hard:   { xp: 55, gold: 22, mult: 2.2 },
};

export const STAT_FOR_TYPE = {
  workout: 'str',
  counter: 'agi',
  reading: 'int',
  simple: 'sta',
};

export function xpForLevel(level) {
  return Math.round(120 * Math.pow(level, 1.35));
}

export function addXp(amount) {
  const before = getState().hero.level;
  update((s) => {
    s.hero.xp += amount;
    let need = xpForLevel(s.hero.level);
    while (s.hero.xp >= need) {
      s.hero.xp -= need;
      s.hero.level += 1;
      s.hero.maxHp += 10;
      s.hero.hp = Math.min(s.hero.maxHp, s.hero.hp + 25);
      s.hero.gold += 20 * s.hero.level;
      need = xpForLevel(s.hero.level);
    }
  });
  return getState().hero.level > before;
}

export function addGold(amount) {
  update((s) => { s.hero.gold += amount; });
}

export function spendGold(amount) {
  const s = getState();
  if (s.hero.gold < amount) return false;
  update((st) => { st.hero.gold -= amount; });
  return true;
}

export function playerPower() {
  const s = getState();
  const statSum = s.hero.stats.str + s.hero.stats.int + s.hero.stats.agi + s.hero.stats.sta;
  const weapon = s.items.find((i) => i.kind === 'weapon' && i.equipped);
  const weaponBonus = weapon ? weapon.power : 0;
  return Math.round(s.hero.level * 4 + statSum * 1.5 + weaponBonus);
}

export function bossForChapter(chapter) {
  const names = [
    { name: 'Sloth Goblin', hp: 60 },
    { name: 'Procrastination Ogre', hp: 140 },
    { name: 'Doubt Serpent', hp: 280 },
    { name: 'Chaos Drake', hp: 520 },
    { name: 'Apathy Titan', hp: 900 },
  ];
  const base = names[Math.min(chapter - 1, names.length - 1)];
  const scaling = 1 + (chapter - 1) * 0.35;
  return {
    chapter,
    name: base.name,
    maxHp: Math.round(base.hp * scaling),
    attack: Math.round(6 + chapter * 4),
    goldReward: 40 * chapter + 20,
    xpReward: 50 * chapter + 30,
  };
}

export function unlockBoss() {
  update((s) => {
    if (!s.boss.unlocked) {
      const b = bossForChapter(s.boss.chapter);
      s.boss.unlocked = true;
      s.boss.maxHp = b.maxHp;
      s.boss.hp = b.maxHp;
    }
  });
}

export function bossNextLevel() {
  return 2 + getState().boss.chapter;
}

export function damageBoss(dmg) {
  update((s) => {
    s.boss.hp = Math.max(0, s.boss.hp - dmg);
  });
}

export function damageHero(dmg) {
  update((s) => {
    s.hero.hp = Math.max(0, s.hero.hp - dmg);
  });
}

export function healHero(amount) {
  update((s) => {
    s.hero.hp = Math.min(s.hero.maxHp, s.hero.hp + amount);
  });
}

export function reviveHero() {
  update((s) => {
    s.hero.hp = Math.round(s.hero.maxHp * 0.5);
  });
}

export function addFreeze() {
  update((s) => { s.freezes += 1; });
}

export function useFreeze() {
  const s = getState();
  if (s.freezes <= 0) return false;
  update((st) => { st.freezes -= 1; });
  return true;
}

export function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
