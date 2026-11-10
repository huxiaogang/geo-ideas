/* ==========================================================================
   pages.js —— 全部页面渲染
   ========================================================================== */
(function (global) {
  'use strict';
  const A = global.App, P = A.Pages, S = global.Store, MD = global.MD, Geo = global.Geo;
  const esc = A.esc, el = A.el;
  const LAYER = A.LAYER;
  const h = (s) => MD.render(s || '');

  const meta = () => global.META || {
    steps: [
      { key: '识图', title: '识图', desc: '把图形拆成基本图形的组合', question: '这张图由哪些基本图形拼成？' },
      { key: '生成', title: '生成', desc: '用变换或补形造出缺的图形', question: '缺的那个怎么造出来？' },
      { key: '落地', title: '落地', desc: '选工具完成论证与计算', question: '用哪套工具算？' },
      { key: '验算', title: '验算', desc: '用极端位置检验结论', question: '退化时还成立吗？' },
    ],
    tiers: { 1: '培优', 2: '联赛', 3: '自招' },
    layerNames: LAYER,
    moto: '把直觉拆成可检索的动作',
    intro: '这里不堆题，只训练一件事：看到图形，第一步该想什么。',
  };

  const tierName = (n) => (meta().tiers || {})[n] || ('T' + n);
  const cardById = (id) => A.DB.byId[id];
  const patternIds = () => A.DB.cards.filter((c) => c.layer === 'pattern').map((c) => c.id);
  const tierOf = () => S.s.tier;

  function inTier(c) { return !c.tier || c.tier.includes(tierOf()); }

  /* ------------------------------------------------------------------ *
   * 公共小组件
   * ------------------------------------------------------------------ */
  function pageHead(title, sub, crumb) {
    return `<div class="page-head">
      ${crumb ? `<div class="crumb">${crumb}</div>` : ''}
      <h1>${esc(title)}</h1>
      ${sub ? `<p>${sub}</p>` : ''}
    </div>`;
  }

  function figBlock(id, opts) {
    if (!id) return '';
    const d = el(`<div class="fig-host"></div>`);
    if (Geo.registry[id]) Geo.mount(d, id, Object.assign({ caption: true }, opts || {}));
    else d.innerHTML = `<div class="fig-missing">缺图：${esc(id)}</div>`;
    return d.outerHTML;
  }

  /* 只显示层级标签。档位标签已从界面移除：绝大多数卡片三档通用，
     印出来只是噪音，也让「筛选/切换」看起来该有效却无效。 */
  function cardTitle(c) {
    return `<span class="tag ${c.layer}">${LAYER[c.layer]}</span>`;
  }

  function linkChips(ids, label) {
    const valid = (ids || []).filter((x) => cardById(x));
    if (!valid.length) return '';
    return `<div class="row mt-s"><span class="muted small">${label}：</span>` +
      valid.map((id) => `<a class="pill" href="${A.cardHref(id)}">${esc(cardById(id).title)}</a>`).join(' ') + '</div>';
  }

  /* ------------------------------------------------------------------ *
   * 1. 首页 / 今日
   * ------------------------------------------------------------------ */
  P.home = {
    title: '今日',
    render({ root, store }) {
      const M = meta();
      const done = (t) => store.isDone(t);
      const tasks = [
        { id: 'review', t: '回顾 3 张到期的基本图形卡', href: '#/review' },
        { id: 'problem', t: '做 1 道例题（阶梯提示控制揭示到第几层）', href: '#/problems' },
        { id: 'drill', t: '限时识别 5 张图，练「第一反应」速度', href: '#/drill' },
      ];
      const doneN = tasks.filter((x) => done(x.id)).length;
      const pct = doneN / tasks.length;
      const R = 40, C = 2 * Math.PI * R;

      const hero = el(`
        <section class="hero">
          <h1>看到图形，<em>第一步该想什么</em></h1>
          <p>${esc(M.intro || '')}</p>
          <p class="muted small">${esc(M.moto || '')} · 以陈祖维「基本图形为纲、变换为生成器」的思路组织内容。</p>
          <div class="step4">
            ${(M.steps || []).map((s, i) => `
              <div class="s"><i>STEP 0${i + 1}</i><b>${esc(s.title)}</b><span>${esc(s.desc)}</span></div>`).join('')}
          </div>
          <div class="kbd-row">
            <a class="btn primary" href="#/compass">打开解题罗盘 →</a>
            <a class="btn" href="#/patterns">浏览基本图形库</a>
            <a class="btn ghost" href="#/about">这是什么？怎么用</a>
          </div>
        </section>`);
      root.appendChild(hero);

      const todayCard = el(`
        <section class="card card-pad">
          <div class="spread mb">
            <div><div class="small muted">今日闭环 · 约 20 分钟</div>
              <h2 style="margin:2px 0 0;font-size:20px">${doneN === 3 ? '今天完成了 ✓' : '按到期顺序做，不挑题'}</h2></div>
            <div class="muted small">连续 ${store.streak()} 天</div>
          </div>
          <div class="ring-wrap mb">
            <svg class="ring" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="${R}" stroke="var(--line)" ></circle>
              <circle cx="50" cy="50" r="${R}" stroke="var(--accent)" stroke-dasharray="${C * pct} ${C}" transform="rotate(-90 50 50)"></circle>
              <text x="50" y="54" text-anchor="middle">${doneN}/${tasks.length}</text>
            </svg>
            <div class="small muted" style="max-width:34ch">
              间隔重复会按「会 / 模糊 / 不会」把卡片排到不同的天数后。
              今天只做到期的，不贪多。
            </div>
          </div>
          <div id="tasklist">
            ${tasks.map((x, i) => `
              <div class="taskline ${done(x.id) ? 'done' : ''}" data-task="${x.id}">
                <span class="num">${done(x.id) ? '✓' : i + 1}</span>
                <span class="t"><a href="${x.href}">${esc(x.t)}</a></span>
                <button class="btn sm ${done(x.id) ? 'ghost' : ''}" data-done="${x.id}" ${done(x.id) ? 'disabled' : ''}>
                  ${done(x.id) ? '已完成' : '标记完成'}</button>
              </div>`).join('')}
          </div>
        </section>`);

      const side = el(`
        <div class="grid" style="gap:16px">
          <section class="card card-pad">
            <h3 style="margin:0 0 6px;font-size:17px">从哪儿开始</h3>
            <p class="small muted" style="margin:0 0 12px">如果现在正卡在一道题上，用罗盘反查；如果想系统补，按四层顺序走。</p>
            <div class="grid" style="gap:8px">
              <a class="btn" href="#/ideas">① 思想（7 条调度原则）</a>
              <a class="btn" href="#/methods">② 方法（12 套工具）</a>
              <a class="btn" href="#/patterns">③ 基本图形（20 张）</a>
              <a class="btn" href="#/problems">④ 例题（16 道精讲）</a>
            </div>
          </section>
          <section class="card card-pad">
            <h3 style="margin:0 0 6px;font-size:17px">当前档位：${esc(tierName(tierOf()))}</h3>
            <p class="small muted" style="margin:0">顶栏可切换培优 / 联赛 / 自招。内容不分家，档位只影响今日推荐、翻卡队列、训练题池与罗盘排序。</p>
          </section>
          <section class="card card-pad">
            <h3 style="margin:0 0 6px;font-size:17px">我的薄弱点</h3>
            <div id="weakbox" class="small muted">加载中…</div>
          </section>
        </div>`);

      const grid = el('<div class="today"></div>');
      grid.appendChild(todayCard);
      grid.appendChild(side);
      root.appendChild(grid);

      /* 今日推荐：到期优先，不够补新卡 */
      const due = store.dueCards(patternIds()).filter((x) => inTier(cardById(x.id)));
      const rec = due.slice(0, 3).map((x) => cardById(x.id)).filter(Boolean);
      const sec = el(`<section class="mt"><div class="spread mb">
          <h2 style="margin:0;font-size:20px">今天该回顾的图</h2>
          <a class="small" href="#/review">进入翻卡复习 →</a></div>
          <div class="cardwall" id="recwall"></div></section>`);
      root.appendChild(sec);
      const wall = sec.querySelector('#recwall');
      if (rec.length) rec.forEach((c) => wall.appendChild(A.cardTile(c)));
      else wall.innerHTML = '<div class="empty">暂时没有到期卡片，去翻一遍模型库吧。</div>';

      /* 交互 */
      root.querySelectorAll('[data-done]').forEach((b) => b.addEventListener('click', () => {
        store.markDone(b.dataset.done);
        A.toast('已打卡');
        A.route();
      }));

      /* 薄弱点 */
      const ws = store.wrongStats();
      const top = Object.entries(ws).sort((a, b) => b[1].total - a[1].total).slice(0, 4);
      const box = side.querySelector('#weakbox');
      box.innerHTML = top.length
        ? top.map(([id, v]) => `<div class="row" style="justify-content:space-between;padding:3px 0">
            <a href="${A.cardHref(id)}">${esc((cardById(id) || {}).title || id)}</a>
            <span class="tag problem">${v.total} 次</span></div>`).join('')
          : '还没有错题记录。去训练场做一组，系统才会知道你卡在哪。';

      /* 四步说明条 */
      root.appendChild(el(`<section class="mt card card-pad">
        <h2 style="margin:0 0 12px;font-size:19px">解题四步定式</h2>
        <div class="grid g4">
          ${(M.steps || []).map((s, i) => `<div class="card card-pad" style="box-shadow:none;background:var(--bg-soft)">
            <div class="small" style="color:var(--accent);font-weight:600">0${i + 1} ${esc(s.key)}</div>
            <div style="font-family:var(--serif);font-size:16px;margin:4px 0">${esc(s.title)}</div>
            <div class="small muted">${esc(s.question || '')}</div></div>`).join('')}
        </div></section>`));
    },
  };

  /* ------------------------------------------------------------------ *
   * 2. 解题罗盘（反查索引）
   * ------------------------------------------------------------------ */
  P.compass = {
    title: '解题罗盘',
    render({ root, q }) {
      root.appendChild(el(pageHead('解题罗盘',
        '勾选题干里看得见的条件特征，系统按「识别信号 → 第一步动作」反查该想什么。命中理由写在每条推荐下面。',
        '<a href="#/">今日</a> / 解题罗盘')));

      const tags = A.DB.tags;
      const groups = [];
      for (const t of tags) if (!groups.includes(t.group)) groups.push(t.group);

      const layout = el('<div class="compass"></div>');
      const left = el(`<section class="card card-pad">
        <div class="spread mb"><b>① 勾选题干特征</b><button class="btn sm ghost" id="clr">清空</button></div>
        <div id="tagbox"></div>
        <div class="mt" style="border-top:1px solid var(--line);padding-top:12px">
          <div class="small muted mb">② 也可以直接描述卡点：</div>
          <input class="btn" style="width:100%;text-align:left;justify-content:flex-start" id="freetext"
            placeholder="例：出现中点 + 要证两条线段相等" value="${esc(q.q || '')}">
        </div>
      </section>`);
      const right = el(`<section class="card card-pad">
        <div class="spread mb"><b>② 推荐</b><span class="small muted" id="hitcount"></span></div>
        <div id="hits"></div>
      </section>`);
      layout.appendChild(left); layout.appendChild(right); root.appendChild(layout);

      const box = left.querySelector('#tagbox');
      let lastTag = '';   // 最近勾选的标签，给它的 first 卡一点加权，让推荐跟手
      for (const g of groups) {
        const gd = el(`<div class="tag-group"><h4>${esc(g)}</h4></div>`);
        tags.filter((t) => t.group === g).forEach((t) => {
          const b = el(`<button class="tag-pick" type="button" data-tag="${t.id}" title="${esc(t.desc || '')}">${esc(t.label)}</button>`);
          b.addEventListener('click', () => {
            const on = !b.classList.contains('on');
            b.classList.toggle('on', on);
            if (on) lastTag = t.id;
            compute();
          });
          gd.appendChild(b);
        });
        box.appendChild(gd);
      }

      const hitbox = right.querySelector('#hits');
      const countEl = right.querySelector('#hitcount');

      function compute() {
        const picked = Array.from(box.querySelectorAll('.tag-pick.on')).map((b) => b.dataset.tag);
        const extra = (left.querySelector('#freetext').value || '').trim();
        const terms = picked.concat(extra ? [extra] : []);
        if (!terms.length) {
          const quick = ['mid', 'bisect', 'rotate', 'cyclic', 'extreme', 'sum-seg', 'ratio', 'prove-equal'];
          hitbox.innerHTML = `<div class="empty" style="padding:26px 10px">
            <b>先勾几个条件</b>例如「中点」+「要证相等」，也可以把题干特征写进下面的输入框。<br>
            <div class="row mt" style="justify-content:center;gap:6px">
              <span class="small muted" style="width:100%">常见起手：</span>
              ${quick.map((id) => {
                const t = tags.find((x) => x.id === id);
                return t ? `<button class="tag-pick" data-quick="${id}">${esc(t.label)}</button>` : '';
              }).join('')}
            </div></div>`;
          hitbox.querySelectorAll('[data-quick]').forEach((b) => b.addEventListener('click', () => {
            const t = box.querySelector(`[data-tag="${b.dataset.quick}"]`);
            if (t) t.classList.add('on');
            compute();
          }));
          countEl.textContent = '';
          return;
        }
        const scored = new Map();
        const reasons = new Map();
        const tagById = Object.fromEntries(tags.map((t) => [t.id, t]));

        /* 标签命中：first 权重高，also 次之 */
        for (const tid of picked) {
          const t = tagById[tid];
          if (!t) continue;
          (t.first || []).forEach((id, i) => {
            const boost = (tid === lastTag ? 5 : 0) + 10 - i * 2;
            scored.set(id, (scored.get(id) || 0) + boost);
            if (!reasons.has(id)) reasons.set(id, []);
            reasons.get(id).push(`<em>${esc(t.label)}</em> → ${MD.inlineRender(t.why || t.hint || '')}`);
          });
          (t.also || []).forEach((id) => {
            scored.set(id, (scored.get(id) || 0) + 3);
            if (!reasons.has(id)) reasons.set(id, []);
          });
        }

        /* 卡片自身 signals / short / identify 的关键词命中 */
        const words = terms.flatMap((t) => {
          const lb = (tagById[t] || {}).label || t;
          return [lb, lb.replace(/出现|证|求|的/g, '')].filter(Boolean);
        }).filter((w) => w.length >= 2);
        for (const c of A.DB.cards) {
          if (c.layer === 'problem') continue;
          const hay = [c.title, c.short, c.identify, c.action, c.when, (c.signals || []).join(' '),
            (c.tags || []).map((t) => (tagById[t] || {}).label || '').join(' ')].join(' ');
          let sc = 0;
          for (const w of words) if (hay.includes(w)) sc += 2;
          for (const tid of picked) if ((c.tags || []).includes(tid)) sc += 6;
          if (sc) {
            scored.set(c.id, (scored.get(c.id) || 0) + sc);
            if (!reasons.has(c.id)) reasons.set(c.id, []);
            const sig = (c.signals || []).slice(0, 2).map((s) => `<em>${MD.inlineRender(s)}</em>`).join('、');
            if (sig) reasons.get(c.id).push(`识别信号：${sig}`);
          }
        }

        /* 档位加权 */
        for (const [id, sc] of scored) {
          const c = cardById(id);
          if (c && inTier(c)) scored.set(id, sc + 4);
        }

        const list = Array.from(scored.entries())
          .map(([id, sc]) => ({ c: cardById(id), sc, why: reasons.get(id) || [] }))
          .filter((x) => x.c)
          .sort((a, b) => b.sc - a.sc)
          .slice(0, 10);

        countEl.textContent = `命中 ${list.length} 条`;
        hitbox.innerHTML = list.length ? list.map((x) => `
          <div class="hit">
            <div class="score"><b>${x.sc}</b><span>相关度</span></div>
            <div class="body">
              <h3><a href="${A.cardHref(x.c.id)}">${esc(x.c.title)}</a>
                <span class="tag ${x.c.layer}">${LAYER[x.c.layer]}</span></h3>
              <div class="why">${x.why.length ? x.why.slice(0, 2).join('<br>') : MD.inlineRender(x.c.short || '')}</div>
              ${x.c.action ? `<div class="small mt-s" style="color:var(--accent)">第一步：${MD.inlineRender(x.c.action)}</div>` : ''}
            </div>
          </div>`).join('')
          : `<div class="empty">没有命中。试试换一个更贴近题干的说法。</div>`;
      }

      left.querySelector('#clr').addEventListener('click', () => {
        box.querySelectorAll('.tag-pick.on').forEach((b) => b.classList.remove('on'));
        left.querySelector('#freetext').value = '';
        lastTag = '';
        compute();
      });
      left.querySelector('#freetext').addEventListener('input', compute);
      if (q.tags) {
        q.tags.split(',').forEach((t) => {
          const b = box.querySelector(`[data-tag="${t.trim()}"]`);
          if (b) b.classList.add('on');
        });
      }
      compute();
    },
  };

  /* ------------------------------------------------------------------ *
   * 3. 卡片墙（思想 / 方法 / 图形 / 例题）
   * ------------------------------------------------------------------ */
  const WALL_META = {
    idea: { title: '七条思想', sub: '调度原则。不是技巧，是「什么时候该换思路」的判断依据。' },
    method: { title: '十二套方法', sub: '落地工具。基本图形造出来之后，用它算、用它证。' },
    pattern: { title: '二十个基本图形', sub: '本站核心。正面只看图，先自己说出「识别信号 + 第一步动作」，再翻背面。' },
    problem: { title: '十六道例题精讲', sub: '每题五层阶梯提示 + 决策注解。卡在哪一层就揭示到哪一层。' },
  };

  P.walls = {
    render({ root, params, q, opts }) {
      const layer = (opts && opts.layer) || (params && params[0]) || 'pattern';
      const wm = WALL_META[layer] || WALL_META.pattern;
      root.appendChild(el(pageHead(wm.title, wm.sub,
        `<a href="#/">今日</a> / ${esc(wm.title)}`)));

      const all = A.byLayer(layer);
      /* 不做档位筛选：一次显示全部，避免给学生「点了没反应」的控件 */
      const bar = el(`<div class="card card-pad mb row" style="gap:10px">
        <span class="small muted">共 ${all.length} 张</span>
        ${layer === 'pattern' ? '<a class="btn sm primary" style="margin-left:auto" href="#/review">开始翻卡复习 →</a>' : ''}
      </div>`);
      root.appendChild(bar);
      const wall = el('<div class="cardwall" id="wall"></div>');
      root.appendChild(wall);
      all.forEach((c) => wall.appendChild(A.cardTile(c)));
    },
  };

  /* ------------------------------------------------------------------ *
   * 4. 卡片详情
   * ------------------------------------------------------------------ */
  P.detail = {
    render({ root, params }) {
      const id = params[0];
      const c = cardById(id);
      if (!c) {
        root.appendChild(el(`<div class="empty"><b>找不到这张卡</b>${esc(id)}</div>`));
        return;
      }
      /* 打开任意例题即视为完成今日计划里的「做 1 道例题」 */
      if (c.layer === 'problem') S.markDone('problem');
      root.appendChild(el(pageHead(c.title, c.short,
        `<a href="#/">今日</a> / <a href="#/${c.layer === 'problem' ? 'problems' : c.layer + 's'}">${LAYER[c.layer]}</a> / ${esc(c.title)}`)));

      const layout = el('<div class="grid" style="grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start"></div>');
      const main = el('<div></div>');
      const side = el('<div class="grid" style="gap:16px"></div>');
      layout.appendChild(main); layout.appendChild(side); root.appendChild(layout);

      /* 图 */
      if (c.figure) {
        const figCard = el(`<section class="card card-pad mb"></section>`);
        figCard.innerHTML = `<div class="fig-host"></div>`;
        main.appendChild(figCard);
        const host = figCard.querySelector('.fig-host');
        if (Geo.registry[c.figure]) Geo.mount(host, c.figure, { caption: true });
        else host.innerHTML = `<div class="fig-missing">缺图：${esc(c.figure)}</div>`;
      }

      /* 信息条 */
      const info = el(`<section class="card card-pad mb">
        <div class="row mb">${cardTitle(c)}
          ${(c.tags || []).map((t) => {
            const tg = A.DB.tags.find((x) => x.id === t);
            return tg ? `<span class="tag ghost">${esc(tg.label)}</span>` : '';
          }).join('')}
        </div>
        ${c.motto ? `<div class="note"><div class="note-t">口诀</div>${MD.inlineRender(c.motto)}</div>` : ''}
        ${c.identify ? `<div class="row" style="align-items:flex-start;gap:8px"><span class="tag pattern">识别</span><div>${MD.inlineRender(c.identify)}</div></div>` : ''}
        ${c.action ? `<div class="row mt-s" style="align-items:flex-start;gap:8px"><span class="tag t3">第一步</span><div>${MD.inlineRender(c.action)}</div></div>` : ''}
        ${c.when ? `<div class="row mt-s" style="align-items:flex-start;gap:8px"><span class="tag method">何时用</span><div>${MD.inlineRender(c.when)}</div></div>` : ''}
      </section>`);
      main.appendChild(info);

      /* 关键字段块 */
      const fld = (title, vals, cls) => vals && vals.length ? `
        <section class="card card-pad mb"><h3 style="margin:0 0 9px;font-size:17px">${title}</h3>
        <ul class="md-list" style="margin:0;padding-left:20px">${vals.map((v) => `<li class="${cls || ''}">${h(v)}</li>`).join('')}</ul></section>` : '';
      main.insertAdjacentHTML('beforeend',
        fld('识别信号', c.signals) + fld('能得到的结论', c.conclusions) +
        fld('操作化流程', c.steps) + fld('这个思想失效时怎么办', c.fail, 'sub'));

      /* 正文 */
      if (c.body) main.appendChild(el(`<section class="card card-pad prose mb">${h(c.body)}</section>`));

      /* 例题专属：题干 + 阶梯提示 + 答案 + 决策注解 */
      if (c.layer === 'problem') {
        main.appendChild(el(`<section class="card card-pad prose mb">
          <h2 class="md-h" style="margin-top:0">题目</h2>
          <div class="small muted mb">${esc(c.source || '经典模型 · 改编')}</div>
          ${h(c.statement)}</section>`));

        const hints = c.hints || [];
        const hs = el(`<section class="card card-pad mb">
          <div class="spread mb"><h2 style="margin:0;font-size:19px">阶梯提示</h2>
            <button class="btn sm" id="hintall">逐层揭示</button></div>
          <p class="small muted">卡在哪一层就揭示到哪一层，别一次看完。</p>
          <div class="hints" id="hintbox">
            ${hints.map((x, i) => `<div class="hint ${i > 0 ? 'locked' : ''}" data-i="${i}">
              <div class="hint-head"><span class="lv">0${i + 1} ${esc(x.level)}</span>
                <span class="lb">${esc(x.title)}</span><span class="chev">▶</span></div>
              <div class="hint-body prose">${h(x.text)}</div></div>`).join('')}
          </div></section>`);
        main.appendChild(hs);
        const hintEls = Array.from(hs.querySelectorAll('.hint'));
        function unlock(i) {
          hintEls.forEach((e, k) => { if (k <= i) e.classList.remove('locked'); });
        }
        hintEls.forEach((e, i) => e.querySelector('.hint-head').addEventListener('click', () => {
          if (e.classList.contains('locked')) { unlock(i); A.toast('已揭示到第 ' + (i + 1) + ' 层'); return; }
          e.classList.toggle('open');
          if (e.classList.contains('open') && i + 1 < hintEls.length) unlock(i + 1);
        }));
        let step = 0;
        hs.querySelector('#hintall').addEventListener('click', () => {
          if (step < hintEls.length) { unlock(step); hintEls[step].classList.add('open'); step++; }
          else { A.toast('已全部揭示'); }
          if (step === hintEls.length) hs.querySelector('#hintall').textContent = '已全部揭示';
        });

        const ans = el(`<section class="card card-pad mb">
          <div class="spread"><h2 style="margin:0;font-size:19px">完整解答</h2>
            <button class="btn sm" id="showans">展开</button></div>
          <div id="ansbody" class="prose mt" style="display:none">${h(c.answer)}</div></section>`);
        main.appendChild(ans);
        ans.querySelector('#showans').addEventListener('click', () => {
          const b = ans.querySelector('#ansbody');
          const open = b.style.display !== 'none';
          b.style.display = open ? 'none' : 'block';
          ans.querySelector('#showans').textContent = open ? '展开' : '收起';
        });

        if (c.decision) main.appendChild(el(`<section class="note" style="margin:0 0 16px">
          <div class="note-t">决策注解 · 为什么先试这个</div>${h(c.decision)}</section>`));
        main.insertAdjacentHTML('beforeend',
          fld('被放弃的思路', c.discard) + fld('变式（按档升维）', c.variants));
      }

      /* 易错 / 生成器 / 关联 */
      main.insertAdjacentHTML('beforeend',
        (c.traps && c.traps.length ? `<section class="trap"><div class="note-t">易错点</div>
          <ul style="margin:0;padding-left:20px">${c.traps.map((t) => `<li>${h(t)}</li>`).join('')}</ul></section>` : ''));

      /* 侧栏 */
      if (c.gen && c.gen.length) {
        const gname = { rotate: '旋转', translate: '平移', reflect: '翻折', homothety: '位似', complete: '补形', circle: '圆' };
        side.appendChild(el(`<section class="card card-pad"><h3 style="margin:0 0 8px;font-size:16px">所属生成器</h3>
          <div class="row">${c.gen.map((g) => `<span class="tag method">${esc(gname[g] || g)}</span>`).join('')}</div></section>`));
      }
      const relIds = [].concat(c.tools || [], c.patterns || [], c.methods || [], c.related || [], c.usedIn || [], c.usedBy || []);
      const uniqRel = Array.from(new Set(relIds)).filter((x) => cardById(x) && x !== c.id);
      if (uniqRel.length) side.appendChild(el(`<section class="card card-pad">
        <h3 style="margin:0 0 8px;font-size:16px">关联卡片</h3>
        <div style="display:flex;flex-direction:column;gap:5px">
          ${uniqRel.map((id) => `<a href="${A.cardHref(id)}" class="small">
            <span class="tag ${cardById(id).layer}">${LAYER[cardById(id).layer]}</span>
            ${esc(cardById(id).title)}</a>`).join('')}</div></section>`));

      /* 翻卡自评 */
      if (c.layer !== 'problem') {
        const srs = S.s.srs[c.id];
        side.appendChild(el(`<section class="card card-pad">
          <h3 style="margin:0 0 6px;font-size:16px">这张卡记住了吗</h3>
          <div class="small muted mb">按回忆难度评级，系统安排下次复习时间。</div>
          <div class="btn-row">
            <button class="btn sm" data-g="1">不会</button>
            <button class="btn sm" data-g="2">模糊</button>
            <button class="btn sm primary" data-g="3">会</button>
          </div>
          <div class="small muted mt-s" id="srsinfo">${srs ? `已复习 ${srs.reps} 次 · 间隔 ${srs.ivl} 天 · 下次 ${srs.due}` : '尚未复习'}</div>
          <div class="mt-s"><textarea id="note" class="btn" style="width:100%;text-align:left;min-height:64px;padding:8px" placeholder="我的笔记…">${esc((S.s.notes || {})[c.id] || '')}</textarea></div>
        </section>`));
        const sec = side.lastElementChild;
        sec.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => {
          const r = S.review(c.id, Number(b.dataset.g));
          A.toast(`已安排：${r.ivl} 天后再见`);
          sec.querySelector('#srsinfo').textContent = `已复习 ${r.reps} 次 · 间隔 ${r.ivl} 天 · 下次 ${r.due}`;
        }));
        sec.querySelector('#note').addEventListener('input', (e) => {
          S.s.notes[c.id] = e.target.value; S.save();
        });
      } else {
        /* 例题：错因四分类 */
        side.appendChild(el(`<section class="card card-pad">
          <h3 style="margin:0 0 6px;font-size:16px">这题卡在哪</h3>
          <div class="small muted mb">只记错因和模型，不抄整题。</div>
          <div class="errorpick" id="ep">
            ${S.ERROR_TYPES.map((e) => `<button data-e="${e.k}" title="${esc(e.desc)}">${esc(e.label)}</button>`).join('')}
          </div>
          <div class="row mt-s"><select id="epcard" class="btn sm">
            ${(c.patterns || []).filter((x) => cardById(x)).map((x) => `<option value="${x}">${esc(cardById(x).title)}</option>`).join('')}
          </select></div>
          <div class="small muted mt-s" id="epmsg"></div>
        </section>`));
        const sec = side.lastElementChild;
        /* 单选：点击即归类并记录，重复点同一错因当天去重由 Store 负责 */
        sec.querySelectorAll('[data-e]').forEach((b) => b.addEventListener('click', () => {
          sec.querySelectorAll('[data-e]').forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
          const sel = sec.querySelector('#epcard');
          const pid = sel.value || c.id;
          S.addWrong(pid, b.dataset.e, c.id);
          sec.querySelector('#epmsg').textContent = '已记入错题图谱，稍后按模型复现。';
          A.toast('已记录错因：' + b.textContent);
        }));
      }

      /* 响应式：窄屏收起侧栏到下方 */
      if (window.innerWidth < 800) layout.style.gridTemplateColumns = '1fr';
    },
  };

  /* ------------------------------------------------------------------ *
   * 5. 训练场（限时识别）
   * ------------------------------------------------------------------ */
  P.drill = {
    title: '训练场',
    render({ root, store }) {
      root.appendChild(el(pageHead('限时识别训练',
        '只看图，10 秒内说出该用哪个基本图形。练的是「第一反应」速度，不是解题。',
        '<a href="#/">今日</a> / 训练场')));

      const patterns = A.byLayer('pattern').filter((c) => c.figure && Geo.registry[c.figure]);
      const stage = el('<div class="quiz-stage"></div>');
      root.appendChild(stage);

      let queue = [], qi = 0, right = 0, answered = 0, t0 = 0, timer = null, locked = false;

      function shuffle(a) {
        a = a.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      }

      function intro() {
        stage.innerHTML = `
          <section class="card card-pad center">
            <h2 style="margin:0 0 8px;font-size:21px">5 分钟微训练</h2>
            <p class="muted" style="max-width:44ch;margin:0 auto 18px">
              每题给一张图 + 一句题干特征，从 4 个选项里选该用哪个基本图形。
              答完立刻显示识别信号，不写过程。</p>
            <div class="row" style="justify-content:center;margin-bottom:16px">
              <label class="small muted">题数</label>
              <select id="qn" class="btn sm"><option>5</option><option selected>8</option><option>12</option></select>
              <label class="small muted">档位</label>
              <select id="qt" class="btn sm">
                <option value="all">全部</option><option value="${tierOf()}" selected>当前档 ${esc(tierName(tierOf()))}</option>
              </select>
            </div>
            <button class="btn primary" id="start">开始训练 →</button>
            <div class="small muted mt">提示：答错会自动进入错因四分类，记录到错题图谱。</div>
          </section>`;
        stage.querySelector('#start').addEventListener('click', () => {
          const n = Number(stage.querySelector('#qn').value);
          const tf = stage.querySelector('#qt').value;
          let pool = patterns.filter((c) => tf === 'all' || (c.tier || []).includes(Number(tf)));
          if (pool.length < 4) pool = patterns;
          queue = shuffle(pool).slice(0, Math.min(n, pool.length));
          qi = 0; right = 0; answered = 0;
          next();
        });
      }

      function next() {
        clearInterval(timer);
        if (qi >= queue.length) return finish();
        const c = queue[qi];
        locked = false;
        const opts = shuffle([c].concat(shuffle(patterns.filter((x) => x.id !== c.id)).slice(0, 3)));
        stage.innerHTML = `
          <div class="card card-pad mb">
            <div class="spread"><span class="small muted">第 ${qi + 1} / ${queue.length} 题</span>
              <span class="quiz-timer" id="tm">00:00</span></div>
            <div style="height:4px;background:var(--line);border-radius:2px;margin-top:8px">
              <div style="height:100%;width:${(qi / queue.length) * 100}%;background:var(--accent);border-radius:2px"></div></div>
          </div>
          <section class="card card-pad mb">
            <div class="quiz-q">这张图里，第一步该想哪个基本图形？</div>
            <div class="small muted mb">${esc((c.signals || [])[0] || c.short || '')}</div>
            <div class="fig-host" id="qfig"></div>
          </section>
          <section class="card card-pad">
            <div id="opts">${opts.map((o, i) => `<button class="opt" data-id="${o.id}"><span class="k">${'ABCD'[i]}</span><span>${esc(o.title)}</span></button>`).join('')}</div>
            <div id="fb"></div>
          </section>`;
        const fh = stage.querySelector('#qfig');
        Geo.mount(fh, c.figure, { drag: false, caption: false, figOpts: { size: [420, 250], font: 13 } });
        t0 = Date.now();
        timer = setInterval(() => {
          const s = Math.floor((Date.now() - t0) / 1000);
          const e = stage.querySelector('#tm');
          if (e) e.textContent = `00:${String(s).padStart(2, '0')}`;
        }, 250);
        stage.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => answer(b, c)));
      }

      function answer(btn, c) {
        if (locked) return;
        locked = true;
        clearInterval(timer);
        answered++;
        const ok = btn.dataset.id === c.id;
        if (ok) right++;
        stage.querySelectorAll('[data-id]').forEach((b) => {
          if (b.dataset.id === c.id) b.classList.add('right');
          else if (b === btn) b.classList.add('wrong');
          else b.classList.add('dim');
        });
        const secs = ((Date.now() - t0) / 1000).toFixed(1);
        const fb = stage.querySelector('#fb');
        fb.innerHTML = `
          <div class="note mt" style="margin-bottom:10px"><div class="note-t">${ok ? '✓ 识别正确' : '✗ 认错了'} · ${secs}s</div>
            <b>${esc(c.title)}</b>：${MD.inlineRender(c.identify || (c.signals || []).join('；'))}
            ${c.action ? `<br><span style="color:var(--accent)">第一步：${MD.inlineRender(c.action)}</span>` : ''}</div>
          ${ok ? '' : `<div class="small muted mb">错因归类（可多选，稍后按模型复现）：</div>
            <div class="errorpick" id="ep">${S.ERROR_TYPES.map((e) => `<button data-e="${e.k}" title="${esc(e.desc)}">${esc(e.label)}</button>`).join('')}</div>`}
          <div class="btn-row mt"><button class="btn primary" id="go">${qi + 1 >= queue.length ? '看结果' : '下一题 →'}</button></div>`;
        const picked = new Set();
        fb.querySelectorAll('[data-e]').forEach((b) => b.addEventListener('click', () => {
          b.classList.toggle('on');
          if (b.classList.contains('on')) picked.add(b.dataset.e); else picked.delete(b.dataset.e);
        }));
        fb.querySelector('#go').addEventListener('click', () => {
          if (!ok) {
            for (const e of (picked.size ? picked : ['blind'])) S.addWrong(c.id, e, '');
          }
          qi++; next();
        });
      }

      function finish() {
        store.s.stats.answered += answered;
        store.s.stats.right += right;
        store.save();
        if (answered >= 5) store.markDone('drill');
        const rate = answered ? Math.round((right / answered) * 100) : 0;
        stage.innerHTML = `<section class="card card-pad center">
          <h2 style="margin:0 0 6px;font-size:22px">${rate}%</h2>
          <p class="muted">${right} / ${answered} 题识别正确</p>
          <p class="small muted" style="max-width:42ch;margin:0 auto 18px">
            ${rate >= 80 ? '第一反应已经稳了。去例题精讲练完整链条。'
              : '别急着刷题：把认错的模型的「识别信号」重读一遍，明天再测。'}</p>
          <div class="btn-row" style="justify-content:center">
            <button class="btn primary" id="again">再来一组</button>
            <a class="btn" href="#/wrongs">看错题图谱</a>
            <a class="btn" href="#/review">翻卡复习</a>
          </div></section>`;
        stage.querySelector('#again').addEventListener('click', intro);
      }

      intro();
    },
  };

  /* ------------------------------------------------------------------ *
   * 6. 翻卡复习（SRS）
   * ------------------------------------------------------------------ */
  P.review = {
    title: '翻卡复习',
    render({ root, store }) {
      root.appendChild(el(pageHead('翻卡复习',
        '正面只看图：先自己说出「识别信号 + 第一步动作」，再翻背面核对。按会 / 模糊 / 不会安排下次。',
        '<a href="#/">今日</a> / 翻卡复习')));

      const all = A.byLayer('pattern').filter((c) => inTier(c));
      const due = store.dueCards(all.map((c) => c.id)).map((x) => cardById(x.id)).filter(Boolean);
      const queue = due.length ? due.slice(0, 12) : all.slice(0, 6);
      root.appendChild(el(`<div class="row mb"><span class="pill">到期 ${due.length} 张</span>
        <span class="pill">本次 ${queue.length} 张</span>
        <span class="small muted">当前档位：${esc(tierName(tierOf()))}</span></div>`));

      const wrap = el('<div class="flip-wrap"></div>');
      root.appendChild(wrap);
      let i = 0, flipped = false;

      function paint() {
        if (i >= queue.length) {
          wrap.innerHTML = `<section class="card card-pad center">
            <h2 style="margin:0 0 8px;font-size:21px">这一轮完成 ✓</h2>
            <p class="muted">间隔重复已更新，明天会按「模糊 / 不会」优先排给你。</p>
            <div class="btn-row mt" style="justify-content:center">
              <a class="btn primary" href="#/drill">去做限时识别</a>
              <a class="btn" href="#/patterns">回模型库</a></div></section>`;
          store.markDone('review');
          return;
        }
        const c = queue[i];
        flipped = false;
        wrap.innerHTML = `
          <div class="flip" id="flip">
            <div class="flip-face" id="front">
              <div class="spread mb"><span class="tag pattern">基本图形</span>
                <span class="small muted">${i + 1} / ${queue.length}</span></div>
              <div class="fig-host" id="rfig" style="min-height:210px"></div>
              <div class="center mt"><b style="font-family:var(--serif);font-size:17px">这是什么图形？</b></div>
              <div class="center small muted mt-s">说出识别信号与第一步动作，然后翻面</div>
              <div class="center mt"><button class="btn primary" id="doflip">翻面核对 →</button></div>
            </div>
            <div class="flip-face flip-back" id="back">
              <div class="spread mb"><h2 style="margin:0;font-size:20px">${esc(c.title)}</h2>
                <a class="btn sm" href="${A.cardHref(c.id)}">详情 ↗</a></div>
              ${c.signals ? `<div class="small muted">识别信号</div><div class="mb">${(c.signals || []).map((s) => `<span class="pill">${MD.inlineRender(s)}</span>`).join(' ')}</div>` : ''}
              ${c.identify ? `<div class="note" style="margin:0 0 10px">${MD.inlineRender(c.identify)}</div>` : ''}
              ${c.action ? `<div class="row" style="align-items:flex-start"><span class="tag t3">第一步</span><div>${MD.inlineRender(c.action)}</div></div>` : ''}
              ${c.conclusions ? `<div class="mt prose small">${c.conclusions.map((x) => MD.inlineRender(x)).join('<br>')}</div>` : ''}
            </div>
          </div>
          <div class="center mt" id="rate" style="visibility:hidden">
            <div class="small muted mb">回想得怎么样？</div>
            <div class="btn-row" style="justify-content:center">
              <button class="btn" data-g="1">不会 · 明天再来</button>
              <button class="btn" data-g="2">模糊 · 短期再见</button>
              <button class="btn primary" data-g="3">会 · 拉长间隔</button>
            </div></div>`;
        const fg = wrap.querySelector('#rfig');
        if (c.figure && Geo.registry[c.figure]) Geo.thumb(fg, c.figure, { figOpts: { size: [420, 220], font: 13 } });
        else fg.innerHTML = '<div class="fig-missing">这张卡暂无配图</div>';
        const flip = wrap.querySelector('#flip');
        const rate = wrap.querySelector('#rate');
        wrap.querySelector('#doflip').addEventListener('click', () => {
          flipped = true; flip.classList.add('flipped');
          rate.style.visibility = 'visible';
        });
        rate.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => {
          if (!flipped) return;
          const r = store.review(c.id, Number(b.dataset.g));
          A.toast(`${r.ivl} 天后再见`);
          i++;
          /* 评满 3 张即算完成今日「回顾 3 张」；整轮完成也会打卡 */
          if (i >= 3) store.markDone('review');
          paint();
        }));
      }
      if (queue.length) paint();
      else root.appendChild(el('<div class="empty">这个档位还没有卡片。</div>'));
    },
  };

  /* ------------------------------------------------------------------ *
   * 7. 错题图谱
   * ------------------------------------------------------------------ */
  P.wrongs = {
    title: '错题图谱',
    render({ root, store }) {
      root.appendChild(el(pageHead('错题图谱',
        '按「模型 × 错因」定位薄弱点。错题只记模型和错因，不抄整题——这样才能迁移。',
        '<a href="#/">今日</a> / 错题图谱')));

      const stats = store.wrongStats();
      const ids = Object.keys(stats).sort((a, b) => stats[b].total - stats[a].total);
      const types = S.ERROR_TYPES;

      if (!ids.length) {
        root.appendChild(el(`<div class="empty"><b>还没有错题记录</b>
          去训练场做一组，或在例题页点「这题卡在哪」。<br><br>
          <a class="btn primary" href="#/drill">去训练场 →</a></div>`));
        return;
      }

      const max = Math.max(...Object.values(stats).map((s) => s.total));
      root.appendChild(el(`<section class="card card-pad mb">
        <h2 style="margin:0 0 4px;font-size:19px">热力图</h2>
        <p class="small muted">颜色越深，同一个模型上栽的次数越多。先看「完全没想到」那一列——那是识别问题，不是计算问题。</p>
        <div class="heat mt" id="heat">
          <div class="h"></div>${types.map((t) => `<div class="h">${esc(t.label)}</div>`).join('')}
          ${ids.map((id) => {
            const s = stats[id];
            return `<div class="rl" title="${esc(id)}"><a href="${A.cardHref(id)}">${esc((cardById(id) || {}).title || id)}</a></div>` +
              types.map((t) => {
                const v = s.byType[t.k] || 0;
                const lv = v === 0 ? '' : v / max > 0.66 ? 'v3' : v / max > 0.33 ? 'v2' : 'v1';
                return `<div class="c ${lv}">${v || '·'}</div>`;
              }).join('');
          }).join('')}
        </div></section>`));

      const blind = ids.filter((id) => (stats[id].byType.blind || 0) > 0).slice(0, 6);
      root.appendChild(el(`<section class="card card-pad mb">
        <h2 style="margin:0 0 4px;font-size:19px">优先复现清单</h2>
        <p class="small muted">「完全没想到」的模型，按识别信号重读一遍，然后去训练场重测。</p>
        <div class="cardwall mt" id="repro"></div></section>`));
      const w = root.querySelector('#repro');
      if (blind.length) blind.forEach((id) => { const c = cardById(id); if (c) w.appendChild(A.cardTile(c)); });
      else w.innerHTML = '<div class="empty">没有「完全没想到」类错误，识别这一关目前是稳的。</div>';

      root.appendChild(el(`<section class="card card-pad">
        <div class="spread"><div><h2 style="margin:0;font-size:18px">数据</h2>
          <div class="small muted">累计 ${store.s.wrongs.length} 条错因记录 · 训练场正确率
            ${store.s.stats.answered ? Math.round(store.s.stats.right / store.s.stats.answered * 100) + '%' : '—'}</div></div>
          <div class="btn-row"><button class="btn sm" id="exp">导出备份</button>
            <button class="btn sm" id="imp">导入</button>
            <button class="btn sm ghost" id="clr">清空记录</button></div></div>
        <input type="file" id="file" accept="application/json" style="display:none">
      </section>`));
      const sec = root.lastElementChild;
      sec.querySelector('#exp').addEventListener('click', () => {
        const blob = new Blob([store.exportJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `几何训练备份-${store.today()}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        A.toast('已导出');
      });
      sec.querySelector('#imp').addEventListener('click', () => sec.querySelector('#file').click());
      sec.querySelector('#file').addEventListener('change', (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => { try { store.importJSON(r.result); A.toast('已导入'); A.route(); } catch (err) { A.toast('文件格式不对'); } };
        r.readAsText(f);
      });
      sec.querySelector('#clr').addEventListener('click', () => {
        if (confirm('确定清空全部学习记录（SRS、错题、打卡）？此操作不可撤销。')) {
          store.reset(); A.toast('已清空'); A.route();
        }
      });
    },
  };

  /* ------------------------------------------------------------------ *
   * 8. 方法地图
   * ------------------------------------------------------------------ */
  P.map = {
    title: '方法地图',
    render({ root }) {
      root.appendChild(el(pageHead('方法地图',
        '四层知识的关系图。点击节点进入卡片；勾选「只看当前档位」可收起无关内容。',
        '<a href="#/">今日</a> / 方法地图')));

      const layers = ['idea', 'method', 'pattern', 'problem'];
      const cols = layers.map((l) => A.byLayer(l).filter((c) => l !== 'problem' || true));
      const W = 1000, rowH = 30, padX = 20, nodeW = 132, nodeH = 24;
      const H = Math.max(...cols.map((c) => c.length)) * rowH + 70;
      const colX = [40, 285, 530, 780];

      const pos = {};
      cols.forEach((list, ci) => list.forEach((c, ri) => {
        pos[c.id] = { x: colX[ci], y: 44 + ri * rowH, c, ci };
      }));

      let links = '';
      for (const c of A.DB.cards) {
        if (!pos[c.id]) continue;
        const from = pos[c.id];
        const toIds = [].concat(c.tools || [], c.patterns || [], c.methods || [], c.ideas || [], c.related || []);
        for (const t of new Set(toIds)) {
          const to = pos[t];
          if (!to || to.x <= from.x) continue;
          const x1 = from.x + nodeW, y1 = from.y + nodeH / 2, x2 = to.x, y2 = to.y + nodeH / 2;
          links += `<path class="link" data-a="${c.id}" data-b="${t}" d="M${x1},${y1} C${x1 + 60},${y1} ${x2 - 60},${y2} ${x2},${y2}"></path>`;
        }
      }

      let nodes = '';
      for (const id in pos) {
        const p = pos[id];
        nodes += `<a class="node ${p.c.layer}" data-id="${id}" href="${A.cardHref(id)}">
          <rect x="${p.x}" y="${p.y}" width="${nodeW}" height="${nodeH}" rx="5"></rect>
          <text x="${p.x + 8}" y="${p.y + 16}">${esc(p.c.title.length > 9 ? p.c.title.slice(0, 8) + '…' : p.c.title)}</text></a>`;
      }

      const heads = layers.map((l, i) =>
        `<text x="${colX[i]}" y="24" style="font-size:13px;font-weight:600" fill="var(--ink-2)">${LAYER[l]}（${cols[i].length}）</text>`).join('');

      const canvas = el(`<div class="map-canvas">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMin meet">${links}${heads}${nodes}</svg></div>`);
      root.appendChild(canvas);

      root.appendChild(el(`<div class="row mt"><span class="small muted">悬停节点看关联，点击进入卡片。</span>
        <label class="row small" style="gap:5px;margin-left:auto"><input type="checkbox" id="tf" checked> 只看当前档位 ${esc(tierName(tierOf()))}</label></div>`));

      const svg = canvas.querySelector('svg');
      const tf = root.querySelector('#tf');
      function apply() {
        const on = tf.checked;
        svg.querySelectorAll('.node').forEach((n) => {
          const c = cardById(n.dataset.id);
          n.classList.toggle('dim', on && c && !inTier(c));
        });
        svg.querySelectorAll('.link').forEach((l) => {
          const a = cardById(l.dataset.a), b = cardById(l.dataset.b);
          l.classList.toggle('dim', on && ((a && !inTier(a)) || (b && !inTier(b))));
        });
      }
      tf.addEventListener('change', apply);
      apply();
    },
  };

  /* ------------------------------------------------------------------ *
   * 9. 关于
   * ------------------------------------------------------------------ */
  P.about = {
    title: '关于',
    render({ root }) {
      const M = meta();
      root.appendChild(el(pageHead('关于与使用方法',
        '这不是题库，是一套「把解题直觉拆成可检索动作」的训练工具。',
        '<a href="#/">今日</a> / 关于')));
      root.appendChild(el(`<section class="card card-pad prose mb">
        <h2 class="md-h" style="margin-top:0">为什么做这个</h2>
        <p>竞赛几何卡住，绝大多数不是「定理没背过」，而是<strong>检索失败</strong>：图里明明有手拉手，却没认出来；
        知道该旋转，却不知道第一步把哪条线转到哪去；辅助线作对了，却接不上要证的结论。</p>
        <p>所以这里不按章节堆内容，而是把知识组织成四层：
        <strong>思想</strong>（调度原则）→ <strong>方法</strong>（落地工具）→
        <strong>基本图形</strong>（图式与识别信号）→ <strong>例题</strong>（决策过程）。</p>

        <h2 class="md-h">以陈祖维的思路为纲</h2>
        <p>课程讲义不公开，这里是对其教学特征的<strong>教学重构</strong>，不是原讲义复刻：
        以<strong>基本图形</strong>为纲，以<strong>平移 / 旋转 / 翻折 / 位似 / 补形</strong>为生成器，
        以<strong>圆的高级观点</strong>（根轴、反演、调和）为高阶延伸。
        辅助线不是灵感，是「补上一个已知的基本图形」的规定动作。</p>

        <h2 class="md-h">解题四步定式</h2>
        <ol class="md-list">
          ${(M.steps || []).map((s) => `<li><strong>${esc(s.title)}</strong>：${esc(s.desc)}。问自己：${esc(s.question || '')}</li>`).join('')}
        </ol>

        <h2 class="md-h">怎么用效率最高</h2>
        <ul class="md-list">
          <li><strong>正卡在一道题上</strong> → 解题罗盘，勾题干特征，看命中理由。</li>
          <li><strong>系统补基础</strong> → 按思想 → 方法 → 基本图形 → 例题的顺序走一遍。</li>
          <li><strong>临考提速</strong> → 训练场限时识别，只练「第一反应」，不写过程。</li>
          <li><strong>总在同一种题上栽</strong> → 错题图谱，看是「没想到」还是「想到不会用」，前者回去背识别信号，后者回去练第一步动作。</li>
        </ul>

        <h2 class="md-h">关于图形</h2>
        <p>所有几何图由本站自研引擎按坐标与约束生成，<strong>可以拖动</strong>。
        每张图内置数学断言（等长、共线、共圆、角度、比例、定理等式），渲染与拖动时反复校验，
        确保示意图不会画错。拖动时留意哪些量在变、哪些量不变——这比背结论有用。</p>

        <h2 class="md-h">数据与隐私</h2>
        <p>全部数据存在本机浏览器 localStorage，不上传、不联网。可在「错题图谱」页导出 / 导入 JSON 备份。
        网站本身零依赖、可离线使用，双击 index.html 即可打开，也可丢到任意静态托管。</p>
      </section>`));

      root.appendChild(el(`<section class="card card-pad">
        <h2 style="margin:0 0 10px;font-size:19px">内容规模</h2>
        <div class="grid g4" id="stats"></div></section>`));
      const st = root.querySelector('#stats');
      st.innerHTML = ['idea', 'method', 'pattern', 'problem'].map((l) =>
        `<div class="card card-pad" style="box-shadow:none;background:var(--bg-soft);text-align:center">
          <div style="font-family:var(--serif);font-size:26px;color:var(--accent)">${A.byLayer(l).length}</div>
          <div class="small muted">${LAYER[l]}</div></div>`).join('') +
        `<div class="card card-pad" style="box-shadow:none;background:var(--bg-soft);text-align:center">
          <div style="font-family:var(--serif);font-size:26px;color:var(--green)">${Object.keys(Geo.registry).length}</div>
          <div class="small muted">可拖动几何图</div></div>`;
    },
  };

  /* 让 App.boot 在页面脚本加载完成后再跑：见 index.html 末尾 */
})(window);
