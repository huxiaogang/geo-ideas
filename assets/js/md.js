/* ==========================================================================
   md.js —— 迷你 Markdown + KaTeX 渲染（零依赖）
   支持：标题、段落、粗体/斜体/行内代码、列表（嵌套）、引用、表格、
        行内公式 $..$、块公式 $$..$$、代码块、水平线、链接、卡片内链 [[id]]
   ========================================================================== */
(function (global) {
  'use strict';

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* 数学片段保护：先抽出公式，避免被其它规则破坏 */
  function protectMath(src) {
    const store = [];
    /* 占位符里带一个 D/I 标记：D=显示公式($$)，I=行内公式($)。
       这样「独占一行的行内公式」不会被误判成居中块公式。 */
    const push = (tex, display) => {
      const i = store.length;
      store.push({ tex, display });
      return `\u0000M${i}${display ? 'D' : 'I'}\u0000`;
    };
    let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => push(t.trim(), true));
    s = s.replace(/\$([^\$\n]+?)\$/g, (_, t) => push(t.trim(), false));
    return { s, store };
  }

  function katexRender(tex, display) {
    if (global.katex) {
      try {
        return global.katex.renderToString(tex, {
          displayMode: display, throwOnError: false, strict: false,
          trust: false, output: 'html',
        });
      } catch (e) { /* fall through */ }
    }
    return `<code class="tex-fallback">${esc(tex)}</code>`;
  }

  function restoreMath(html, store) {
    return html.replace(/\u0000M(\d+)([DI])\u0000/g, (_, i) => {
      const m = store[Number(i)];
      return m ? katexRender(m.tex, m.display) : '';
    });
  }

  /* 行内语法（在已转义的文本上运行） */
  function inline(s) {
    s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s（(，。；：、"'])\*([^*\n]+)\*(?=[\s）)，。；：、"'！？]|$)/g, '$1<em>$2</em>');
    s = s.replace(/\[\[([a-z0-9\-]+)(?:\|([^\]]+))?\]\]/g, (_, id, txt) =>
      `<a class="xlink" href="#/card/${id}">${txt || id}</a>`);
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) =>
      `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
    return s;
  }

  function render(src) {
    if (!src) return '';
    const { s: guarded, store } = protectMath(String(src).replace(/\r\n/g, '\n'));

    const lines = guarded.split('\n');
    const out = [];
    let i = 0;
    let inList = false;

    const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };

    while (i < lines.length) {
      let line = lines[i];

      /* 代码块 */
      if (/^```/.test(line)) {
        closeList();
        const lang = line.slice(3).trim();
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push(`<pre class="code"${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(buf.join('\n'))}</code></pre>`);
        continue;
      }

      /* 块公式（独占一行的 $$...$$）；行内公式即使独占一行也走段落，不居中 */
      if (/^\u0000M\d+D\u0000$/.test(line.trim())) {
        closeList();
        out.push(`<div class="math-block">${restoreMath(line.trim(), store)}</div>`);
        i++;
        continue;
      }

      /* 标题 */
      const hm = /^(#{1,4})\s+(.*)$/.exec(line);
      if (hm) {
        closeList();
        const lv = hm[1].length + 1; // # -> h2（页面自身用 h1）
        out.push(`<h${lv} class="md-h">${restoreMath(inline(esc(hm[2])), store)}</h${lv}>`);
        i++;
        continue;
      }

      /* 水平线 */
      if (/^\s*(---|\*\*\*)\s*$/.test(line)) { closeList(); out.push('<hr>'); i++; continue; }

      /* 表格 */
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
        closeList();
        const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        const head = cells(line);
        i += 2;
        const body = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { body.push(cells(lines[i])); i++; }
        out.push('<div class="table-wrap"><table class="md-table"><thead><tr>' +
          head.map((h) => `<th>${restoreMath(inline(esc(h)), store)}</th>`).join('') + '</tr></thead><tbody>' +
          body.map((r) => '<tr>' + r.map((c) => `<td>${restoreMath(inline(esc(c)), store)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table></div>');
        continue;
      }

      /* 引用 */
      if (/^>\s?/.test(line)) {
        closeList();
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
        out.push(`<blockquote>${render(buf.join('\n'))}</blockquote>`);
        continue;
      }

      /* 列表 */
      const lm = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(line);
      if (lm) {
        if (!inList) { out.push('<ul class="md-list">'); inList = true; }
        const indent = lm[1].length;
        const ordered = /\d/.test(lm[2]);
        out.push(`<li${indent >= 2 ? ' class="sub"' : ''}${ordered ? ' data-n="' + lm[2].replace('.', '') + '"' : ''}>${restoreMath(inline(esc(lm[3])), store)}</li>`);
        i++;
        continue;
      }

      /* 空行 */
      if (!line.trim()) { closeList(); i++; continue; }

      /* 段落 */
      closeList();
      const buf = [];
      while (i < lines.length && lines[i].trim() &&
        !/^(#{1,4}\s|```|>\s?|\s*\||\s*([-*+]|\d+\.)\s|---$)/.test(lines[i]) &&
        !/^\u0000M\d+D\u0000$/.test(lines[i].trim())) {
        buf.push(lines[i++]);
      }
      out.push(`<p>${restoreMath(inline(esc(buf.join(' '))), store)}</p>`);
    }
    closeList();
    return out.join('\n');
  }

  /* 纯文本摘要（用于搜索/卡片预览） */
  function plain(src) {
    return String(src || '')
      .replace(/\$\$?([\s\S]+?)\$\$?/g, ' $1 ')
      .replace(/[#>*`|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* 行内渲染：只处理公式、加粗、内链等行内语法，不产生 <p>/<h>/<ul> 块级标签。
     用于卡片详情页的「识别 / 第一步 / 何时用」、罗盘命中理由、训练场反馈等
     嵌在 flex 行里的小段文本 —— 这些地方既要 KaTeX，又不能塞进块级元素。 */
  function inlineRender(src) {
    if (!src) return '';
    const { s: guarded, store } = protectMath(String(src).replace(/\r\n/g, '\n').replace(/\n/g, ' '));
    return restoreMath(inline(esc(guarded)), store);
  }

  global.MD = { render, inlineRender, plain, esc, katexRender };
})(window);
