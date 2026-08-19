import { Navigate } from "react-router-dom"
import { useEffect } from "react"

import { EditorWorkspace } from "@/modules/editor/components/EditorWorkspace"
import { useDocument } from "@/modules/document/hooks"

export function EditorPage() {
  const { hasDocument, setMode } = useDocument()

  useEffect(() => {
    if (hasDocument) {
      setMode("editor")
    }
  }, [hasDocument, setMode])

  if (!hasDocument) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorWorkspace />
    </div>
  )
}
