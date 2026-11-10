/* ==========================================================================
   figures.js —— 图形库（零依赖）
   约定：
   - 自由点可拖动，并尽量带约束，保证「拖动后图形前提仍成立」；
   - 每个图末尾 check(label, fn) 写死数学断言，渲染/拖动时反复校验，
     一旦图形画错会在控制台报错并在图框上留 data-checkfail 标记；
   - 半径可用 'O-A' 表示 |OA|，圆会随着点动而动。
   ========================================================================== */
(function (G) {
  'use strict';
  const L = G.L, D = G.D, R = G.register;
  const V = (v) => L.rot(v, [0, 0], 0); // no-op，仅提示向量用法

  /* ---------- 通用小工具 ---------- */
  const onCircle = (name, center, radiusPt, ang) => (f) => {
    const O = f.p(center), r = L.dist(O, f.p(radiusPt));
    return [O[0] + r * Math.cos(ang), O[1] + r * Math.sin(ang)];
  };
  const unit = (v) => L.unit(v);
  const rotV = (v, deg) => L.rot(v, [0, 0], deg);

  /* ==================================================================== *
   * 1. 手拉手（共顶点等腰旋转）
   * ==================================================================== */
  R('fig-hand-in-hand', {
    alt: '两个共顶点等腰三角形的旋转关系',
    caption: '绕 A 旋转 46°：B→C，D→E，于是 BD→CE。拖动 B、D 或 A 验证 BD = CE 恒成立。',
    size: [440, 340],
    build(f) {
      f.free('A', 0, 0);
      f.free('B', 3.4, 0.2);
      f.free('D', 1.4, -1.3);
      f.def('C', D.rot('B', 'A', 46));
      f.def('E', D.rot('D', 'A', 46));
      f.def('P', D.inter('B', 'D', 'C', 'E'));

      f.seg('A', 'B').seg('A', 'C').seg('A', 'D').seg('A', 'E');
      f.seg('B', 'C', { dash: true }).seg('D', 'E', { dash: true });
      f.seg('B', 'P').seg('C', 'P');
      f.tick('A', 'B', 1).tick('A', 'C', 1);
      f.tick('A', 'D', 2).tick('A', 'E', 2);
      f.angle('B', 'A', 'D', { r: 16 });
      f.angle('C', 'A', 'E', { r: 22 });
      f.dot('P');
      f.labAuto(['A', 'B', 'C', 'D', 'E', 'P']);

      f.check('AB=AC', () => f.near(f.len('A', 'B'), f.len('A', 'C'), 1e-9));
      f.check('AD=AE', () => f.near(f.len('A', 'D'), f.len('A', 'E'), 1e-9));
      f.check('∠BAC=∠DAE', () => f.near(f.ang('B', 'A', 'C'), f.ang('D', 'A', 'E'), 1e-9));
      f.check('BD=CE', () => f.near(f.len('B', 'D'), f.len('C', 'E'), 1e-9));
      f.check('BD 与 CE 夹角 = 旋转角 46°', () => {
        const d1 = L.sub(f.p('D'), f.p('B')), d2 = L.sub(f.p('E'), f.p('C'));
        const a = Math.abs(Math.atan2(L.cross(d1, d2), L.dot(d1, d2)) * 180 / Math.PI);
        return f.near(a, 46, 1e-6) || f.near(a, 134, 1e-6);
      });
    },
  });

  /* ==================================================================== *
   * 2. 半角（正方形内 45°）
   * ==================================================================== */
  R('fig-half-angle', {
    alt: '正方形内的半角模型',
    caption: '正方形 ABCD 中 ∠EAF = 45°，把 △ABE 绕 A 旋转 90° 可证 EF = BE + DF。拖动 E 验证。',
    size: [400, 380],
    build(f) {
      f.fixed('A', 0, 4);
      f.fixed('B', 0, 0);
      f.fixed('C', 4, 0);
      f.fixed('D', 4, 4);
      f.free('E', 1.3, 0, { t: 'seg', a: 'B', b: 'C', lo: 0.12, hi: 0.88 });
      /* F：把 AE 逆时针转 45° 后与 CD（x=4）的交点 */
      f.def('Fr', (g) => L.add(g.p('A'), rotV(L.sub(g.p('E'), g.p('A')), 45)));
      f.def('F', (g) => L.interLL(g.p('A'), g.p('Fr'), g.p('C'), g.p('D')));

      f.poly(['B', 'C', 'D', 'A']);
      f.seg('A', 'E').seg('A', 'F').seg('E', 'F', { color: 'var(--geo-aux)' });
      f.right('A', 'B', 'C');
      f.angle('B', 'A', 'E', { r: 30, label: 'α' });
      f.angle('E', 'A', 'F', { r: 42, label: '45°' });
      f.angle('F', 'A', 'D', { r: 54, label: 'β' });
      f.labAuto(['A', 'B', 'C', 'D', 'E', 'F']);

      f.check('∠EAF=45°', () => f.near(f.ang('E', 'A', 'F'), 45, 1e-6));
      f.check('α+β=45°', () => f.near(f.ang('B', 'A', 'E') + f.ang('F', 'A', 'D'), 45, 1e-6));
      f.check('EF=BE+DF', () => f.near(f.len('E', 'F'), f.len('B', 'E') + f.len('D', 'F'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 3. 倍长中线
   * ==================================================================== */
  R('fig-double-median', {
    alt: '倍长中线构造全等',
    caption: '延长 AM 到 D 使 AM = MD，则 ABDC 为平行四边形：AB ∥ CD 且 AB = CD。拖动 A 验证。',
    size: [420, 340],
    build(f) {
      f.fixed('B', 0, 0);
      f.fixed('C', 5.2, 0);
      f.free('A', 1.3, 3.5, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.5)] });
      f.def('M', D.mid('B', 'C'));
      f.def('D', D.double('M', 'A'));      /* M 为 AD 中点 */

      f.poly(['A', 'B', 'C']);
      f.seg('A', 'D', { color: 'var(--geo-aux)' });
      f.dash('B', 'D', { color: 'var(--geo-aux)' });
      f.dash('C', 'D', { color: 'var(--geo-aux)' });
      f.tick('B', 'M', 1).tick('M', 'C', 1);
      f.tick('A', 'M', 2).tick('M', 'D', 2);
      f.dot('M').dot('D');
      f.labAuto(['A', 'B', 'C', 'D', 'M']);

      f.check('AM=MD', () => f.near(f.len('A', 'M'), f.len('M', 'D'), 1e-9));
      f.check('BM=MC', () => f.near(f.len('B', 'M'), f.len('M', 'C'), 1e-9));
      f.check('AB=CD', () => f.near(f.len('A', 'B'), f.len('C', 'D'), 1e-9));
      f.check('AB∥CD', () => Math.abs(L.cross(
        unit(L.sub(f.p('B'), f.p('A'))), unit(L.sub(f.p('D'), f.p('C'))))) < 1e-9);
    },
  });

  /* ==================================================================== *
   * 4. 中位线
   * ==================================================================== */
  R('fig-midline', {
    alt: '三角形中位线',
    caption: 'M、N 为两边中点，则 MN ∥ BC 且 MN = BC/2。拖动 A 验证。',
    size: [400, 300],
    build(f) {
      f.fixed('B', 0, 0);
      f.fixed('C', 5, 0);
      f.free('A', 1.4, 3.0, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.5)] });
      f.def('M', D.mid('A', 'B'));
      f.def('N', D.mid('A', 'C'));
      f.poly(['A', 'B', 'C']);
      f.seg('M', 'N', { color: 'var(--geo-aux)' });
      f.tick('A', 'M', 1).tick('M', 'B', 1);
      f.tick('A', 'N', 2).tick('N', 'C', 2);
      f.labAuto(['A', 'B', 'C', 'M', 'N']);
      f.check('MN∥BC', () => Math.abs(L.cross(
        unit(L.sub(f.p('N'), f.p('M'))), unit(L.sub(f.p('C'), f.p('B'))))) < 1e-9);
      f.check('MN=BC/2', () => f.near(f.len('M', 'N'), f.len('B', 'C') / 2, 1e-9));
    },
  });

  /* ==================================================================== *
   * 5. 角平分线与内心
   * ==================================================================== */
  R('fig-bisector', {
    alt: '角平分线定理与内切圆',
    caption: 'AD 平分 ∠A，则 BD/DC = AB/AC；三条角平分线交于内心 I。拖动 C 验证。',
    size: [400, 320],
    build(f) {
      f.fixed('A', 0.6, 3.2);
      f.fixed('B', 0, 0);
      f.free('C', 4.8, 0, { t: 'h' });
      f.def('D', D.bisectorFoot('B', 'A', 'C'));
      f.def('I', (g) => {
        const B = g.p('B'), A = g.p('A'), C = g.p('C');
        const d1 = L.add(unit(L.sub(A, B)), unit(L.sub(C, B)));
        const d2 = L.add(unit(L.sub(B, A)), unit(L.sub(C, A)));
        return L.interLL(B, L.add(B, d1), A, L.add(A, d2));
      });
      f.def('T', D.foot('I', 'B', 'C'));
      f.poly(['A', 'B', 'C']);
      f.seg('A', 'D', { color: 'var(--geo-aux)' });
      f.dash('B', 'I', { color: 'var(--geo-aux)' });
      f.dash('C', 'I', { color: 'var(--geo-aux)' });
      f.circle('I', 'I-T', { color: 'var(--green)', dash: true });
      f.seg('I', 'T', { color: 'var(--green)', dash: true });
      f.right('B', 'T', 'I');
      f.dot('I');
      f.labAuto(['A', 'B', 'C', 'D', 'I']);
      f.check('BD/DC=AB/AC', () => f.near(
        f.len('B', 'D') * f.len('A', 'C'), f.len('D', 'C') * f.len('A', 'B'), 1e-6));
      f.check('I 到三边等距', () => f.near(
        L.distLine(f.p('I'), f.p('B'), f.p('C')),
        L.distLine(f.p('I'), f.p('A'), f.p('B')), 1e-6));
    },
  });

  /* ==================================================================== *
   * 6. 一线三等角
   * ==================================================================== */
  R('fig-three-equal', {
    alt: '一线三等角相似',
    caption: '∠DBP = ∠DPE = ∠ECP = α ⟹ △BDP ∽ △CPE。拖动 D 或 P 验证。',
    size: [460, 300],
    build(f) {
      f.free('B', 0, 0, { t: 'h' });
      f.free('C', 7.0, 0, { t: 'h' });
      f.free('P', 3.6, 0, { t: 'seg', a: 'B', b: 'C', lo: 0.15, hi: 0.85 });
      f.free('D', 1.15, 2.05, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.35)] });
      f.def('E', (g) => {
        const B = g.p('B'), P = g.p('P'), C = g.p('C'), Dp = g.p('D');
        const alpha = L.angle(B, Dp, P);      /* ∠DBP */
        const beta = L.angle(Dp, B, P);       /* ∠BDP */
        const rayC = rotV(unit(L.sub(P, C)), -alpha);   /* 在 C 处转出 α */
        const rayP = rotV(unit(L.sub(C, P)), beta);     /* 在 P 处转出 β */
        return L.interLL(C, L.add(C, rayC), P, L.add(P, rayP));
      });
      f.seg('B', 'C');
      f.seg('B', 'D').seg('D', 'P').seg('P', 'E').seg('E', 'C');
      f.angle('D', 'B', 'P', { r: 26, label: 'α' });
      f.angle('D', 'P', 'E', { r: 26, label: 'α' });
      f.angle('E', 'C', 'P', { r: 26, label: 'α' });
      f.labAuto(['B', 'P', 'C', 'D', 'E']);
      f.check('三角相等', () => {
        const a = f.ang('D', 'B', 'P');
        return f.near(a, f.ang('D', 'P', 'E'), 1e-6) && f.near(a, f.ang('E', 'C', 'P'), 1e-6);
      });
      f.check('△BDP∽△CPE', () => f.near(
        f.len('B', 'D') / f.len('C', 'P'), f.len('B', 'P') / f.len('C', 'E'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 7. 四点共圆
   * ==================================================================== */
  R('fig-cyclic', {
    alt: '圆内接四边形',
    caption: 'A、B、C、D 共圆 ⟹ 对角互补：∠ABC + ∠CDA = 180°。拖动 A 或 O 验证。',
    size: [360, 340],
    build(f) {
      f.free('O', 0, 0);
      f.free('A', 1.7, 0.4);
      f.def('B', onCircle('B', 'O', 'A', 2.2));
      f.def('C', onCircle('C', 'O', 'A', 4.0));
      f.def('D', onCircle('D', 'O', 'A', 5.6));
      f.circle('O', 'O-A');
      f.poly(['A', 'B', 'C', 'D']);
      f.angle('A', 'B', 'C', { r: 22 });
      f.angle('C', 'D', 'A', { r: 22 });
      f.dot('O');
      f.labAuto(['A', 'B', 'C', 'D']);
      f.check('四点共圆', () => ['A', 'B', 'C', 'D'].every((n) =>
        f.near(L.dist(f.p('O'), f.p(n)), L.dist(f.p('O'), f.p('A')), 1e-9)));
      f.check('∠ABC+∠CDA=180°', () => f.near(f.ang('A', 'B', 'C') + f.ang('C', 'D', 'A'), 180, 1e-6));
    },
  });

  /* ==================================================================== *
   * 8. 圆幂（切割线）
   * ==================================================================== */
  R('fig-power', {
    alt: '切割线定理（圆幂）',
    caption: 'P 在圆外：PA · PB = PT² = PO² − r²。拖动 P 或 A 验证。',
    size: [420, 320],
    build(f) {
      f.free('O', 0, 0);
      f.free('A', -1.5, 0.4);
      f.free('P', 3.3, -0.2, { t: 'fn', fn: (g, m) => {
        const O = g.p('O'), r = L.dist(O, g.p('A'));
        const d = L.sub(m, O), dl = L.len(d) || 1;
        return L.add(O, L.mul([d[0] / dl, d[1] / dl], Math.max(dl, r * 1.35)));
      } });
      /* B：弦 AB 上另一点，用「垂足反射」精确求出 */
      f.def('H', D.foot('O', 'P', 'A'));
      f.def('B', (g) => [2 * g.p('H')[0] - g.p('A')[0], 2 * g.p('H')[1] - g.p('A')[1]]);
      /* T：切点 */
      f.def('T', (g) => {
        const O = g.p('O'), P = g.p('P'), r = L.dist(O, g.p('A'));
        const u = unit(L.sub(P, O)), d = L.dist(O, P);
        const s = r * Math.sqrt(Math.max(d * d - r * r, 0)) / d;
        return L.add(O, L.add(L.mul(u, r * r / d), L.mul([-u[1], u[0]], s)));
      });
      f.circle('O', 'O-A');
      f.seg('P', 'B');
      f.seg('P', 'T', { color: 'var(--geo-aux)' });
      f.seg('O', 'T', { dash: true });
      f.right('O', 'T', 'P');
      f.dot('A').dot('B').dot('T');
      f.labAuto(['A', 'B', 'P', 'T']);
      f.check('B 在圆上', () => f.near(L.dist(f.p('O'), f.p('B')), L.dist(f.p('O'), f.p('A')), 1e-6));
      f.check('OT⊥PT', () => f.near(f.ang('O', 'T', 'P'), 90, 1e-6));
      f.check('PA·PB=PT²', () => f.near(f.len('P', 'A') * f.len('P', 'B'), f.len('P', 'T') ** 2, 1e-6));
      f.check('PT²=PO²−r²', () => f.near(f.len('P', 'T') ** 2,
        f.len('P', 'O') ** 2 - f.len('O', 'A') ** 2, 1e-6));
    },
  });

  /* ==================================================================== *
   * 9. 托勒密
   * ==================================================================== */
  R('fig-ptolemy', {
    alt: '托勒密定理',
    caption: '圆内接四边形：AC · BD = AB · CD + BC · DA。拖动 A 或 O 验证。',
    size: [360, 340],
    build(f) {
      f.free('O', 0, 0);
      f.free('A', 1.7, 0.4);
      f.def('B', onCircle('B', 'O', 'A', 2.2));
      f.def('C', onCircle('C', 'O', 'A', 4.0));
      f.def('D', onCircle('D', 'O', 'A', 5.6));
      f.circle('O', 'O-A');
      f.poly(['A', 'B', 'C', 'D']);
      f.seg('A', 'C', { color: 'var(--geo-aux)' });
      f.seg('B', 'D', { color: 'var(--geo-aux)' });
      f.labAuto(['A', 'B', 'C', 'D']);
      f.check('AC·BD=AB·CD+BC·DA', () => f.near(
        f.len('A', 'C') * f.len('B', 'D'),
        f.len('A', 'B') * f.len('C', 'D') + f.len('B', 'C') * f.len('D', 'A'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 10. 费马点
   * ==================================================================== */
  R('fig-fermat', {
    alt: '费马点与旋转 60°',
    caption: '向外作正三角形 BCE，AE 与其外接圆交于 F，则 ∠AFB=∠BFC=120° 且 AF+BF+CF=AE。',
    size: [460, 340],
    build(f) {
      f.fixed('B', 0, 0);
      f.fixed('C', 4.4, 0);
      f.free('A', 0.4, 2.6, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.6)] });
      f.def('E', D.rot('B', 'C', 60));        /* 正三角形 BCE，作在 BC 下侧（与 A 异侧） */
      f.def('Oc', D.circumcenter('B', 'C', 'E'));
      f.def('F', D.interLC('A', 'E', 'Oc', 'Oc-B', 'near'));
      f.poly(['A', 'B', 'C']);
      f.seg('B', 'E', { color: 'var(--geo-aux)' }).seg('C', 'E', { color: 'var(--geo-aux)' });
      f.circle('Oc', 'Oc-B', { dash: true, color: 'var(--green)' });
      f.seg('A', 'E', { dash: true, color: 'var(--geo-aux)' });
      f.seg('F', 'A', { dash: true, color: 'var(--green)' });
      f.seg('F', 'B', { dash: true, color: 'var(--green)' });
      f.seg('F', 'C', { dash: true, color: 'var(--green)' });
      f.dot('F');
      f.labAuto(['A', 'B', 'C', 'E', 'F']);
      f.check('F 在圆上', () => f.near(L.dist(f.p('Oc'), f.p('F')), L.dist(f.p('Oc'), f.p('B')), 1e-6));
      f.check('A、F、E 共线', () => f.collinear('A', 'F', 'E', 1e-6));
      f.check('∠AFB=120°', () => f.near(f.ang('A', 'F', 'B'), 120, 1e-5));
      f.check('∠BFC=120°', () => f.near(f.ang('B', 'F', 'C'), 120, 1e-5));
      f.check('AF+BF+CF=AE', () => f.near(
        f.len('A', 'F') + f.len('B', 'F') + f.len('C', 'F'), f.len('A', 'E'), 1e-5));
    },
  });

  /* ==================================================================== *
   * 11. 隐形圆（定角对定边）
   * ==================================================================== */
  R('fig-hidden-circle', {
    alt: '定角对定边产生隐形圆',
    caption: '∠APB 恒为定角（本题 60°）⟹ P 的轨迹是一段圆弧。拖动 P 绕圆一周，注意另一段弧上为 120°。',
    size: [400, 320],
    build(f) {
      f.fixed('A', -2.0, 0);
      f.fixed('B', 2.0, 0);
      f.def('O', (g) => {
        const A = g.p('A'), B = g.p('B');
        const R = L.dist(A, B) / (2 * Math.sin(Math.PI / 3));
        const h = Math.sqrt(Math.max(R * R - (L.dist(A, B) / 2) ** 2, 0));
        const u = unit(L.sub(B, A));
        return [L.mid(A, B)[0] - u[1] * h, L.mid(A, B)[1] + u[0] * h];
      });
      f.free('P', 0, 2.2, { t: 'circle', o: 'O', r: 'O-A' });
      f.circle('O', 'O-A', { dash: true, color: 'var(--green)' });
      f.seg('A', 'B');
      f.seg('P', 'A').seg('P', 'B');
      f.angle('A', 'P', 'B', { r: 24, label: 'α' });
      f.dot('O');
      f.labAuto(['A', 'B', 'P']);
      f.check('P 在隐形圆上', () => f.near(L.dist(f.p('O'), f.p('P')), L.dist(f.p('O'), f.p('A')), 1e-6));
      f.check('∠APB ∈ {60°,120°}（定角）', () => {
        const a = f.ang('A', 'P', 'B');
        return f.near(a, 60, 1e-5) || f.near(a, 120, 1e-5);
      });
    },
  });

  /* ==================================================================== *
   * 12. 阿氏圆
   * ==================================================================== */
  R('fig-apollonius', {
    alt: '阿波罗尼斯圆',
    caption: 'PA/PB = 2 的点 P 的轨迹是以 I、X 为直径端点的圆（I 内分、X 外分 AB 成 2:1）。拖动 P 验证。',
    size: [420, 320],
    build(f) {
      const k = 2;
      f.free('A', -2.6, 0, { t: 'h' });
      f.free('B', 1.4, 0, { t: 'h' });
      f.def('I', (g) => L.lerp(g.p('A'), g.p('B'), k / (1 + k)));
      f.def('X', (g) => L.lerp(g.p('A'), g.p('B'), k / (k - 1)));
      f.def('O', D.mid('I', 'X'));
      f.free('P', 0.5, 1.6, { t: 'circle', o: 'O', r: 'O-I' });
      f.circle('O', 'O-I', { dash: true, color: 'var(--green)' });
      f.seg('A', 'X');
      f.seg('P', 'A', { color: 'var(--geo-aux)' }).seg('P', 'B', { color: 'var(--geo-aux)' });
      f.dot('I').dot('X').dot('P');
      f.labAuto(['A', 'B', 'I', 'X', 'P']);
      f.check('P 在阿氏圆上', () => f.near(L.dist(f.p('O'), f.p('P')), L.dist(f.p('O'), f.p('I')), 1e-6));
      f.check('PA=2·PB', () => f.near(f.len('P', 'A'), 2 * f.len('P', 'B'), 1e-6));
      f.check('IA=2·IB', () => f.near(f.len('I', 'A'), 2 * f.len('I', 'B'), 1e-9));
      f.check('XA=2·XB', () => f.near(f.len('X', 'A'), 2 * f.len('X', 'B'), 1e-9));
    },
  });

  /* ==================================================================== *
   * 13. 鸡爪定理
   * ==================================================================== */
  R('fig-chicken-claw', {
    alt: '鸡爪定理（内心与弧中点）',
    caption: 'AI 延长交外接圆于 M（弧 BC 中点），则 MB = MC = MI。拖动 A 验证。',
    size: [380, 340],
    build(f) {
      f.fixed('B', 0, 0);
      f.fixed('C', 4.6, 0);
      f.free('A', 0.2, 3.1, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.6)] });
      f.def('I', (g) => {
        const B = g.p('B'), A = g.p('A'), C = g.p('C');
        const d1 = L.add(unit(L.sub(A, B)), unit(L.sub(C, B)));
        const d2 = L.add(unit(L.sub(B, A)), unit(L.sub(C, A)));
        return L.interLL(B, L.add(B, d1), A, L.add(A, d2));
      });
      f.def('Oc', D.circumcenter('A', 'B', 'C'));
      f.def('M', D.interLC('A', 'I', 'Oc', 'Oc-B', 'far'));
      f.circle('Oc', 'Oc-B');
      f.poly(['A', 'B', 'C']);
      f.seg('A', 'M', { color: 'var(--geo-aux)' });
      f.seg('M', 'B', { color: 'var(--green)' }).seg('M', 'C', { color: 'var(--green)' });
      f.seg('M', 'I', { color: 'var(--accent)' });
      f.dot('I').dot('M');
      f.labAuto(['A', 'B', 'C', 'I', 'M']);
      f.check('M 在外接圆上', () => f.near(L.dist(f.p('Oc'), f.p('M')), L.dist(f.p('Oc'), f.p('B')), 1e-6));
      f.check('A、I、M 共线', () => f.collinear('A', 'I', 'M', 1e-6));
      f.check('MB=MC=MI', () => f.near(f.len('M', 'B'), f.len('M', 'C'), 1e-6) &&
        f.near(f.len('M', 'B'), f.len('M', 'I'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 14. 欧拉线
   * ==================================================================== */
  R('fig-euler-line', {
    alt: '欧拉线：外心、重心、垂心',
    caption: 'O（外心）、G（重心）、H（垂心）共线，且 GH = 2·OG。拖动 A 验证。',
    size: [420, 340],
    build(f) {
      f.fixed('B', 0, 0);
      f.fixed('C', 5.4, 0);
      f.free('A', 2.3, 3.2, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.6)] });
      f.def('G', D.centroid('A', 'B', 'C'));
      f.def('O', D.circumcenter('A', 'B', 'C'));
      f.def('H', D.orthocenter('A', 'B', 'C'));
      f.def('Hf', D.foot('A', 'B', 'C'));
      f.poly(['A', 'B', 'C']);
      f.circle('O', 'O-B', { dash: true, color: 'var(--green)' });
      f.seg('A', 'Hf', { dash: true, color: 'var(--geo-aux)' });
      f.seg('B', 'H', { dash: true, color: 'var(--geo-aux)' });
      f.seg('O', 'H', { color: 'var(--accent)' });
      f.right('A', 'Hf', 'C');
      f.dot('G').dot('O').dot('H');
      f.labAuto(['A', 'B', 'C', 'G', 'O', 'H']);
      f.check('O、G、H 共线', () => f.collinear('O', 'G', 'H', 1e-6));
      f.check('GH=2·OG', () => f.near(f.len('G', 'H'), 2 * f.len('O', 'G'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 15. 燕尾（面积比）
   * ==================================================================== */
  R('fig-area-ratio', {
    alt: '燕尾定理与面积比',
    caption: 'P 为三角形内一点：S(ABP)/S(ACP) = BD/DC；S(BCP)/S(ABP) = CE/EA。拖动 P 验证。',
    size: [400, 320],
    build(f) {
      f.fixed('A', 1.9, 3.0);
      f.fixed('B', 0, 0);
      f.fixed('C', 5.0, 0);
      f.free('P', 2.2, 1.05, { t: 'fn', fn: (g, m) => {
        /* 限制在三角形内部 */
        const A = g.p('A'), B = g.p('B'), C = g.p('C');
        const s1 = L.cross(L.sub(C, B), L.sub(m, B));
        const s2 = L.cross(L.sub(A, C), L.sub(m, C));
        const s3 = L.cross(L.sub(B, A), L.sub(m, A));
        return (s1 > 0.08 && s2 > 0.08 && s3 > 0.08) ? m : g.p('P');
      } });
      f.def('D', D.inter('A', 'P', 'B', 'C'));
      f.def('E', D.inter('B', 'P', 'C', 'A'));
      f.def('Fp', D.inter('C', 'P', 'A', 'B'));
      f.poly(['A', 'B', 'C']);
      f.seg('A', 'D', { color: 'var(--geo-aux)' });
      f.seg('B', 'E', { dash: true, color: 'var(--geo-aux)' });
      f.seg('C', 'Fp', { dash: true, color: 'var(--geo-aux)' });
      f.dot('P');
      f.labAuto(['A', 'B', 'C', 'D', 'E', 'P']);
      f.check('S(ABP)/S(ACP)=BD/DC', () => f.near(
        f.area('A', 'B', 'P') * f.len('D', 'C'), f.area('A', 'C', 'P') * f.len('B', 'D'), 1e-6));
      f.check('S(BCP)/S(ABP)=CE/EA', () => f.near(
        f.area('B', 'C', 'P') * f.len('E', 'A'), f.area('A', 'B', 'P') * f.len('C', 'E'), 1e-6));
      f.check('三分面积和=总面积', () => f.near(
        f.area('A', 'B', 'P') + f.area('B', 'C', 'P') + f.area('A', 'C', 'P'),
        f.area('A', 'B', 'C'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 16. 弦切角
   * ==================================================================== */
  R('fig-tangent-chord', {
    alt: '弦切角定理',
    caption: 'AT 为切线，则 ∠TAB = ∠ACB（弦切角等于所夹弧所对圆周角）。拖动 A 验证。',
    size: [380, 340],
    build(f) {
      f.free('O', 0, 0);
      f.free('A', -1.5, 0);
      f.def('B', onCircle('B', 'O', 'A', -0.5));
      f.def('C', onCircle('C', 'O', 'A', 2.0));
      /* T1：过 A 的切线（垂直于 OA）。取与 C 分居弦 AB 两侧的那一支，
         这样 ∠T1AB 才等于所夹弧所对的圆周角 ∠ACB（另一支给出补角）。 */
      f.def('T1', (g) => {
        const A = g.p('A'), O = g.p('O'), B = g.p('B'), C = g.p('C');
        const t = unit(L.perp(L.sub(A, O)));
        const d = L.sub(B, A);
        const side = (p) => d[0] * (p[1] - A[1]) - d[1] * (p[0] - A[0]);
        /* side 关于偏移是线性的：side(A+t)=splus，side(A+t·σ)=σ·splus。
           要让切线射线与 C 位于弦 AB 两侧，需 σ·splus·side(C) < 0。 */
        const splus = side(L.add(A, t));
        const s = splus * side(C) > 0 ? -1 : 1;
        return L.add(A, L.mul(t, 1.1 * s));
      });
      f.circle('O', 'O-A');
      f.seg('A', 'T1');
      f.seg('A', 'B', { color: 'var(--geo-aux)' });
      f.seg('C', 'B', { color: 'var(--green)' }).seg('C', 'A', { color: 'var(--green)' });
      f.angle('T1', 'A', 'B', { r: 26 });
      f.angle('A', 'C', 'B', { r: 26 });
      f.labAuto(['A', 'B', 'C']);
      f.check('OA⊥切线', () => f.near(f.ang('O', 'A', 'T1'), 90, 1e-6));
      f.check('弦切角=圆周角', () => f.near(f.ang('T1', 'A', 'B'), f.ang('A', 'C', 'B'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 17. 旋转相似（手拉手推广）
   * ==================================================================== */
  R('fig-spiral', {
    alt: '旋转相似',
    caption: '把 B、D 绕 A 同角同比例旋转到 C、E：△ABD ∽ △ACE，顶角不等时也有 BD/CE = AB/AC。',
    size: [420, 330],
    build(f) {
      f.free('A', 0, 0);
      f.free('B', 3.0, 0);
      f.free('D', 1.2, -1.0);
      f.def('C', D.rotScale('B', 'A', 40, 0.62));
      f.def('E', D.rotScale('D', 'A', 40, 0.62));
      f.seg('A', 'B').seg('A', 'C').seg('A', 'D').seg('A', 'E');
      f.seg('B', 'D', { color: 'var(--geo-aux)' }).seg('C', 'E', { color: 'var(--geo-aux)' });
      f.seg('B', 'C', { dash: true }).seg('D', 'E', { dash: true });
      f.labAuto(['A', 'B', 'C', 'D', 'E']);
      f.check('AB/AC=AD/AE', () => f.near(
        f.len('A', 'B') / f.len('A', 'C'), f.len('A', 'D') / f.len('A', 'E'), 1e-9));
      f.check('∠BAC=∠DAE', () => f.near(f.ang('B', 'A', 'C'), f.ang('D', 'A', 'E'), 1e-9));
      f.check('△ABD∽△ACE', () => f.near(
        f.len('B', 'D') / f.len('C', 'E'), f.len('A', 'B') / f.len('A', 'C'), 1e-6));
    },
  });

  /* ==================================================================== *
   * 18. 完全四边形（调和点列）
   * ==================================================================== */
  R('fig-harmonic', {
    alt: '完全四边形的调和点列',
    caption: '四点 A、B、C、D 定出对角点 P、Q、R；QR 交 AB 于 S，则 (A,B;P,S) = −1。拖动 C、D 验证。',
    size: [440, 320],
    build(f) {
      f.fixed('A', 0, 0);
      f.fixed('B', 4.6, 0);
      f.free('C', 1.5, 2.4, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.4)] });
      f.free('D', 3.4, 2.9, { t: 'fn', fn: (g, m) => [m[0], Math.max(m[1], 0.4)] });
      f.def('P', D.inter('A', 'B', 'C', 'D'));
      f.def('Q', D.inter('A', 'D', 'B', 'C'));
      f.def('R', D.inter('A', 'C', 'B', 'D'));
      f.def('S', D.inter('Q', 'R', 'A', 'B'));
      f.seg('A', 'B').seg('C', 'D').seg('A', 'D').seg('B', 'C').seg('A', 'C').seg('B', 'D');
      f.seg('Q', 'R', { color: 'var(--geo-aux)', dash: true });
      f.dot('P').dot('Q').dot('R').dot('S');
      f.labAuto(['A', 'B', 'C', 'D', 'P', 'Q', 'R', 'S']);
      f.check('P、Q、R 一般位置', () => Math.abs(
        L.cross(L.sub(f.p('Q'), f.p('P')), L.sub(f.p('R'), f.p('P')))) > 1e-3);
      f.check('(A,B;P,S)=−1（调和）', () => {
        const A = f.p('A'), u = unit(L.sub(f.p('B'), A)), L0 = L.dist(A, f.p('B'));
        const t = (n) => L.dot(L.sub(f.p(n), A), u) / L0;
        const cr = (t('P') / (t('P') - 1)) / (t('S') / (t('S') - 1));
        return f.near(cr, -1, 1e-6);
      });
    },
  });

  /* ==================================================================== *
   * 19. 反演
   * ==================================================================== */
  R('fig-inversion', {
    alt: '反演：不过中心的直线映成过中心的圆',
    caption: '以 O 为中心、OA 为半径反演：直线 ℓ 映成过 O 的圆；Q↔Q′ 满足 OQ·OQ′ = OA²。拖动 A 或 O 验证。',
    size: [420, 320],
    build(f) {
      f.free('O', 0, 0);
      f.free('A', 1.0, 0);
      f.def('L1', (g) => L.add(g.p('O'), [2.6, -1.6]));
      f.def('L2', (g) => L.add(g.p('O'), [2.6, 1.6]));
      f.def('Q', (g) => L.lerp(g.p('L1'), g.p('L2'), 0.32));
      /* 直线 ℓ: x = O.x + 2.6 的反演像是圆心 Img、过 O 的圆 */
      f.def('Img', (g) => {
        const O = g.p('O'), r = L.dist(O, g.p('A'));
        return L.add(O, [r * r / (2 * 2.6), 0]);
      });
      f.def('Qp', (g) => {
        const O = g.p('O'), r2 = L.dist(O, g.p('A')) ** 2;
        const v = L.sub(g.p('Q'), O);
        return L.add(O, L.mul(v, r2 / (L.dot(v, v) || 1)));
      });
      f.circle('O', 'O-A', { dash: true });
      f.circle('Img', 'Img-O', { color: 'var(--green)', dash: true });
      f.seg('L1', 'L2', { color: 'var(--geo-aux)' });
      f.seg('O', 'Q', { dash: true });
      f.seg('O', 'Qp', { color: 'var(--green)', dash: true });
      f.dot('Q').dot('Qp');
      f.labAuto(['O', 'A', 'Q', 'Qp']);
      f.check('O、Q、Q′ 共线', () => f.collinear('O', 'Q', 'Qp', 1e-6));
      f.check('OQ·OQ′=OA²', () => f.near(
        f.len('O', 'Q') * f.len('O', 'Qp'), f.len('O', 'A') ** 2, 1e-6));
      f.check('Q′ 在像圆上', () => f.near(
        L.dist(f.p('Img'), f.p('Qp')), L.dist(f.p('Img'), f.p('O')), 1e-6));
    },
  });

  /* ==================================================================== *
   * 20. 梅涅劳斯
   * ==================================================================== */
  R('fig-menelaus', {
    alt: '梅涅劳斯定理',
    caption: '直线截 △ABC 三边（或延长线）于 D、E、F，则 (BD/DC)·(CE/EA)·(AF/FB) = 1。拖动 D 验证。',
    size: [440, 320],
    build(f) {
      f.fixed('A', 1.6, 2.8);
      f.fixed('B', 0, 0);
      f.fixed('C', 4.6, 0);
      f.free('D', 2.6, 0, { t: 'seg', a: 'B', b: 'C', lo: 0.12, hi: 0.88 });
      f.def('E', (g) => L.lerp(g.p('C'), g.p('A'), 0.42));
      f.def('F', (g) => L.interLL(g.p('D'), g.p('E'), g.p('A'), g.p('B')));
      f.poly(['A', 'B', 'C']);
      f.seg('D', 'F', { color: 'var(--geo-aux)' });
      f.dot('D').dot('E').dot('F');
      f.labAuto(['A', 'B', 'C', 'D', 'E', 'F']);
      f.check('D、E、F 共线', () => f.collinear('D', 'E', 'F', 1e-6));
      f.check('梅氏积=1', () => f.near(
        (f.len('B', 'D') / f.len('D', 'C')) *
        (f.len('C', 'E') / f.len('E', 'A')) *
        (f.len('A', 'F') / f.len('F', 'B')), 1, 1e-6));
    },
  });

  /* ==================================================================== *
   * 21. 位似
   * ==================================================================== */
  R('fig-homothety', {
    alt: '位似变换',
    caption: '以 O 为中心把 △ABC 缩放 k 倍得 △A′B′C′：对应边平行，长度比恒为 k。拖动 A 或 O 验证。',
    size: [440, 320],
    build(f) {
      f.free('O', 0, 0);
      f.fixed('A', -1.4, 1.2);
      f.fixed('B', -0.2, -0.6);
      f.fixed('C', 0.6, 1.7);
      const k = 1.8;
      f.def('Ap', (g) => L.add(g.p('O'), L.mul(L.sub(g.p('A'), g.p('O')), k)));
      f.def('Bp', (g) => L.add(g.p('O'), L.mul(L.sub(g.p('B'), g.p('O')), k)));
      f.def('Cp', (g) => L.add(g.p('O'), L.mul(L.sub(g.p('C'), g.p('O')), k)));
      f.poly(['A', 'B', 'C']);
      f.poly(['Ap', 'Bp', 'Cp'], { color: 'var(--green)' });
      f.dash('O', 'Ap').dash('O', 'Bp').dash('O', 'Cp');
      f.labAuto(['A', 'B', 'C', 'Ap', 'Bp', 'Cp', 'O']);
      f.check('OA′=k·OA', () => f.near(f.len('O', 'Ap'), k * f.len('O', 'A'), 1e-9));
      f.check('A′B′∥AB', () => Math.abs(L.cross(
        unit(L.sub(f.p('Bp'), f.p('Ap'))), unit(L.sub(f.p('B'), f.p('A'))))) < 1e-9);
      f.check('A′B′=k·AB', () => f.near(f.len('Ap', 'Bp'), k * f.len('A', 'B'), 1e-9));
    },
  });

  /* ==================================================================== *
   * 22. 直角三角形斜边中线 / 圆
   * ==================================================================== */
  R('fig-right-mid', {
    alt: '直角三角形斜边中线',
    caption: '直角三角形斜边中点到三顶点等距：MA = MB = MC，M 即外心。拖动 C 验证。',
    size: [400, 300],
    build(f) {
      f.fixed('A', 0, 0);
      f.fixed('B', 4.6, 0);
      /* C 在以 AB 为直径的圆上（拖动保持直角） */
      f.def('M', D.mid('A', 'B'));
      f.free('C', 1.4, 1.9, { t: 'circle', o: 'M', r: 'M-A' });
      f.circle('M', 'M-A', { dash: true, color: 'var(--green)' });
      f.poly(['A', 'B', 'C']);
      f.seg('M', 'C', { color: 'var(--geo-aux)' });
      f.right('A', 'C', 'B');
      f.dot('M');
      f.labAuto(['A', 'B', 'C', 'M']);
      f.check('∠ACB=90°', () => f.near(f.ang('A', 'C', 'B'), 90, 1e-6));
      f.check('MA=MB=MC', () => f.near(f.len('M', 'A'), f.len('M', 'C'), 1e-6) &&
        f.near(f.len('M', 'A'), f.len('M', 'B'), 1e-9));
    },
  });
})(window.Geo);
