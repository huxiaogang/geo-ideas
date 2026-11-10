window.PATTERNS = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: `p-hand`,
    layer: `pattern`,
    title: `手拉手（共顶点等腰旋转）`,
    short: `两组等腰共顶点，绕该点旋转即得全等`,
    tier: [1, 2, 3],
    tags: [`rotate`, `equal-len`, `prove-equal`],
    figure: `fig-hand-in-hand`,
    signals: [
      `两个等腰三角形共用同一个顶点`,
      `顶角相等或能凑成相等，如 $\\angle BAC = \\angle DAE$`,
      `要证两条线段相等或求两线夹角`,
    ],
    identify: `看到 $AB=AC$、$AD=AE$ 且两顶角共顶点，立刻找 $\\triangle ABD \\cong \\triangle ACE$。`,
    action: `把 $\\triangle ABD$ 绕 $A$ 旋转 $\\angle BAC$ 到 $\\triangle ACE$，连 $BD$、$CE$ 造全等。`,
    conclusions: [
      `$BD = CE$`,
      `$BD$ 与 $CE$ 的夹角等于旋转角`,
      `交点 $P$ 满足 $\\angle BPC = \\angle BAC$，$AP$ 平分对应角`,
    ],
    gen: [`rotate`],
    tools: [`m-congruence`, `m-homothety`, `m-similarity`],
    traps: [
      `顶角不等时只能得到旋转相似，不能写全等；此时边长成比例而不相等`,
      `旋转中心必须是两组等长线段的公共端点，错认中心会导致对应边全错`,
    ],
    related: [`m-homothety`, `i-transform`, `pr-01`],
    body: `## 识别信号
图里出现两组等长线段共用一个端点：$AB=AC$、$AD=AE$，且 $\\angle BAC = \\angle DAE$。这就是两个等腰三角形「手拉手」。要证的往往是 $BD=CE$ 这类跨两个三角形的线段相等。

## 第一步动作
连 $BD$、$CE$，把 $\\triangle ABD$ 绕 $A$ 旋转 $\\angle BAC$。

## 为什么成立
旋转把 $A$ 固定，$B \\to C$（因 $AB=AC$、夹角为旋转角），$D \\to E$（因 $AD=AE$ 且 $\\angle BAD = \\angle CAE$）。于是 $BD \\to CE$，旋转保距故
$$BD = CE$$
又因 $BD$ 与 $CE$ 是同一旋转下的对应线段，其夹角恒等于旋转角。设 $P = BD \\cap CE$，由四点共圆或导角可得 $\\angle BPC = \\angle BAC$。

## 三档视角
- **培优**：顶角相等、两组等腰，直接 SAS 全等，得 $BD=CE$。
- **联赛**：顶角不等时改用旋转相似，$\\triangle ABD \\sim \\triangle ACE$，得 $BD/CE = AB/AC$，并求定角。
- **自招 / CMO**：把两组等腰推广到三个共顶点相似形，或求交点 $P$ 的轨迹（常是一段圆弧），与 [[p-hidden-circle]] 合用。

## 典型误用
把「两组线段相等」当成手拉手：若四个端点不共顶点，旋转中心不存在，此时应改走 [[m-congruence]] 或翻折。`,
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: `p-half-angle`,
    layer: `pattern`,
    title: `半角模型`,
    short: `正方形内 45 度角，旋转拼出线段和差`,
    tier: [1, 2, 3],
    tags: [`sum-seg`, `equal-len`, `rotate`],
    figure: `fig-half-angle`,
    signals: [
      `正方形（或正多边形）内有一个角等于顶角的一半`,
      `角的两边分别交在相邻两条边上`,
      `要证一条线段等于另两条线段之和，如 $EF=BE+DF$`,
    ],
    identify: `看到正方形 $ABCD$ 内 $\\angle EAF = 45^\\circ$，立刻把 $\\triangle ABE$ 绕 $A$ 转 $90^\\circ$。`,
    action: `把 $\\triangle ABE$ 绕 $A$ 逆时针转 $90^\\circ$ 到 $\\triangle ADG$（$G$ 在 $CD$ 延长线上），连 $FG$。`,
    conclusions: [
      `$EF = BE + DF$`,
      `$\\triangle AEF \\cong \\triangle AGF$`,
      `$S_{\\triangle AEF} = S_{\\triangle ABE} + S_{\\triangle ADF}$`,
    ],
    gen: [`rotate`, `complete`],
    tools: [`m-congruence`, `m-area`],
    traps: [
      `旋转方向必须把 $BE$ 转到 $CD$ 的延长线上，转反了拼不出共线三段`,
      `$\\angle EAF = 45^\\circ$ 的前提是顶角 $90^\\circ$；顶角改为 $60^\\circ$ 时结论要重新推导`,
    ],
    related: [`i-reduce`, `i-complete`, `pr-02`],
    body: `## 识别信号
正方形 $ABCD$，$E$ 在 $BC$、$F$ 在 $CD$，且 $\\angle EAF = 45^\\circ$（顶角的一半）。要证的结论形如「一段 = 两段之和」。

## 第一步动作
把 $\\triangle ABE$ 绕 $A$ 逆时针旋转 $90^\\circ$ 到 $\\triangle ADG$，使 $B \\to D$、$E \\to G$，$G$ 落在 $CD$ 的延长线上。

## 为什么成立
旋转给出 $AG = AE$、$DG = BE$、$\\angle DAG = \\angle BAE$。于是
$$\\angle GAF = \\angle GAD + \\angle DAF = \\angle BAE + \\angle DAF = 90^\\circ - 45^\\circ = 45^\\circ = \\angle EAF$$
又 $AF$ 公共，故 $\\triangle AEF \\cong \\triangle AGF$（SAS），从而
$$EF = GF = GD + DF = BE + DF$$

## 三档视角
- **培优**：记住「截长补短 + 旋转 90°」，直接套 $EF=BE+DF$。
- **联赛**：把 $45^\\circ$ 换成一般角 $\\alpha$，或求 $\\triangle CEF$ 周长的最小值；常与最值结合。
- **自招 / CMO**：推广到正三角形、正 $n$ 边形内的定角，用复数或 [[m-trig]] 统一处理，与 [[p-ptolemy]] 有深层联系。

## 典型误用
见到「线段和」就截长补短却不旋转：不把 $BE$ 搬到与 $DF$ 共线的位置，三段无法相加。`,
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: `p-three-equal`,
    layer: `pattern`,
    title: `一线三等角`,
    short: `同一直线上三个等角，连出相似三角形链`,
    tier: [1, 2],
    tags: [`equal-angle`, `parallel`, `ratio`],
    figure: `fig-three-equal`,
    signals: [
      `同一直线上有三个点，各向同侧发出一条射线`,
      `三个角相等，常标为 $\\alpha$ 或都是 $60^\\circ$、$90^\\circ$`,
      `要求线段比例或证明两三角形相似`,
    ],
    identify: `看到 $\\angle DBP = \\angle DPE = \\angle ECP$，立刻判 $\\triangle BDP \\sim \\triangle CPE$。`,
    action: `标出中间角，用 $\\angle DPB = 180^\\circ - \\alpha - \\angle BDP$ 导角，写出相似对应边。`,
    conclusions: [
      `$\\triangle BDP \\sim \\triangle CPE$`,
      `$BD \\cdot CE = BP \\cdot CP$`,
      `$\\angle DPE = \\angle DBP$ 时 $DP \\perp$ 相关线（视具体构型）`,
    ],
    gen: [`complete`],
    tools: [`m-similarity`, `m-coord`],
    traps: [
      `三个角必须是「同侧、同顶点顺序」的相等角，错一个顶点相似对应就全反`,
      `$\\alpha = 90^\\circ$ 时退化成「一线三垂直」，是它的特例而非新模型`,
    ],
    related: [`p-hand`, `m-similarity`, `pr-04`],
    body: `## 识别信号
$B, P, C$ 共线，$D$、$E$ 在同侧，$\\angle DBP = \\angle DPE = \\angle ECP = \\alpha$。这是相似三角形最常见的「出厂设置」之一。

## 第一步动作
在 $\\triangle BDP$ 与 $\\triangle CPE$ 中导角：由 $\\angle DPB + \\angle DPE + \\angle EPC = 180^\\circ$ 得
$$\\angle DPB = 180^\\circ - \\alpha - \\angle EPC$$
而 $\\triangle CPE$ 中 $\\angle CEP = 180^\\circ - \\alpha - \\angle EPC$，故 $\\angle DPB = \\angle CEP$。

## 为什么成立
两角对应相等，$\\triangle BDP \\sim \\triangle CPE$，于是
$$\\frac{BD}{CP} = \\frac{BP}{CE} \\quad\\Longrightarrow\\quad BD \\cdot CE = BP \\cdot CP$$

## 三档视角
- **培优**：识别三等角，直接写相似比。
- **联赛**：与中点、动点结合，先由相似设未知量再列方程；常与 [[m-coord]] 互相验证。
- **自招**：三等角推广为「等角线」或等腰梯形中的定角链，可用三角函数统一表达。

## 典型误用
只看见两个等角就判相似，忽略第三个角必须落在同一直线的同侧。`,
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: `p-double-median`,
    layer: `pattern`,
    title: `倍长中线`,
    short: `延长中线一倍，造出平行四边形`,
    tier: [1, 2],
    tags: [`mid`, `midpoint-line`, `prove-equal`],
    figure: `fig-double-median`,
    signals: [
      `题干出现「$M$ 为 $BC$ 中点」或「$AD$ 是中线」`,
      `要证两条线段相等、平行，或证角相等`,
      `已知条件分散在三角形两侧，需要搬到一起`,
    ],
    identify: `看到中点 + 要证相等，立刻延长中线一倍造平行四边形。`,
    action: `延长 $AM$ 到 $D$ 使 $MD = AM$，连 $BD$、$CD$。`,
    conclusions: [
      `$ABDC$ 为平行四边形，$AB \\parallel CD$ 且 $AB = CD$`,
      `$\\triangle ABM \\cong \\triangle DCM$`,
      `$AD = 2AM$，$BD = AC$`,
    ],
    gen: [`complete`, `rotate`],
    tools: [`m-congruence`, `m-similarity`],
    traps: [
      `必须延长「过中点的那条线段」一倍，随便延长别的线段不产生平行四边形`,
      `倍长后对应关系是 $AB \\leftrightarrow CD$，写反会导致全等判据错`,
    ],
    related: [`p-midline`, `i-complete`, `pr-03`],
    body: `## 识别信号
$M$ 是 $BC$ 中点，$A$ 为三角形顶点，条件或结论里出现「分散」「相等」「范围」。

## 第一步动作
延长 $AM$ 到 $D$，使 $MD = AM$，连 $BD$、$CD$。

## 为什么成立
$BM = MC$、$AM = MD$，且 $\\angle AMB = \\angle DMC$（对顶角），故 $\\triangle AMB \\cong \\triangle DMC$（SAS）。于是 $AB = CD$ 且 $\\angle ABM = \\angle DCM$，得 $AB \\parallel CD$。四边形 $ABDC$ 两条对角线互相平分，故为平行四边形。

这样把 $AB$ 搬到 $CD$、把 $\\angle B$ 搬到 $\\angle C$，原本分散的条件并到同一个三角形里。典型应用是中线范围：在 $\\triangle ABD$ 中 $AD < AB + BD = AB + AC$，即
$$AM < \\frac{AB + AC}{2}$$

## 三档视角
- **培优**：直接套「倍长造全等」，证相等与不等。
- **联赛**：与中点、比例结合，倍长后接 [[m-similarity]] 或梅氏定理。
- **自招**：倍长可视为以 $M$ 为中心的中心对称（旋转 $180^\\circ$），与 [[m-coord]] 的中点公式同构。`,
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: `p-midline`,
    layer: `pattern`,
    title: `中位线`,
    short: `两边中点连线，自带平行与一半`,
    tier: [1, 2],
    tags: [`mid`, `midpoint-line`, `parallel`],
    figure: `fig-midline`,
    signals: [
      `图形里出现两个及以上的中点`,
      `中点被连成一条线段`,
      `要证平行、求长度比，或需要把多条中点条件串起来`,
    ],
    identify: `看到两个中点被连起来，立刻写 $MN \\parallel BC$ 且 $MN = \\frac12 BC$。`,
    action: `找出两个中点所在的三角形第三边，连出中位线并标出 $1:2$ 与平行。`,
    conclusions: [
      `$MN \\parallel BC$，$MN = \\frac12 BC$`,
      `$\\triangle AMN \\sim \\triangle ABC$，相似比 $1:2$，面积比 $1:4$`,
      `多条中位线可拼出平行四边形或把四边形化为三角形`,
    ],
    gen: [`complete`, `homothety`],
    tools: [`m-similarity`, `m-congruence`],
    traps: [
      `中位线必须连接「两边中点」，连中点与顶点得到的是中线，不是中位线`,
      `多个中点并存时先数清哪两个属于同一个三角形，否则相似比会写错`,
    ],
    related: [`p-double-median`, `pr-05`],
    body: `## 识别信号
$M$、$N$ 分别是 $AB$、$AC$ 中点，或题干一次给出多个中点。

## 第一步动作
连 $MN$，认定它与第三边 $BC$ 平行且为其一半。

## 为什么成立
以 $A$ 为中心、比 $1/2$ 位似：$B \\to M$、$C \\to N$，故 $MN \\parallel BC$ 且 $MN/BC = 1/2$。等价地由 $\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac12$ 与公共角得 $\\triangle AMN \\sim \\triangle ABC$。

## 三档视角
- **培优**：直接记「平行 + 一半」，用于求长度与证平行。
- **联赛**：多个中点联动，例如四边形四边中点成平行四边形（瓦里尼翁），或中位线与 [[m-area]] 结合求面积比。
- **自招**：中位线是位似的特例，可与 [[m-homothety]]、向量统一；梯形中位线与调和分割有关。

## 典型误用
把「中点连中点」当成中位线却找错第三边：必须先确认两个中点属于同一个三角形。`,
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: `p-bisector`,
    layer: `pattern`,
    title: `角平分线四定理`,
    short: `角平分线自带对称轴、比例与等距`,
    tier: [1, 2, 3],
    tags: [`bisect`, `ratio`, `prove-equal`],
    figure: `fig-bisector`,
    signals: [
      `题干出现「$AD$ 平分 $\\angle BAC$」或对称的角标`,
      `角平分线上有点，或要证两线段相等、两角相等`,
      `出现内切圆、内心、旁心`,
    ],
    identify: `看到角平分线，先沿它翻折：作双垂线、作平行线、对称造等腰，四定理挨个试。`,
    action: `从角平分线上的点向两边作垂线，或过该点作一边的平行线交另一边。`,
    conclusions: [
      `角平分线定理 $\\frac{BD}{DC} = \\frac{AB}{AC}$`,
      `角平分线上点到两边等距；内心 $I$ 到三边等距`,
      `内角平分线分对边成 $c:b$，且 $AI:ID = (b+c):a$`,
    ],
    gen: [`reflect`, `complete`],
    tools: [`m-congruence`, `m-similarity`, `m-area`],
    traps: [
      `内、外角平分线分点公式不同：外分是 $c:(-b)$，用错会得到负长度`,
      `$\\frac{BD}{DC} = \\frac{AB}{AC}$ 中 $D$ 必须在 $BC$ 线段上；外角平分线交在延长线上`,
    ],
    related: [`p-claw`, `m-area`, `pr-06`],
    body: `## 识别信号
$AD$ 平分 $\\angle BAC$，或图形上出现对称角标、内心 $I$、内切圆。

## 第一步动作
沿角平分线翻折：从 $D$（或角平分线上任一点）向 $AB$、$AC$ 作垂线，得一对全等直角三角形。

## 为什么成立
四条常用结论都由「对称轴」一次给出：
1. **等距**：角平分线上点到两边距离相等，故 $S_{ABD}/S_{ACD} = AB/AC$（同高不同底）。
2. **比例**：又 $S_{ABD}/S_{ACD} = BD/DC$（同高不同底），联立得 $\\frac{BD}{DC} = \\frac{AB}{AC}$。
3. **平行造等腰**：过 $D$ 作 $DE \\parallel AB$ 交 $AC$ 于 $E$，则 $\\angle EDA = \\angle DAB = \\angle DAE$，故 $AE = DE$。
4. **内心**：三条角平分线交于 $I$，$I$ 到三边等距即为内切圆圆心。

## 三档视角
- **培优**：用角平分线定理求分点长度。
- **联赛**：与面积法、[[p-claw]] 结合处理内心与外接圆；角平分线长公式 $AD^2 = bc - BD\\cdot DC$。
- **自招**：内、外角平分线与对边成调和点列 $(B,C;D,E) = -1$，接入 [[p-harmonic]]。`,
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: `p-right-mid`,
    layer: `pattern`,
    title: `直角三角形斜边中线`,
    short: `斜边中点就是外心，三条线段相等`,
    tier: [1, 2],
    tags: [`mid`, `perp`, `circle`],
    figure: `fig-right-mid`,
    signals: [
      `出现直角三角形或 $\\angle C = 90^\\circ$`,
      `斜边上有中点，或要证 $MA = MB = MC$`,
      `出现以斜边为直径的圆`,
    ],
    identify: `看到直角三角形 + 斜边中点，立刻连中点与直角顶点，得 $MA=MB=MC$。`,
    action: `取斜边 $AB$ 中点 $M$，连 $CM$，并写出 $M$ 为外心、$AB$ 为直径。`,
    conclusions: [
      `$MA = MB = MC = \\frac12 AB$`,
      `$M$ 是 $\\triangle ABC$ 的外心，$AB$ 为外接圆直径`,
      `$\\angle ACB = 90^\\circ$ 的充要条件是 $C$ 在以 $AB$ 为直径的圆上`,
    ],
    gen: [`circle`, `complete`],
    tools: [`m-congruence`, `m-cyclic`],
    traps: [
      `只有直角三角形才有此性质；一般三角形斜边中点不等距`,
      `逆用时要确认 $C$ 与 $M$ 的距离确实等于 $AB/2$，否则共圆不成立`,
    ],
    related: [`p-hidden-circle`, `pr-11`],
    body: `## 识别信号
$\\angle ACB = 90^\\circ$，$M$ 为 $AB$ 中点；或题干出现「以 $AB$ 为直径作圆」。

## 第一步动作
连 $CM$，写出 $MA = MB = MC$。

## 为什么成立
把 $\\triangle ABC$ 补成矩形 $ACBC'$，则 $AB$ 与 $CC'$ 是矩形的两条对角线，互相平分且相等，故 $M$ 为两者共同中点，$MC = \\frac12 CC' = \\frac12 AB$。于是 $A,B,C$ 都在以 $M$ 为心、$MA$ 为半径的圆上。

逆命题同样重要：若 $C$ 满足 $MC = MA$，则 $C$ 在以 $AB$ 为直径的圆上，由圆周角定理 $\\angle ACB = 90^\\circ$。这是「直角 ⇔ 共圆」的标准桥梁。

## 三档视角
- **培优**：直接用斜边中线求长度、证等腰。
- **联赛**：与 [[p-hidden-circle]] 合用，把「定直角」翻译成「点在定圆上」求轨迹与最值。
- **自招**：视为圆幂与直径的退化情形，为根轴、反演做铺垫。`,
  },

  /* ---------------------------------------------------------------- 8 */
  {
    id: `p-cyclic`,
    layer: `pattern`,
    title: `共圆四判定`,
    short: `对角互补、同侧张角相等、圆幂逆定理`,
    tier: [1, 2, 3],
    tags: [`cyclic`, `equal-angle`, `circle`],
    figure: `fig-cyclic`,
    signals: [
      `要证四点共圆，或要证两角相等却找不到全等`,
      `出现 $\\angle A + \\angle C = 180^\\circ$ 或同侧张角相等`,
      `出现两条线段乘积相等的形式`,
    ],
    identify: `看到「同侧两点对同线段张角相等」，立刻补出外接圆并搬角。`,
    action: `过其中三点作圆，证第四点在圆上；或直接用对角互补 / 同弧圆周角相等导角。`,
    conclusions: [
      `$\\angle ABC + \\angle CDA = 180^\\circ \\iff A,B,C,D$ 共圆`,
      `$\\angle ABD = \\angle ACD \\iff A,B,C,D$ 共圆（同侧张角相等）`,
      `共圆后同弧圆周角相等，角可沿圆周任意搬位`,
    ],
    gen: [`circle`, `complete`],
    tools: [`m-cyclic`, `m-power`, `m-similarity`],
    traps: [
      `「同侧张角相等」必须是两点在线段同侧；异侧相等对应的是对角互补的另一形式`,
      `共圆后搬角要认准同一条弧，跨弧搬角会得到补角`,
    ],
    related: [`p-ptolemy`, `p-power`, `pr-07`],
    body: `## 识别信号
题目要证四点共圆，或反复出现「角相等」却没有任何全等三角形可用。

## 第一步动作
过 $A,B,C$ 作圆，证 $D$ 在圆上（常用反证或同一法）；或直接验证 $\\angle ABC + \\angle CDA = 180^\\circ$。

## 为什么成立
四条判定等价：
1. 对角互补；
2. 同侧两点对同线段张角相等（$\\angle ABD = \\angle ACD$）；
3. 割线乘积 $PA\\cdot PB = PC\\cdot PD$ 的逆定理；
4. 托勒密等式 $AC\\cdot BD = AB\\cdot CD + BC\\cdot DA$ 的逆定理。

一旦共圆，同弧所对圆周角相等，角就能沿圆周「搬位」——这是圆题里最频繁的自由度。

## 三档视角
- **培优**：用对角互补判共圆，搬角证相等。
- **联赛**：与 [[p-power]]、[[p-ptolemy]] 联动，共圆后立刻联立乘积式。
- **自招**：共圆是交比取实值的几何表现，与 [[p-harmonic]]、[[m-inversion]] 同源。`,
  },

  /* ---------------------------------------------------------------- 9 */
  {
    id: `p-power`,
    layer: `pattern`,
    title: `圆幂三定理`,
    short: `相交弦、割线、切割线的乘积恒定`,
    tier: [1, 2, 3],
    tags: [`circle`, `tangent`, `ratio`],
    figure: `fig-power`,
    signals: [
      `图里有一个圆和圆内 / 圆外一点 $P$`,
      `从 $P$ 引出两条弦、两条割线或一切一割`,
      `要求线段长度，或出现 $PA\\cdot PB$ 形式的乘积`,
    ],
    identify: `看到圆外一点引切线与割线，立刻写 $PT^2 = PA\\cdot PB$。`,
    action: `连 $OP$、$OT$，标出 $PT \\perp OT$，把乘积全部换成 $PO^2 - r^2$。`,
    conclusions: [
      `相交弦 $PA\\cdot PB = PC\\cdot PD$`,
      `割线 $PA\\cdot PB = PC\\cdot PD$`,
      `切割线 $PT^2 = PA\\cdot PB = PO^2 - r^2$`,
    ],
    gen: [`circle`],
    tools: [`m-power`, `m-similarity`, `m-power-axis`],
    traps: [
      `$PA\\cdot PB$ 中 $PA$、$PB$ 必须是从同一点出发到两个交点的全长，不能只取弦内一段`,
      `切线长公式要求 $P$ 在圆外；圆内点没有实切线`,
    ],
    related: [`p-cyclic`, `m-power-axis`, `pr-08`],
    body: `## 识别信号
一个圆，加上一点 $P$ 引出两条线；或题干反复出现两条线段的乘积。

## 第一步动作
把 $P$ 到各交点的距离全部标出，写出「同一点出发的两段乘积相等」。

## 为什么成立
三定理是同一个量的三种写法：定义 $P$ 对圆 $O$ 的幂为 $\\Pi(P) = PO^2 - r^2$。
- 过 $P$ 的任一直线交圆于 $X,Y$，则 $PX\\cdot PY = |\\Pi(P)|$（有向线段时为 $\\Pi(P)$）。
- 相交弦、两割线都由此立得。
- 当 $PT$ 为切线，$YT=X$，故 $PT^2 = PA\\cdot PB$。

也可用相似证明：连 $AC$、$BD$，由 $\\angle PAC = \\angle PDB$ 得 $\\triangle PAC \\sim \\triangle PDB$，于是 $PA\\cdot PB = PC\\cdot PD$。

## 三档视角
- **培优**：套切割线定理求长度。
- **联赛**：与相似、共圆联动，用幂相等反推共圆或求比例。
- **自招**：两圆等幂点的轨迹是根轴，直接接入 [[m-power-axis]]；反演半径就是 $\\sqrt{|\\Pi(P)|}$。`,
  },

  /* ---------------------------------------------------------------- 10 */
  {
    id: `p-ptolemy`,
    layer: `pattern`,
    title: `托勒密定理`,
    short: `圆内接四边形的对角线乘积等于对边乘积之和`,
    tier: [2, 3],
    tags: [`cyclic`, `circle`, `sum-seg`],
    figure: `fig-ptolemy`,
    signals: [
      `圆内接四边形，且已知多条边长`,
      `要求对角线长度或证乘积式`,
      `出现「两条对角线」「四边」同时给出的条件`,
    ],
    identify: `看到圆内接四边形 $ABCD$，立刻写 $AC\\cdot BD = AB\\cdot CD + BC\\cdot DA$。`,
    action: `在对角线 $BD$ 上取点 $E$ 使 $\\angle BAE = \\angle CAD$，构造两次相似。`,
    conclusions: [
      `$AC\\cdot BD = AB\\cdot CD + BC\\cdot DA$`,
      `逆定理成立：满足该等式的凸四边形必共圆`,
      `退化到三点共线时给出 $AC\\cdot BD = AB\\cdot CD + BC\\cdot DA$ 的线段形式（欧拉不等式）`,
    ],
    gen: [`circle`, `complete`],
    tools: [`m-similarity`, `m-cyclic`, `m-trig`],
    traps: [
      `必须按「对角线乘积 = 两组对边乘积之和」配对，写错边会得到不成立的等式`,
      `四边形必须是凸的且顶点按顺序排列，交叉四边形不直接适用`,
    ],
    related: [`p-cyclic`, `pr-09`],
    body: `## 识别信号
$A,B,C,D$ 共圆，题目给出三边及一条对角线求另一条，或求证一个乘积和等式。

## 第一步动作
直接写出托勒密等式；若要证明，则在 $BD$ 上取 $E$ 使 $\\angle BAE = \\angle CAD$。

## 为什么成立
由 $\\angle BAE = \\angle CAD$ 与 $\\angle ABE = \\angle ACD$（同弧 $AD$）得 $\\triangle ABE \\sim \\triangle ACD$，故 $AB\\cdot CD = AC\\cdot BE$。
又 $\\triangle ABC \\sim \\triangle AED$（导角可得），故 $BC\\cdot DA = AC\\cdot ED$。两式相加：
$$AB\\cdot CD + BC\\cdot DA = AC(BE + ED) = AC\\cdot BD$$

## 三档视角
- **联赛**：已知三边一对角线求另一对角线；正多边形中与三角法互推（如 $\\sin$ 和角公式）。
- **自招**：托勒密不等式 $AC\\cdot BD \\le AB\\cdot CD + BC\\cdot DA$ 对任意四边形成立，取等即共圆；与反演、复数模长不等式同源。

## 典型误用
在非共圆四边形上套等式：此时只成立不等式，且方向不能反。`,
  },

  /* ---------------------------------------------------------------- 11 */
  {
    id: `p-fermat`,
    layer: `pattern`,
    title: `费马点`,
    short: `旋转 60 度把三线段和拉成一条直线`,
    tier: [2, 3],
    tags: [`extreme`, `rotate`, `sum-seg`],
    figure: `fig-fermat`,
    signals: [
      `求 $PA + PB + PC$ 的最小值`,
      `三角形三个内角都小于 $120^\\circ$`,
      `出现 $120^\\circ$ 角或正三角形构造`,
    ],
    identify: `看到「到三个定点距离之和最小」，立刻绕一个顶点旋转 $60^\\circ$ 造正三角形。`,
    action: `以 $BC$ 为边向外作正三角形 $BCE$，连 $AE$，则最小值即为 $AE$。`,
    conclusions: [
      `$\\min(PA+PB+PC) = AE$（$E$ 为向外正三角形顶点）`,
      `最优 $P$ 满足 $\\angle APB = \\angle BPC = \\angle CPA = 120^\\circ$`,
      `若有一内角 $\\ge 120^\\circ$，最小值在该钝角顶点取得`,
    ],
    gen: [`rotate`],
    tools: [`m-congruence`, `m-trig`, `m-coord`],
    traps: [
      `正三角形必须向三角形外侧作，向内作会得到错误的直线`,
      `$\\ge 120^\\circ$ 时费马点退化到顶点，不能再用 $120^\\circ$ 条件`,
    ],
    related: [`p-hand`, `p-hu-bu-gui`, `pr-12`],
    body: `## 识别信号
求一点 $P$ 使 $PA+PB+PC$ 最小，且 $\\triangle ABC$ 三个内角均小于 $120^\\circ$。

## 第一步动作
以 $BC$ 为边向外作正三角形 $BCE$，连 $AE$；$AE$ 与 $\\triangle BCE$ 外接圆的交点即费马点 $F$。

## 为什么成立
把 $\\triangle BPC$ 绕 $B$ 旋转 $60^\\circ$ 到 $\\triangle BP'C'$，则 $BP = BP'$ 且 $\\angle PBP' = 60^\\circ$，故 $\\triangle BPP'$ 为正三角形，$PP' = PB$。又 $P'C' = PC$。于是
$$PA + PB + PC = PA + PP' + P'C' \\ge AC'$$
折线拉直时取等，此时 $\\angle APB = \\angle BPC = \\angle CPA = 120^\\circ$。适当选取旋转中心可证 $AC' = AE$。

## 三档视角
- **联赛**：套「旋转 60° 拉直」，求最小值并给出取等条件。
- **自招**：用复数或向量统一处理加权和 $\\lambda_A PA + \\lambda_B PB + \\lambda_C PC$，与 [[p-apollonius]]、[[p-hu-bu-gui]] 同属「化折为直」家族。

## 典型误用
忽略 $\\ge 120^\\circ$ 的退化情形，仍去解 $120^\\circ$ 方程组。`,
  },

  /* ---------------------------------------------------------------- 12 */
  {
    id: `p-hidden-circle`,
    layer: `pattern`,
    title: `隐形圆`,
    short: `定角对定边、直角对直径，动点藏在圆上`,
    tier: [2, 3],
    tags: [`fixed-angle`, `locus`, `circle`],
    figure: `fig-hidden-circle`,
    signals: [
      `题干出现「$\\angle APB$ 为定值」或「$PA$ 为定长」`,
      `求动点 $P$ 的轨迹或最值`,
      `图形里看不到圆，但条件反复指向定长定角`,
    ],
    identify: `看到「定线段对定角」，立刻补出以该线段为弦的一段圆弧。`,
    action: `作 $\\triangle APB$ 的外接圆，用圆周角定理把定角翻译成定弧。`,
    conclusions: [
      `$\\angle APB = \\alpha$ 定值 $\\iff P$ 在过 $A,B$ 的一段圆弧上（另一段为 $180^\\circ-\\alpha$）`,
      `$\\angle APB = 90^\\circ \\iff P$ 在以 $AB$ 为直径的圆上`,
      `定长 $PA = r \\iff P$ 在以 $A$ 为心、$r$ 为半径的圆上`,
    ],
    gen: [`circle`, `complete`],
    tools: [`m-cyclic`, `m-coord`, `m-trig`],
    traps: [
      `定角对应两段弧：同侧为 $\\alpha$、异侧为 $180^\\circ - \\alpha$，漏掉一段会漏解`,
      `$\\alpha = 90^\\circ$ 时两段弧合成整圆，是最常用的特例`,
    ],
    related: [`p-right-mid`, `p-apollonius`, `pr-11`],
    body: `## 识别信号
题目没有画圆，却出现「定角」「定长」「求轨迹」「求最值」。

## 第一步动作
把不变量翻译成圆：过 $A,B,P$ 作外接圆，用圆周角定弧。

## 为什么成立
同弧所对圆周角相等，故对定线段 $AB$ 张定角 $\\alpha$ 的点 $P$ 必落在两段对称的圆弧上；圆心在 $AB$ 中垂线上，半径
$$R = \\frac{AB}{2\\sin\\alpha}$$
$\\alpha = 90^\\circ$ 时 $R = AB/2$，即 [[p-right-mid]]。另一段弧上的张角为 $180^\\circ - \\alpha$，务必分类。

定长情形更直接：$PA = r$ 即以 $A$ 为心的圆。定比 $PA/PB = k$ 则是 [[p-apollonius]]。

## 三档视角
- **联赛**：把「求最值」转成「圆上一点到定点距离的最值」，连心线一穿即得。
- **自招**：与根轴、反演合用；定角条件在反演下变成定圆，是处理圆族的标准手段。

## 典型误用
只画一段弧：动点若可跨到线段另一侧，必须补上补角弧。`,
  },

  /* ---------------------------------------------------------------- 13 */
  {
    id: `p-apollonius`,
    layer: `pattern`,
    title: `阿氏圆`,
    short: `到两定点距离之比为定值，轨迹是一个圆`,
    tier: [2, 3],
    tags: [`ratio`, `locus`, `extreme`],
    figure: `fig-apollonius`,
    signals: [
      `题干出现 $PA/PB = k$（$k \\ne 1$）`,
      `求 $\\lambda PA + PB$ 这类加权和的最值`,
      `动点到两定点距离成定比`,
    ],
    identify: `看到 $PA = k\\cdot PB$ 且 $k\\ne1$，立刻用内分点、外分点作直径画圆。`,
    action: `取 $AB$ 的内分点 $I$ 与外分点 $X$（均按 $k:1$），以 $IX$ 为直径作圆。`,
    conclusions: [
      `$PA/PB = k$ 的轨迹是以 $IX$ 为直径的圆（阿波罗尼斯圆）`,
      `$k=1$ 时退化为 $AB$ 的中垂线`,
      `$\\lambda PA + PB$ 可借阿氏圆把 $\\lambda PA$ 换成到另一点的距离，化折为直`,
    ],
    gen: [`circle`, `homothety`],
    tools: [`m-similarity`, `m-coord`, `m-trig`],
    traps: [
      `$k = 1$ 不是圆而是直线，必须单独处理`,
      `内分点按 $k/(1+k)$、外分点按 $k/(k-1)$，写反会导致圆心位置错`,
    ],
    related: [`p-hu-bu-gui`, `p-hidden-circle`, `pr-10`],
    body: `## 识别信号
$PA/PB = k$ 为定值且 $k \\ne 1$；或题目求 $\\lambda PA + PB$ 的最小值。

## 第一步动作
在 $AB$ 上取内分点 $I$、外分点 $X$，使 $IA/IB = XA/XB = k$，以 $IX$ 为直径作圆。

## 为什么成立
$PI$、$PX$ 分别是 $\\angle APB$ 的内、外角平分线（角平分线定理的逆用），故 $\\angle IPX = 90^\\circ$，由 [[p-right-mid]] 知 $P$ 在以 $IX$ 为直径的圆上。反之圆上任一点都满足定比。

设 $AB = c$，则圆心 $O$ 在 $AB$ 延长线上，$OA = \\frac{k^2 c}{k^2-1}$、半径 $r = \\frac{kc}{|k^2-1|}$。

加权和最值：取 $k = 1/\\lambda$，把 $\\lambda PA = PB'$ 转化为到新定点 $B'$ 的距离，则 $\\lambda PA + PB = PB' + PB \\ge BB'$。

## 三档视角
- **联赛**：直接画阿氏圆求轨迹与最值。
- **自招**：阿氏圆是反演下不过中心的直线之像，与 [[m-inversion]]、[[m-power-axis]] 统一。`,
  },

  /* ---------------------------------------------------------------- 14 */
  {
    id: `p-hu-bu-gui`,
    layer: `pattern`,
    title: `胡不归`,
    short: `加权线段和，用正弦或阿氏圆化折为直`,
    tier: [2, 3],
    tags: [`extreme`, `sum-seg`, `ratio`],
    figure: `fig-fermat`,
    signals: [
      `求 $PA + k\\cdot PB$ 或 $k\\cdot PA + PB$ 的最小值（$0<k<1$）`,
      `动点在一条直线（常为射线或坐标轴）上`,
      `题干带「速度不同」「用时最短」的实际背景`,
    ],
    identify: `看到 $PA + k\\cdot PB$（$k<1$），立刻把 $k\\cdot PB$ 换成一条垂线段。`,
    action: `作射线使 $\\sin\\theta = k$，把 $k\\cdot PB$ 写成 $P$ 到该射线的垂距，再化折为直。`,
    conclusions: [
      `$\\min(PA + k\\cdot PB)$ 在「垂线段 + 直线段」拉直时取得`,
      `等价于阿氏圆转化：取 $k=1/\\lambda$ 把加权项换成到新定点的距离`,
      `取等点满足入射角等于 $\\arccos k$（光学反射形式）`,
    ],
    gen: [`reflect`, `homothety`],
    tools: [`m-trig`, `m-similarity`, `m-coord`],
    traps: [
      `$\\sin\\theta = k$ 要求 $0<k<1$；$k>1$ 时先提取系数化为标准形`,
      `取等点必须落在动点允许的范围（射线 / 线段）内，否则在端点取最值`,
    ],
    related: [`p-apollonius`, `p-fermat`, `pr-10`],
    body: `## 识别信号
求 $PA + k\\cdot PB$（$0<k<1$）最小，$P$ 在一条定直线上运动；或「两段速度不同求最短时间」。

## 第一步动作
过 $B$ 作射线 $BM$ 使 $\\sin\\angle(BM, \\text{定直线}) = k$（或在 $P$ 所在直线的同侧作角 $\\theta$ 满足 $\\sin\\theta = k$），从 $P$ 向该射线作垂线 $PH$，则 $PH = k\\cdot PB$。

## 为什么成立
于是
$$PA + k\\cdot PB = PA + PH \\ge AH_{\\text{垂足}} \\ge A\\text{ 到射线 }BM\\text{ 的距离}$$
两步都是「两点之间线段最短 / 点到直线垂线段最短」，拉直时取等，此时 $A,P,H$ 共线。

另一条等价路径：取 $\\lambda = 1/k > 1$，用 [[p-apollonius]] 把 $k\\cdot PB$ 变成到新定点 $B'$ 的距离 $PB'$，则 $PA + PB' \\ge AB'$。

## 三档视角
- **联赛**：套「作角 + 作垂线」求最值，注意验证取等点在范围内。
- **自招**：与费马点、阿氏圆归为同一族「加权距离和」，可用凸分析或复数统一。`,
  },

  /* ---------------------------------------------------------------- 15 */
  {
    id: `p-claw`,
    layer: `pattern`,
    title: `鸡爪定理`,
    short: `弧中点到内心与两顶点等距`,
    tier: [3],
    tags: [`circle`, `bisect`, `prove-equal`],
    figure: `fig-chicken-claw`,
    signals: [
      `图形里有三角形外接圆与内心 $I$`,
      `角平分线延长交外接圆于弧中点 $M$`,
      `要证 $MB = MC = MI$`,
    ],
    identify: `看到 $AI$ 延长交外接圆于 $M$，立刻写 $MB = MC = MI$。`,
    action: `连 $MB$、$MC$、$MI$、$BI$，用导角证明 $\\triangle MBI$ 等腰。`,
    conclusions: [
      `$MB = MC = MI$（$M$ 为不含 $A$ 的弧 $BC$ 中点）`,
      `$M$ 是 $\\triangle BIC$ 的外心`,
      `$MI \\perp$ 相关弦时给出内心与旁心的对称关系`,
    ],
    gen: [`circle`],
    tools: [`m-cyclic`, `m-congruence`, `m-trig`],
    traps: [
      `$M$ 必须是不含 $A$ 的弧中点，取另一弧中点会得到不同结论`,
      `证明依赖 $\\angle MBI = \\angle MIB$ 的导角，漏掉 $\\angle IBC = B/2$ 会断链`,
    ],
    related: [`p-bisector`, `p-euler`, `pr-13`],
    body: `## 识别信号
$\\triangle ABC$ 外接圆上有弧中点 $M$，$I$ 为内心，$AI$ 过 $M$；题目要证几段相等或求角度。

## 第一步动作
连 $MB$、$MC$、$MI$、$BI$，标出 $\\angle MBI$ 与 $\\angle MIB$。

## 为什么成立
$MB = MC$ 由等弧立得。导角：
$$\\angle MBI = \\angle MBC + \\angle CBI = \\angle MAC + \\frac{B}{2} = \\frac{A}{2} + \\frac{B}{2}$$
$$\\angle MIB = \\angle IAB + \\angle IBA = \\frac{A}{2} + \\frac{B}{2}$$
（外角定理用于 $\\triangle ABI$）。两角相等，故 $MB = MI$。于是 $MB = MC = MI$，$M$ 是 $\\triangle BIC$ 的外心——这正是「鸡爪」形状的来源。

## 三档视角
- **联赛**：作为内心与外接圆的标准引理，常藏在压轴题中间步骤。
- **自招**：推广到旁心、到弧中点与 [[p-euler]] 的九点圆；用反演可把鸡爪变成直线上的等距点列。`,
  },

  /* ---------------------------------------------------------------- 16 */
  {
    id: `p-euler`,
    layer: `pattern`,
    title: `欧拉线`,
    short: `外心、重心、垂心共线，且 GH = 2OG`,
    tier: [3],
    tags: [`mid`, `perp`, `circle`],
    figure: `fig-euler-line`,
    signals: [
      `图形里同时出现外心 $O$、重心 $G$、垂心 $H$`,
      `要证三点共线或求 $OG:GH$`,
      `出现九点圆、中位线三角形`,
    ],
    identify: `看到 $O,G,H$ 同时出现，立刻写 $G$ 在 $OH$ 上且 $GH = 2OG$。`,
    action: `连 $OH$，取 $BC$ 中点 $M$，证 $\\triangle AHG \\sim \\triangle MOG$（相似比 $2:1$）。`,
    conclusions: [
      `$O,G,H$ 共线且 $GH = 2OG$`,
      `九点圆圆心为 $OH$ 中点，半径为 $R/2$`,
      `$AH = 2\\cdot OM$（$M$ 为 $BC$ 中点）`,
    ],
    gen: [`homothety`, `complete`],
    tools: [`m-similarity`, `m-coord`, `m-congruence`],
    traps: [
      `等边三角形时 $O=G=H$ 重合，欧拉线不唯一，须单独说明`,
      `相似比方向是 $AG:GM = 2:1$（重心性质），写反会得到 $OG = 2GH$`,
    ],
    related: [`p-claw`, `p-midline`, `pr-14`],
    body: `## 识别信号
$\\triangle ABC$ 中同时出现外心 $O$、重心 $G$、垂心 $H$；或题目问九点圆。

## 第一步动作
取 $BC$ 中点 $M$，连 $AH$、$OM$、$OG$、$GH$，证 $\\triangle AHG \\sim \\triangle MOG$。

## 为什么成立
$AH \\perp BC$、$OM \\perp BC$，故 $AH \\parallel OM$，且 $AH = 2OM$（垂心性质，可由外接圆直径或向量证）。又 $G$ 在中线 $AM$ 上且 $AG:GM = 2:1$。于是
$$\\frac{AG}{GM} = \\frac{AH}{OM} = 2, \\quad \\angle HAG = \\angle OMG$$
故 $\\triangle AHG \\sim \\triangle MOG$（SAS），得 $HG/GO = 2$ 且 $\\angle AGH = \\angle MGO$，即 $H,G,O$ 共线。

以 $G$ 为中心、比 $-1/2$ 位似，把 $\\triangle ABC$ 映到中点三角形，其外心即九点圆圆心，恰为 $OH$ 中点。

## 三档视角
- **联赛**：作为压轴题的隐藏结构，常用坐标法验证。
- **自招**：欧拉线是位似与重心的直接推论，与 [[p-harmonic]]、九点圆、费尔巴哈定理同属三角形中心理论。`,
  },

  /* ---------------------------------------------------------------- 17 */
  {
    id: `p-brahmagupta`,
    layer: `pattern`,
    title: `婆罗摩笈多定理`,
    short: `圆内接四边形对角线垂直时的对边平方和`,
    tier: [3],
    tags: [`cyclic`, `perp`, `circle`],
    figure: `fig-cyclic`,
    signals: [
      `圆内接四边形的两条对角线互相垂直`,
      `出现「对边平方和相等」或要平分某条边`,
      `过对角线交点作垂线`,
    ],
    identify: `看到圆内接四边形 $AC \\perp BD$，立刻写 $AB^2+CD^2 = BC^2+DA^2 = 4R^2$。`,
    action: `设交点 $P$，过 $P$ 作一边的垂线并延长，证它平分对边。`,
    conclusions: [
      `$AB^2 + CD^2 = BC^2 + DA^2 = 4R^2$`,
      `过 $P$ 作 $AB$ 的垂线必平分 $CD$`,
      `$PA^2+PB^2+PC^2+PD^2 = 4R^2$`,
    ],
    gen: [`circle`],
    tools: [`m-cyclic`, `m-power`, `m-congruence`],
    traps: [
      `前提必须同时满足「共圆」与「对角线垂直」，缺一不可`,
      `平分的是「对边」而非相邻边，方向认错会得到错误中点`,
    ],
    related: [`p-cyclic`, `p-ptolemy`, `pr-09`],
    body: `## 识别信号
$A,B,C,D$ 共圆且 $AC \\perp BD$ 于 $P$；或题目出现「过交点作垂线平分对边」。

## 第一步动作
设 $P = AC \\cap BD$，用勾股把四条边都写成 $PA,PB,PC,PD$ 的平方和。

## 为什么成立
由 $AC \\perp BD$，
$$AB^2 = PA^2 + PB^2,\\quad CD^2 = PC^2 + PD^2$$
$$BC^2 = PB^2 + PC^2,\\quad DA^2 = PD^2 + PA^2$$
两组相加都等于 $PA^2+PB^2+PC^2+PD^2$，故对边平方和相等。再由相交弦定理 $PA\\cdot PC = PB\\cdot PD$ 与圆半径关系可得该公共值为 $4R^2$。

「过 $P$ 作 $AB$ 的垂线平分 $CD$」则靠导角：设垂线交 $CD$ 于 $M$，证 $\\angle MPC = \\angle MCP$ 与 $\\angle MPD = \\angle MDP$，得 $MC = MP = MD$。

## 三档视角
- **自招**：与托勒密、圆幂合用处理垂对角四边形；在复数 / 向量框架下是模长恒等式。`,
  },

  /* ---------------------------------------------------------------- 18 */
  {
    id: `p-area-ratio`,
    layer: `pattern`,
    title: `燕尾与面积比`,
    short: `同高换底、同底换高，把线段比写成面积比`,
    tier: [1, 2, 3],
    tags: [`area`, `ratio`, `mid`],
    figure: `fig-area-ratio`,
    signals: [
      `三角形内有一点 $P$，连到三个顶点`,
      `要求线段比、面积比或证比例式`,
      `出现「共角定理」「燕尾定理」类条件`,
    ],
    identify: `看到内点 $P$ 与三顶点相连，立刻写 $S_{ABP}/S_{ACP} = BD/DC$。`,
    action: `延长 $AP$ 交 $BC$ 于 $D$，把两个面积比都换成同高三角形的底之比。`,
    conclusions: [
      `$\\frac{S_{ABP}}{S_{ACP}} = \\frac{BD}{DC}$（燕尾定理）`,
      `$\\frac{S_{BCP}}{S_{ABP}} = \\frac{CE}{EA}$，$\\frac{S_{CAP}}{S_{BCP}} = \\frac{AF}{FB}$`,
      `三式相乘得塞瓦定理 $\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB}=1$`,
    ],
    gen: [`complete`],
    tools: [`m-area`, `m-menelaus`, `m-similarity`],
    traps: [
      `面积比换成底之比时必须「同高」，顶点不同的两个三角形不能直接用`,
      `燕尾定理中的 $D$ 是 $AP$ 延长线与 $BC$ 的交点，不是任意分点`,
    ],
    related: [`m-area`, `m-menelaus`, `pr-06`],
    body: `## 识别信号
$P$ 为 $\\triangle ABC$ 内一点，$AP,BP,CP$ 已连；题目给面积比求线段比，或反过来。

## 第一步动作
延长 $AP$ 交 $BC$ 于 $D$，把 $S_{ABP}/S_{ACP}$ 与 $S_{ABD}/S_{ACD}$ 联系起来。

## 为什么成立
$\\triangle ABP$ 与 $\\triangle ACP$ 同以 $A$ 为顶点、底分别在 $BD$、$DC$ 所在直线上，且 $\\triangle PBD$、$\\triangle PCD$ 也同高，故
$$\\frac{S_{ABP}}{S_{ACP}} = \\frac{S_{ABD} - S_{PBD}}{S_{ACD} - S_{PCD}} = \\frac{BD}{DC}$$
（更简洁地：$\\triangle ABP$ 与 $\\triangle ACP$ 对底 $BP$、$CP$ 的高相同，等价于到直线 $AP$ 的距离比，最终归于 $BD/DC$。）

三个燕尾式相乘即塞瓦定理；把 $P$ 移到三角形外则给出梅涅劳斯形式。

## 三档视角
- **培优**：用同高换底求简单面积比。
- **联赛**：燕尾 + 塞瓦处理共点、共线；与 [[m-area]] 的算两次结合列方程。
- **自招**：面积比即重心坐标，可直接接入向量与仿射几何。`,
  },

  /* ---------------------------------------------------------------- 19 */
  {
    id: `p-tangent-chord`,
    layer: `pattern`,
    title: `弦切角`,
    short: `切线角等于所夹弧对的圆周角`,
    tier: [1, 2],
    tags: [`tangent`, `circle`, `equal-angle`],
    figure: `fig-tangent-chord`,
    signals: [
      `图里出现圆的切线与过切点的弦`,
      `要证角相等却找不到全等或平行`,
      `出现「切线与弦的夹角」`,
    ],
    identify: `看到 $AT$ 切圆于 $A$、$AB$ 为弦，立刻写 $\\angle TAB = \\angle ACB$。`,
    action: `连 $AO$ 并取直径另一端，或过 $A$ 作直径，用 $\\angle$ 互余关系导角。`,
    conclusions: [
      `$\\angle TAB = \\angle ACB$（$C$ 在弦 $AB$ 所对的另一侧弧上）`,
      `弦切角等于所夹弧度数的一半`,
      `结合切割线定理 $PT^2 = PA\\cdot PB$ 可同时处理角与长度`,
    ],
    gen: [`circle`],
    tools: [`m-cyclic`, `m-power`, `m-similarity`],
    traps: [
      `必须取切线射线与弦构成的正确一侧；另一侧给出的是补角`,
      `弦切角等于「所夹弧」的圆周角，不是任意弧，跨弧会得到补角`,
    ],
    related: [`p-power`, `p-cyclic`, `pr-08`],
    body: `## 识别信号
$AT$ 是圆在 $A$ 处的切线，$AB$ 是过切点的弦，题目要证角相等或求角度。

## 第一步动作
连 $AO$ 并延长交圆于 $D$（作直径 $AD$），则 $\\angle TAD = 90^\\circ$。

## 为什么成立
$$\\angle TAB = 90^\\circ - \\angle DAB = 90^\\circ - \\angle DCB = \\angle ACD - \\angle DCB = \\angle ACB$$
其中用到直径所对圆周角为 $90^\\circ$ 与同弧圆周角相等。等价表述：弦切角等于所夹弧 $AB$ 度数的一半，而 $\\angle ACB$ 正是该弧所对圆周角。

这条定理是「切线 ↔ 圆内角」的桥梁：把圆外的角搬进圆内，共圆的所有导角工具就都能用了。

## 三档视角
- **培优**：直接套用搬角。
- **联赛**：与 [[p-power]] 联用，先由切割线定理求长度，再由弦切角导角证相似。
- **自招**：弦切角是反演下保角性的初等特例，与极限位置的圆周角统一。`,
  },

  /* ---------------------------------------------------------------- 20 */
  {
    id: `p-harmonic`,
    layer: `pattern`,
    title: `完全四边形与调和点列`,
    short: `四点定出对角点，交比等于负一`,
    tier: [3],
    tags: [`ratio`, `cyclic`, `locus`],
    figure: `fig-harmonic`,
    signals: [
      `图形里四个点两两相连形成六个交点（完全四边形）`,
      `要证 $\\frac{2}{AB} = \\frac{1}{AC} + \\frac{1}{AD}$ 型调和关系`,
      `出现极线、极点、交比 $-1$`,
    ],
    identify: `看到完全四边形的对角点连线截一边，立刻写 $(A,B;P,S) = -1$。`,
    action: `标出三个对角点 $P,Q,R$，令 $QR$ 交 $AB$ 于 $S$，用梅氏 + 塞瓦证明调和。`,
    conclusions: [
      `$(A,B;P,S) = -1$，即 $\\frac{PA}{PB} = -\\frac{SA}{SB}$`,
      `等价形式 $\\frac{2}{AB} = \\frac{1}{AP} + \\frac{1}{AS}$（按有向线段）`,
      `内、外角平分线与对边成调和点列；圆幂的极线也给出调和分割`,
    ],
    gen: [`complete`, `homothety`],
    tools: [`m-menelaus`, `m-harmonic`, `m-power-axis`],
    traps: [
      `交比要用有向线段，忽略符号会得到 $+1$ 而非 $-1$`,
      `完全四边形有三条对角线、三个对角点，认错 $P,Q,R$ 会导致对应边全错`,
    ],
    related: [`m-menelaus`, `m-inversion`, `pr-16`],
    body: `## 识别信号
四点 $A,B,C,D$ 两两连成六条线；或题干出现「调和」「极线」「交比 $-1$」。

## 第一步动作
记 $P = AB \\cap CD$、$Q = AD \\cap BC$、$R = AC \\cap BD$，令 $S = QR \\cap AB$。

## 为什么成立
对 $\\triangle PQR$ 与截线反复用梅涅劳斯、塞瓦，可证
$$\\frac{PA}{PB} \\cdot \\frac{SB}{SA} = -1 \\quad\\Longleftrightarrow\\quad (A,B;P,S) = -1$$
（有向线段）。调和点列的等价刻画很多：内、外角平分线分对边成调和；从圆外点引两切线与一条割线也成调和；$P$ 与 $S$ 关于 $A,B$ 互为反演像。

## 三档视角
- **自招 / CMO**：调和结构是极线理论、根轴、反演的共同语言。把「共线 + 交比」作为不变量，很多压轴题可一步化简；与 [[m-inversion]] 合用威力最大。

## 典型误用
把调和写成无向长度比：$(A,B;P,S)=-1$ 的负号来自有向线段，丢掉符号就丢失了内外分的信息。`,
  },
];
