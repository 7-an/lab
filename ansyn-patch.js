/* ============================================================
   ansyn-patch.js — 设计复盘补丁 v1（只做互链注入）
   复盘 P2-1 / P2-3：Work 与 Writing 之间零上下文互链，
   Kimi 页没有任何站内入口。这里补四条链接 + 两个入口。
   源码里应该写进 content collection，这里是给预览用的注入版。
   ============================================================ */
(function () {
  var BASE = '/ansyn-lab-preview';
  var zh = function () { return document.documentElement.lang === 'zh-CN'; };

  /* 项目 ↔ 文章 的真实配对 */
  var PAIRS = [
    { work: 'VOIDTYPE',
      writing: '复刻 newmix',
      wTitleEn: 'Recreating the newmix homepage',
      wTitleZh: '复刻 newmix 首页' },
    { work: 'AI Study Path Triage',
      writing: '7 天 AI 学习实验',
      wTitleEn: 'A 7-day AI study experiment',
      wTitleZh: '7 天 AI 学习实验' },
    { work: 'Ansyn Lab',
      writing: '为什么叫 Ansyn',
      wTitleEn: 'Why “Ansyn”',
      wTitleZh: '为什么叫 Ansyn' },
    { work: 'Community Workspace',
      writing: '离开深圳之前',
      wTitleEn: 'Before leaving Shenzhen',
      wTitleZh: '离开深圳之前' }
  ];

  function link(href, label) {
    var a = document.createElement('a');
    a.className = 'ansyn-xlink';
    a.href = href;
    a.setAttribute('data-preserve-language', '');
    a.textContent = label;
    return a;
  }

  function text(el) { return (el && el.textContent || '').trim(); }

  /* ---------- /work/ ：每个项目指向写它的那篇文章 ---------- */
  function patchWork() {
    var rows = document.querySelectorAll('.prow');
    if (!rows.length) return;

    rows.forEach(function (row, i) {
      if (!row.id) row.id = 'project-' + i;
      var pair = PAIRS.filter(function (p) { return row.id === workAnchor(p.work); })[0];
      if (!pair) return;
      var stack = row.querySelector('.pinfo-stack');
      if (!stack || stack.querySelector('.ansyn-xlink')) return;
      var label = zh()
        ? '相关记录：' + pair.wTitleZh
        : 'Read the note: ' + pair.wTitleEn;
      var wrap = document.createElement('div');
      wrap.className = 'ansyn-related-wrap';
      wrap.appendChild(link(BASE + '/writing/#note-' + workAnchor(pair.work).replace('project-', ''), label));
      stack.appendChild(wrap);
    });

  }

  /* ---------- /writing/ ：每篇文章指向做出来的那个项目 ---------- */
  function patchWriting() {
    var entries = document.querySelectorAll('.writing-entry');
    if (!entries.length) return;

    entries.forEach(function (entry) {
      var t = text(entry.querySelector('h2'));
      var pair = PAIRS.filter(function (p) { return t.indexOf(p.writing) > -1; })[0];
      if (!pair) return;
      if (entry.querySelector('.ansyn-xlink')) return;
      entry.id = 'note-' + workAnchor(pair.work).replace('project-', '');
      var meta = entry.querySelector('.writing-source') || entry.querySelector('.writing-meta');
      var label = zh() ? '相关项目：' + pair.work : 'The project: ' + pair.work;
      var a = link(BASE + '/work/#' + workAnchor(pair.work), label);
      (meta ? meta.parentNode : entry).appendChild(a);
    });
  }

  function workAnchor(name) {
    var idx = ['VOIDTYPE', 'Video Subtitle Extractor', 'AI Study Path Triage',
               'Ansyn Lab', 'Community Workspace', 'Personal Websites',
               'Community Daily Notes'].indexOf(name);
    return 'project-' + (idx < 0 ? 0 : idx);
  }


  /* ---------- hero 的 h1 跟随第一屏淡出 ---------- */
  function syncHeroTitle() {
    var h1 = document.querySelector('.opening h1#journey-title');
    var meta = document.querySelector('.opening .hero-meta');
    var opening = document.querySelector('.opening');
    if (!h1 || !meta || !opening) return;
    var queued = false;
    function tick() {
      queued = false;
      var o = getComputedStyle(meta).opacity;
      h1.style.setProperty('--hero-fade', o);
      h1.style.opacity = o;
      opening.style.setProperty('--hero-fade', o);
    }
    addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(tick); }
    }, { passive: true });
    setTimeout(function () {
      h1.getAnimations().forEach(function (a) { a.cancel(); });
      tick();
    }, 1400);
  }

  function run() { patchWork(); patchWriting(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { run(); syncHeroTitle(); });
  } else { run(); syncHeroTitle(); }
  /* 语言切换后标签跟着换 */
  new MutationObserver(function () {
    document.querySelectorAll('.ansyn-xlink').forEach(function (a) {
      if (a.parentElement.classList.contains('ansyn-related-wrap')) a.parentElement.remove();
      else a.remove();
    });
    run();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

/* ============================================================
   首页收敛 v2
   - 将原 GitHub 首屏关键词放回 ANSYN 字形，而不是单独抢画面
   - 让照片的视觉堆叠如实对应照片数量
   - 右下信息按当前语言保持一句话层级
   ============================================================ */
(function () {
  function syncLocalCopy() {
    var language = document.documentElement.lang;
    document.querySelectorAll('[data-ui-en][data-ui-zh]').forEach(function (element) {
      var copy = language === 'zh-CN' ? element.dataset.uiZh : element.dataset.uiEn;
      if (element.textContent !== copy) element.textContent = copy;
      element.lang = language;
    });
  }

  function compactWorldCopy() {
    var intro = document.querySelector('.world-intro .intro-english');
    var now = document.querySelector('.world-now > span:not(.now-label):not(.now-arrow)');
    if (intro) {
      intro.setAttribute('data-preserve-language', '');
      intro.lang = document.documentElement.lang;
      intro.textContent = document.documentElement.lang === 'zh-CN'
        ? '公开学习，真实构建'
        : 'learn in public, build something real.';
    }
    if (now) {
      now.setAttribute('data-preserve-language', '');
      now.textContent = document.documentElement.lang === 'zh-CN' ? '目前在' : 'Now at';
    }
  }

  function truthfulPhotoDeck() {
    var gallery = document.querySelector('[data-gallery]');
    var count = document.querySelector('[data-photo-count]');
    if (!gallery || !count) return;
    function update() {
      var match = count.textContent.match(/\/\s*(\d+)/);
      var total = match ? Number(match[1]) : 0;
      gallery.classList.toggle('is-double', total === 2);
      gallery.classList.toggle('is-stack', total >= 3);
      if (total) {
        var current = Number(count.textContent.trim().split('/')[0]);
        count.setAttribute('aria-label', document.documentElement.lang === 'zh-CN'
          ? '第 ' + current + ' 张，共 ' + total + ' 张'
          : 'Photo ' + current + ' of ' + total);
      }
    }
    new MutationObserver(update).observe(count, { childList: true, characterData: true, subtree: true });
    window.addEventListener('site:languagechange', update);
    update();
  }

  function run() {
    syncLocalCopy();
    compactWorldCopy();
    truthfulPhotoDeck();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  new MutationObserver(function () { syncLocalCopy(); compactWorldCopy(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
