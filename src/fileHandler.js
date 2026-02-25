/**
 * File System Access API open/save, fallback download/import, and draft persistence.
 */
import state from './state.js';

const DRAFT_KEY = 'markdown-editor-draft';

export function isFSAAvailable() {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
}

/**
 * Open a file via FSA. Returns content and stores handle in state.
 */
export async function openFile() {
  if (!isFSAAvailable()) return null;
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{ accept: { 'text/markdown': ['.md', '.markdown'] } }],
      multiple: false,
    });
    const file = await handle.getFile();
    const content = await file.text();
    state.setFileHandle(handle);
    state.setFileName(handle.name);
    state.loadContent(content, true);
    return content;
  } catch (err) {
    if (err.name === 'AbortError') return null;
    throw err;
  }
}

/**
 * Save content via FSA. If we have a handle, use it; otherwise show save picker.
 */
export async function saveFile(content) {
  if (!isFSAAvailable()) return false;
  try {
    let handle = state.getState().fileHandle;
    if (!handle) {
      handle = await window.showSaveFilePicker({
        types: [{ accept: { 'text/markdown': ['.md', '.markdown'] } }],
      });
      state.setFileHandle(handle);
      state.setFileName(handle.name);
    }
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    state.setLastSavedContent(content);
    return true;
  } catch (err) {
    if (err.name === 'AbortError') return false;
    throw err;
  }
}

/**
 * New file: clear handle and content, mark dirty.
 */
export function newFile() {
  state.resetForNewFile();
  state.setContent('');
}

/**
 * Fallback: download content as .md file (no FSA).
 */
export function downloadFile(content, filename = 'untitled.md') {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Fallback: read file from <input type="file">.
 */
export function readFileFromInput(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Persist draft to localStorage (debounced from outside).
 */
export function persistDraft(content) {
  try {
    const payload = JSON.stringify({ content, updatedAt: Date.now() });
    localStorage.setItem(DRAFT_KEY, payload);
  } catch (_) {}
}

/**
 * Clear draft from localStorage (e.g. after save).
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (_) {}
}

/**
 * Get draft from localStorage, if any.
 * @returns {{ content: string, updatedAt: number } | null}
 */
export function getDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.content === 'string') return data;
    return null;
  } catch (_) {
    return null;
  }
}
