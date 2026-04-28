# BraveEditor

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.2-3178c6.svg)

Editor Markdown profesional con preview en tiempo real y sistema de gamificación bastante dificil integrado para motivar tu productividad en la escritura.

## Características

### Editor Profesional
-  **Editor CodeMirror 6** - Experiencia de edición avanzada
-  **Preview en tiempo real** - Visualiza tu Markdown instantáneamente
-  **Scroll sincronizado** - El preview sigue tu posición en el editor
-  **Tema One Dark** - Interfaz oscura agradable a la vista
-  **Syntax highlighting** - Resaltado de sintaxis para múltiples lenguajes
-  **Tracking de posición** - Línea y columna en tiempo real

### Sistema de Gamificación
-  **Sistema de XP y niveles** - Gana experiencia escribiendo
-  **Logros desbloqueables** - Colecciona badges por tus logros
-  **Rachas de escritura** - Mantén tu racha diaria de escritura
-  **Estadísticas detalladas** - Palabras escritas, tiempo, sesiones
-  **Notificaciones** - Toasts cuando desbloqueas logros
-  **Calendario de rachas** - Visualiza tu consistencia
-  **Persistencia local** - Tu progreso se guarda automáticamente

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Carlos-Vera/Braveditor.git

# Navegar al directorio
cd braveditor

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila TypeScript y construye para producción
npm run lint     # Ejecuta ESLint para verificar código
npm run preview  # Preview del build de producción
```

## 🛠️ Stack Tecnológico

### Core
- **React** 18.3.1 - Framework UI
- **TypeScript** 5.6.2 - Lenguaje tipado
- **Vite** 7.3.1 - Build tool y dev server

### Editor
- **@uiw/react-codemirror** 4.25.4 - Editor basado en CodeMirror 6
- **@codemirror/lang-markdown** 6.5.0 - Soporte Markdown
- **@codemirror/theme-one-dark** 6.1.3 - Tema del editor
- **@codemirror/language-data** 6.5.2 - Datos de lenguajes

### Procesamiento
- **marked** 12.0.1 - Parser Markdown → HTML
- **dompurify** 3.0.9 - Sanitización de HTML
- **refractor** 4.8.0 - Syntax highlighting

## 📁 Estructura del Proyecto

```
braveditor/
├── src/
│   ├── components/          # Componentes React
│   │   ├── EditorPane.tsx
│   │   ├── PreviewPane.tsx
│   │   ├── Toolbar.tsx
│   │   ├── SplitLayout.tsx
│   │   ├── EditorStatusBar.tsx
│   │   ├── AchievementPanel.tsx
│   │   ├── AchievementToast.tsx
│   │   ├── StreakCalendar.tsx
│   │   ├── StreakCounter.tsx
│   │   └── XPBar.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useMarkdown.ts
│   │   └── useGamification.ts
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/              # Utilidades
│   │   ├── editorPosition.ts
│   │   ├── markdown.ts
│   │   ├── fileHandling.ts
│   │   ├── gamification.ts
│   │   └── achievementDefs.ts
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── dist/                   # Build de producción
└── package.json
```

## 🎮 Sistema de Gamificación

### XP y Niveles
- Ganas **1 XP por cada palabra** escrita
- Los niveles requieren más XP progresivamente
- Nivel actual y progreso visible en la interfaz

### Logros Disponibles
- **Primeras Palabras** - Escribe tus primeras 100 palabras
- **Centurión** - Alcanza 1000 palabras
- **Maratonista** - Escribe 5000 palabras
- **Novelista** - Alcanza 10000 palabras
- **Maestro de Palabras** - Llega a 50000 palabras
- **Racha de 7 días** - Escribe durante 7 días consecutivos
- **Racha de 30 días** - Mantén una racha de 30 días
- **Sesión Larga** - Escribe durante 1 hora
- Y muchos más...

### Rachas
- Mantén tu racha escribiendo cada día
- El calendario muestra tu historial
- Las rachas se rompen si no escribes en 24 horas

##  Seguridad

- Todo HTML generado desde Markdown es sanitizado con **DOMPurify**
- Sin evaluación de código del usuario
- Validación de inputs

##  Licencia

Apache-2.0 © [Carlos Vera](https://braveslab.com)

##  Autores

- **Carlos Vera** - [carlos@braveslab.com](mailto:carlos@braveslab.com)
- **Jean Paul Vera Bravo** - Contributor

##  Reportar Problemas

Si encuentras un bug o tienes una sugerencia, por favor abre un issue en:
https://github.com/Carlos-Vera/Braveditor/issues

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

##  Documentación Adicional

- [CLAUDE.md](./CLAUDE.md) - Convenciones del proyecto
- [CHANGELOG.md](./CHANGELOG.md) - Historial de cambios

## 🔗 Enlaces

- [Repositorio](https://github.com/Carlos-Vera/Braveditor)
- [Issues](https://github.com/Carlos-Vera/Braveditor/issues)
- [Website](https://braveslab.com)

---

Hecho con ❤️ por BravesLab.
