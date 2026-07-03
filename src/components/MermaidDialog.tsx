import { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import { MERMAID_TEMPLATES, asMermaidBlock } from '../utils/mermaidTemplates'
import type { MermaidTemplate } from '../utils/mermaidTemplates'

type MermaidDialogProps = {
  isOpen: boolean
  onClose: () => void
  onInsert: (markdown: string) => void
}

const CATEGORIES = [...new Set(MERMAID_TEMPLATES.map((t) => t.category))]

let previewIdCounter = 0

type PreviewState = { tpl: MermaidTemplate; svg?: string; error?: string }

export function MermaidDialog({ isOpen, onClose, onInsert }: MermaidDialogProps) {
  const [selected, setSelected] = useState<MermaidTemplate>(MERMAID_TEMPLATES[0])
  const [preview, setPreview] = useState<PreviewState | null>(null)

  // Renderiza solo el tipo seleccionado (mermaid ya está inicializado en PreviewPane)
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    const id = `mermaid-dialog-preview-${++previewIdCounter}`
    mermaid
      .render(id, selected.def)
      .then(({ svg }) => {
        if (cancelled) document.getElementById(id)?.remove()
        else setPreview({ tpl: selected, svg })
      })
      .catch((err: unknown) => {
        // mermaid deja un svg de error suelto en el DOM al fallar el parseo
        document.getElementById(id)?.remove()
        if (!cancelled) setPreview({ tpl: selected, error: err instanceof Error ? err.message : String(err) })
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, selected])

  // Escape cierra el diálogo (patrón WAI-ARIA para modales)
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // El preview vigente es el de la plantilla seleccionada; si aún no llegó, está cargando
  const current = preview !== null && preview.tpl === selected ? preview : null

  if (!isOpen) return null

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
        aria-label="Insertar diagrama Mermaid"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--brave-cyan)',
          borderRadius: 8,
          padding: '20px 24px',
          maxWidth: 960,
          width: '95vw',
          height: 'min(620px, 90vh)',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Insertar diagrama Mermaid</h2>
          <button
            type="button"
            className="btn"
            style={{ fontSize: 16, padding: '4px 12px' }}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <nav style={{ width: 220, overflowY: 'auto', paddingRight: 12, flexShrink: 0 }} aria-label="Tipos de diagrama">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <h3 className="mermaid-dialog-category">{cat}</h3>
                {MERMAID_TEMPLATES.filter((t) => t.category === cat).map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    className={`mermaid-type-btn${t === selected ? ' selected' : ''}`}
                    onClick={() => setSelected(t)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Franja divisoria brave-cyan */}
          <div style={{ width: 2, background: 'var(--brave-cyan)', flexShrink: 0 }} aria-hidden="true" />

          <div style={{ flex: 1, paddingLeft: 16, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {current === null && <span style={{ color: 'var(--text-muted)' }}>Cargando…</span>}
              {current?.error !== undefined && (
                <pre style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {current.error}
                </pre>
              )}
              {current?.svg !== undefined && (
                <div style={{ maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: current.svg }} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => onInsert(asMermaidBlock(selected.def))}>
                Insertar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
