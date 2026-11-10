# 平面几何·解题思想

面向初中数学竞赛生的几何解题思想训练站。**双击 `index.html` 即可使用**，无需安装、无需构建、可离线运行。

## 它解决什么问题

竞赛几何卡住，通常不是「定理没背过」，而是**检索失败**：图里明明有手拉手却没认出来；知道该旋转却不知道第一步把哪条线转到哪；辅助线作对了却接不上结论。

本站不按章节堆题，而是把知识组织成四层：

```
思想（7）→ 方法（12）→ 基本图形（20）→ 例题（16）
        ↑ 以陈祖维「基本图形为纲、变换为生成器」的思路重构
```

并配一套诊断式导航：**解题罗盘**（按题干特征反查）→ **阶梯提示**（五层，自己控制揭示到第几层）→ **决策注解**（为什么先试这个、放弃了什么）→ **错因四分类**（按模型复现）。

## 解题四步定式

1. **识图** — 这张图由哪些基本图形拼成？已有几个，缺几个？
2. **生成** — 缺的那个，用平移 / 旋转 / 翻折 / 位似 / 补形中的哪一种造出来？
3. **落地** — 用全等相似、三角、坐标复数、面积还是圆幂来算？
4. **验算** — 结论在退化位置、特殊点上是否仍成立？

## 主要页面

| 页面 | 用途 |
|---|---|
| 今日 | 20 分钟闭环：3 张翻卡 + 1 道题 + 1 组限时识别，带连续打卡 |
| 解题罗盘 | 勾选「中点 / 角平分线 / 共顶点旋转 / 求最值…」反查该想什么，附命中理由 |
| 基本图形 | 20 张图式卡，正面只给图，背面才是识别信号与第一步动作 |
| 思想 / 方法 | 调度原则与落地工具，含「该思想失效时怎么办」 |
| 例题精讲 | 16 道题，五层阶梯提示 + 决策注解 + 被放弃的思路 + 变式 |
| 训练场 | 限时识别，只练「第一反应」速度，不写过程 |
| 翻卡复习 | 简化 SM-2 间隔重复，会 / 模糊 / 不会 决定下次见面时间 |
| 错题图谱 | 模型 × 错因 热力图 + 优先复现清单 + 备份导入导出 |
| 方法地图 | 四层知识关系图 |

顶栏可切换 **培优 / 联赛 / 自招** 三档：内容不分家，档位只影响推荐、筛选与排序。按 `/` 唤起搜索，`◐` 切换深浅色。

## 几何图为什么可信

所有图由 `assets/js/geo.js` 按坐标与约束生成，**可以自由拖动**。每张图内置数学断言（等长、共线、共圆、角度、比例、定理等式），渲染与拖动时反复校验；`tests/figcheck.html` 目前 22 张图 / 61 条断言全部通过。

拖动时留意哪些量在变、哪些量不变——这比背结论有用。约束会保证拖动不破坏图形前提（例如「P 在隐形圆上」「F 在角平分线上」）。

## 技术形态

零依赖纯静态站：普通 `<script>`（**非 ES module**，因为 `file://` 下模块脚本会被 CORS 拦截）、hash 路由、`localStorage` 持久化。KaTeX 与字体已本地化到 `vendor/`，断网可用。不上传任何数据。

目录：

```
index.html            入口，双击即开
assets/css/app.css    样式（含深浅色、响应式）
assets/js/
  geo.js              几何引擎（点/约束/图元/自检/拖动）
  figures.js          22 张图形定义 + 数学断言
  md.js               迷你 Markdown + KaTeX
  store.js            localStorage 状态 + 简化 SM-2
  app.js              路由、顶栏、搜索、档位、卡片组件
  pages.js            全部页面
content/
  meta.js             四步定式与全局说明
  tags.js             18 个反查标签
  ideas.js            7 张思想卡
  methods.js          12 张方法卡
  patterns.js         20 张基本图形卡
  problems.js         16 道例题
docs/
  PLAN.md             产品与技术方案（v1.1 定稿）
  SCHEMA.md           内容数据规范与 ID 注册表
tests/                 浏览器端自检页（用 Chrome 无头模式跑）
vendor/katex/         本地化 KaTeX
```

## 部署到 GitHub Pages

本站是纯静态站，**无需构建、无需 Jekyll、无需任何绝对路径或 `fetch`**，可直接放到 GitHub Pages 的项目页子路径（`/repo/`）或用户页根路径下。已在 `http://127.0.0.1:8765/repo/` 形态下实测通过（`SUBPATH_0`）。

仓库里已备好两个文件：

- `.nojekyll` —— 禁用 Jekyll，避免下划线开头的文件被忽略
- `.github/workflows/deploy-pages.yml` —— push 到 `main` 时自动把 `index.html`、`assets/`、`content/`、`vendor/`、`.nojekyll` 打包为 Pages 产物并部署（文档与自检页不发布）

**启用步骤**：GitHub 仓库 → Settings → Pages → Build and deployment → Source 选 **GitHub Actions**；然后 push 到 `main`，Actions 里会跑 `Deploy to GitHub Pages`，完成后得到 `https://<用户名>.github.io/<仓库名>/`。

若想用最简方式（不开 Actions）：Settings → Pages → Source 选 `Deploy from a branch` → 选 `main` / `root`，保存即可，仓库根目录的 `index.html` 会被直接提供。

本机当前状态（无法自动替你完成的部分）：工作区还不是 git 仓库、没有配置 remote、未安装 `gh` CLI；本机 SSH 公钥在 `C:\Users\admin\.ssh\id_ed25519.pub`，需先添加到 GitHub 账户才能推送。

## 自检

一键跑全部（需要本机 Chrome）：

```
pwsh -ExecutionPolicy Bypass -File tests/_runner.ps1
```

（本机若禁止运行脚本，可用 `-ExecutionPolicy Bypass`；或直接逐个打开下面的 html。）

每个测试页跑完会把结果写进 `<title>`，`_0` 即通过：

```
tests/figcheck.html    几何断言（22 图 / 61 条）
tests/mdcheck.html     Markdown 与 KaTeX
tests/storecheck.html  SRS / 错因 / 打卡 / 导入导出
tests/contentcheck.html 内容一致性：ID 注册表 / 字段 / 引用 / 公式可解析 / 反斜杠
tests/compasstest.html 解题罗盘推荐排序与命中理由（交互测试）
tests/formulacheck.html 全站公式渲染：无裸 LaTeX、行内/块公式区分（回归测试）
tests/closedloop.html  今日闭环三项任务自动打卡（交互测试）
tests/smoke.html       15 个页面端到端（内容缺失时用桩数据）
tests/indexcheck.html  正式入口加载检查
tests/fileproto.html   严格 file:// 协议加载检查
tests/offline.html     严格离线检查：无外部资源、KaTeX/SVG 本地渲染
tests/subpathcheck.html HTTP 子路径部署自检（需经 http(s) 打开，不纳入 _runner.ps1）
```

> 内容是对陈祖维几何教学特征的**教学重构**，不是原讲义复刻。若有其课程目录，可按 `docs/SCHEMA.md` 的 ID 注册表逐节映射。

## 内容红线

- 每个例题的「决策注解」必须具体，指出至少一个被放弃的思路；
- 每个基本图形的「第一步动作」必须是可直接执行的规定动作，不写「作辅助线」这种空话；
- 几何图必须有数学断言，画错的图比没有图更糟。
