/* ==========================================================================
   geo.js —— 极简平面几何绘图引擎（零依赖）
   --------------------------------------------------------------------------
   设计要点
   1. 声明式：图形由「点定义 + 图元」组成，点为自由点（可拖动）或派生点。
   2. 动态：所有图元在渲染时按名字取值，拖动自由点后派生点依定义顺序重算。
   3. 自检：check() 在渲染前校验等长/共线/共圆，防止教学图画错（最致命的错误）。
   4. 输出：直接生成 SVG，公式与文字由页面层负责，本引擎只画几何。

   坐标约定：数学坐标（y 向上），渲染时转换为屏幕坐标（y 向下）。
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------ 向量与几何 ------------------------------ */
  const EPS = 1e-9;
  const L = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, k) => [a[0] * k, a[1] * k],
    mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
    len: (a) => Math.hypot(a[0], a[1]),
    dist: (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]),
    dot: (a, b) => a[0] * b[0] + a[1] * b[1],
    cross: (a, b) => a[0] * b[1] - a[1] * b[0],
    unit: (a) => { const d = L.len(a) || 1; return [a[0] / d, a[1] / d]; },
    perp: (a) => [-a[1], a[0]],
    rot: (p, o, deg) => {
      const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
      const x = p[0] - o[0], y = p[1] - o[1];
      return [o[0] + x * c - y * s, o[1] + x * s + y * c];
    },
    rotScale: (p, o, deg, k) => {
      const q = L.rot(p, o, deg);
      return [o[0] + (q[0] - o[0]) * k, o[1] + (q[1] - o[1]) * k];
    },
    /* 点 p 到直线 a→b 的垂足 */
    foot: (p, a, b) => {
      const d = L.sub(b, a), t = L.dot(L.sub(p, a), d) / (L.dot(d, d) || 1);
      return L.lerp(a, b, t);
    },
    /* 点到直线距离 */
    distLine: (p, a, b) => L.dist(p, L.foot(p, a, b)),
    reflect: (p, a, b) => {
      const f0 = L.foot(p, a, b);
      return [2 * f0[0] - p[0], 2 * f0[1] - p[1]];
    },
    /* 两直线交点（平行返回 null） */
    interLL: (p1, p2, p3, p4) => {
      const d1 = L.sub(p2, p1), d2 = L.sub(p4, p3);
      const den = L.cross(d1, d2);
      if (Math.abs(den) < 1e-12) return null;
      const t = L.cross(L.sub(p3, p1), d2) / den;
      return [p1[0] + d1[0] * t, p1[1] + d1[1] * t];
    },
    /* 直线与圆交点，which=0/1 取哪一支 */
    interLC: (p1, p2, o, r, which) => {
      const d = L.sub(p2, p1);
      const a = L.dot(d, d), b = 2 * L.dot(d, L.sub(p1, o)), c = L.dot(L.sub(p1, o), L.sub(p1, o)) - r * r;
      const disc = b * b - 4 * a * c;
      if (disc < 0) return null;
      const sq = Math.sqrt(disc);
      const ts = [(-b - sq) / (2 * a), (-b + sq) / (2 * a)].sort((x, y) => x - y);
      return L.lerp(p1, p2, ts[which === 'far' ? 1 : 0]);
    },
    /* 两圆交点 */
    interCC: (o1, r1, o2, r2, which) => {
      const d = L.dist(o1, o2);
      if (d < EPS || d > r1 + r2 + EPS || d < Math.abs(r1 - r2) - EPS) return null;
      const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
      const h2 = r1 * r1 - a * a, h = Math.sqrt(Math.max(h2, 0));
      const u = L.unit(L.sub(o2, o1));
      const m = L.add(o1, L.mul(u, a));
      const n = L.mul([-u[1], u[0]], h);
      return which === 1 ? L.add(m, n) : L.sub(m, n);
    },
    angle: (v, a, b) => {
      const u = L.sub(a, v), w = L.sub(b, v);
      let t = Math.atan2(L.cross(u, w), L.dot(u, w));
      return Math.abs((t * 180) / Math.PI);
    },
    /* 复数乘法：把向量旋转+缩放 */
    cmul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
    cdiv: (a, b) => {
      const d = b[0] * b[0] + b[1] * b[1] || 1;
      return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
    },
    circumcenter: (a, b, c) => {
      const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
      if (Math.abs(d) < 1e-12) return null;
      const a2 = L.dot(a, a), b2 = L.dot(b, b), c2 = L.dot(c, c);
      return [
        (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d,
        (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d,
      ];
    },
  };

  /* --------------------------- 派生点构造器（thunk） --------------------------- */
  /* 每个构造器返回 f => [x,y]，在渲染时按名字实时求值，从而支持拖动。 */
  const D = {
    mid: (a, b) => (f) => L.mid(f.p(a), f.p(b)),
    lerp: (a, b, t) => (f) => L.lerp(f.p(a), f.p(b), t),
    /* a 沿 b→a 方向延长，使 A 为中点：P = 2a - b */
    double: (a, b) => (f) => [2 * f.p(a)[0] - f.p(b)[0], 2 * f.p(a)[1] - f.p(b)[1]],
    ext: (a, b, k) => (f) => L.lerp(f.p(a), f.p(b), 1 + k),
    rot: (a, o, deg) => (f) => L.rot(f.p(a), f.p(o), deg),
    rotScale: (a, o, deg, k) => (f) => L.rotScale(f.p(a), f.p(o), deg, k),
    foot: (a, p, q) => (f) => L.foot(f.p(a), f.p(p), f.p(q)),
    reflect: (a, p, q) => (f) => L.reflect(f.p(a), f.p(p), f.p(q)),
    inter: (a, b, c, d) => (f) => L.interLL(f.p(a), f.p(b), f.p(c), f.p(d)),
    interLC: (a, b, o, r, which) => (f) => L.interLC(f.p(a), f.p(b), f.p(o), f.r(r), which),
    interCC: (o1, r1, o2, r2, which) => (f) => L.interCC(f.p(o1), f.r(r1), f.p(o2), f.r(r2), which),
    /* 直线 a→b 外一点 p，作垂线交 ab 于 foot（即 foot 的别名，语义化） */
    circumcenter: (a, b, c) => (f) => L.circumcenter(f.p(a), f.p(b), f.p(c)),
    centroid: (a, b, c) => (f) => {
      const p = f.p(a), q = f.p(b), r = f.p(c);
      return [(p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3];
    },
    orthocenter: (a, b, c) => (f) => {
      const A = f.p(a), B = f.p(b), C = f.p(c);
      const h1 = L.perp(L.sub(B, C)), h2 = L.perp(L.sub(A, C));
      return L.interLL(A, L.add(A, h1), B, L.add(B, h2));
    },
    /* 角平分线与对边的交点（内角） */
    bisectorFoot: (a, v, c) => (f) => {
      const A = f.p(a), V = f.p(v), C = f.p(c);
      const ua = L.unit(L.sub(A, V)), uc = L.unit(L.sub(C, V));
      const d = L.add(ua, uc);
      return L.interLL(V, L.add(V, d), A, C);
    },
    /* 外角平分线交点 */
    eBisectorFoot: (a, v, c) => (f) => {
      const A = f.p(a), V = f.p(v), C = f.p(c);
      const ua = L.unit(L.sub(A, V)), uc = L.unit(L.sub(C, V));
      const d = L.sub(ua, uc);
      return L.interLL(V, L.add(V, d), A, C);
    },
    /* 过点 a 作 bc 的平行线与另一直线的交点 */
    parInter: (a, b, c, p, q) => (f) => {
      const d = L.sub(f.p(c), f.p(b));
      return L.interLL(f.p(a), L.add(f.p(a), d), f.p(p), f.p(q));
    },
    /* 在射线 v→a 上取距离 d 的点 */
    along: (v, a, d) => (f) => L.add(f.p(v), L.mul(L.unit(L.sub(f.p(a), f.p(v))), d)),
    /* 极坐标 */
    polar: (o, r, deg) => (f) => L.add(f.p(o), [f.r(r) * Math.cos(deg * Math.PI / 180), f.r(r) * Math.sin(deg * Math.PI / 180)]),
  };

  /* --------------------------------- 图形类 --------------------------------- */
  let uid = 0;

  class Fig {
    constructor(cfg) {
      this.cfg = cfg || {};
      this.pts = {};         // name -> {kind:'free'|'derived', x,y | fn}
      this.order = [];       // 求值顺序
      this.prims = [];       // 图元
      this.checks = [];
      this.size = cfg.size || [460, 340];
    }

    /* 自由点（可拖动）。constraint 可选：
       {t:'seg', a, b}        沿线 a→b 滑动
       {t:'circle', o, r}     绕定点转动（r 可为数字或 'A-B'）
       {t:'h'} / {t:'v'}      水平 / 竖直滑动
       {t:'fn', fn}           自定义：fn(fig, [x,y]) => [x,y]                    */
    free(name, x, y, constraint) {
      this.pts[name] = { kind: 'free', x, y, constraint: constraint || null };
      this.order.push(name);
      return name;
    }
    constrain(name, m) {
      const c = this.pts[name].constraint;
      if (!c) return m;
      let out = m;
      if (c.t === 'seg') {
        const A = this.p(c.a), B = this.p(c.b);
        const d = L.sub(B, A), den = L.dot(d, d) || 1;
        let t = L.dot(L.sub(m, A), d) / den;
        t = Math.max(c.lo === undefined ? 0.04 : c.lo, Math.min(c.hi === undefined ? 0.96 : c.hi, t));
        out = L.lerp(A, B, t);
      } else if (c.t === 'circle') {
        const O = this.p(c.o), r = this.r(c.r);
        const d = L.sub(m, O), len = L.len(d) || 1;
        out = L.add(O, L.mul([d[0] / len, d[1] / len], r));
      } else if (c.t === 'h') out = [m[0], this.pts[name].y];
      else if (c.t === 'v') out = [this.pts[name].x, m[1]];
      else if (c.t === 'fn') out = c.fn(this, m) || m;
      return out;
    }
    /* 固定点：参与构图与计算，但不出现在拖动热区里 */
    fixed(name, x, y) { this.pts[name] = { kind: 'derived', fn: () => [x, y] }; this.order.push(name); return name; }
    /* 派生点 */
    def(name, thunk) { this.pts[name] = { kind: 'derived', fn: thunk }; this.order.push(name); return name; }

    /* 半径可以是数字，也可以是两点名（动态距离） */
    r(v) {
      if (typeof v === 'number') return v;
      if (Array.isArray(v)) return L.len(v);
      if (typeof v === 'string' && v.includes('-')) {
        const [a, b] = v.split('-');
        return L.dist(this.p(a), this.p(b));
      }
      return Number(v);
    }

    /* 取点坐标（渲染期实时求值并缓存） */
    p(name) {
      const d = this.pts[name];
      if (!d) { console.warn('[geo] 未定义的点:', name); return [0, 0]; }
      if (d.kind === 'free') return [d.x, d.y];
      if (d._cache) return d._cache;
      const v = d.fn(this);
      d._cache = v || [0, 0];
      return d._cache;
    }

    solve() {
      const freeNames = this.order.filter((n) => this.pts[n].kind === 'free');
      const settle = () => {
        for (const n of this.order) {
          const d = this.pts[n];
          if (d.kind === 'derived') d._cache = null;
        }
        for (const n of this.order) {
          const d = this.pts[n];
          if (d.kind === 'derived') {
            const v = d.fn(this);
            d._cache = v || [0, 0];
            if (!v) this._bad = n;
          }
        }
      };
      settle();
      /* 自由点的约束（沿边/绕圆）在首次渲染时也要生效，否则初始图就是错的。
         约束可能依赖派生点，派生点又依赖自由点，故迭代到收敛（通常 ≤ 2 轮）。 */
      for (let pass = 0; pass < 4; pass++) {
        let moved = false;
        for (const n of freeNames) {
          const d = this.pts[n];
          if (!d.constraint) continue;
          const before = [d.x, d.y];
          const after = this.constrain(n, before);
          if (Math.abs(after[0] - before[0]) + Math.abs(after[1] - before[1]) > 1e-9) moved = true;
          d.x = after[0]; d.y = after[1];
        }
        if (!moved) break;
        settle();
      }
    }

    /* ----------------------------- 图元声明 ----------------------------- */
    seg(a, b, o) { this.prims.push({ t: 'seg', a, b, o: o || {} }); return this; }
    poly(list, o) { for (let i = 0; i < list.length; i++) this.seg(list[i], list[(i + 1) % list.length], o); return this; }
    chain(list, o) { for (let i = 0; i < list.length - 1; i++) this.seg(list[i], list[i + 1], o); return this; }
    dash(a, b, o) { return this.seg(a, b, Object.assign({ dash: true }, o || {})); }
    circle(o, r, op) { this.prims.push({ t: 'circle', o, r, op: op || {} }); return this; }
    arcPts(list, o) { this.prims.push({ t: 'path', list, o: o || {} }); return this; }
    /* 圆弧：圆心 o，从 a 到 b 的劣弧（除非 large） */
    arc(o, a, b, op) { this.prims.push({ t: 'arc', o, a, b, op: op || {} }); return this; }
    /* 点标记 */
    dot(name, o) { this.prims.push({ t: 'dot', name, o: o || {} }); return this; }
    /* 点名标签，dx/dy 为偏移（屏幕像素） */
    lab(name, dx, dy) { this.prims.push({ t: 'lab', name, dx: dx || 0, dy: dy || 0 }); return this; }
    /* 自动标签：沿「远离图形重心」的方向外推，省掉逐个调偏移 */
    labAuto(names, o) {
      (names || this.order).forEach((n) => this.prims.push({ t: 'labauto', name: n, o: o || {} }));
      return this;
    }
    /* 自定义文字（数学坐标） */
    text(x, y, s, o) { this.prims.push({ t: 'text', x, y, s, o: o || {} }); return this; }
    /* 角标：顶点 v，两边 a、b */
    angle(a, v, b, o) { this.prims.push({ t: 'angle', a, v, b, o: o || {} }); return this; }
    /* 直角标记 */
    right(a, v, b, o) { this.prims.push({ t: 'right', a, v, b, o: o || {} }); return this; }
    /* 等长刻线：n = 1,2,3 表示第几组 */
    tick(a, b, n, o) { this.prims.push({ t: 'tick', a, b, n: n || 1, o: o || {} }); return this; }
    /* 箭头（向量/方向） */
    arrow(a, b, o) { this.prims.push({ t: 'arrow', a, b, o: o || {} }); return this; }

    /* ----------------------------- 自检 -----------------------------
       约定：cond 传函数（推荐），渲染/拖动时反复求值；也兼容布尔值（只查一次）。 */
    check(label, cond, detail) {
      this.checks.push({ label, cond, detail });
      return this;
    }
    validate() {
      const bad = [];
      for (const c of this.checks) {
        let ok;
        try { ok = typeof c.cond === 'function' ? c.cond() : c.cond; }
        catch (e) { ok = false; }
        if (!ok) bad.push(c);
      }
      return bad;
    }
    near(a, b, tol) { return Math.abs(a - b) < (tol || 1e-6); }
    len(a, b) { return L.dist(this.p(a), this.p(b)); }
    ang(a, v, b) { return L.angle(this.p(v), this.p(a), this.p(b)); }
    rad(a, v, b) { return (L.angle(this.p(v), this.p(a), this.p(b)) * Math.PI) / 180; }
    area(a, b, c) { return Math.abs(L.cross(L.sub(this.p(b), this.p(a)), L.sub(this.p(c), this.p(a)))) / 2; }
    collinear(a, v, b, tol) { return Math.abs(L.cross(L.sub(this.p(a), this.p(v)), L.sub(this.p(b), this.p(v)))) < (tol || 1e-6); }
    eq(lenName, val) { return this.near(this.len(...lenName.split('-')), val, 1e-6); }
  }

  /* --------------------------------- 渲染 --------------------------------- */
  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    return e;
  }

  function render(fig, svg) {
    fig.solve();
    const [W, H] = fig.size;

    /* 视野：所有点与圆的外接框 */
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const expand = (p, r) => {
      if (!p) return;
      x0 = Math.min(x0, p[0] - (r || 0)); y0 = Math.min(y0, p[1] - (r || 0));
      x1 = Math.max(x1, p[0] + (r || 0)); y1 = Math.max(y1, p[1] + (r || 0));
    };
    for (const n of fig.order) expand(fig.p(n), 0);
    for (const pr of fig.prims) {
      if (pr.t === 'circle') expand(fig.p(pr.o), fig.r(pr.r));
      if (pr.t === 'arc') expand(fig.p(pr.o), L.dist(fig.p(pr.o), fig.p(pr.a)));
    }
    if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 1; y1 = 1; }
    const pad = 30;
    const w = Math.max(x1 - x0, 1e-3), h = Math.max(y1 - y0, 1e-3);
    const s = Math.min((W - pad * 2) / w, (H - pad * 2) / h);
    const ox = (W - w * s) / 2 - x0 * s;
    const oy = (H + h * s) / 2 + y0 * s;      // y 翻转
    const T = (p) => [ox + p[0] * s, oy - p[1] * s];

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const font = fig.cfg.font || 15;
    const stroke = fig.cfg.stroke || 1.6;

    for (const pr of fig.prims) {
      const o = pr.o || {};
      const cls = o.cls || '';
      if (pr.t === 'seg' || pr.t === 'arrow') {
        const A = T(fig.p(pr.a)), B = T(fig.p(pr.b));
        const line = el('line', {
          x1: A[0], y1: A[1], x2: B[0], y2: B[1],
          stroke: o.color || 'var(--geo-line, #26303d)',
          'stroke-width': o.w || stroke,
          'stroke-dasharray': o.dash ? '6 5' : null,
          'stroke-linecap': 'round',
          class: cls,
        });
        svg.appendChild(line);
        if (pr.t === 'arrow') {
          const u = L.unit([B[0] - A[0], B[1] - A[1]]);
          const n = [-u[1], u[0]];
          const tip = B, back = [B[0] - u[0] * 9, B[1] - u[1] * 9];
          svg.appendChild(el('path', {
            d: `M${tip[0]},${tip[1]} L${back[0] + n[0] * 4},${back[1] + n[1] * 4} L${back[0] - n[0] * 4},${back[1] - n[1] * 4} Z`,
            fill: o.color || 'var(--geo-line, #26303d)',
          }));
        }
      } else if (pr.t === 'circle') {
        const C = T(fig.p(pr.o)), R = fig.r(pr.r) * s;
        if (R > 0.5) {
          svg.appendChild(el('circle', {
            cx: C[0], cy: C[1], r: R,
            fill: o.fill || 'none',
            stroke: o.color || 'var(--geo-line, #26303d)',
            'stroke-width': o.w || stroke,
            'stroke-dasharray': o.dash ? '6 5' : null,
            class: o.cls || '',
          }));
        }
      } else if (pr.t === 'arc') {
        const O = T(fig.p(pr.o));
        const A = T(fig.p(pr.a)), B = T(fig.p(pr.b));
        const R = L.dist(O, A);
        let a0 = Math.atan2(A[1] - O[1], A[0] - O[0]);
        let a1 = Math.atan2(B[1] - O[1], B[0] - O[0]);
        let d = a1 - a0;
        while (d <= -Math.PI) d += 2 * Math.PI;
        while (d > Math.PI) d -= 2 * Math.PI;
        const N = 40, pts = [];
        for (let i = 0; i <= N; i++) {
          const t = a0 + (d * i) / N;
          pts.push(`${O[0] + R * Math.cos(t)},${O[1] + R * Math.sin(t)}`);
        }
        svg.appendChild(el('polyline', {
          points: pts.join(' '), fill: 'none',
          stroke: o.color || 'var(--geo-line, #26303d)',
          'stroke-width': o.w || stroke,
          'stroke-dasharray': o.dash ? '6 5' : null,
        }));
      } else if (pr.t === 'path') {
        const pts = pr.list.map((n) => T(fig.p(n)));
        svg.appendChild(el('polyline', {
          points: pts.map((q) => q.join(',')).join(' '), fill: 'none',
          stroke: o.color || 'var(--geo-line, #26303d)',
          'stroke-width': o.w || stroke,
          'stroke-dasharray': o.dash ? '6 5' : null,
        }));
      } else if (pr.t === 'dot') {
        const P = T(fig.p(pr.name));
        svg.appendChild(el('circle', {
          cx: P[0], cy: P[1], r: o.r || 2.8,
          fill: o.color || 'var(--geo-line, #26303d)',
        }));
      } else if (pr.t === 'angle') {
        const V = T(fig.p(pr.v)), A = T(fig.p(pr.a)), B = T(fig.p(pr.b));
        const rad = o.r || 17;
        const ua = L.unit([A[0] - V[0], A[1] - V[1]]), ub = L.unit([B[0] - V[0], B[1] - V[1]]);
        let a0 = Math.atan2(ua[1], ua[0]), a1 = Math.atan2(ub[1], ub[0]);
        let d = a1 - a0;
        while (d <= -Math.PI) d += 2 * Math.PI;
        while (d > Math.PI) d -= 2 * Math.PI;
        const N = 24, pts = [];
        for (let i = 0; i <= N; i++) {
          const t = a0 + (d * i) / N;
          pts.push(`${V[0] + rad * Math.cos(t)},${V[1] + rad * Math.sin(t)}`);
        }
        svg.appendChild(el('polyline', {
          points: pts.join(' '), fill: 'none',
          stroke: o.color || 'var(--geo-aux, #c8632b)',
          'stroke-width': o.w || 1.3,
        }));
        if (o.label) {
          const am = a0 + d / 2, rr = rad + (o.push || 13);
          const tx = V[0] + rr * Math.cos(am), ty = V[1] + rr * Math.sin(am);
          const t = el('text', {
            x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-size': o.fs || font - 1, fill: o.color || 'var(--geo-aux, #c8632b)',
          });
          t.textContent = o.label;
          svg.appendChild(t);
        }
      } else if (pr.t === 'right') {
        const V = T(fig.p(pr.v)), A = T(fig.p(pr.a)), B = T(fig.p(pr.b));
        const sz = o.size || 10;
        const ua = L.unit([A[0] - V[0], A[1] - V[1]]), ub = L.unit([B[0] - V[0], B[1] - V[1]]);
        const p1 = [V[0] + ua[0] * sz, V[1] + ua[1] * sz];
        const p2 = [V[0] + ub[0] * sz, V[1] + ub[1] * sz];
        const p3 = [p1[0] + ub[0] * sz, p1[1] + ub[1] * sz];
        svg.appendChild(el('polyline', {
          points: `${p1[0]},${p1[1]} ${p3[0]},${p3[1]} ${p2[0]},${p2[1]}`,
          fill: 'none', stroke: o.color || 'var(--geo-aux, #c8632b)', 'stroke-width': o.w || 1.3,
        }));
      } else if (pr.t === 'tick') {
        const A = T(fig.p(pr.a)), B = T(fig.p(pr.b));
        const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        const u = L.unit([B[0] - A[0], B[1] - A[1]]);
        const n = [-u[1], u[0]];
        const nT = pr.n;
        for (let i = 0; i < nT; i++) {
          const off = (i - (nT - 1) / 2) * 4.5;
          const c = [m[0] + u[0] * off, m[1] + u[1] * off];
          svg.appendChild(el('line', {
            x1: c[0] - n[0] * 4, y1: c[1] - n[1] * 4,
            x2: c[0] + n[0] * 4, y2: c[1] + n[1] * 4,
            stroke: o.color || 'var(--geo-aux, #c8632b)', 'stroke-width': 1.4,
          }));
        }
      } else if (pr.t === 'lab') {
        const P = T(fig.p(pr.name));
        const t = el('text', {
          x: P[0] + pr.dx, y: P[1] + pr.dy,
          'text-anchor': 'middle', 'dominant-baseline': 'central',
          'font-size': o.fs || font, 'font-style': 'italic',
          'font-family': 'var(--geo-font, "Times New Roman", serif)',
          fill: o.color || 'var(--geo-text, #1d2733)',
          'paint-order': 'stroke', stroke: 'var(--geo-bg, #fff)', 'stroke-width': 3.5,
        });
        t.textContent = pr.name;
        svg.appendChild(t);
      } else if (pr.t === 'labauto') {
        /* 自动向外偏移：远离所有点的重心，并避开竖直/水平最近邻 */
        const P = T(fig.p(pr.name));
        const Q = fig.p(pr.name);
        let cx = 0, cy = 0, n = 0;
        for (const nm of fig.order) { const q = fig.p(nm); cx += q[0]; cy += q[1]; n++; }
        cx /= n; cy /= n;
        let dx = Q[0] - cx, dy = Q[1] - cy;
        const dl = Math.hypot(dx, dy) || 1;
        dx /= dl; dy /= dl;
        /* 若几乎与某条边同向，稍微偏转以免压线 */
        const off = o.off || 15;
        const px = P[0] + dx * off, py = P[1] - dy * off;
        const t = el('text', {
          x: px, y: py, 'text-anchor': 'middle', 'dominant-baseline': 'central',
          'font-size': o.fs || font, 'font-style': 'italic',
          'font-family': 'var(--geo-font, "Times New Roman", serif)',
          fill: o.color || 'var(--geo-text, #1d2733)',
          'paint-order': 'stroke', stroke: 'var(--geo-bg, #fff)', 'stroke-width': 3.5,
        });
        t.textContent = pr.name;
        svg.appendChild(t);
      } else if (pr.t === 'text') {
        const P = T([pr.x, pr.y]);
        const t = el('text', {
          x: P[0], y: P[1],
          'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'central',
          'font-size': o.fs || font - 1, fill: o.color || 'var(--geo-aux, #c8632b)',
          'paint-order': 'stroke', stroke: 'var(--geo-bg, #fff)', 'stroke-width': 3,
        });
        t.textContent = pr.s;
        svg.appendChild(t);
      }
    }

    /* 拖动热区（透明，最后加，保证在最上层） */
    for (const n of fig.order) {
      const d = fig.pts[n];
      if (d.kind !== 'free') continue;
      const P = T(fig.p(n));
      const c = el('circle', {
        cx: P[0], cy: P[1], r: 13, fill: 'transparent',
        style: 'cursor:grab', 'data-drag': n,
      });
      svg.appendChild(c);
    }
    fig._T = T;
    fig._invT = (px, py) => [(px - ox) / s, (oy - py) / s];
  }

  /* -------------------------------- 交互与挂载 -------------------------------- */
  const registry = {};

  function register(id, cfg) { registry[id] = cfg; }

  function mount(host, id, opts) {
    opts = opts || {};
    const cfg = registry[id];
    if (!cfg) {
      host.innerHTML = `<div class="fig-missing">缺图：${id}</div>`;
      return null;
    }
    const fig = new Fig(Object.assign({}, cfg, opts.figOpts || {}));
    cfg.build(fig);

    const wrap = document.createElement('div');
    wrap.className = 'fig-wrap' + (opts.cls ? ' ' + opts.cls : '');
    const svg = el('svg', { class: 'geo', role: 'img', 'aria-label': opts.alt || cfg.alt || '几何图形' });
    wrap.appendChild(svg);

    /* 拖拽提示与复位 */
    let hasFree = Object.values(fig.pts).some((d) => d.kind === 'free');
    if (hasFree && opts.drag !== false) {
      const bar = document.createElement('div');
      bar.className = 'fig-bar';
      bar.innerHTML = `<span class="fig-hint">拖动彩色点，看结论是否一直成立</span><button class="fig-reset" type="button">复位</button>`;
      wrap.appendChild(bar);
      const init = {};
      for (const n in fig.pts) if (fig.pts[n].kind === 'free') init[n] = [fig.pts[n].x, fig.pts[n].y];
      bar.querySelector('.fig-reset').addEventListener('click', () => {
        for (const n in init) { fig.pts[n].x = init[n][0]; fig.pts[n].y = init[n][1]; }
        draw();
      });
    }

    if (cfg.caption && opts.caption !== false) {
      const cap = document.createElement('div');
      cap.className = 'fig-cap';
      cap.innerHTML = cfg.caption;
      wrap.appendChild(cap);
    }

    function draw() {
      render(fig, svg);
      /* 自检结果：拖动时也会反复校验，确保图形前提不变量没被破坏 */
      const bad = fig.validate();
      if (bad.length) {
        console.error('[geo] 图形自检失败 <' + id + '>:',
          bad.map((b) => b.label + (b.detail ? ' :: ' + b.detail : '')).join(' | '));
        wrap.dataset.checkfail = bad.length;
      } else {
        delete wrap.dataset.checkfail;
      }
      if (opts.onDraw) opts.onDraw(fig, bad);
    }

    /* 拖动（带约束） */
    let drag = null;
    svg.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('[data-drag]');
      if (!t) return;
      drag = t.getAttribute('data-drag');
      svg.setPointerCapture(e.pointerId);
      t.style.cursor = 'grabbing';
      e.preventDefault();
    });
    svg.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const r = svg.getBoundingClientRect();
      const vb = fig.size;
      const px = ((e.clientX - r.left) / r.width) * vb[0];
      const py = ((e.clientY - r.top) / r.height) * vb[1];
      const m = fig.constrain(drag, fig._invT(px, py));
      fig.pts[drag].x = m[0]; fig.pts[drag].y = m[1];
      draw();
    });
    const end = () => {
      if (drag) { drag = null; svg.querySelectorAll('[data-drag]').forEach((n) => { n.style.cursor = 'grab'; }); }
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);

    host.appendChild(wrap);
    draw();
    return fig;
  }

  /* 静态缩略图（用于卡片，不挂交互） */
  function thumb(host, id, opts) {
    return mount(host, id, Object.assign({ drag: false, caption: false }, opts || {}));
  }

  global.Geo = { L, D, Fig, register, mount, thumb, render, registry };
})(window);
