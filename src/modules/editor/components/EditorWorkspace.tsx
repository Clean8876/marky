import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownEditor } from "@/modules/editor/components/MarkdownEditor"
import { MarkdownPreview } from "@/modules/editor/components/MarkdownPreview"
import { useDocument } from "@/modules/document/hooks"
import { useMediaQuery } from "@/hooks/use-media-query"

export function EditorWorkspace() {
  const { content, setContent } = useDocument()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [tab, setTab] = useState("edit")

  if (isDesktop) {
    return (
      <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-border">
        <section aria-label="Markdown editor" className="min-h-0 overflow-hidden bg-surface/80">
          <MarkdownEditor value={content} onChange={setContent} />
        </section>
        <section aria-label="Live preview" className="min-h-0 overflow-hidden bg-surface">
          <MarkdownPreview content={content} />
        </section>
      </div>
    )
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col gap-0">
      <div className="border-b border-border px-4 py-2">
        <TabsList aria-label="Editor views">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="edit" className="min-h-0 flex-1 bg-surface/80">
        <MarkdownEditor value={content} onChange={setContent} />
      </TabsContent>
      <TabsContent value="preview" className="min-h-0 flex-1 bg-surface">
        <MarkdownPreview content={content} />
      </TabsContent>
    </Tabs>
  )
}
