/**
 * Find in document: search textarea, Next/Previous, show match count.
 * @param {HTMLElement} findBar - container with [data-find-input], [data-find-next], [data-find-prev], [data-find-close], [data-find-matches]
 * @param {HTMLTextAreaElement} textarea
 * @returns {{ showAndFocus: () => void }}
 */
export function initFind(findBar, textarea) {
  const input = findBar.querySelector('[data-find-input]');
  const nextBtn = findBar.querySelector('[data-find-next]');
  const prevBtn = findBar.querySelector('[data-find-prev]');
  const closeBtn = findBar.querySelector('[data-find-close]');
  const matchesEl = findBar.querySelector('[data-find-matches]');

  let lastIndex = -1;
  let lastDirection = 1;

  function countMatches() {
    const q = (input?.value || '').trim();
    if (!q) return 0;
    const text = textarea.value;
    const lower = text.toLowerCase();
    const query = q.toLowerCase();
    let n = 0;
    let i = 0;
    while ((i = lower.indexOf(query, i)) !== -1) {
      n++;
      i++;
    }
    return n;
  }

  function updateMatches() {
    if (!matchesEl) return;
    const q = (input?.value || '').trim();
    if (!q) {
      matchesEl.textContent = '';
      return;
    }
    const n = countMatches();
    matchesEl.textContent = n ? `${n} match${n !== 1 ? 'es' : ''}` : 'No matches';
  }

  function findNext(forward) {
    const q = (input?.value || '').trim();
    if (!q) return;
    const text = textarea.value;
    const lower = text.toLowerCase();
    const query = q.toLowerCase();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let idx;
    if (forward) {
      idx = lower.indexOf(query, end);
      if (idx === -1) idx = lower.indexOf(query, 0);
    } else {
      const searchEnd = start > 0 ? start - 1 : 0;
      idx = lower.lastIndexOf(query, searchEnd);
      if (idx === -1) idx = lower.lastIndexOf(query, text.length - 1);
    }
    if (idx === -1) return;
    textarea.focus();
    textarea.setSelectionRange(idx, idx + query.length);
    lastIndex = idx;
    lastDirection = forward ? 1 : -1;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
    const lines = text.slice(0, idx).split('\n').length;
    const scrollTop = (lines - 2) * lineHeight;
    textarea.scrollTop = Math.max(0, scrollTop);
    updateMatches();
  }

  function showAndFocus() {
    findBar.classList.add('open');
    input?.focus();
    input?.select();
    updateMatches();
  }

  function close() {
    findBar.classList.remove('open');
    textarea.focus();
  }

  input?.addEventListener('input', updateMatches);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      findNext(!e.shiftKey);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });
  nextBtn?.addEventListener('click', () => findNext(true));
  prevBtn?.addEventListener('click', () => findNext(false));
  closeBtn?.addEventListener('click', close);

  return { showAndFocus };
}
