import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import 'highlight.js/styles/github.min.css';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('html', html);
hljs.registerLanguage('xml', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);

const md = new MarkdownIt({ html: true });

const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const lang = (token.info || '').trim().split(/\s+/)[0].toLowerCase();
  if (lang === 'mermaid') {
    return '<div class="mermaid">' + md.utils.escapeHtml(token.content) + '</div>';
  }
  if (lang === 'graphviz' || lang === 'dot') {
    return '<div class="graphviz-source">' + md.utils.escapeHtml(token.content) + '</div>';
  }
  return defaultFence(tokens, idx, options, env, self);
};

/**
 * Sanitize config: allow safe HTML and SVG (shape elements, path, use; no script/href to javascript).
 * SVG allowlist is minimal for embedded diagrams and icons.
 */
const HTML_TAGS = [
  'a', 'p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'hr', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'del', 'ins', 'sub', 'sup'
];
const SVG_TAGS = [
  'svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'rect',
  'text', 'tspan', 'defs', 'use', 'clipPath', 'mask', 'title', 'desc'
];
const SAFE_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
  'viewBox', 'd', 'transform', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height',
  'xlink:href', 'xmlns', 'fill', 'stroke'
];

function getSanitizeConfig() {
  return {
    ALLOWED_TAGS: [...HTML_TAGS, ...SVG_TAGS],
    ALLOWED_ATTR: SAFE_ATTR,
  };
}

/**
 * Render markdown to sanitized HTML.
 * @param {string} raw
 * @returns {string}
 */
export function renderMarkdown(raw) {
  if (!raw.trim()) return '';
  const html = md.render(raw);
  return DOMPurify.sanitize(html, getSanitizeConfig());
}

/**
 * Run KaTeX on element (inline and block math).
 */
function renderMath(el) {
  try {
    renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    });
  } catch (_) {}
}

/**
 * Run highlight.js on all pre/code blocks in element.
 */
function highlightCode(el) {
  el.querySelectorAll('pre code').forEach((block) => {
    try {
      hljs.highlightElement(block);
    } catch (_) {}
  });
}

let mermaidLoaded = false;
async function runMermaid(el) {
  const nodes = el.querySelectorAll('.mermaid');
  if (nodes.length === 0) return;
  try {
    if (!mermaidLoaded) {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
      mermaidLoaded = true;
    }
    const mermaid = (await import('mermaid')).default;
    await mermaid.run({ nodes });
  } catch (err) {
    nodes.forEach((n) => {
      n.innerHTML = '<span class="mermaid-error">Mermaid error: ' + (err.message || 'failed to render') + '</span>';
    });
  }
}

let vizInstance = null;
async function runGraphviz(el) {
  const nodes = el.querySelectorAll('.graphviz-source');
  if (nodes.length === 0) return;
  try {
    if (!vizInstance) vizInstance = await import('@viz-js/viz');
    const viz = await vizInstance.instance();
    for (const node of nodes) {
      const dot = node.textContent;
      try {
        const svg = viz.renderString(dot, { format: 'svg' });
        const wrap = document.createElement('div');
        wrap.className = 'graphviz-output';
        wrap.innerHTML = typeof svg === 'string' ? svg : String(svg);
        node.replaceWith(wrap);
      } catch (err) {
        node.classList.add('graphviz-error');
        node.textContent = 'Graphviz error: ' + (err?.message || 'failed to render');
      }
    }
  } catch (_) {
    nodes.forEach((n) => {
      n.classList.add('graphviz-error');
      n.textContent = 'Graphviz failed to load.';
    });
  }
}

/**
 * Update preview element with rendered content.
 * Order: set HTML -> KaTeX -> highlight.js -> Mermaid (async) -> Graphviz (async).
 * @param {HTMLElement} previewEl
 * @param {string} content
 */
export function updatePreview(previewEl, content) {
  const html = renderMarkdown(content);
  previewEl.innerHTML = html || '<p class="preview-empty">Nothing to preview.</p>';
  renderMath(previewEl);
  highlightCode(previewEl);
  runMermaid(previewEl);
  runGraphviz(previewEl);
}
