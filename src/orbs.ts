import type { Orb } from './types.js';

const ORB_COLORS = [
  '#4285F4', '#EA4335', '#FBBC04',
  '#4285F4', '#EA4335', '#4285F4',
  '#FBBC04', '#EA4335', '#4285F4',
];

const REPEL_RADIUS   = 280;
const REPEL_STRENGTH = 0.016;
const DAMPING        = 0.985;
const RESTORE_DIST   = 600;
const RESTORE_FORCE  = 0.0008;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function randBetween(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

function randVel(): number {
  const v = randBetween(0.15, 0.4);
  return Math.random() < 0.5 ? v : -v;
}

export function initOrbs(): void {
  const canvas = document.getElementById('orb-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;

  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = 1;
  const mouse = { x: W / 2, y: H / 2 };
  let orbs: Orb[] = [];

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas!.width  = W * dpr;
    canvas!.height = H * dpr;
    canvas!.style.width  = `${W}px`;
    canvas!.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(): void {
    orbs = ORB_COLORS.map(color => {
      const x = randBetween(W * 0.05, W * 0.95);
      const y = randBetween(H * 0.05, H * 0.95);
      return { x, y, baseX: x, baseY: y, vx: randVel(), vy: randVel(), r: randBetween(180, 380), color };
    });
  }

  function draw(): void {
    ctx.clearRect(0, 0, W, H);

    for (const orb of orbs) {
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
      grad.addColorStop(0, hexToRgba(orb.color, 0.085));
      grad.addColorStop(1, hexToRgba(orb.color, 0));
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const dx = orb.x - mouse.x;
      const dy = orb.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
        orb.vx += (dx / dist) * force;
        orb.vy += (dy / dist) * force;
      }

      const bDist = Math.hypot(orb.x - orb.baseX, orb.y - orb.baseY);
      if (bDist > RESTORE_DIST) {
        orb.vx -= (orb.x - orb.baseX) * RESTORE_FORCE;
        orb.vy -= (orb.y - orb.baseY) * RESTORE_FORCE;
      }

      orb.vx *= DAMPING;
      orb.vy *= DAMPING;
      orb.x  += orb.vx;
      orb.y  += orb.vy;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const reInit = Math.abs(window.innerWidth - W) > 80;
      resize();
      if (reInit) spawn();
    }, 150);
  });

  resize();
  spawn();
  requestAnimationFrame(draw);
}
