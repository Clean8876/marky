import CodeMirror from "@uiw/react-codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { EditorView } from "@codemirror/view"
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import { useTheme } from "next-themes"

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={dark ? githubDark : githubLight}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        searchKeymap: true,
        autocompletion: false,
        bracketMatching: true,
      }}
      extensions={[
        markdown(),
        EditorView.lineWrapping,
      ]}
      onChange={onChange}
      className="h-full overflow-hidden"
    />
  )
}
