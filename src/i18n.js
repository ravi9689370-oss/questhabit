// i18n: English + Hindi. Add languages by extending DICT and calling setLang().
export const LANGUAGES = { en: 'English', hi: 'हिन्दी' };

const DICT = {
  en: {
    app_tagline: 'Your habits. Your quest. Level up your life.',
    nav_home: 'Home', nav_boss: 'Boss', nav_char: 'Hero', nav_shop: 'Shop', nav_more: 'More',
    get_started: 'Get Started', skip: 'Skip',
    onboard_title_1: 'Turn habits into quests',
    onboard_body_1: 'Add daily habits — workouts, reading, water — and earn XP and gold for every completion.',
    onboard_title_2: 'Fight bosses',
    onboard_body_2: 'Level up your hero, unlock story bosses, and defeat them in turn-based battles.',
    onboard_title_3: 'Works offline',
    onboarding_done: 'All data stays on your device. No account needed. No ads tracking you.',
    hero_name: 'Hero name', pick_class: 'Pick your class',
    class_warrior: 'Warrior', class_mage: 'Mage', class_archer: 'Archer',
    create_hero: 'Create Hero',
    today: 'Today', add_habit: '+ Add Habit',
    no_habits_title: 'No habits yet',
    no_habits_body: 'Add your first habit and start your quest!',
    complete: 'Complete', start: 'Start', edit: 'Edit', delete: 'Delete',
    cancel: 'Cancel', save: 'Save', close: 'Close',
    habit_title: 'Habit title', habit_type: 'Type',
    type_simple: 'Simple (tap to check)', type_workout: 'Workout (timed)',
    type_counter: 'Counter (reps/pages)', type_reading: 'Reading (pages)',
    difficulty: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard',
    duration_min: 'Duration (minutes)', target: 'Target',
    frequency: 'Frequency', daily: 'Daily', weekdays: 'Weekdays', weekends: 'Weekends',
    streak: 'Streak', level: 'Level', gold: 'Gold', hp: 'HP', xp: 'XP',
    workout_started: 'Workout started!', workout_complete: 'Workout complete!',
    pause: 'Pause', resume: 'Resume', finish_early: 'Finish early',
    reps: 'Reps', rest: 'Rest', work: 'Work', calories: 'Calories (est.)',
    xp_earned: 'XP earned', gold_earned: 'Gold earned',
    boss_unlocked: 'Boss unlocked!', boss_defeated: 'Boss defeated!',
    attack: 'Attack', flee: 'Flee', victory: 'Victory!', defeated: 'Defeated…',
    your_turn: 'Your turn', boss_turn: 'Boss turn',
    shop: 'Shop', buy: 'Buy', owned: 'Owned', equip: 'Equip', equipped: 'Equipped',
    not_enough_gold: 'Not enough gold!',
    quests: 'Daily Quests', quest_done: 'Claimed', quest_claim: 'Claim',
    achievements: 'Achievements', calendar: 'Calendar', stats: 'Stats',
    settings: 'Settings', theme: 'Theme', light: 'Light', dark: 'Dark', system: 'System',
    language: 'Language', notifications: 'Reminders', delete_account: 'Delete all data',
    delete_confirm: 'This wipes EVERYTHING (habits, hero, gold). This cannot be undone.',
    about: 'About', help: 'Help', premium: 'Premium',
    premium_body: 'Unlock unlimited habits, exclusive hero skins and support the developer.',
    unlock: 'Unlock', android_only: 'Available in the Android app',
    error: 'Something went wrong', offline_ok: 'You are offline — everything still works.',
    freeze: 'Freeze token', revive: 'Revive (ad)', double_xp: '2x XP (ad)',
    total_workouts: 'Total workouts', total_habits: 'Habits completed', best_streak: 'Best streak',
    days: 'days', today_progress: 'Today’s progress', boss_hp: 'Boss HP', your_hp: 'Your HP',
    damage: 'damage', chapter: 'Chapter', next_boss_at: 'Next boss at level',
    back: 'Back', menu: 'Menu', logout_wipe: 'Erase & start over',
  },
  hi: {
    app_tagline: 'आपकी आदतें। आपका क्वेस्ट। ज़िंदगी level up।',
    nav_home: 'होम', nav_boss: 'बॉस', nav_char: 'हीरो', nav_shop: 'दुकान', nav_more: 'और',
    get_started: 'शुरू करें', skip: 'छोड़ें',
    onboard_title_1: 'आदतों को क्वेस्ट बनाएं',
    onboard_body_1: 'दैनिक आदतें जोड़ें — वर्कआउट, पढ़ाई, पानी — और हर completion पर XP व गोल्ड कमाएं।',
    onboard_title_2: 'बॉस से लड़ें',
    onboard_body_2: 'अपने हीरो को level up करें, स्टोरी बॉस अनलॉक करें और turn-based बैटल में हराएं।',
    onboard_title_3: 'ऑफ़लाइन चलता है',
    onboarding_done: 'सारा डेटा आपके फ़ोन पर रहता है। खाता नहीं चाहिए। कोई ट्रैकिंग नहीं।',
    hero_name: 'हीरो का नाम', pick_class: 'क्लास चुनें',
    class_warrior: 'योद्धा', class_mage: 'जादूगर', class_archer: 'धनुर्धर',
    create_hero: 'हीरो बनाएं',
    today: 'आज', add_habit: '+ आदत जोड़ें',
    no_habits_title: 'अभी कोई आदत नहीं',
    no_habits_body: 'पहली आदत जोड़ें और क्वेस्ट शुरू करें!',
    complete: 'पूरा हुआ', start: 'शुरू', edit: 'बदलें', delete: 'हटाएं',
    cancel: 'रद्द', save: 'सेव', close: 'बंद',
    habit_title: 'आदत का नाम', habit_type: 'टाइप',
    type_simple: 'सिंपल (टैप करें)', type_workout: 'वर्कआउट (टाइमर)',
    type_counter: 'काउंटर (reps/pages)', type_reading: 'पढ़ना (पेज)',
    difficulty: 'मुश्किल', easy: 'आसान', medium: 'मध्यम', hard: 'कठिन',
    duration_min: 'समय (मिनट)', target: 'लक्ष्य',
    frequency: 'बार', daily: 'रोज़', weekdays: 'काम के दिन', weekends: 'छुट्टी',
    streak: 'स्ट्रीक', level: 'लेवल', gold: 'गोल्ड', hp: 'HP', xp: 'XP',
    workout_started: 'वर्कआउट शुरू!', workout_complete: 'वर्कआउट पूरा!',
    pause: 'रोकें', resume: 'चालू', finish_early: 'जल्दी खत्म',
    reps: 'Reps', rest: 'आराम', work: 'काम', calories: 'कैलोरी (अनुमान)',
    xp_earned: 'XP मिला', gold_earned: 'गोल्ड मिला',
    boss_unlocked: 'बॉस अनलॉक!', boss_defeated: 'बॉस हार गया!',
    attack: 'हमला', flee: 'भागें', victory: 'जीत!', defeated: 'हार…',
    your_turn: 'आपकी बारी', boss_turn: 'बॉस की बारी',
    shop: 'दुकान', buy: 'खरीदें', owned: 'मालिक', equip: 'पहनें', equipped: 'पहना हुआ',
    not_enough_gold: 'गोल्ड कम है!',
    quests: 'दैनिक क्वेस्ट', quest_done: 'लिया हुआ', quest_claim: 'पाएं',
    achievements: 'उपलब्धियां', calendar: 'कैलेंडर', stats: 'आंकड़े',
    settings: 'सेटिंग्स', theme: 'थीम', light: 'हल्का', dark: 'गहरा', system: 'सिस्टम',
    language: 'भाषा', notifications: 'रिमाइंडर', delete_account: 'सारा डेटा हटाएं',
    delete_confirm: 'यह सब मिटा देगा (आदतें, हीरो, गोल्ड)। वापस नहीं लाया जा सकता।',
    about: 'परिचय', help: 'मदद', premium: 'प्रीमियम',
    premium_body: 'अनलिमिटेड आदतें, एक्सक्लूसिव स्किन और डेवलपर को सपोर्ट करें।',
    unlock: 'अनलॉक', android_only: 'Android ऐप में उपलब्ध',
    error: 'कुछ गड़बड़ हुई', offline_ok: 'आप ऑफ़लाइन हैं — सब चलता है।',
    freeze: 'फ्रीज़ टोकन', revive: 'रिवाइव (विज्ञापन)', double_xp: '2x XP (विज्ञापन)',
    total_workouts: 'कुल वर्कआउट', total_habits: 'पूरी आदतें', best_streak: 'बेस्ट स्ट्रीक',
    days: 'दिन', today_progress: 'आज की प्रगति', boss_hp: 'बॉस HP', your_hp: 'आपका HP',
    damage: 'डैमेज', chapter: 'अध्याय', next_boss_at: 'अगला बॉस लेवल',
    back: 'वापस', menu: 'मेन्यू', logout_wipe: 'सब मिटाएं',
  },
};

let lang = 'en';

export function setLang(l) {
  if (DICT[l]) lang = l;
  document.documentElement.lang = lang;
}

export function getLang() {
  return lang;
}

export function t(key) {
  return DICT[lang][key] ?? DICT.en[key] ?? key;
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    if (k) el.textContent = t(k);
  });
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const k = el.getAttribute('data-i18n-ph');
    if (k) el.setAttribute('placeholder', t(k));
  });
  document.title = (window.__APP_NAME__ || 'QuestHabit');
}
