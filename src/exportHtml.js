/**
 * Export the current preview as a standalone HTML file with inline CSS.
 * @param {HTMLElement} previewEl - the .preview container
 * @param {string} [filename] - download filename (e.g. "document.html")
 */
export function exportAsHtml(previewEl, filename = 'export.html') {
  const content = previewEl?.innerHTML ?? '';
  const title = document.querySelector('.doc-title')?.textContent?.trim() || 'Exported document';
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const bgPrimary = isDark ? '#1a1a1a' : '#f8f9fa';
  const bgSecondary = isDark ? '#252525' : '#fff';
  const textPrimary = isDark ? '#e9ecef' : '#1a1a1a';
  const textSecondary = isDark ? '#adb5bd' : '#495057';
  const border = isDark ? '#495057' : '#dee2e6';
  const preBg = isDark ? '#2d2d2d' : '#f1f3f5';
  const accent = isDark ? '#339af0' : '#0d6efd';

  const style = `
body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background: ${bgPrimary}; color: ${textPrimary}; }
.preview { padding: 1rem; max-width: 800px; margin: 0 auto; }
.preview h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
.preview h2 { font-size: 1.4rem; margin: 1rem 0 0.5rem; }
.preview h3 { font-size: 1.2rem; margin: 0.75rem 0 0.25rem; }
.preview h4, .preview h5, .preview h6 { font-size: 1rem; margin: 0.5rem 0; }
.preview p { margin: 0 0 0.75rem; line-height: 1.6; }
.preview ul, .preview ol { margin: 0 0 0.75rem; padding-left: 1.5rem; }
.preview code { background: ${preBg}; color: ${textPrimary}; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
.preview pre { background: ${preBg}; padding: 1rem; border-radius: 6px; overflow: auto; margin: 0 0 0.75rem; }
.preview pre code { padding: 0; background: none; }
.preview blockquote { border-left: 4px solid ${border}; margin: 0 0 0.75rem; padding-left: 1rem; color: ${textSecondary}; }
.preview hr { border: none; border-top: 1px solid ${border}; margin: 1rem 0; }
.preview a { color: ${accent}; }
.preview img { max-width: 100%; height: auto; }
.preview .mermaid, .preview .graphviz-output { margin: 1rem 0; }
.preview .mermaid-error, .preview .graphviz-error { color: ${textSecondary}; font-style: italic; }
.preview .graphviz-output svg { max-width: 100%; height: auto; }
.preview table { border-collapse: collapse; width: 100%; margin-bottom: 0.75rem; }
.preview th, .preview td { border: 1px solid ${border}; padding: 0.4rem 0.6rem; text-align: left; }
.preview th { background: ${preBg}; }
.preview-empty { color: ${textSecondary}; font-style: italic; }
`.trim();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtmlAttr(title)}</title>
<style>${style}</style>
</head>
<body>
<div class="preview">${content}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
