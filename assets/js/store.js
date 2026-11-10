/* ==========================================================================
   store.js —— 本地状态与间隔重复（零依赖，localStorage）
   ========================================================================== */
(function (global) {
  'use strict';

  const KEY = 'geo-think.v1';

  const DEFAULT = {
    tier: 2,                     // 1 培优 / 2 联赛 / 3 自招
    theme: '',                   // '' 跟随系统 | 'light' | 'dark'
    srs: {},                     // cardId -> { ease, ivl, due, reps, lapses, last }
    marks: {},                   // cardId -> 'known' | 'fuzzy' | 'unknown'（一次性自评）
    wrongs: [],                  // { cardId, error, ts, problemId }
    notes: {},                   // cardId -> 笔记文本
    daily: {},                   // 'YYYY-MM-DD' -> { done: [taskId] }
    stats: { answered: 0, right: 0, byPattern: {} },
    lastVisit: '',
  };

  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT));
      const p = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(DEFAULT)), p);
    } catch (e) {
      console.warn('[store] 读取失败，重置', e);
      return JSON.parse(JSON.stringify(DEFAULT));
    }
  }

  let t = null;
  function save() {
    clearTimeout(t);
    t = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn('[store] 写入失败', e); }
    }, 120);
  }

  /* ------------------------------ 日期工具 ------------------------------ */
  const pad = (n) => String(n).padStart(2, '0');
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const dayDiff = (a, b) => {
    const p = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
    return Math.round((p(b) - p(a)) / 86400000);
  };

  /* ------------------------------ SRS（简化 SM-2） ------------------------------ */
  /* 评价：3 = 会（快速想起）  2 = 模糊  1 = 不会 */
  function review(cardId, grade) {
    const r = S.srs[cardId] || { ease: 2.5, ivl: 0, reps: 0, lapses: 0, due: today(), last: '' };
    if (grade >= 3) {
      r.reps += 1;
      r.ivl = r.ivl === 0 ? 1 : r.ivl === 1 ? 3 : Math.round(r.ivl * r.ease);
      r.ease = Math.min(3.2, r.ease + 0.06);
    } else if (grade === 2) {
      r.reps = Math.max(0, r.reps);
      r.ivl = r.ivl <= 1 ? 1 : Math.max(1, Math.round(r.ivl * 0.6));
      r.ease = Math.max(1.4, r.ease - 0.14);
    } else {
      r.reps = 0;
      r.lapses += 1;
      r.ivl = 0;
      r.ease = Math.max(1.3, r.ease - 0.28);
    }
    const d = new Date();
    d.setDate(d.getDate() + Math.max(r.ivl, grade >= 3 ? r.ivl : 0));
    r.due = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    r.last = today();
    S.srs[cardId] = r;
    S.marks[cardId] = grade >= 3 ? 'known' : grade === 2 ? 'fuzzy' : 'unknown';
    save();
    return r;
  }

  function dueCards(allIds) {
    const t0 = today();
    const due = [];
    for (const id of allIds) {
      const r = S.srs[id];
      if (!r) due.push({ id, why: 'new' });
      else if (r.due <= t0) due.push({ id, why: 'due', r });
    }
    /* 新卡优先安排少量，避免一次堆积 */
    return due;
  }

  function mastery(cardId) {
    const r = S.srs[cardId];
    if (!r) return 0;
    if (r.ivl >= 21) return 3;
    if (r.ivl >= 7) return 2;
    return 1;
  }

  /* ------------------------------ 错题 ------------------------------ */
  const ERROR_TYPES = [
    { k: 'blind', label: '完全没想到', desc: '图里没看出该用的图形' },
    { k: 'know', label: '想到但不会用', desc: '知道该用什么，辅助线作不出来' },
    { k: 'calc', label: '算式算错', desc: '思路对，比例/三角/坐标算错' },
    { k: 'read', label: '图形看错', desc: '条件读错、图形关系误判' },
  ];

  function addWrong(cardId, error, problemId) {
    const t0 = today();
    const dup = S.wrongs.find((w) => w.cardId === cardId && w.error === error && dayDiff(w.ts, t0) === 0);
    if (dup) return;
    S.wrongs.push({ cardId, error, problemId: problemId || '', ts: t0 });
    if (S.wrongs.length > 800) S.wrongs = S.wrongs.slice(-800);
    save();
  }

  function wrongStats() {
    const byCard = {};
    for (const w of S.wrongs) {
      byCard[w.cardId] = byCard[w.cardId] || { total: 0, byType: {} };
      byCard[w.cardId].total += 1;
      byCard[w.cardId].byType[w.error] = (byCard[w.cardId].byType[w.error] || 0) + 1;
    }
    return byCard;
  }

  /* ------------------------------ 打卡 ------------------------------ */
  function markDone(taskId) {
    const t0 = today();
    if (!S.daily[t0]) S.daily[t0] = { done: [] };
    if (!S.daily[t0].done.includes(taskId)) S.daily[t0].done.push(taskId);
    save();
  }
  function isDone(taskId) {
    const t0 = today();
    return !!(S.daily[t0] && S.daily[t0].done.includes(taskId));
  }
  function streak() {
    let n = 0;
    const d = new Date();
    for (;;) {
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const has = S.daily[key] && S.daily[key].done.length > 0;
      if (has) n++;
      else if (n === 0 && dayDiff(key, today()) === 0) { /* 今天还没开始，继续往前看 */ }
      else break;
      d.setDate(d.getDate() - 1);
      if (n > 400) break;
    }
    return n;
  }

  function reset() {
    S = JSON.parse(JSON.stringify(DEFAULT));
    save();
  }

  global.Store = {
    get s() { return S; },
    save, review, dueCards, mastery, addWrong, wrongStats,
    markDone, isDone, streak, today, dayDiff, reset,
    ERROR_TYPES,
    exportJSON: () => JSON.stringify(S, null, 2),
    importJSON(txt) {
      const p = JSON.parse(txt);
      S = Object.assign(JSON.parse(JSON.stringify(DEFAULT)), p);
      save();
    },
  };
})(window);
