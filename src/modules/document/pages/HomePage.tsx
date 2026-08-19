import { useEffect } from "react"

import { EmptyPage } from "@/modules/document/pages/EmptyPage"
import { useDocument } from "@/modules/document/hooks"
import { ViewerPage } from "@/modules/viewer/pages/ViewerPage"

export function HomePage() {
  const { hasDocument, setMode } = useDocument()

  useEffect(() => {
    if (hasDocument) {
      setMode("viewer")
    }
  }, [hasDocument, setMode])

  if (!hasDocument) {
    return <EmptyPage />
  }

  return <ViewerPage />
}
