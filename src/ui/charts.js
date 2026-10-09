// Charts: calendar heatmap + weekly bar chart. Original SVG rendering.
import { getState } from '../store.js';
import { fmtNum } from './components.js';

function dateStr(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function heatmapSVG(weeks = 12) {
  const s = getState();
  const doneByDate = {};
  s.logs.forEach((l) => {
    doneByDate[l.date] = (doneByDate[l.date] || 0) + 1;
  });
  const maxPerDay = Math.max(1, s.habits.length || 1);
  const cell = 14, gap = 3;
  const today = new Date();
  const cells = [];
  // go back (weeks*7 - 1) days, aligned so today is last cell
  const totalDays = weeks * 7;
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1));
  // align to Monday-ish: shift so columns are weeks
  const shift = (start.getDay() + 6) % 7; // days since Monday
  start.setDate(start.getDate() - shift);

  for (let w = 0; w < weeks + 1; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) continue;
      const key = dateStr(date);
      const count = doneByDate[key] || 0;
      const intensity = count / maxPerDay;
      const color = count === 0
        ? 'var(--surface-2)'
        : `color-mix(in srgb, var(--accent) ${Math.round(25 + intensity * 75)}%, var(--surface-2))`;
      cells.push(`<rect x="${w * (cell + gap)}" y="${d * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="${color}"><title>${key}: ${count}</title></rect>`);
    }
  }
  const wpx = (weeks + 1) * (cell + gap);
  return `<svg viewBox="0 0 ${wpx} ${7 * (cell + gap)}" class="heatmap" role="img" aria-label="Activity heatmap">${cells.join('')}</svg>`;
}

export function weeklyBarsSVG() {
  const s = getState();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const counts = days.map((d) => s.logs.filter((l) => l.date === dateStr(d)).length);
  const max = Math.max(1, ...counts);
  const barW = 26, gap = 14, h = 110;
  const labels = days.map((d) => 'SMTWTFS'[d.getDay()]);
  const bars = counts.map((c, i) => {
    const bh = Math.max(2, (c / max) * (h - 24));
    const x = i * (barW + gap);
    return `
      <rect x="${x}" y="${h - bh}" width="${barW}" height="${bh}" rx="5" class="bar ${c === max && c > 0 ? 'bar-max' : ''}">
        <title>${dateStr(days[i])}: ${c}</title>
      </rect>
      <text x="${x + barW / 2}" y="${h + 14}" class="bar-label">${labels[i]}</text>
      ${c > 0 ? `<text x="${x + barW / 2}" y="${h - bh - 5}" class="bar-value">${c}</text>` : ''}`;
  }).join('');
  const wpx = 7 * (barW + gap);
  return `<svg viewBox="0 0 ${wpx} ${h + 20}" class="bars" role="img" aria-label="Weekly activity">${bars}</svg>`;
}

export function statsSummaryHTML() {
  const s = getState();
  const today = dateStr(new Date());
  const doneToday = s.logs.filter((l) => l.date === today).length;
  const bestStreak = Math.max(0, ...s.habits.map((h) => h.streak || 0));
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num">${fmtNum(s.hero.totalHabitsDone)}</div><div class="stat-label" data-i18n="total_habits"></div></div>
      <div class="stat-card"><div class="stat-num">${fmtNum(s.hero.totalWorkouts)}</div><div class="stat-label" data-i18n="total_workouts"></div></div>
      <div class="stat-card"><div class="stat-num">${bestStreak}</div><div class="stat-label" data-i18n="best_streak"></div></div>
      <div class="stat-card"><div class="stat-num">${doneToday}</div><div class="stat-label" data-i18n="today_progress"></div></div>
    </div>`;
}
