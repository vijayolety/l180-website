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

  // Copy is lifted verbatim from the homepage's Featured Work cards.
  const CATALOGUE = {
    'content-studio': {
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
    },
    'email-bot': {
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
    },
    chromacraft: {
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
    },
    sentinel: {
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
    },
    'rag-visualizer': {
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

  function buildSlide(slug) {
    const entry = CATALOGUE[slug];
    if (!entry) return null;
    const el = document.createElement('div');
    el.className = 'svc-cs__slide svc-cs__slide--wide';
    el.setAttribute('role', 'group');
    el.setAttribute('aria-roledescription', 'slide');
    el.innerHTML = `
      <div class="svc-cs__copy">
        <p class="eyebrow">Case study</p>
        <h2>${entry.title}</h2>
        <p>${entry.desc}</p>
        <ul class="svc-cs__bullets">${entry.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        <a class="svc-cs__link" href="/work">View full case study${ARROW}</a>
      </div>
      <div class="svc-cs__visual">${metricsVisual(entry)}</div>`;
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
