/*
  Shared card-art generators for "Our Work" content - used by the homepage
  Featured Work carousel (work-carousel.js) and the /work page (work-list.js).
  Deterministic SVG, same approach as the CTA banner mesh in footer.js, so
  markup stays free of long inline SVG blocks.
*/
(function () {
  function honeycombArt() {
    const s = 24;
    const hh = s * 0.866;
    const colStep = s * 1.5;
    const rowStep = s * 1.732;
    let shapes = '';
    for (let col = -1; col <= 8; col++) {
      const x = col * colStep + 12;
      const offset = col % 2 !== 0 ? rowStep / 2 : 0;
      for (let row = -1; row <= 5; row++) {
        const y = row * rowStep + offset + 10;
        if (x < -28 || x > 340 || y < -28 || y > 216) continue;
        const pts = [
          [x - s, y], [x - s / 2, y - hh], [x + s / 2, y - hh],
          [x + s, y], [x + s / 2, y + hh], [x - s / 2, y + hh],
        ].map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
        shapes += `<polygon points="${pts}" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.4"/>`;
      }
    }
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${shapes}</svg>`;
  }

  function orbitArt() {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <ellipse cx="160" cy="100" rx="95" ry="46" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.4"/>
      <ellipse cx="160" cy="100" rx="70" ry="70" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.28"/>
      <ellipse cx="160" cy="100" rx="46" ry="95" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.22"/>
      <rect x="126" y="82" width="68" height="36" rx="10" fill="#101B2C" stroke="currentColor" stroke-width="1.2"/>
      <text x="160" y="106" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#fff" letter-spacing="1">AI</text>
      <circle cx="82" cy="72" r="4" fill="#F7920A"/>
      <circle cx="244" cy="128" r="4" fill="#F7920A"/>
      <circle cx="205" cy="42" r="3" fill="currentColor"/>
      <circle cx="112" cy="156" r="3" fill="currentColor"/>
    </svg>`;
  }

  function gridArt() {
    const cols = 9, rows = 6, size = 24, gap = 6, startX = 10, startY = 8;
    const amberRow = 2, amberCol = 4;
    let cells = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (size + gap);
        const y = startY + r * (size + gap);
        const isAmber = r === amberRow && c === amberCol;
        cells += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="6" fill="${
          isAmber ? '#F7920A' : '#132338'
        }" stroke="currentColor" stroke-width="1" opacity="${isAmber ? 1 : 0.5}"/>`;
      }
    }
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${cells}</svg>`;
  }

  function shieldArt() {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M160 30 100 52v58c0 44 26 72 60 88 34-16 60-44 60-88V52L160 30Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" opacity="0.5"/>
      <path d="M160 44 114 61v46c0 35 21 57 46 69 25-12 46-34 46-69V61L160 44Z" fill="#101B2C" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M138 108l16 16 30-34" stroke="#F7920A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  }

  function networkArt() {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="currentColor" stroke-width="1.3" opacity="0.5">
        <line x1="160" y1="55" x2="90" y2="150"/>
        <line x1="160" y1="55" x2="230" y2="150"/>
        <line x1="90" y1="150" x2="230" y2="150"/>
      </g>
      <circle cx="160" cy="55" r="13" fill="#101B2C" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="90" cy="150" r="13" fill="#101B2C" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="230" cy="150" r="13" fill="#101B2C" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="160" cy="55" r="4" fill="#F7920A"/>
      <circle cx="90" cy="150" r="4" fill="currentColor"/>
      <circle cx="230" cy="150" r="4" fill="currentColor"/>
    </svg>`;
  }

  window.L180_WORK_ART = {
    honeycomb: honeycombArt,
    orbit: orbitArt,
    grid: gridArt,
    shield: shieldArt,
    network: networkArt,
  };
})();
