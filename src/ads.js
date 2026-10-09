// AdMob wrapper. Real rewarded ads on Android; honest no-op on web.
// The plugin is loaded at RUNTIME only (variable import + @vite-ignore).
// On Android, install: npm install @capacitor-community/admob
import { isNative } from './platform.js';

const ADMOB_MODULE = '@capacitor-community/admob';
// TODO-free: replace with YOUR AdMob rewarded ad unit id before release.
const REWARDED_UNIT_ID = 'ca-app-pub-3940256099942544/5224354917'; // Google test unit
let admob = null;
let tried = false;

async function loadAdmob() {
  if (!isNative()) return null;
  if (tried) return admob;
  tried = true;
  try {
    const mod = await import(/* @vite-ignore */ ADMOB_MODULE);
    await mod.AdMob.initialize({ requestTrackingAuthorization: false });
    admob = mod;
    return mod;
  } catch (e) {
    console.warn('AdMob plugin not installed — ads disabled', e);
    admob = null;
    return null;
  }
}

// Shows a rewarded ad; resolves { ok: true } only when the reward is earned.
export async function showRewardedAd() {
  const mod = await loadAdmob();
  if (!mod) return { ok: false, reason: 'web' };
  try {
    const { AdMob } = mod;
    await AdMob.loadRewardedAd({ adUnitId: REWARDED_UNIT_ID });

    const earned = await new Promise((resolve) => {
      let done = false;
      const finish = (val) => { if (!done) { done = true; cleanup(); resolve(val); } };
      const listenPromise = AdMob.addListener('rewardedAdEarned', () => finish(true));
      const cleanup = () => {
        clearTimeout(timer);
        Promise.resolve(listenPromise).then((h) => { try { h?.remove?.(); } catch (e) { /* noop */ } }).catch(() => {});
      };
      const timer = setTimeout(() => finish(false), 60000);
    });

    try {
      await AdMob.showRewardedAd({ adUnitId: REWARDED_UNIT_ID });
    } catch (e) {
      // user closed early or ad failed — no reward
    }
    return earned ? { ok: true } : { ok: false, reason: 'no-reward' };
  } catch (e) {
    return { ok: false, reason: 'error' };
  }
}
