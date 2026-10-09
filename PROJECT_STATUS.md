# PROJECT_STATUS — QuestHabit

_Last updated: 2026-10-09_

## ✅ Done

- [x] App concept + feature document (`docs/FEATURES.md`)
- [x] Vite project, `src/config.js` single app-name source
- [x] IndexedDB persistence (offline-first)
- [x] Hash router + onboarding guard
- [x] i18n (English + Hindi), theme (light/dark/system)
- [x] Game engine: XP, levels, gold, stats, boss scaling
- [x] 13 screens: onboarding, home, habit form, workout (animated), boss battle, hero, shop, quests, calendar, settings, premium, about, more
- [x] Workout animations (6 exercises, CSS keyframes, rep counting via animationiteration)
- [x] Daily quests (deterministic per-day generation)
- [x] Shop, inventory, 10 items, equip system
- [x] 12 achievements + evaluation
- [x] Calendar heatmap + weekly bars (SVG)
- [x] AdMob + Play Billing wrappers (Android; honest web fallback)
- [x] Capacitor config + sync script
- [x] CI: GitHub Pages (`pages.yml`) + Android APK artifact (`android.yml`)

## ⏳ Pending (CI / manual)

- [ ] GitHub Actions: Pages deploy + APK artifact (auto-run on push)
- [ ] Enable Pages in repo settings if auto-deploy doesn't trigger
- [ ] Play Console submission pack (`store/`) — done, awaiting your console clicks

## 🔧 Manual steps (only you can do these)

1. Enable GitHub Pages: repo Settings → Pages → Source = **GitHub Actions**
2. Open Play Console, create app, fill store listing from `store/` files
3. Replace AdMob test ad unit id in `src/ads.js` with your real one
4. Create Premium product `questhabit_premium` in Play Console (Managed product)
5. Upload signed AAB (not debug APK) for production release
