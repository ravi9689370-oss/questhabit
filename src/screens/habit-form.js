// Habit add / edit form with full validation.
import { getState, update, save } from '../store.js';
import { t } from '../i18n.js';
import { toast } from '../ui/components.js';
import { navigate } from '../router.js';
import { uid, todayStr } from '../game/engine.js';
import { HABIT_ICONS } from '../ui/character.js';

const ICON_KEYS = Object.keys(HABIT_ICONS);

export default function render(root, path) {
  const editId = path.startsWith('/habit/edit/') ? path.split('/')[3] : null;
  const existing = editId ? getState().habits.find((h) => h.id === editId) : null;

  const form = {
    title: existing?.title ?? '',
    type: existing?.type ?? 'simple',
    icon: existing?.icon ?? 'custom',
    difficulty: existing?.difficulty ?? 'easy',
    frequency: existing?.frequency ?? 'daily',
    duration: existing?.duration ?? 20,
    target: existing?.target ?? 10,
  };

  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">← <span data-i18n="back"></span></button>
      <h2>${existing ? t('edit') : t('add_habit')}</h2>
      <span></span>
    </header>

    <div class="card form-card">
      <label class="field">
        <span data-i18n="habit_title"></span>
        <input id="f-title" type="text" maxlength="40" value="${escapeAttr(form.title)}" data-i18n-ph="habit_title" />
      </label>
      <div class="field-error" id="err-title" hidden></div>

      <div class="field">
        <span data-i18n="habit_type"></span>
        <div class="chip-row" id="f-type">
          ${[['simple', 'type_simple'], ['workout', 'type_workout'], ['counter', 'type_counter'], ['reading', 'type_reading']]
            .map(([v, k]) => `<button class="chip ${form.type === v ? 'selected' : ''}" data-value="${v}">${t(k)}</button>`).join('')}
        </div>
      </div>

      <div class="field">
        <span data-i18n="difficulty"></span>
        <div class="chip-row" id="f-difficulty">
          ${['easy', 'medium', 'hard'].map((v) => `<button class="chip ${form.difficulty === v ? 'selected' : ''}" data-value="${v}">${t(v)}</button>`).join('')}
        </div>
      </div>

      <div class="field" id="field-duration" ${form.type === 'workout' ? '' : 'hidden'}>
        <span>${t('duration_min')}: <b id="duration-val">${form.duration}</b></span>
        <input id="f-duration" type="range" min="5" max="60" step="5" value="${form.duration}" />
      </div>

      <div class="field" id="field-target" ${form.type === 'counter' || form.type === 'reading' ? '' : 'hidden'}>
        <span>${t('target')}: <b id="target-val">${form.target}</b></span>
        <input id="f-target" type="range" min="1" max="100" step="1" value="${form.target}" />
      </div>

      <div class="field">
        <span data-i18n="frequency"></span>
        <div class="chip-row" id="f-frequency">
          ${[['daily', 'daily'], ['weekdays', 'weekdays'], ['weekends', 'weekends']]
            .map(([v, k]) => `<button class="chip ${form.frequency === v ? 'selected' : ''}" data-value="${v}">${t(k)}</button>`).join('')}
        </div>
      </div>

      <div class="field">
        <span>Icon</span>
        <div class="icon-row" id="f-icon">
          ${ICON_KEYS.map((k) => `<button class="icon-chip ${form.icon === k ? 'selected' : ''}" data-value="${k}">${HABIT_ICONS[k]}</button>`).join('')}
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-ghost" id="btn-cancel" data-i18n="cancel"></button>
        <button class="btn btn-primary" id="btn-save" data-i18n="save"></button>
      </div>
    </div>
  </div>`;

  const $ = (id) => root.querySelector('#' + id);

  function bindChips(id, key) {
    $(id).querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $(id).querySelectorAll('.chip').forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        form[key] = chip.dataset.value;
        refreshConditional();
      });
    });
  }

  function refreshConditional() {
    $('field-duration').hidden = form.type !== 'workout';
    $('field-target').hidden = !(form.type === 'counter' || form.type === 'reading');
  }

  bindChips('f-type', 'type');
  bindChips('f-difficulty', 'difficulty');
  bindChips('f-frequency', 'frequency');

  $('f-duration').addEventListener('input', (e) => {
    form.duration = Number(e.target.value);
    $('duration-val').textContent = form.duration;
  });
  $('f-target').addEventListener('input', (e) => {
    form.target = Number(e.target.value);
    $('target-val').textContent = form.target;
  });
  $('f-icon').querySelectorAll('.icon-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      $('f-icon').querySelectorAll('.icon-chip').forEach((c) => c.classList.remove('selected'));
      chip.classList.add('selected');
      form.icon = chip.dataset.value;
    });
  });

  $('btn-back').addEventListener('click', () => navigate('/home'));
  $('btn-cancel').addEventListener('click', () => navigate('/home'));

  $('btn-save').addEventListener('click', () => {
    const title = $('f-title').value.trim();
    const err = $('err-title');
    if (title.length < 2) {
      err.hidden = false;
      err.textContent = 'Title must be at least 2 characters.';
      return;
    }
    err.hidden = true;

    update((s) => {
      if (existing) {
        const h = s.habits.find((x) => x.id === editId);
        Object.assign(h, { title, type: form.type, icon: form.icon, difficulty: form.difficulty, frequency: form.frequency, duration: form.duration, target: form.target });
      } else {
        s.habits.push({
          id: uid(), title, type: form.type, icon: form.icon,
          difficulty: form.difficulty, frequency: form.frequency,
          duration: form.duration, target: form.target,
          streak: 0, createdAt: Date.now(), lastDone: null,
        });
      }
    });
    save();
    toast(existing ? 'Habit saved' : 'Habit added!', 'success');
    navigate('/home');
  });

  return () => { /* cleanup */ };
}

function escapeAttr(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
