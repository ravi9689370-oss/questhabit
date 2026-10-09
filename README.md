# QuestHabit ⚔️

**Your habits. Your quest. Level up your life.**

An offline-first RPG habit tracker built with Vite + Capacitor. Complete real-life habits (workouts, reading, water, meditation), earn XP and gold, level up your hero, and defeat story bosses in turn-based battles. Miss a habit — the boss strikes back.

## ✨ Features

- 🎮 **Full RPG loop** — XP, levels, gold, stats (Strength / Intelligence / Agility / Stamina)
- 🏋️ **Animated workout sessions** — animated exercise figure, rep counter, rest timers, calorie/XP tracking
- 🐉 **Turn-based boss battles** — 5 story chapters, animated attacks, damage floats
- 📜 **Daily quests** — deterministically generated, reset every midnight
- 🛍️ **Shop & inventory** — weapons, armour, pets, skins (all original SVG art)
- 🏆 **12 achievements** + calendar heatmap + weekly charts
- 🌗 **Light + dark theme** · 🌐 **English + Hindi**
- 📴 **100% offline** — all data in IndexedDB, no account, no tracking
- 💎 **Premium** via Google Play Billing (Android) · rewarded ads via AdMob (Android)

## 🚀 Run locally

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview    # preview production build
```

## 📱 Android (Capacitor)

```bash
npm run build:android   # build web + sync capacitor config
npx cap add android     # first time only
npx cap open android    # open in Android Studio, run on device
```

Debug APK is also built automatically by GitHub Actions (`.github/workflows/android.yml`) and uploaded as an artifact named `app-debug-apk`.

## 🌐 GitHub Pages

Push to `main` → `.github/workflows/pages.yml` builds and deploys to:

**https://ravi9689370-oss.github.io/questhabit/**

(Enable Pages once in repo Settings → Pages → Source: GitHub Actions.)

## 🏗️ Project structure

```
src/
├── config.js          # single source of truth (app name, version)
├── main.js            # bootstrap, router, tab bar
├── router.js          # hash router with onboarding guard
├── store.js           # central state + pub/sub
├── db.js              # IndexedDB persistence
├── i18n.js            # English + Hindi
├── theme.js           # light/dark/system
├── platform.js        # native/web detection
├── ads.js             # AdMob rewarded ads (Android)
├── billing.js         # Play Billing premium (Android)
├── game/              # engine, quests, achievements, items, boss
├── ui/                # components, SVG art, charts
└── screens/           # 13 screens
```

## 🔒 Privacy

- No analytics, no trackers, no network calls in the core app
- All data stays on-device (IndexedDB)
- Settings → "Delete all data" wipes everything permanently
- AdMob (Android only) is initialized without tracking authorization

## 📄 License

Original code and original vector art. All rights reserved.
