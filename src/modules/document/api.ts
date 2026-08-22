const MARKDOWN_EXTENSIONS = [".md", ".markdown"]

export function isMarkdownFile(file: File) {
  const name = file.name.toLowerCase()
  return (
    name.endsWith(".md") ||
    name.endsWith(".markdown") ||
    file.type === "text/markdown" ||
    file.type === "text/plain"
  )
}

export function normalizeFilename(input: string) {
  const cleaned = input.replace(/[\\/:*?"<>|]/g, "").trim()
  const extension = MARKDOWN_EXTENSIONS.find((value) =>
    cleaned.toLowerCase().endsWith(value),
  )
  const base = (extension ? cleaned.slice(0, -extension.length) : cleaned).trim()
  if (!base) return "untitled.md"
  return `${base}${extension ?? ".md"}`
}

export function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }
      reject(new Error("unreadable"))
    }
    reader.onerror = () => reject(reader.error ?? new Error("unreadable"))
    reader.readAsText(file)
  })
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = normalizeFilename(filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
