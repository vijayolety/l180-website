/*
  Our Work page - fetches published case studies from the backend API
  (Node/Express + MySQL, deployed on Railway) and renders full detail for
  each: eyebrow, title, description, highlights, metrics, and card art
  (from work-art.js). Admin adds/reorders/hides items in /admin on the
  backend - this page always reflects that live, no redeploy needed.

  Backend: server/ deployed on Railway (project "l180-work-backend").
*/
(function () {
  const API_BASE = 'https://backend-production-b3e9.up.railway.app';

  // Each work item gets a distinct accent (keyed off its art motif so the
  // colour stays stable across reorders) - reuses the featured-work accent
  // tokens already defined in tokens.css.
  const ACCENTS = {
    honeycomb: '--c-violet',
    orbit: '--c-green',
    grid: '--c-coral',
    shield: '--c-blue',
    network: '--c-teal',
  };
  const FALLBACK_ACCENTS = Object.values(ACCENTS);

  function accentFor(item, index) {
    const name = ACCENTS[item.art_key] || FALLBACK_ACCENTS[index % FALLBACK_ACCENTS.length];
    return { accent: `var(${name})`, accentBg: `var(${name}-bg)` };
  }

  function arrowSvg() {
    return '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function buildItem(item, index) {
    const article = document.createElement('article');
    article.className = 'wrk-item' + (index % 2 === 1 ? ' wrk-item--reverse' : '');
    if (item.slug) article.id = item.slug;
    const { accent, accentBg } = accentFor(item, index);
    article.style.setProperty('--accent', accent);
    article.style.setProperty('--accent-bg', accentBg);

    const art = document.createElement('div');
    art.className = 'wrk-item__art';
    if (item.pdf_url && window.L180_PDF_SLIDESHOW) {
      window.L180_PDF_SLIDESHOW.mount(art, item.pdf_url);
    } else {
      const artBuild = window.L180_WORK_ART && window.L180_WORK_ART[item.art_key];
      if (artBuild) art.innerHTML = artBuild();
    }

    const body = document.createElement('div');
    body.className = 'wrk-item__body';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = item.eyebrow || 'Case study';

    const h2 = document.createElement('h2');
    h2.textContent = item.title;

    const desc = document.createElement('p');
    desc.className = 'wrk-item__desc';
    desc.textContent = item.description;

    body.append(eyebrow, h2, desc);

    if (Array.isArray(item.bullets) && item.bullets.length) {
      const ul = document.createElement('ul');
      ul.className = 'wrk-item__bullets';
      item.bullets.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    if (Array.isArray(item.metrics) && item.metrics.length) {
      const grid = document.createElement('div');
      grid.className = 'wrk-item__metrics';
      item.metrics.forEach((m) => {
        const cell = document.createElement('div');
        cell.className = 'wrk-item__metric';
        const b = document.createElement('b');
        b.textContent = m[0];
        const span = document.createElement('span');
        span.textContent = m[1];
        cell.append(b, span);
        grid.appendChild(cell);
      });
      body.appendChild(grid);
    }

    if (item.link_url) {
      const link = document.createElement('a');
      link.className = 'wrk-item__link';
      link.href = item.link_url;
      link.innerHTML = 'Learn more ' + arrowSvg();
      body.appendChild(link);
    }

    article.append(art, body);
    return article;
  }

  async function load() {
    const stateEl = document.getElementById('wrkListState');
    const listEl = document.getElementById('wrkList');
    if (!stateEl || !listEl) return;

    try {
      const res = await fetch(API_BASE + '/api/work');
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      const items = data.items || [];

      if (!items.length) {
        stateEl.textContent = 'New case studies are on the way. In the meantime, tell us about your project.';
        return;
      }

      listEl.innerHTML = '';
      items.forEach((item, i) => listEl.appendChild(buildItem(item, i)));

      stateEl.hidden = true;
      listEl.hidden = false;

      // Items are fetched async, so a page load that arrives with a
      // "#slug" in the URL (e.g. from a "View full case study" link
      // elsewhere on the site) has already missed the browser's own
      // one-time attempt to scroll to that id - it didn't exist yet.
      // Do it ourselves once the matching item is actually in the DOM.
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView({ block: 'start' });
      }
    } catch (err) {
      stateEl.textContent = 'Our work is temporarily unavailable. Please check back shortly, or get in touch in the meantime.';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
