import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { persistMode, readStoredMode, type AppMode } from "@/lib/storage"

type DocumentContextValue = {
  content: string
  filename: string
  hasDocument: boolean
  isLoading: boolean
  mode: AppMode
  openDocument: (content: string, filename?: string) => void
  setContent: (content: string) => void
  setFilename: (filename: string) => void
  setLoading: (value: boolean) => void
  setMode: (mode: AppMode) => void
  closeDocument: () => void
}

const DocumentContext = createContext<DocumentContextValue | null>(null)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState("")
  const [filename, setFilename] = useState("untitled.md")
  const [hasDocument, setHasDocument] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [mode, setModeState] = useState<AppMode>("empty")

  const setMode = useCallback((next: AppMode) => {
    setModeState(next)
    if (next === "viewer" || next === "editor") {
      persistMode(next)
    }
  }, [])

  const openDocument = useCallback(
    (nextContent: string, nextFilename = "untitled.md") => {
      setContent(nextContent)
      setFilename(nextFilename)
      setHasDocument(true)
      const preferred = readStoredMode()
      setMode(preferred)
    },
    [setMode],
  )

  const closeDocument = useCallback(() => {
    setContent("")
    setFilename("untitled.md")
    setHasDocument(false)
    setModeState("empty")
  }, [])

  const value = useMemo(
    () => ({
      content,
      filename,
      hasDocument,
      isLoading,
      mode,
      openDocument,
      setContent,
      setFilename,
      setLoading,
      setMode,
      closeDocument,
    }),
    [
      closeDocument,
      content,
      filename,
      hasDocument,
      isLoading,
      mode,
      openDocument,
      setMode,
    ],
  )

  return (
    <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
  )
}

export function useDocument() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error("useDocument must be used within DocumentProvider")
  }
  return context
}
