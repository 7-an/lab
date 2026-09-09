function T(){const q=window.matchMedia("(prefers-reduced-motion: reduce)"),A=window.matchMedia("(min-width: 834px)"),x=()=>q.matches||document.documentElement.hasAttribute("data-reduced");document.querySelectorAll("[data-project-rows]").forEach(C=>{C.querySelectorAll(".prow").forEach(e=>{const r=e.querySelector("[data-preview-toggle]"),k=e.querySelector("[data-row-control]"),a=e.querySelector(".pcell-preview"),m=e.querySelector(".pcell-info"),g=[a,m,...e.querySelectorAll(".pcell-ph")],$=[...m.querySelectorAll(".pstrip, .pinfo")],M=[...e.querySelectorAll("[data-preview-image]")],R=[...e.querySelectorAll("[data-thumb]")];let c=[],f=0,y=0;const v=a.querySelector(".pstrip-main"),E=v.textContent??"",o=()=>{cancelAnimationFrame(y),v.textContent=E},B=()=>{if(o(),x()||e.classList.contains("is-open"))return;const t=performance.now(),i="01/—+*:",n=p=>{const u=Math.min((p-t)/320,1);v.textContent=[...E].map((l,h)=>h/E.length<u||l===" "?l:i[(h+Math.floor((p-t)/45))%i.length]).join(""),u<1?y=requestAnimationFrame(n):o()};y=requestAnimationFrame(n)};a.addEventListener("pointerenter",t=>{if(t.pointerType==="touch")return;const i=a.getBoundingClientRect();a.dataset.entry=t.clientY>i.top+i.height/2?"bottom":"top",B()}),a.addEventListener("pointerleave",o),r.addEventListener("focus",B),r.addEventListener("blur",o);const P=t=>{M.forEach((i,n)=>i.classList.toggle("is-active",n===t)),R.forEach((i,n)=>{i.classList.toggle("is-active",n===t),i.setAttribute("aria-pressed",String(n===t))})};R.forEach((t,i)=>t.addEventListener("click",()=>P(i)));const b=()=>{c.forEach(t=>t.cancel()),c=[],e.classList.remove("is-animating")},L=t=>{const i=++f,n=g.map(s=>s.getBoundingClientRect()),p=e.getBoundingClientRect().height,u=$.map(s=>getComputedStyle(s).opacity);if(b(),o(),e.classList.toggle("is-open",t),r.setAttribute("aria-expanded",String(t)),k.setAttribute("aria-expanded",String(t)),m.inert=!t,x())return;const l=g.map(s=>s.getBoundingClientRect()),h=e.getBoundingClientRect().height,F=A.matches?700:500,S={duration:F,delay:t?0:200,easing:"cubic-bezier(.87,0,.13,1)",fill:"both"};e.classList.add("is-animating"),c.push(a.animate([{left:`${n[0].left-l[0].left}px`,width:`${n[0].width}px`},{left:"0px",width:`${l[0].width}px`}],S),e.animate([{height:`${p}px`},{height:`${h}px`}],S)),A.matches&&g.slice(1).forEach((s,d)=>{const j=Number(e.dataset.layout)<2?1:-1,O=d>0&&t?j*C.clientWidth:0;c.push(s.animate([{transform:`translateX(${n[d+1].left-l[d+1].left}px)`},{transform:`translateX(${O}px)`}],S))}),$.forEach((s,d)=>c.push(s.animate([{opacity:u[d],visibility:"visible"},{opacity:t?1:0,visibility:"visible"}],{duration:t?350:200,delay:t?F:0,fill:"both",easing:"ease"}))),Promise.allSettled(c.map(s=>s.finished)).then(()=>{i===f&&b()})};r.addEventListener("click",()=>L(!e.classList.contains("is-open"))),k.addEventListener("click",()=>L(!e.classList.contains("is-open"))),e.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&(t.preventDefault(),L(!1),r.focus({preventScroll:!0}))});const w=()=>{++f,b(),o()};window.addEventListener("resize",w,{passive:!0}),q.addEventListener("change",w)})})}T();
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
})();

/* Work-stage decoration; expansion, links and the particle renderer keep their owners. */
(() => {
  const stage = document.querySelector('.showcase');
  if (!stage) return;
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(min-width: 834px) and (hover:hover) and (pointer:fine)');
  const reduced = () => motion.matches || root.hasAttribute('data-reduced');
  const rows = [...stage.querySelectorAll('[data-project-rows] .prow')];
  const count = stage.querySelector('[data-work-count]');
  if (count) count.textContent = String(rows.length).padStart(2, '0');
  const states = [];
  const clear = state => {
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.row.classList.remove('is-aimed');
    for (const key of ['depth-x','depth-y','pitch','yaw','image-x','image-y','track-x','track-y']) {
      state.row.style.removeProperty('--'+key);
    }
  };
  rows.forEach((row, index) => {
    const serial = String(index+1).padStart(2, '0');
    const number = document.createElement('span');
    number.className = 'work-row-number';
    number.textContent = serial;
    const label = document.createElement('span');
    label.className = 'work-row-index';
    label.dataset.preserveLanguage = '';
    label.textContent = serial+' / '+String(rows.length).padStart(2, '0');
    row.querySelector('.ph-a .pbox')?.append(number, label);
    const orbit = document.createElement('span');
    orbit.className = 'work-cell-orbit';
    for (let i=0; i<3; i++) orbit.append(document.createElement('i'));
    row.querySelector('.ph-b .pbox')?.append(orbit);
    const tracker = document.createElement('span');
    tracker.className = 'work-row-tracker';
    tracker.setAttribute('aria-hidden', 'true');
    row.append(tracker);
    const state = {row,frame:0,x:0,y:0};
    states.push(state);
    row.addEventListener('pointermove', event => {
      if (!pointer.matches || reduced() || event.pointerType !== 'mouse') return;
      state.x = event.clientX;
      state.y = event.clientY;
      if (state.frame) return;
      state.frame = requestAnimationFrame(() => {
        state.frame = 0;
        const box = row.getBoundingClientRect();
        const x = Math.max(0, Math.min(box.width, state.x-box.left));
        const y = Math.max(0, Math.min(box.height, state.y-box.top));
        const dx = x/Math.max(box.width,1)-.5;
        const dy = y/Math.max(box.height,1)-.5;
        row.style.setProperty('--track-x',x+'px');
        row.style.setProperty('--track-y',y+'px');
        row.style.setProperty('--depth-x',dx*20+'px');
        row.style.setProperty('--depth-y',dy*12+'px');
        row.style.setProperty('--yaw',dx*38+'deg');
        row.style.setProperty('--pitch',-dy*28+'deg');
        row.style.setProperty('--image-x',dx*5+'px');
        row.style.setProperty('--image-y',dy*4+'px');
        row.classList.add('is-aimed');
      });
    }, {passive:true});
    row.addEventListener('pointerleave', () => clear(state));
  });

  const future = stage.querySelector('.future-row');
  const toggle = stage.querySelector('[data-work-reel-toggle]');
  let paused = false;
  const sync = () => {
    if (reduced() || !pointer.matches || document.hidden) states.forEach(clear);
    if (!future || !toggle) return;
    future.classList.toggle('is-paused', paused || reduced());
    toggle.hidden = reduced();
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = root.lang === 'zh-CN'
      ? (paused ? '继续动效' : '暂停动效')
      : (paused ? 'Resume animation' : 'Pause animation');
  };
  if (future) {
    new IntersectionObserver(entries => {
      future.classList.toggle('is-inview', entries[0].isIntersecting);
    }, {threshold:.15}).observe(future);
  }
  toggle?.addEventListener('click', () => { paused = !paused; sync(); });
  motion.addEventListener('change', sync);
  pointer.addEventListener('change', sync);
  new MutationObserver(sync).observe(root, {attributes:true,attributeFilter:['lang','data-reduced']});
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => states.forEach(clear));
  sync();
})();
