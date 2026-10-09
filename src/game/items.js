// Shop items catalog. Original items, SVG-rendered icons (see ui/character.js).
import { getState, update } from '../store.js';
import { spendGold } from './engine.js';

export const ITEM_CATALOG = [
  { id: 'w1', name: 'Training Stick', kind: 'weapon', power: 2, price: 60, icon: 'stick' },
  { id: 'w2', name: 'Iron Sword', kind: 'weapon', power: 6, price: 180, icon: 'sword' },
  { id: 'w3', name: 'Flame Staff', kind: 'weapon', power: 12, price: 420, icon: 'staff' },
  { id: 'w4', name: 'Storm Bow', kind: 'weapon', power: 20, price: 900, icon: 'bow' },
  { id: 'a1', name: 'Leather Armour', kind: 'armour', power: 3, price: 120, icon: 'armour' },
  { id: 'a2', name: 'Knight Plate', kind: 'armour', power: 8, price: 380, icon: 'plate' },
  { id: 'p1', name: 'Mochi Pet', kind: 'pet', power: 1, price: 150, icon: 'pet' },
  { id: 'p2', name: 'Ember Fox', kind: 'pet', power: 3, price: 500, icon: 'fox' },
  { id: 's1', name: 'Golden Aura', kind: 'skin', power: 0, price: 300, icon: 'aura' },
  { id: 's2', name: 'Shadow Skin', kind: 'skin', power: 0, price: 450, icon: 'shadow' },
];

export function initItems() {
  const s = getState();
  if (s.items.length > 0) return;
  update((st) => {
    st.items = ITEM_CATALOG.map((i) => ({ ...i, owned: false, equipped: false }));
  });
}

export function buyItem(itemId) {
  const item = getState().items.find((i) => i.id === itemId);
  if (!item || item.owned) return { ok: false, reason: 'owned' };
  if (!spendGold(item.price)) return { ok: false, reason: 'gold' };
  update((st) => {
    const it = st.items.find((i) => i.id === itemId);
    it.owned = true;
  });
  return { ok: true };
}

export function equipItem(itemId) {
  const item = getState().items.find((i) => i.id === itemId);
  if (!item || !item.owned) return;
  update((st) => {
    st.items.forEach((i) => {
      if (i.kind === item.kind) i.equipped = i.id === itemId;
    });
  });
}

export function equippedOf(kind) {
  return getState().items.find((i) => i.kind === kind && i.equipped) || null;
}

export function totalItemPower() {
  return getState().items
    .filter((i) => i.owned && i.equipped && i.kind !== 'pet' && i.kind !== 'skin')
    .reduce((sum, i) => sum + (i.power || 0), 0);
}
