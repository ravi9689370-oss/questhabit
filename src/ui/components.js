// Reusable UI helpers: toast, modal, confetti, icons, haptics.
import { t } from '../i18n.js';

export function toast(msg, kind = 'info') {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    host.setAttribute('role', 'status');
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.textContent = msg;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

export function modal({ title, body, actions = [] }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const box = document.createElement('div');
  box.className = 'modal';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');

  const h = document.createElement('h3');
  h.textContent = title;
  box.appendChild(h);

  const b = document.createElement('div');
  b.className = 'modal-body';
  if (typeof body === 'string') b.innerHTML = body;
  else b.appendChild(body);
  box.appendChild(b);

  const row = document.createElement('div');
  row.className = 'modal-actions';
  actions.forEach((a) => {
    const btn = document.createElement('button');
    btn.className = `btn ${a.primary ? 'btn-primary' : 'btn-ghost'}`;
    btn.textContent = a.label;
    btn.addEventListener('click', () => {
      if (a.onClick) a.onClick();
      if (a.keepOpen !== true) close();
    });
    row.appendChild(btn);
  });
  box.appendChild(row);
  overlay.appendChild(box);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.body.appendChild(overlay);

  function close() {
    overlay.classList.add('hide');
    setTimeout(() => overlay.remove(), 200);
  }
  return close;
}

export function confirmDialog(title, body, onConfirm, confirmLabel) {
  return modal({
    title,
    body,
    actions: [
      { label: t('cancel'), onClick: () => {} },
      { label: confirmLabel ?? t('delete'), primary: true, onClick: onConfirm },
    ],
  });
}

// Lightweight canvas confetti — original implementation, no dependency.
export function confetti(x = null, y = null, count = 90) {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);
  const ox = x ?? w / 2;
  const oy = y ?? h / 2;
  const colors = ['#fbbf24', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa', '#f97316'];
  const parts = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 7;
    return {
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 6,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 70 + Math.random() * 40,
    };
  });
  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    parts.forEach((p) => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.22; p.vx *= 0.99;
      p.rot += p.vr; p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    frame++;
    if (alive && frame < 240) requestAnimationFrame(tick);
    else canvas.remove();
  }
  tick();
}

export function vibrate(pattern = 20) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* noop */ }
}

export function fmtNum(n) {
  return new Intl.NumberFormat().format(Math.round(n));
}

export function timeStr(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
