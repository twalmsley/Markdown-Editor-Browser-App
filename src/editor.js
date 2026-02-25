/**
 * Get selection range in a textarea.
 * @param {HTMLTextAreaElement} el
 * @returns {{ start: number, end: number, text: string }}
 */
export function getSelection(el) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value.slice(start, end);
  return { start, end, text };
}

/**
 * Set selection and optionally replace with new text.
 * Uses execCommand('insertText') so the change is undoable.
 * @param {HTMLTextAreaElement} el
 * @param {number} start
 * @param {number} end
 * @param {string} [replacement]
 * @param {{ selectReplacement?: boolean }} [opts]
 */
export function setSelection(el, start, end, replacement, opts = {}) {
  el.focus();
  el.setSelectionRange(start, end);
  const newText = replacement !== undefined ? replacement : el.value.slice(start, end);
  if (replacement !== undefined) {
    document.execCommand('insertText', false, newText);
  }
  const newEnd = start + newText.length;
  if (opts.selectReplacement) {
    el.setSelectionRange(start, newEnd);
  } else {
    el.setSelectionRange(newEnd, newEnd);
  }
}

/**
 * Wrap selected text with before/after (e.g. "**" and "**" for bold).
 * If no selection, insert markers and place cursor between them.
 */
export function wrapSelection(el, before, after = before) {
  const { start, end, text } = getSelection(el);
  if (text) {
    setSelection(el, start, end, before + text + after, { selectReplacement: false });
  } else {
    setSelection(el, start, end, before + after, { selectReplacement: false });
    el.setSelectionRange(start + before.length, start + before.length);
  }
}

/**
 * Insert at start of selection (or current line), e.g. "> " for blockquote.
 * Uses execCommand so the change is undoable.
 */
export function insertAtLineStart(el, prefix) {
  const value = el.value;
  const start = el.selectionStart;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  el.focus();
  el.setSelectionRange(lineStart, lineStart);
  document.execCommand('insertText', false, prefix);
  el.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
}

/**
 * Insert block: add before current line and a newline after (e.g. "```\n\n```").
 * Uses execCommand so the change is undoable.
 */
export function insertBlock(el, beforeBlock, afterBlock = '') {
  const value = el.value;
  const start = el.selectionStart;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const insert = (lineStart > 0 ? '\n' : '') + beforeBlock + '\n\n' + afterBlock;
  const cursor = lineStart + beforeBlock.length + 2;
  el.focus();
  el.setSelectionRange(lineStart, lineStart);
  document.execCommand('insertText', false, insert);
  el.setSelectionRange(cursor, cursor);
}

const actions = {
  bold: (el) => wrapSelection(el, '**', '**'),
  italic: (el) => wrapSelection(el, '*', '*'),
  code: (el) => wrapSelection(el, '`', '`'),
  strikethrough: (el) => wrapSelection(el, '~~', '~~'),
  h1: (el) => insertAtLineStart(el, '# '),
  h2: (el) => insertAtLineStart(el, '## '),
  h3: (el) => insertAtLineStart(el, '### '),
  link: (el) => {
    const { start, end, text } = getSelection(el);
    const label = text || 'link text';
    const insert = `[${label}](url)`;
    setSelection(el, start, end, insert, { selectReplacement: false });
    const urlStart = start + label.length + 3;
    el.setSelectionRange(urlStart, urlStart + 3);
  },
  image: (el) => {
    const { start, end, text } = getSelection(el);
    const alt = text || 'description';
    setSelection(el, start, end, `![${alt}](url)`, { selectReplacement: false });
    const urlStart = start + alt.length + 4;
    el.setSelectionRange(urlStart, urlStart + 3);
  },
  blockquote: (el) => insertAtLineStart(el, '> '),
  ul: (el) => insertAtLineStart(el, '- '),
  ol: (el) => insertAtLineStart(el, '1. '),
  hr: (el) => insertBlock(el, '---', ''),
  codeBlock: (el) => insertBlock(el, '```', '```'),
};

/**
 * Run a named toolbar action on the editor.
 * @param {HTMLTextAreaElement} el
 * @param {string} name - one of: bold, italic, code, strikethrough, h1, h2, h3, link, image, blockquote, ul, ol, hr, codeBlock
 */
export function runAction(el, name) {
  const fn = actions[name];
  if (fn && el) fn(el);
}
