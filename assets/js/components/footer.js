/*
  <site-footer></site-footer>
  Reusable global footer + the inset dark CTA banner card that sits directly
  above it (repeats on every page per L180_HomePage Wireframe.png).
  Note: the footer surface is the light canvas - only the CTA banner is navy.
*/
(function () {
  const SOCIALS = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/life180labs',
      path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.03-3-1.83-3-1.83 0-2.12 1.43-2.12 2.9V21h-4V9Z',
    },
    {
      label: 'Twitter',
      href: 'https://x.com/life180labs',
      path: 'M22 5.9c-.73.33-1.52.55-2.35.65a4.1 4.1 0 0 0 1.8-2.27c-.79.47-1.67.81-2.6 1a4.09 4.09 0 0 0-7.03 3.73A11.6 11.6 0 0 1 3.4 4.73a4.09 4.09 0 0 0 1.27 5.46 4.05 4.05 0 0 1-1.85-.51v.05a4.09 4.09 0 0 0 3.28 4.01c-.6.16-1.23.19-1.85.07a4.1 4.1 0 0 0 3.82 2.84A8.2 8.2 0 0 1 2 18.4a11.57 11.57 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.67l-.01-.53c.8-.58 1.5-1.3 2.04-2.13Z',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@life180labs',
      path: 'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/life180labs',
      path: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5.01 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
    },
  ];

  // Same approach as navbar.js: read the climb-back-to-root prefix off this
  // script's own src attribute rather than window.location.pathname, which
  // under file:// is the full OS path, not a site-relative one.
  function findUp() {
    const script =
      document.currentScript ||
      document.querySelector('script[src*="components/footer.js"]');
    const src = script ? script.getAttribute('src') : './assets/js/components/footer.js';
    return src.replace(/assets\/js\/components\/footer\.js.*$/, '');
  }
  const UP = findUp();
  const to = (path) => UP + path;

  const FOOTER_COLUMNS = [
    {
      title: 'Services',
      links: [
        { label: 'AI Strategy', href: to('services/ai-strategy/index.html') },
        { label: 'AI Development', href: to('services/ai-development/index.html') },
        { label: 'AI Ops', href: to('services/ai-ops/index.html') },
        { label: 'AI Training', href: to('services/ai-training/index.html') },
      ],
    },
    { title: 'AI Startups', links: [{ label: 'Startup AI Ops Hub', href: to('startup-ai-ops/index.html') }] },
    {
      title: 'Company',
      links: [
        { label: 'About', href: to('about/index.html') },
        { label: 'Our Work', href: to('work/index.html') },
        { label: 'Contact', href: to('contact/index.html') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: to('privacy/index.html') },
        { label: 'Terms of Service', href: to('terms/index.html') },
      ],
    },
  ];

  function arrow() {
    return `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function socialIcons() {
    return SOCIALS.map(
      (s) => `<a href="${s.href}" aria-label="Life180 Labs on ${s.label}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${s.path}"/></svg>
      </a>`
    ).join('');
  }

  function columns(current) {
    return FOOTER_COLUMNS.map(
      (col) => `<div class="l180-footer__col">
        <p class="l180-footer__col-title">${col.title}</p>
        <nav aria-label="${col.title}">
          <ul>${col.links
            .map((l) => {
              const isCurrent = current && l.href === current;
              return `<li><a href="${l.href}"${isCurrent ? ' class="is-current" aria-current="page"' : ''}>${l.label}</a></li>`;
            })
            .join('')}</ul>
        </nav>
      </div>`
    ).join('');
  }

  /*
    Decorative dotted mesh in the bottom-right of the CTA banner (all four
    Aug-11 service mockups). Deterministic - concentric arcs of dots swept
    around a centre just outside the banner's bottom-right corner.
  */
  function ctaMesh() {
    const cx = 330;
    const cy = 214;
    let dots = '';
    for (let r = 58, band = 0; r <= 312; r += 21, band++) {
      const step = 4.6 - Math.min(2.6, r / 150); // denser dots on the outer arcs
      for (let a = 148; a <= 268; a += step) {
        const rad = (a * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        if (x < -6 || y < -6) continue;
        const orange = (band + Math.round(a)) % 7 === 0;
        const fade = 0.22 + 0.55 * Math.abs(Math.sin(((a - 148) / 120) * Math.PI));
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${orange ? 1.5 : 1.2}" fill="${
          orange ? '#F7920A' : '#5DACFF'
        }" opacity="${fade.toFixed(2)}"/>`;
      }
    }
    return `<span class="l180-cta__mesh" aria-hidden="true">
      <svg viewBox="0 0 320 214" preserveAspectRatio="xMaxYMid slice">${dots}</svg>
    </span>`;
  }

  class SiteFooter extends HTMLElement {
    /*
      Optional attributes (all default to the homepage banner):
        current            href of the footer link to mark as the active page
        cta-heading        banner headline (use \n for a line break)
        cta-lead           supporting line under the headline
        cta-primary        primary button label
        cta-primary-href   primary button target
        cta-primary-note   caption under the primary button
        cta-secondary      secondary button label
        cta-secondary-href secondary button target
        cta-secondary-note caption under the secondary button
        cta-full           "true" renders the banner full-bleed (AI Development)
    */
    connectedCallback() {
      const mark = window.L180_LOGO_MARK ? window.L180_LOGO_MARK() : '';
      const attr = (name, fallback) => this.getAttribute(name) || fallback;

      const heading = attr('cta-heading', "Let's build AI systems that\ndrive real business value.")
        .split('\n')
        .join('<br>');
      const lead = this.getAttribute('cta-lead');
      const primary = attr('cta-primary', 'Book Free AI Audit');
      const primaryHref = attr('cta-primary-href', to('contact/index.html') + '#audit');
      const primaryNote = this.getAttribute('cta-primary-note');
      const secondary = attr('cta-secondary', 'Request a Pilot');
      const secondaryHref = attr('cta-secondary-href', to('startup-ai-ops/index.html') + '#pilot');
      const secondaryNote = this.getAttribute('cta-secondary-note');
      const isFull = this.getAttribute('cta-full') === 'true';
      const hasNotes = Boolean(primaryNote || secondaryNote);

      const action = (cls, href, labelText, note) => {
        const btn = `<a class="btn ${cls}" href="${href}">${labelText}${arrow()}</a>`;
        return note ? `<div class="l180-cta__action">${btn}<small>${note}</small></div>` : btn;
      };

      this.innerHTML = `
        <section class="l180-cta${isFull ? ' l180-cta--full' : ''}" aria-labelledby="l180-cta-heading">
          <div class="container-flush">
            <div class="l180-cta__card">
              <span class="l180-cta__wave" aria-hidden="true"></span>
              ${hasNotes ? ctaMesh() : ''}
              <div class="l180-cta__text">
                <span class="l180-cta__icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="#fff" stroke-width="1.6"/>
                    <path d="M8 3v4M16 3v4M3.5 10h17" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
                    <path d="m9.5 14.5 2 2 3.5-4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <div>
                  <h2 id="l180-cta-heading">${heading}</h2>
                  ${lead ? `<p class="l180-cta__lead">${lead.split('\n').join('<br>')}</p>` : ''}
                </div>
              </div>
              <div class="l180-cta__actions">
                ${action('btn-primary', primaryHref, primary, primaryNote)}
                ${action('btn-outline-inverse', secondaryHref, secondary, secondaryNote)}
              </div>
            </div>
          </div>
        </section>

        <footer class="l180-footer" role="contentinfo">
          <div class="container">
            <div class="l180-footer__grid">
              <div class="l180-footer__brand">
                <a class="l180-logo" href="${to('index.html')}" aria-label="Life180 Labs - Home">
                  ${mark}
                  <span class="l180-logo__word"><span>LIFE180</span><span>LABS</span></span>
                </a>
                <p class="l180-footer__desc">We design, build, and operate AI systems that drive real business value.</p>
                <div class="l180-footer__social">${socialIcons()}</div>
              </div>
              ${columns(this.getAttribute('current'))}
            </div>
            <div class="l180-footer__bottom">
              <p>&copy; 2026 Life180 Labs. All rights reserved.</p>
              <p>Built in India. Serving globally.</p>
            </div>
          </div>
        </footer>`;
    }
  }

  customElements.define('site-footer', SiteFooter);
})();
