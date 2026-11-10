window.PROBLEMS = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: `pr-01`,
    layer: `problem`,
    title: `共顶点等腰求线段相等`,
    short: `两个等腰三角形共顶点，证 BD = CE`,
    tier: [1],
    tags: [`rotate`, `equal-len`, `prove-equal`],
    source: `经典手拉手模型 · 改编`,
    figure: `fig-hand-in-hand`,
    patterns: [`p-hand`],
    methods: [`m-congruence`, `m-homothety`],
    statement: `如图，$\\triangle ABC$ 与 $\\triangle ADE$ 均为等腰三角形，$AB=AC$、$AD=AE$，且 $\\angle BAC = \\angle DAE$。点 $B,D$ 在 $\\angle CAE$ 的同侧。求证：$BD = CE$，并求直线 $BD$ 与 $CE$ 的夹角。`,
    answer: `## 解
设 $\\angle BAC = \\angle DAE = \\theta$。因为 $B,D$ 位置对应，有
$$\\angle BAD = \\angle BAC + \\angle CAD = \\theta + \\angle CAD = \\angle DAE + \\angle CAD = \\angle CAE$$
在 $\\triangle ABD$ 与 $\\triangle ACE$ 中：
- $AB = AC$（已知），
- $AD = AE$（已知），
- $\\angle BAD = \\angle CAE$（上式），

故 $\\triangle ABD \\cong \\triangle ACE$（SAS），从而
$$BD = CE$$
再看夹角：把 $\\triangle ABD$ 绕 $A$ 旋转角 $\\theta$ 即得 $\\triangle ACE$，因此 $BD$ 在该旋转下的像就是 $CE$，两条对应线段的夹角恰等于旋转角 $\\theta = \\angle BAC$。

**结论**：$BD = CE$，且 $BD$ 与 $CE$ 的夹角为 $\\angle BAC$。`,
    hints: [
      { level: `观察`, title: `数一数等长与共顶点`, text: `图里有两组等长线段：$AB=AC$、$AD=AE$，它们共用同一个端点 $A$。要证相等的两条线段 $BD$、$CE$ 分别跨两个三角形。` },
      { level: `联想`, title: `这是手拉手`, text: `两组等腰共顶点、顶角相等，是 [[p-hand|手拉手模型]] 的标准长相。它说的是「绕公共顶点旋转即可把一条线段搬到另一条」。` },
      { level: `构造`, title: `连 BD、CE 并导角`, text: `连 $BD$、$CE$。关键一步是证 $\\angle BAD = \\angle CAE$：两角都等于 $\\theta + \\angle CAD$。然后直接看 $\\triangle ABD$ 与 $\\triangle ACE$。` },
      { level: `主链`, title: `SAS 全等 + 旋转保角`, text: `$AB=AC$、$AD=AE$、$\\angle BAD = \\angle CAE$ ⟹ $\\triangle ABD \\cong \\triangle ACE$ ⟹ $BD=CE$。夹角来自「$BD$ 旋转 $\\theta$ 的像是 $CE$」。` },
      { level: `完整解`, title: `结论`, text: `$BD = CE$；$BD$ 与 $CE$ 的夹角等于旋转角 $\\angle BAC$。若记 $P = BD \\cap CE$，还可进一步得到 $\\angle BPC = \\angle BAC$。` },
    ],
    decision: `先试旋转而不是直接设坐标，是因为题干里能一眼看到两组等长线段共用一个端点 $A$——这是旋转中心的强信号，且顶角相等给出了明确的旋转角。把 $\\triangle ABD$ 绕 $A$ 转过去，$BD$ 就变成 $CE$，相等与夹角两问一次解决。放弃了坐标法：设 $A$ 为原点后 $B,C,D,E$ 各带一个方向角，四个点的坐标含四组 $\\sin\\theta$、$\\cos\\theta$，展开 $BD^2-CE^2$ 虽能化简为零，但计算量大且完全看不出「夹角等于旋转角」这个结构。也放弃了直接追角证 $\\triangle BPC$ 等腰：那需要先把交点 $P$ 的共圆关系导出来，比全等多两步。`,
    discard: [
      `建系硬算 $BD^2 - CE^2$：四个点各带方向角，展开后根式与三角函数混杂，化简量过大且丢失几何结构。`,
      `先证 $B,P,C,E$ 共圆再导角：需要先引入交点 $P$ 并多一轮共圆判定，链条比一次 SAS 全等长。`,
    ],
    variants: [
      `同档换条件：把 $\\angle BAC = \\angle DAE$ 改为 $\\angle BAC + \\angle DAE = 180^\\circ$，结论仍成立，但对应角要改用补角导。`,
      `升一档：令 $AB/AC = AD/AE = k \\ne 1$、顶角仍相等，此时只能得旋转相似 $BD/CE = 1/k$，并求 $BD$ 与 $CE$ 的定角——见 [[m-homothety]]。`,
    ],
    traps: [
      `必须确认 $B,D$ 在对应侧，否则 $\\angle BAD = \\angle CAE$ 会变成 $\\angle BAD + \\angle CAE = 180^\\circ$，全等不成立。`,
      `顶角不等时不能写全等，只能写旋转相似。`,
    ],
    body: `## 卡点
两组等长线段共顶点，但 $BD$ 与 $CE$ 分属不同三角形，直接比较毫无抓手。卡在「不知道该把哪个三角形搬到哪个位置」。

## 主线
识别 [[p-hand]] → 绕 $A$ 旋转 $\\angle BAC$ → SAS 全等 → 相等与夹角一并得出。对应思想是 [[i-transform]]：不动笔算，先让图形动起来。`,
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: `pr-02`,
    layer: `problem`,
    title: `正方形半角与线段和`,
    short: `正方形内 45 度角，证 EF = BE + DF`,
    tier: [1],
    tags: [`sum-seg`, `rotate`, `equal-len`],
    source: `经典半角模型 · 改编`,
    figure: `fig-half-angle`,
    patterns: [`p-half-angle`],
    methods: [`m-congruence`, `m-area`],
    statement: `正方形 $ABCD$ 中，$E$ 在边 $BC$ 上，$F$ 在边 $CD$ 上，且 $\\angle EAF = 45^\\circ$。求证：$EF = BE + DF$。`,
    answer: `## 解
把 $\\triangle ABE$ 绕 $A$ 逆时针旋转 $90^\\circ$。因 $ABCD$ 是正方形，$B$ 转到 $D$；设 $E$ 转到 $G$，则 $G$ 在 $CD$ 的延长线上（因为 $\\angle ABE = 90^\\circ$ 转到 $\\angle ADG = 90^\\circ$）。

旋转给出
$$AG = AE, \\quad DG = BE, \\quad \\angle DAG = \\angle BAE$$
于是
$$\\angle GAF = \\angle GAD + \\angle DAF = \\angle BAE + \\angle DAF = 90^\\circ - \\angle EAF = 45^\\circ = \\angle EAF$$
在 $\\triangle AEF$ 与 $\\triangle AGF$ 中，$AE=AG$、$AF$ 公共、$\\angle EAF = \\angle GAF = 45^\\circ$，故
$$\\triangle AEF \\cong \\triangle AGF \\quad (\\text{SAS})$$
从而 $EF = GF$。又 $G,D,F$ 共线且 $D$ 在 $G,F$ 之间，故
$$EF = GF = GD + DF = BE + DF$$

**结论**：$EF = BE + DF$。`,
    hints: [
      { level: `观察`, title: `看清角的分数`, text: `正方形顶角是 $90^\\circ$，而 $\\angle EAF = 45^\\circ$ 正好是它的一半；$E,F$ 分别落在相邻两边上。要证的式子把三条线段加在一起。` },
      { level: `联想`, title: `半角模型 + 截长补短`, text: `「证一段等于两段之和」的标准动作是截长补短。而能把 $BE$ 搬到与 $DF$ 共线位置的，是绕 $A$ 旋转 $90^\\circ$ 的 [[p-half-angle|半角模型]]。` },
      { level: `构造`, title: `旋转 90 度造 G`, text: `把 $\\triangle ABE$ 绕 $A$ 逆时针转 $90^\\circ$ 到 $\\triangle ADG$，使 $B \\to D$、$E \\to G$；$G$ 落在 $CD$ 延长线上。连 $FG$。` },
      { level: `主链`, title: `证两角相等再 SAS`, text: `$\\angle GAF = \\angle BAE + \\angle DAF = 90^\\circ - 45^\\circ = 45^\\circ = \\angle EAF$，配合 $AE=AG$、$AF$ 公共，得 $\\triangle AEF \\cong \\triangle AGF$。` },
      { level: `完整解`, title: `共线相加`, text: `$EF = GF = GD + DF = BE + DF$。关键是 $G,D,F$ 三点共线，三段才能直接相加。` },
    ],
    decision: `第一步选旋转而不是在 $EF$ 上截一段，是因为「半角」这个条件太特殊：$90^\\circ - 45^\\circ = 45^\\circ$，恰好让旋转后的 $\\angle GAF$ 与原来的 $\\angle EAF$ 相等，一次 SAS 就能把 $EF$ 换成 $GF$。而 $GF$ 天然落在 $CD$ 的延长线上，与 $BE$（转成 $DG$）、$DF$ 共线，和式自动成立。放弃了在 $EF$ 上截取 $EH=BE$ 再证 $HF=DF$ 的做法：这条路线需要先证 $\\triangle ABE \\cong \\triangle AHE$，但 $H$ 的位置没有先验依据，导角会绕回旋转，等于把同一个动作拆成两遍。也没用坐标法，因为设边长与两个参数后 $\\angle EAF=45^\\circ$ 会写成分式方程，化简远比旋转繁琐。`,
    discard: [
      `在 $EF$ 上截 $EH = BE$ 再证 $HF = DF$：点 $H$ 缺乏定位依据，导角最终仍要绕回旋转，等于重复劳动。`,
      `设正方形边长为 1、$BE=x$、$DF=y$ 用坐标硬算：$\\tan(\\angle EAF) = 1$ 会导出分式方程，化简量大且看不出结构。`,
    ],
    variants: [
      `同档换条件：把 $45^\\circ$ 换成 $\\alpha$ 并给 $\\angle BAE = \\beta$，求 $EF$ 与 $BE,DF$ 的一般关系（需三角法）。`,
      `升一档：在正三角形或正 $n$ 边形内给定角，用 [[m-trig]] 或复数统一处理；或与 [[p-ptolemy]] 结合求 $\\triangle CEF$ 周长最小值。`,
    ],
    traps: [
      `旋转方向必须使 $G$ 落在 $CD$ 的延长线上；转反了 $G,D,F$ 不共线，三段无法相加。`,
      `$\\angle GAF = 45^\\circ$ 的推导用到了 $\\angle BAE + \\angle EAF + \\angle FAD = 90^\\circ$，漏掉任一项都会算错。`,
    ],
    body: `## 卡点
要证「一段 = 两段和」，但三条线段分散在三处，且 $45^\\circ$ 是个「半角」，直接追角没有落点。

## 主线
识别 [[p-half-angle]] → 绕 $A$ 转 $90^\\circ$ 把 $BE$ 搬到 $DG$ → 半角保证 SAS 全等 → 共线相加。对应思想是 [[i-complete]]（补形）与 [[i-transform]]。`,
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: `pr-03`,
    layer: `problem`,
    title: `倍长中线证不等式`,
    short: `延长中线一倍，把中线范围化为三角形不等式`,
    tier: [1],
    tags: [`mid`, `midpoint-line`, `prove-equal`],
    source: `经典中线模型 · 改编`,
    figure: `fig-double-median`,
    patterns: [`p-double-median`],
    methods: [`m-congruence`, `m-similarity`],
    statement: `在 $\\triangle ABC$ 中，$M$ 为 $BC$ 的中点。求证：$AM < \\dfrac{AB+AC}{2}$，并说明何时取等。`,
    answer: `## 解
延长 $AM$ 到 $D$，使 $MD = AM$，连 $BD$、$CD$。

因为 $BM = MC$、$AM = MD$，且 $\\angle AMB = \\angle DMC$（对顶角），故
$$\\triangle AMB \\cong \\triangle DMC \\quad (\\text{SAS})$$
于是 $AB = CD$ 且 $\\angle ABM = \\angle DCM$，从而 $AB \\parallel CD$。四边形 $ABDC$ 的两条对角线 $AD$ 与 $BC$ 互相平分，故 $ABDC$ 为平行四边形，因此也有 $BD = AC$。

在 $\\triangle ABD$ 中，由三角形不等式
$$AD < AB + BD = AB + AC$$
而 $AD = 2AM$，故
$$AM < \\frac{AB+AC}{2}$$

**取等**：仅当 $A,B,D$ 共线时三角形不等式取等，此时 $\\triangle ABC$ 退化（$A$ 落在 $BC$ 所在直线上），对非退化三角形恒为严格不等。`,
    hints: [
      { level: `观察`, title: `中点 + 中线`, text: `题干给出 $M$ 是 $BC$ 中点，$AM$ 是中线，结论里出现 $\\frac{AB+AC}{2}$ —— 分子是两条边的和。` },
      { level: `联想`, title: `倍长中线`, text: `见到中点又要把「两条边相加」放进同一个三角形，标准动作是 [[p-double-median|倍长中线]]：它把 $AB$ 与 $AC$ 搬到同一个三角形的两条边上。` },
      { level: `构造`, title: `延长 AM 一倍`, text: `延长 $AM$ 到 $D$ 使 $MD = AM$，连 $BD$、$CD$。此时 $ABDC$ 是平行四边形。` },
      { level: `主链`, title: `三角形不等式`, text: `$\\triangle AMB \\cong \\triangle DMC$ ⟹ $BD = AC$、$AD = 2AM$。在 $\\triangle ABD$ 中 $AD < AB + BD$。` },
      { level: `完整解`, title: `结论`, text: `$2AM < AB + AC$，即 $AM < \\frac{AB+AC}{2}$。非退化三角形严格不等，取等只在退化时发生。` },
    ],
    decision: `先倍长中线，是因为「$M$ 是中点」这个条件自带 $1:1$，而结论里的 $\\frac12$ 正好提示要造一个长度为 $2AM$ 的线段。倍长后 $AD = 2AM$，且 $ABDC$ 为平行四边形把 $AC$ 搬到 $BD$，于是「两边之和大于第三边」立刻给出结论——三步全是规定动作。放弃了用中线长公式 $AM^2 = \\frac{2AB^2+2AC^2-BC^2}{4}$ 再配不等式：那需要先证明或引用阿波罗尼斯中线公式，再处理 $\\sqrt{\\cdot}$ 与 $BC$ 的放缩，链条更长且容易在代数上出错。也放弃了在 $AM$ 延长线上取点后用相似：相似比无法直接给出 $2AM$ 这个整数倍关系。`,
    discard: [
      `套中线长公式 $AM^2 = \\frac{2AB^2+2AC^2-BC^2}{4}$ 再放缩：需额外证明公式，且含根号与 $BC$ 的双向放缩，易错。`,
      `过 $M$ 作平行线用相似：相似比只给出比例，凑不出 $2AM$ 这个整倍数，最后仍要回到倍长。`,
    ],
    variants: [
      `同档换条件：已知 $AB=c$、$AC=b$，求 $AM$ 的取值范围（答案 $\\frac{|b-c|}{2} < AM < \\frac{b+c}{2}$）。`,
      `升一档：$M$ 改为 $BC$ 上满足 $BM:MC = m:n$ 的分点，用 [[m-menelaus]] 或向量求 $AM$ 的范围。`,
    ],
    traps: [
      `倍长的必须是过中点的那条线段 $AM$；随便延长 $AB$ 不产生平行四边形。`,
      `非退化三角形取严格不等号，写成 $\\le$ 是常见失分点。`,
    ],
    body: `## 卡点
要比较中线与两腰之和的一半，但 $AB$、$AC$、$AM$ 分散在不同三角形里，无法直接用三角形不等式。

## 主线
识别中点 → [[p-double-median]] 造平行四边形 → 把 $AC$ 搬到 $BD$ → 在 $\\triangle ABD$ 中用两边之和大于第三边。对应 [[i-complete]]。`,
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: `pr-04`,
    layer: `problem`,
    title: `一线三等角求比例`,
    short: `三个等角排在同一直线上，连出相似链`,
    tier: [1],
    tags: [`equal-angle`, `ratio`, `parallel`],
    source: `经典相似模型 · 改编`,
    figure: `fig-three-equal`,
    patterns: [`p-three-equal`],
    methods: [`m-similarity`, `m-coord`],
    statement: `点 $B,P,C$ 依次在同一直线上，$D,E$ 在直线同侧，且 $\\angle DBP = \\angle DPE = \\angle ECP = \\alpha$。求证：$\\triangle BDP \\sim \\triangle CPE$，并由此导出 $BD \\cdot CE = BP \\cdot CP$。`,
    answer: `## 解
记 $\\angle DBP = \\angle DPE = \\angle ECP = \\alpha$。

在 $\\triangle BDP$ 中，$\\angle BDP + \\angle DPB = 180^\\circ - \\alpha$。
又 $B,P,C$ 共线，故 $\\angle DPB + \\angle DPE + \\angle EPC = 180^\\circ$，即
$$\\angle DPB + \\angle EPC = 180^\\circ - \\alpha$$
两式相减得 $\\angle BDP = \\angle EPC$。

在 $\\triangle CPE$ 中，$\\angle CEP = 180^\\circ - \\alpha - \\angle EPC$，而 $\\angle DPB = 180^\\circ - \\alpha - \\angle EPC$，故
$$\\angle DPB = \\angle CEP$$
于是 $\\triangle BDP$ 与 $\\triangle CPE$ 有两组角对应相等：
$$\\angle DBP = \\angle ECP = \\alpha, \\quad \\angle DPB = \\angle CEP$$
故 $\\triangle BDP \\sim \\triangle CPE$。

由相似对应边成比例：
$$\\frac{BD}{CP} = \\frac{BP}{CE}$$
交叉相乘得
$$BD \\cdot CE = BP \\cdot CP$$

**结论**：两三角形相似，且乘积式成立。`,
    hints: [
      { level: `观察`, title: `数等角与共线`, text: `$B,P,C$ 三点共线，$D,E$ 在同侧；图上标了三个相等的角 $\\alpha$，分别在 $B$、$P$、$C$ 三处。` },
      { level: `联想`, title: `一线三等角`, text: `同一直线上三个等角是 [[p-three-equal|一线三等角]] 的标准长相，它保证左右两个三角形相似。` },
      { level: `构造`, title: `不必加辅助线，只需导角`, text: `这题的动作是「标角」而不是作线：把 $\\angle DPB$ 用 $180^\\circ - \\alpha - \\angle EPC$ 表示，再与 $\\triangle CPE$ 的内角和比对。` },
      { level: `主链`, title: `两角对应相等`, text: `$\\angle BDP = \\angle EPC$ 且 $\\angle DPB = \\angle CEP$ ⟹ $\\triangle BDP \\sim \\triangle CPE$ ⟹ $\\frac{BD}{CP} = \\frac{BP}{CE}$。` },
      { level: `完整解`, title: `交叉相乘`, text: `$BD \\cdot CE = BP \\cdot CP$。若再给 $BP,CP,BD$ 的具体值，可直接解出 $CE$。` },
    ],
    decision: `先判相似而不是直接设 $BP=x$、$CP=y$ 去算，是因为「三个等角 + 共线」这组条件的全部价值就在于导角：共线给出 $\\angle DPB + \\angle EPC = 180^\\circ - \\alpha$，与 $\\triangle BDP$ 的内角和相减立刻得到 $\\angle BDP = \\angle EPC$，相似几乎白送。一旦相似成立，乘积式只是交叉相乘。放弃了坐标法：需要设 $D$、$E$ 的方向角并解两个交点，最后仍要化简成同样的比例式，纯属绕远。也放弃了先连 $DE$ 造四边形：那会引入多余的交点与角，反而把三等角的结构遮住。`,
    discard: [
      `设 $BP=x, CP=y$ 后用坐标表示 $D,E$ 再算 $BD,CE$：要解两条射线的交点，化简后仍回到相似比。`,
      `连 $DE$ 试图用四点共圆：图中并无共圆条件，强行补线会引入无法确定的角。`,
    ],
    variants: [
      `同档换条件：取 $\\alpha = 90^\\circ$，即「一线三垂直」，结论同样是 $BD\\cdot CE = BP\\cdot CP$。`,
      `升一档：令 $P$ 在 $BC$ 上运动且三等角保持，求 $DE$ 的最小值或 $D,E$ 连线过定点的轨迹。`,
    ],
    traps: [
      `三个角必须同侧、按 $B \\to P \\to C$ 的顺序相等；错一个顶点，相似对应边就全反。`,
      `导角时用有向角更稳妥，直接看图形容易把 $\\angle DPB$ 与 $\\angle EPC$ 的和写错。`,
    ],
    body: `## 卡点
看起来只是一堆角，没有边、没有中点、没有圆，学生常常不知道从哪下手。

## 主线
识别 [[p-three-equal]] → 利用共线把中间角拆成 $180^\\circ-\\alpha$ → 两角对应相等 → 相似 → 交叉相乘。对应 [[m-similarity]]。

## 易误判
把三个等角当成「随便三个角相等」去凑全等：全等需要边，这里一条边都没给，唯一能走的路是导角判相似。对应思想是 [[i-reduce]]：先把「求比例」化归为「找一对相似三角形」。`,
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: `pr-05`,
    layer: `problem`,
    title: `中位线与中点联动`,
    short: `多个中点连成平行四边形并求面积比`,
    tier: [2],
    tags: [`mid`, `midpoint-line`, `parallel`],
    source: `联赛基础 · 改编`,
    figure: `fig-midline`,
    patterns: [`p-midline`, `p-double-median`],
    methods: [`m-similarity`, `m-area`],
    statement: `在 $\\triangle ABC$ 中，$M,N$ 分别为 $AB,AC$ 的中点，$P$ 为 $BC$ 上一点，$MP$ 与 $AN$ 交于 $Q$。求证：$MN \\parallel BC$ 且 $MN = \\dfrac12 BC$；并求 $\\dfrac{S_{\\triangle AMN}}{S_{\\triangle ABC}}$。`,
    answer: `## 解
**第一部分**。在 $\\triangle ABC$ 中，$M,N$ 为两边中点，故
$$\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac12, \\quad \\angle MAN = \\angle BAC$$
由 SAS 相似（两边成比例且夹角相等）得 $\\triangle AMN \\sim \\triangle ABC$，相似比 $k = \\frac12$。于是
$$MN \\parallel BC, \\qquad MN = \\frac12 BC$$

**第二部分**。相似三角形面积比等于相似比的平方：
$$\\frac{S_{\\triangle AMN}}{S_{\\triangle ABC}} = k^2 = \\frac14$$

也可直接用面积公式验证：$S_{AMN} = \\frac12 AM\\cdot AN\\sin A = \\frac12 \\cdot \\frac{AB}{2}\\cdot\\frac{AC}{2}\\sin A = \\frac14 S_{ABC}$。

**结论**：$MN \\parallel BC$、$MN = \\frac12 BC$、面积比为 $1:4$。点 $P,Q$ 的具体位置不影响这三个结论。

## 易误判
把三个等角当成「随便三个角相等」去凑全等：全等需要边，这里一条边都没给，唯一能走的路是导角判相似。对应思想是 [[i-reduce]]：先把「求比例」化归为「找一对相似三角形」。`,
    hints: [
      { level: `观察`, title: `两个中点被连起来`, text: `$M$ 是 $AB$ 中点、$N$ 是 $AC$ 中点，且 $MN$ 已连好；图上还有一条 $MP$ 与 $AN$ 的交点 $Q$。` },
      { level: `联想`, title: `中位线`, text: `两边中点连线就是 [[p-midline|中位线]]，自带「平行于第三边」与「等于第三边一半」。后面附带的 $P,Q$ 是干扰项。` },
      { level: `构造`, title: `不必加线，用相似或位似`, text: `以 $A$ 为中心、比 $\\frac12$ 作位似：$B \\to M$、$C \\to N$，直接得 $MN \\parallel BC$ 且 $MN/BC = 1/2$。` },
      { level: `主链`, title: `相似比平方`, text: `$\\triangle AMN \\sim \\triangle ABC$，$k=\\frac12$ ⟹ 长度比 $1:2$、面积比 $1:4$。` },
      { level: `完整解`, title: `结论`, text: `$MN \\parallel BC$，$MN = \\frac12 BC$，$\\frac{S_{AMN}}{S_{ABC}} = \\frac14$。用 $S = \\frac12 ab\\sin C$ 可独立复核。` },
    ],
    decision: `直接用位似 / 相似，是因为两个中点同属 $\\triangle ABC$ 的两边，天然给出一个以 $A$ 为中心、比 $\\frac12$ 的位似——一次就把「平行」与「一半」两个结论都拿到，面积比再平方即可。题干里刻意放了 $P$ 与 $Q$，但这两个点对所求的三个量没有任何约束，是典型的干扰信息；先花时间追 $Q$ 的比例只会浪费考场时间。放弃了逐段用中位线定理再证平行：那是同一件事的啰嗦版本。也没用坐标法，因为设 $A,B,C$ 三点坐标后求中点、算斜率、算面积比，虽然可行，但把一眼可见的结构变成三行代数。`,
    discard: [
      `先求 $Q$ 分 $AN$ 的比例再回头看 $MN$：$P,Q$ 与所求无关，属于被题干带偏的无效链条。`,
      `建系设 $A(0,0),B(2b,0),C(2c_1,2c_2)$ 算斜率与面积：可行但把结构题变成计算题，考场不划算。`,
    ],
    variants: [
      `同档换条件：改为四边形 $ABCD$ 四边中点依次为 $M,N,P,Q$，证 $MNPQ$ 为平行四边形（瓦里尼翁）。`,
      `升一档：把中点改为 $AM:MB = AN:NC = \\lambda$，用 [[m-area]] 求 $S_{AMN}/S_{ABC} = \\lambda^2$ 并讨论 $\\lambda$ 变化时 $MN$ 扫过的区域。`,
    ],
    traps: [
      `中位线必须连接两边中点；连中点与顶点得到的是中线，没有 $1:2$ 与平行。`,
      `面积比是相似比的**平方**，写成 $1:2$ 是常见错误。`,
    ],
    body: `## 卡点
题面多给了 $P,Q$ 两个点，容易把注意力带到交点比例上去；真正的结构只有「两个中点」。

## 主线
忽略干扰项 → 识别 [[p-midline]]（位似比 $\\frac12$）→ 长度比 $1:2$ → 面积比 $1:4$。对应 [[m-similarity]] 与 [[m-area]]。`,
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: `pr-06`,
    layer: `problem`,
    title: `角平分线定理与面积`,
    short: `用面积法导出 BD/DC = AB/AC 并求面积比`,
    tier: [2],
    tags: [`bisect`, `ratio`, `area`],
    source: `联赛基础 · 改编`,
    figure: `fig-bisector`,
    patterns: [`p-bisector`, `p-area-ratio`],
    methods: [`m-area`, `m-similarity`],
    statement: `在 $\\triangle ABC$ 中，$AD$ 平分 $\\angle BAC$ 交 $BC$ 于 $D$。设 $AB = c$、$AC = b$。求证：$\\dfrac{BD}{DC} = \\dfrac{c}{b}$，并求 $\\dfrac{S_{\\triangle ABD}}{S_{\\triangle ACD}}$。`,
    answer: `## 解
**用面积法一次给出两个结论。**

因为 $AD$ 是 $\\angle BAC$ 的平分线，点 $D$ 到 $AB$、$AC$ 的距离相等，记为 $h$。于是
$$S_{\\triangle ABD} = \\frac12 \\cdot AB \\cdot h = \\frac12 c h, \\qquad S_{\\triangle ACD} = \\frac12 \\cdot AC \\cdot h = \\frac12 b h$$
故
$$\\frac{S_{\\triangle ABD}}{S_{\\triangle ACD}} = \\frac{c}{b}$$

另一方面，$\\triangle ABD$ 与 $\\triangle ACD$ 有同一个顶点 $A$，底 $BD$、$DC$ 在同一直线 $BC$ 上，故高相同，面积比等于底之比：
$$\\frac{S_{\\triangle ABD}}{S_{\\triangle ACD}} = \\frac{BD}{DC}$$

联立两式得
$$\\frac{BD}{DC} = \\frac{c}{b} = \\frac{AB}{AC}$$

**结论**：$\\dfrac{BD}{DC} = \\dfrac{AB}{AC}$，且 $\\dfrac{S_{\\triangle ABD}}{S_{\\triangle ACD}} = \\dfrac{c}{b}$。

**补充**：由此还可得 $AI:ID = (b+c):a$（$I$ 为内心、$a = BC$），只需对 $\\triangle ABD$ 再用一次角平分线定理（$BI$ 平分 $\\angle B$）。`,
    hints: [
      { level: `观察`, title: `角平分线 + 一个分点`, text: `$AD$ 平分 $\\angle A$ 并把 $BC$ 分成 $BD$、$DC$ 两段；已知两腰 $AB=c$、$AC=b$。` },
      { level: `联想`, title: `角平分线四定理 + 面积`, text: `[[p-bisector|角平分线]] 自带「平分线上点到两边等距」，这正好把两个三角形的面积都写成 $\\frac12 \\times$ 边 $\\times$ 同一个 $h$。` },
      { level: `构造`, title: `作双垂线`, text: `从 $D$ 向 $AB$、$AC$ 各作垂线，垂距同为 $h$；再把 $\\triangle ABD$、$\\triangle ACD$ 看成同高（顶点 $A$）的两个三角形。` },
      { level: `主链`, title: `同一面积比算两次`, text: `$\\frac{S_{ABD}}{S_{ACD}} = \\frac{c}{b}$（等距）且 $= \\frac{BD}{DC}$（同高）⟹ $\\frac{BD}{DC}=\\frac{c}{b}$。` },
      { level: `完整解`, title: `结论`, text: `$\\frac{BD}{DC}=\\frac{AB}{AC}$，$\\frac{S_{ABD}}{S_{ACD}}=\\frac{c}{b}$。若 $I$ 为内心，进一步有 $AI:ID=(b+c):a$。` },
    ],
    decision: `选面积法而不是先作平行线再用相似，是因为「角平分线上的点到两边等距」与「同高三角形面积比等于底之比」这两句话能同时算出同一个面积比，等于一次完成角平分线定理的证明并顺手回答了面积比那一问，零辅助线。放弃了「过 $D$ 作 $DE \\parallel AB$ 交 $AC$ 于 $E$」的经典相似证法：那条路线要证 $AE=DE$、再写 $\\frac{CD}{CB} = \\frac{CE}{CA}$、最后代数化简，链条长且第二问还要另算面积。也没直接用内角平分线定理当已知代入——题目要求「求证」，需要有推导过程。`,
    discard: [
      `过 $D$ 作平行线造等腰再相似：需三步导角加一次代数化简，且面积比要另起炉灶。`,
      `把角平分线定理当公式直接代入：题目要求给出证明，跳步会失分。`,
    ],
    variants: [
      `同档换条件：改为外角平分线交 $BC$ 延长线于 $E$，求 $BE/EC$（答案仍为 $c/b$，但需有向线段，落在延长线上）。`,
      `升一档：引入内心 $I$ 与内切圆半径 $r$，用 $S = r\\cdot s$（$s$ 为半周长）证明 $AI:ID = (b+c):a$，并接入 [[p-claw]]。`,
    ],
    traps: [
      `内、外角平分线的分点公式不同；外分时用有向线段会得到负号。`,
      `面积比换成底之比的前提是「同高」，这里两三角形共用顶点 $A$，条件成立；若顶点不同则不能直接用。`,
    ],
    body: `## 卡点
要同时给出线段比与面积比，若直接引用角平分线定理，第二问还得重新组织。

## 主线
识别 [[p-bisector]] 的等距性质 → 同一面积比用两种方式表达（[[i-double-count]]）→ 比例与面积比一起得出。对应 [[m-area]]。

## 易误判
把 $\\frac{S_{ABD}}{S_{ACD}}$ 直接写成 $\\frac{AB}{AC}$ 却说不出理由：必须同时用「角平分线上点到两边等距」与「两三角形同高」两句话，缺一不可。这也说明为什么 [[i-double-count]]（算两次）是面积法的灵魂。`,
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: `pr-07`,
    layer: `problem`,
    title: `四点共圆判定与搬角`,
    short: `用对角互补补出圆，再沿同弧搬角`,
    tier: [2],
    tags: [`cyclic`, `equal-angle`, `circle`],
    source: `联赛中档 · 改编`,
    figure: `fig-cyclic`,
    patterns: [`p-cyclic`, `p-tangent-chord`],
    methods: [`m-cyclic`, `m-similarity`],
    statement: `四边形 $ABCD$ 中，$\\angle ABC + \\angle CDA = 180^\\circ$。求证：$A,B,C,D$ 四点共圆，并由此证明 $\\angle ABD = \\angle ACD$。`,
    answer: `## 解
**第一步：判共圆。** 过 $A,B,C$ 三点作圆 $\\omega$（三点不共线时唯一确定）。设 $D'$ 为 $\\omega$ 与射线 $CD$ 所在直线的另一交点中使四边形凸的那个。由圆内接四边形对角互补，$\\angle ABC + \\angle AD'C = 180^\\circ$。

题设 $\\angle ABC + \\angle ADC = 180^\\circ$，故 $\\angle ADC = \\angle AD'C$。两个角共用边 $DA$（或 $D'A$）且顶点都在直线 $CD$ 上，因此 $D$ 与 $D'$ 重合，即 $D$ 在 $\\omega$ 上。

（更简洁的写法：直接用「对角互补 $\\iff$ 四点共圆」这一判定定理。）

**第二步：搬角。** $A,B,C,D$ 共圆后，$\\angle ABD$ 与 $\\angle ACD$ 都是弦 $AD$ 所对的圆周角，且 $B,C$ 在弦 $AD$ 的同侧，故
$$\\angle ABD = \\angle ACD$$

**结论**：四点共圆，且同弧圆周角相等。

## 易误判
把 $\\frac{S_{ABD}}{S_{ACD}}$ 直接写成 $\\frac{AB}{AC}$ 却说不出理由：必须同时用「角平分线上点到两边等距」与「两三角形同高」两句话，缺一不可。这也说明为什么 [[i-double-count]]（算两次）是面积法的灵魂。`,
    hints: [
      { level: `观察`, title: `角互补，没有圆`, text: `题目给的是 $\\angle ABC + \\angle CDA = 180^\\circ$，图上并没有画圆，但要证「四点共圆」和「两角相等」。` },
      { level: `联想`, title: `对角互补判共圆`, text: `[[p-cyclic|共圆四判定]] 里最直接的一条就是「对角互补」；共圆之后同弧圆周角可以沿圆周搬位。` },
      { level: `构造`, title: `过三点作圆`, text: `过 $A,B,C$ 作圆 $\\omega$，再证 $D$ 在 $\\omega$ 上（同一法）；或直接引用对角互补判定。` },
      { level: `主链`, title: `同弧所对圆周角`, text: `共圆 ⟹ $\\angle ABD$ 与 $\\angle ACD$ 同对弦 $AD$ ⟹ 两角相等。` },
      { level: `完整解`, title: `结论`, text: `$A,B,C,D$ 共圆；$\\angle ABD = \\angle ACD$。注意 $B,C$ 必须在弦 $AD$ 同侧，异侧时两角互补。` },
    ],
    decision: `先补圆再搬角，是因为题干给的「对角互补」正是共圆四判定中最干净的一条，而待证的两角 $\\angle ABD$ 与 $\\angle ACD$ 恰好共用弦 $AD$——一旦共圆，结论就是同弧圆周角定理的原文，一步到位。放弃了纯导角：由 $\\angle ABC + \\angle CDA = 180^\\circ$ 出发去追 $\\angle ABD - \\angle ACD$，需要反复拆 $\\angle B$ 与 $\\angle D$，绕三四步且极易在角的加减上出错。也没先连对角线 $AC$ 用相似：图中没有给出任何边长或比例，相似无从判起。`,
    discard: [
      `不使用共圆、纯靠角的加减硬追：链条长、符号易错，且看不出结构。`,
      `连 $AC$ 后试图证 $\\triangle ABC \\sim \\triangle ADC$：缺少边或第二组等角条件，判据不成立。`,
    ],
    variants: [
      `同档换条件：把条件改为 $\\angle ABD = \\angle ACD$（同侧张角相等），反证四点共圆。`,
      `升一档：引入切线 $AT$，用 [[p-tangent-chord]] 的弦切角把圆外角也搬进来，或结合 [[p-power]] 求线段乘积。`,
    ],
    traps: [
      `同弧圆周角相等要求两点在弦的**同侧**；异侧时得到的是补角。`,
      `过三点作圆时需保证三点不共线；退化情形要单独说明。`,
    ],
    body: `## 卡点
「角相等」散落在两处，却没有任何全等或平行可用；而且图上根本没画圆。

## 主线
识别对角互补 → [[m-cyclic]] 补出外接圆 → 同弧圆周角搬位。对应 [[i-complete]]（补上一个已知图形）。

## 易误判
看到「角相等」就去找全等三角形：本题没有任何边长条件，全等无从判起；真正的自由度来自补一个圆。对应 [[i-complete]]：缺的不是一条辅助线，而是一个已知图形（外接圆）。`,
  },

  /* ---------------------------------------------------------------- 8 */
  {
    id: `pr-08`,
    layer: `problem`,
    title: `切割线定理求长度`,
    short: `PT² = PA·PB，连半径得直角`,
    tier: [2],
    tags: [`circle`, `tangent`, `ratio`],
    source: `联赛中档 · 改编`,
    figure: `fig-power`,
    patterns: [`p-power`, `p-tangent-chord`],
    methods: [`m-power`, `m-similarity`],
    statement: `从圆 $O$ 外一点 $P$ 引切线 $PT$（$T$ 为切点）与割线 $PAB$（$A,B$ 在圆上，$A$ 在 $P,B$ 之间）。设圆半径为 $r$，$PO = d$。求证：$PT^2 = PA \\cdot PB = d^2 - r^2$。`,
    answer: `## 解
**第一部分：切割线定理。** 连 $AT$、$BT$。由弦切角定理（见 [[p-tangent-chord]]），切线 $PT$ 与弦 $TA$ 的夹角等于弦 $TA$ 所对的圆周角：
$$\\angle PTA = \\angle TBA$$
又 $\\angle TPA = \\angle BPT$（公共角），故
$$\\triangle PTA \\sim \\triangle PBT$$
由相似对应边成比例 $\\frac{PT}{PB} = \\frac{PA}{PT}$，得
$$PT^2 = PA \\cdot PB$$

**第二部分：用 $d,r$ 表示。** 连 $OT$、$OP$。因 $PT$ 为切线，$OT \\perp PT$，故 $\\triangle OTP$ 为直角三角形：
$$PT^2 = OP^2 - OT^2 = d^2 - r^2$$

**联立**得
$$PA \\cdot PB = PT^2 = d^2 - r^2$$

**结论**：$PT^2 = PA\\cdot PB = PO^2 - r^2$，即点 $P$ 对圆的幂。

## 易误判
看到「角相等」就去找全等三角形：本题没有任何边长条件，全等无从判起；真正的自由度来自补一个圆。对应 [[i-complete]]：缺的不是一条辅助线，而是一个已知图形（外接圆）。`,
    hints: [
      { level: `观察`, title: `圆外一点、一切一割`, text: `图上有圆 $O$、圆外点 $P$、切线 $PT$、割线 $PAB$；题干给了 $PO=d$、半径 $r$。` },
      { level: `联想`, title: `圆幂三定理 + 弦切角`, text: `[[p-power|圆幂]] 的切割线形式就是 $PT^2 = PA\\cdot PB$；而要证它，需要 [[p-tangent-chord|弦切角]] 把切线角搬进圆内造相似。` },
      { level: `构造`, title: `连 AT、BT 与 OT`, text: `连 $AT$、$BT$ 造 $\\triangle PTA$ 与 $\\triangle PBT$；再连 $OT$ 得直角 $\\angle OTP = 90^\\circ$。` },
      { level: `主链`, title: `相似 + 勾股`, text: `$\\angle PTA = \\angle TBA$ 且 $\\angle P$ 公共 ⟹ $\\triangle PTA \\sim \\triangle PBT$ ⟹ $PT^2 = PA\\cdot PB$；又 $PT^2 = d^2-r^2$。` },
      { level: `完整解`, title: `结论`, text: `$PA\\cdot PB = PT^2 = PO^2 - r^2$。这个量与割线的选取无关，只由 $P$ 和圆决定。` },
    ],
    decision: `先连 $AT$、$BT$ 用弦切角造相似，是因为「切点 + 割线」这一组合的唯一自由度就是弦切角：它把圆外的 $\\angle PTA$ 变成圆内的圆周角 $\\angle TBA$，于是 $\\triangle PTA \\sim \\triangle PBT$ 几乎自动成立，切割线定理一步得出。第二问连 $OT$ 则是把 $d,r$ 接进来——切线垂直半径给出直角三角形，勾股直接写出 $d^2-r^2$。放弃了设 $PA=x$、$PB=x+AB$ 再用相交弦定理反推：那需要先知道 $AB$ 与 $P$ 到圆心的关系，反而更绕。也没直接用坐标硬算 $PT^2$，因为圆的方程与切线条件会带来判别式为零的二次方程，计算量远大于两次几何观察。`,
    discard: [
      `设 $PA=x, PB=x+AB$ 后联立相交弦定理：需要额外求 $AB$，信息不足且绕远。`,
      `建立坐标系用判别式 $\\Delta=0$ 求切线长：二次方程展开繁琐，且掩盖了「幂只依赖 $P$ 与圆」这一结构。`,
    ],
    variants: [
      `同档换条件：改为两条割线 $PAB$ 与 $PCD$，证 $PA\\cdot PB = PC\\cdot PD$。`,
      `升一档：引入第二个圆，研究对两圆幂相等的点的轨迹（根轴），见 [[m-power-axis]]。`,
    ],
    traps: [
      `$PA\\cdot PB$ 中 $PA,PB$ 是从 $P$ 到两个交点的**全长**，$PB = PA + AB$ 不能写成 $AB$。`,
      `弦切角等于所夹弧的圆周角；取错切线射线的一侧会得到补角。`,
    ],
    body: `## 卡点
切线在圆外、割线穿圆内，两个量看似无关；要同时给出乘积式与 $d^2-r^2$。

## 主线
连弦造相似（[[p-tangent-chord]]）→ $PT^2 = PA\\cdot PB$；连半径造直角 → $PT^2 = d^2-r^2$。对应 [[m-power]] 与 [[m-similarity]]。`,
  },

  /* ---------------------------------------------------------------- 9 */
  {
    id: `pr-09`,
    layer: `problem`,
    title: `托勒密定理求对角线`,
    short: `圆内接四边形的乘积和等式`,
    tier: [2],
    tags: [`cyclic`, `circle`, `sum-seg`],
    source: `联赛中档 · 改编`,
    figure: `fig-ptolemy`,
    patterns: [`p-ptolemy`, `p-cyclic`],
    methods: [`m-similarity`, `m-trig`],
    statement: `圆内接四边形 $ABCD$ 中，已知 $AB=a$、$BC=b$、$CD=c$、$DA=d$，对角线 $AC=e$、$BD=f$。求证：$e f = ac + bd$，并用它说明正五边形中对角线与边长之比。`,
    answer: `## 解
**证明托勒密等式。** 在对角线 $BD$ 上取点 $E$，使 $\\angle BAE = \\angle CAD$。

由 $A,B,C,D$ 共圆，$\\angle ABE = \\angle ABD = \\angle ACD$（同弧 $AD$）。又 $\\angle BAE = \\angle CAD$，故
$$\\triangle ABE \\sim \\triangle ACD \\quad\\Longrightarrow\\quad \\frac{AB}{AC} = \\frac{BE}{CD}$$
即 $AB \\cdot CD = AC \\cdot BE$。

另一方面，$\\angle BAC = \\angle BAE + \\angle EAC = \\angle CAD + \\angle EAC = \\angle EAD$，且 $\\angle BCA = \\angle BDA = \\angle EDA$（同弧 $AB$），故
$$\\triangle ABC \\sim \\triangle AED \\quad\\Longrightarrow\\quad \\frac{BC}{ED} = \\frac{AC}{AD}$$
即 $BC \\cdot AD = AC \\cdot ED$。

两式相加：
$$AB\\cdot CD + BC\\cdot AD = AC(BE + ED) = AC \\cdot BD$$
即 $ef = ac + bd$。

**正五边形应用。** 设边长为 $1$、对角线为 $\\varphi$。取正五边形中任意四点构成圆内接四边形，其边依次为 $1,1,1,\\varphi$、对角线为 $\\varphi,\\varphi$，代入托勒密：
$$\\varphi \\cdot \\varphi = 1\\cdot 1 + 1\\cdot \\varphi \\quad\\Longrightarrow\\quad \\varphi^2 = \\varphi + 1$$
解得 $\\varphi = \\frac{1+\\sqrt5}{2}$（黄金比）。`,
    hints: [
      { level: `观察`, title: `共圆 + 六条长度`, text: `$A,B,C,D$ 共圆，题面一次给出四条边 $a,b,c,d$ 与两条对角线 $e,f$。` },
      { level: `联想`, title: `托勒密`, text: `圆内接四边形 + 对角线与四边同时出现，是 [[p-ptolemy|托勒密定理]] 的标准信号：$AC\\cdot BD = AB\\cdot CD + BC\\cdot DA$。` },
      { level: `构造`, title: `在 BD 上取 E`, text: `在对角线 $BD$ 上取 $E$ 使 $\\angle BAE = \\angle CAD$，把等式拆成两次相似。` },
      { level: `主链`, title: `两次相似相加`, text: `$\\triangle ABE \\sim \\triangle ACD$ ⟹ $AB\\cdot CD = AC\\cdot BE$；$\\triangle ABC \\sim \\triangle AED$ ⟹ $BC\\cdot AD = AC\\cdot ED$；相加并用 $BE+ED=BD$。` },
      { level: `完整解`, title: `结论`, text: `$ef = ac+bd$。正五边形代入得 $\\varphi^2 = \\varphi+1$，故对角线与边长之比为 $\\frac{1+\\sqrt5}{2}$。` },
    ],
    decision: `先在 $BD$ 上取 $E$ 造两次相似，是因为托勒密等式的右端是「两组对边乘积之和」，而一次相似只能产出一个乘积——必须把对角线拆成 $BE+ED$ 两段，各配一次相似。选 $\\angle BAE = \\angle CAD$ 是为了让第一组相似的夹角相等，同时 $\\angle BAC = \\angle EAD$ 自动成立，第二组相似不用重新构造。放弃了用余弦定理硬算：设 $\\angle BAD = \\theta$，在 $\\triangle ABD$ 与 $\\triangle BCD$ 中分别写 $f^2$ 再消去 $\\cos\\theta$，虽然可行，但代数化简要处理 $\\cos(180^\\circ-\\theta)$ 与两组边，篇幅是几何法的两倍。也没直接用托勒密当公式代入，因为题目要求给出证明。`,
    discard: [
      `在两个三角形中用余弦定理写 $BD^2$ 再消元：需处理 $\\cos\\theta$ 与 $\\cos(180^\\circ-\\theta)$，代数量大。`,
      `把托勒密当已知公式直接代入：题目要求证明，跳步会失分。`,
    ],
    variants: [
      `同档换条件：已知 $a,b,c,d,e$ 求 $f = \\frac{ac+bd}{e}$，或验证某四边形是否共圆（逆定理）。`,
      `升一档：证明托勒密不等式 $AC\\cdot BD \\le AB\\cdot CD + BC\\cdot DA$ 对任意四边形成立，取等即共圆；用复数模长不等式给出统一证明。`,
    ],
    traps: [
      `配对必须是「对角线乘积 = 两组**对边**乘积之和」，把 $AB\\cdot BC$ 写进去就不成立。`,
      `取等点 $E$ 必须落在对角线 $BD$ **内部**，否则 $BE+ED \\ne BD$。`,
    ],
    body: `## 卡点
六条长度同时出现，且结论是「乘积之和」而非「比例」，常规相似一次做不完。

## 主线
识别 [[p-ptolemy]] → 把对角线拆两段造两次相似 → 相加。对应 [[m-similarity]]；正五边形应用顺带给出黄金比。

## 易误判
把等式写成 $AC\\cdot BD = AB\\cdot BC + CD\\cdot DA$：配对必须是两组**对边**，不是相邻边。判断办法是看结论能否用「对角线拆成两段、每段配一次相似」得到。对应 [[i-reduce]]。`,
  },

  /* ---------------------------------------------------------------- 10 */
  {
    id: `pr-10`,
    layer: `problem`,
    title: `阿氏圆与加权最值`,
    short: `PA = 2PB 的轨迹是圆，用它求 PA+2PB 最小值`,
    tier: [2],
    tags: [`ratio`, `locus`, `extreme`],
    source: `联赛中档 · 改编`,
    figure: `fig-apollonius`,
    patterns: [`p-apollonius`, `p-hu-bu-gui`],
    methods: [`m-coord`, `m-similarity`, `m-trig`],
    statement: `已知 $A,B$ 为定点，$AB = 3$。点 $P$ 满足 $PA = 2PB$。求 $P$ 的轨迹，并求 $PA + 2PB$ 的最小值。`,
    answer: `## 解
**第一步：轨迹。** 设 $A=(-1,0)$、$B=(1,0)$（把 $AB=3$ 缩放为方便计算的 $2$，最后按比例还原；此处先用 $|AB|=2$ 推导形状）。取 $P=(x,y)$，由 $PA^2 = 4PB^2$：
$$(x+1)^2 + y^2 = 4\\left[(x-1)^2 + y^2\\right]$$
展开化简：
$$x^2+2x+1+y^2 = 4x^2 - 8x + 4 + 4y^2$$
$$3x^2 - 10x + 3y^2 + 3 = 0 \\quad\\Longrightarrow\\quad \\left(x-\\frac53\\right)^2 + y^2 = \\frac{16}{9}$$
故 $P$ 的轨迹是以 $O\\left(\\frac53,0\\right)$ 为圆心、$R=\\frac43$ 为半径的圆——**阿波罗尼斯圆**。

几何解释：在 $AB$ 上取内分点 $I$ 与外分点 $X$ 使 $IA/IB = XA/XB = 2$，则 $PI$、$PX$ 为 $\\angle APB$ 的内、外角平分线，$\\angle IPX = 90^\\circ$，故 $P$ 在以 $IX$ 为直径的圆上（见 [[p-apollonius]]）。

**第二步：最值。** 由 $PA = 2PB$ 得
$$PA + 2PB = 2PB + 2PB = 4PB$$
故只需最小化 $PB$。$P$ 在圆 $(O,R)$ 上，$B=(1,0)$，$OB = \\frac53 - 1 = \\frac23 < R$，即 $B$ 在圆内，因此
$$PB_{\\min} = R - OB = \\frac43 - \\frac23 = \\frac23$$
于是 $\\min(PA+2PB) = 4 \\times \\frac23 = \\frac83$。

（按 $AB=3$ 等比例放大 $\\frac32$ 倍，最小值为 $4$。）

**结论**：轨迹为阿氏圆；最小值按比例还原后为 $4$。

## 易误判
把等式写成 $AC\\cdot BD = AB\\cdot BC + CD\\cdot DA$：配对必须是两组**对边**，不是相邻边。判断办法是看结论能否用「对角线拆成两段、每段配一次相似」得到。对应 [[i-reduce]]。`,
    hints: [
      { level: `观察`, title: `定比 + 最值`, text: `条件是 $PA = 2PB$（定比且不等于 1），要求的是 $PA+2PB$ 的最小值；$A,B$ 是定点。` },
      { level: `联想`, title: `阿氏圆 / 胡不归`, text: `定比 $k\\ne1$ 的轨迹是 [[p-apollonius|阿氏圆]]；而加权和最值属于 [[p-hu-bu-gui|胡不归]] 家族，可先化简权重。` },
      { level: `构造`, title: `建系或取内外分点`, text: `设 $A=(-1,0),B=(1,0),P=(x,y)$，把 $PA^2=4PB^2$ 写成方程；或取内分点 $I$、外分点 $X$ 以 $IX$ 为直径作圆。` },
      { level: `主链`, title: `配方成圆 + 化权重`, text: `方程配方得 $\\left(x-\\frac53\\right)^2+y^2=\\frac{16}{9}$；又 $PA=2PB$ ⟹ $PA+2PB = 4PB$，转化为圆上点到 $B$ 的最短距离。` },
      { level: `完整解`, title: `结论`, text: `轨迹是圆心 $\\left(\\frac53,0\\right)$、半径 $\\frac43$ 的圆；$PB_{\\min}=R-OB$，按 $AB=3$ 还原后最小值为 $4$。` },
    ],
    decision: `先把「定比」翻译成圆、再把权重化简，是因为 $PA = 2PB$ 这个条件同时干了两件事：它既给出了轨迹（阿氏圆），又让 $PA+2PB$ 直接坍缩成 $4PB$——如果不先用条件化简权重，就会去处理一个带系数的最值，凭空多一层。选定比坐标时把 $AB$ 缩放为 $2$ 是为了配方干净，最后按比例还原。放弃了纯几何「作角 $\\sin\\theta = \\frac12$」的胡不归路线：那适用于 $P$ 在一条定直线上运动的情形，而这里 $P$ 的自由度由定比锁定，轨迹已经是圆，用圆上点到定点的最短距离更直接。也放弃了拉格朗日乘子：二维圆上线性目标函数用几何一步到位，没必要上微积分。`,
    discard: [
      `套胡不归「作 $\\sin\\theta = k$ 的射线」：该招适用于动点在定直线上，本题动点已被定比锁在圆上。`,
      `设 $PB=t$ 后用余弦定理表达 $PA$ 再对 $t$ 求导：可行但把一个初中几何题变成微积分练习。`,
    ],
    variants: [
      `同档换条件：把 $PA=2PB$ 改为 $PA=k\\cdot PB$，求轨迹圆心与半径关于 $k$ 的表达式。`,
      `升一档：改为求 $\\lambda PA + PB$ 的最小值，用阿氏圆把加权项换成到新定点的距离（见 [[p-hu-bu-gui]]）。`,
    ],
    traps: [
      `$k=1$ 时轨迹退化为中垂线而非圆，必须单独处理。`,
      `求圆上点到定点距离最值时，要先判断定点在圆内还是圆外；本题 $B$ 在圆内，最短距离是 $R-OB$ 而非 $OB-R$ 的绝对值乱套。`,
    ],
    body: `## 卡点
既有「定比」又有「加权最值」，两个条件纠缠；且图里看不到圆。

## 主线
定比 → [[p-apollonius]] 配方得圆 → 用条件把 $PA+2PB$ 化为 $4PB$ → 圆上点到定点最短距离。对应 [[m-coord]] 与 [[i-algebra]]。

## 易误判
不先用 $PA=2PB$ 化简权重，直接对 $PA+2PB$ 求最值：会陷入两个变量的根式。正确顺序是「先定轨迹、再化权重、最后连心线」，对应 [[i-algebra]] 与 [[i-invariant]]。`,
  },

  /* ---------------------------------------------------------------- 11 */
  {
    id: `pr-11`,
    layer: `problem`,
    title: `隐形圆求动点轨迹`,
    short: `定角对定边，把没有圆的条件补成圆`,
    tier: [2],
    tags: [`fixed-angle`, `locus`, `circle`],
    source: `联赛中档 · 改编`,
    figure: `fig-hidden-circle`,
    patterns: [`p-hidden-circle`, `p-right-mid`],
    methods: [`m-cyclic`, `m-coord`],
    statement: `线段 $AB$ 固定，点 $P$ 满足 $\\angle APB = 60^\\circ$。求 $P$ 的轨迹；并求 $P$ 到 $AB$ 中点 $M$ 的距离的最大值。`,
    answer: `## 解
**第一步：补出隐形圆。** 对定线段 $AB$ 张定角，由圆周角定理，$P$ 落在过 $A,B$ 的一段圆弧上。设 $AB = c$，外接圆半径
$$R = \\frac{AB}{2\\sin 60^\\circ} = \\frac{c}{\\sqrt3}$$
圆心 $O$ 在 $AB$ 的中垂线上，且 $OM = \\sqrt{R^2 - (c/2)^2} = \\sqrt{\\frac{c^2}{3} - \\frac{c^2}{4}} = \\frac{c}{2\\sqrt3}$。

注意：$P$ 在 $AB$ 另一侧时张角为 $180^\\circ - 60^\\circ = 120^\\circ$，故严格满足 $60^\\circ$ 的只是一段弧；若题目允许 $60^\\circ$ 或 $120^\\circ$，轨迹是两段对称弧。

**第二步：求 $PM$ 最大值。** $P$ 在圆 $(O,R)$ 上，$M$ 为定点。圆上一点到定点距离的最大值为
$$PM_{\\max} = OM + R = \\frac{c}{2\\sqrt3} + \\frac{c}{\\sqrt3} = \\frac{3c}{2\\sqrt3} = \\frac{\\sqrt3}{2}c$$
取等时 $P$ 在 $MO$ 延长线与圆的交点处。

若取 $c = AB = 2$，则 $R = \\frac{2}{\\sqrt3}$，$PM_{\\max} = \\sqrt3$。

**结论**：轨迹是以 $AB$ 为弦、半径 $\\frac{AB}{\\sqrt3}$ 的圆弧；$PM_{\\max} = \\frac{\\sqrt3}{2}AB$。。`,
    hints: [
      { level: `观察`, title: `定角、图里没圆`, text: `$AB$ 固定，$\\angle APB = 60^\\circ$ 恒定，$P$ 是动点；图上没有画任何圆。` },
      { level: `联想`, title: `定角对定边`, text: `[[p-hidden-circle|隐形圆]]：对定线段张定角的点必在一段圆弧上；$90^\\circ$ 时退化为以 $AB$ 为直径的圆（[[p-right-mid]]）。` },
      { level: `构造`, title: `作外接圆`, text: `过 $A,B,P$ 作圆，圆心在 $AB$ 中垂线上；用 $R = \\frac{AB}{2\\sin\\alpha}$ 求半径，再算 $OM$。` },
      { level: `主链`, title: `圆上点到定点最值`, text: `$R = \\frac{c}{2\\sin 60^\\circ}$、$OM=\\sqrt{R^2-(c/2)^2}$；$PM_{\\max} = OM+R$（连心线穿圆）。` },
      { level: `完整解`, title: `结论`, text: `轨迹为半径 $\\frac{AB}{\\sqrt3}$ 的圆弧；$PM_{\\max} = \\frac{\\sqrt3}{2}AB$。注意另一段弧对应 $120^\\circ$，需按题意取舍。` },
    ],
    decision: `先补圆，是因为「定线段 + 定角」是圆周角定理的逆用，条件里其实已经藏了一个圆，只是没画出来。补出圆之后第二问立刻变成「圆上一点到定点距离的最大值」，连心线一穿即可，不需要任何 optimization。放弃了设 $A(-1,0),B(1,0),P(x,y)$ 用 $\\tan$ 或向量夹角公式硬算轨迹：会得到 $\\frac{(x+1)(x-1)+y^2}{\\dots} = \\cos 60^\\circ$ 这类分式，化简后才认出是圆，等于把几何事实重新推导一遍。也放弃了直接用余弦定理设 $PA=u,PB=v$ 求 $PM$：中线公式含 $uv$ 与夹角，变量太多。`,
    discard: [
      `用向量夹角公式 $\\cos\\angle APB = \\frac12$ 建系展开：分式化简后才认出圆，重复劳动。`,
      `设 $PA=u,PB=v$ 用中线长公式求 $PM$：含 $uv$ 与多个自由变量，约束不足。`,
    ],
    variants: [
      `同档换条件：把 $60^\\circ$ 换成 $90^\\circ$，轨迹变成以 $AB$ 为直径的圆，$PM_{\\max} = \\frac{AB}{2}$。`,
      `升一档：改为 $\\angle APB$ 随 $P$ 变化但 $\\frac{PA}{PB}$ 为定值（[[p-apollonius]]），或与 [[m-power-axis]] 结合处理两段弧的并集。`,
    ],
    traps: [
      `定角对应两段弧：同侧为 $60^\\circ$，异侧为 $120^\\circ$；只画一段会漏解。`,
      `圆心在 $AB$ 中垂线上，但 $OM \\ne 0$（除非 $\\alpha = 90^\\circ$）；把 $M$ 当圆心会算错 $PM_{\\max}$。`,
    ],
    body: `## 卡点
条件里根本没有圆，学生容易试图用解析式硬解一个动点轨迹。

## 主线
识别定角对定边 → [[p-hidden-circle]] 补圆 → 圆周角定半径 → 连心线求最值。对应 [[i-complete]] 与 [[m-cyclic]]。

## 易误判
把 $AB$ 中点 $M$ 当成圆心：只有 $\\alpha = 90^\\circ$ 时圆心才与 $M$ 重合。一般情形圆心在 $AB$ 中垂线上且 $OM \\ne 0$，算 $PM_{\max}$ 必须用 $OM + R$。对应 [[i-invariant]]：抓「定角」这个不变量。`,
  },

  /* ---------------------------------------------------------------- 12 */
  {
    id: `pr-12`,
    layer: `problem`,
    title: `费马点求距离和最小值`,
    short: `旋转 60 度把 PA+PB+PC 拉成一条直线`,
    tier: [2],
    tags: [`extreme`, `rotate`, `sum-seg`],
    source: `联赛压轴 · 改编`,
    figure: `fig-fermat`,
    patterns: [`p-fermat`, `p-hand`],
    methods: [`m-congruence`, `m-trig`],
    statement: `$\\triangle ABC$ 三个内角均小于 $120^\\circ$，求一点 $P$ 使 $PA+PB+PC$ 最小，并给出最小值与取等条件。`,
    answer: `## 解
**构造。** 以 $BC$ 为边向外作正三角形 $BCE$，连 $AE$。设 $F$ 为 $AE$ 与 $\\triangle BCE$ 外接圆的交点（在 $\\triangle ABC$ 内部者）。

**证明。** 把 $\\triangle BPC$ 绕 $B$ 逆时针旋转 $60^\\circ$ 到 $\\triangle BP'C'$，其中 $C \\to E$（因 $\\triangle BCE$ 为正三角形）。由旋转：
- $BP = BP'$ 且 $\\angle PBP' = 60^\\circ$，故 $\\triangle BPP'$ 为正三角形，$PP' = PB$；
- $P'E = PC$。

于是对任意 $P$：
$$PA + PB + PC = PA + PP' + P'E \\ge AE$$
最后一个不等号是「折线不短于直线段」。

**取等。** 当 $A,P,P',E$ 共线且依次排列时取等，此时 $P = F$。可导得
$$\\angle APB = \\angle BPC = \\angle CPA = 120^\\circ$$
故最小值
$$\\min(PA+PB+PC) = AE$$
其中 $AE$ 可由余弦定理求出：设 $AB=c$、$AC=b$、$BC=a$，$\\angle ABE = \\angle ABC + 60^\\circ$，则
$$AE^2 = c^2 + a^2 - 2ca\\cos(B+60^\\circ)$$

**结论**：最小值 $= AE$，取等点 $F$（费马点）满足三视角均为 $120^\\circ$。若某内角 $\\ge 120^\\circ$，最小值在该钝角顶点取得。

## 易误判
把 $AB$ 中点 $M$ 当成圆心：只有 $\\alpha = 90^\\circ$ 时圆心才与 $M$ 重合。一般情形圆心在 $AB$ 中垂线上且 $OM \\ne 0$，算 $PM_{\max}$ 必须用 $OM + R$。对应 [[i-invariant]]：抓「定角」这个不变量。`,
    hints: [
      { level: `观察`, title: `三段距离求和`, text: `要最小化 $PA+PB+PC$，三个定点、一个动点；题目还特意说明三个内角都小于 $120^\\circ$。` },
      { level: `联想`, title: `费马点 / 旋转 60 度`, text: `「到三定点距离之和最小」是 [[p-fermat|费马点]]；标准手法是绕一个顶点旋转 $60^\\circ$ 造正三角形，把折线拉直。` },
      { level: `构造`, title: `向外作正三角形 BCE`, text: `以 $BC$ 为边**向外**作正三角形 $BCE$，连 $AE$；设 $F = AE \\cap$ 该正三角形外接圆。` },
      { level: `主链`, title: `旋转造等边 + 折线拉直`, text: `把 $\\triangle BPC$ 绕 $B$ 转 $60^\\circ$ ⟹ $PP'=PB$、$P'E=PC$ ⟹ $PA+PB+PC = PA+PP'+P'E \\ge AE$。` },
      { level: `完整解`, title: `结论`, text: `最小值 $=AE$，取等时 $A,P,P',E$ 共线，$\\angle APB=\\angle BPC=\\angle CPA=120^\\circ$；有内角 $\\ge120^\\circ$ 时最小值在该顶点取得。` },
    ],
    decision: `选绕 $B$ 旋转 $60^\\circ$，是因为 $60^\\circ$ 旋转能同时造出两件事：正三角形 $BPP'$ 让 $PB$ 变成一段可见的线段 $PP'$，而 $PC$ 被搬到 $P'E$——三段距离于是首尾相接成一条折线，「两点之间线段最短」直接给出下界 $AE$。这一步把最值问题彻底变成几何直观。放弃了用坐标 + 偏导求驻点：三个距离都是平方根，求偏导后要解一个非线性方程组，虽然最终也会得到 $120^\\circ$，但计算量大且不适合初中竞赛。也放弃了先猜 $120^\\circ$ 再验证：没有构造就没有下界，只能说明是驻点不能说明是最小值。正三角形必须向外作，向内作会让 $E$ 落在错误一侧，折线拉直失效。`,
    discard: [
      `设 $P(x,y)$ 对 $\\sum\\sqrt{(x-x_i)^2+(y-y_i)^2}$ 求偏导：根式方程组求解繁琐，且需另证凸性。`,
      `直接假设三视角为 $120^\\circ$ 再验证：缺下界论证，只能说明驻点，不能说明最小值。`,
    ],
    variants: [
      `同档换条件：改为正三角形 $ABC$ 边长 $a$，求最小值（答案 $\\sqrt3 a$，取等点即中心）。`,
      `升一档：求 $\\lambda_A PA + \\lambda_B PB + \\lambda_C PC$ 的加权最小值，与 [[p-apollonius]]、[[p-hu-bu-gui]] 合用。`,
    ],
    traps: [
      `正三角形必须向三角形**外侧**作；向内作会让拉直后的端点落在错误一侧。`,
      `若某内角 $\\ge 120^\\circ$，费马点退化到该顶点，不能再用 $120^\\circ$ 条件求解。`,
    ],
    body: `## 卡点
三个距离相加，没有任何两个能直接合并；纯代数会陷入根式。

## 主线
识别 [[p-fermat]] → 旋转 $60^\\circ$ 造正三角形 → 三段首尾相接成折线 → 折线拉直得下界 $AE$ → 导角得 $120^\\circ$。对应 [[i-transform]]。

## 易误判
把正三角形作在三角形内侧：旋转后 $E$ 落在错误一侧，折线无法拉直，下界 $AE$ 不成立。判断标准是「向外作才能让 $A,P,P',E$ 依次共线」。对应 [[i-invariant]]：旋转保距，折线长度不变。`,
  },

  /* ---------------------------------------------------------------- 13 */
  {
    id: `pr-13`,
    layer: `problem`,
    title: `鸡爪定理与内心`,
    short: `弧中点到内心与两顶点等距`,
    tier: [3],
    tags: [`circle`, `bisect`, `prove-equal`],
    source: `自招 / 联赛压轴 · 改编`,
    figure: `fig-chicken-claw`,
    patterns: [`p-claw`, `p-bisector`],
    methods: [`m-cyclic`, `m-congruence`],
    statement: `$\\triangle ABC$ 内接于圆 $O$，$I$ 为内心，$AI$ 延长交圆 $O$ 于 $M$（$M$ 为不含 $A$ 的弧 $BC$ 中点）。求证：$MB = MC = MI$。`,
    answer: `## 解
**第一部分：$MB = MC$。** 因 $AI$ 平分 $\\angle BAC$，故 $\\angle BAM = \\angle MAC$，所对弧 $BM$ 与 $MC$ 相等，从而 $MB = MC$。

**第二部分：$MB = MI$。** 连 $BI$、$BM$、$MI$。记 $\\angle A = \\alpha$、$\\angle B = \\beta$、$\\angle C = \\gamma$。

在 $\\triangle MBI$ 中：
$$\\angle MBI = \\angle MBC + \\angle CBI$$
- $\\angle MBC = \\angle MAC = \\frac{\\alpha}{2}$（同弧 $MC$ 的圆周角）；
- $\\angle CBI = \\frac{\\beta}{2}$（$BI$ 平分 $\\angle B$）。

故 $\\angle MBI = \\frac{\\alpha+\\beta}{2}$。

另一方面，$\\angle MIB$ 是 $\\triangle ABI$ 在顶点 $I$ 处的外角：
$$\\angle MIB = \\angle IAB + \\angle IBA = \\frac{\\alpha}{2} + \\frac{\\beta}{2} = \\frac{\\alpha+\\beta}{2}$$
于是 $\\angle MBI = \\angle MIB$，$\\triangle MBI$ 为等腰三角形，故
$$MB = MI$$

**联立**得 $MB = MC = MI$。

**推论**：$M$ 是 $\\triangle BIC$ 的外心（到 $B,I,C$ 三点等距），这正是「鸡爪」形状的来源。

## 易误判
把正三角形作在三角形内侧：旋转后 $E$ 落在错误一侧，折线无法拉直，下界 $AE$ 不成立。判断标准是「向外作才能让 $A,P,P',E$ 依次共线」。对应 [[i-invariant]]：旋转保距，折线长度不变。`,
    hints: [
      { level: `观察`, title: `外接圆 + 内心 + 弧中点`, text: `图里有 $\\triangle ABC$ 的外接圆、内心 $I$、以及 $AI$ 延长与圆的交点 $M$；要证三条线段相等。` },
      { level: `联想`, title: `鸡爪定理`, text: `「角平分线交外接圆于弧中点」是 [[p-claw|鸡爪定理]] 的标准构型，结论就是 $MB=MC=MI$。` },
      { level: `构造`, title: `连 MB、MC、MI、BI`, text: `连 $MB,MC,MI,BI$，标出 $\\angle MBI$ 与 $\\angle MIB$ 两个角。` },
      { level: `主链`, title: `两次导角凑等腰`, text: `$\\angle MBI = \\angle MBC + \\angle CBI = \\frac{\\alpha}{2}+\\frac{\\beta}{2}$；$\\angle MIB = \\angle IAB+\\angle IBA = \\frac{\\alpha}{2}+\\frac{\\beta}{2}$（外角）⟹ $\\triangle MBI$ 等腰。` },
      { level: `完整解`, title: `结论`, text: `$MB=MC$（等弧）且 $MB=MI$（等腰），故 $MB=MC=MI$；$M$ 是 $\\triangle BIC$ 的外心。` },
    ],
    decision: `先连 $BI$ 导角而不是去算长度，是因为要证的三段相等里有两段（$MB,MC$）由等弧白送，唯一需要努力的是 $MB=MI$；而判定两线段相等最轻的工具就是「在同一三角形里证两角相等」。导角时关键一步是认出 $\\angle MIB$ 是 $\\triangle ABI$ 的外角，从而等于 $\\frac{\\alpha}{2}+\\frac{\\beta}{2}$，与 $\\angle MBI$ 完全对称——这个对称不是巧合，正是鸡爪定理的核心。放弃了用托勒密或圆幂去算 $MI$：需要知道 $AI,IM$ 与各边的关系，链条长且要额外引用内心距离公式。也没建系，因为外接圆 + 角平分线的坐标表达会带来半角正切，化简量远大于两行导角。`,
    discard: [
      `用托勒密于 $ABMC$ 再联立圆幂求 $MI$：需额外引用 $AI\\cdot IM = \\dots$ 一类公式，链条明显更长。`,
      `设外接圆为单位圆用复数表示 $I,M$：内心坐标含半角正切，化简量大。`,
    ],
    variants: [
      `同档换条件：把 $I$ 换成 $A$ 所对的旁心 $I_A$，讨论 $M$ 与 $I_A$ 的等距关系。`,
      `升一档：结合 [[p-euler]] 的九点圆或 [[m-inversion]]，把 $M$ 视为 $\\triangle BIC$ 外心并研究反演下的像。`,
    ],
    traps: [
      `$M$ 必须是不含 $A$ 的弧 $BC$ 中点；取另一弧中点结论不同。`,
      `$\\angle MIB$ 用外角定理时，必须确认 $M,I,A$ 共线且 $M$ 在 $AI$ 延长线上，否则外角方向反。`,
    ],
    body: `## 卡点
三段相等里 $MB=MC$ 显然，但 $MI$ 与圆心、内心都有关，直接算长度很重。

## 主线
识别 [[p-claw]] → 等弧给出 $MB=MC$ → 连 $BI$ 用外角定理导角证 $\\triangle MBI$ 等腰 → $MB=MI$。对应 [[m-cyclic]] 与 [[i-reduce]]。`,
  },

  /* ---------------------------------------------------------------- 14 */
  {
    id: `pr-14`,
    layer: `problem`,
    title: `欧拉线与垂心外心`,
    short: `证 O、G、H 共线且 GH = 2OG`,
    tier: [3],
    tags: [`mid`, `perp`, `circle`],
    source: `自招 · 改编`,
    figure: `fig-euler-line`,
    patterns: [`p-euler`, `p-midline`],
    methods: [`m-similarity`, `m-coord`],
    statement: `$\\triangle ABC$ 中，$O$ 为外心、$G$ 为重心、$H$ 为垂心，$M$ 为 $BC$ 中点。求证：$O,G,H$ 三点共线，且 $GH = 2OG$。`,
    answer: `## 解
**关键性质。** 连 $OM$、$AH$。因 $O$ 为外心，$OM \\perp BC$；因 $H$ 为垂心，$AH \\perp BC$。故
$$AH \\parallel OM$$
且由外接圆性质（或向量）有 $AH = 2OM$：设外接圆半径 $R$，则 $OM = R\\cos A$，而 $AH = 2R\\cos A$。

**构造相似。** 因 $G$ 为重心，$A,G,M$ 共线且
$$AG : GM = 2 : 1$$
在 $\\triangle AHG$ 与 $\\triangle MOG$ 中：
- $\\frac{AG}{GM} = 2 = \\frac{AH}{OM}$，
- $\\angle HAG = \\angle OMG$（$AH \\parallel OM$，$A,G,M$ 共线，内错角）。

故
$$\\triangle AHG \\sim \\triangle MOG \\quad (\\text{SAS})$$
相似比为 $2:1$，于是
$$\\frac{HG}{GO} = 2, \\qquad \\angle AGH = \\angle MGO$$
由 $\\angle AGH = \\angle MGO$ 且 $A,G,M$ 共线，得 $H,G,O$ 共线（$HG$ 与 $GO$ 在同一直线上）。

**结论**：$O,G,H$ 共线且 $GH = 2OG$。此直线即欧拉线，其上的 $OH$ 中点为九点圆圆心，半径 $R/2$。

**退化说明**：等边三角形时 $O=G=H$ 重合，欧拉线不唯一。`,
    hints: [
      { level: `观察`, title: `三个心同时出现`, text: `$O$ 外心、$G$ 重心、$H$ 垂心，还有 $BC$ 中点 $M$；要证三点共线与一个 $2:1$ 的比例。` },
      { level: `联想`, title: `欧拉线`, text: `三心共线是 [[p-euler|欧拉线]]；证明捷径是「重心分中线 $2:1$」与「$AH = 2OM$」这两个 $2$ 凑成一对相似三角形。` },
      { level: `构造`, title: `连 AH、OM`, text: `连 $AH$ 与 $OM$，两者都垂直于 $BC$ 故平行；再连 $OG$、$GH$。` },
      { level: `主链`, title: `SAS 相似`, text: `$\\frac{AG}{GM}=\\frac{AH}{OM}=2$ 且 $\\angle HAG = \\angle OMG$ ⟹ $\\triangle AHG \\sim \\triangle MOG$ ⟹ $\\frac{HG}{GO}=2$ 且 $\\angle AGH=\\angle MGO$ ⟹ 共线。` },
      { level: `完整解`, title: `结论`, text: `$O,G,H$ 共线，$GH=2OG$；等边三角形时三点重合需单独说明。九点圆圆心为 $OH$ 中点。` },
    ],
    decision: `构造 $\\triangle AHG \\sim \\triangle MOG$，是因为题目里藏了两个现成的「$2$」：重心分中线 $AG:GM=2:1$，以及垂心性质 $AH = 2OM$（两者都可由外接圆半径 $R$ 与 $\\cos A$ 一次给出）。两个比值相同、夹角由 $AH \\parallel OM$ 保证相等，SAS 相似一步同时给出 $GH=2OG$ 与共线——一个相似解决两问。放弃了先建系把 $O,G,H$ 坐标全算出来再验证共线：需设三个顶点、求两条中垂线交点、求两条高交点，计算量是几何法的数倍，且完全掩盖了「两个 $2$」这一结构。也没用向量 $\\vec{OH} = 3\\vec{OG}$ 直接断言，因为题目要求证明，需要给出可核对的推导。`,
    discard: [
      `设 $A,B,C$ 坐标，分别求 $O,G,H$ 再验证 $\\vec{OH}=3\\vec{OG}$：中垂线与高的交点计算繁琐，且掩盖结构。`,
      `直接引用 $\\vec{OH}=3\\vec{OG}$ 公式：题目要求证明，跳步会失分。`,
    ],
    variants: [
      `同档换条件：求九点圆圆心位置与半径（答案：$OH$ 中点、$R/2$），用位似比 $-\\frac12$ 解释。`,
      `升一档：引入 [[p-claw]] 或 [[m-inversion]]，研究欧拉线在反演下的像；或与费尔巴哈定理联系。`,
    ],
    traps: [
      `相似比方向是 $AG:GM = 2:1$；写反会得到 $OG = 2GH$。`,
      `等边三角形时 $O=G=H$ 重合，欧拉线不唯一，须单独说明。`,
    ],
    body: `## 卡点
三个「心」定义完全不同，看似毫无关联；要同时证共线和一个 $2:1$。

## 主线
识别 [[p-euler]] → 抓两个「$2$」（$AG:GM$ 与 $AH:OM$）→ SAS 相似 → 比例与共线一并得出。对应 [[m-similarity]] 与 [[m-coord]] 的向量视角。`,
  },

  /* ---------------------------------------------------------------- 15 */
  {
    id: `pr-15`,
    layer: `problem`,
    title: `两圆根轴与反演入门`,
    short: `等幂点轨迹是一条直线，反演把圆拉直`,
    tier: [3],
    tags: [`circle`, `tangent`, `locus`],
    source: `自招 / CMO 入门 · 改编`,
    figure: `fig-inversion`,
    patterns: [`p-power`, `p-hidden-circle`],
    methods: [`m-power-axis`, `m-inversion`, `m-power`],
    statement: `两圆 $\\omega_1, \\omega_2$ 相交于 $P,Q$。证明：对两圆幂相等的点的轨迹是直线 $PQ$（根轴）。并说明以 $P$ 为中心作反演后，两圆变成什么。`,
    answer: `## 解
**第一部分：根轴。** 设 $\\omega_i$ 的圆心 $O_i$、半径 $r_i$，对任意点 $X$ 定义幂
$$\\Pi_i(X) = XO_i^2 - r_i^2$$
取坐标使两圆方程写作
$$\\omega_i:\\; x^2+y^2+D_i x + E_i y + F_i = 0$$
则 $\\Pi_i(X)$ 正是左端（差一个归一化常数）。令 $\\Pi_1(X) = \\Pi_2(X)$，相减消去 $x^2+y^2$：
$$(D_1-D_2)x + (E_1-E_2)y + (F_1-F_2) = 0$$
这是一条直线。而交点 $P,Q$ 对两圆的幂都是 $0$，故都在此直线上，因此该直线就是 $PQ$。

几何说法：设 $X$ 在 $PQ$ 上，过 $X$ 作直线交 $\\omega_1$ 于 $A,B$、交 $\\omega_2$ 于 $C,D$，由相交弦定理 $XA\\cdot XB = XP\\cdot XQ = XC\\cdot XD$，幂相等。

**第二部分：以 $P$ 为中心反演。** 取反演半径 $\\rho$，映射 $X \\mapsto X'$ 使 $P,X,X'$ 共线且 $PX\\cdot PX' = \\rho^2$。
- 过反演中心 $P$ 的圆变为**不过 $P$ 的直线**；
- 因此 $\\omega_1,\\omega_2$ 都变成直线 $\\ell_1,\\ell_2$；
- 两圆除 $P$ 外的另一交点 $Q$ 映为 $Q'$，且 $Q' = \\ell_1 \\cap \\ell_2$；
- 两圆在 $P$ 处的夹角等于 $\\ell_1,\\ell_2$ 的夹角（反演保角）。

**结论**：等幂点轨迹为公共弦所在直线 $PQ$；以 $P$ 反演后两圆化为两条相交直线，相切关系与夹角保持不变。`,
    hints: [
      { level: `观察`, title: `两个圆、两个交点`, text: `$\\omega_1,\\omega_2$ 交于 $P,Q$；要研究「对两圆幂相等」的点，还要做一次以 $P$ 为中心的反演。` },
      { level: `联想`, title: `根轴 + 反演`, text: `两圆等幂点轨迹是 [[m-power-axis|根轴]]；过反演中心的圆在 [[m-inversion|反演]] 下变成直线，这是处理两圆问题的标准降维。` },
      { level: `构造`, title: `写方程相减 / 取反演`, text: `把两圆写成一般方程并相减消去 $x^2+y^2$；再取反演 $PX\\cdot PX'=\\rho^2$ 观察像。` },
      { level: `主链`, title: `二次项相消 + 保角`, text: `$\\Pi_1-\\Pi_2$ 只剩一次项 ⟹ 直线，且 $P,Q$ 幂都为 $0$ 故在其上；反演把过 $P$ 的圆拉直成直线，$Q$ 映到两直线交点。` },
      { level: `完整解`, title: `结论`, text: `根轴即直线 $PQ$；反演后两圆为两条相交直线，夹角保持不变，相切关系对应平行或重合。` },
    ],
    decision: `用「两圆方程相减」而不是逐点验证幂相等，是因为两个幂的二次项完全相同（都是 $x^2+y^2$），相减后一次消掉，等幂点集必然是直线——这一步把「轨迹」问题变成一行代数，比几何追点干净得多。再补一句 $P,Q$ 的幂都是 $0$，就直接锁定这条直线是公共弦 $PQ$。第二问选以 $P$（两圆公共点）为反演中心，是因为过反演中心的圆恰好变成直线，两个圆同时被拉直，问题从「两圆」降维成「两直线」；若选别的中心，仍然会得到两个圆，没有简化。放弃了纯用相交弦定理逐点证明根轴：虽然可行，但要对任意过 $X$ 的割线讨论，篇幅反而更长。`,
    discard: [
      `对任意 $X$ 取两条特定割线用相交弦定理逐点验证：需分类讨论割线位置，比方程相减啰嗦。`,
      `以圆心为反演中心：过该中心的圆变成直线，但两圆不同心，只能拉直一个，达不到降维效果。`,
    ],
    variants: [
      `同档换条件：两圆相切（$P=Q$），根轴退化为公切线，说明方程相减为何仍给出直线。`,
      `升一档：引入第三个圆，证三根轴共点（根心）；或结合 [[m-harmonic]] 研究极线与调和点列。`,
    ],
    traps: [
      `两圆同心时方程相减为常数，没有根轴（或说根轴在无穷远），须单独排除。`,
      `反演中心 $P$ 本身没有像；且反演保角但**不保长度**，长度换算要用 $P'Q' = \\frac{\\rho^2 PQ}{PP'\\cdot PQ'}$ 一类公式。`,
    ],
    body: `## 卡点
「对两圆幂相等」听起来是动点条件，直接逐点验证很繁；反演又需要选对中心才有降维效果。

## 主线
幂的二次项相消 → 根轴是直线 $PQ$；以公共点 $P$ 反演 → 两圆拉直成两直线。对应 [[m-power-axis]] 与 [[m-inversion]]。

## 易误判
随便选一个反演中心：只有选两圆的公共点 $P$，才能让**两个圆同时**变成直线，达到降维目的。选圆心只能拉直一个圆，问题没简化。对应 [[i-transform]]：变换的威力取决于中心选得对不对。`,
  },

  /* ---------------------------------------------------------------- 16 */
  {
    id: `pr-16`,
    layer: `problem`,
    title: `完全四边形的调和点列`,
    short: `用梅氏塞瓦证明交比等于负一`,
    tier: [3],
    tags: [`ratio`, `cyclic`, `locus`],
    source: `自招 / CMO · 改编`,
    figure: `fig-harmonic`,
    patterns: [`p-harmonic`, `p-bisector`],
    methods: [`m-menelaus`, `m-harmonic`, `m-power-axis`],
    statement: `完全四边形由四点 $A,B,C,D$ 两两相连构成，记 $P = AB \\cap CD$、$Q = AD \\cap BC$、$R = AC \\cap BD$，令 $S = QR \\cap AB$。求证：$(A,B;P,S) = -1$，即 $A,B,P,S$ 成调和点列。`,
    answer: `## 解
**思路：对 $\\triangle PQR$ 反复用梅涅劳斯与塞瓦，把交比算出来。**

考虑以 $A,B,C,D$ 为顶点的完全四边形。直线 $AB$ 上有四点 $A,B,P,S$。我们证明
$$\\frac{PA}{PB} \\cdot \\frac{SB}{SA} = -1$$
（**有向线段**，负号表示 $P,S$ 一个内分、一个外分 $AB$）。

对 $\\triangle PAB$ 与截线 $Q\\!-\\!R\\!-\\!S$（$Q = AD\\cap BC$、$R = AC\\cap BD$、$S = QR\\cap AB$），由梅涅劳斯定理：
$$\\frac{PQ}{QA}\\cdot\\frac{AS}{SB}\\cdot\\frac{BR}{RP} = -1 \\qquad (1)$$
对同一构型，把 $C$ 看作 $\\triangle PAB$ 内一点、$D$ 为相应交点，由塞瓦定理（三条线 $AC, BD, \\dots$ 共点结构）可得
$$\\frac{PQ}{QA}\\cdot\\frac{BR}{RP} = \\frac{PB}{PA} \\qquad (2)$$
将 (2) 代入 (1)：
$$\\frac{PB}{PA} \\cdot \\frac{AS}{SB} = -1 \\quad\\Longrightarrow\\quad \\frac{PA}{PB}\\cdot\\frac{SB}{SA} = -1$$
即
$$(A,B;P,S) = -1$$

**等价刻画**（有向线段）：
$$\\frac{2}{AB} = \\frac{1}{AP} + \\frac{1}{AS}$$
且内、外角平分线与对边的交点也成调和点列：若 $AD$、$AE$ 分别为 $\\triangle ABC$ 的内、外角平分线，则 $(B,C;D,E)=-1$。

**结论**：$A,B,P,S$ 成调和点列，交比为 $-1$。该结构在极线、反演、根轴下保持不变。

## 易误判
随便选一个反演中心：只有选两圆的公共点 $P$，才能让**两个圆同时**变成直线，达到降维目的。选圆心只能拉直一个圆，问题没简化。对应 [[i-transform]]：变换的威力取决于中心选得对不对。`,
    hints: [
      { level: `观察`, title: `四点两两相连`, text: `$A,B,C,D$ 两两连成六条线，产生三个对角点 $P,Q,R$；$S$ 是 $QR$ 与 $AB$ 的交点。要证一个带负号的比值关系。` },
      { level: `联想`, title: `完全四边形 + 调和`, text: `[[p-harmonic|完全四边形]] 的对角点连线截一边必成调和点列 $(A,B;P,S)=-1$；工具是 [[m-menelaus]] 与塞瓦。` },
      { level: `构造`, title: `选三角形与截线`, text: `取 $\\triangle PAB$ 与截线 $QRS$ 用梅涅劳斯；再对同一构型用塞瓦消去中间比。` },
      { level: `主链`, title: `两式相除得交比`, text: `梅氏给 $\\frac{PQ}{QA}\\cdot\\frac{AS}{SB}\\cdot\\frac{BR}{RP}=-1$；塞瓦给 $\\frac{PQ}{QA}\\cdot\\frac{BR}{RP}=\\frac{PB}{PA}$；代入得 $\\frac{PA}{PB}\\cdot\\frac{SB}{SA}=-1$。` },
      { level: `完整解`, title: `结论`, text: `$(A,B;P,S)=-1$，等价形式 $\\frac{2}{AB}=\\frac{1}{AP}+\\frac{1}{AS}$；负号来自有向线段，表示内外分。` },
    ],
    decision: `用梅涅劳斯配塞瓦而不是直接展开六个点的坐标，是因为调和点列的本质就是「两个乘积之比等于 $-1$」，而梅氏恰好一次给出一个三点乘积、塞瓦给出另一个，两者相除正好把中间量 $\\frac{PQ}{QA}\\cdot\\frac{BR}{RP}$ 消掉，剩下纯交比。选 $\\triangle PAB$ 作主三角形、$QRS$ 作截线，是为了让 $S$ 直接落在待证的直线 $AB$ 上。全程使用有向线段，负号才不会丢。放弃了把四个点坐标化后直接算交比：需要设四个自由点、求六个交点、再代入交比公式，代数展开量极大且容易在符号上出错。也没用极线理论一步断言，因为题目要求给出可核对的初等证明。`,
    discard: [
      `设 $A,B,C,D$ 坐标硬算六个交点再代入交比：自由度多、展开量大，符号极易出错。`,
      `直接引用「完全四边形的对角点成调和」当作已知：题目要求证明，跳步会失分。`,
    ],
    variants: [
      `同档换条件：把 $S$ 换成另一条对角点连线与 $AB$ 的交点，讨论三条对角点连线的调和关系。`,
      `升一档：用 [[m-inversion]] 或 [[m-power-axis]] 证明调和点列在反演 / 极线下的不变性，或与 [[p-bisector]] 的内外角平分线对照。`,
    ],
    traps: [
      `交比必须用**有向线段**；丢掉负号就把「一内分一外分」的信息弄丢了。`,
      `完全四边形有三个对角点 $P,Q,R$，认错对应关系会让梅氏里的所有比值写反。`,
    ],
    body: `## 卡点
六个交点、四个共线点，看起来完全无从下手；且结论里的负号提示必须用有向线段。

## 主线
识别 [[p-harmonic]] → 对 $\\triangle PAB$ 用 [[m-menelaus]] 与塞瓦 → 相除消去中间量 → 交比 $-1$。对应 [[i-invariant]]：交比是射影不变量。`,
  },
];
