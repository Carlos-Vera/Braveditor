import { forwardRef, memo, useRef, useEffect, useState, useImperativeHandle } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView, placeholder } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'
import type { EditorSelection } from '../types'

export type EditorPaneHandle = {
  focus: () => void
  setSelection: (from: number, to: number) => void
}

const EDITOR_FONT_SIZE = 14

// Tema oscuro personalizado
const darkTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#0d0d0d',
    foreground: '#e0e0e0',
    caret: '#e0e0e0',
    selection: '#264f78',
    selectionMatch: '#264f78',
    lineHighlight: '#1a1a1a',
    gutterBackground: '#0d0d0d',
    gutterForeground: '#6b7280',
    gutterBorder: 'transparent',
  },
  styles: [
    { tag: t.comment, color: '#6b7280' },
    { tag: t.variableName, color: '#e0e0e0' },
    { tag: [t.string, t.special(t.brace)], color: '#10b981' },
    { tag: t.number, color: '#fb923c' },
    { tag: t.bool, color: '#fb923c' },
    { tag: t.null, color: '#fb923c' },
    { tag: t.keyword, color: '#3b82f6' },
    { tag: t.operator, color: '#9ca3af' },
    { tag: t.className, color: '#60a5fa' },
    { tag: t.definition(t.typeName), color: '#60a5fa' },
    { tag: t.typeName, color: '#60a5fa' },
    { tag: t.angleBracket, color: '#6b7280' },
    { tag: t.tagName, color: '#3b82f6' },
    { tag: t.attributeName, color: '#60a5fa' },
    { tag: t.heading, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.strong, color: '#fbbf24', fontWeight: 'bold' },
    { tag: t.emphasis, color: '#a78bfa', fontStyle: 'italic' },
    { tag: t.link, color: '#34d399', textDecoration: 'underline' },
    { tag: t.url, color: '#34d399' },
    { tag: t.monospace, color: '#fb923c', background: '#1a1a1a' },
  ],
})

type EditorPaneProps = {
  value: string
  onChange: (value: string) => void
  onSelect?: (selection: EditorSelection) => void
  previewRef?: React.RefObject<HTMLDivElement>
  syncScroll?: boolean
}

const EditorPaneComponent = forwardRef<EditorPaneHandle, EditorPaneProps>(function EditorPane(
  { value, onChange, onSelect, previewRef, syncScroll = false },
  ref
) {
  const isScrollingRef = useRef(false)
  const editorViewRef = useRef<EditorView | null>(null)
  const [editorReady, setEditorReady] = useState(false)

  // Exponer métodos del editor al componente padre
  useImperativeHandle(ref, () => ({
    focus: () => {
      editorViewRef.current?.focus()
    },
    setSelection: (from: number, to: number) => {
      if (!editorViewRef.current) return
      const view = editorViewRef.current
      view.dispatch({
        selection: { anchor: from, head: to },
      })
      view.focus()
    },
  }))

  // Extensiones de CodeMirror
  const extensions = [
    markdown(),
    EditorView.lineWrapping,
    placeholder('Escribe aquí tu código...'),
    EditorView.updateListener.of((update) => {
      // Capturar cambios de selección (solo cuando cambia la selección, no por scroll)
      if (update.selectionSet && onSelect) {
        const selection = update.state.selection.main
        onSelect({
          start: selection.from,
          end: selection.to,
        })
      }
    }),
  ]

  // Sincronizar scroll con preview (separado del updateListener)
  useEffect(() => {
    if (!syncScroll || !editorReady || !previewRef?.current || !editorViewRef.current) return

    const scrollDOM = editorViewRef.current.scrollDOM
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId) return // Ya hay un requestAnimationFrame pendiente

      rafId = requestAnimationFrame(() => {
        rafId = null

        if (isScrollingRef.current || !previewRef?.current) {
          isScrollingRef.current = false
          return
        }

        const denom = scrollDOM.scrollHeight - scrollDOM.clientHeight
        const scrollPercentage = denom > 0 ? scrollDOM.scrollTop / denom : 0

        isScrollingRef.current = true
        previewRef.current.scrollTop = scrollPercentage * (previewRef.current.scrollHeight - previewRef.current.clientHeight)

        // Reset flag después de un breve delay
        setTimeout(() => {
          isScrollingRef.current = false
        }, 50)
      })
    }

    scrollDOM?.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollDOM?.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [syncScroll, editorReady, previewRef])

  // Estilos del editor
  const editorStyle = {
    height: '100%',
    fontSize: EDITOR_FONT_SIZE,
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <CodeMirror
        value={value}
        height="100%"
        theme={darkTheme}
        extensions={extensions}
        onChange={onChange}
        style={editorStyle}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        onCreateEditor={(view) => {
          editorViewRef.current = view
          setEditorReady(true)
        }}
      />
    </div>
  )
})

export const EditorPane = memo(EditorPaneComponent)
