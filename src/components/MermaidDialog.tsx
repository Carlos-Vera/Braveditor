import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'
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

// Mismos iconos que los controles del visualizador de PreviewPane
const ICONS = {
  zoomIn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
  zoomOut: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
  reset: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  expand: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  collapse: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
}

export function MermaidDialog({ isOpen, onClose, onInsert }: MermaidDialogProps) {
  const [selected, setSelected] = useState<MermaidTemplate>(MERMAID_TEMPLATES[0])
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [expanded, setExpanded] = useState(false)
  const svgHostRef = useRef<HTMLDivElement>(null)
  const panZoomRef = useRef<SvgPanZoom.Instance | null>(null)

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

  // Escape: primero sale de pantalla completa, después cierra el diálogo (patrón WAI-ARIA)
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (expanded) setExpanded(false)
      else onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose, expanded])

  // El preview vigente es el de la plantilla seleccionada; si aún no llegó, está cargando
  const current = preview !== null && preview.tpl === selected ? preview : null

  // Pan/zoom sobre el svg del preview: el mismo motor y opciones que el visualizador
  useEffect(() => {
    const svgEl = svgHostRef.current?.querySelector('svg')
    if (!svgEl || current?.svg === undefined) return
    svgEl.style.width = '100%'
    svgEl.style.height = '100%'
    svgEl.style.maxWidth = 'none'
    const pz = svgPanZoom(svgEl, {
      zoomEnabled: true,
      panEnabled: true,
      dblClickZoomEnabled: true,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: true,
      zoomScaleSensitivity: 0.15,
      minZoom: 0.85,
      maxZoom: 40,
      fit: true,
      center: true,
    })
    // Margen de respiro alrededor del diagrama ajustado
    pz.zoomBy(0.9)
    pz.center()
    panZoomRef.current = pz
    return () => {
      panZoomRef.current = null
      pz.destroy()
    }
  }, [current])

  // Al entrar/salir de pantalla completa, reajustar el diagrama al nuevo tamaño
  useEffect(() => {
    const pz = panZoomRef.current
    if (!pz) return
    const raf = requestAnimationFrame(() => {
      pz.resize()
      pz.fit()
      pz.center()
      pz.zoomBy(0.9)
    })
    return () => cancelAnimationFrame(raf)
  }, [expanded])

  const resetView = () => {
    const pz = panZoomRef.current
    if (!pz) return
    pz.fit()
    pz.center()
    pz.zoomBy(0.9)
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Insertar diagrama Mermaid</h2>
          <button
            type="button"
            className="btn mermaid-dialog-btn"
            style={{ fontSize: 16, padding: '4px 12px' }}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <nav style={{ width: 230, overflowY: 'auto', paddingRight: 14, flexShrink: 0 }} aria-label="Tipos de diagrama">
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
            {/* En pantalla completa el mismo nodo pasa a overlay fijo: el pan/zoom sobrevive */}
            <div
              style={
                expanded
                  ? { position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0, 0, 0, 0.9)', padding: 24, display: 'flex' }
                  : { flex: 1, minHeight: 0, display: 'flex' }
              }
            >
              <div
                style={{
                  flex: 1,
                  position: 'relative',
                  minWidth: 0,
                  minHeight: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--brave-cyan)',
                  borderRadius: 8,
                  padding: 16,
                  overflow: 'hidden',
                }}
              >
                <div className="mermaid-dialog-controls">
                  <button
                    type="button"
                    className="mermaid-modal-btn"
                    onClick={() => panZoomRef.current?.zoomBy(1.5)}
                    aria-label="Acercar"
                    title="Acercar 50%"
                    dangerouslySetInnerHTML={{ __html: ICONS.zoomIn }}
                  />
                  <button
                    type="button"
                    className="mermaid-modal-btn"
                    onClick={() => panZoomRef.current?.zoomBy(1 / 1.5)}
                    aria-label="Alejar"
                    title="Alejar 50%"
                    dangerouslySetInnerHTML={{ __html: ICONS.zoomOut }}
                  />
                  <button
                    type="button"
                    className="mermaid-modal-btn"
                    onClick={resetView}
                    aria-label="Restablecer vista"
                    title="Posición y zoom inicial"
                    dangerouslySetInnerHTML={{ __html: ICONS.reset }}
                  />
                  <button
                    type="button"
                    className="mermaid-modal-btn"
                    onClick={() => setExpanded((v) => !v)}
                    aria-label={expanded ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    title={expanded ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    dangerouslySetInnerHTML={{ __html: expanded ? ICONS.collapse : ICONS.expand }}
                  />
                </div>

                {current === null && (
                  <span style={{ color: 'var(--text-muted)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Cargando…
                  </span>
                )}
                {current?.error !== undefined && (
                  <pre style={{ color: 'var(--brave-red)', fontSize: 12, whiteSpace: 'pre-wrap', margin: 0, padding: 8, overflow: 'auto', height: '100%' }}>
                    {current.error}
                  </pre>
                )}
                {current?.svg !== undefined && (
                  <div
                    ref={svgHostRef}
                    className="mermaid-dialog-svg"
                    style={{ width: '100%', height: '100%' }}
                    dangerouslySetInnerHTML={{ __html: current.svg }}
                  />
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button type="button" className="btn mermaid-dialog-btn" onClick={() => onInsert(asMermaidBlock(selected.def))}>
                Insertar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
