import { useState } from "react"
import { ImageOff } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

type MdImageProps = {
  src?: string
  alt?: string
  title?: string
}

export function MdImage({ src, alt = "", title }: MdImageProps) {
  const [broken, setBroken] = useState(false)
  const [open, setOpen] = useState(false)

  if (!src || broken) {
    return (
      <span className="my-6 inline-flex items-center gap-2 rounded-[12px] border border-dashed border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
        <ImageOff className="size-4 shrink-0" />
        {alt || "Image could not be loaded"}
      </span>
    )
  }

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        className="my-6 inline-block max-w-full cursor-zoom-in rounded-[12px]"
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setOpen(true)
          }
        }}
        aria-label={alt ? `View image: ${alt}` : "View image"}
      >
        <img
          src={src}
          alt={alt}
          title={title}
          className="h-auto max-w-full rounded-[12px]"
          onError={() => setBroken(true)}
        />
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(96vw,960px)] border-border bg-background p-3">
          <DialogTitle className="sr-only">{alt || "Image preview"}</DialogTitle>
          <DialogDescription className="sr-only">
            Larger view of the Markdown image.
          </DialogDescription>
          <img src={src} alt={alt} className="mx-auto max-h-[80vh] w-auto max-w-full rounded-lg" />
        </DialogContent>
      </Dialog>
    </>
  )
}
