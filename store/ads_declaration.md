# Ads Declaration

**Does your app contain ads?** Yes (Android build only; web build has none).

**Ad format:** Rewarded video ads only (AdMob).
**When shown:** Only when the user explicitly chooses a rewarded option (e.g., revive after defeat, double XP). No banner ads, no interstitial ads, no ads in onboarding, no ads in the first-run experience.
**Ad network:** Google AdMob (via @capacitor-community/admob).
**Ad unit:** To be replaced with the developer's real AdMob unit ID in `src/ads.js` (currently Google's test unit).
**User data:** AdMob may collect the advertising ID per Google's ad policies; no personalized-ads setting is enabled by the app beyond AdMob defaults.
**Data Safety impact:** Declare "Device or other IDs" as shared (via ad SDK).
