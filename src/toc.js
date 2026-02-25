/**
 * Table of contents: inject heading IDs into preview and build TOC links.
 */

/**
 * Generate a URL-safe slug from heading text.
 * @param {string} text
 * @returns {string}
 */
function slug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'heading';
}

/**
 * Inject id attributes into h1–h6 in the container and return TOC entries.
 * Handles duplicate slugs by appending -1, -2, etc.
 * @param {HTMLElement} container - element containing the rendered preview (with headings)
 * @returns {{ level: number, text: string, id: string }[]}
 */
export function injectHeadingIdsAndGetToc(container) {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const used = new Map();
  const entries = [];

  headings.forEach((el) => {
    const level = parseInt(el.tagName.slice(1), 10);
    const text = el.textContent || '';
    let id = slug(text);
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    el.id = id;
    entries.push({ level, text, id });
  });

  return entries;
}

/**
 * Build TOC nav DOM from entries. Links scroll the scrollParent to the heading.
 * @param {{ level: number, text: string, id: string }[]} entries
 * @param {HTMLElement} scrollParent - element that scrolls (the preview container)
 * @returns {DocumentFragment}
 */
export function renderToc(entries, scrollParent) {
  const frag = document.createDocumentFragment();
  if (entries.length === 0) return frag;

  const nav = document.createElement('nav');
  nav.className = 'toc-nav';
  nav.setAttribute('aria-label', 'Table of contents');
  const ul = document.createElement('ul');
  ul.className = 'toc-list';

  entries.forEach(({ level, text, id }) => {
    const li = document.createElement('li');
    li.className = `toc-level-${level}`;
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = text;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = scrollParent.querySelector(`#${CSS.escape(id)}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  frag.appendChild(nav);
  return frag;
}
