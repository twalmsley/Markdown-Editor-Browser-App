import '../styles/themes.css';
import '../styles/main.css';
import state from './state.js';
import { initSplit, initViewToggle } from './layout.js';
import { updatePreview } from './render.js';
import { createToolbar } from './toolbar.js';
import * as fileHandler from './fileHandler.js';

const DEFAULT_CONTENT = `# Welcome

Edit markdown on the left and see the preview on the right.

- **Bold** and *italic*
- [Links](https://example.com)
- \`code\`
`;

function renderApp(root) {
  const { content } = state.getState();
  root.innerHTML = `
    <header class="app-header">
      <h1 class="app-title">Markdown Editor</h1>
      <div class="file-actions" role="group" aria-label="File">
        <button type="button" class="header-btn" data-action="new" aria-label="New file">New</button>
        <button type="button" class="header-btn fsa-only" data-action="open" aria-label="Open file">Open</button>
        <button type="button" class="header-btn fsa-only" data-action="save" aria-label="Save file">Save</button>
        <button type="button" class="header-btn fallback-only" data-action="import" aria-label="Import file">Import</button>
        <button type="button" class="header-btn fallback-only" data-action="download" aria-label="Download file">Download</button>
      </div>
      <span class="unsaved-indicator" aria-live="polite"></span>
      <div class="view-tabs" aria-label="Switch view">
        <button type="button" class="view-tab active" data-view="edit">Edit</button>
        <button type="button" class="view-tab" data-view="preview">Preview</button>
      </div>
      <button type="button" class="header-btn theme-btn" data-action="theme" aria-label="Toggle theme">☽</button>
    </header>
    <main class="app-main">
      <div class="editor-wrap">
        <div class="toolbar-wrap"></div>
        <textarea class="editor" spellcheck="false" placeholder="Write markdown here…" aria-label="Markdown editor">${escapeHtml(content)}</textarea>
      </div>
      <div class="split-divider" aria-hidden="true"></div>
      <div class="preview-wrap">
        <div class="preview" aria-live="polite"></div>
      </div>
    </main>
  `;

  const main = root.querySelector('.app-main');
  const editorWrap = root.querySelector('.editor-wrap');
  const previewWrap = root.querySelector('.preview-wrap');
  const divider = root.querySelector('.split-divider');
  const viewTabs = root.querySelector('.view-tabs');

  initSplit(main, editorWrap, previewWrap, divider);
  initViewToggle(main, editorWrap, previewWrap, viewTabs);

  const textarea = root.querySelector('.editor');
  const preview = root.querySelector('.preview');
  const toolbarWrap = root.querySelector('.toolbar-wrap');
  const toolbar = createToolbar(textarea);
  toolbarWrap.appendChild(toolbar);

  const unsavedEl = root.querySelector('.unsaved-indicator');
  const fsaBtns = root.querySelectorAll('.fsa-only');
  const fallbackBtns = root.querySelectorAll('.fallback-only');
  if (fileHandler.isFSAAvailable()) {
    fsaBtns.forEach((b) => b.classList.remove('hidden'));
    fallbackBtns.forEach((b) => b.classList.add('hidden'));
  } else {
    fsaBtns.forEach((b) => b.classList.add('hidden'));
    fallbackBtns.forEach((b) => b.classList.remove('hidden'));
  }

  root.querySelector('[data-action="new"]').addEventListener('click', () => fileHandler.newFile());
  root.querySelector('[data-action="open"]').addEventListener('click', async () => {
    try {
      await fileHandler.openFile();
    } catch (e) {
      console.error(e);
    }
  });
  root.querySelector('[data-action="save"]').addEventListener('click', async () => {
    try {
      const ok = await fileHandler.saveFile(state.getState().content);
      if (ok) fileHandler.clearDraft();
    } catch (e) {
      console.error(e);
    }
  });
  root.querySelector('[data-action="import"]').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,text/markdown';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const content = await fileHandler.readFileFromInput(file);
        state.loadContent(content, false);
      }
    };
    input.click();
  });
  root.querySelector('[data-action="download"]').addEventListener('click', () => {
    fileHandler.downloadFile(state.getState().content);
  });

  textarea.addEventListener('input', () => {
    state.setContent(textarea.value);
  });

  state.subscribe((s) => {
    if (textarea.value !== s.content) textarea.value = s.content;
    updatePreview(preview, s.content);
    unsavedEl.textContent = s.dirty ? 'Unsaved' : '';
    unsavedEl.classList.toggle('visible', s.dirty);
  });

  const initial = state.getState();
  updatePreview(preview, initial.content);
  unsavedEl.textContent = initial.dirty ? 'Unsaved' : '';
  unsavedEl.classList.toggle('visible', initial.dirty);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const THEME_KEY = 'markdown-editor-theme';
const DRAFT_DEBOUNCE_MS = 400;
let draftTimer = null;

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (_) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.setTheme(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
}

function scheduleDraftPersist(s) {
  if (!s.dirty && s.fileHandle) return;
  if (draftTimer) clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    draftTimer = null;
    fileHandler.persistDraft(s.content);
  }, DRAFT_DEBOUNCE_MS);
}

function init() {
  applyTheme(getPreferredTheme());

  const root = document.getElementById('app');
  if (!root) return;

  const draft = fileHandler.getDraft();
  if (draft && draft.content) {
    const restore = window.confirm('Restore unsaved draft?');
    if (restore) state.loadContent(draft.content, false);
    else fileHandler.clearDraft();
  }
  const { content } = state.getState();
  if (!content) state.setContent(DEFAULT_CONTENT);

  renderApp(root);

  const themeBtn = root.querySelector('[data-action="theme"]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = state.getState().theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to dark mode' : 'Switch to light mode');
      themeBtn.textContent = next === 'dark' ? '☀' : '☽';
    });
    themeBtn.textContent = state.getState().theme === 'dark' ? '☀' : '☽';
    themeBtn.setAttribute('aria-label', state.getState().theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  state.subscribe((s) => scheduleDraftPersist(s));

  window.addEventListener('beforeunload', (e) => {
    if (state.getState().dirty) e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (fileHandler.isFSAAvailable()) {
        root.querySelector('[data-action="save"]')?.click();
      } else {
        root.querySelector('[data-action="download"]')?.click();
      }
    }
  });
}

init();
