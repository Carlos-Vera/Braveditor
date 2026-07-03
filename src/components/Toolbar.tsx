import { useState } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import type { ToolbarAction } from '../types'
import { AboutDialog } from './AboutDialog'
import { MermaidDialog } from './MermaidDialog'
import { MERMAID_VERTICAL_DEF, asMermaidBlock } from '../utils/mermaidTemplates'

type ToolbarProps = {
  onFormat: (prefix: string, suffix: string) => void
  onNew: () => void
  onOpenClick: () => void
  onSave: () => void
  syncScroll: boolean
  onSyncScrollChange: (enabled: boolean) => void
  onInsertText?: (text: string) => void
  onFormatAction?: (action: ToolbarAction) => void
  onShowAchievements?: () => void
  streakWidget?: React.ReactNode
  filename?: string
}

const FORMAT_BUTTONS: { action: ToolbarAction; label: string; prefix: string; suffix: string }[] = [
  { action: 'bold', label: 'Negrita', prefix: '**', suffix: '**' },
  { action: 'italic', label: 'Cursiva', prefix: '*', suffix: '*' },
  { action: 'h1', label: 'H1', prefix: '\n# ', suffix: '\n' },
  { action: 'h2', label: 'H2', prefix: '\n## ', suffix: '\n' },
  { action: 'h3', label: 'H3', prefix: '\n### ', suffix: '\n' },
  { action: 'ul', label: 'Lista', prefix: '\n- ', suffix: '\n' },
  { action: 'ol', label: 'Lista numerada', prefix: '\n1. ', suffix: '\n' },
  { action: 'code', label: 'Código', prefix: '```', suffix: '```' },
  { action: 'link', label: 'Enlace', prefix: '[', suffix: '](url)' },
  { action: 'image', label: 'Imagen', prefix: '![', suffix: '](url)' },
]

function renderPreview(markdown: string): string {
  const html = marked(markdown, { breaks: true }) as string
  return DOMPurify.sanitize(html)
}

type SyntaxExampleDef = {
  title: string
  code: string
  customPreview?: React.ReactNode
}

const SYNTAX_EXAMPLES: SyntaxExampleDef[] = [
  { title: 'H1 - Encabezado nivel 1', code: '# Encabezado nivel 1' },
  { title: 'H2 - Encabezado nivel 2', code: '## Encabezado nivel 2' },
  { title: 'H3 - Encabezado nivel 3', code: '### Encabezado nivel 3' },
  { title: 'H4 - Encabezado nivel 4', code: '#### Encabezado nivel 4' },
  { title: 'H5 - Encabezado nivel 5', code: '##### Encabezado nivel 5' },
  { title: 'H6 - Encabezado nivel 6', code: '###### Encabezado nivel 6' },
  {
    title: 'Énfasis',
    code: `*cursiva* o _cursiva_
**negrita** o __negrita__
***negrita y cursiva***`,
  },
  {
    title: 'Listas',
    code: `Lista desordenada:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Lista ordenada:
1. Primer item
2. Segundo item
3. Tercer item`,
  },
  {
    title: 'Enlaces',
    code: `[Texto del enlace](https://ejemplo.com)
[Enlace con título](https://ejemplo.com "Título")

Enlaces automáticos:
<https://ejemplo.com>`,
  },
  {
    title: 'Imágenes',
    code: `![Texto alternativo](https://via.placeholder.com/150)
![Imagen con título](imagen.jpg "Título")`,
    customPreview: (
      <div>
        <img src="https://via.placeholder.com/150" alt="Texto alternativo" style={{ maxWidth: '100%' }} />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>Texto alternativo</p>
      </div>
    ),
  },
  {
    title: 'Código',
    code: `Código en línea: \`console.log("Hola")\`

Bloque de código:
\`\`\`javascript
function saludar() {
  console.log("Hola mundo");
}
\`\`\``,
  },
  {
    title: 'Citas (Blockquotes)',
    code: `> Esto es una cita.
> Puede tener múltiples líneas.

> Citas anidadas:
> > Nivel 2 de anidación`,
  },
  {
    title: 'Líneas horizontales',
    code: `Texto antes

---

Texto después`,
  },
  {
    title: 'Tablas',
    code: `| Columna 1 | Columna 2 | Columna 3 |
|-----------|:---------:|----------:|
| Izquierda | Centrado  | Derecha   |
| Dato 1    | Dato 2    | Dato 3    |`,
  },
  {
    title: 'Listas de tareas',
    code: `- [x] Tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea por hacer`,
  },
  {
    title: 'Combinaciones',
    code: `# Título del documento

Este es un **párrafo** con *énfasis*.

## Lista de características

- Primera característica
- Segunda característica
  - Sub-característica
- Tercera característica

> **Nota importante**: Puedes combinar todos los elementos.

\`\`\`javascript
const ejemplo = "código";
\`\`\``,
  },
]

function SyntaxExample({ title, code, customPreview, onInsert }: SyntaxExampleDef & { onInsert: (code: string) => void }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--text)' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>Markdown</h4>
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
          <pre style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 4, overflow: 'auto', margin: 0, fontSize: 13, flex: 1, display: 'flex', alignItems: 'center' }}>
            {code}
          </pre>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>Preview</h4>
          <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
            {customPreview || <div dangerouslySetInnerHTML={{ __html: renderPreview(code) }} />}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Toolbar({
  onFormat,
  onNew,
  onOpenClick,
  onSave,
  syncScroll,
  onSyncScrollChange,
  onInsertText,
  onFormatAction,
  onShowAchievements,
  streakWidget,
  filename,
}: ToolbarProps) {
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [showMermaidDialog, setShowMermaidDialog] = useState(false)

  const insertToEditor = (code: string) => {
    if (onInsertText) {
      onInsertText(code)
      setShowSyntaxGuide(false)
    }
  }

  return (
    <>
      <header
        role="toolbar"
        aria-label="Barra de formato y archivo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}
      >
        <img
          src="/Braves.svg"
          alt="Braveditor"
          style={{ height: 28, display: 'block', cursor: 'pointer' }}
          onClick={() => setShowAboutDialog(true)}
          title="Acerca de BraveEditor"
        />
        <span
          style={{ marginLeft: -10, alignSelf: 'flex-start', marginTop: 6, fontSize: 11, color: 'var(--brave-cyan)' }}
          title="Versión de BraveEditor"
        >
          <span style={{ fontWeight: 700, fontStyle: 'italic' }}>Editor</span> v{__APP_VERSION__}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {FORMAT_BUTTONS.map(({ action, label, prefix, suffix }) => (
            <button
              key={label}
              type="button"
              className="btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onFormat(prefix, suffix); onFormatAction?.(action) }}
              aria-label={`Agregar ${label}`}
            >
              {label}
            </button>
          ))}
          <div style={{ position: 'relative', display: 'flex', gap: 2 }}>
            <button
              type="button"
              className="btn"
              title="Insertar código Mermaid"
              aria-label="Insertar código Mermaid"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onInsertText?.(asMermaidBlock(MERMAID_VERTICAL_DEF))}
            >
              Mermaid
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '4px 6px' }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowMermaidDialog(true)}
              title="Más tipos de código Mermaid"
              aria-label="Más tipos de código Mermaid"
              aria-haspopup="dialog"
            >
              ▾
            </button>
          </div>
        </div>
        {filename && (
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              maxWidth: 240,
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
            title={filename}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename}
            </span>
          </div>
        )}
        <div style={{ marginLeft: filename ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {streakWidget}
          {onShowAchievements && (
            <button
              type="button"
              className="btn"
              onClick={onShowAchievements}
              aria-label="Logros y gamificación"
            >
              🏆
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => setShowSyntaxGuide(true)}
            aria-label="Guía de sintaxis Markdown"
          >
            Sintaxis MD
          </button>
          <button
            type="button"
            className={`btn ${syncScroll ? 'btn-on' : 'btn-dim'}`}
            style={{ minWidth: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 10px' }}
            onClick={() => onSyncScrollChange(!syncScroll)}
            aria-label="Sincronizar scroll"
            aria-pressed={syncScroll}
          >
            ⇅
          </button>
          <button
            type="button"
            className="btn"
            onClick={onNew}
            aria-label="Nuevo documento"
          >
            Nuevo
          </button>
          <button
            type="button"
            className="btn"
            onClick={onOpenClick}
            aria-label="Abrir archivo"
          >
            Abrir
          </button>
          <button
            type="button"
            className="btn"
            onClick={onSave}
            aria-label="Guardar archivo"
          >
            Guardar
          </button>
        </div>
      </header>

      {showSyntaxGuide && (
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
          onClick={() => setShowSyntaxGuide(false)}
        >
          <div
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
              <h2 style={{ margin: 0, fontSize: 24 }}>Guía de Sintaxis Markdown</h2>
              <button
                type="button"
                className="btn"
                style={{ fontSize: 18, padding: '4px 12px' }}
                onClick={() => setShowSyntaxGuide(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ lineHeight: 1.6 }}>
              {SYNTAX_EXAMPLES.map((example) => (
                <SyntaxExample key={example.title} {...example} onInsert={insertToEditor} />
              ))}
            </div>

            <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
              Fuente:{' '}
              <a
                href="https://daringfireball.net/projects/markdown/syntax"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-link)' }}
              >
                Daring Fireball - Markdown Syntax
              </a>
            </div>
          </div>
        </div>
      )}

      <MermaidDialog
        isOpen={showMermaidDialog}
        onClose={() => setShowMermaidDialog(false)}
        onInsert={(md) => {
          onInsertText?.(md)
          setShowMermaidDialog(false)
        }}
      />

      <AboutDialog isOpen={showAboutDialog} onClose={() => setShowAboutDialog(false)} />
    </>
  )
}
