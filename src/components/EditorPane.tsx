import { forwardRef, memo, useRef, useEffect, useState, useImperativeHandle } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView, placeholder } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'
import type { EditorSelection } from '../types'

export type EditorPaneHandle = {
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

type Anchor = { line: number; top: number }

// Interpola la posición vertical del preview para una línea de origen dada.
function lineToTop(anchors: Anchor[], lineF: number): number {
  if (lineF <= anchors[0].line) return anchors[0].top
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i], b = anchors[i + 1]
    if (lineF < b.line) {
      const t = (lineF - a.line) / (b.line - a.line || 1)
      return a.top + t * (b.top - a.top)
    }
  }
  return anchors[anchors.length - 1].top
}

// Interpola la línea de origen para una posición vertical del preview.
function topToLine(anchors: Anchor[], top: number): number {
  if (top <= anchors[0].top) return anchors[0].line
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i], b = anchors[i + 1]
    if (top < b.top) {
      const t = (top - a.top) / (b.top - a.top || 1)
      return a.line + t * (b.line - a.line)
    }
  }
  return anchors[anchors.length - 1].line
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

  // Sincronizar scroll en ambos sentidos, anclado a la línea de origen
  useEffect(() => {
    if (!syncScroll || !editorReady || !previewRef?.current || !editorViewRef.current) return

    const view = editorViewRef.current
    const editorDOM = view.scrollDOM
    const previewDOM = previewRef.current
    let rafId: number | null = null

    // Posición (relativa al contenido del preview) de cada bloque con data-source-line
    const getAnchors = (): Anchor[] => {
      const base = previewDOM.getBoundingClientRect().top - previewDOM.scrollTop
      const anchors: Anchor[] = []
      previewDOM.querySelectorAll<HTMLElement>('[data-source-line]').forEach((el) => {
        const line = Number(el.dataset.sourceLine)
        if (Number.isFinite(line)) anchors.push({ line, top: el.getBoundingClientRect().top - base })
      })
      return anchors
    }

    const editorToPreview = () => {
      const anchors = getAnchors()
      if (!anchors.length) return
      const block = view.lineBlockAtHeight(editorDOM.scrollTop)
      const line = view.state.doc.lineAt(block.from).number
      const frac = block.height > 0 ? Math.min(1, Math.max(0, (editorDOM.scrollTop - block.top) / block.height)) : 0
      previewDOM.scrollTop = lineToTop(anchors, line + frac)
    }

    const previewToEditor = () => {
      const anchors = getAnchors()
      if (!anchors.length) return
      const doc = view.state.doc
      const lineF = topToLine(anchors, previewDOM.scrollTop)
      const lineInt = Math.min(doc.lines, Math.max(1, Math.floor(lineF)))
      const block = view.lineBlockAt(doc.line(lineInt).from)
      editorDOM.scrollTop = block.top + (lineF - lineInt) * block.height
    }

    // isScrollingRef evita el bucle de eco entre ambos paneles
    const sync = (fn: () => void) => () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (isScrollingRef.current) {
          isScrollingRef.current = false
          return
        }
        isScrollingRef.current = true
        fn()
        setTimeout(() => { isScrollingRef.current = false }, 50)
      })
    }

    const onEditorScroll = sync(editorToPreview)
    const onPreviewScroll = sync(previewToEditor)
    editorDOM.addEventListener('scroll', onEditorScroll, { passive: true })
    previewDOM.addEventListener('scroll', onPreviewScroll, { passive: true })

    return () => {
      editorDOM.removeEventListener('scroll', onEditorScroll)
      previewDOM.removeEventListener('scroll', onPreviewScroll)
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
        onCreateEditor={(view) => {
          editorViewRef.current = view
          setEditorReady(true)
        }}
      />
    </div>
  )
})

export const EditorPane = memo(EditorPaneComponent)
