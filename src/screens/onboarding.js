// Onboarding: 3 slides -> hero creation -> done.
import { getState, update, save } from '../store.js';
import { t, setLang, applyI18n } from '../i18n.js';
import { avatarSVG } from '../ui/character.js';
import { applyTheme } from '../theme.js';
import { navigate } from '../router.js';
import { initItems } from '../game/items.js';
import { ensureQuestsForToday } from '../game/quests.js';

const CLASSES = ['warrior', 'mage', 'archer'];
const CLASS_COLORS = { warrior: '#f87171', mage: '#a78bfa', archer: '#4ade80' };

let step = 0;
let draft = { name: '', heroClass: 'warrior' };

function slideHTML() {
  const slides = [
    { title: t('onboard_title_1'), body: t('onboard_body_1'), art: '🏔️' },
    { title: t('onboard_title_2'), body: t('onboard_body_2'), art: '🐉' },
    { title: t('onboard_title_3'), body: t('onboarding_done'), art: '📴' },
  ];
  const s = slides[step];
  return `
    <div class="onboard-card">
      <div class="onboard-art">${s.art}</div>
      <h1 class="onboard-title">${s.title}</h1>
      <p class="onboard-body">${s.body}</p>
      <div class="dots">${slides.map((_, i) => `<span class="dot ${i === step ? 'active' : ''}"></span>`).join('')}</div>
      <div class="onboard-actions">
        <button class="btn btn-ghost" id="btn-skip" data-i18n="skip"></button>
        <button class="btn btn-primary" id="btn-next">${step === slides.length - 1 ? t('get_started') : '→'}</button>
      </div>
    </div>`;
}

function heroFormHTML() {
  return `
    <div class="onboard-card">
      <div class="avatar-preview" id="avatar-preview">${avatarSVG({ heroClass: draft.heroClass, color: CLASS_COLORS[draft.heroClass], size: 110 })}</div>
      <h1 class="onboard-title">${t('create_hero')}</h1>
      <label class="field">
        <span data-i18n="hero_name"></span>
        <input id="hero-name" type="text" maxlength="18" value="${draft.name}" autocomplete="off" />
      </label>
      <div class="class-picker">
        ${CLASSES.map((c) => `
          <button class="class-btn ${draft.heroClass === c ? 'selected' : ''}" data-class="${c}" style="--class-color:${CLASS_COLORS[c]}">
            <span class="class-icon">${{ warrior: '⚔️', mage: '🔮', archer: '🏹' }[c]}</span>
            <span>${t('class_' + c)}</span>
          </button>`).join('')}
      </div>
      <div class="onboard-actions">
        <button class="btn btn-ghost" id="btn-back">←</button>
        <button class="btn btn-primary" id="btn-create" data-i18n="create_hero"></button>
      </div>
    </div>`;
}

export default function render(root) {
  step = 0;
  draft = { name: '', heroClass: 'warrior' };
  root.innerHTML = `<div class="screen onboard-screen">${slideHTML()}</div>`;
  bind();

  function go(stepHtml) {
    root.querySelector('.screen').innerHTML = stepHtml;
    bind();
  }

  function bind() {
    const skip = document.getElementById('btn-skip');
    if (skip) skip.addEventListener('click', finish);
    const next = document.getElementById('btn-next');
    if (next) next.addEventListener('click', () => {
      step += 1;
      if (step >= 3) return showHeroForm();
      go(slideHTML());
    });
    const back = document.getElementById('btn-back');
    if (back) back.addEventListener('click', () => { step = 2; go(slideHTML()); });
    const create = document.getElementById('btn-create');
    if (create) create.addEventListener('click', finish);
    document.querySelectorAll('.class-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.heroClass = btn.dataset.class;
        document.querySelectorAll('.class-btn').forEach((b) => b.classList.toggle('selected', b === btn));
        const prev = document.getElementById('avatar-preview');
        if (prev) prev.innerHTML = avatarSVG({ heroClass: draft.heroClass, color: CLASS_COLORS[draft.heroClass], size: 110 });
      });
    });
  }

  function showHeroForm() {
    go(heroFormHTML());
    const input = document.getElementById('hero-name');
    if (input) input.focus();
  }

  function finish() {
    const nameInput = document.getElementById('hero-name');
    const name = (nameInput?.value || '').trim() || 'Hero';
    update((s) => {
      s.onboarded = true;
      s.profile = { name, heroClass: draft.heroClass, color: CLASS_COLORS[draft.heroClass], createdAt: Date.now() };
    });
    initItems();
    ensureQuestsForToday();
    save();
    applyTheme();
    navigate('/home');
  }

  return () => { /* cleanup */ };
}
