# Guía de Contribución — BraveEditor

Gracias por querer contribuir. Lee esta guía antes de abrir una Pull Request para que tu contribución pueda ser revisada y mergeada sin fricciones.

## Requisitos previos

- Node.js 18+
- npm

```bash
git clone https://github.com/Carlos-Vera/Braveditor.git
cd braveditor
npm install
npm run dev
```

## Flujo de trabajo

1. Haz fork del repositorio
2. Crea una rama desde `main` siguiendo la convención de nombres:
   - `feature/nombre` — nueva funcionalidad
   - `fix/nombre` — corrección de bug
3. Escribe tu código siguiendo las convenciones de abajo
4. Verifica que el proyecto compila y pasa el linter antes de abrir la PR:
   ```bash
   npm run build
   npm run lint
   ```
5. Abre la PR contra `main` con una descripción clara de qué hace y por qué

## Convenciones de TypeScript

### Tipos
- Todos los componentes deben tener tipos explícitos para sus props
- Prohibido usar `any` — usa tipos específicos o `unknown`
- Prohibido usar type assertions (`as`) salvo que sea absolutamente inevitable y quede justificado en un comentario
- Usar `type` para unions y aliases simples; `interface` para objetos que puedan extenderse

```typescript
// ✅ Correcto
type Status = 'idle' | 'loading' | 'error'

interface EditorPaneProps {
  content: string
  onChange: (value: string) => void
}

// ❌ Incorrecto
const foo = bar as SomeType
const x: any = something
```

### Configuración estricta activa
El proyecto tiene habilitados `noUnusedLocals`, `noUnusedParameters` y `noFallthroughCasesInSwitch`. El build fallará si los violas.

## Convenciones de React

### Componentes
- Functional components con hooks — sin class components
- Nombre en PascalCase, un componente por archivo
- Extensión `.tsx` para archivos con JSX, `.ts` para utilidades
- Named exports (no default exports)

```typescript
// ✅ Correcto
export const MyComponent = ({ title }: MyComponentProps) => { ... }

// ❌ Incorrecto
export default function myComponent() { ... }
```

### Hooks
- Custom hooks en `src/hooks/`, prefijo `use` obligatorio
- Para exponer un DOM ref interno al padre, usar `useImperativeHandle` — no castear el `forwardedRef` manualmente

```typescript
// ✅ Correcto
const containerRef = useRef<HTMLDivElement>(null)
useImperativeHandle(forwardedRef, () => containerRef.current!, [])

// ❌ Incorrecto
const contentRef = (forwardedRef as React.MutableRefObject<HTMLDivElement>) || localRef
```

### Performance
- `useCallback` para funciones pasadas como props
- `useMemo` para cálculos costosos
- `React.memo` cuando un componente recibe las mismas props frecuentemente

## Estructura de archivos

```
src/
├── components/     # Un archivo por componente, nombre = nombre del componente
├── hooks/          # Custom hooks (prefijo use)
├── utils/          # Funciones helper agrupadas por funcionalidad
├── types/          # Tipos compartidos en index.ts
```

No crear archivos de utilidad para operaciones de un solo uso. Tres líneas similares son mejor que una abstracción prematura.

## Estilos

- CSS global en `src/index.css`
- Usar variables CSS existentes (no hardcodear colores ni tamaños)
- Variables disponibles: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-hover`, `--brave-cyan`, `--brave-cyan-hover`

## Seguridad

- Todo HTML generado desde Markdown **debe** pasar por `DOMPurify.sanitize()`
- No usar `innerHTML` directamente en componentes React — usar `dangerouslySetInnerHTML` solo cuando sea necesario y con el HTML ya sanitizado

## Commits

Formato: `tipo: descripción breve`

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio de código sin cambio de comportamiento |
| `style` | Cambios de CSS/estilos |
| `docs` | Documentación |
| `chore` | Tareas de mantenimiento (deps, config) |

```
feat: agregar botón de copiar en bloques de código
fix: corregir scroll sincronizado en preview
```

## Motivos de rechazo automático

Las siguientes condiciones resultan en cierre inmediato de la PR sin revisión adicional:

| Condición | Por qué |
|-----------|---------|
| `npm run build` falla | El código no compila — no hay nada que revisar |
| `npm run lint` tiene errores | Viola las reglas base del proyecto |
| Uso de `any` en TypeScript | Destruye la seguridad de tipos del proyecto |
| HTML renderizado sin pasar por `DOMPurify` | Vulnerabilidad de seguridad (XSS) |
| Cambios en `package.json` o dependencias sin que la PR los justifique explícitamente | Riesgo de supply chain y builds rotos |
| Bump de versión accidental o no acordado | El versionado lo gestiona el equipo core |
| Class components de React | El proyecto usa exclusivamente functional components |
| Default exports en componentes | Rompe la consistencia de imports en todo el proyecto |
| Archivos `.env`, credenciales o secrets incluidos | Nunca, bajo ninguna circunstancia |
| PR abierta contra una rama que no sea `main` | El flujo de trabajo es fork → `main` |
| Cambios fuera del scope descrito en la PR | Cada PR debe hacer exactamente lo que dice que hace |

Si tu PR incurre en alguno de estos puntos recibirás un comentario explicando el motivo del cierre y podrás abrir una nueva PR con las correcciones.

## Checklist antes de abrir una PR

- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin warnings
- [ ] No hay type assertions (`as`) sin justificación
- [ ] No hay cambios accidentales en `package.json` o `package-lock.json` ajenos a la feature
- [ ] El HTML generado dinámicamente pasa por DOMPurify
- [ ] Los componentes nuevos tienen tipos explícitos en sus props
