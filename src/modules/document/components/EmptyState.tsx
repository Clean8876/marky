import { useRef, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { isMarkdownFile, readFileAsText } from "@/modules/document/api"
import { useDocument } from "@/modules/document/hooks"
import { documentPath } from "@/lib/storage"
import { toast } from "sonner"

export function EmptyState() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const navigate = useNavigate()
  const { openDocument, setLoading } = useDocument()

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!isMarkdownFile(file)) {
      toast.error("This file could not be opened.")
      return
    }

    setLoading(true)
    try {
      const text = await readFileAsText(file)
      if (!text.trim()) {
        toast.error("This file doesn't contain readable Markdown.")
        return
      }
      openDocument(text, file.name)
      navigate(documentPath())
    } catch {
      toast.error("This file could not be opened.")
    } finally {
      setLoading(false)
    }
  }

  function onPaste() {
    const text = draft.trim()
    if (!text) {
      toast.error("This file doesn't contain readable Markdown.")
      return
    }
    openDocument(text, "untitled.md")
    navigate(documentPath())
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          MARKY
        </p>
        <h1 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground">
          Markdown, simply.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Open a Markdown file or paste your text.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          className="sr-only"
          onChange={onFile}
        />

        <div className="mt-8 flex flex-col gap-3">
          <Button
            type="button"
            size="lg"
            className="w-full rounded-lg"
            onClick={() => inputRef.current?.click()}
          >
            <FileUp data-icon="inline-start" />
            Open .md
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full rounded-lg"
            onClick={() => setPasteOpen((open) => !open)}
          >
            Paste Markdown
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Or drop a <span className="font-medium text-foreground">.md</span> file
          anywhere on this page.
        </p>

        {pasteOpen ? (
          <div className="mt-6 grid gap-3">
            <Textarea
              aria-label="Markdown text"
              placeholder="# Hello"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="min-h-40 rounded-[10px] font-mono text-sm"
            />
            <Button type="button" onClick={onPaste} className="justify-self-end">
              View
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
