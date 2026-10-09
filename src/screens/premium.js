// Premium screen: honest about platform capabilities.
// Web build: explains Android app unlocks purchases (real billing via Play Billing on Android).
import { t } from '../i18n.js';
import { navigate } from '../router.js';
import { isNative } from '../platform.js';

export default function render(root) {
  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('premium')}</h2>
      <span></span>
    </header>

    <section class="card premium-card">
      <div class="premium-art">💎</div>
      <h2>QuestHabit Premium</h2>
      <p class="muted">${t('premium_body')}</p>
      <ul class="premium-list">
        <li>♾️ Unlimited habits</li>
        <li>🎨 Exclusive hero skins (Golden Aura, Shadow)</li>
        <li>🐉 2x boss gold rewards</li>
        <li>🚫 No ads</li>
        <li>❤️ Support a solo developer</li>
      </ul>
      ${isNative()
        ? `<button class="btn btn-gold btn-lg" id="btn-buy">${t('unlock')} · ₹299 (one-time)</button>`
        : `<div class="web-note">
            <p>📱 ${t('android_only')}</p>
            <p class="muted">Install the APK from the GitHub Actions artifacts to unlock Premium with Google Play Billing.</p>
          </div>`}
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));
  root.querySelector('#btn-buy')?.addEventListener('click', async () => {
    const { purchasePremium } = await import('../billing.js');
    const res = await purchasePremium();
    if (res.ok) {
      root.innerHTML = `<div class="screen center-screen"><div class="done-art">💎</div><h1>Premium unlocked!</h1><button class="btn btn-primary btn-lg" id="btn-home">${t('nav_home')}</button></div>`;
      root.querySelector('#btn-home').addEventListener('click', () => navigate('/home'));
    } else {
      alert(res.reason === 'cancelled' ? 'Purchase cancelled' : 'Purchase failed — check your Play account');
    }
  });
  return () => {};
}
