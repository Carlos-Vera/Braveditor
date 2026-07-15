import { useEffect, useState } from 'react'
import { Button, Badge } from '@radix-ui/themes'
import { t } from '../i18n'

type GoogleFont = {
  /** Nombre exacto de la familia tal como la reconoce Google Fonts */
  family: string
}

const GOOGLE_FONTS: GoogleFont[] = [
  { family: 'Kaisei Decol' },
  { family: 'Habibi' },
  { family: 'Metal' },
  { family: 'Sedan SC' },
  { family: 'Spectral' },
  { family: 'Cormorant Upright' },
]

const STORAGE_KEY = 'braveditor-preview-font'
const PREVIEW_FONT_VAR = '--preview-font'

/** Icono de engranaje (Ajustes), estilo lucide: círculo central + dientes */
const GEAR_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

/** Aplica la fuente elegida al preview vía la variable CSS que consume .preview-content */
function applyPreviewFont(family: string): void {
  document.documentElement.style.setProperty(PREVIEW_FONT_VAR, `'${family}', serif`)
}

export function FontPicker() {
  const [open, setOpen] = useState(false)
  const [activeFont, setActiveFont] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  // Al montar: si hay una fuente guardada, la reaplica (el <link> estático
  // de Google Fonts en index.html ya la tiene disponible)
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      saved = null
    }
    if (!saved) return
    applyPreviewFont(saved)
  }, [])

  // Cierra el panel con la tecla Escape mientras está abierto
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleApply = (family: string) => {
    applyPreviewFont(family)
    try {
      localStorage.setItem(STORAGE_KEY, family)
    } catch {
      /* ignore */
    }
    setActiveFont(family)
  }

  const handleClear = () => {
    document.documentElement.style.removeProperty(PREVIEW_FONT_VAR)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setActiveFont(null)
  }

  // Panel lateral derecho propio: overlay + <aside> fijo con transición por
  // transform. El <aside> se renderiza siempre para animar también la salida;
  // el overlay solo cuando está abierto.
  return (
    <>
      <button
        type="button"
        className="settings-gear-trigger"
        aria-label={t('fontSettingsAria')}
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(true)}
      >
        {GEAR_ICON}
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 40 }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        role="dialog"
        aria-label={t('fontSettingsAria')}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 340,
          maxWidth: '90vw',
          zIndex: 50,
          background: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.2s ease',
        }}
      >
        <div style={{ padding: 16 }}>
          <h2 style={{ margin: 0, fontSize: 17 }}>{t('fontSettingsAria')}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {t('fontAdjustTitle')}
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 8 }}>
            {GOOGLE_FONTS.map((font) => {
              const isActive = activeFont === font.family
              return (
                <div
                  key={font.family}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: 10,
                    borderRadius: 8,
                    border: isActive ? '1px solid var(--brave-cyan)' : '1px solid var(--gray-a4)',
                    background: isActive ? 'rgba(1, 183, 175, 0.1)' : 'var(--gray-a2)',
                  }}
                >
                  <span
                    style={{ fontFamily: `'${font.family}', serif`, fontSize: 14, fontSizeAdjust: '0.5', lineHeight: 1.2 }}
                    title={font.family}
                  >
                    {font.family}
                  </span>
                  <span style={{ fontFamily: `'${font.family}', serif`, fontSize: 12, fontSizeAdjust: '0.5', color: 'var(--gray-a10)' }}>
                    AaBb Markdown 123
                  </span>
                  {isActive ? (
                    <Badge color="cyan" size="1" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>{t('fontInUse')}</Badge>
                  ) : (
                    <Button size="1" variant="soft" color="cyan" style={{ marginTop: 'auto' }} onClick={() => handleApply(font.family)}>
                      {t('fontAdd')}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
          <Button
            size="1"
            variant="soft"
            color="gray"
            onClick={handleClear}
            disabled={!activeFont}
            style={{ width: '100%', marginTop: 8 }}
          >
            {t('fontRemove')}
          </Button>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
          <Button size="1" variant="ghost" color="gray" onClick={() => setOpen(false)}>
            {t('fontClose')}
          </Button>
        </div>
      </aside>
    </>
  )
}
