import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { STORAGE_KEYS } from "@/lib/storage"
import { DocumentProvider } from "@/modules/document/document-store"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey={STORAGE_KEYS.theme}
    >
      <TooltipProvider delayDuration={200}>
        <DocumentProvider>
          {children}
          <Toaster position="bottom-center" />
        </DocumentProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
