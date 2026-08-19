import { createHighlighter, type Highlighter } from "shiki/bundle/web"

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
}

const LANGS = [
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "json",
  "css",
  "html",
  "markdown",
  "bash",
  "python",
  "yaml",
  "xml",
  "sql",
] as const

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...LANGS],
  })
  return highlighterPromise
}

export function normalizeLanguage(language?: string) {
  if (!language) return "text"
  const key = language.trim().toLowerCase()
  return LANGUAGE_ALIASES[key] ?? key
}

export async function highlightCode(code: string, language?: string, dark = false) {
  const fallback = () => {
    const escaped = code
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
    return `<pre><code>${escaped}</code></pre>`
  }

  try {
    const highlighter = await getHighlighter()
    const lang = normalizeLanguage(language)
    const loaded = highlighter.getLoadedLanguages()
    const resolved = loaded.includes(lang) ? lang : "javascript"

    return await highlighter.codeToHtml(code, {
      lang: resolved,
      theme: dark ? "github-dark" : "github-light",
    })
  } catch {
    return fallback()
  }
}
