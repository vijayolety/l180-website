/*
  <site-navbar current="home"></site-navbar>
  Reusable global navbar. No build step required - drop the tag on any page,
  link tokens.css + navbar.css + this script, and pass a `current` attribute
  matching one of: home, services, startups, work, about, contact.
  Nav order/labels follow L180_HomePage Wireframe.png + xlsx sheet 05_Sitemap.
*/
(function () {
  const NAV_LINKS = [
    { label: 'Home', href: '/', key: 'home' },
    {
      label: 'Services',
      href: '/services',
      key: 'services',
      dropdown: [
        { label: 'AI Strategy', href: '/services/ai-strategy' },
        { label: 'AI Development', href: '/services/ai-development' },
        { label: 'AI Ops', href: '/services/ai-ops' },
        { label: 'AI Training', href: '/services/ai-training' },
      ],
    },
    { label: 'AI Startups', href: '/startup-ai-ops', key: 'startups' },
    { label: 'Our Work', href: '/work', key: 'work' },
    { label: 'About', href: '/about', key: 'about' },
    { label: 'Contact', href: '/contact', key: 'contact' },
  ];

  // Life180 Labs mark: two interlocking navy blades + amber accent square.
  window.L180_LOGO_MARK = function (opts) {
    const o = opts || {};
    const body = o.body || '#1B2A3D';
    const amber = o.amber || '#E8A838';
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
      return `
        <div class="container l180-navbar__bar">
          <a class="l180-logo" href="/" aria-label="Life180 Labs - Home">
            ${window.L180_LOGO_MARK()}
            <span class="l180-logo__word"><span>LIFE180</span><span>LABS</span></span>
          </a>

          <nav class="l180-navbar__nav" aria-label="Primary">
            <ul class="l180-navbar__links">${desktopLinks}</ul>
          </nav>

          <a class="btn btn-primary l180-navbar__cta" href="/contact#audit">
            Book Free AI Audit${arrowSvg(15)}
          </a>

          <button class="l180-navbar__toggle" type="button" aria-expanded="false" aria-controls="l180-navbar-panel" aria-label="Open menu">
            <span class="l180-navbar__toggle-icon"></span>
          </button>
        </div>

        <div class="l180-navbar__panel" id="l180-navbar-panel">
          <nav aria-label="Primary mobile">${mobileLinks}</nav>
          <div class="l180-navbar__panel-cta">
            <a class="btn btn-primary" href="/contact#audit">Book Free AI Audit${arrowSvg(15)}</a>
          </div>
        </div>`;
    }

    wire() {
      const root = this;
      const nav = this;
      nav.classList.add('l180-navbar');

      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 4);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      root.querySelectorAll('.l180-navbar__item--dropdown').forEach((item) => {
        const btn = item.querySelector('button.l180-navbar__link');
        const open = (state) => {
          item.dataset.open = state ? 'true' : 'false';
          btn.setAttribute('aria-expanded', state ? 'true' : 'false');
        };
        let hoverTimer;
        item.addEventListener('mouseenter', () => {
          if (window.matchMedia('(hover: hover)').matches) { clearTimeout(hoverTimer); open(true); }
        });
        item.addEventListener('mouseleave', () => {
          if (window.matchMedia('(hover: hover)').matches) { hoverTimer = setTimeout(() => open(false), 120); }
        });
        btn.addEventListener('click', () => open(item.dataset.open !== 'true'));
        item.addEventListener('keydown', (e) => { if (e.key === 'Escape') { open(false); btn.focus(); } });
      });

      document.addEventListener('click', (e) => {
        if (!root.contains(e.target)) {
          root.querySelectorAll('.l180-navbar__item--dropdown').forEach((item) => {
            item.dataset.open = 'false';
            item.querySelector('button').setAttribute('aria-expanded', 'false');
          });
        }
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
