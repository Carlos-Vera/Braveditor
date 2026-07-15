import { t } from '../i18n'

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
  streak?: React.ReactNode
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

export function EditorStatusBar({ codeStats, previewStats, streak, xpBar, onXPClick }: EditorStatusBarProps) {
  return (
    <footer
      role="status"
      aria-label={t('statusFooterAria')}
      style={barStyle}
    >
      <section style={sectionStyle} aria-label={t('statusEditorStatsAria')}>
        <span>{codeStats.codeType}</span>
        <span>{codeStats.charactersWithSpaces} {t('statusCharsWithSpaces')}</span>
        <span>{codeStats.charactersWithoutSpaces} {t('statusCharsWithoutSpaces')}</span>
        <span>{codeStats.words} {t('words')}</span>
        <span>{codeStats.lines} {t('lines')}</span>
        <span>{t('statusLn')} {codeStats.line}, {t('statusCol')} {codeStats.column}</span>
      </section>

      <span style={{ flex: 1, minWidth: 16 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {streak}
        <div
          onClick={onXPClick}
          style={{ cursor: onXPClick ? 'pointer' : 'default' }}
        >
          {xpBar}
        </div>
      </div>

      <span style={{ flex: 1, minWidth: 16 }} />

      <section style={sectionStyle} aria-label={t('statusPreviewStatsAria')}>
        <span>{previewStats.characters} {t('characters')}</span>
        <span>{previewStats.words} {t('words')}</span>
        <span>{previewStats.paragraphs} {previewStats.paragraphs !== 1 ? t('paragraphs') : t('paragraph')}</span>
      </section>
    </footer>
  )
}
