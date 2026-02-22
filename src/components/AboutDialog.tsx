import { useState } from 'react'

type AboutDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const btnStyle: React.CSSProperties = {
  background: 'var(--bg-tertiary)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  padding: '6px 10px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
}

const dependencies = [
  { name: 'React', version: '18.3.1', description: 'Biblioteca UI', url: 'https://react.dev' },
  { name: 'TypeScript', version: '5.6.2', description: 'Lenguaje tipado', url: 'https://www.typescriptlang.org' },
  { name: 'Vite', version: '7.3.1', description: 'Build tool', url: 'https://vitejs.dev' },
  { name: '@uiw/react-codemirror', version: '4.25.4', description: 'Editor de código', url: 'https://github.com/uiwjs/react-codemirror' },
  { name: '@codemirror/lang-markdown', version: '6.5.0', description: 'Soporte Markdown', url: 'https://github.com/codemirror/lang-markdown' },
  { name: 'marked', version: '12.0.1', description: 'Parser Markdown', url: 'https://marked.js.org' },
  { name: 'dompurify', version: '3.0.9', description: 'Sanitización HTML', url: 'https://github.com/cure53/DOMPurify' },
]

export function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'dependencies' | 'changelog'>('about')

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
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Versión 1.0.0</p>
            </div>
          </div>
          <button
            type="button"
            style={{
              ...btnStyle,
              fontSize: 18,
              padding: '4px 12px',
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          {(['about', 'dependencies', 'changelog'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                background: activeTab === tab ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === tab ? 'var(--text)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--text-link)' : '2px solid transparent',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 400,
                transition: 'all 0.2s',
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'about' && 'Acerca de'}
              {tab === 'dependencies' && 'Dependencias'}
              {tab === 'changelog' && 'Changelog'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            padding: '24px',
            overflow: 'auto',
            flex: 1,
          }}
        >
          {activeTab === 'about' && (
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
          )}

          {activeTab === 'dependencies' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: 18, marginBottom: 16 }}>Dependencias principales</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
                BraveEditor está construido sobre tecnologías modernas y confiables:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {dependencies.map((dep) => (
                  <div
                    key={dep.name}
                    style={{
                      padding: 16,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <a
                        href={dep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--text-link)', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}
                      >
                        {dep.name}
                      </a>
                      <code
                        style={{
                          fontSize: 12,
                          padding: '2px 8px',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 4,
                          color: 'var(--text-link)',
                        }}
                      >
                        v{dep.version}
                      </code>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{dep.description}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 15, marginBottom: 12 }}>Otras dependencias:</h4>
                <ul style={{ color: 'var(--text-secondary)', fontSize: 13, marginLeft: 20 }}>
                  <li>@codemirror/theme-one-dark - Tema oscuro para CodeMirror</li>
                  <li>@codemirror/language-data - Datos de lenguajes</li>
                  <li>@uiw/codemirror-themes - Temas adicionales</li>
                  <li>@lezer/highlight - Sistema de highlighting</li>
                  <li>refractor - Syntax highlighting adicional</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: 18, marginBottom: 16 }}>Historial de cambios</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                    <h4 style={{ margin: 0, fontSize: 16 }}>v1.0.0</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Versión inicial - Febrero 2026</span>
                  </div>
                  <ul style={{ color: 'var(--text-secondary)', marginLeft: 20, lineHeight: 1.8 }}>
                    <li>✨ Editor Markdown con CodeMirror 6</li>
                    <li>👁️ Preview en tiempo real con Marked</li>
                    <li>⚡ Sincronización de scroll</li>
                    <li>💾 Gestión de archivos .md</li>
                    <li>📝 Guía de sintaxis interactiva</li>
                    <li>⌨️ Toolbar con formato rápido</li>
                    <li>🔒 Sanitización HTML con DOMPurify</li>
                    <li>🎨 Tema oscuro optimizado</li>
                    <li>🎯 Sistema de gamificación completo</li>
                    <li>🏆 Logros y badges desbloqueables</li>
                    <li>🔥 Sistema de rachas de escritura</li>
                    <li>📊 Estadísticas de palabras y tiempo</li>
                  </ul>
                </div>

                <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: 15, marginBottom: 12 }}>Próximas funcionalidades:</h4>
                  <ul style={{ color: 'var(--text-secondary)', marginLeft: 20, lineHeight: 1.8 }}>
                    <li>🔐 Login con email</li>
                    <li>🌐 Login con redes sociales</li>
                    <li>🌈 Temas personalizables</li>
                    <li>☁️ Sincronización en la nube</li>
                    <li>📱 Versión móvil</li>
                    <li>🔍 Búsqueda y reemplazo avanzado</li>
                    <li>📂 Gestión de múltiples documentos</li>
                    <li>🔗 Exportación a PDF/HTML</li>
                    <li>⚙️ Configuración personalizable</li>
                    <li>🌐 Modo colaborativo</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            color: 'var(--text-secondary)',
          }}
        >
          <span>
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
          </span>
          <span>Última actualización: Febrero 2026</span>
        </div>
      </div>
    </div>
  )
}
