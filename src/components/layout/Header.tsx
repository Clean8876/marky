import { Moon, MoreHorizontal, Pencil, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { downloadMarkdown } from "@/modules/document/api"
import { RenameDialog } from "@/modules/document/components/RenameDialog"
import { useDocument } from "@/modules/document/hooks"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          pressed={isDark}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
        >
          {isDark ? <Sun /> : <Moon />}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Light" : "Dark"}</TooltipContent>
    </Tooltip>
  )
}

export function Header() {
  const navigate = useNavigate()
  const { content, filename, hasDocument, mode, setFilename, setMode, closeDocument } =
    useDocument()
  const [renameOpen, setRenameOpen] = useState(false)

  const isEditor = mode === "editor"

  useEffect(() => {
    if (!hasDocument) return

    function onKey(event: KeyboardEvent) {
      if (event.key === "F2") {
        event.preventDefault()
        setRenameOpen(true)
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hasDocument])

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4">
        <Link
          to="/"
          className="shrink-0 text-sm font-medium tracking-tight text-foreground"
        >
          MARKY
        </Link>
        {hasDocument ? (
          <>
            <Separator orientation="vertical" className="h-4" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setRenameOpen(true)}
                  className="min-w-0 truncate rounded-md px-1.5 py-0.5 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {filename}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Rename <Kbd>F2</Kbd>
              </TooltipContent>
            </Tooltip>
          </>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          {!hasDocument ? (
            <ThemeToggle />
          ) : null}
          {hasDocument && isEditor ? (
            <>
              <ThemeToggle />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => downloadMarkdown(filename, content)}
              >
                Download
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Close editor" asChild>
                    <Link to="/" onClick={() => setMode("viewer")}>
                      <X />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close editor</TooltipContent>
              </Tooltip>
            </>
          ) : hasDocument ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <Link to="/edit" onClick={() => setMode("editor")}>
                      <Pencil data-icon="inline-start" />
                      Edit
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Edit <Kbd>⌘E</Kbd>
                </TooltipContent>
              </Tooltip>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label="More actions">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadMarkdown(filename, content)}>
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      closeDocument()
                      navigate("/")
                    }}
                  >
                    Close document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
      <RenameDialog
        open={renameOpen}
        filename={filename}
        onOpenChange={setRenameOpen}
        onRename={setFilename}
      />
    </header>
  )
}
