# PLAY CONSOLE — Click-by-click Checklist

## Prerequisites (one-time, manual)
- [ ] Google Play Developer account — **$25 one-time fee** (https://play.google.com/console)
- [ ] Verify developer identity (Google may ask for ID/phone — new accounts)
- [ ] Wait 24–48h if account is brand new (new account review)

## 1. Create app
1. Play Console → **Create app**
2. Release type: **Production** (you'll still go via testing first)
3. App name: `QuestHabit: Habit RPG Game`
4. Category: **HEALTH_AND_FITNESS** (or GAME → CASUAL)
5. Email: ravi9689370-oss@users.noreply.github.com
6. **Free** app (IAP allowed on free apps)

## 2. App content (left menu → App content)
Order matters — fill all before release:
- [ ] **App access**: paste `store/app_access_instructions.md` content
- [ ] **Privacy policy**: URL — host `store/privacy_policy.html` free at:
      - GitHub Pages: `https://ravi9689370-oss.github.io/questhabit/store/privacy_policy.html` (after Pages is enabled), or
      - any free host (Netlify Drop, etc.)
- [ ] **Ads declaration**: Yes → rewarded video, AdMob (see `store/ads_declaration.md`)
- [ ] **Content rating**: fill IARC questionnaire per `store/content_rating_answers.md` → Everyone
- [ ] **Target audience**: General, not for children under 13 (see `store/target_audience_answers.md`)
- [ ] **Data safety**: per `store/data_safety_answers.md`
- [ ] **Government / health / financial declarations**: all "None" (see `store/health_and_financial_declarations.md`)

## 3. Store listing
- [ ] Title (30 max): `QuestHabit: Habit RPG Game`
- [ ] Short description (80 max): from `store/listing.md`
- [ ] Full description (4000 max): from `store/listing.md`
- [ ] Icon 512×512, Feature graphic 1024×500, 2–8 phone screenshots 9:16
      (generate per `store/graphics_specs.md`)
- [ ] Category + tags + contact email

## 4. Monetization setup (before release)
- [ ] Play Console → Monetize → Products → **Managed products** → create
      product id: `questhabit_premium` (matches `src/billing.js`)
- [ ] Link AdMob account (Monetize → Ads → AdMob) and create rewarded ad unit
- [ ] Replace test ad unit id in `src/ads.js` with your real unit id, rebuild

## 5. Testing requirement (NEW personal accounts — VERIFY CURRENT RULE)
⚠️ Google changes this often. As of 2026, **new personal developer accounts** typically must:
- [ ] Run a **closed test** with a **minimum number of testers (commonly 12–20)**
      for a **minimum period (commonly 14 days)** before production access
- [ ] **Verify the current numbers** at:
      https://support.google.com/googleplay/android-developer/answer/9859455
      (Play Console also shows the exact requirement under Release → Testing)
- [ ] Add tester emails (use your own + a few friends) in
      Play Console → Setup → Testers (closed testing)

## 6. Build & upload
- [ ] **Signed AAB is required for production** (the CI debug APK is for testing only):
      ```
      # on a machine with Android SDK:
      cd android
      ./gradlew bundleRelease   # needs signing config in app/build.gradle
      ```
      (Generate upload keystore first — see README "Release build" below.
      BACK UP the keystore + passwords: losing them blocks updates forever.)
- [ ] Release → Testing → Create closed testing release → upload `app-release.aab`
      → fill release notes (from `store/listing.md`) → Submit
- [ ] After testing period completes: Production → Create release → upload same AAB
      → **Review and send for production review**

## 7. Review
- Typical review time: 1–7 days (first app longer)
- Check Play Console messages; respond fast if asked for clarifications

## Post-launch
- Monitor **Android vitals** (crashes/ANRs) in Play Console
- Reply to reviews
- Updates: bump `version` in `src/config.js` + `versionCode` in
  `android/app/build.gradle` → build new AAB → new release
