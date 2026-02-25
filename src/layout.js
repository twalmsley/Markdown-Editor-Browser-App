const STORAGE_KEY = 'markdown-editor-split';
const DEFAULT_RATIO = 0.5;
const MIN_PANEL_PX = 200;

/**
 * Initialize resizable split between editor and preview.
 * @param {HTMLElement} main - .app-main
 * @param {HTMLElement} editorWrap - .editor-wrap
 * @param {HTMLElement} previewWrap - .preview-wrap
 * @param {HTMLElement} divider - .split-divider
 */
export function initSplit(main, editorWrap, previewWrap, divider) {
  let ratio = DEFAULT_RATIO;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored != null) ratio = Math.max(0.2, Math.min(0.8, parseFloat(stored)));
  } catch (_) {}

  function applyRatio() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    editorWrap.style.flex = 'none';
    previewWrap.style.flex = 'none';
    const total = main.clientWidth;
    const divW = 6;
    const editorW = Math.max(MIN_PANEL_PX, Math.round(total * ratio));
    const previewW = total - editorW - divW;
    editorWrap.style.width = editorW + 'px';
    previewWrap.style.width = previewW + 'px';
  }

  function persistRatio() {
    try {
      const total = main.clientWidth;
      if (total > 0) localStorage.setItem(STORAGE_KEY, (editorWrap.offsetWidth / total).toFixed(3));
    } catch (_) {}
  }

  let dragging = false;
  function onMove(e) {
    if (!dragging) return;
    const total = main.clientWidth;
    const divW = 6;
    const x = e.clientX - main.getBoundingClientRect().left;
    const r = Math.max(MIN_PANEL_PX / total, Math.min(1 - MIN_PANEL_PX / total - divW / total, x / total));
    ratio = r;
    applyRatio();
  }

  function onUp() {
    dragging = false;
    persistRatio();
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  divider.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    dragging = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });

  window.addEventListener('resize', applyRatio);
  applyRatio();
}

/**
 * Mobile: toggle between Edit and Preview.
 * @param {HTMLElement} main
 * @param {HTMLElement} editorWrap
 * @param {HTMLElement} previewWrap
 * @param {HTMLElement} viewTabs - container with [data-view="edit"] and [data-view="preview"]
 */
export function initViewToggle(main, editorWrap, previewWrap, viewTabs) {
  if (!viewTabs) return;
  const editBtn = viewTabs.querySelector('[data-view="edit"]');
  const previewBtn = viewTabs.querySelector('[data-view="preview"]');
  const mq = window.matchMedia('(max-width: 768px)');

  function setView(view) {
    if (view === 'edit') {
      editorWrap.classList.add('view-active');
      previewWrap.classList.remove('view-active');
      editBtn?.classList.add('active');
      previewBtn?.classList.remove('active');
    } else {
      editorWrap.classList.remove('view-active');
      previewWrap.classList.add('view-active');
      editBtn?.classList.remove('active');
      previewBtn?.classList.add('active');
    }
  }

  editBtn?.addEventListener('click', () => setView('edit'));
  previewBtn?.addEventListener('click', () => setView('preview'));

  function onResize() {
    if (mq.matches) {
      viewTabs.classList.add('visible');
      if (!editorWrap.classList.contains('view-active') && !previewWrap.classList.contains('view-active')) {
        setView('edit');
      }
    } else {
      viewTabs.classList.remove('visible');
      editorWrap.classList.remove('view-active');
      previewWrap.classList.remove('view-active');
      editBtn?.classList.remove('active');
      previewBtn?.classList.remove('active');
    }
  }
  mq.addEventListener('change', onResize);
  onResize();
}
