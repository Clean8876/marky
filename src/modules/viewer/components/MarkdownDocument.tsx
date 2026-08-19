import { Children, isValidElement } from "react"
import type { Components } from "react-markdown"
import Markdown from "react-markdown"
import { useTheme } from "next-themes"

import { markdownRemarkPlugins } from "@/lib/markdown"
import { CodeBlock } from "@/modules/viewer/components/CodeBlock"
import { MdImage } from "@/modules/viewer/components/MdImage"
import { MdTable, MdTd, MdTh } from "@/modules/viewer/components/MdTable"

type MarkdownDocumentProps = {
  content: string
  className?: string
}

export function MarkdownDocument({ content, className }: MarkdownDocumentProps) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  const components: Components = {
    p: ({ children }) => {
      const items = Children.toArray(children)
      const hasBlock = items.some(
        (child) => isValidElement(child) && child.type === MdImage,
      )
      if (hasBlock) {
        return <div className="my-4">{children}</div>
      }
      return <p>{children}</p>
    },
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children }) => {
      const text = String(children).replace(/\n$/, "")
      const match = /language-([\w+-]+)/.exec(className ?? "")
      const isBlock = Boolean(match) || text.includes("\n")

      if (isBlock) {
        return <CodeBlock code={text} language={match?.[1]} dark={dark} />
      }

      return <code className={className}>{children}</code>
    },
    img: ({ src, alt, title }) => (
      <MdImage src={typeof src === "string" ? src : undefined} alt={alt} title={title} />
    ),
    table: ({ children }) => <MdTable>{children}</MdTable>,
    th: ({ children }) => <MdTh>{children}</MdTh>,
    td: ({ children }) => <MdTd>{children}</MdTd>,
    a: ({ href, children, ...props }) => (
      <a href={href} {...props} rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}>
        {children}
      </a>
    ),
  }

  return (
    <article className={className ? `md-doc ${className}` : "md-doc"}>
      <Markdown remarkPlugins={markdownRemarkPlugins} components={components}>
        {content}
      </Markdown>
    </article>
  )
}
