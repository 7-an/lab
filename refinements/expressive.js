/* Decorative motion only. Existing controllers own routes, gallery, project expansion and filtering. */
(() => {
  const root = document.documentElement;
  const reduced = () => root.hasAttribute('data-reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const accents = document.querySelectorAll('.work-emblem,.writing-folio,.about-mark');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => target.classList.toggle('motion-rest', !isIntersecting));
  }, {rootMargin:'40px'});
  accents.forEach(el => {
    observer.observe(el);
    el.addEventListener('pointermove', event => {
      if (!fine.matches || reduced() || event.pointerType !== 'mouse') return;
      const box = el.getBoundingClientRect();
      el.style.setProperty('--tilt-x', ((event.clientX-box.left)/box.width-.5)*14+'deg');
      el.style.setProperty('--tilt-y', -((event.clientY-box.top)/box.height-.5)*12+'deg');
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--tilt-x');
      el.style.removeProperty('--tilt-y');
    });
  });
  const visibility = () => root.toggleAttribute('data-document-hidden', document.hidden);
  document.addEventListener('visibilitychange', visibility);
  visibility();

  // Mirror the currently translated entry, not a second copy of its prose.
  const entries = [...document.querySelectorAll('[data-writing-entry]')];
  const preview = document.querySelector('[data-writing-preview]');
  let active = null;
  const syncPreview = () => {
    if (!active || !preview) return;
    const text = active.querySelector('.writing-summary')?.textContent.trim();
    const category = active.querySelector('.writing-meta')?.firstElementChild?.textContent.trim();
    if (text) preview.querySelector('[data-preview-text]').textContent = text;
    if (category) preview.querySelector('[data-preview-category]').textContent = category;
    const link = active.querySelector('h2 a');
    const target = preview.querySelector('[data-preview-link]');
    if (target) target.hidden = !link;
    if (link && target) {
      target.href = link.href;
      target.textContent = root.lang === 'zh-CN' ? '阅读原文' : 'Read the original';
      target.setAttribute('aria-label', target.textContent+': '+link.textContent.trim());
    }
  };
  const activate = entry => {
    active = entry;
    entries.forEach(el => el.classList.toggle('is-active', el === entry));
    // The original controller updates first; the localized DOM remains the copy source.
    requestAnimationFrame(syncPreview);
  };
  entries.forEach(entry => {
    entry.addEventListener('pointerenter', event => { if(event.pointerType === 'mouse') activate(entry); });
    entry.addEventListener('focusin', () => activate(entry));
  });
  const reset = () => { active = null; entries.forEach(el => el.classList.remove('is-active')); };
  document.querySelector('.writing-columns')?.addEventListener('pointerleave', reset);
  document.addEventListener('keydown', event => { if(event.key === 'Escape') reset(); });
  if (preview) new MutationObserver(() => requestAnimationFrame(syncPreview)).observe(root, {attributes:true,attributeFilter:['lang']});
})();
