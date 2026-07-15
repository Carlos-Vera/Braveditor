import { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import { Dialog } from '@radix-ui/themes'
import { SyntaxExample } from './SyntaxExample'
import { MERMAID_TEMPLATES, asMermaidBlock } from '../utils/mermaidTemplates'
import { t } from '../i18n'

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

  const renderedPreview = (label: string): React.ReactNode => {
    const preview = previews[label]
    if (preview === undefined) {
      return (
        <div aria-busy="true" aria-label={t('mermaidLoadingDiagram')} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <div className="skeleton" style={{ height: 140 }} />
          <div className="skeleton" style={{ height: 12, width: '60%' }} />
          <div className="skeleton" style={{ height: 12, width: '40%' }} />
        </div>
      )
    }
    if (preview.startsWith('error:')) {
      return <pre style={{ color: 'var(--brave-red)', fontSize: 12, whiteSpace: 'pre-wrap', margin: 0 }}>{preview.slice(6)}</pre>
    }
    return <div className="mermaid-dialog-svg" style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: preview }} />
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Content
        maxWidth="1200px"
        width="95vw"
        aria-describedby={undefined}
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Dialog.Title style={{ margin: 0, fontSize: 24 }}>{t('mermaidDialogTitle')}</Dialog.Title>
          <Dialog.Close>
            <button
              type="button"
              className="btn"
              style={{ fontSize: 18, padding: '4px 12px' }}
              aria-label={t('mermaidClose')}
            >
              ✕
            </button>
          </Dialog.Close>
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
      </Dialog.Content>
    </Dialog.Root>
  )
}
