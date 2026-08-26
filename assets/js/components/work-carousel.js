/*
  Featured Work carousel (homepage). Peek-style horizontal scroller: prev/next
  buttons and dots scroll the track by one card via native scroll-snap, so
  the last card is always partially visible at the edge.

  Progressive enhancement: the viewport is overflow-x:auto in CSS regardless
  of JS, so cards stay swipeable/scrollable with JS disabled - the buttons
  and dots just don't wire up.

  Card art comes from work-art.js (window.L180_WORK_ART) - load that script
  before this one.
*/
(function () {
  function paintArt(root) {
    root.querySelectorAll('.work-card__art[data-art]').forEach((el) => {
      const build = window.L180_WORK_ART && window.L180_WORK_ART[el.getAttribute('data-art')];
      if (build) el.innerHTML = build();
    });
  }

  function initCarousel(root) {
    paintArt(root);

    // The prev/next buttons live in .featured-work__controls, a sibling of
    // this carousel root (both children of .featured-work) - not a
    // descendant of it, so they have to be looked up from the shared
    // parent instead of `root` itself.
    const scope = root.parentElement || root;

    const viewport = root.querySelector('.work-carousel__viewport');
    const track = root.querySelector('.work-carousel__track');
    const dotsWrap = root.querySelector('.work-carousel__dots');
    const prev = scope.querySelector('.work-carousel__nav--prev');
    const next = scope.querySelector('.work-carousel__nav--next');
    const cards = Array.prototype.slice.call(track.querySelectorAll('.work-card'));
    if (!viewport || !cards.length) return;

    const dots = cards.map((card, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      const h = card.querySelector('h3');
      b.setAttribute('aria-label', h ? 'Go to ' + h.textContent.trim() : 'Slide ' + (i + 1));
      b.addEventListener('click', () => scrollToCard(i));
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function scrollToCard(i) {
      const card = cards[Math.max(0, Math.min(cards.length - 1, i))];
      // Deliberately instant (no `behavior: 'smooth'`, no CSS
      // scroll-behavior) - combined with scroll-snap-type on the
      // viewport, smooth scrolling was unreliable across browsers and
      // the prev/next buttons would silently do nothing.
      viewport.scrollTo({ left: card.offsetLeft - track.offsetLeft });
    }

    function nearestIndex() {
      const scrollLeft = viewport.scrollLeft;
      let closest = 0;
      let min = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
        if (d < min) { min = d; closest = i; }
      });
      return closest;
    }

    let ticking = false;
    function updateUI() {
      ticking = false;
      const i = nearestIndex();
      dots.forEach((d, n) => d.setAttribute('aria-current', n === i ? 'true' : 'false'));
      if (prev) prev.disabled = viewport.scrollLeft <= 4;
      if (next) next.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 4;
    }

    if (prev) prev.addEventListener('click', () => scrollToCard(nearestIndex() - 1));
    if (next) next.addEventListener('click', () => scrollToCard(nearestIndex() + 1));

    viewport.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateUI);
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', updateUI);

    root.classList.add('is-enhanced');
    updateUI();
  }

  function boot() {
    document.querySelectorAll('.work-carousel[data-carousel]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
