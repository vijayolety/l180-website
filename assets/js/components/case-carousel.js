/*
  Case-study carousel used on the service detail pages.

  Slide 1 lives in the page markup and reproduces the Aug-11 mockup for that
  service exactly. Slides 2-4 are appended from the catalogue below, which
  holds the same five Labs builds already published on the homepage - each
  page picks the three most relevant via data-more="slug,slug,slug".

  Progressive enhancement: with JS off the page still shows slide 1 (the
  mockup slide) and the carousel chrome stays hidden.
*/
(function () {
  const ARROW =
    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Small inline icon set for the generated slides' benefits column -
  // deliberately not <use href="#i-x"/> references, since this script runs
  // on every service page and each page's own icon sprite only defines the
  // symbols that page's bespoke slide happens to use.
  const ICONS = {
    flow: '<circle cx="9.2" cy="7" r="3.3"/><path d="M3.2 19.6c0-3.6 2.7-5.9 6-5.9"/><path d="M13.6 16.6h6.6M17.4 13.8l2.8 2.8-2.8 2.8"/>',
    sliders: '<path d="M3.6 7.6h9.2M18.6 7.6h1.8M3.6 16.4h3.8M12.4 16.4h8"/><circle cx="15.6" cy="7.6" r="2.4"/><circle cx="9.6" cy="16.4" r="2.4"/>',
    clock: '<circle cx="12" cy="12" r="9.2"/><path d="M12 6.6V12l3.8 2.3"/>',
    bolt: '<path d="M13.6 2.4 4.4 13.6h6.3l-1.3 8 9.2-11.4h-6.3l1.3-7.8Z" stroke-linejoin="round"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.3"/><path d="m12 12 7.7-7.7"/><path d="M15.1 5.6h3.6v3.6"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    trendUp: '<path d="M4.6 10.4 8.6 7l2.6 2"/><path d="M4 20.4h16"/><path d="M6.6 20.4v-5.6M11.8 20.4V9.6M17 20.4V5.6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5-11 11"/>',
    badgeCheck: '<path d="M12 2.6c3.8 0 6.9 3 6.9 6.8 0 5-6.9 12-6.9 12S5.1 14.4 5.1 9.4c0-3.8 3.1-6.8 6.9-6.8Z" stroke-linejoin="round"/><path d="m9.2 9.3 2 2 3.6-4"/>',
    grid: '<rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2.4"/><path d="M3.4 9h17.2"/><path d="m9 13.6 2 2 3.8-4"/>',
    badge: '<path d="M12 2.6c3.8 0 6.9 3 6.9 6.8 0 5-6.9 12-6.9 12S5.1 14.4 5.1 9.4c0-3.8 3.1-6.8 6.9-6.8Z" stroke-linejoin="round"/><circle cx="12" cy="9.4" r="2.6"/>',
    file: '<path d="M13.6 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2l-5.4-5.4Z" stroke-linejoin="round"/><path d="M13.4 2.9v5.2h5.3"/><path d="M8.6 13.4h6.8M8.6 16.8h4.4"/>',
    users: '<circle cx="9" cy="8.2" r="3.3"/><path d="M2.9 19.8c0-3.4 2.7-5.6 6.1-5.6s6.1 2.2 6.1 5.6"/><path d="M16.2 6.4a3 3 0 0 1 0 5.6"/><path d="M17.6 14.9c2.1.6 3.5 2.2 3.5 4.9"/>',
    layers: '<rect x="8.6" y="3.6" width="12" height="12" rx="2"/><path d="M15.4 20.4H5.4a2 2 0 0 1-2-2V8.6"/><path d="M11.6 8h5.4M11.6 11.2h3.2"/>',
    browser: '<rect x="3" y="4.4" width="18" height="15.2" rx="2.5"/><path d="M3 8.9h18"/><circle cx="6.3" cy="6.65" r=".8" fill="currentColor" stroke="none"/><circle cx="8.6" cy="6.65" r=".8" fill="currentColor" stroke="none"/><circle cx="10.9" cy="6.65" r=".8" fill="currentColor" stroke="none"/>',
  };

  // Copy is lifted verbatim from the homepage's Featured Work cards. `slug`
  // matches the id the Our Work page gives each case study, so "View full
  // case study" deep-links straight to it instead of the generic index.
  // `benefits` gives every generated slide the same three-column layout
  // (copy / visual / benefits) as each page's own hand-authored slide -
  // without it these slides rendered as a wider two-column layout, which
  // read as visibly bigger/more prominent than the hand-authored one.
  const CATALOGUE = {
    'content-studio': {
      slug: 'ai-content-studio',
      title: 'AI Content Studio',
      desc: 'An end-to-end AI pipeline that turns a topic into video-ready content in under 10 minutes, replacing hours of manual content creation.',
      bullets: ['4-step wizard', '3 AI content formats', '<10 min topic-to-publish'],
      metrics: [
        ['4', 'Wizard steps'],
        ['3', 'Content formats'],
        ['<10', 'Minutes to publish'],
        ['1', 'Unified pipeline'],
      ],
      bars: [['Topic input', '100%'], ['Generation', '86%'], ['Review', '72%'], ['Publish', '94%']],
      benefits: [
        [ICONS.flow, 'End-to-end pipeline', 'From topic to publish, fully automated.'],
        [ICONS.sliders, 'Multi-format output', 'Blog, video script, social posts & more.'],
        [ICONS.clock, 'Minutes, not hours', '<10 minutes from topic to publish.'],
      ],
    },
    'email-bot': {
      slug: 'ai-email-bot',
      title: 'AI Email Bot',
      desc: 'Automated personalized follow-ups at scale - from lead upload to scoring in a single pipeline, with no manual outreach in between.',
      bullets: ['Per-lead personalization', 'Day 3/7 auto follow-ups', 'Hot/Warm/Cold scoring'],
      metrics: [
        ['2', 'Auto follow-ups'],
        ['3', 'Scoring tiers'],
        ['1', 'Upload to outreach'],
        ['100%', 'Personalized'],
      ],
      bars: [['Upload', '100%'], ['Personalize', '92%'], ['Follow-up', '78%'], ['Score', '88%']],
      benefits: [
        [ICONS.bolt, 'Zero manual outreach', 'Follow-ups sent automatically, every time.'],
        [ICONS.target, 'Built-in lead scoring', 'Hot, warm, and cold - prioritized automatically.'],
        [ICONS.trendUp, 'Scales with your list', 'One pipeline, any number of leads.'],
      ],
    },
    chromacraft: {
      slug: 'chromacraft-ai',
      title: 'ChromaCraft AI',
      desc: 'AI-powered batch product photography that cut timelines from weeks to days - 1,000+ QA-ready images per run.',
      bullets: ['1,000+ images per batch', '12 color variants', '<3 days end-to-end'],
      metrics: [
        ['1,000+', 'Images per batch'],
        ['12', 'Colour variants'],
        ['<3', 'Days end-to-end'],
        ['1', 'QA pass'],
      ],
      bars: [['Generate', '100%'], ['Variants', '84%'], ['QA', '90%'], ['Deliver', '96%']],
      benefits: [
        [ICONS.image, 'Studio-free production', 'Skip the shoot, generate at scale.'],
        [ICONS.badgeCheck, 'Built-in QA pass', 'Every image checked before delivery.'],
        [ICONS.clock, 'Weeks become days', 'Brief to QA-ready in under 3 days.'],
      ],
    },
    sentinel: {
      slug: 'life180-sentinel',
      title: 'Life180 Sentinel',
      desc: 'An AI evaluation pipeline that replaces manual code reviews - repository in, confidence-scored PDF report out, instantly.',
      bullets: ['8 eval categories', 'Confidence scoring', 'Instant PDF report'],
      metrics: [
        ['8', 'Eval categories'],
        ['1', 'PDF report'],
        ['100%', 'Automated'],
        ['0', 'Manual reviews'],
      ],
      bars: [['Security', '95%'], ['Code quality', '92%'], ['Best practices', '90%'], ['Performance', '88%']],
      benefits: [
        [ICONS.grid, '8 evaluation categories', 'Comprehensive AI-driven analysis.'],
        [ICONS.badge, 'Confidence scoring', 'Clear scores to prioritize fixes.'],
        [ICONS.file, 'Instant PDF report', 'Shareable reports in seconds.'],
      ],
    },
    'rag-visualizer': {
      slug: 'rag-pipeline-visualizer',
      title: 'RAG Pipeline Visualizer',
      desc: 'Retrieval-augmented generation made accessible to non-technical teams - all seven RAG stages, walked through live in the browser.',
      bullets: ['7 pipeline stages', 'Zero ML background needed', 'Fully client-side'],
      metrics: [
        ['7', 'Pipeline stages'],
        ['0', 'ML background needed'],
        ['100%', 'Client-side'],
        ['1', 'Browser tab'],
      ],
      bars: [['Ingest', '100%'], ['Embed', '88%'], ['Retrieve', '94%'], ['Generate', '82%']],
      benefits: [
        [ICONS.users, 'No ML background needed', 'Built for non-technical teams.'],
        [ICONS.layers, 'Every stage, visualized', 'Ingest to generate, step by step.'],
        [ICONS.browser, 'Runs entirely client-side', 'No backend, no setup required.'],
      ],
    },
  };

  function metricsVisual(entry) {
    const cells = entry.metrics
      .map((m) => `<div class="svc-mock-metrics__cell"><b>${m[0]}</b><span>${m[1]}</span></div>`)
      .join('');
    const bars = entry.bars
      .map(
        (b) =>
          `<div class="svc-mock-metrics__bar"><span>${b[0]}</span><i style="--pct:${b[1]}"></i></div>`
      )
      .join('');
    return `<div class="svc-mock svc-mock-metrics">
      <div class="svc-mock__pad">
        <p class="svc-mock__title">${entry.title}</p>
        <div class="svc-mock-metrics__grid">${cells}</div>
        <div class="svc-mock-metrics__bars">${bars}</div>
      </div>
    </div>`;
  }

  function benefitsColumn(entry) {
    const items = entry.benefits
      .map(
        ([icon, title, desc]) => `<div class="svc-cs__benefit">
          <span class="svc-cs__benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">${icon}</svg></span>
          <div><h3>${title}</h3><p>${desc}</p></div>
        </div>`
      )
      .join('');
    return `<div class="svc-cs__benefits">${items}</div>`;
  }

  function buildSlide(slug) {
    const entry = CATALOGUE[slug];
    if (!entry) return null;
    const el = document.createElement('div');
    el.className = 'svc-cs__slide';
    el.setAttribute('role', 'group');
    el.setAttribute('aria-roledescription', 'slide');
    el.innerHTML = `
      <div class="svc-cs__copy">
        <p class="eyebrow">Case study</p>
        <h2>${entry.title}</h2>
        <p>${entry.desc}</p>
        <ul class="svc-cs__bullets">${entry.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        <a class="svc-cs__link" href="../../work/#${entry.slug}">View full case study${ARROW}</a>
      </div>
      <div class="svc-cs__visual">${metricsVisual(entry)}</div>
      ${benefitsColumn(entry)}`;
    return el;
  }

  function initCarousel(root) {
    const track = root.querySelector('.svc-cs__track');
    const viewport = root.querySelector('.svc-cs__viewport');
    const dotsWrap = root.querySelector('.svc-cs__dots');
    const prev = root.querySelector('.svc-cs__nav--prev');
    const next = root.querySelector('.svc-cs__nav--next');
    if (!track) return;

    (track.dataset.more || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((slug) => {
        const slide = buildSlide(slug);
        if (slide) track.appendChild(slide);
      });

    const slides = Array.prototype.slice.call(track.querySelectorAll('.svc-cs__slide'));
    if (slides.length < 2) return;

    let index = 0;

    // Dots are rendered here rather than in the HTML so their count can never
    // drift out of sync with the number of slides actually on the page.
    const dots = slides.map((slide, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      const h = slide.querySelector('h2');
      b.setAttribute('aria-label', h ? h.textContent.trim() : 'Case study ' + (i + 1));
      b.addEventListener('click', () => go(i));
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const active = n === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
        // Hidden slides stay in the DOM (they are only visually stacked
        // behind), so take their controls out of the tab order.
        s.querySelectorAll('a, button').forEach((el) => {
          if (active) el.removeAttribute('tabindex');
          else el.setAttribute('tabindex', '-1');
        });
      });
      dots.forEach((d, n) => d.setAttribute('aria-current', n === index ? 'true' : 'false'));
    }

    if (prev) prev.addEventListener('click', () => go(index - 1));
    if (next) next.addEventListener('click', () => go(index + 1));

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'ArrowRight') go(index + 1);
    });

    let startX = null;
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      viewport.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        startX = null;
      });
    }

    root.classList.add('is-enhanced');
    go(0);
  }

  function boot() {
    document.querySelectorAll('.svc-cs[data-carousel]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
