# MARKY

**Live app:** [https://marky-dun.vercel.app/](https://marky-dun.vercel.app/)

MARKY is a client-side Markdown viewer and editor. Open a `.md` file, paste text, read it on a quiet reading surface, and edit when you need to. Nothing leaves the browser — no accounts, no uploads, no server.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Quick start](#quick-start)
- [Usage](#usage)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Markdown support](#markdown-support)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Privacy](#privacy)
- [License](#license)

---

## Overview

MARKY is built for a simple workflow:

1. **Open** — pick a `.md` file, drag-and-drop one onto the page, or paste Markdown text.
2. **Read** — content renders in a focused, typography-first viewer.
3. **Edit** — switch to a live editor with split-pane preview (desktop) or tabbed edit/preview (mobile).
4. **Download** — save your changes back to a `.md` file locally.

All document content lives in memory for the current session. Theme and preferred mode (viewer vs editor) are the only things persisted — in `localStorage`.

---

## Features

| Area | What MARKY does |
|------|-----------------|
| **Open files** | `.md`, `.markdown`, and plain-text Markdown via file picker or drag-and-drop |
| **Paste** | Type or paste Markdown directly from the empty state |
| **Viewer** | Clean reading layout with serif body text, code blocks, tables, and images |
| **Editor** | CodeMirror 6 with Markdown syntax; live preview beside or in tabs |
| **Syntax highlighting** | Shiki-powered fenced code blocks with copy button |
| **GFM** | GitHub Flavored Markdown via `remark-gfm` (tables, task lists, strikethrough, etc.) |
| **Images** | Click to zoom; graceful fallback when an image fails to load |
| **Theme** | Light / dark toggle; preference stored locally |
| **Responsive** | Split editor on `≥768px`; tabbed edit/preview on smaller screens |
| **Privacy** | 100% client-side — files are never sent to a server |

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm (comes with Node)

### Install and run locally

```bash
git clone https://github.com/Clean8876/marky.git
cd marky
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

Output goes to `dist/`.

---

## Usage

### Open a Markdown file

- Click **Open .md** on the home screen and choose a file, or
- Drag a `.md` file anywhere on the page.

Accepted types: `.md`, `.markdown`, `text/markdown`, `text/plain`.

### Paste Markdown

1. Click **Paste Markdown** on the home screen.
2. Enter or paste your content.
3. Click **View**.

The document opens as `untitled.md` until you download it with a custom name.

### Read (viewer mode)

After opening a document, MARKY shows the rendered Markdown at `/`. The header displays the filename and gives access to **Edit**, **Download**, **Close document**, and the theme toggle.

### Edit

- Click **Edit** in the header, or press `Ctrl+E` / `⌘E`.
- **Desktop:** editor and preview side by side.
- **Mobile:** **Edit** and **Preview** tabs.

Press `Escape` to return to viewer mode.

### Download

- **Viewer:** More menu (⋯) → **Download**, or `Ctrl+S` / `⌘S`.
- **Editor:** **Download** button in the header, or `Ctrl+S` / `⌘S`.

### Close document

More menu (⋯) → **Close document** — clears the in-memory document and returns to the empty state.

### Try the sample file

A sample Markdown file ships at `/sample.md` (source: `public/sample.md`). Open it locally to verify headings, lists, task lists, blockquotes, code blocks, tables, and broken-image handling.

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/⌘ + E` | Toggle viewer ↔ editor |
| `Ctrl/⌘ + S` | Download current document as `.md` |
| `Escape` | Exit editor → viewer |

---

## Markdown support

MARKY uses [react-markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm).

**Supported (non-exhaustive):**

- Headings, paragraphs, emphasis, links
- Ordered and unordered lists (nested)
- Task lists (`- [ ]` / `- [x]`)
- Blockquotes
- Inline and fenced code blocks
- Tables (GFM)
- Horizontal rules
- Images (with lightbox and error fallback)
- Strikethrough (GFM)

**Code highlighting:** JavaScript, TypeScript, TSX, JSX, JSON, CSS, HTML, Markdown, Bash, Python, YAML, XML, SQL (via Shiki). Unknown languages fall back safely.

---

## Architecture

MARKY is a single-page React app with two routes and one in-memory document store.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (client-only)                                      │
│                                                             │
│  main.tsx → AppProviders → App                              │
│                │              │                             │
│                │              ├── FileDrop (global DnD)     │
│                │              ├── Header                    │
│                │              └── AppRoutes                 │
│                │                    ├── /      HomePage     │
│                │                    │            ├ EmptyPage│
│                │                    │            └ ViewerPage
│                │                    └── /edit  EditorPage   │
│                │                              └ EditorWorkspace
│                └── DocumentProvider (React context)       │
│                     content, filename, mode, open/close   │
└─────────────────────────────────────────────────────────────┘
```

### Data flow

1. **Open** — `FileDrop` / `EmptyState` reads a file with `FileReader` or takes pasted text.
2. **Store** — `DocumentProvider` holds `content`, `filename`, `hasDocument`, and `mode` (`empty` | `viewer` | `editor`).
3. **Route** — Opening a document navigates to `/` or `/edit` based on the last-used mode in `localStorage` (`marky-mode`).
4. **Render** — `MarkdownDocument` parses content; `MarkdownEditor` + `MarkdownPreview` handle editing.
5. **Export** — `downloadMarkdown()` creates a Blob and triggers a browser download.

### Persistence

| Key | Storage | Purpose |
|-----|---------|---------|
| `marky-theme` | `localStorage` | `"light"` or `"dark"` |
| `marky-mode` | `localStorage` | Last preferred mode: `"viewer"` or `"editor"` |

Document content is **not** persisted across page reloads.

---

## Project structure

```
MARKY/
├── public/
│   ├── favicon.svg
│   └── sample.md              # Demo Markdown for manual testing
├── src/
│   ├── main.tsx               # React entry + BrowserRouter
│   ├── index.css              # Tailwind, theme tokens, typography
│   ├── app/
│   │   ├── App.tsx            # Layout, keyboard shortcuts, loading overlay
│   │   ├── providers.tsx      # Theme, tooltips, document context, toasts
│   │   └── routes.tsx         # / and /edit
│   ├── components/
│   │   ├── layout/            # Header, AppBackground
│   │   └── ui/                # shadcn/Radix primitives
│   ├── hooks/
│   │   └── use-media-query.ts
│   ├── lib/
│   │   ├── highlight.ts       # Shiki highlighter
│   │   ├── markdown.ts        # remark-gfm plugins
│   │   ├── storage.ts         # localStorage helpers
│   │   └── utils.ts
│   └── modules/
│       ├── document/          # Store, API, FileDrop, EmptyState, pages
│       ├── editor/            # CodeMirror editor, preview, EditorPage
│       └── viewer/            # Markdown renderers, CodeBlock, ViewerPage
├── index.html
├── vite.config.ts
├── components.json            # shadcn/ui config
├── package.json
└── README.md
```

### Module responsibilities

| Module | Role |
|--------|------|
| `document` | Document state, file I/O, empty/home flow, drag-and-drop |
| `viewer` | Read-only Markdown rendering (shared with editor preview) |
| `editor` | CodeMirror editing workspace and `/edit` route |

---

## Tech stack

| Layer | Libraries |
|-------|-----------|
| **Framework** | React 19, TypeScript |
| **Build** | Vite 8 |
| **Routing** | React Router 7 |
| **Styling** | Tailwind CSS 4, shadcn/ui (Radix Nova) |
| **Editor** | CodeMirror 6 (`@uiw/react-codemirror`) |
| **Markdown** | react-markdown, remark-gfm |
| **Highlighting** | Shiki |
| **Theme** | next-themes |
| **Icons** | Lucide React |
| **Toasts** | Sonner |
| **Lint** | oxlint |
| **Fonts** | Geist, Geist Mono, Source Serif 4 |

Path alias: `@/` → `src/` (configured in `vite.config.ts` and `tsconfig`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and production build |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | Run oxlint |

---

## Deployment

The production site is hosted on Vercel:

**[https://marky-dun.vercel.app/](https://marky-dun.vercel.app/)**

MARKY is a static SPA. Deploy steps:

1. Connect the repository to [Vercel](https://vercel.com/).
2. Use the default settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
3. Deploy.

Because the app uses `BrowserRouter`, configure SPA fallback so all routes serve `index.html` (Vercel does this automatically for Vite projects).

No environment variables are required — the app has no backend.

---

## Privacy

- Files are read with the browser `FileReader` API only.
- Content stays in React state for the session.
- No analytics, authentication, or cloud storage are built in.
- Theme and mode preferences use `localStorage` on your device only.

---

## License

Private project (`"private": true` in `package.json`). Add a license file if you plan to open-source or distribute MARKY.
