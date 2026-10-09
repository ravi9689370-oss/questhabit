// Home dashboard: hero card, today's habits, progress ring.
import { getState, update } from '../store.js';
import { t } from '../i18n.js';
import { avatarSVG, HABIT_ICONS } from '../ui/character.js';
import { heatmapSVG } from '../ui/charts.js';
import { toast, confetti, vibrate, confirmDialog, fmtNum } from '../ui/components.js';
import { addXp, addGold, xpForLevel, todayStr, healHero } from '../game/engine.js';
import { progressQuest, ensureQuestsForToday } from '../game/quests.js';
import { evaluateAchievements } from '../game/achievements.js';
import { navigate } from '../router.js';
import { DIFFICULTY, STAT_FOR_TYPE } from '../game/engine.js';
import { bossNextLevel } from '../game/engine.js';

function xpProgress() {
  const s = getState();
  const need = xpForLevel(s.hero.level);
  return { pct: Math.min(100, Math.round((s.hero.xp / need) * 100)), need };
}

function habitDoneToday(habit) {
  const today = todayStr();
  return getState().logs.some((l) => l.habitId === habit.id && l.date === today);
}

export default function render(root) {
  const s = getState();
  ensureQuestsForToday();
  const { pct } = xpProgress();
  const today = todayStr();
  const doneCount = s.habits.filter(habitDoneToday).length;
  const ringPct = s.habits.length ? Math.round((doneCount / s.habits.length) * 100) : 0;
  const R = 34;
  const CIRC = 2 * Math.PI * R;
  const bossLockedLevel = bossNextLevel();

  root.innerHTML = `
  <div class="screen">
    <header class="app-header">
      <div>
        <div class="hello">Namaste, ${escapeHtml(s.profile.name)}</div>
        <div class="date-line">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      </div>
      <div class="header-badges">
        <span class="badge badge-gold" title="Gold">🪙 ${fmtNum(s.hero.gold)}</span>
        <span class="badge badge-xp" title="Level ${s.hero.level}">Lv ${s.hero.level}</span>
      </div>
    </header>

    <section class="hero-card card">
      <div class="hero-card-left">
        <div class="avatar-wrap">${avatarSVG({ heroClass: s.profile.heroClass, color: s.profile.color, size: 92 })}</div>
        <div>
          <div class="hero-name">${escapeHtml(s.profile.name)}</div>
          <div class="hero-class">${t('class_' + s.profile.heroClass)} · ${t('level')} ${s.hero.level}</div>
          <div class="xp-bar"><div class="xp-fill" style="width:${pct}%"></div></div>
          <div class="xp-text">${fmtNum(s.hero.xp)} / ${fmtNum(xpForLevel(s.hero.level))} XP</div>
        </div>
      </div>
      <div class="hero-card-right">
        <div class="hp-row"><span>HP</span>
          <div class="hp-bar"><div class="hp-fill" style="width:${Math.round((s.hero.hp / s.hero.maxHp) * 100)}%"></div></div>
          <span>${s.hero.hp}/${s.hero.maxHp}</span>
        </div>
        <div class="mini-stats">
          <span title="Strength">💪 ${s.hero.stats.str}</span>
          <span title="Intelligence">🧠 ${s.hero.stats.int}</span>
          <span title="Agility">⚡ ${s.hero.stats.agi}</span>
          <span title="Stamina">❤️ ${s.hero.stats.sta}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <h2 data-i18n="today"></h2>
        <span class="progress-ring-wrap">
          <svg viewBox="0 0 84 84" class="progress-ring" role="img" aria-label="${ringPct}%">
            <circle cx="42" cy="42" r="${R}" class="ring-bg" />
            <circle cx="42" cy="42" r="${R}" class="ring-fg" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC * (1 - ringPct / 100)}" />
            <text x="42" y="46" class="ring-text">${ringPct}%</text>
          </svg>
        </span>
      </div>
      ${s.habits.length === 0 ? `
        <div class="empty-state">
          <div class="empty-art">🌟</div>
          <h3 data-i18n="no_habits_title"></h3>
          <p data-i18n="no_habits_body"></p>
          <button class="btn btn-primary" id="btn-add-first" data-i18n="add_habit"></button>
        </div>` : `
        <ul class="habit-list">
          ${s.habits.map((h) => `
            <li class="habit-row ${habitDoneToday(h) ? 'done' : ''}" data-id="${h.id}">
              <span class="habit-icon">${HABIT_ICONS[h.icon] ?? HABIT_ICONS.custom}</span>
              <div class="habit-info">
                <div class="habit-title">${escapeHtml(h.title)}</div>
                <div class="habit-meta">
                  ${h.type !== 'simple' ? `<span>${t('streak')}: ${h.streak || 0}🔥</span>` : ''}
                  ${h.difficulty ? `<span>${t('difficulty')}: ${t(h.difficulty)}</span>` : ''}
                </div>
              </div>
              ${habitDoneToday(h)
                ? `<span class="done-check" aria-label="done">✔</span>`
                : h.type === 'workout'
                  ? `<button class="btn btn-primary btn-sm habit-start" data-id="${h.id}" data-i18n="start"></button>`
                  : `<button class="btn btn-primary btn-sm habit-complete" data-id="${h.id}" data-i18n="complete"></button>`}
            </li>`).join('')}
        </ul>`}
    </section>

    <section class="card">
      <div class="card-head"><h2>${new Date().getFullYear()} 📊</h2></div>
      ${heatmapSVG(10)}
    </section>

    ${!s.boss.unlocked && s.hero.level >= bossLockedLevel ? `
      <div class="boss-teaser card" id="boss-teaser">
        <span class="boss-teaser-art">🐉</span>
        <div>
          <strong data-i18n="boss_unlocked"></strong>
          <div class="muted">${t('chapter')} ${s.boss.chapter}</div>
        </div>
        <button class="btn btn-primary" id="btn-go-boss" data-i18n="start"></button>
      </div>` : ''}

    <button class="fab" id="fab-add" aria-label="${t('add_habit')}">＋</button>
  </div>`;

  root.querySelector('#fab-add')?.addEventListener('click', () => navigate('/habit/new'));
  root.querySelector('#btn-add-first')?.addEventListener('click', () => navigate('/habit/new'));
  root.querySelector('#btn-go-boss')?.addEventListener('click', () => navigate('/boss'));

  root.querySelectorAll('.habit-complete').forEach((btn) => {
    btn.addEventListener('click', () => completeHabit(btn.dataset.id));
  });

  root.querySelectorAll('.habit-start').forEach((btn) => {
    btn.addEventListener('click', () => navigate('/workout/' + btn.dataset.id));
  });

  root.querySelectorAll('.habit-row').forEach((row) => {
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const id = row.dataset.id;
      confirmDialog('Habit', t('delete_confirm'), () => {
        update((st) => {
          st.habits = st.habits.filter((h) => h.id !== id);
          st.logs = st.logs.filter((l) => l.habitId !== id);
        });
        toast('Habit deleted');
        render(root);
      });
    });
  });

  function completeHabit(id) {
    const habit = getState().habits.find((h) => h.id === id);
    if (!habit || habitDoneToday(habit)) return;
    const diff = DIFFICULTY[habit.difficulty || 'easy'];
    const statKey = STAT_FOR_TYPE[habit.type] ?? 'sta';
    const leveled = addXp(diff.xp);
    addGold(diff.gold);
    update((st) => {
      const h = st.habits.find((x) => x.id === id);
      h.streak = (h.streak || 0) + 1;
      h.lastDone = Date.now();
      st.logs.push({ id: 'log' + Date.now(), habitId: id, date: todayStr(), value: 1, completedAt: Date.now() });
      st.hero.stats[statKey] += 1;
      st.hero.totalHabitsDone += 1;
    });
    progressQuest((q) => q.habitId === id && q.kind === 'complete', 1);
    progressQuest((q) => q.habitId === id && (q.kind === 'progress' || q.kind === 'minutes'), habit.type === 'counter' || habit.type === 'reading' ? (habit.target || 1) : (habit.duration || 20));
    const newAch = evaluateAchievements();
    confetti();
    vibrate([20, 40, 20]);
    toast(`${t('xp_earned')}: +${diff.xp} · ${t('gold_earned')}: +${diff.gold}`, 'success');
    if (leveled) toast(`Level up! Lv ${getState().hero.level}`, 'success');
    newAch.forEach((k) => toast(`🏆 Achievement unlocked`, 'success'));
    render(root);
  }

  return () => { /* cleanup */ };
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
