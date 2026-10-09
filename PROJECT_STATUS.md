# PROJECT_STATUS — QuestHabit

_Last updated: 2026-10-09_

## ✅ Done & VERIFIED

- [x] Full app source (13 screens, game engine, animations, i18n, themes)
- [x] `npm run build` — clean, zero errors
- [x] All source files pass `node --check`
- [x] Capacitor Android platform added locally
- [x] GitHub repo: **ravi9689370-oss/questhabit** (public)
- [x] GitHub Pages **LIVE**: https://ravi9689370-oss.github.io/questhabit/ (HTTP 200, verified)
- [x] Android debug APK built in CI: **app-debug-apk artifact (8.9 MB)** — verified download
- [x] Play Store submission pack in `store/` (11 files)

## 🔗 Links

- Repo: https://github.com/ravi9689370-oss/questhabit
- Live web app: https://ravi9689370-oss.github.io/questhabit/
- APK artifact: Actions → "Build Android Debug APK" → Artifacts → app-debug-apk

## 🔧 Manual steps (only you can do these)

1. **Play Console** ($25 account) → create app → fill listing from `store/` files
2. **AdMob**: create rewarded ad unit → replace test unit id in `src/ads.js`
3. **Play Console → Products**: create managed product `questhabit_premium`
4. **Closed testing**: new personal accounts need min testers × min days before
   production — verify current numbers at
   https://support.google.com/googleplay/android-developer/answer/9859455
5. **Signed AAB for production** (debug APK is for testing only):
   generate upload keystore, add signing to `android/app/build.gradle`,
   `./gradlew bundleRelease` → upload AAB. **BACK UP keystore + passwords.**
6. App icons/screenshots: generate per `store/graphics_specs.md`

## 📝 Notes

- `@capacitor-community/in-app-purchases` was removed from npm; billing.js loads
  it at runtime only (web build unaffected). Install it locally if you need IAP.
- Local environment: aarch64 with x86_64 Android SDK tools, so the APK could
  not be built locally — CI (ubuntu-latest) builds it correctly.
