/**
 * Toolbar DOM and button handlers. Calls editor.runAction for each format.
 */
import { runAction } from './editor.js';

const BUTTONS = [
  { id: 'bold', label: 'Bold', action: 'bold', symbol: 'B' },
  { id: 'italic', label: 'Italic', action: 'italic', symbol: 'I' },
  { id: 'code', label: 'Code', action: 'code', symbol: '</>' },
  { id: 'strikethrough', label: 'Strikethrough', action: 'strikethrough', symbol: 'S̲' },
  { id: 'h1', label: 'Heading 1', action: 'h1', symbol: 'H1' },
  { id: 'h2', label: 'Heading 2', action: 'h2', symbol: 'H2' },
  { id: 'h3', label: 'Heading 3', action: 'h3', symbol: 'H3' },
  { id: 'link', label: 'Link', action: 'link', symbol: '🔗' },
  { id: 'image', label: 'Image', action: 'image', symbol: '🖼' },
  { id: 'blockquote', label: 'Blockquote', action: 'blockquote', symbol: '❝' },
  { id: 'ul', label: 'Bullet list', action: 'ul', symbol: '•' },
  { id: 'ol', label: 'Numbered list', action: 'ol', symbol: '1.' },
  { id: 'hr', label: 'Horizontal rule', action: 'hr', symbol: '—' },
  { id: 'table', label: 'Table', action: 'table', symbol: '⊞' },
  { id: 'codeBlock', label: 'Code block', action: 'codeBlock', symbol: '{}' },
];

/**
 * Create toolbar HTML and attach click handlers.
 * @param {HTMLTextAreaElement} editor
 * @returns {HTMLElement} toolbar container
 */
export function createToolbar(editor) {
  const bar = document.createElement('div');
  bar.className = 'toolbar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Formatting');

  for (const b of BUTTONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toolbar-btn';
    btn.dataset.action = b.action;
    btn.setAttribute('aria-label', b.label);
    btn.setAttribute('title', b.label);
    btn.textContent = b.symbol;
    btn.addEventListener('click', () => {
      editor.focus();
      runAction(editor, b.action);
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    });
    bar.appendChild(btn);
  }

  return bar;
}
