type AboutDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  if (!isOpen) return null

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 0,
          maxWidth: 700,
          width: '90vw',
          maxHeight: '85vh',
          overflow: 'hidden',
          color: 'var(--text)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
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
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>BraveEditor</h2>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Versión {__APP_VERSION__}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn"
            style={{ fontSize: 18, padding: '4px 12px' }}
            onClick={onClose}
          >
            ✕
          </button>
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
            <h3 style={{ marginTop: 0, fontSize: 18, marginBottom: 16 }}>Editor Markdown profesional con gamificación</h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Editor Markdown minimalista y potente con preview en tiempo real, diseñado para escritores y desarrolladores
              que buscan productividad y motivación mediante un sistema de gamificación integrado.
            </p>

            <h4 style={{ fontSize: 16, marginBottom: 12, marginTop: 24 }}>Funcionalidades principales:</h4>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: 20, marginBottom: 24 }}>
              <li>✍️ Editor de código basado en CodeMirror 6 con syntax highlighting</li>
              <li>👁️ Preview en tiempo real con renderizado Markdown</li>
              <li>⚡ Sincronización de scroll entre editor y preview</li>
              <li>🎯 Sistema de gamificación con XP, niveles y logros</li>
              <li>🔥 Tracking de rachas de escritura diaria</li>
              <li>📊 Estadísticas detalladas de palabras y tiempo de escritura</li>
              <li>🎨 Tema oscuro optimizado para largas sesiones</li>
              <li>💾 Autoguardado y gestión de archivos .md</li>
              <li>📝 Guía interactiva de sintaxis Markdown</li>
              <li>🏆 Panel de logros con badges desbloqueables</li>
              <li>🔒 Sanitización de HTML para seguridad</li>
              <li>⌨️ Atajos de teclado para formato rápido</li>
            </ul>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 16, marginBottom: 16 }}>Creado por:</h4>
              <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>
                <a
                  href="https://www.linkedin.com/in/soycarlosvera/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  <strong>Carlos Vera</strong>
                </a>
                {' '}- Desarrollador Principal
              </p>
              <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>
                <strong>Jean Paul Vera Bravo</strong> - Colaborador
              </p>
              <p style={{ margin: '16px 0 8px 0', color: 'var(--text-secondary)' }}>
                <strong>Braves Labs LLC</strong>
              </p>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 16, marginBottom: 12 }}>Licencia:</h4>
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

              <h4 style={{ fontSize: 16, marginBottom: 12 }}>Enlaces:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a
                  href="https://github.com/Carlos-Vera/Braveditor"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-link)', textDecoration: 'none' }}
                >
                  📦 Repositorio GitHub
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
          . Todos los derechos reservados.
        </div>
      </div>
    </div>
  )
}
