import { useCallback, type DragEvent, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { isMarkdownFile, readFileAsText } from "@/modules/document/api"
import { useDocument } from "@/modules/document/hooks"
import { documentPath } from "@/lib/storage"

type FileDropProps = {
  children: ReactNode
}

export function FileDrop({ children }: FileDropProps) {
  const navigate = useNavigate()
  const { openDocument, setLoading } = useDocument()

  const onFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files)[0]
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
    },
    [navigate, openDocument, setLoading],
  )

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (event.dataTransfer.files.length) {
        void onFiles(event.dataTransfer.files)
      }
    },
    [onFiles],
  )

  return (
    <div
      className="relative z-10"
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDrop={onDrop}
    >
      {children}
    </div>
  )
}
