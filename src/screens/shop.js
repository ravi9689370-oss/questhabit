// Shop: buy items with gold, equip them.
import { getState } from '../store.js';
import { t } from '../i18n.js';
import { itemIconSVG } from '../ui/character.js';
import { toast, vibrate } from '../ui/components.js';
import { navigate } from '../router.js';
import { buyItem, equipItem } from '../game/items.js';

export default function render(root) {
  const s = getState();
  const kinds = { weapon: 'Weapons', armour: 'Armour', pet: 'Pets', skin: 'Skins' };

  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('shop')}</h2>
      <span class="badge badge-gold">🪙 ${s.hero.gold}</span>
    </header>

    ${Object.entries(kinds).map(([kind, label]) => `
      <section class="card">
        <div class="card-head"><h2>${label}</h2></div>
        <div class="shop-grid">
          ${s.items.filter((i) => i.kind === kind).map((i) => `
            <div class="shop-card ${i.equipped ? 'equipped' : ''}">
              <div class="item-icon">${itemIconSVG(i.icon, 52)}</div>
              <div class="item-name">${i.name}</div>
              ${i.power ? `<div class="item-power">+${i.power} power</div>` : '<div class="item-power muted">cosmetic</div>'}
              ${i.equipped
                ? `<span class="owned-badge">${t('equipped')}</span>`
                : i.owned
                  ? `<button class="btn btn-primary btn-sm" data-equip="${i.id}">${t('equip')}</button>`
                  : `<button class="btn btn-gold btn-sm" data-buy="${i.id}">${t('buy')} · ${i.price} 🪙</button>`}
            </div>`).join('')}
        </div>
      </section>`).join('')}
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));

  root.querySelectorAll('[data-buy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const res = buyItem(btn.dataset.buy);
      if (res.ok) {
        toast('Purchased!', 'success');
        vibrate([20, 30, 20]);
        render(root);
      } else if (res.reason === 'gold') {
        toast(t('not_enough_gold'), 'error');
      }
    });
  });

  root.querySelectorAll('[data-equip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      equipItem(btn.dataset.equip);
      toast('Equipped!', 'success');
      vibrate(15);
      render(root);
    });
  });

  return () => {};
}
