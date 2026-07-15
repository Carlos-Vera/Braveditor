import { useState, useRef } from 'react'
import type { ReactNode } from 'react'
import { Dialog, DropdownMenu, Tooltip } from '@radix-ui/themes'
import type { ToolbarAction } from '../types'
import { AboutDialog } from './AboutDialog'
import { MermaidDialog } from './MermaidDialog'
import { SyntaxExample } from './SyntaxExample'
import type { SyntaxExampleDef } from './SyntaxExample'
import { MERMAID_VERTICAL_DEF, asMermaidBlock } from '../utils/mermaidTemplates'
import { t } from '../i18n'

type ToolbarProps = {
  onFormat: (prefix: string, suffix: string) => void
  onNew: () => void
  onOpenClick: () => void
  onSave: () => void
  onUpdate: () => void
  onInsertText: (text: string) => void
  onFormatAction: (action: ToolbarAction) => void
  onShowAchievements: () => void
  filename?: string
}

type FormatDef = { action: ToolbarAction; label: string; prefix: string; suffix: string }

// Formato de texto: viven dentro del "Menú de texto"
const TEXT_MENU_ITEMS: FormatDef[] = [
  { action: 'bold', label: t('toolbarBold'), prefix: '**', suffix: '**' },
  { action: 'italic', label: t('toolbarItalic'), prefix: '*', suffix: '*' },
  { action: 'h1', label: t('toolbarH1'), prefix: '\n# ', suffix: '\n' },
  { action: 'h2', label: t('toolbarH2'), prefix: '\n## ', suffix: '\n' },
  { action: 'h3', label: t('toolbarH3'), prefix: '\n### ', suffix: '\n' },
  { action: 'ul', label: t('toolbarUl'), prefix: '\n- ', suffix: '\n' },
  { action: 'ol', label: t('toolbarOl'), prefix: '\n1. ', suffix: '\n' },
]

const INLINE_BUTTONS: FormatDef[] = [
  { action: 'link', label: t('toolbarLink'), prefix: '[', suffix: '](url)' },
  { action: 'image', label: t('toolbarImage'), prefix: '![', suffix: '](url)' },
]

const CODE_BUTTON: FormatDef = { action: 'code', label: t('toolbarCode'), prefix: '```', suffix: '```' }

// Menú desplegable que abre al pasar el cursor; el pequeño retardo al cerrar
// permite cruzar el hueco entre botón y desplegable sin que se cierre
function HoverMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  const openNow = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger>
        <button type="button" className="btn" onMouseEnter={openNow} onMouseLeave={closeSoon}>
          {label}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const SYNTAX_EXAMPLES: SyntaxExampleDef[] = [
  { title: t('syntaxH1Title'), code: t('syntaxH1Code') },
  { title: t('syntaxH2Title'), code: t('syntaxH2Code') },
  { title: t('syntaxH3Title'), code: t('syntaxH3Code') },
  { title: t('syntaxH4Title'), code: t('syntaxH4Code') },
  { title: t('syntaxH5Title'), code: t('syntaxH5Code') },
  { title: t('syntaxH6Title'), code: t('syntaxH6Code') },
  {
    title: t('syntaxEmphasisTitle'),
    code: t('syntaxEmphasisCode'),
  },
  {
    title: t('syntaxListsTitle'),
    code: t('syntaxListsCode'),
  },
  {
    title: t('syntaxLinksTitle'),
    code: t('syntaxLinksCode'),
  },
  {
    title: t('syntaxImagesTitle'),
    code: t('syntaxImagesCode'),
    customPreview: (
      <div>
        <img src="https://via.placeholder.com/150" alt={t('syntaxImagesAltText')} style={{ maxWidth: '100%' }} />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{t('syntaxImagesAltText')}</p>
      </div>
    ),
  },
  {
    title: t('syntaxCodeTitle'),
    code: t('syntaxCodeCode'),
  },
  {
    title: t('syntaxQuotesTitle'),
    code: t('syntaxQuotesCode'),
  },
  {
    title: t('syntaxHrTitle'),
    code: t('syntaxHrCode'),
  },
  {
    title: t('syntaxTablesTitle'),
    code: t('syntaxTablesCode'),
  },
  {
    title: t('syntaxTasksTitle'),
    code: t('syntaxTasksCode'),
  },
  {
    title: t('syntaxCombinedTitle'),
    code: t('syntaxCombinedCode'),
  },
]

export function Toolbar({
  onFormat,
  onNew,
  onOpenClick,
  onSave,
  onUpdate,
  onInsertText,
  onFormatAction,
  onShowAchievements,
  filename,
}: ToolbarProps) {
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [showMermaidDialog, setShowMermaidDialog] = useState(false)

  const insertToEditor = (code: string) => {
    onInsertText(code)
    setShowSyntaxGuide(false)
  }

  return (
    <>
      <header
        role="toolbar"
        aria-label={t('toolbarBarAria')}
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
        <Tooltip content={t('toolbarAboutTooltip')}>
          <img
            src="/Braves.svg"
            alt="Braveditor"
            style={{ height: 28, display: 'block', cursor: 'pointer' }}
            onClick={() => setShowAboutDialog(true)}
          />
        </Tooltip>
        <Tooltip content={t('toolbarVersionTooltip')}>
          <span
            style={{ marginLeft: -10, alignSelf: 'flex-start', marginTop: 6, fontSize: 11, color: 'var(--brave-cyan)' }}
          >
            <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{t('toolbarEditorWord')}</span> v{__APP_VERSION__}
          </span>
        </Tooltip>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <HoverMenu label={t('toolbarTextMenu')}>
            {TEXT_MENU_ITEMS.map(({ action, label, prefix, suffix }) => (
              <DropdownMenu.Item
                key={action}
                onSelect={() => { onFormat(prefix, suffix); onFormatAction(action) }}
              >
                {label}
              </DropdownMenu.Item>
            ))}
          </HoverMenu>
          {INLINE_BUTTONS.map(({ action, label, prefix, suffix }) => (
            <button
              key={label}
              type="button"
              className="btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onFormat(prefix, suffix); onFormatAction(action) }}
              aria-label={`${t('toolbarAddPrefix')} ${label}`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { onFormat(CODE_BUTTON.prefix, CODE_BUTTON.suffix); onFormatAction(CODE_BUTTON.action) }}
            aria-label={`${t('toolbarAddPrefix')} ${CODE_BUTTON.label}`}
          >
            {CODE_BUTTON.label}
          </button>
          <div className="btn-group">
            <button
              type="button"
              className="btn"
              aria-label={t('toolbarInsertMermaidAria')}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onInsertText(asMermaidBlock(MERMAID_VERTICAL_DEF))}
            >
              {t('toolbarMermaid')}
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '4px 6px' }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowMermaidDialog(true)}
              aria-label={t('toolbarMoreMermaidAria')}
              aria-haspopup="dialog"
            >
              ▾
            </button>
          </div>
        </div>
        {filename && (
          <Tooltip content={filename}>
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename}
            </span>
          </div>
          </Tooltip>
        )}
        <div style={{ marginLeft: filename ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="btn"
            onClick={onShowAchievements}
            aria-label={t('toolbarAchievementsAria')}
          >
            🏆
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setShowSyntaxGuide(true)}
            aria-label={t('toolbarSyntaxAria')}
          >
            {t('toolbarSyntaxButton')}
          </button>
          <HoverMenu label={t('toolbarFileMenu')}>
            <DropdownMenu.Item onSelect={onNew}>{t('toolbarNew')}</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={onOpenClick}>{t('toolbarOpen')}</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={onSave}>{t('toolbarSave')}</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={onUpdate}>{t('toolbarUpdate')}</DropdownMenu.Item>
          </HoverMenu>
        </div>
      </header>

      <Dialog.Root open={showSyntaxGuide} onOpenChange={setShowSyntaxGuide}>
        <Dialog.Content
          maxWidth="1200px"
          width="95vw"
          aria-describedby={undefined}
          style={{ maxHeight: '90vh', overflow: 'auto' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Dialog.Title style={{ margin: 0, fontSize: 24 }}>{t('toolbarSyntaxDialogTitle')}</Dialog.Title>
            <Dialog.Close>
              <button
                type="button"
                className="btn"
                style={{ fontSize: 18, padding: '4px 12px' }}
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <div style={{ lineHeight: 1.6 }}>
            {SYNTAX_EXAMPLES.map((example) => (
              <SyntaxExample key={example.title} {...example} onInsert={insertToEditor} />
            ))}
          </div>

          <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
            {t('toolbarSyntaxSourceLabel')}{' '}
            <a
              href="https://daringfireball.net/projects/markdown/syntax"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-link)' }}
            >
              Daring Fireball - Markdown Syntax
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <MermaidDialog
        isOpen={showMermaidDialog}
        onClose={() => setShowMermaidDialog(false)}
        onInsert={(md) => {
          onInsertText(md)
          setShowMermaidDialog(false)
        }}
      />

      <AboutDialog isOpen={showAboutDialog} onClose={() => setShowAboutDialog(false)} />
    </>
  )
}
