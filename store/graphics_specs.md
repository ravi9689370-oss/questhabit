# Graphic Specs Checklist (Play Store)

## Required assets — how to generate

All assets can be generated with any image editor or an AI image generator from these **original** concepts:

### 1. App icon — 512×512 PNG (32-bit, under 1 MB)
**Concept:** Rounded square, deep navy background (#10131a). Center: a simple gold sword crossed with a green upward arrow (habit growth). Flat vector style, no text. Recognizable at 48dp.

### 2. Feature graphic — 1024×500 PNG
**Concept:** Left: hero avatar (the three class silhouettes: warrior/mage/archer). Center: progress ring + boss dragon silhouette. Right side text: "QuestHabit" + tagline "Your habits. Your quest." Palette: navy bg, green accent (#4ade80), gold (#fbbf24).

### 3. Phone screenshots — 9:16 (min 2, ideally 4–8)
Generate 8 from the real app screens (best: run the app and screenshot, or recreate in Figma):

1. **Home dashboard** — hero card + today's habits + progress ring
   Caption: "Complete habits, earn XP & gold"
2. **Workout session** — animated timer ring + exercise figure
   Caption: "Animated workouts with rep counting"
3. **Boss battle** — vs Sloth Goblin, damage floats
   Caption: "Bosses attack when you slack off!"
4. **Shop** — weapons & armour grid
   Caption: "Spend gold on legendary gear"
5. **Daily quests** — quest cards with progress bars
   Caption: "Fresh quests every day"
6. **Calendar heatmap** — GitHub-style activity
   Caption: "Watch your streaks grow"
7. **Hero inventory** — stats + equipped items
   Caption: "Level up your hero"
8. **Dark mode home** — same as #1 in dark theme
   Caption: "Light & dark mode. 100% offline."

### 4. Tablet screenshots (7-inch & 10-inch)
Only required if the app is tablet-optimized — it is (responsive layout, max-width container). Provide 2 tablet shots of Home + Workout by capturing at tablet resolution.

## Quick capture method
1. `npm run dev` → open in Chrome → DevTools device toolbar → Pixel 7 (9:16)
2. Screenshot each screen; crop to 1080×1920
3. For tablet: toggle to Pixel C / 10.1" profile

## Play Console upload order
Icon → Feature graphic → Screenshots (phone) → Screenshots (tablet, if prompted)
