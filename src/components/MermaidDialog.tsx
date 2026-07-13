import { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import { SyntaxExample } from './SyntaxExample'
import { MERMAID_TEMPLATES, asMermaidBlock } from '../utils/mermaidTemplates'

type MermaidDialogProps = {
  isOpen: boolean
  onClose: () => void
  onInsert: (markdown: string) => void
}

let previewIdCounter = 0

// label → svg renderizado (o mensaje de error prefijado con "error:")
type PreviewMap = Record<string, string>

export function MermaidDialog({ isOpen, onClose, onInsert }: MermaidDialogProps) {
  const [previews, setPreviews] = useState<PreviewMap>({})

  // Renderiza todos los previews al abrir (mermaid ya está inicializado en PreviewPane)
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    Promise.all(
      MERMAID_TEMPLATES.map(async (t) => {
        const id = `mermaid-dialog-preview-${++previewIdCounter}`
        try {
          // El gantt se renderiza a ~1500px de ancho por defecto y queda ilegible
          // al encajarlo en la columna; se fija un ancho acorde solo en el preview
          const def = t.def.startsWith('gantt')
            ? '%%{init: {"gantt": {"useWidth": 620, "axisFormat": "%d/%m", "tickInterval": "1week"}}}%%\n' + t.def
            : t.def
          const { svg } = await mermaid.render(id, def)
          return [t.label, svg] as const
        } catch (err) {
          // mermaid deja un svg de error suelto en el DOM al fallar el parseo
          document.getElementById(id)?.remove()
          return [t.label, `error:${err instanceof Error ? err.message : String(err)}`] as const
        }
      }),
    ).then((entries) => {
      if (!cancelled) setPreviews(Object.fromEntries(entries))
    })
    return () => {
      cancelled = true
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const renderedPreview = (label: string): React.ReactNode => {
    const preview = previews[label]
    if (preview === undefined) return <span style={{ color: 'var(--text-muted)' }}>Cargando…</span>
    if (preview.startsWith('error:')) {
      return <pre style={{ color: 'var(--brave-red)', fontSize: 12, whiteSpace: 'pre-wrap', margin: 0 }}>{preview.slice(6)}</pre>
    }
    return <div className="mermaid-dialog-svg" style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: preview }} />
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Opciones de código Mermaid"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '24px 32px',
          maxWidth: 1200,
          width: '95vw',
          maxHeight: '90vh',
          overflow: 'auto',
          color: 'var(--text)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Insertar código Mermaid</h2>
          <button
            type="button"
            className="btn"
            style={{ fontSize: 18, padding: '4px 12px' }}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div style={{ lineHeight: 1.6 }}>
          {MERMAID_TEMPLATES.map((t) => (
            <SyntaxExample
              key={t.label}
              title={t.label}
              code={t.def}
              customPreview={renderedPreview(t.label)}
              onInsert={(code) => onInsert(asMermaidBlock(code))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
