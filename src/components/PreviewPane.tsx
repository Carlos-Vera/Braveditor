import { forwardRef } from 'react'

type PreviewPaneProps = {
  html: string
}

export const PreviewPane = forwardRef<HTMLDivElement, PreviewPaneProps>(
  function PreviewPane({ html }, ref) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'auto' }}>
        <div
          ref={ref}
          className="preview-content"
          role="region"
          aria-label="Vista previa del Markdown"
          style={{
            flex: 1,
            padding: '1rem',
            overflow: 'auto',
            background: 'var(--bg-secondary)',
          }}
          dangerouslySetInnerHTML={{ __html: html || '<p class="preview-placeholder" style="color:var(--text-muted)">Tu vista previa aparecerá aquí.</p>' }}
        />
      </div>
    )
  }
)
