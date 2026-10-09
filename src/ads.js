// AdMob wrapper. Real rewarded ads on Android; honest no-op on web.
// Static import so the plugin's native bridge is bundled for Android.
import { AdMob } from '@capacitor-community/admob';
import { isNative } from './platform.js';

// Replace with YOUR AdMob rewarded ad unit id before release.
const REWARDED_UNIT_ID = 'ca-app-pub-3940256099942544/5224354917'; // Google test unit
let initialized = false;

async function ensureInit() {
  if (initialized) return true;
  try {
    await AdMob.initialize({ requestTrackingAuthorization: false });
    initialized = true;
    return true;
  } catch (e) {
    console.warn('AdMob init failed', e);
    return false;
  }
}

// Shows a rewarded ad; resolves { ok: true } only when the reward is earned.
export async function showRewardedAd() {
  if (!isNative()) return { ok: false, reason: 'web' };
  try {
    if (!(await ensureInit())) return { ok: false, reason: 'init-failed' };

    await AdMob.loadRewardedAd({ adUnitId: REWARDED_UNIT_ID });

    const earned = await new Promise((resolve) => {
      let done = false;
      let listenPromise;
      const cleanup = () => {
        clearTimeout(timer);
        Promise.resolve(listenPromise).then((h) => {
          try { h?.remove?.(); } catch (e) { /* noop */ }
        }).catch(() => {});
      };
      listenPromise = AdMob.addListener('rewardedAdEarned', () => {
        if (!done) { done = true; cleanup(); resolve(true); }
      });
      const timer = setTimeout(() => {
        if (!done) { done = true; cleanup(); resolve(false); }
      }, 60000);
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
