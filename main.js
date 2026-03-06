document.addEventListener('DOMContentLoaded', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const sidebarItems = document.querySelectorAll('.sidebar-item[data-id]');

  const sectionIds = Array.from(contentSections).map(s => s.id);
  let currentIndex = 0;

  function showSection(id) {
    const idx = sectionIds.indexOf(id);
    if (idx === -1) return;
    currentIndex = idx;

    contentSections.forEach(section => {
      section.classList.toggle('active', section.id === id);
    });

    sidebarItems.forEach(item => {
      const itemId = item.getAttribute('data-id');
      item.classList.toggle('active', itemId === id);
    });
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % sectionIds.length;
    showSection(sectionIds[currentIndex]);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + sectionIds.length) % sectionIds.length;
    showSection(sectionIds[currentIndex]);
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      if (id) showSection(id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input') || e.target.closest('textarea')) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        if (!e.shiftKey) {
          e.preventDefault();
          showNext();
        }
        break;
      case 'ArrowUp':
      case 'k':
        if (!e.shiftKey) {
          e.preventDefault();
          showPrev();
        }
        break;
    }
  });

  showSection('about');
});
