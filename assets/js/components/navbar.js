/*
  <site-navbar current="home"></site-navbar>
  Reusable global navbar. No build step required - drop the tag on any page,
  link tokens.css + navbar.css + this script, and pass a `current` attribute
  matching one of: home, services, work, about, contact.
  Nav order/labels follow L180_HomePage Wireframe.png + xlsx sheet 05_Sitemap.

  Optional cta-split="true": renders the navbar CTA as a split button - a
  main "Book AI Audit" action plus a caret revealing a second "Request a
  Pilot" action. Off by default (single "Book Free AI Audit" button); opt in
  per page.
*/
(function () {
  // Every page climbs back to the site root, then every link is built as a
  // full root-relative path from there - correct at any folder depth without
  // per-depth special-casing. The climb-back prefix can't be read from
  // window.location.pathname: opened via file://, that's the full OS path
  // (e.g. /C:/Users/.../about/index.html), not a site-relative one. Instead
  // it's read off this very script's own src attribute, which every page
  // already links correctly (e.g. "../assets/js/components/navbar.js") -
  // so it's guaranteed right, since if it weren't, the script couldn't have
  // loaded in the first place.
  function findUp() {
    const script =
      document.currentScript ||
      document.querySelector('script[src*="components/navbar.js"]');
    const src = script ? script.getAttribute('src') : './assets/js/components/navbar.js';
    return src.replace(/assets\/js\/components\/navbar\.js.*$/, '');
  }
  const UP = findUp();
  const to = (path) => UP + path;

  const NAV_LINKS = [
    { label: 'Home', href: to('index.html'), key: 'home' },
    {
      label: 'Services',
      href: to('services/index.html'),
      key: 'services',
      dropdown: [
        { label: 'AI Strategy', href: to('services/ai-strategy/index.html') },
        { label: 'AI Development', href: to('services/ai-development/index.html') },
        { label: 'AI Ops', href: to('services/ai-ops/index.html') },
        { label: 'AI Training', href: to('services/ai-training/index.html') },
      ],
    },
    { label: 'Our Work', href: to('work/index.html'), key: 'work' },
    { label: 'About', href: to('about/index.html'), key: 'about' },
    { label: 'Contact', href: to('contact/index.html'), key: 'contact' },
  ];

  // Life180 Labs mark: two interlocking navy blades + amber accent square.
  window.L180_LOGO_MARK = function (opts) {
    const o = opts || {};
    const body = o.body || '#1B2A3D';
    const amber = o.amber || '#F7920A';
    return `
    <svg class="l180-logo-mark" viewBox="0 0 46 58" fill="none" aria-hidden="true">
      <path d="M4 11 11.5 5 19 11v33.5L11.5 51 4 45.5V11Z" fill="${body}"/>
      <path d="M27 5.5 40.5 11v18.5L33.5 35 27 29.5V5.5Z" fill="${body}"/>
      <path d="M24 39.5 31.5 34 39 39.5v13L31.5 58 24 52.5v-13Z" fill="${body}"/>
      <path d="M23.5 31.5 40.5 24v10.5l-17 7.5V31.5Z" fill="${amber}"/>
    </svg>`;
  };

  function chevronSvg() {
    return `<svg class="l180-navbar__chevron" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 5.5 7 9.5 11 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function rocketSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.4c3.7 2.7 5.7 6.5 5.7 10.6l-2.9 3.5H9.2l-2.9-3.5C6.3 8.9 8.3 5.1 12 2.4Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="9.6" r="2.1" stroke="currentColor" stroke-width="1.7"/>
      <path d="M9.2 16.5 6 19.2v2.6l3.7-1.4M14.8 16.5l3.2 2.7v2.6l-3.7-1.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function headsetSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="2.6" y="13" width="4.4" height="6.4" rx="1.8" stroke="currentColor" stroke-width="1.7"/>
      <rect x="17" y="13" width="4.4" height="6.4" rx="1.8" stroke="currentColor" stroke-width="1.7"/>
      <path d="M19.2 19.4v.6a3 3 0 0 1-3 3h-3.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function arrowSvg(size) {
    const s = size || 16;
    return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function renderDesktopLink(item, current) {
    const isCurrent = item.key === current;
    if (item.dropdown) {
      const items = item.dropdown
        .map((d) => `<a class="l180-navbar__dropdown-link" href="${d.href}">${d.label}</a>`)
        .join('');
      return `
        <li class="l180-navbar__item l180-navbar__item--dropdown" data-open="false">
          <button class="l180-navbar__link${isCurrent ? ' is-current' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
            ${item.label}${chevronSvg()}
          </button>
          <div class="l180-navbar__dropdown" role="menu">${items}</div>
        </li>`;
    }
    return `
      <li class="l180-navbar__item">
        <a class="l180-navbar__link${isCurrent ? ' is-current' : ''}" href="${item.href}" ${isCurrent ? 'aria-current="page"' : ''}>${item.label}</a>
      </li>`;
  }

  function renderMobileLink(item, current) {
    const isCurrent = item.key === current;
    if (item.dropdown) {
      const items = item.dropdown
        .map((d) => `<a class="l180-navbar__dropdown-link" href="${d.href}">${d.label}</a>`)
        .join('');
      return `
        <button class="l180-navbar__panel-link l180-navbar__accordion" type="button" aria-expanded="false">
          ${item.label}${chevronSvg()}
        </button>
        <div class="l180-navbar__accordion-panel">${items}</div>`;
    }
    return `<a class="l180-navbar__panel-link${isCurrent ? ' is-current' : ''}" href="${item.href}" ${isCurrent ? 'aria-current="page"' : ''}>${item.label}</a>`;
  }

  class SiteNavbar extends HTMLElement {
    connectedCallback() {
      const current = this.getAttribute('current') || '';
      this.innerHTML = this.template(current);
      this.wire();
    }

    template(current) {
      const desktopLinks = NAV_LINKS.map((l) => renderDesktopLink(l, current)).join('');
      const mobileLinks = NAV_LINKS.map((l) => renderMobileLink(l, current)).join('');
      const homeLink = NAV_LINKS[0].href;
      // cta-audit-href lets a page point the "Book AI Audit" CTA at the
      // dedicated /ai-audit landing page instead of the default contact-form
      // anchor. Opt-in so every page that doesn't pass it keeps today's link.
      const contactLink = this.getAttribute('cta-audit-href') || to('contact/index.html') + '#audit';
      // Opt-in split CTA (main action + caret revealing two secondary actions).
      // Off by default - set cta-split="true" on <site-navbar> to enable it
      // on a given page without touching every other page's single button.
      const splitCta = this.getAttribute('cta-split') === 'true';
      const pilotLink = to('startup-ai-ops/index.html') + '#pilot';
      const expertLink = to('talk-to-expert/index.html');

      const desktopCta = splitCta
        ? `
          <div class="l180-navbar__cta-split" data-open="false">
            <a class="btn btn-primary l180-navbar__cta l180-navbar__cta-main" href="${contactLink}">Book AI Audit</a>
            <button class="l180-navbar__cta-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="More ways to get started">
              ${chevronSvg()}
            </button>
            <div class="l180-navbar__dropdown l180-navbar__dropdown--cta" role="menu">
              <a class="l180-navbar__cta-option" href="${expertLink}" role="menuitem">
                <span class="l180-navbar__cta-option-icon" aria-hidden="true">${headsetSvg()}</span>
                <span class="l180-navbar__cta-option-text">
                  <span class="l180-navbar__cta-option-title">Talk to an Expert</span>
                  <span class="l180-navbar__cta-option-sub">Free 20-minute call</span>
                </span>
                ${arrowSvg(14)}
              </a>
              <a class="l180-navbar__cta-option" href="${pilotLink}" role="menuitem">
                <span class="l180-navbar__cta-option-icon" aria-hidden="true">${rocketSvg()}</span>
                <span class="l180-navbar__cta-option-text">
                  <span class="l180-navbar__cta-option-title">Request a Pilot</span>
                  <span class="l180-navbar__cta-option-sub">For AI startups</span>
                </span>
                ${arrowSvg(14)}
              </a>
            </div>
          </div>`
        : `
          <a class="btn btn-primary l180-navbar__cta" href="${contactLink}">
            Book Free AI Audit${arrowSvg(15)}
          </a>`;

      const mobileCta = splitCta
        ? `
          <a class="btn btn-primary" href="${contactLink}">Book AI Audit${arrowSvg(15)}</a>
          <a class="btn btn-secondary" href="${expertLink}">Talk to an Expert${arrowSvg(15)}</a>
          <a class="btn btn-secondary" href="${pilotLink}">Request a Pilot${arrowSvg(15)}</a>`
        : `<a class="btn btn-primary" href="${contactLink}">Book Free AI Audit${arrowSvg(15)}</a>`;

      return `
        <div class="container l180-navbar__bar">
          <a class="l180-logo" href="${homeLink}" aria-label="Life180 Labs - Home">
            ${window.L180_LOGO_MARK()}
            <span class="l180-logo__word"><span>LIFE180</span><span>LABS</span></span>
          </a>

          <nav class="l180-navbar__nav" aria-label="Primary">
            <ul class="l180-navbar__links">${desktopLinks}</ul>
          </nav>

          ${desktopCta}

          <button class="l180-navbar__toggle" type="button" aria-expanded="false" aria-controls="l180-navbar-panel" aria-label="Open menu">
            <span class="l180-navbar__toggle-icon"></span>
          </button>
        </div>

        <div class="l180-navbar__panel" id="l180-navbar-panel">
          <nav aria-label="Primary mobile">${mobileLinks}</nav>
          <div class="l180-navbar__panel-cta">${mobileCta}</div>
        </div>`;
    }

    wire() {
      const root = this;
      const nav = this;
      nav.classList.add('l180-navbar');

      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 4);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      // Shared hover/click/outside-click/Escape wiring for any trigger+panel
      // pair that opens via a `data-open` attribute on `item` - used by both
      // the "Services" nav dropdown and the opt-in split CTA's caret menu.
      // `hoverEls` defaults to the whole item (Services: hovering the label
      // opens it); the split CTA passes just the caret + panel, so hovering
      // the main "Book AI Audit" button does not open the menu.
      const dropdownClosers = [];
      function wireDropdown(item, btn, hoverEls) {
        const open = (state) => {
          item.dataset.open = state ? 'true' : 'false';
          btn.setAttribute('aria-expanded', state ? 'true' : 'false');
        };
        let hoverTimer;
        (hoverEls || [item]).forEach((el) => {
          el.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) { clearTimeout(hoverTimer); open(true); }
          });
          el.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover)').matches) { hoverTimer = setTimeout(() => open(false), 120); }
          });
        });
        btn.addEventListener('click', () => open(item.dataset.open !== 'true'));
        item.addEventListener('keydown', (e) => { if (e.key === 'Escape') { open(false); btn.focus(); } });
        dropdownClosers.push(() => open(false));
      }

      root.querySelectorAll('.l180-navbar__item--dropdown').forEach((item) => {
        wireDropdown(item, item.querySelector('button.l180-navbar__link'));
      });

      const ctaSplit = root.querySelector('.l180-navbar__cta-split');
      if (ctaSplit) {
        const ctaToggle = ctaSplit.querySelector('.l180-navbar__cta-toggle');
        const ctaPanel = ctaSplit.querySelector('.l180-navbar__dropdown--cta');
        wireDropdown(ctaSplit, ctaToggle, [ctaToggle, ctaPanel]);
      }

      document.addEventListener('click', (e) => {
        if (!root.contains(e.target)) dropdownClosers.forEach((close) => close());
      });

      const toggle = root.querySelector('.l180-navbar__toggle');
      toggle.addEventListener('click', () => {
        const isOpen = nav.getAttribute('data-menu-open') === 'true';
        nav.setAttribute('data-menu-open', isOpen ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      root.querySelectorAll('.l180-navbar__accordion').forEach((acc) => {
        acc.addEventListener('click', () => {
          const isOpen = acc.getAttribute('aria-expanded') === 'true';
          acc.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
          acc.dataset.open = isOpen ? 'false' : 'true';
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.getAttribute('data-menu-open') === 'true') {
          nav.setAttribute('data-menu-open', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
          document.body.style.overflow = '';
        }
      });
    }
  }

  customElements.define('site-navbar', SiteNavbar);
})();
