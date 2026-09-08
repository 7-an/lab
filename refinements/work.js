/* CSS owns the regular grid; this controller owns interactive project media. */
(() => {
  const grid = document.querySelector('.showcase .prows-inner');
  if (!grid) return;
  // Original VOIDTYPE renderer, loaded only for the visible interactive project.
  const wordmark = grid.querySelector('[data-wordmark]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(min-width: 760px) and (hover:hover) and (pointer:fine)');
  if (wordmark && pointer.matches && !motion.matches && !document.documentElement.hasAttribute('data-reduced') && new URLSearchParams(location.search).get('motion') !== 'reduce') {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      import('./voidtype.js?v=15').catch(() => { /* The linked project cover remains available. */ });
    }, { rootMargin: '80px' });
    observer.observe(wordmark);
  }
  const rows = [...grid.querySelectorAll('.prow')];

  rows.forEach(row => {
    const images = [...row.querySelectorAll('[data-preview-image]')];
    const thumbs = [...row.querySelectorAll('[data-thumb]')];
    thumbs.forEach((thumb, selected) => {
      thumb.addEventListener('click', () => {
        images.forEach((image, index) => {
          image.classList.toggle('is-active', index === selected);
          image.setAttribute('aria-hidden', String(index !== selected));
        });
        thumbs.forEach((button, index) => {
          button.classList.toggle('is-active', index === selected);
          button.setAttribute('aria-pressed', String(index === selected));
        });
      });
    });
  });
})();
