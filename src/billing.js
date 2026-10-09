// In-App Purchases wrapper.
// The plugin is loaded at RUNTIME only (variable import + @vite-ignore),
// so the web build never depends on it. On Android, install the plugin:
//   npm install @capacitor-community/in-app-purchases
// (or @revenuecat/purchases-capacitor) and this module will pick it up.
import { isNative } from './platform.js';

const PREMIUM_ID = 'questhabit_premium';
const IAP_MODULE = '@capacitor-community/in-app-purchases';
let iap = null;
let iapTried = false;

async function loadIap() {
  if (!isNative()) return null;
  if (iapTried) return iap;
  iapTried = true;
  try {
    const mod = await import(/* @vite-ignore */ IAP_MODULE);
    const { IAP } = mod;
    await IAP.init({ handleConsume: true });
    iap = mod;
    return mod;
  } catch (e) {
    console.warn('IAP plugin not installed — purchases disabled', e);
    iap = null;
    return null;
  }
}

export async function purchasePremium() {
  const mod = await loadIap();
  if (!mod) return { ok: false, reason: 'web' };
  try {
    const { IAP } = mod;
    await IAP.getProducts({ productIds: [PREMIUM_ID] });

    const result = await new Promise((resolve) => {
      let settled = false;
      let sub, fail;
      const cleanup = () => {
        clearTimeout(timer);
        try { sub?.unsubscribe?.(); } catch (e) { /* noop */ }
        try { fail?.unsubscribe?.(); } catch (e) { /* noop */ }
      };
      sub = IAP.purchaseUpdated().subscribe((data) => {
        const list = Array.isArray(data) ? data : [data];
        if (list.some((p) => p?.productId === PREMIUM_ID)) {
          if (!settled) { settled = true; cleanup(); resolve({ ok: true }); }
        }
      });
      fail = IAP.purchaseFailed().subscribe(() => {
        if (!settled) { settled = true; cleanup(); resolve({ ok: false, reason: 'failed' }); }
      });
      const timer = setTimeout(() => {
        if (!settled) { settled = true; cleanup(); resolve({ ok: false, reason: 'timeout' }); }
      }, 60000);
    });

    if (result.ok) {
      try { await IAP.consume({ productId: PREMIUM_ID }); } catch (e) { /* non-critical */ }
      markPremium();
    }
    return result;
  } catch (e) {
    return { ok: false, reason: 'error' };
  }
}

function markPremium() {
  try { localStorage.setItem('questhabit_premium', '1'); } catch (e) { /* noop */ }
}

export function isPremium() {
  try { return localStorage.getItem('questhabit_premium') === '1'; } catch (e) { return false; }
}
