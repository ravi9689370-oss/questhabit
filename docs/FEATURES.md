# QuestHabit — Complete Feature & Working Document

> Version: 1.0-draft | Status: PRD-level spec, ready for build

---

## 1. ONE-LINE PITCH

Habits = game quests. Complete real-life tasks (workout, reading, water, meditation) → your RPG character levels up, earns gold, fights bosses. Miss a habit → the boss attacks you.

---

## 2. CORE LOOP (Kaise kaam karega)

```
User habit add karta hai
      ↓
"30 min Workout" assign hota hai → character ko quest milti hai
      ↓
Workout start → ANIMATED TIMER + exercise animation chalta hai
      ↓
Workout complete → ✅ XP + Gold + Combo streak
      ↓
Character level up → equipment unlock → boss fight unlock
      ↓
Boss defeat → rare loot + story progress
      ↓
Habit miss → boss attack → character health girta hai → revive option (rewarded ad)
```

---

## 3. THE WORKOUT FEATURE (Tumhara main sawaal) — DETAILED

### 3.1 Kya hoga jab user "30 min Workout" add karega?

User ek habit create karta hai:
- Name: "30 min Workout"
- Type: **Workout** (special habit type)
- Duration: 30 min
- Difficulty: Easy/Medium/Hard (XP multiplier)

### 3.2 Workout screen mein kya dikhega (ANIMATION full detail)

| Element | Animation / Behavior |
|---|---|
| **Progress ring** | Circular ring bharhta hai 0→100%, smooth 60fps, color green→gold |
| **Exercise character** | Procedurally animated SVG character jo **actual exercises karta hai**: jumping jacks, squats, pushups — CSS keyframe animations, har 20 sec mein exercise change |
| **Rep counter** | "Reps: 12" counter, har rep par bounce animation + haptic tick |
| **Countdown timer** | MM:SS, last 10 sec par pulse + ring red glow |
| **Rest screen** | "Rest 30s" — animated breathing circle (inhale/exhale scale) |
| **Combo bar** | Streak combo x2, x3... fire particles |
| **Level-up popup** | XP bar fill → level-up flash → confetti burst (canvas particles) |
| **Gold fly animation** | +50 gold coins character se top bar ki coin icon tak fly karte hain |

### 3.3 Workout ke baad kya hota hai

1. ✅ Completion screen: stats (duration, reps, calories estimate, XP earned)
2. 🎉 Confetti + character victory animation (arms up)
3. 📊 Weekly heatmap update (calendar par green cell)
4. 🗡️ Boss weakens: "Boss HP -15%" animated damage number
5. 🏆 Achievement unlock toast agar milestone (e.g. "First Workout!")

### 3.4 Kaise banayenge (tech)

- **Pure CSS + SVG animations** (koi Lottie/copyrighted asset nahi) — original procedural
- Canvas confetti engine (khud likha hua, ~100 lines)
- Workout timer: `requestAnimationFrame` + Web Worker for background accuracy
- Haptics: Vibration API (Capacitor native bridge se)
- Exercise library: 12 exercises, har ek ke liye SVG stick-figure keyframes

### 3.5 Edge cases handled

- App background → timer continue (Capacitor background task)
- App close mid-workout → auto-save progress, "Resume workout?" prompt
- 0 min workout → validation error
- Workout without internet → fully offline chalega ✅

---

## 4. FULL FEATURE LIST

### 🔹 Habits (Core)
- Add/edit/delete habit (name, icon, frequency, reminder time, difficulty)
- Habit types: Simple (tap to check), Workout (timed), Counter (rep counting), Reading (pages)
- Daily / weekly / custom schedule
- Streak tracking + freeze tokens (missed day bachane ke liye)
- Habit archive

### 🔹 Character (RPG)
- Character creator: name, class (Warrior/Mage/Archer), color, avatar (procedural SVG)
- Stats: Strength, Intelligence, Agility, Stamina (habit type ke hisaab se grow)
- Level, XP bar, Health
- Equipment: weapons, armour, pets (visual SVG changes)
- Inventory + shop (gold se kharid)

### 🔹 Quests & Bosses
- Daily quests (3 random per day)
- Story chapters: 5 bosses, har boss ke liye power requirement
- Turn-based battle: animated attack, damage numbers, HP bars, victory/defeat screens
- Boss attack karta hai agar habit miss hua

### 🔹 Progress & Stats
- Calendar heatmap (GitHub-style)
- Weekly/monthly charts (XP, habits completed)
- Achievement system (30+ badges)
- Export data (JSON backup/restore)

### 🔹 Social (Local/offline, no server cost)
- Local leaderboard (device par saved friends — self-reported)
- Share card (PNG generate karke share karo)

### 🔹 Settings
- Theme light/dark
- Language (EN/HI)
- Reminder notifications (local, offline)
- Ad preferences, restore purchases
- **Account delete + data wipe** (Play Store mandatory)

### 🔹 Monetization (earning points)
- Rewarded ads: revive, double XP, extra freeze token
- IAP: premium class skins, boss packs, ad-free
- Free limit: 3 habits (premium = unlimited)

---

## 5. SCREENS (14 total)

1. Onboarding (3 slides, skip option)
2. Home Dashboard (character card + today's habits + quick add)
3. Workout Session (animated timer — upar detail)
4. Boss Battle (turn-based)
5. Character / Inventory
6. Shop
7. Quests (daily)
8. Calendar Heatmap
9. Stats & Achievements
10. Habit Add/Edit
11. Settings
12. Premium (IAP) screen
13. About / Help
14. Delete Account confirm

---

## 6. DATA MODEL (local, offline-first)

```
UserProfile { id, name, class, level, xp, gold, hp, stats{}, createdAt }
Habit { id, title, type, icon, schedule, difficulty, reminderTime, streak, createdAt }
HabitLog { habitId, date, value (reps/pages/min), completedAt }
Quest { id, title, rewardXp, rewardGold, expiresAt, done }
Boss { id, chapter, name, hp, maxHp, defeatCount, unlocked }
Item { id, name, type, price, owned, equipped }
Achievement { id, key, unlockedAt }
Settings { theme, lang, adsOptOut, notifications }
```
Storage: **IndexedDB** (via `idb` package) — instant offline, no backend cost.

---

## 7. EARNING STRATEGY (step by step, realistic)

1. **Month 1:** Launch free with rewarded ads (revive + double XP)
2. **Month 2:** Add IAP skins/boss packs → 2-5% conversion
3. **Month 3:** Habit limit → premium unlock ₹299
4. **Ads revenue:** 10k DAU India ≈ ₹25k-60k/month; US users ≈ 3-4x
5. **IAP revenue:** typically 30-50% of ad revenue
6. **Play Console:** $25 one-time fee. New accounts → closed testing (min testers + days — verify current rule before submit)

---

## 8. WHAT WE BUILD FIRST (order)

1. ✅ Vite project + config.js (APP_NAME = "QuestHabit")
2. IndexedDB layer + state store
3. Home dashboard + habit CRUD
4. Workout session + animations
5. Character + XP/gold system
6. Boss battle
7. Shop + IAP + AdMob
8. Settings + delete account
9. Capacitor + workflows (pages.yml, android.yml)
10. Play Store pack (store/ folder)

---

*Next: agar confirm karo, main Step 1 se build shuru karta hoon — full source, git push, GitHub Pages link, aur APK artifact workflow tak.*
