// About + Help screen.
import { t } from '../i18n.js';
import { APP_NAME, APP_VERSION, APP_TAGLINE, DEVELOPER } from '../config.js';
import { navigate } from '../router.js';

export default function render(root) {
  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('about')}</h2>
      <span></span>
    </header>

    <section class="card about-card">
      <div class="about-logo">⚔️</div>
      <h2>${APP_NAME}</h2>
      <div class="muted">${APP_TAGLINE}</div>
      <div class="muted">v${APP_VERSION}</div>
    </section>

    <section class="card">
      <div class="card-head"><h2>${t('help')}</h2></div>
      <div class="faq">
        <details><summary>How do I earn XP?</summary><p>Complete habits. Harder habits and workouts give more XP. Level up to unlock bosses.</p></details>
        <details><summary>Why did my boss attack me?</summary><p>Missing a habit lets the boss damage your hero. Revive to fight again.</p></details>
        <details><summary>Is my data safe?</summary><p>Everything lives only on your device (IndexedDB). No account, no cloud, no tracking. Deleting data in Settings is permanent.</p></details>
        <details><summary>How does Premium work?</summary><p>One-time purchase via Google Play Billing on Android. Unlocks unlimited habits, skins, and 2x boss gold.</p></details>
        <details><summary>Offline?</summary><p>Yes — the entire game works with airplane mode on.</p></details>
      </div>
    </section>

    <section class="card about-card">
      <div class="muted">Developer: ${DEVELOPER}</div>
      <div class="muted">Made with original code & vector art. No third-party assets.</div>
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));
  return () => {};
}
