/*
  Renders an uploaded PDF as an auto-playing slideshow - page dots at the
  bottom to jump to a page manually, same footprint as the static SVG card
  art it replaces. Auto-advances on a timer; a manual dot click resets that
  timer so it doesn't fight the user right after a click. No prev/next
  buttons (removed - see git history for why).
  Loads PDF.js from a CDN on first use, shared across every slideshow on
  the page - most items still use the plain SVG art from work-art.js, so
  this only loads when actually needed.
*/
(function () {
  // 3.11.174 (the previous pinned version) had a rendering bug that drew a
  // large white X-shaped artifact on some PDFs - confirmed not present in
  // the same file opened in a real browser's native PDF viewer, so it was
  // a PDF.js bug, not the PDF's content. 6.x also dropped the old UMD
  // <script> build in favor of ES modules only, hence the dynamic import()
  // below instead of a <script src> tag.
  const PDFJS_VERSION = '6.2.108';
  const PDFJS_SRC = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
  const PDFJS_WORKER_SRC = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
  const SLIDE_INTERVAL_MS = 4000;

  let pdfjsReadyPromise = null;
  function loadPdfJs() {
    if (pdfjsReadyPromise) return pdfjsReadyPromise;
    pdfjsReadyPromise = (async () => {
      const pdfjsLib = await import(/* webpackIgnore: true */ PDFJS_SRC);
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
      return pdfjsLib;
    })();
    return pdfjsReadyPromise;
  }

  // A render() call that never resolves (seen in some sandboxed/automated
  // browser contexts) would otherwise leave a permanently blank canvas with
  // no feedback - race it against a timeout so a real fallback shows instead.
  function withTimeout(promise, ms, message) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
    ]);
  }

  function showError(container, pdfUrl) {
    container.innerHTML = `<div class="wrk-pdf__error">
      <p>Couldn't load the PDF preview.</p>
      <a href="${pdfUrl}" target="_blank" rel="noopener">Open the PDF directly</a>
    </div>`;
  }

  async function mount(container, pdfUrl) {
    // Wraps in its own positioned child (like the SVG art does) rather than
    // making the container itself position:absolute - the container is a
    // CSS grid item, and position:absolute on a grid item pulls it out of
    // the grid's own layout track.
    container.innerHTML = `
      <div class="wrk-pdf">
        <div class="wrk-pdf__stage">
          <span class="wrk-pdf__loading">Loading preview&hellip;</span>
          <canvas class="wrk-pdf__canvas" hidden></canvas>
        </div>
        <div class="wrk-pdf__controls" hidden>
          <div class="wrk-pdf__dots"></div>
        </div>
      </div>`;

    const canvas = container.querySelector('.wrk-pdf__canvas');
    const loading = container.querySelector('.wrk-pdf__loading');
    const controls = container.querySelector('.wrk-pdf__controls');
    const dotsWrap = container.querySelector('.wrk-pdf__dots');

    try {
      const pdfjsLib = await withTimeout(loadPdfJs(), 10000, 'PDF viewer took too long to load.');
      const doc = await withTimeout(
        pdfjsLib.getDocument({ url: pdfUrl }).promise,
        15000,
        'PDF took too long to load.'
      );
      let pageNum = 1;
      let rendering = false;
      let dots = [];
      let timer = null;

      function startAutoplay() {
        if (timer) clearInterval(timer);
        if (doc.numPages <= 1) return;
        timer = setInterval(() => goTo(pageNum >= doc.numPages ? 1 : pageNum + 1), SLIDE_INTERVAL_MS);
      }

      async function renderPage(n) {
        if (rendering) return;
        rendering = true;
        try {
          const page = await doc.getPage(n);
          const stageWidth = canvas.parentElement.clientWidth || 320;
          const stageHeight = canvas.parentElement.clientHeight || 220;
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = Math.min(stageWidth / baseViewport.width, stageHeight / baseViewport.height);
          const viewport = page.getViewport({ scale: scale > 0 ? scale : 1 });

          // Render at the screen's actual pixel density (Retina/HiDPI), not
          // just CSS pixels, so text stays sharp instead of looking blurry
          // when the canvas is displayed larger than its backing resolution.
          const dpr = window.devicePixelRatio || 1;
          canvas.width = Math.round(viewport.width * dpr);
          canvas.height = Math.round(viewport.height * dpr);
          canvas.style.width = viewport.width + 'px';
          canvas.style.height = viewport.height + 'px';
          const ctx = canvas.getContext('2d');
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          await withTimeout(
            page.render({ canvasContext: ctx, viewport }).promise,
            15000,
            'PDF page took too long to render.'
          );
          canvas.hidden = false;
          loading.hidden = true;
          dots.forEach((d, i) => d.setAttribute('aria-current', i + 1 === n ? 'true' : 'false'));
        } finally {
          rendering = false;
        }
      }

      // Manual nav resets the autoplay timer so it doesn't jump again right
      // after the user just clicked/jumped somewhere themselves.
      function goTo(n, fromUser) {
        pageNum = ((n - 1 + doc.numPages) % doc.numPages) + 1;
        renderPage(pageNum);
        if (fromUser) startAutoplay();
      }

      if (doc.numPages > 1) {
        dots = Array.from({ length: doc.numPages }, (_, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Go to page ' + (i + 1));
          b.addEventListener('click', () => goTo(i + 1, true));
          dotsWrap.appendChild(b);
          return b;
        });
        controls.hidden = false;
      }

      await renderPage(pageNum);
      startAutoplay();
    } catch (err) {
      showError(container, pdfUrl);
    }
  }

  window.L180_PDF_SLIDESHOW = { mount };
})();
