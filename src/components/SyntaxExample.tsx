import DOMPurify from 'dompurify'
import { marked } from 'marked'

export type SyntaxExampleDef = {
  title: string
  code: string
  customPreview?: React.ReactNode
}

function renderPreview(markdown: string): string {
  const html = marked(markdown, { breaks: true }) as string
  return DOMPurify.sanitize(html)
}

// Sección código + preview compartida por la guía de sintaxis y el diálogo Mermaid
export function SyntaxExample({ title, code, customPreview, onInsert }: SyntaxExampleDef & { onInsert: (code: string) => void }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--text)' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 31, marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>Código Markdown</h4>
            <button
              type="button"
              className="btn"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={() => onInsert(code)}
              title="Insertar en editor"
            >
              Insertar
            </button>
          </div>
          <pre style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 4, overflow: 'auto', margin: 0, fontSize: 13, flex: 1 }}>
            {code}
          </pre>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* misma altura que la cabecera con botón para que ambos cuadros arranquen parejos */}
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 31, marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>Preview</h4>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
            {customPreview || <div dangerouslySetInnerHTML={{ __html: renderPreview(code) }} />}
          </div>
        </div>
      </div>
    </section>
  )
}
