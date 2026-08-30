/*
  Shared card-art generators for "Our Work" content - used by the homepage
  Featured Work carousel (work-carousel.js) and the /work page (work-list.js).
  Deterministic SVG, same approach as the CTA banner mesh in footer.js, so
  markup stays free of long inline SVG blocks.

  Every shape draws in currentColor so it inherits each card's own
  --accent (set per item from the site's 5-color moodboard: violet, coral,
  green, blue, teal) rather than one fixed color for every card - and each
  motif is drawn to match what that specific build actually does, not a
  generic "AI" glyph.
*/
(function () {
  // AI Content Studio - honeycomb pipeline texture behind a video thumbnail
  // with a play button, since the product turns a topic into video-ready
  // content.
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
        shapes += `<polygon points="${pts}" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.28"/>`;
      }
    }
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      ${shapes}
      <rect x="112" y="58" width="96" height="72" rx="10" fill="#101B2C" stroke="currentColor" stroke-width="1.3"/>
      <rect x="112" y="58" width="96" height="16" rx="8" style="fill:var(--accent-bg, currentColor)" opacity="0.9"/>
      <circle cx="160" cy="102" r="19" style="fill:var(--accent, currentColor)" opacity="0.9"/>
      <path d="M154 92v20l18-10Z" fill="#0B1522"/>
    </svg>`;
  }

  // AI Email Bot - an envelope sending personalized follow-ups out to a
  // list of leads.
  function orbitArt() {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.5">
        <path d="M188 100h64M198 84l14 16-14 16"/>
        <path d="M188 70h50M198 56l12 14-12 14" opacity="0.6"/>
        <path d="M188 130h50M198 116l12 14-12 14" opacity="0.6"/>
      </g>
      <circle cx="248" cy="100" r="4" fill="currentColor"/>
      <circle cx="240" cy="70" r="3.2" fill="currentColor" opacity="0.7"/>
      <circle cx="240" cy="130" r="3.2" fill="currentColor" opacity="0.7"/>
      <rect x="88" y="66" width="86" height="64" rx="9" fill="#101B2C" stroke="currentColor" stroke-width="1.6"/>
      <path d="M88 74 131 104 174 74" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="150" cy="118" r="9" style="fill:var(--accent, currentColor)"/>
      <path d="M146 118l3 3 6-6" stroke="#0B1522" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // ChromaCraft AI - a batch of AI-generated product-photo color variants,
  // each swatch a different hue from the moodboard.
  function gridArt() {
    const cols = 9, rows = 6, size = 24, gap = 6, startX = 10, startY = 8;
    const variantColors = ['#7C47DC', '#F4522A', '#16A34A', '#1565FB', '#0E9CC0'];
    const variantCells = { '1-2': 0, '2-6': 1, '3-1': 2, '0-7': 3, '4-4': 4 };
    let cells = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (size + gap);
        const y = startY + r * (size + gap);
        const key = r + '-' + c;
        const variantIndex = variantCells[key];
        const isVariant = variantIndex !== undefined;
        cells += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="6" fill="${
          isVariant ? variantColors[variantIndex] : '#132338'
        }" stroke="currentColor" stroke-width="1" opacity="${isVariant ? 1 : 0.45}"/>`;
      }
    }
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${cells}</svg>`;
  }

  // Life180 Sentinel - a shield standing guard over the codebase, evaluation
  // confirmed with a checkmark.
  function shieldArt() {
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M160 30 100 52v58c0 44 26 72 60 88 34-16 60-44 60-88V52L160 30Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" opacity="0.5"/>
      <path d="M160 44 114 61v46c0 35 21 57 46 69 25-12 46-34 46-69V61L160 44Z" fill="#101B2C" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M138 108l16 16 30-34" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  }

  // RAG Pipeline Visualizer - a retrieval graph: query node connected to
  // retrieved-context nodes.
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
      <circle cx="160" cy="55" r="4" style="fill:var(--accent, currentColor)"/>
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
