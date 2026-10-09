// Calendar + stats deep view.
import { getState } from '../store.js';
import { t } from '../i18n.js';
import { heatmapSVG, weeklyBarsSVG, statsSummaryHTML } from '../ui/charts.js';
import { navigate } from '../router.js';

export default function render(root) {
  const s = getState();

  // build month grid
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const doneByDate = {};
  s.logs.forEach((l) => { doneByDate[l.date] = (doneByDate[l.date] || 0) + 1; });

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push('<div class="cal-cell empty"></div>');
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const count = doneByDate[key] || 0;
    const isToday = key === new Date().toISOString().slice(0, 10);
    cells.push(`<div class="cal-cell ${count ? 'active' : ''} ${isToday ? 'today' : ''}">
      <span>${d}</span>${count ? `<i>${count}</i>` : ''}
    </div>`);
  }

  root.innerHTML = `
  <div class="screen">
    <header class="sub-header">
      <button class="btn btn-ghost" id="btn-back">←</button>
      <h2>${t('calendar')}</h2>
      <span></span>
    </header>

    <section class="card">
      <div class="card-head"><h2>${now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2></div>
      <div class="cal-grid">
        ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => `<div class="cal-head">${d}</div>`).join('')}
        ${cells.join('')}
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>${t('stats')}</h2></div>
      ${statsSummaryHTML()}
    </section>

    <section class="card">
      <div class="card-head"><h2>Last 12 weeks</h2></div>
      ${heatmapSVG(12)}
    </section>

    <section class="card">
      <div class="card-head"><h2>Last 7 days</h2></div>
      ${weeklyBarsSVG()}
    </section>
  </div>`;

  root.querySelector('#btn-back').addEventListener('click', () => navigate('/home'));
  return () => {};
}
