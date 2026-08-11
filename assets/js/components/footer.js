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

  const FOOTER_COLUMNS = [
    {
      title: 'Services',
      links: [
        { label: 'AI Strategy', href: '/services/ai-strategy' },
        { label: 'AI Development', href: '/services/ai-development' },
        { label: 'AI Ops', href: '/services/ai-ops' },
        { label: 'AI Training', href: '/services/ai-training' },
      ],
    },
    { title: 'AI Startups', links: [{ label: 'Startup AI Ops Hub', href: '/startup-ai-ops' }] },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Our Work', href: '/work' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
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

  function columns() {
    return FOOTER_COLUMNS.map(
      (col) => `<div class="l180-footer__col">
        <p class="l180-footer__col-title">${col.title}</p>
        <nav aria-label="${col.title}">
          <ul>${col.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
        </nav>
      </div>`
    ).join('');
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const mark = window.L180_LOGO_MARK ? window.L180_LOGO_MARK() : '';
      this.innerHTML = `
        <section class="l180-cta" aria-labelledby="l180-cta-heading">
          <div class="container-flush">
            <div class="l180-cta__card">
              <span class="l180-cta__wave" aria-hidden="true"></span>
              <div class="l180-cta__text">
                <span class="l180-cta__icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="#fff" stroke-width="1.6"/>
                    <path d="M8 3v4M16 3v4M3.5 10h17" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
                    <path d="m9.5 14.5 2 2 3.5-4" stroke="#E8A838" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <h2 id="l180-cta-heading">Let's build AI systems that<br>drive real business value.</h2>
              </div>
              <div class="l180-cta__actions">
                <a class="btn btn-primary" href="/contact#audit">Book Free AI Audit${arrow()}</a>
                <a class="btn btn-outline-inverse" href="/startup-ai-ops#pilot">Request a Pilot${arrow()}</a>
              </div>
            </div>
          </div>
        </section>

        <footer class="l180-footer" role="contentinfo">
          <div class="container">
            <div class="l180-footer__grid">
              <div class="l180-footer__brand">
                <a class="l180-logo" href="/" aria-label="Life180 Labs - Home">
                  ${mark}
                  <span class="l180-logo__word"><span>LIFE180</span><span>LABS</span></span>
                </a>
                <p class="l180-footer__desc">We design, build, and operate AI systems that drive real business value.</p>
                <div class="l180-footer__social">${socialIcons()}</div>
              </div>
              ${columns()}
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
