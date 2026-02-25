/**
 * Application state: content, file handle, dirty flag, theme.
 * No persistence here; see fileHandler.js for localStorage/FSA.
 */
let content = '';
let fileHandle = null;
let fileName = null;
let lastSavedContent = '';
let dirty = false;
let theme = 'light';

const listeners = new Set();

function getState() {
  return {
    content,
    fileHandle,
    fileName,
    lastSavedContent,
    dirty,
    theme,
  };
}

function setContent(value) {
  if (content === value) return;
  content = value;
  dirty = content !== lastSavedContent;
  emit();
}

function setFileHandle(handle) {
  fileHandle = handle;
  emit();
}

function setFileName(name) {
  fileName = name ?? null;
  emit();
}

function setLastSavedContent(value) {
  lastSavedContent = value;
  dirty = content !== lastSavedContent;
  emit();
}

function setDirty(value) {
  dirty = value;
  emit();
}

function setTheme(value) {
  theme = value;
  emit();
}

function resetForNewFile() {
  content = '';
  fileHandle = null;
  fileName = null;
  lastSavedContent = '';
  dirty = false;
  emit();
}

function loadContent(value, fromFile = false) {
  content = value;
  if (fromFile) {
    lastSavedContent = value;
    dirty = false;
  } else {
    dirty = true;
  }
  emit();
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  const state = getState();
  listeners.forEach((fn) => fn(state));
}

export default {
  getState,
  setContent,
  setFileHandle,
  setFileName,
  setLastSavedContent,
  setDirty,
  setTheme,
  resetForNewFile,
  loadContent,
  subscribe,
};
