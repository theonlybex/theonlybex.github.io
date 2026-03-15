export function initCursor(): void {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Only on devices with a real mouse
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  function animateRing(): void {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring!.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  const hoverables = 'a, button, .btn, .exp-card, .project-card';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => ring!.classList.add('ring-grow'));
    el.addEventListener('mouseleave', () => ring!.classList.remove('ring-grow'));
  });

  document.documentElement.classList.add('custom-cursor');
}
