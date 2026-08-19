import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export function MdTable({
  className,
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-[10px] border border-border">
      <table className={cn("w-full min-w-max border-collapse text-sm", className)} {...props} />
    </div>
  )
}

export function MdTh({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className={cn(
        "border-b border-border bg-muted/50 px-3 py-2 text-left font-sans text-xs font-medium tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

export function MdTd({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return (
    <td className={cn("border-b border-border px-3 py-2 align-top last:border-b-0", className)} {...props} />
  )
}
