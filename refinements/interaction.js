/* One owner for shared feedback. The original character field and globe stay intact. */
(() => {
  const root = document.documentElement;
  const mediaPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => mediaPreference.matches || root.hasAttribute('data-reduced') || new URLSearchParams(location.search).get('motion') === 'reduce';
  const chinese = () => root.lang === 'zh-CN';
  if (new URLSearchParams(location.search).get('motion') === 'reduce') root.setAttribute('data-reduced', '');
  function syncAccessibleLabels() {
    document.querySelector('.about-chapter-nav')?.setAttribute('aria-label', chinese() ? '本页章节' : 'On this page');
    document.querySelector('.contact-channels')?.setAttribute('aria-label', chinese() ? '联系方式' : 'Contact channels');
  }
  syncAccessibleLabels();
  new MutationObserver(syncAccessibleLabels).observe(root, { attributes: true, attributeFilter: ['lang'] });

  const masks = [...document.querySelectorAll('[data-mask]')];
  let maskObserver;
  function expose(element) {
    element.classList.remove('mask-pending');
    element.classList.add('mask-open');
    maskObserver?.unobserve(element);
  }
  if (!isReduced() && 'IntersectionObserver' in window) {
    maskObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) expose(entry.target);
    }), { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    masks.forEach(element => {
      element.classList.add('mask-pending');
      maskObserver.observe(element);
      element.addEventListener('focusin', () => expose(element));
    });
  }

  // The hit area stays anchored to the rail; only the circle grows near the pointer.
  document.querySelectorAll('[data-soft-magnet]').forEach(button => {
    const footer = button.closest('.contact-v4');
    let frame = 0, pointer;
    const reset = () => { cancelAnimationFrame(frame); frame = 0; button.style.removeProperty('--contact-scale'); };
    const paint = () => {
      frame = 0;
      if (!pointer || isReduced()) return reset();
      const rail = button.parentElement.getBoundingClientRect();
      const x = rail.left + button.offsetLeft + button.offsetWidth / 2;
      const y = rail.top + rail.height / 2;
      const distance = Math.hypot(pointer.x - x, pointer.y - y);
      const radius = button.offsetWidth / 2;
      const near = Math.max(0, Math.min(1, 1 - (distance - radius) / 110));
      button.style.setProperty('--contact-scale', (1 + .07 * near * near * (3 - 2 * near)).toFixed(4));
    };
    footer?.addEventListener('pointermove', event => {
      if (isReduced() || event.pointerType !== 'mouse' || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
    footer?.addEventListener('pointerleave', reset);
    addEventListener('scroll', reset, { passive: true });
    addEventListener('pagehide', reset);
    mediaPreference.addEventListener('change', reset);
  });

  // Original unlinked photographs open at their natural proportions.
  let dialog, originalFocus, savedOverflow;
  function openPhoto(src, alt, trigger) {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'media-lightbox';
      dialog.setAttribute('aria-labelledby', 'media-lightbox-caption');
      dialog.setAttribute('data-lenis-prevent', '');
      const close = document.createElement('button');
      close.type = 'button';
      const image = document.createElement('img');
      image.addEventListener('load', () => image.classList.toggle('is-document', image.naturalHeight / image.naturalWidth > 1.8));
      const caption = document.createElement('p');
      caption.id = 'media-lightbox-caption';
      dialog.append(close, image, caption);
      document.body.append(dialog);
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') event.stopPropagation();
      });
      dialog.addEventListener('close', () => {
        document.body.style.overflow = savedOverflow;
        originalFocus?.focus({ preventScroll: true });
      });
    }
    if (dialog.open) return;
    originalFocus = trigger;
    savedOverflow = document.body.style.overflow;
    dialog.querySelector('button').textContent = chinese() ? '关闭' : 'Close';
    dialog.querySelector('img').src = src;
    dialog.querySelector('img').classList.remove('is-document');
    dialog.querySelector('img').alt = alt;
    dialog.querySelector('p').textContent = alt || (chinese() ? '现场记录' : 'A moment in the real world');
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const image = link.querySelector('img');
      if (!image || typeof HTMLDialogElement === 'undefined') return;
      event.preventDefault();
      openPhoto(link.href, image.alt, link);
    });
  });
  const galleryFront = document.querySelector('[data-photo-front]');
  const galleryImage = galleryFront?.querySelector('[data-gallery-image]');
  if (galleryImage) {
    const updateGallery = () => {
      const available = !galleryImage.hidden && Boolean(galleryImage.getAttribute('src'));
      galleryFront.toggleAttribute('data-gallery-view', available);
      if (available) {
        galleryFront.setAttribute('role', 'button');
        galleryFront.tabIndex = 0;
        galleryFront.setAttribute('aria-label', chinese() ? '查看完整照片' : 'View full photograph');
      } else {
        galleryFront.removeAttribute('role');
        galleryFront.removeAttribute('tabindex');
        galleryFront.removeAttribute('aria-label');
      }
    };
    const view = event => {
      if (!galleryFront.hasAttribute('data-gallery-view')) return;
      event.preventDefault();
      event.stopPropagation();
      openPhoto(galleryImage.currentSrc || galleryImage.src, galleryImage.alt, galleryFront);
    };
    galleryFront.addEventListener('click', view);
    galleryFront.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') view(event); });
    new MutationObserver(updateGallery).observe(galleryImage, { attributes: true, attributeFilter: ['src', 'hidden', 'alt'] });
    window.addEventListener('site:languagechange', updateGallery);
    updateGallery();
  }

  const footer = document.querySelector('.contact-v4');
  if (footer) {
    const clock = footer.querySelector('[data-about-time]');
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => { const now = new Date(); clock.textContent = formatter.format(now); clock.dateTime = now.toISOString(); };
    let timer;
    const start = () => { clearInterval(timer); tick(); timer = setInterval(tick, 30000); };
    start();
    addEventListener('pageshow', start);
    addEventListener('pagehide', () => clearInterval(timer));
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      document.body.classList.toggle('about-dark-footer', entries[0].isIntersecting);
    }, { threshold: 0 }).observe(footer);
  }

  // A short, one-shot scan shares the original letter geometry without changing it.
  let heroFrame = 0, signalCanvas;
  function stopHero() { cancelAnimationFrame(heroFrame); heroFrame = 0; signalCanvas?.remove(); signalCanvas = null; }
  async function heroScan() {
    const opening = document.querySelector('.opening');
    if (!opening || isReduced()) return;
    await document.fonts.ready;
    if (isReduced() || scrollY > 80 || document.visibilityState === 'hidden') return;
    const width = opening.clientWidth, height = opening.clientHeight;
    if (!width || !height) return;
    const mask = document.createElement('canvas');
    mask.width = width; mask.height = height;
    const ctx = mask.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const letters = [...'ANSYN'];
    ctx.font = '800 100px Poppins, sans-serif';
    const widths = letters.map(letter => ctx.measureText(letter).width);
    const nominalWidth = widths.reduce((sum, w) => sum + w, 0) + 12;
    const size = Math.min(width * .94 / nominalWidth * 100, height * 1.05);
    ctx.font = `800 ${size}px Poppins, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    let x = (width - nominalWidth * size / 100) / 2;
    letters.forEach((letter, index) => {
      const w = widths[index] * size / 100;
      ctx.save();
      ctx.translate(x + w / 2, height / 2 + [-.02, .21, 0, .13, -.03][index] * size);
      ctx.rotate([-2, 1.5, -1.2, 1.8, -1.5][index] * Math.PI / 180);
      ctx.fillText(letter, -w / 2, 0);
      ctx.restore();
      x += w + .03 * size;
    });
    const pixels = ctx.getImageData(0, 0, width, height).data;
    const step = width < 760 ? 16 : 22, points = [];
    for (let y = 12; y < height - 12; y += step) for (let px = 12; px < width - 12; px += step) {
      if (pixels[(Math.floor(y) * width + Math.floor(px)) * 4 + 3] > 160 && ((px + y * 3) % 7 < 3)) points.push([px, y]);
    }
    signalCanvas = document.createElement('canvas');
    signalCanvas.className = 'hero-signal';
    signalCanvas.setAttribute('aria-hidden', 'true');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    signalCanvas.width = Math.round(width * dpr); signalCanvas.height = Math.round(height * dpr);
    opening.append(signalCanvas);
    const draw = signalCanvas.getContext('2d');
    draw.scale(dpr, dpr);
    let start;
    function frame(time) {
      if (isReduced() || scrollY > 100 || !signalCanvas) return stopHero();
      if (!start) start = time;
      const progress = (time - start) / 1700;
      if (progress >= 1) return stopHero();
      draw.clearRect(0, 0, width, height);
      const head = (progress * 1.4 - .15) * width;
      const band = width * .22;
      points.forEach(([px, y]) => {
        const distance = (head - px) / band;
        if (distance < 0 || distance > 1) return;
        const fade = Math.sin(distance * Math.PI);
        draw.globalAlpha = fade * .84;
        draw.fillStyle = '#3164ff';
        const w = 3 + 20 * Math.sin(distance * Math.PI);
        draw.beginPath();
        draw.roundRect(px - w / 2, y - 1.8, w, 3.6, 2);
        draw.fill();
      });
      heroFrame = requestAnimationFrame(frame);
    }
    heroFrame = requestAnimationFrame(frame);
  }
  heroScan();
  addEventListener('resize', stopHero, { passive: true });
  addEventListener('pagehide', stopHero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopHero(); });
  mediaPreference.addEventListener('change', () => {
    if (!mediaPreference.matches) return;
    masks.forEach(expose);
    stopHero();
  });
})();
