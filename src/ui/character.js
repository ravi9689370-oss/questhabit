// Procedural SVG characters — 100% original vector art drawn in code.
// No image assets, no third-party illustrations.

export function avatarSVG({ heroClass = 'warrior', color = '#4ade80', skin = 'default', size = 96 } = {}) {
  // Base: round head, body, simple limbs; class = weapon held.
  const weapon = {
    warrior: `<rect x="46" y="38" width="4" height="26" rx="2" fill="#94a3b8"/><path d="M43 38 h10 l-2 -8 h-6 z" fill="#cbd5e1"/>`,
    mage: `<rect x="46" y="30" width="4" height="34" rx="2" fill="#8b5cf6"/><circle cx="48" cy="28" r="6" fill="#a78bfa"/>`,
    archer: `<path d="M52 34 q10 12 0 26" stroke="#b45309" stroke-width="3" fill="none"/><line x1="52" y1="34" x2="52" y2="60" stroke="#e2e8f0" stroke-width="1.5"/>`,
  }[heroClass] ?? '';
  return `<svg viewBox="0 0 96 96" width="${size}" height="${size}" role="img" aria-label="${heroClass} avatar" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="20" r="11" fill="#fcd9b8"/>
    <path d="M37 17 q11 -12 22 0 l-2 -9 q-9 -7 -18 0 z" fill="${color}"/>
    <circle cx="44" cy="19" r="1.6" fill="#1f2937"/><circle cx="52" cy="19" r="1.6" fill="#1f2937"/>
    <path d="M44 25 q4 3 8 0" stroke="#1f2937" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <rect x="36" y="32" width="24" height="26" rx="9" fill="${color}"/>
    <rect x="30" y="36" width="6" height="18" rx="3" fill="${color}"/>
    <rect x="60" y="36" width="6" height="18" rx="3" fill="${color}"/>
    <rect x="38" y="58" width="9" height="22" rx="4" fill="#334155"/>
    <rect x="49" y="58" width="9" height="22" rx="4" fill="#334155"/>
    ${weapon}
  </svg>`;
}

// Exercise figure: animated via CSS keyframes on <g class="ex-*">.
// Each exercise maps to a CSS animation defined in styles.css.
export function exerciseSVG(exercise, size = 180) {
  const body = (cls) => `
  <g class="ex ${cls}">
    <circle cx="90" cy="34" r="13" fill="#fcd9b8"/>
    <rect x="72" y="50" width="36" height="30" rx="10" fill="#4ade80"/>
    <rect x="60" y="54" width="10" height="34" rx="5" fill="#4ade80" class="limb arm-l"/>
    <rect x="110" y="54" width="10" height="34" rx="5" fill="#4ade80" class="limb arm-r"/>
    <rect x="76" y="80" width="12" height="36" rx="6" fill="#334155" class="limb leg-l"/>
    <rect x="92" y="80" width="12" height="36" rx="6" fill="#334155" class="limb leg-r"/>
  </g>`;
  const cls = {
    jumping_jacks: 'ex-jacks',
    squats: 'ex-squats',
    pushups: 'ex-pushups',
    lunges: 'ex-lunges',
    high_knees: 'ex-knees',
    crunches: 'ex-crunches',
  }[exercise] ?? 'ex-jacks';
  return `<svg viewBox="0 0 180 170" width="${size}" height="${size}" role="img" aria-label="${exercise.replace(/_/g, ' ')}" xmlns="http://www.w3.org/2000/svg">${body(cls)}</svg>`;
}

export const EXERCISES = [
  { id: 'jumping_jacks', seconds: 45, repsPerMin: 28 },
  { id: 'squats', seconds: 45, repsPerMin: 24 },
  { id: 'pushups', seconds: 45, repsPerMin: 18 },
  { id: 'lunges', seconds: 45, repsPerMin: 22 },
  { id: 'high_knees', seconds: 45, repsPerMin: 30 },
  { id: 'crunches', seconds: 45, repsPerMin: 26 },
];

export function itemIconSVG(icon, size = 40) {
  const shapes = {
    stick: `<rect x="18" y="6" width="4" height="28" rx="2" fill="#b45309"/><circle cx="20" cy="8" r="4" fill="#f59e0b"/>`,
    sword: `<rect x="18" y="10" width="4" height="22" rx="2" fill="#cbd5e1"/><path d="M15 10 h10 l-2 -7 h-6 z" fill="#e2e8f0"/><rect x="13" y="32" width="14" height="3" rx="1.5" fill="#8b5cf6"/>`,
    staff: `<rect x="18" y="8" width="4" height="28" rx="2" fill="#7c3aed"/><circle cx="20" cy="8" r="6" fill="#a78bfa"/>`,
    bow: `<path d="M24 6 q12 16 0 32" stroke="#b45309" stroke-width="3" fill="none"/><line x1="24" y1="6" x2="24" y2="38" stroke="#e2e8f0" stroke-width="1.5"/>`,
    armour: `<path d="M8 12 h24 l-3 18 h-18 z" fill="#94a3b8"/><rect x="14" y="30" width="12" height="6" rx="2" fill="#64748b"/>`,
    plate: `<path d="M8 10 h24 l-3 20 h-18 z" fill="#e2e8f0"/><circle cx="20" cy="18" r="4" fill="#fbbf24"/>`,
    pet: `<circle cx="20" cy="20" r="12" fill="#fbbf24"/><circle cx="16" cy="17" r="2" fill="#1f2937"/><circle cx="24" cy="17" r="2" fill="#1f2937"/><path d="M17 24 q3 2 6 0" stroke="#1f2937" stroke-width="1.5" fill="none"/>`,
    fox: `<path d="M10 14 l4 -8 4 6 4 -6 4 8 q2 10 -6 14 q-10 -4 -10 -14z" fill="#f97316"/><circle cx="16" cy="16" r="1.8" fill="#1f2937"/><circle cx="24" cy="16" r="1.8" fill="#1f2937"/>`,
    aura: `<circle cx="20" cy="20" r="14" fill="none" stroke="#fbbf24" stroke-width="3" opacity="0.9"/><circle cx="20" cy="20" r="8" fill="#fde68a"/>`,
    shadow: `<circle cx="20" cy="20" r="12" fill="#334155"/><path d="M12 26 q8 -6 16 0" fill="#475569"/>`,
  };
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" role="img" aria-label="${icon}" xmlns="http://www.w3.org/2000/svg">${shapes[icon] ?? shapes.stick}</svg>`;
}

export const HABIT_ICONS = {
  workout: '🏋️', reading: '📖', water: '💧', meditate: '🧘', run: '🏃',
  code: '💻', write: '✍️', study: '📚', sleep: '😴', custom: '⭐',
};
