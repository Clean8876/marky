import { MarkdownDocument } from "@/modules/viewer/components/MarkdownDocument"
import { useDocument } from "@/modules/document/hooks"

export function ViewerPage() {
  const { content } = useDocument()

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-[800px] rounded-2xl border border-border bg-surface px-5 py-8 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:px-8 sm:py-12 md:px-12">
        <MarkdownDocument content={content} />
      </div>
    </div>
  )
}
