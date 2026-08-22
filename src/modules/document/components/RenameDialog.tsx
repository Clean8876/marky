import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { normalizeFilename } from "@/modules/document/api"

type RenameDialogProps = {
  open: boolean
  filename: string
  onOpenChange: (open: boolean) => void
  onRename: (filename: string) => void
}

export function RenameDialog({
  open,
  filename,
  onOpenChange,
  onRename,
}: RenameDialogProps) {
  const [draft, setDraft] = useState(filename)
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setDraft(filename)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim()) return
    onRename(normalizeFilename(draft))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Escape stays local so it doesn't also trigger the global "leave editor" shortcut. */}
      <DialogContent onEscapeKeyDown={(event) => event.stopPropagation()}>
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
            <DialogDescription>
              Sets the name shown in the header and used when you download.
            </DialogDescription>
          </DialogHeader>
          <Input
            aria-label="File name"
            placeholder="untitled.md"
            spellCheck={false}
            autoComplete="off"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
