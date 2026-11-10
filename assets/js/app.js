/* ==========================================================================
   app.js —— 站点外壳：路由、顶栏、全局档位、搜索、toast
   ========================================================================== */
(function (global) {
  'use strict';

  const Pages = {};           // name -> { title, render(ctx) }
  const el = (h) => {
    const d = document.createElement('div');
    d.innerHTML = h.trim();
    return d.firstElementChild;
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* -------------------------------- 内容索引 -------------------------------- */
  const DB = {
    cards: [],
    byId: {},
    tags: [],
    tiers: { 1: '培优', 2: '联赛', 3: '自招' },
  };

  function loadContent() {
    const all = [].concat(
      global.IDEAS || [], global.METHODS || [], global.PATTERNS || [], global.PROBLEMS || []
    );
    for (const c of all) {
      if (!c || !c.id) { console.warn('[app] 内容缺 id', c); continue; }
      if (DB.byId[c.id]) { console.warn('[app] 重复 id', c.id); continue; }
      DB.cards.push(c);
      DB.byId[c.id] = c;
    }
    DB.tags = global.TAGS || [];
    /* 建立反向引用 */
    for (const c of DB.cards) {
      if (c.tools) for (const t of c.tools) link(DB.byId[t], c.id, 'uses');
      if (c.patterns) for (const t of c.patterns) link(DB.byId[t], c.id, 'uses');
      if (c.problems) for (const t of c.problems) link(DB.byId[t], c.id, 'usedBy');
      if (c.ideas) for (const t of c.ideas) link(DB.byId[t], c.id, 'uses');
    }
  }
  function link(target, id, kind) {
    if (!target) return;
    const f = kind === 'usedBy' ? 'usedBy' : 'usedIn';
    (target[f] = target[f] || []);
    if (!target[f].includes(id)) target[f].push(id);
  }

  const byLayer = (l) => DB.cards.filter((c) => c.layer === l);
  const byTier = (list, tier) => list.filter((c) => !c.tier || c.tier.includes(tier));

  /* -------------------------------- 路由 -------------------------------- */
  const routes = [
    [/^\/?$/, 'home'],
    [/^\/compass$/, 'compass'],
    [/^\/map$/, 'map'],
    [/^\/patterns$/, 'walls', { layer: 'pattern' }],
    [/^\/methods$/, 'walls', { layer: 'method' }],
    [/^\/ideas$/, 'walls', { layer: 'idea' }],
    [/^\/problems$/, 'walls', { layer: 'problem' }],
    [/^\/card\/(.+)$/, 'detail'],
    [/^\/drill$/, 'drill'],
    [/^\/review$/, 'review'],
    [/^\/wrongs$/, 'wrongs'],
    [/^\/about$/, 'about'],
  ];

  function parseHash() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, query] = h.split('?');
    const q = {};
    if (query) for (const kv of query.split('&')) {
      const [k, v] = kv.split('=');
      q[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }
    return { path, q };
  }

  let current = null;

  function route() {
    const { path, q } = parseHash();
    for (const [re, name, opts] of routes) {
      const m = re.exec(path);
      if (m) {
        const page = Pages[name];
        if (!page) { notFound(path); return; }
        current = name;
        setActiveNav(name, opts);
        const root = document.getElementById('view');
        root.innerHTML = '';
        try {
          page.render({ root, params: m.slice(1), q, store: global.Store, DB, opts: opts || {} });
        } catch (e) {
          console.error('[app] 渲染失败', e);
          root.innerHTML = `<div class="empty"><b>页面渲染出错</b>${esc(e.message)}</div>`;
        }
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
        document.title = (page.title ? page.title + ' · ' : '') + '平面几何·解题思想';
        return;
      }
    }
    notFound(path);
  }

  function notFound(path) {
    document.getElementById('view').innerHTML =
      `<div class="empty"><b>没有这个页面</b>路径：${esc(path)} <br><br><a href="#/">回到首页</a></div>`;
  }

  function setActiveNav(name, opts) {
    const map = { home: 'home', compass: 'compass', map: 'map', drill: 'drill', review: 'review', wrongs: 'wrongs' };
    let key = map[name];
    if (name === 'walls' && opts) key = opts.layer === 'problem' ? 'problems' : opts.layer + 's';
    document.querySelectorAll('.nav a').forEach((a) => {
      a.classList.toggle('on', a.dataset.k === key);
    });
  }

  /* -------------------------------- 顶栏 -------------------------------- */
  function buildShell() {
    document.body.insertAdjacentHTML('afterbegin', `
      <header class="topbar"><div class="topbar-inner">
        <a class="brand" href="#/"><b>平面几何·解题思想</b><span>Grade 7–12</span></a>
        <nav class="nav">
          <a href="#/" data-k="home">今日</a>
          <a href="#/compass" data-k="compass">解题罗盘</a>
          <a href="#/patterns" data-k="patterns">基本图形</a>
          <a href="#/methods" data-k="methods">方法</a>
          <a href="#/ideas" data-k="ideas">思想</a>
          <a href="#/problems" data-k="problems">例题</a>
          <a href="#/drill" data-k="drill">训练场</a>
          <a href="#/wrongs" data-k="wrongs">错题</a>
          <a href="#/map" data-k="map">地图</a>
        </nav>
        <div class="topbar-tools">
          <button class="icon-btn" id="btn-search" title="搜索（/）" aria-label="搜索"><svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.6" cy="8.6" r="5.4"></circle><path d="M12.6 12.6 L17 17"></path></svg></button>
          <button class="icon-btn" id="btn-theme" title="切换深浅色" aria-label="切换主题">◐</button>
        </div>
      </div></header>
      <main class="main" id="view"></main>
      <footer class="footer">
        平面几何·解题思想 · 以「识图 → 生成 → 落地 → 验算」为主线<br>
        内容为教学重构，图形均可拖动验证 · <a href="#/about">关于与使用说明</a>
      </footer>
      <div class="toast" id="toast"></div>
    `);

    document.getElementById('btn-theme').addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      global.Store.s.theme = next;
      global.Store.save();
    });

    document.getElementById('btn-search').addEventListener('click', openSearch);
  }

  function applyTheme() {
    const t = global.Store.s.theme;
    if (t) document.documentElement.dataset.theme = t;
  }

  /* -------------------------------- Toast -------------------------------- */
  let toastTimer = null;
  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 1900);
  }

  /* -------------------------------- 搜索 -------------------------------- */
  let searchOpen = false;
  function openSearch() {
    if (searchOpen) return;
    searchOpen = true;
    const mask = el(`<div class="modal-mask"><div class="modal">
      <input type="text" placeholder="搜索图形、方法、题目、易错点…" id="sq" autocomplete="off">
      <div class="results" id="sr"></div></div></div>`);
    document.body.appendChild(mask);
    const input = mask.querySelector('#sq');
    const res = mask.querySelector('#sr');
    let items = [], idx = 0;

    const close = () => { mask.remove(); searchOpen = false; document.removeEventListener('keydown', onKey, true); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, items.length - 1); paint(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); paint(); }
      else if (e.key === 'Enter' && items[idx]) { location.hash = '#/card/' + items[idx].id; close(); }
    };
    document.addEventListener('keydown', onKey, true);

    function search(q) {
      q = q.trim().toLowerCase();
      if (!q) return DB.cards.filter((c) => c.layer === 'pattern').slice(0, 8);
      return DB.cards
        .map((c) => {
          const hay = [c.title, c.short, c.trigger, c.identify, c.action, (c.tags || []).join(' '),
            (c.signals || []).join(' '), MD.plain(c.body || ''), MD.plain(c.answer || '')].join(' ').toLowerCase();
          let score = 0;
          if (c.title && c.title.toLowerCase().includes(q)) score += 40;
          if ((c.signals || []).join(' ').toLowerCase().includes(q)) score += 14;
          if (hay.includes(q)) score += 8;
          return { c, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((x) => x.c);
    }

    function paint() {
      res.innerHTML = items.length ? items.map((c, i) =>
        `<a class="sres ${i === idx ? 'on' : ''}" href="#/card/${c.id}">
          <div class="st">${esc(c.title)} <span class="tag ${c.layer}">${LAYER[c.layer]}</span></div>
          <div class="sd">${esc(c.short || c.trigger || '')}</div></a>`).join('')
        : `<div class="empty">没有匹配的内容</div>`;
      res.querySelectorAll('.sres').forEach((a, i) => a.addEventListener('mouseenter', () => { idx = i; }));
    }

    input.addEventListener('input', () => { items = search(input.value); idx = 0; paint(); });
    mask.addEventListener('click', (e) => { if (e.target === mask) close(); });
    items = search(''); paint();
    input.focus();
  }

  const LAYER = { idea: '思想', method: '方法', pattern: '图形', problem: '例题' };

  /* -------------------------------- 工具函数 -------------------------------- */
  function cardHref(id) { return '#/card/' + id; }

  function tierTags(tier) {
    if (!tier) return '';
    return tier.map((n) => `<span class="tag t${n}">${DB.tiers[n]}</span>`).join(' ');
  }

  function cardTile(c) {
    const t = document.createElement('button');
    t.className = 'pcard';
    t.type = 'button';
    t.addEventListener('click', () => { location.hash = '#/card/' + c.id; });
    const thumbId = c.figure;
    t.innerHTML = `
      <div class="thumb" data-fig="${thumbId || ''}"></div>
      <div class="meta">
        <div class="ttl">${esc(c.title)}</div>
        <div class="sig">${esc(c.short || (c.signals || [])[0] || '')}</div>
      </div>`;
    if (thumbId) {
      const host = t.querySelector('.thumb');
      if (Geo.registry[thumbId]) Geo.thumb(host, thumbId, { figOpts: { size: [240, 158], font: 11, stroke: 1.35 } });
      else host.remove();
    } else {
      t.querySelector('.thumb').remove();
    }
    return t;
  }

  /* -------------------------------- 启动 -------------------------------- */
  function boot() {
    applyTheme();
    loadContent();
    buildShell();
    window.addEventListener('hashchange', route);
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
    });
    route();
  }

  global.App = {
    Pages, DB, boot, route, esc, el, toast, LAYER, cardHref, tierTags, cardTile,
    byLayer, byTier, openSearch,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
