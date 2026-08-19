import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { highlightCode, normalizeLanguage } from "@/lib/highlight"
import { cn } from "@/lib/utils"

type CodeBlockProps = {
  code: string
  language?: string
  dark?: boolean
}

export function CodeBlock({ code, language, dark = false }: CodeBlockProps) {
  const [html, setHtml] = useState("")
  const [copied, setCopied] = useState(false)
  const label = language ? normalizeLanguage(language) : "text"

  useEffect(() => {
    let cancelled = false
    void highlightCode(code, language, dark).then((result) => {
      if (!cancelled) setHtml(result)
    })
    return () => {
      cancelled = true
    }
  }, [code, dark, language])

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <figure className="group relative my-6 overflow-hidden rounded-[12px] border border-border bg-muted/40">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <Badge variant="secondary" className="font-mono text-[11px] font-normal capitalize">
          {label}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
          onClick={() => void copy()}
          aria-label="Copy code"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </figcaption>
      <div className="overflow-x-auto">
        {html ? (
          <div
            className={cn("[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-4 [&_code]:font-mono")}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="p-4">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </figure>
  )
}
