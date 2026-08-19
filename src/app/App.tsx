import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AppRoutes } from "@/app/routes"
import { AppBackground } from "@/components/layout/AppBackground"
import { Header } from "@/components/layout/Header"
import { downloadMarkdown } from "@/modules/document/api"
import { FileDrop } from "@/modules/document/components/FileDrop"
import { useDocument } from "@/modules/document/hooks"

export function App() {
  const navigate = useNavigate()
  const { content, filename, hasDocument, isLoading, mode, setMode } = useDocument()

  useEffect(() => {
    document.title = hasDocument ? `${filename} · MARKY` : "MARKY"
  }, [filename, hasDocument])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey

      if (meta && event.key.toLowerCase() === "e" && hasDocument) {
        event.preventDefault()
        if (mode === "editor") {
          setMode("viewer")
          navigate("/")
        } else {
          setMode("editor")
          navigate("/edit")
        }
      }

      if (meta && event.key.toLowerCase() === "s" && hasDocument) {
        event.preventDefault()
        downloadMarkdown(filename, content)
      }

      if (event.key === "Escape" && mode === "editor") {
        setMode("viewer")
        navigate("/")
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [content, filename, hasDocument, mode, navigate, setMode])

  return (
    <>
      <AppBackground />
      <FileDrop>
        <div
          className={
            hasDocument && mode === "editor"
              ? "flex h-svh flex-col overflow-hidden"
              : "flex min-h-svh flex-col"
          }
        >
          <Header />
          <main className="flex min-h-0 flex-1 flex-col">
            <AppRoutes />
          </main>
        </div>
      </FileDrop>
      {isLoading ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/40">
          <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
          <span className="sr-only">Loading Markdown</span>
        </div>
      ) : null}
    </>
  )
}
