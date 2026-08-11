/*
  <site-breadcrumbs trail='[{"label":"Services","href":"/services"},{"label":"AI Development"}]'></site-breadcrumbs>
  Reusable breadcrumb trail + matching BreadcrumbList JSON-LD.
  Not used on the homepage (it's the sitemap root) - available for inner pages
  when they're built.
*/
(function () {
  class SiteBreadcrumbs extends HTMLElement {
    connectedCallback() {
      let trail = [];
      try {
        trail = JSON.parse(this.getAttribute('trail') || '[]');
      } catch (e) {
        trail = [];
      }
      if (!trail.length) return;

      const origin = window.location.origin;
      const items = [{ label: 'Home', href: '/' }, ...trail];

      const listHtml = items
        .map((item, i) => {
          const isLast = i === items.length - 1;
          const inner = isLast || !item.href
            ? `<span aria-current="page">${item.label}</span>`
            : `<a href="${item.href}">${item.label}</a>`;
          const sep = isLast ? '' : '<span class="l180-breadcrumbs__sep" aria-hidden="true">/</span>';
          return `<li class="l180-breadcrumbs__item">${inner}${sep}</li>`;
        })
        .join('');

      this.innerHTML = `<nav class="l180-breadcrumbs" aria-label="Breadcrumb"><ol>${listHtml}</ol></nav>`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          item: item.href ? origin + item.href : window.location.href,
        })),
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      this.appendChild(script);
    }
  }

  customElements.define('site-breadcrumbs', SiteBreadcrumbs);
})();
