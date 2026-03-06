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

  // ----- 3D wireframe icosahedron (right side, slow spin) -----
  const canvas = document.getElementById('icosahedron');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const ORANGE = '#d29922';

  const phi = (1 + Math.sqrt(5)) / 2;
  const scale = 1 / Math.sqrt(1 + phi * phi);
  const raw = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
  ];
  const vertices = raw.map(([x, y, z]) => [x * scale, y * scale, z * scale]);
  const edges = [
    [0,1],[0,5],[0,8],[0,9],[0,11],[1,2],[1,6],[1,8],[1,11],[2,3],[2,6],[2,7],[2,9],
    [3,4],[3,7],[3,9],[3,10],[4,5],[4,7],[4,10],[4,11],[5,8],[5,9],[5,10],
    [6,7],[6,8],[6,10],[6,11],[7,9],[8,10],[9,10]
  ];

  let angleY = 0.3;
  let angleX = 0.15;
  const dAngleY = 0.0022;
  const dAngleX = 0.0008;
  const perspective = 420;
  const lineWidth = 1.8;

  function rotateX([x, y, z], a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x, y * c - z * s, y * s + z * c];
  }
  function rotateY([x, y, z], a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, y, -x * s + z * c];
  }
  function project([x, y, z]) {
    const p = perspective / (perspective + z);
    return [x * p, y * p];
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.38;

    const rotated = vertices.map(v => {
      let [a, b, c] = rotateY(v, angleY);
      return rotateX([a, b, c], angleX);
    });
    const proj = rotated.map(v => {
      const [px, py] = project(v);
      return [cx + px * r, cy + py * r];
    });
    const depth = rotated.map(v => v[2]);

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    const drawOrder = edges.map(([i, j]) => ({ i, j, midZ: (depth[i] + depth[j]) / 2 }));
    drawOrder.sort((a, b) => a.midZ - b.midZ);

    drawOrder.forEach(({ i, j }) => {
      const [x1, y1] = proj[i];
      const [x2, y2] = proj[j];
      const back = (depth[i] + depth[j]) / 2 < 0;
      ctx.globalAlpha = back ? 0.4 : 1;
      ctx.setLineDash(back ? [4, 4] : []);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    angleY += dAngleY;
    angleX += dAngleX;
    requestAnimationFrame(draw);
  }

  function resize() {
    const wrap = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = Math.floor((wrap.clientWidth || 400) * dpr);
    let h = Math.floor((wrap.clientHeight || 400) * dpr);
    if (w < 50) w = 400;
    if (h < 50) h = 400;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = (wrap.clientWidth || 400) + 'px';
    canvas.style.height = (wrap.clientHeight || 400) + 'px';
  }
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(function startDraw() {
    resize();
    draw();
  });
});
