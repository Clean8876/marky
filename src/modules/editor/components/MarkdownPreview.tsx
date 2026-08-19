import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownDocument } from "@/modules/viewer/components/MarkdownDocument"

type MarkdownPreviewProps = {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <ScrollArea className="h-full">
      <div className="px-5 py-6 md:px-8 md:py-8">
        <MarkdownDocument content={content} />
      </div>
    </ScrollArea>
  )
}
