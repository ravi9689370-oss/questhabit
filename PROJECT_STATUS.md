# PROJECT_STATUS — QuestHabit

_Last updated: 2026-10-09_

## ✅ Done & VERIFIED

- [x] Full app source (13 screens, game engine, animations, i18n, themes)
- [x] `npm run build` — clean, zero errors
- [x] Headless E2E smoke test — **24/24 checks pass**
      (onboarding → hero → habit CRUD → animated workout with
      rep counting → boss → shop → quests → screenshots)
- [x] GitHub repo: **ravi9689370-oss/questhabit** (public)
- [x] GitHub Pages **LIVE**: https://ravi9689370-oss.github.io/questhabit/ (HTTP 200)
- [x] Android debug APK built in CI: **app-debug-apk (8.3 MB)** — verified
- [x] **Custom adaptive app icon inside APK** (all densities, byte-match verified)
- [x] Play Store pack in `store/` (listing, privacy policy md+html, data safety,
      ratings, audience, ads, access, declarations, graphics specs, console
      checklist) + 7 real app screenshots + 512px icon

## 🐛 Bugs found & fixed (2026-10-09/10)

- Router had no `:param` matching → workout screen 404'd (headline feature broken)
- Rest overlay CSS overrode `hidden` → blocked ALL workout button taps
- `data-i18n` never applied after render → buttons/tab labels were empty
- Workout rest/work phase flap created infinite intervals (memory leak)
- Timer showed fractional seconds (`19:55.96`)
- Duplicate `ic_launcher_background` resource broke the Gradle build
- Icon generation wired into CI (`scripts/generate-icons.mjs`)
- Raw APK now attached to GitHub **Release** `debug-apk` (no zip wrapper —
  the zip wrapper was the likely cause of "tap → nothing happens")
- AdMob now statically imported (rewarded ads actually work on Android)
- Boot error boundary: any startup crash now shows a visible message
- **Crash-proof `MainActivity`**: onCreate/onStart/onResume wrapped in
  try/catch → visible error dialog instead of silent force-close
  (`showFatalError` verified inside APK classes13.dex)
- **Release signing**: ephemeral CI test keystore via keytool
  (fixes `validateSigningRelease` "debug.keystore not found")
- **R8/ProGuard**: `minifyEnabled` + `shrinkResources` explicitly false
  for BOTH debug and release; keep-rules added for Capacitor/plugins/AdMob
- **JDK 21 required** for Capacitor 8.x (JDK 17 → "invalid source release: 21")
- `onResume`/`onStart` must be `public` (BridgeActivity visibility)
- Web bundle failure → visible red error overlay (index.html)

## 📊 CI (both APKs)

- `assembleDebug` → artifact `app-debug-apk` + Release `debug-apk`
- `assembleRelease` → artifact `app-release-apk` (6.7 MB)
- JDK: zulu 21 · Gradle cache · icons generated in CI

## 🔗 Links

- Repo: https://github.com/ravi9689370-oss/questhabit
- Live web app: https://ravi9689370-oss.github.io/questhabit/
- **APK (direct download, no zip):**
  https://github.com/ravi9689370-oss/questhabit/releases/download/debug-apk/app-debug.apk
- APK artifacts: Actions → "Build Android APKs" → app-debug-apk / app-release-apk

## 📲 Install on phone (if app "removes itself" / won't open)

1. Use the **Release link above** — NOT the Actions artifact (that's a zip)
2. Allow **Install from unknown sources** when Android asks
3. **Uninstall any old QuestHabit debug build first** (signature conflict
   shows as "App not installed" / instant close)
4. If it still closes instantly: which phone/Android version? The app
   needs Android 8+ (WebView 100+). Now has a visible boot error screen
   — screenshot the message if it appears.

## 🔧 Manual steps (only you can do these)

1. **Play Console** ($25 account) → create app → fill listing from `store/` files
2. **AdMob**: create rewarded ad unit → replace test unit id in `src/ads.js`
3. **Play Console → Products**: create managed product `questhabit_premium`
4. **Closed testing**: new personal accounts need min testers × min days before
   production — verify current numbers at
   https://support.google.com/googleplay/android-developer/answer/9859455
5. **Signed AAB for production** (CI APKs use a throwaway
   test keystore — fine for testing, NOT for Play Store):
   ```
   keytool -genkeypair -v -keystore android/app/release.keystore \
     -alias questhabit -keyalg RSA -keysize 2048 -validity 10000
   # android/key.properties:
   # STORE_FILE=release.keystore
   # STORE_PASSWORD=<pw> / KEY_ALIAS=questhabit / KEY_PASSWORD=<pw>
   # then locally: cd android && ./gradlew bundleRelease
   ```
   **BACK UP release.keystore + key.properties — losing them
   blocks all future updates.**
6. Resize `store/screenshots/*.png` to 1080×1920 for Play Store
   (per `store/graphics_specs.md`)
