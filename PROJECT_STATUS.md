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

## 🐛 Bugs found & fixed (2026-10-09)

- Router had no `:param` matching → workout screen 404'd (headline feature broken)
- Rest overlay CSS overrode `hidden` → blocked ALL workout button taps
- `data-i18n` never applied after render → buttons/tab labels were empty
- Workout rest/work phase flap created infinite intervals (memory leak)
- Timer showed fractional seconds (`19:55.96`)
- Duplicate `ic_launcher_background` resource broke the Gradle build
- Icon generation wired into CI (`scripts/generate-icons.mjs`)

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
6. Resize `store/screenshots/*.png` to 1080×1920 for Play Store
   (per `store/graphics_specs.md`)
