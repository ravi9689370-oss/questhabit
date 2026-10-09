// Settings: theme, language, notifications, data wipe.
import { getState, update, save, wipeAll } from '../store.js';
import { t, setLang, getLang, LANGUAGES } from '../i18n.js';
import { applyTheme } from '../theme.js';
import { toast, confirmDialog } from '../ui/components.js';
import { navigate } from '../router.js';

export default function render(root) {
  const s = getState();
  const st = s.settings;

  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('settings')}</h2>
      <span></span>
    </header>

    <section class="card">
      <div class="setting-row">
        <span>${t('theme')}</span>
        <div class="chip-row" id="set-theme">
          ${['system', 'light', 'dark'].map((v) => `<button class="chip ${st.theme === v ? 'selected' : ''}" data-value="${v}">${t(v)}</button>`).join('')}
        </div>
      </div>
      <div class="setting-row">
        <span>${t('language')}</span>
        <div class="chip-row" id="set-lang">
          ${Object.entries(LANGUAGES).map(([code, name]) => `<button class="chip ${getLang() === code ? 'selected' : ''}" data-value="${code}">${name}</button>`).join('')}
        </div>
      </div>
      <div class="setting-row">
        <span>${t('notifications')}</span>
        <button class="toggle ${st.notifications ? 'on' : ''}" id="set-notif" role="switch" aria-checked="${st.notifications}">
          <span class="knob"></span>
        </button>
      </div>
    </section>

    <section class="card">
      <div class="setting-row">
        <div>
          <strong>${t('premium')}</strong>
          <div class="muted">${t('premium_body')}</div>
        </div>
        <button class="btn btn-gold" id="btn-premium">${t('unlock')}</button>
      </div>
    </section>

    <section class="card danger-zone">
      <div class="setting-row">
        <div>
          <strong>${t('delete_account')}</strong>
          <div class="muted">${t('delete_confirm')}</div>
        </div>
        <button class="btn btn-danger" id="btn-wipe">🗑</button>
      </div>
    </section>

    <section class="card about-card">
      <div class="muted">QuestHabit v1.0.0 · 100% offline · No trackers · Original code & art</div>
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));

  root.querySelectorAll('#set-theme .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      update((x) => { x.settings.theme = chip.dataset.value; });
      applyTheme();
      save();
      render(root);
    });
  });

  root.querySelectorAll('#set-lang .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      update((x) => { x.settings.lang = chip.dataset.value; });
      setLang(chip.dataset.value);
      save();
      toast('Language saved', 'success');
      render(root);
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const k = el.getAttribute('data-i18n');
        if (k) el.textContent = t(k);
      });
    });
  });

  root.querySelector('#set-notif').addEventListener('click', () => {
    const next = !getState().settings.notifications;
    update((x) => { x.settings.notifications = next; });
    save();
    const btn = root.querySelector('#set-notif');
    btn.classList.toggle('on', next);
    btn.setAttribute('aria-checked', String(next));
    if (next && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    toast(next ? 'Reminders on' : 'Reminders off', 'info');
  });

  root.querySelector('#btn-premium').addEventListener('click', () => navigate('/premium'));

  root.querySelector('#btn-wipe').addEventListener('click', () => {
    confirmDialog(t('delete_account'), `<p>${t('delete_confirm')}</p>`, async () => {
      await wipeAll();
      applyTheme();
      setLang('en');
      toast('All data erased', 'info');
      navigate('/onboarding');
    });
  });

  return () => {};
}
