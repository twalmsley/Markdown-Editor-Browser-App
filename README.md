# Markdown Editor Web App

A browser-only markdown editor with live preview, file handling via the File System Access API, and rich rendering (LaTeX, syntax highlighting, Mermaid, Graphviz, SVG).

## Features

- **Dual panel**: Edit raw markdown on the left, see rendered preview on the right
- **Resizable split** on desktop; **Edit / Preview** tabs on small screens
- **Toolbar** for bold, italic, code, headings, links, lists, blockquote, code blocks, and more
- **File System Access API**: Open and save `.md` files (Chrome, Edge). Fallback: Import and Download when unsupported
- **Draft persistence**: Unsaved or edited content is stored in localStorage until you save
- **Light and dark themes** with a header toggle (persisted)
- **Rendering**: LaTeX (KaTeX), code blocks (highlight.js), Mermaid diagrams, Graphviz (DOT), and inline SVG

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`).

## Build

```bash
npm run build
```

Output is in `dist/`. Serve with any static host or `npm run preview`.

## Tech stack

- Vite (vanilla JS, no framework)
- markdown-it, DOMPurify, KaTeX, highlight.js, Mermaid, @viz-js/viz
