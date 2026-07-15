import { useState, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import { t } from '../i18n'

type SplitLayoutProps = {
  left: ReactNode
  right: ReactNode
  showToolbar: boolean
  onToggleToolbar: () => void
  showFooter: boolean
  onToggleFooter: () => void
  onCopy: () => void
  copyFeedback: boolean
  syncScroll: boolean
  onSyncScrollChange: (enabled: boolean) => void
}

type ViewMode = 'split' | 'editor' | 'preview'

// Barra horizontal con chevron apuntando hacia ella (toggle de toolbar/footer)
function BarIcon({ top }: { top: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y={top ? 2 : 11} width="12" height="3" fill="currentColor" />
      <path
        d={top ? 'M 4 9 L 8 6 L 12 9' : 'M 4 7 L 8 10 L 12 7'}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {done ? (
        <path d="M 3 8 L 6 11 L 13 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="5" y="5" width="9" height="9" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
          <path d="M 3 11 L 3 3 C 3 2.4 3.4 2 4 2 L 10 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// Flechas ⇅: scroll sincronizado entre editor y preview
function SyncScrollIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M 5 13 L 5 3 M 5 3 L 2.5 5.5 M 5 3 L 7.5 5.5 M 11 3 L 11 13 M 11 13 L 8.5 10.5 M 11 13 L 13.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PaneIcon({ left, right }: { left?: boolean; right?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {left && <rect x="2" y="2" width="5" height="12" fill="currentColor" />}
      {right && <rect x="9" y="2" width="5" height="12" fill="currentColor" />}
    </svg>
  )
}

export function SplitLayout({ left, right, showToolbar, onToggleToolbar, showFooter, onToggleFooter, onCopy, copyFeedback, syncScroll, onSyncScrollChange }: SplitLayoutProps) {
  const [ratio, setRatio] = useState(0.5)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

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

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    const handleMouseUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [onMouseMove])

  const isSplit = viewMode === 'split'
  const controlsPosition = isSplit ? 'split-controls-center' : viewMode === 'editor' ? 'split-controls-left' : 'split-controls-right'

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
      <div
        role={isSplit ? 'separator' : undefined}
        aria-label={isSplit ? t('splitResizeAria') : undefined}
        tabIndex={isSplit ? 0 : undefined}
        onMouseDown={isSplit ? onDragStart : undefined}
        style={{
          width: 6,
          minWidth: 6,
          background: '#01b7af',
          cursor: isSplit ? 'col-resize' : undefined,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <div className={`split-controls ${controlsPosition}`}>
          <button
            onClick={onToggleToolbar}
            aria-label={showToolbar ? t('splitHideToolbarAria') : t('splitShowToolbarAria')}
            className="split-control-button"
          >
            <BarIcon top={showToolbar} />
          </button>
          {isSplit && (
            <button
              onClick={() => setViewMode('editor')}
              aria-label={t('splitShowEditorOnlyAria')}
              className="split-control-button"
            >
              <PaneIcon right />
            </button>
          )}
          <button
            onClick={onCopy}
            aria-label={copyFeedback ? t('splitCopiedAria') : t('splitCopyAllAria')}
            className="split-control-button"
          >
            <CopyIcon done={copyFeedback} />
          </button>
          {isSplit && (
            <button
              onClick={() => onSyncScrollChange(!syncScroll)}
              aria-label={syncScroll ? t('splitSyncScrollOnAria') : t('splitSyncScrollOffAria')}
              aria-pressed={syncScroll}
              className="split-control-button"
              style={{ opacity: syncScroll ? 1 : 0.45 }}
            >
              <SyncScrollIcon />
            </button>
          )}
          {isSplit ? (
            <button
              onClick={() => setViewMode('preview')}
              aria-label={t('splitShowPreviewOnlyAria')}
              className="split-control-button"
            >
              <PaneIcon left />
            </button>
          ) : (
            <button
              onClick={() => setViewMode('split')}
              aria-label={t('splitShowSplitViewAria')}
              className="split-control-button"
            >
              <PaneIcon left right />
            </button>
          )}
          <button
            onClick={onToggleFooter}
            aria-label={showFooter ? t('splitHideFooterAria') : t('splitShowFooterAria')}
            className="split-control-button"
          >
            <BarIcon top={!showFooter} />
          </button>
        </div>
      </div>
      {viewMode !== 'editor' && (
        <div style={{ flex: viewMode === 'preview' ? 1 : 1 - ratio, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {right}
        </div>
      )}
    </div>
  )
}
