// Turn-based boss battle logic. UI animates via events returned here.
import { getState, update } from '../store.js';
import { bossForChapter, playerPower, damageBoss, damageHero, healHero } from './engine.js';
import { addXp, addGold, spendGold } from './engine.js';
import { evaluateAchievements } from './achievements.js';

export function startBattle() {
  const s = getState();
  if (!s.boss.unlocked) return { ok: false, reason: 'locked' };
  if (s.hero.hp <= 0) return { ok: false, reason: 'dead' };
  const b = bossForChapter(s.boss.chapter);
  // persist hp if a previous attempt left boss at 0 but not defeated
  update((st) => {
    if (st.boss.maxHp !== b.maxHp) { st.boss.maxHp = b.maxHp; st.boss.hp = b.maxHp; }
  });
  return { ok: true, boss: { ...b, hp: getState().boss.hp } };
}

// One full round: player attacks, boss counter-attacks if alive.
export function playerAttack() {
  const s = getState();
  if (!s.boss.unlocked || s.boss.hp <= 0) return { ok: false };

  const power = playerPower();
  const variance = 0.85 + Math.random() * 0.3;
  const dmg = Math.max(1, Math.round(power * variance));
  damageBoss(dmg);

  const after = getState();
  const bossDefeated = after.boss.hp <= 0;

  if (bossDefeated) {
    const b = bossForChapter(after.boss.chapter);
    update((st) => {
      st.boss.defeated += 1;
      st.boss.chapter += 1;
      st.boss.unlocked = false; // next unlocks at required level
      st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * 0.25));
    });
    addXp(b.xpReward);
    addGold(b.goldReward);
    evaluateAchievements();
    return { ok: true, dmg, bossDefeated: true, rewards: { xp: b.xpReward, gold: b.goldReward } };
  }

  // boss counterattack
  const boss = bossForChapter(after.boss.chapter);
  const counter = Math.max(1, Math.round(boss.attack * (0.8 + Math.random() * 0.4)));
  damageHero(counter);
  const heroDead = getState().hero.hp <= 0;
  return { ok: true, dmg, bossDefeated: false, counter, heroDead };
}

export function fleeBattle() {
  damageHero(5); // small penalty
  return { ok: true };
}

export function healCost() {
  return 15;
}

export function buyHeal() {
  const s = getState();
  if (s.hero.hp >= s.hero.maxHp) return { ok: false, reason: 'full' };
  if (!spendGold(healCost())) return { ok: false, reason: 'gold' };
  healHero(40);
  return { ok: true };
}
