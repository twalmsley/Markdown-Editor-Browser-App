import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
// Additional languages for broad syntax highlighting support
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import kotlin from 'highlight.js/lib/languages/kotlin';
import rust from 'highlight.js/lib/languages/rust';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import swift from 'highlight.js/lib/languages/swift';
import scala from 'highlight.js/lib/languages/scala';
import r from 'highlight.js/lib/languages/r';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import makefile from 'highlight.js/lib/languages/makefile';
import graphql from 'highlight.js/lib/languages/graphql';
import scss from 'highlight.js/lib/languages/scss';
import less from 'highlight.js/lib/languages/less';
import elm from 'highlight.js/lib/languages/elm';
import elixir from 'highlight.js/lib/languages/elixir';
import erlang from 'highlight.js/lib/languages/erlang';
import haskell from 'highlight.js/lib/languages/haskell';
import clojure from 'highlight.js/lib/languages/clojure';
import lua from 'highlight.js/lib/languages/lua';
import perl from 'highlight.js/lib/languages/perl';
import groovy from 'highlight.js/lib/languages/groovy';
import dart from 'highlight.js/lib/languages/dart';
import fsharp from 'highlight.js/lib/languages/fsharp';
import objectivec from 'highlight.js/lib/languages/objectivec';
import vbnet from 'highlight.js/lib/languages/vbnet';
import fortran from 'highlight.js/lib/languages/fortran';
import latex from 'highlight.js/lib/languages/latex';
import ini from 'highlight.js/lib/languages/ini';
import properties from 'highlight.js/lib/languages/properties';
import nginx from 'highlight.js/lib/languages/nginx';
import apache from 'highlight.js/lib/languages/apache';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';
import coffeescript from 'highlight.js/lib/languages/coffeescript';
import julia from 'highlight.js/lib/languages/julia';
import nim from 'highlight.js/lib/languages/nim';
import powershell from 'highlight.js/lib/languages/powershell';
import shell from 'highlight.js/lib/languages/shell';
import vbscript from 'highlight.js/lib/languages/vbscript';
import verilog from 'highlight.js/lib/languages/verilog';
import vhdl from 'highlight.js/lib/languages/vhdl';
import xml from 'highlight.js/lib/languages/xml';
import protobuf from 'highlight.js/lib/languages/protobuf';
import 'highlight.js/styles/github.min.css';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c++', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cs', csharp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('golang', go);
hljs.registerLanguage('java', java);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('kt', kotlin);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('rs', rust);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('rb', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('scala', scala);
hljs.registerLanguage('scala3', scala);
hljs.registerLanguage('r', r);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('docker', dockerfile);
hljs.registerLanguage('makefile', makefile);
hljs.registerLanguage('make', makefile);
hljs.registerLanguage('graphql', graphql);
hljs.registerLanguage('gql', graphql);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('sass', scss);
hljs.registerLanguage('less', less);
hljs.registerLanguage('elm', elm);
hljs.registerLanguage('elixir', elixir);
hljs.registerLanguage('ex', elixir);
hljs.registerLanguage('erlang', erlang);
hljs.registerLanguage('erl', erlang);
hljs.registerLanguage('haskell', haskell);
hljs.registerLanguage('hs', haskell);
hljs.registerLanguage('clojure', clojure);
hljs.registerLanguage('clj', clojure);
hljs.registerLanguage('lua', lua);
hljs.registerLanguage('perl', perl);
hljs.registerLanguage('pl', perl);
hljs.registerLanguage('groovy', groovy);
hljs.registerLanguage('dart', dart);
hljs.registerLanguage('fsharp', fsharp);
hljs.registerLanguage('fs', fsharp);
hljs.registerLanguage('objectivec', objectivec);
hljs.registerLanguage('objc', objectivec);
hljs.registerLanguage('obj-c', objectivec);
hljs.registerLanguage('vbnet', vbnet);
hljs.registerLanguage('vb', vbnet);
hljs.registerLanguage('fortran', fortran);
hljs.registerLanguage('f90', fortran);
hljs.registerLanguage('latex', latex);
hljs.registerLanguage('tex', latex);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('properties', properties);
hljs.registerLanguage('props', properties);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('apache', apache);
hljs.registerLanguage('apacheconf', apache);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('patch', diff);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('text', plaintext);
hljs.registerLanguage('txt', plaintext);
hljs.registerLanguage('coffeescript', coffeescript);
hljs.registerLanguage('coffee', coffeescript);
hljs.registerLanguage('julia', julia);
hljs.registerLanguage('jl', julia);
hljs.registerLanguage('nim', nim);
hljs.registerLanguage('nimrod', nim);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('ps1', powershell);
hljs.registerLanguage('ps', powershell);
hljs.registerLanguage('vbscript', vbscript);
hljs.registerLanguage('vbs', vbscript);
hljs.registerLanguage('verilog', verilog);
hljs.registerLanguage('v', verilog);
hljs.registerLanguage('vhdl', vhdl);
hljs.registerLanguage('protobuf', protobuf);
hljs.registerLanguage('proto', protobuf);

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
