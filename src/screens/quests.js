// Daily quests screen with claim rewards.
import { getState } from '../store.js';
import { t } from '../i18n.js';
import { toast, vibrate } from '../ui/components.js';
import { navigate } from '../router.js';
import { claimQuest, ensureQuestsForToday } from '../game/quests.js';
import { evaluateAchievements } from '../game/achievements.js';

export default function render(root) {
  ensureQuestsForToday();
  const s = getState();

  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('quests')}</h2>
      <span class="badge badge-gold">🪙 ${s.hero.gold}</span>
    </header>

    <section class="card">
      <p class="muted">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <ul class="quest-list">
        ${s.quests.list.map((q) => `
          <li class="quest-row ${q.claimed ? 'claimed' : q.done ? 'done' : ''}">
            <div class="quest-icon">${q.done ? '✅' : '📜'}</div>
            <div class="quest-info">
              <div class="quest-text">${escapeHtml(q.text)}</div>
              <div class="quest-progress">
                <div class="quest-bar"><div class="quest-fill" style="width:${Math.round((q.progress / q.target) * 100)}%"></div></div>
                <span>${q.progress}/${q.target}</span>
              </div>
              <div class="quest-reward">+${q.xp} XP · +${q.gold} 🪙</div>
            </div>
            ${q.claimed
              ? `<span class="owned-badge">${t('quest_done')}</span>`
              : q.done
                ? `<button class="btn btn-primary btn-sm" data-claim="${q.id}">${t('quest_claim')}</button>`
                : `<span class="muted">…</span>`}
          </li>`).join('')}
      </ul>
    </section>

    <section class="card tip-card">
      <div class="tip-art">💡</div>
      <p>Quests reset daily at midnight. Complete habits to push quest progress automatically.</p>
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));

  root.querySelectorAll('[data-claim]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (claimQuest(btn.dataset.claim)) {
        evaluateAchievements();
        toast(`Quest claimed! +XP +Gold`, 'success');
        vibrate([20, 40, 20]);
        render(root);
      }
    });
  });

  return () => {};
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
