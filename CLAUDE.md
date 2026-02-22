# BRAVEDITOR - Convenciones del Proyecto

## Información General

- **Nombre del Proyecto**: BraveEditor
- **Versión**: 0.0.0
- **Tipo**: Editor Markdown con preview en tiempo real
- **Stack**: React + TypeScript + Vite

## Tecnologías Principales

### Core
- **React** 18.3.1
- **TypeScript** 5.6.2
- **Vite** 7.3.1

### Dependencias Clave
- `@uiw/react-codemirror` 4.25.4 - Editor de código basado en CodeMirror 6
- `@codemirror/lang-markdown` 6.5.0 - Soporte de lenguaje Markdown para CodeMirror
- `@codemirror/theme-one-dark` 6.1.3 - Tema One Dark para CodeMirror
- `@codemirror/language-data` 6.5.2 - Datos de lenguajes para CodeMirror
- `@uiw/codemirror-themes` 4.25.4 - Temas adicionales para CodeMirror
- `@lezer/highlight` 1.2.3 - Highlighting para CodeMirror
- `marked` 12.0.1 - Parser de Markdown a HTML
- `dompurify` 3.0.9 - Sanitización de HTML
- `refractor` 4.8.0 - Sintaxis highlighting

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── EditorPane.tsx
│   ├── PreviewPane.tsx
│   ├── Toolbar.tsx
│   ├── SplitLayout.tsx
│   ├── EditorStatusBar.tsx
│   ├── AchievementPanel.tsx    # Panel de logros y gamificación
│   ├── AchievementToast.tsx    # Notificaciones de logros
│   ├── StreakCalendar.tsx      # Calendario de racha de escritura
│   ├── StreakCounter.tsx       # Contador de racha
│   └── XPBar.tsx               # Barra de experiencia
├── hooks/              # Custom React hooks
│   ├── useMarkdown.ts
│   └── useGamification.ts      # Hook para sistema de gamificación
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts
├── utils/              # Utilidades y helpers
│   ├── editorPosition.ts
│   ├── markdown.ts
│   ├── fileHandling.ts
│   ├── n8nHighlight.ts
│   ├── gamification.ts         # Lógica de gamificación
│   └── achievementDefs.ts      # Definiciones de logros
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globales
```

## Convenciones de Código

### TypeScript

#### Configuración
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx
- **Modo strict**: Habilitado
- **Verificaciones estrictas**:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - `noUncheckedSideEffectImports: true`

#### Reglas de Tipos
- Todos los componentes deben tener tipos explícitos para props
- Evitar el uso de `any` - usar tipos específicos o `unknown`
- Definir interfaces para objetos complejos en `src/types/`
- Usar `type` para unions y aliases simples
- Usar `interface` para objetos y shapes que puedan extenderse

### React

#### Componentes
- **Formato**: Functional Components con hooks
- **Naming**: PascalCase para componentes (ej: `EditorPane.tsx`)
- **Extensión**: `.tsx` para componentes con JSX, `.ts` para utilidades
- **Exports**: Preferir named exports para componentes

#### Hooks
- Crear custom hooks en `src/hooks/`
- Prefijo `use` obligatorio (ej: `useMarkdown`)
- Documentar el propósito y parámetros de cada hook

#### Props
- Definir interfaces de props con sufijo `Props`
- Ejemplo:
```typescript
interface EditorPaneProps {
  content: string;
  onChange: (value: string) => void;
}
```

### Organización de Archivos

#### Componentes
- Un componente por archivo
- Nombre del archivo debe coincidir con el nombre del componente
- Colocar componentes relacionados en carpetas si es necesario

#### Utilidades
- Funciones helper en `src/utils/`
- Agrupar por funcionalidad (ej: `markdown.ts`, `fileHandling.ts`)
- Exportar funciones individuales con named exports

#### Tipos
- Tipos compartidos en `src/types/index.ts`
- Tipos específicos de componente pueden ir en el mismo archivo

### Estilos

- CSS global en `src/index.css`
- Usar variables CSS para temas y colores consistentes
- Preferir CSS modules o styled-components para estilos específicos de componente
- Mantener un sistema de diseño coherente

## Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila TypeScript y construye para producción
npm run lint     # Ejecuta ESLint
npm run preview  # Preview de build de producción
```

## Convenciones de Git

### Commits
- Mensajes en español o inglés (consistente con el equipo)
- Formato: `tipo: descripción breve`
- Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### Branches
- `main` - Código en producción
- `develop` - Desarrollo activo
- `feature/nombre` - Nuevas funcionalidades
- `fix/nombre` - Corrección de bugs

## Buenas Prácticas

### TypeScript
1. Usar tipos en lugar de interfaces cuando sea posible para performance
2. Evitar type assertions (`as`) a menos que sea absolutamente necesario
3. Usar optional chaining (`?.`) y nullish coalescing (`??`)
4. Aprovechar discriminated unions para estados complejos

### React
1. Usar `useCallback` para funciones pasadas como props
2. Usar `useMemo` para cálculos costosos
3. Mantener componentes pequeños y enfocados (Single Responsibility)
4. Preferir composición sobre herencia
5. Mantener el estado lo más cerca posible de donde se usa

### Performance
1. Lazy loading de componentes grandes con `React.lazy`
2. Memoizar componentes cuando sea apropiado con `React.memo`
3. Evitar re-renders innecesarios
4. Optimizar bundle size

### Seguridad
1. **Siempre** sanitizar HTML generado de Markdown con DOMPurify
2. Validar inputs del usuario
3. No exponer datos sensibles en el código del cliente

## Dependencias de Desarrollo

- **ESLint** - Linting con configuración de React
- **TypeScript ESLint** - Reglas específicas de TypeScript
- **Vite React Plugin** - Optimizaciones para React

## Notas Adicionales

### Editor
- El proyecto usa `@uiw/react-codemirror` para edición de código (CodeMirror 6)
- Sintaxis highlighting con `@codemirror/lang-markdown`
- Tema: `@codemirror/theme-one-dark`
- Scroll sincronizado entre editor y preview
- Línea/columna tracking en tiempo real

### Markdown
- Parser: `marked`
- Sanitización: `dompurify`
- Soporte para extensiones de Markdown según sea necesario

### Sistema de Gamificación
- **Experiencia (XP)**: Sistema de puntos por palabras escritas
- **Niveles**: Sistema de niveles basado en XP acumulada
- **Logros**: Sistema de achievements con badges desbloqueables
- **Rachas**: Tracking de días consecutivos de escritura
- **Estadísticas**: Palabras totales, tiempo de escritura, sesiones
- **Persistencia**: LocalStorage para mantener progreso del usuario
- **Notificaciones**: Toasts para logros desbloqueados
- **Panel de Logros**: Visualización de progreso y estadísticas

## Recursos

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Marked Documentation](https://marked.js.org/)
