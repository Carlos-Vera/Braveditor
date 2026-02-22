import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { useMarkdown } from './hooks/useMarkdown'
import { useGamification } from './hooks/useGamification'
import { Toolbar } from './components/Toolbar'
import { SplitLayout } from './components/SplitLayout'
import { EditorPane, type EditorPaneHandle } from './components/EditorPane'
import { EditorStatusBar } from './components/EditorStatusBar'
import { PreviewPane } from './components/PreviewPane'
import { XPBar } from './components/XPBar'
import { StreakCounter } from './components/StreakCounter'
import { AchievementToast } from './components/AchievementToast'
import { AchievementPanel } from './components/AchievementPanel'
import { downloadMarkdown, readFileAsText } from './utils/fileHandling'
import { getLineColumn, getTotalLines, getByteLength, getWordCount, getPreviewStats } from './utils/editorPosition'
import { getStreakMultiplier, todayStr } from './utils/gamification'
import type { EditorSelection } from './types'

const INITIAL = `# Hola Braveditor

Escribe **Markdown** aquí. La vista previa se actualiza en tiempo real.

- Lista
- De
- Items
`

export default function App() {
  const { raw, html, setContent } = useMarkdown()
  const { state: gamState, pendingToasts, trackWords, trackFormat, trackSave, toggleEnabled, dismissToast } = useGamification()
  const editorRef = useRef<EditorPaneHandle | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selection, setSelection] = useState<EditorSelection>({ start: 0, end: 0 })
  const [filename, setFilename] = useState('documento.md')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [syncScroll, setSyncScroll] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showAchievements, setShowAchievements] = useState(false)

  const onFormat = useCallback(
    (prefix: string, suffix: string) => {
      const start = selection.start
      const end = selection.end
      const before = raw.slice(0, start)
      const selected = raw.slice(start, end)
      const after = raw.slice(end)
      const newContent = before + prefix + selected + suffix + after

      // Calcular nueva posición del cursor (después del texto seleccionado, antes del suffix)
      const newCursorPos = start + prefix.length + selected.length

      setContent(newContent)

      // Restaurar el foco y posicionar el cursor después de que React actualice
      requestAnimationFrame(() => {
        editorRef.current?.setSelection(newCursorPos, newCursorPos)
      })
    },
    [raw, selection, setContent]
  )

  const onInsertText = useCallback(
    (text: string) => {
      const start = selection.start
      const before = raw.slice(0, start)
      const after = raw.slice(start)
      const newContent = before + '\n' + text + '\n' + after

      setContent(newContent)

      // Posicionar el cursor al final del texto insertado
      requestAnimationFrame(() => {
        const newCursorPos = start + text.length + 1
        editorRef.current?.setSelection(newCursorPos, newCursorPos)
      })
    },
    [raw, selection, setContent]
  )

  const onNew = useCallback(() => {
    if (raw.trim() && !window.confirm('¿Descartar el documento actual?')) return
    setContent(INITIAL)
    setFilename('documento.md')
  }, [raw, setContent])

  const onOpenClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      readFileAsText(file).then((text) => {
        setContent(text)
        setFilename(file.name || 'documento.md')
      })
      e.target.value = ''
    },
    [setContent]
  )

  const onSave = useCallback(() => {
    downloadMarkdown(raw, filename)
    trackSave(getWordCount(raw))
  }, [raw, filename, trackSave])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(raw)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch {
      // ignore
    }
  }, [raw])

  const codeStats = useMemo(() => {
    // CRÍTICO: Usar siempre 'raw' como referencia para el cálculo de línea/columna
    // porque 'selection.end' es un offset en ese mismo texto
    const { line, column } = getLineColumn(raw, selection.end)
    return {
      codeType: 'Markdown',
      bytes: getByteLength(raw),
      words: getWordCount(raw),
      lines: getTotalLines(raw),
      line,
      column,
      charactersWithSpaces: raw.length,
      charactersWithoutSpaces: raw.replace(/\s/g, '').length,
    }
  }, [raw, selection.end])

  const previewStats = useMemo(() => getPreviewStats(html), [html])

  // Track words for gamification whenever word count changes
  useEffect(() => {
    trackWords(codeStats.words)
  }, [codeStats.words, trackWords])

  const todayQualified = gamState.streak.days.find((d) => d.date === todayStr())?.qualified ?? false
  const streakMultiplier = getStreakMultiplier(gamState.streak.currentStreak)

  const streakWidget = gamState.enabled ? (
    <StreakCounter
      currentStreak={gamState.streak.currentStreak}
      multiplier={streakMultiplier}
      todayQualified={todayQualified}
    />
  ) : null

  const xpBar = (
    <XPBar
      totalXP={gamState.stats.totalXP}
      level={gamState.stats.level}
      enabled={gamState.enabled}
    />
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,text/*"
        onChange={onFileChange}
        style={{ display: 'none' }}
        aria-hidden
      />
      {showToolbar && (
        <Toolbar
          onFormat={onFormat}
          onNew={onNew}
          onOpenClick={onOpenClick}
          onSave={onSave}
          syncScroll={syncScroll}
          onSyncScrollChange={setSyncScroll}
          onInsertText={onInsertText}
          onFormatAction={trackFormat}
          onShowAchievements={() => setShowAchievements(true)}
          streakWidget={streakWidget}
        />
      )}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <SplitLayout
          showToolbar={showToolbar}
          onToggleToolbar={() => setShowToolbar(!showToolbar)}
          showFooter={showFooter}
          onToggleFooter={() => setShowFooter(!showFooter)}
          onCopy={onCopy}
          copyFeedback={copyFeedback}
          left={
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              <EditorPane
                ref={editorRef}
                value={raw}
                onChange={setContent}
                onSelect={setSelection}
                previewRef={previewRef}
                syncScroll={syncScroll}
              />
            </div>
          }
          right={<PreviewPane ref={previewRef} html={html} />}
        />
        {showFooter && (
          <EditorStatusBar
            codeStats={codeStats}
            previewStats={previewStats}
            xpBar={xpBar}
            onXPClick={() => setShowAchievements(true)}
          />
        )}
      </div>

      <AchievementToast toasts={pendingToasts} onDismiss={dismissToast} />

      {showAchievements && (
        <AchievementPanel
          achievements={gamState.achievements}
          stats={gamState.stats}
          streak={gamState.streak}
          onClose={() => setShowAchievements(false)}
          onToggleEnabled={toggleEnabled}
          enabled={gamState.enabled}
        />
      )}
    </div>
  )
}
