export function initResume(): void {
  const resumeLink = document.getElementById('resume-link');
  const modal      = document.getElementById('resume-modal');
  const closeBtn   = document.getElementById('resume-close');
  const printBtn   = document.getElementById('resume-print');

  if (!resumeLink || !modal || !closeBtn || !printBtn) return;

  resumeLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('resume-open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal(): void {
    modal!.classList.remove('resume-open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });
}
