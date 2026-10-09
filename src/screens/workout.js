// Workout session: animated timer, exercise figure, reps, rest, rewards.
// Fully offline; uses rAF + animationiteration for rep counting.
import { getState, update, save } from '../store.js';
import { t } from '../i18n.js';
import { exerciseSVG, EXERCISES } from '../ui/character.js';
import { toast, confetti, vibrate } from '../ui/components.js';
import { navigate } from '../router.js';
import { addXp, addGold, xpForLevel, todayStr, damageBoss, DIFFICULTY, STAT_FOR_TYPE } from '../game/engine.js';
import { progressQuest, ensureQuestsForToday } from '../game/quests.js';
import { evaluateAchievements } from '../game/achievements.js';

const WORK_SECONDS = 45;
const REST_SECONDS = 15;

export default function render(root, path) {
  const habitId = path.split('/')[2];
  const habit = getState().habits.find((h) => h.id === habitId);
  if (!habit) { navigate('/home'); return () => {}; }

  const totalSeconds = Math.max(60, habit.duration * 60);
  let remaining = totalSeconds;
  let running = false;
  let finished = false;
  let phase = 'work'; // 'work' | 'rest'
  let exIndex = 0;
  let reps = 0;
  let rafId = null;
  let lastTick = 0;
  let intervalTimer = null;
  const startTime = Date.now();

  root.innerHTML = `
  <div class="screen workout-screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-exit">✕</button>
      <h2>${habit.title}</h2>
      <span class="badge badge-gold">🪙 <span id="w-gold">0</span></span>
    </header>

    <div class="workout-stage">
      <div class="timer-ring-wrap">
        <svg viewBox="0 0 200 200" class="timer-ring" role="img" aria-label="Workout timer">
          <circle cx="100" cy="100" r="86" class="ring-bg big" />
          <circle cx="100" cy="100" r="86" class="ring-fg big" id="timer-arc" />
        </svg>
        <div class="timer-center">
          <div class="timer-text" id="timer-text">${fmtTime(totalSeconds)}</div>
          <div class="timer-phase" id="phase-text">${t('work')} · ${EXERCISES[exIndex].id.replace(/_/g, ' ')}</div>
        </div>
      </div>

      <div class="exercise-figure" id="exercise-figure">${exerciseSVG(EXERCISES[exIndex].id, 170)}</div>

      <div class="workout-stats">
        <div class="wstat"><div class="wstat-num" id="reps-count">0</div><div class="wstat-label" data-i18n="reps"></div></div>
        <div class="wstat"><div class="wstat-num" id="cal-count">0</div><div class="wstat-label" data-i18n="calories"></div></div>
        <div class="wstat"><div class="wstat-num" id="xp-count">0</div><div class="wstat-label" data-i18n="xp"></div></div>
      </div>
    </div>

    <div class="workout-controls">
      <button class="btn btn-primary btn-lg" id="btn-toggle" data-i18n="start"></button>
      <button class="btn btn-ghost" id="btn-finish" data-i18n="finish_early"></button>
    </div>

    <div class="rest-overlay" id="rest-overlay" hidden>
      <div class="rest-circle"><span id="rest-count">${REST_SECONDS}</span></div>
      <div class="rest-label" data-i18n="rest"></div>
    </div>
  </div>`;

  const $ = (id) => root.querySelector('#' + id);
  const CIRC = 2 * Math.PI * 86;
  $('timer-arc').style.strokeDasharray = CIRC;
  $('timer-arc').style.strokeDashoffset = 0;

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateUI() {
    $('timer-text').textContent = fmtTime(remaining);
    $('timer-arc').style.strokeDashoffset = CIRC * (1 - remaining / totalSeconds);
    $('reps-count').textContent = reps;
    const mins = (totalSeconds - remaining) / 60;
    $('cal-count').textContent = Math.round(mins * 8);
    $('xp-count').textContent = Math.round(mins * 4);
  }

  function setPhaseUI() {
    const ex = EXERCISES[exIndex];
    $('phase-text').textContent = phase === 'rest' ? `${t('rest')} ${REST_SECONDS}s` : `${t('work')} · ${ex.id.replace(/_/g, ' ')}`;
    $('exercise-figure').innerHTML = exerciseSVG(ex.id, 170);
    $('rest-overlay').hidden = phase !== 'rest';
    // rep counting via CSS animationiteration on the animated <g>
    const exEl = $('exercise-figure').querySelector('.ex');
    if (exEl && phase === 'work') {
      exEl.addEventListener('animationiteration', () => {
        if (!running || finished) return;
        reps += 1;
        vibrate(10);
        updateUI();
        progressQuest((q) => q.habitId === habitId && q.kind === 'progress', 1);
      });
    }
  }

  function switchPhase() {
    // always clear any running rest timer and reset the work clock
    if (intervalTimer) { clearInterval(intervalTimer); intervalTimer = null; }
    phaseElapsed = 0;

    if (phase === 'work') {
      phase = 'rest';
      let restLeft = REST_SECONDS;
      $('rest-count').textContent = restLeft;
      intervalTimer = setInterval(() => {
        restLeft -= 1;
        const el = document.getElementById('rest-count');
        if (el) el.textContent = Math.max(0, restLeft);
        if (restLeft <= 0) {
          clearInterval(intervalTimer);
          intervalTimer = null;
          exIndex = (exIndex + 1) % EXERCISES.length;
          phase = 'work';
          setPhaseUI();
        }
      }, 1000);
    } else {
      phase = 'work';
    }
    setPhaseUI();
  }

  function tick(now) {
    if (!running || finished) return;
    if (!lastTick) lastTick = now;
    const delta = (now - lastTick) / 1000;
    lastTick = now;
    remaining = Math.max(0, remaining - delta);

    // phase rotation every WORK_SECONDS of accumulated work
    phaseElapsed += delta;
    if (phase === 'work' && phaseElapsed >= WORK_SECONDS) {
      phaseElapsed = 0;
      switchPhase();
    } else if (phase === 'rest') {
      // rest handled by its own interval timer
    }
    updateUI();
    if (remaining <= 0) { finish(); return; }
    rafId = requestAnimationFrame(tick);
  }
  let phaseElapsed = 0;

  $('btn-toggle').addEventListener('click', () => {
    running = !running;
    $('btn-toggle').textContent = running ? t('pause') : t('resume');
    if (running) {
      lastTick = 0;
      rafId = requestAnimationFrame(tick);
      toast(t('workout_started'), 'info');
    } else {
      cancelAnimationFrame(rafId);
      if (intervalTimer) { clearInterval(intervalTimer); intervalTimer = null; }
    }
    setPhaseUI();
  });

  $('btn-finish').addEventListener('click', () => {
    if (finished) return;
    if (running) { cancelAnimationFrame(rafId); if (intervalTimer) clearInterval(intervalTimer); }
    finish();
  });

  $('btn-exit').addEventListener('click', () => {
    if (finished) { navigate('/home'); return; }
    if (running && (totalSeconds - remaining) > 30) {
      if (confirm('Leave workout? Progress so far will be saved.')) {
        cancelAnimationFrame(rafId);
        if (intervalTimer) clearInterval(intervalTimer);
        finish();
      }
    } else {
      cancelAnimationFrame(rafId);
      if (intervalTimer) clearInterval(intervalTimer);
      navigate('/home');
    }
  });

  function finish() {
    if (finished) return;
    finished = true;
    running = false;
    cancelAnimationFrame(rafId);
    if (intervalTimer) clearInterval(intervalTimer);

    const mins = (totalSeconds - remaining) / 60;
    const diff = DIFFICULTY[habit.difficulty || 'easy'];
    const ratio = Math.max(0.05, Math.min(1, mins / Math.max(1, habit.duration)));
    const xpGain = Math.max(1, Math.round(diff.xp * ratio * 2));
    const goldGain = Math.max(1, Math.round(diff.gold * ratio * 2));

    // rewards
    addXp(xpGain);
    addGold(goldGain);
    update((st) => {
      const h = st.habits.find((x) => x.id === habitId);
      h.streak = (h.streak || 0) + 1;
      h.lastDone = Date.now();
      st.logs.push({ id: 'log' + Date.now(), habitId, date: todayStr(), value: Math.round(mins), completedAt: Date.now() });
      st.hero.stats.str += 1;
      st.hero.totalWorkouts += 1;
      st.hero.totalHabitsDone += 1;
    });
    // boss takes damage for every workout
    if (getState().boss.unlocked) damageBoss(10 + getState().hero.level);
    progressQuest((q) => q.habitId === habitId && q.kind === 'minutes', Math.round(mins));
    progressQuest((q) => q.habitId === habitId && q.kind === 'complete', 1);
    const newAch = evaluateAchievements();
    save();

    confetti();
    vibrate([30, 50, 30]);
    root.innerHTML = `
      <div class="screen workout-done">
        <div class="done-art">🏆</div>
        <h1>${t('workout_complete')}</h1>
        <div class="done-stats card">
          <div class="done-row"><span data-i18n="reps"></span><b>${reps}</b></div>
          <div class="done-row"><span>${fmtTime(totalSeconds - remaining)}</span><b>${Math.round(mins * 8)} ${t('calories').toLowerCase()}</b></div>
          <div class="done-row"><span data-i18n="xp_earned"></span><b>+${xpGain}</b></div>
          <div class="done-row"><span data-i18n="gold_earned"></span><b>+${goldGain}</b></div>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-done">${t('complete')} ✔</button>
      </div>`;
    root.querySelector('#btn-done').addEventListener('click', () => navigate('/home'));
    newAch.forEach(() => toast('🏆 Achievement unlocked', 'success'));
  }

  setPhaseUI();
  updateUI();
  return () => { cancelAnimationFrame(rafId); if (intervalTimer) clearInterval(intervalTimer); };
}
