# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-02-22

### Añadido
- Editor Markdown con CodeMirror 6
- Preview en tiempo real con scroll sincronizado
- Sistema de gamificación completo:
  - Sistema de experiencia (XP) y niveles
  - Logros desbloqueables
  - Tracking de rachas de escritura
  - Estadísticas de escritura (palabras, tiempo, sesiones)
  - Notificaciones de logros (toasts)
  - Panel de logros y estadísticas
  - Barra de experiencia
  - Calendario de rachas
  - Contador de racha
- Componentes principales:
  - `EditorPane` - Panel de edición con CodeMirror
  - `PreviewPane` - Panel de preview Markdown
  - `Toolbar` - Barra de herramientas
  - `SplitLayout` - Layout con división ajustable
  - `EditorStatusBar` - Barra de estado con línea/columna
  - `AchievementPanel` - Panel de gamificación
  - `AchievementToast` - Notificaciones de logros
  - `StreakCalendar` - Calendario de rachas
  - `StreakCounter` - Contador de racha
  - `XPBar` - Barra de experiencia
- Custom hooks:
  - `useMarkdown` - Gestión de estado de Markdown
  - `useGamification` - Sistema de gamificación
- Utilidades:
  - Manejo de archivos
  - Tracking de posición en el editor
  - Procesamiento de Markdown
  - Sanitización de HTML con DOMPurify
  - Lógica de gamificación
  - Definiciones de logros
- Persistencia en LocalStorage para progreso del usuario
- Tema One Dark para el editor
- Soporte para syntax highlighting de múltiples lenguajes
- Configuración ESLint y TypeScript
- Build con Vite

### Características Técnicas
- React 18.3.1 con TypeScript 5.6.2
- CodeMirror 6 para edición avanzada
- Marked 12.0.1 para parsing de Markdown
- DOMPurify 3.0.9 para sanitización
- Refractor 4.8.0 para syntax highlighting
- Vite 7.3.1 como build tool

### Documentación
- CLAUDE.md con convenciones del proyecto
- Documentación de gamificación
- Plan de gamificación

