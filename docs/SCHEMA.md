# 内容数据规范（所有内容文件必须遵守）

## 全局约定

- 每个文件形如 `window.IDEAS = [ ... ];`（普通脚本，非 ES module，因为要 `file://` 打开）
- JS 字符串统一用反引号模板字符串；正文中**不要出现反引号**，需要代码用 `<code>…</code>` 或 `**…**`
- 公式：`$行内$` 或 `$$独占一行$$`，用 LaTeX；中文里写 `$\angle ABC$` 而非「∠ABC」也可以，两种都行
- 内链：`[[card-id]]` 或 `[[card-id|显示文字]]`，渲染成链接
- 字段里的 Markdown 子集：标题 `##`、列表 `-`、粗体 `**`、表格、引用 `>`、代码块

## 通用字段（所有卡片）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | ✓ | 全局唯一，前缀见下表 |
| `layer` | string | ✓ | `idea` / `method` / `pattern` / `problem` |
| `title` | string | ✓ | 简洁中文名 |
| `short` | string | ✓ | 一句话，用于卡片墙和搜索摘要（≤ 40 字） |
| `tier` | number[] | ✓ | `[1]` 培优 / `[2]` 联赛 / `[3]` 自招；可多档如 `[1,2,3]` |
| `tags` | string[] | ✓ | 来自 `TAGS` 的 id，用于解题罗盘反查 |
| `body` | string | ✓ | 正文 Markdown，卡片的核心讲解 |
| `figure` | string | — | `figures.js` 中的图 id（有图的卡片尽量填） |
| `traps` | string[] | — | 易错点，2–3 条 |
| `related` | string[] | — | 相关卡片 id |

## 各层专属字段

### idea（思想卡，7 张）
| 字段 | 说明 |
|---|---|
| `motto` | 一句口诀（如「把不会的变成会的」） |
| `fail` | string[]：**这个思想失效时怎么办**（2 条，本站特色字段） |
| `steps` | string[]：3–4 步操作化流程 |

### method（方法卡，12 张）
| 字段 | 说明 |
|---|---|
| `when` | string：什么时候用它（识别信号） |
| `action` | string：第一步动作 |
| `tools` | string[]：关联 `pattern` / `method` 卡 id |

### pattern（基本图形卡，20 张）—— 本站核心
| 字段 | 说明 |
|---|---|
| `signals` | string[]：识别信号，**3 条左右**，是罗盘命中理由的来源 |
| `identify` | string：看到什么就想到它（一句话） |
| `action` | string：**第一步辅助线动作**（一句话，必须可执行） |
| `conclusions` | string[]：能得到的结论（2–3 条） |
| `gen` | string[]：所属生成器 `rotate`/`translate`/`reflect`/`homothety`/`complete` |
| `tools` | string[]：落地所需的 method 卡 id |

### problem（例题卡，16 张）
| 字段 | 说明 |
|---|---|
| `tier` | number[]：单档为主 |
| `source` | string：如 `2023 年初中联赛 · 改编` |
| `statement` | string：题干（含公式） |
| `answer` | string：完整解答 Markdown |
| `hints` | `[{level, title, text}, …]`：**5 层**，level 依次 `观察 / 联想 / 构造 / 主链 / 完整解` |
| `decision` | string：**决策注解**——为什么先试这个、放弃了什么（必填，本站最值钱字段） |
| `discard` | string[]：被放弃的思路（≥1 条） |
| `variants` | string[]：变式题描述（2 条，按档升维） |
| `patterns` | string[]：用到的 pattern 卡 id |
| `methods` | string[]：用到的 method 卡 id |

### TAGS（反查标签，18 个）
```js
window.TAGS = [
  { id: 'mid',   label: '出现中点',        group: '点', desc: '…' },
  ...
];
```
`group` 取值限定：`点 / 线 / 角 / 圆 / 长度 / 面积 / 最值 / 位置 / 证明目标`

## ID 注册表（必须精确使用，禁止自创）

### 思想 idea（7）
`i-reduce` 化归 / `i-transform` 图形变换 / `i-complete` 构造补形 / `i-double-count` 算两次 /
`i-algebra` 代数化 / `i-invariant` 不变量与特殊化 / `i-symmetry` 对称对应

### 方法 method（12）
`m-congruence` 全等构造 / `m-similarity` 相似与比例 / `m-cyclic` 四点共圆判定 /
`m-power` 圆幂三定理 / `m-area` 面积法 / `m-trig` 三角法 / `m-coord` 坐标与复数 /
`m-menelaus` 梅氏与塞瓦 / `m-homothety` 位似与旋转相似 / `m-power-axis` 根轴 /
`m-inversion` 反演 / `m-harmonic` 调和结构

### 基本图形 pattern（20）
`p-hand` 手拉手 / `p-half-angle` 半角 / `p-three-equal` 一线三等角 / `p-double-median` 倍长中线 /
`p-midline` 中位线 / `p-bisector` 角平分线四定理 / `p-right-mid` 直角三角形斜边中线 /
`p-cyclic` 共圆四判定 / `p-power` 圆幂三定理 / `p-ptolemy` 托勒密 /
`p-fermat` 费马点 / `p-hidden-circle` 隐形圆 / `p-apollonius` 阿氏圆 /
`p-hu-bu-gui` 胡不归 / `p-claw` 鸡爪定理 / `p-euler` 欧拉线 /
`p-brahmagupta` 婆罗摩笈多 / `p-area-ratio` 燕尾与面积比 / `p-tangent-chord` 弦切角 / `p-harmonic` 完全四边形

### 例题 problem（16）
`pr-01` … `pr-16`

### 图 figure（22，已实现）
`fig-hand-in-hand`, `fig-half-angle`, `fig-double-median`, `fig-midline`, `fig-bisector`,
`fig-three-equal`, `fig-cyclic`, `fig-power`, `fig-ptolemy`, `fig-fermat`, `fig-hidden-circle`,
`fig-apollonius`, `fig-chicken-claw`, `fig-euler-line`, `fig-area-ratio`, `fig-tangent-chord`,
`fig-spiral`, `fig-harmonic`, `fig-inversion`, `fig-menelaus`, `fig-homothety`, `fig-right-mid`

## 内容质量红线

1. **决策注解不许写套话**，必须具体：「先试 X，因为…；放弃 Y，因为…」
2. `action` 必须是**规定动作**（「延长 AM 到 D 使 MD=AM」），不许写「作辅助线」
3. `signals` 必须是**题干里能看见的特征**，不许写抽象概念
4. 每个 `problem` 的 `hints` 必须恰好 5 层，且第 5 层给出完整结论
5. 三档分层：tier 1 重识别与套路，tier 2 重组合与转化，tier 3 重高级观点（反演/调和/根轴）
6. 所有公式用 LaTeX，且**必须能被 KaTeX 解析**（不许用 `\begin{align}` 以外的复杂环境）
