import { Dialog } from '@radix-ui/themes'
import { t } from '../i18n'

type AboutDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Content
        maxWidth="700px"
        style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="https://braveslab.com" target="_blank" rel="noopener noreferrer">
              <img src="/Braves.svg" alt="Braveditor" style={{ height: 36, cursor: 'pointer' }} />
            </a>
            <div>
              <Dialog.Title style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>BraveEditor</Dialog.Title>
              <Dialog.Description style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                {t('aboutVersionLabel')} {__APP_VERSION__}
              </Dialog.Description>
            </div>
          </div>
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

        {/* Content */}
        <div
          style={{
            padding: '24px',
            overflow: 'auto',
            flex: 1,
          }}
        >
          <div style={{ lineHeight: 1.8 }}>
            <h3 style={{ marginTop: 0, fontSize: 18, marginBottom: 16 }}>{t('aboutTagline')}</h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              {t('aboutDescription')}
            </p>

            <h4 style={{ fontSize: 16, marginBottom: 12, marginTop: 24 }}>{t('aboutFeaturesTitle')}</h4>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: 20, marginBottom: 24 }}>
              <li>{t('aboutFeature1')}</li>
              <li>{t('aboutFeature2')}</li>
              <li>{t('aboutFeature3')}</li>
              <li>{t('aboutFeature4')}</li>
              <li>{t('aboutFeature5')}</li>
              <li>{t('aboutFeature6')}</li>
              <li>{t('aboutFeature7')}</li>
              <li>{t('aboutFeature8')}</li>
              <li>{t('aboutFeature9')}</li>
              <li>{t('aboutFeature10')}</li>
              <li>{t('aboutFeature11')}</li>
              <li>{t('aboutFeature12')}</li>
            </ul>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 16, marginBottom: 16 }}>{t('aboutCreatedByTitle')}</h4>
              <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>
                <a
                  href="https://www.linkedin.com/in/soycarlosvera/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  <strong>Carlos Vera</strong>
                </a>
                {' '}- {t('aboutRoleDeveloper')}
              </p>
              <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>
                <strong>Jean Paul Vera Bravo</strong> - {t('aboutRoleCollaborator')}
              </p>
              <p style={{ margin: '16px 0 8px 0', color: 'var(--text-secondary)' }}>
                <strong>Braves Labs LLC</strong>
              </p>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 16, marginBottom: 12 }}>{t('aboutLicenseTitle')}</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  Apache License Version 2.0
                </a>
              </p>

              <h4 style={{ fontSize: 16, marginBottom: 12 }}>{t('aboutLinksTitle')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a
                  href="https://github.com/Carlos-Vera/Braveditor"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  {t('aboutLinkRepo')}
                </a>
                <a
                  href="https://braveslab.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  🌐 braveslab.com
                </a>
                <a
                  href="mailto:carlos@braveslab.com"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  ✉️ carlos@braveslab.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            fontSize: 12,
            color: 'var(--text-secondary)',
          }}
        >
          © 2026{' '}
          <a
            href="https://braveslab.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-link)', textDecoration: 'none' }}
          >
            Braves Labs LLC
          </a>
          . {t('aboutRightsReserved')}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
