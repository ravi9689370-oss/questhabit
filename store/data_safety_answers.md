# Data Safety — exact answers (based on real code)

**App type:** Game (health/fitness habit tracker)

## Data collected (check all that apply)

✅ **Personal info → Name** — hero display name (user-chosen, stored locally only)

✅ **App activity** — habit completions, workout history, game progress (stored locally only)

✅ **App info and performance** — crash data: NONE (no crash SDK). Device IDs: NONE.

Everything above is **stored only on the device** (IndexedDB/localStorage).

## Data shared

✅ **Device or other IDs** (only if user watches a rewarded ad → AdMob may collect advertising ID per Google's ad policies)

That's it. No location, no personal info shared, no analytics SDK.

## Security practices

✅ Data is encrypted in transit — N/A (app makes no data-transport calls in core; only Google Play Billing / AdMob SDK connections use HTTPS)
✅ You can request that data is deleted — YES: Settings → Delete all data wipes all local data immediately
✅ Data is deleted upon uninstall — YES

## "Is data sold / transferred outside the developer's country?"

No — core app has no data transfer. AdMob/Billing operate per Google's policies.

## Summary answer (copy-paste into Data Safety form)

- Collected: name (user-chosen), app activity — **device-only**
- Shared: device/advertising ID (only via optional AdMob rewarded ads)
- Deletion: in-app Settings wipe + uninstall
- No analytics, no crash reporting, no trackers
