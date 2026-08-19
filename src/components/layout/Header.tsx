import { Moon, MoreHorizontal, Pencil, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
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
  const { content, filename, hasDocument, mode, setMode, closeDocument } =
    useDocument()

  if (!hasDocument) {
    return null
  }

  const isEditor = mode === "editor"

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4">
        <Link
          to="/"
          className="shrink-0 text-sm font-medium tracking-tight text-foreground"
        >
          MARKY
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="min-w-0 truncate text-sm text-muted-foreground" title={filename}>
          {filename}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {isEditor ? (
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
          ) : (
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
          )}
        </div>
      </div>
    </header>
  )
}
