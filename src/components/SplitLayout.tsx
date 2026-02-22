import { useState, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'

type SplitLayoutProps = {
  left: ReactNode
  right: ReactNode
  defaultRatio?: number
  showToolbar: boolean
  onToggleToolbar: () => void
  showFooter: boolean
  onToggleFooter: () => void
  onCopy: () => void
  copyFeedback: boolean
}

type ViewMode = 'split' | 'editor' | 'preview'

export function SplitLayout({ left, right, defaultRatio = 0.5, showToolbar, onToggleToolbar, showFooter, onToggleFooter, onCopy, copyFeedback }: SplitLayoutProps) {
  const [ratio, setRatio] = useState(defaultRatio)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const next = Math.max(0.15, Math.min(0.85, x))
      setRatio(next)
    },
    []
  )

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    window.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  const onMouseDownCapture = useCallback(() => {
    const handleMouseUp = () => {
      onMouseUp()
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [onMouseMove, onMouseUp])

  const handleToggleView = (mode: ViewMode) => {
    setViewMode(mode)
  }

  return (
    <div
      ref={containerRef}
      className="split-layout"
      style={{ display: 'flex', flex: 1, minHeight: 0 }}
    >
      {viewMode !== 'preview' && (
        <div style={{ flex: viewMode === 'editor' ? 1 : ratio, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {left}
        </div>
      )}
      {viewMode === 'split' && (
        <div
          role="separator"
          aria-label="Redimensionar paneles"
          tabIndex={0}
          onMouseDown={(e) => {
            onMouseDown(e)
            onMouseDownCapture()
          }}
          style={{
            width: 6,
            minWidth: 6,
            background: '#01b7af',
            cursor: 'col-resize',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <div className="split-controls split-controls-center">
            <button
              onClick={onToggleToolbar}
              title={showToolbar ? "Ocultar barra de navegación" : "Mostrar barra de navegación"}
              aria-label={showToolbar ? "Ocultar barra de navegación" : "Mostrar barra de navegación"}
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {showToolbar ? (
                  <>
                    <rect x="2" y="2" width="12" height="3" fill="currentColor" />
                    <path d="M 4 9 L 8 6 L 12 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <rect x="2" y="11" width="12" height="3" fill="currentColor" />
                    <path d="M 4 7 L 8 10 L 12 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => handleToggleView('editor')}
              title="Vista solo editor"
              aria-label="Mostrar solo editor"
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="12" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={onCopy}
              title={copyFeedback ? "Copiado" : "Copiar Markdown"}
              aria-label={copyFeedback ? "Copiado" : "Copiar código Markdown"}
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {copyFeedback ? (
                  <path d="M 3 8 L 6 11 L 13 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <rect x="5" y="5" width="9" height="9" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
                    <path d="M 3 11 L 3 3 C 3 2.4 3.4 2 4 2 L 10 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => handleToggleView('preview')}
              title="Vista solo preview"
              aria-label="Mostrar solo preview"
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="9" y="2" width="5" height="12" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={onToggleFooter}
              title={showFooter ? "Ocultar barra de estado" : "Mostrar barra de estado"}
              aria-label={showFooter ? "Ocultar barra de estado" : "Mostrar barra de estado"}
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {showFooter ? (
                  <>
                    <rect x="2" y="11" width="12" height="3" fill="currentColor" />
                    <path d="M 4 7 L 8 10 L 12 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <rect x="2" y="2" width="12" height="3" fill="currentColor" />
                    <path d="M 4 9 L 8 6 L 12 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      )}
      {viewMode !== 'split' && (
        <div
          style={{
            width: 6,
            minWidth: 6,
            background: '#01b7af',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <div className={`split-controls ${viewMode === 'editor' ? 'split-controls-left' : 'split-controls-right'}`}>
            <button
              onClick={onToggleToolbar}
              title={showToolbar ? "Ocultar barra de navegación" : "Mostrar barra de navegación"}
              aria-label={showToolbar ? "Ocultar barra de navegación" : "Mostrar barra de navegación"}
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {showToolbar ? (
                  <>
                    <rect x="2" y="2" width="12" height="3" fill="currentColor" />
                    <path d="M 4 9 L 8 6 L 12 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <rect x="2" y="11" width="12" height="3" fill="currentColor" />
                    <path d="M 4 7 L 8 10 L 12 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={onCopy}
              title={copyFeedback ? "Copiado" : "Copiar Markdown"}
              aria-label={copyFeedback ? "Copiado" : "Copiar código Markdown"}
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {copyFeedback ? (
                  <path d="M 3 8 L 6 11 L 13 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <rect x="5" y="5" width="9" height="9" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
                    <path d="M 3 11 L 3 3 C 3 2.4 3.4 2 4 2 L 10 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => handleToggleView('split')}
              title="Vista dividida"
              aria-label="Mostrar vista dividida"
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="12" fill="currentColor" />
                <rect x="9" y="2" width="5" height="12" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={onToggleFooter}
              title={showFooter ? "Ocultar barra de estado" : "Mostrar barra de estado"}
              aria-label={showFooter ? "Ocultar barra de estado" : "Mostrar barra de estado"}
              className="split-control-button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {showFooter ? (
                  <>
                    <rect x="2" y="11" width="12" height="3" fill="currentColor" />
                    <path d="M 4 7 L 8 10 L 12 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <rect x="2" y="2" width="12" height="3" fill="currentColor" />
                    <path d="M 4 9 L 8 6 L 12 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      )}
      {viewMode !== 'editor' && (
        <div style={{ flex: viewMode === 'preview' ? 1 : 1 - ratio, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {right}
        </div>
      )}
    </div>
  )
}
