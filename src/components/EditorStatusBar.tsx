export type CodeStats = {
  codeType: string
  bytes: number
  words: number
  lines: number
  line: number
  column: number
  charactersWithSpaces: number
  charactersWithoutSpaces: number
}

export type PreviewStats = {
  characters: number
  words: number
  paragraphs: number
}

type EditorStatusBarProps = {
  codeStats: CodeStats
  previewStats: PreviewStats
  xpBar?: React.ReactNode
  onXPClick?: () => void
}

const barStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '4px 12px',
  fontSize: 12,
  color: 'rgba(0, 0, 0, 0.85)',
  backgroundColor: '#01b7af',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
  flexShrink: 0,
}

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}

export function EditorStatusBar({ codeStats, previewStats, xpBar, onXPClick }: EditorStatusBarProps) {
  return (
    <footer
      role="status"
      aria-label="Información del editor"
      style={barStyle}
    >
      <section style={sectionStyle} aria-label="Estadísticas del editor">
        <span>{codeStats.codeType}</span>
        <span>{codeStats.charactersWithSpaces} caract. c/espacios</span>
        <span>{codeStats.charactersWithoutSpaces} caract. s/espacios</span>
        <span>{codeStats.words} palabras</span>
        <span>{codeStats.lines} líneas</span>
        <span>Ln {codeStats.line}, Col {codeStats.column}</span>
      </section>

      <span style={{ flex: 1, minWidth: 16 }} />

      <div
        onClick={onXPClick}
        style={{ cursor: onXPClick ? 'pointer' : 'default' }}
      >
        {xpBar}
      </div>

      <span style={{ flex: 1, minWidth: 16 }} />

      <section style={sectionStyle} aria-label="Estadísticas de la preview">
        <span>{previewStats.characters} caracteres</span>
        <span>{previewStats.words} palabras</span>
        <span>{previewStats.paragraphs} párrafo{previewStats.paragraphs !== 1 ? 's' : ''}</span>
      </section>
    </footer>
  )
}
