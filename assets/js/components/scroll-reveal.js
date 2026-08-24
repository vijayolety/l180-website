/*
  Scroll-in reveal for any element marked data-reveal (paired with the CSS
  in tokens.css). Fades + rises each element once, the first time it enters
  the viewport - no re-triggering on scroll back up, keeps it subtle.

  Progressive enhancement: elements are visible without this script (the
  reveal CSS only takes effect once JS adds the "is-visible" class via the
  observer, but if this script fails to load the [data-reveal] opacity:0
  rule would otherwise hide content - guarded below by adding is-visible
  immediately as a fallback if IntersectionObserver isn't available, and by
  respecting prefers-reduced-motion outright).
*/
(function () {
  function reveal(el) {
    el.classList.add('is-visible');
  }

  function init() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    // Defensive fallback: if the observer never fires for some reason (a
    // browser quirk, an element the layout engine can't measure yet), don't
    // leave content invisible forever - reveal anything still hidden after
    // a few seconds.
    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(reveal);
    }, 3000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
