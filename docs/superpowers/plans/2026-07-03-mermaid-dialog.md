# Popup de diagramas Mermaid — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** El botón "Mermaid" inserta la plantilla vertical directamente; el ▾ abre un popup master-detail con 18 tipos de diagrama Mermaid, preview en vivo y botón Insertar.

**Architecture:** Un nuevo componente modal `MermaidDialog` (mismo patrón de overlay que la guía de sintaxis de `Toolbar.tsx`) renderiza el tipo seleccionado con `mermaid.render()` — mermaid ya está inicializado globalmente en `PreviewPane.tsx` con el tema de la app. Las plantillas viven en `src/utils/mermaidTemplates.ts` como definiciones sin fences; un helper las envuelve en ` ```mermaid ` al insertar.

**Tech Stack:** React 18 + TypeScript strict, mermaid 11.16.0 (ya instalado), estilos inline + clases en `index.css`. Gestor de paquetes: **pnpm siempre**.

**Testing:** El repo no tiene framework de tests (scripts: `dev`, `build`, `lint`, `preview`). La verificación de cada tarea es `pnpm build` (tsc strict) + `pnpm lint`, y una tarea final de verificación manual con `pnpm dev`. No añadir vitest/jest para esto.

**Spec:** `docs/superpowers/specs/2026-07-03-mermaid-dialog-design.md`

---

## Estructura de archivos

- Create: `src/utils/mermaidTemplates.ts` — plantillas + helper (sin dependencias de React)
- Create: `src/components/MermaidDialog.tsx` — el popup (UI + render del preview)
- Modify: `src/index.css` — clases del listado de tipos (hover/selected con brave-cyan)
- Modify: `src/components/Toolbar.tsx` — botón Mermaid inserta vertical, ▾ abre el diálogo, se borra el dropdown

---

### Task 1: Plantillas Mermaid

**Files:**
- Create: `src/utils/mermaidTemplates.ts`

- [ ] **Step 1: Crear el archivo con las 18 plantillas y el helper**

Contenido completo de `src/utils/mermaidTemplates.ts`:

```typescript
// Plantillas de diagramas Mermaid para el diálogo de inserción.
// `def` es el código Mermaid sin fences; envolver con asMermaidBlock() al insertar.

export type MermaidTemplate = {
  category: string
  label: string
  def: string
}

// Plantilla del botón "Mermaid" de la toolbar (inserción directa)
export const MERMAID_VERTICAL_DEF = 'graph TD\n  A --> B\n  A --> C'

export function asMermaidBlock(def: string): string {
  return '```mermaid\n' + def + '\n```'
}

export const MERMAID_TEMPLATES: MermaidTemplate[] = [
  // ── Diagramas de proceso y flujo ──
  {
    category: 'Diagramas de proceso y flujo',
    label: 'Flowchart horizontal',
    def: `graph LR
  subgraph Izquierda
    direction TB
    A --> B
    A --> C
  end
  subgraph Derecha
    direction TB
    D --> E
    D --> F
  end
  A --> D`,
  },
  {
    category: 'Diagramas de proceso y flujo',
    label: 'Sequence diagram',
    def: `sequenceDiagram
  participant A as Ana
  participant B as Beto
  A->>B: Hola, ¿estado del pedido?
  B-->>A: Enviado ayer`,
  },
  {
    category: 'Diagramas de proceso y flujo',
    label: 'State diagram',
    def: `stateDiagram-v2
  [*] --> Borrador
  Borrador --> Revision: enviar
  Revision --> Publicado: aprobar
  Revision --> Borrador: rechazar
  Publicado --> [*]`,
  },
  {
    category: 'Diagramas de proceso y flujo',
    label: 'User Journey',
    def: `journey
  title Mi jornada de trabajo
  section Mañana
    Despertar: 3: Yo
    Café: 5: Yo
  section Oficina
    Reunión: 2: Yo, Equipo
    Programar: 5: Yo`,
  },
  {
    category: 'Diagramas de proceso y flujo',
    label: 'Kanban',
    def: `kanban
  Por hacer
    t1[Diseñar logo]
  En curso
    t2[Escribir docs]
  Hecho
    t3[Configurar repo]`,
  },
  // ── Datos y estructura ──
  {
    category: 'Datos y estructura',
    label: 'ER diagram',
    def: `erDiagram
  CLIENTE ||--o{ PEDIDO : realiza
  PEDIDO ||--|{ LINEA : contiene
  CLIENTE {
    int id
    string nombre
  }`,
  },
  {
    category: 'Datos y estructura',
    label: 'Class diagram',
    def: `classDiagram
  class Animal {
    +String nombre
    +hacerSonido()
  }
  Animal <|-- Perro
  Animal <|-- Gato`,
  },
  {
    category: 'Datos y estructura',
    label: 'Sankey diagram',
    def: `sankey-beta
  Ingresos,Gastos,60
  Ingresos,Ahorro,40
  Gastos,Vivienda,30
  Gastos,Comida,30`,
  },
  {
    category: 'Datos y estructura',
    label: 'Quadrant chart',
    def: `quadrantChart
  title Alcance vs Esfuerzo
  x-axis Poco esfuerzo --> Mucho esfuerzo
  y-axis Poco alcance --> Mucho alcance
  quadrant-1 Planificar
  quadrant-2 Hacer ya
  quadrant-3 Descartar
  quadrant-4 Delegar
  Tarea A: [0.3, 0.8]
  Tarea B: [0.7, 0.4]`,
  },
  {
    category: 'Datos y estructura',
    label: 'XY chart',
    def: `xychart-beta
  title "Ventas por mes"
  x-axis [ene, feb, mar, abr]
  y-axis "Ventas" 0 --> 100
  bar [30, 55, 42, 70]
  line [30, 55, 42, 70]`,
  },
  {
    category: 'Datos y estructura',
    label: 'Pie chart',
    def: `pie title Lenguajes del proyecto
  "TypeScript" : 60
  "CSS" : 25
  "HTML" : 15`,
  },
  // ── Planificación y proyectos ──
  {
    category: 'Planificación y proyectos',
    label: 'Gantt chart',
    def: `gantt
  title Proyecto
  dateFormat YYYY-MM-DD
  section Fase 1
    Diseño: a1, 2026-07-01, 7d
    Desarrollo: after a1, 14d
  section Fase 2
    Pruebas: 2026-07-22, 5d`,
  },
  {
    category: 'Planificación y proyectos',
    label: 'Git graph',
    def: `gitGraph
  commit
  branch develop
  checkout develop
  commit
  checkout main
  merge develop
  commit`,
  },
  {
    category: 'Planificación y proyectos',
    label: 'Timeline',
    def: `timeline
  title Historia del producto
  2024 : Idea
  2025 : Prototipo
  2026 : Lanzamiento`,
  },
  {
    category: 'Planificación y proyectos',
    label: 'Mindmap',
    def: `mindmap
  root((BraveEditor))
    Editor
      CodeMirror
    Preview
      Mermaid`,
  },
  // ── Arquitectura ──
  {
    category: 'Arquitectura',
    label: 'Architecture diagram',
    def: `architecture-beta
  group api(cloud)[API]
  service db(database)[BD] in api
  service server(server)[Servidor] in api
  db:L -- R:server`,
  },
  {
    category: 'Arquitectura',
    label: 'C4 diagram',
    def: `C4Context
  title Contexto del sistema
  Person(usuario, "Usuario")
  System(app, "BraveEditor", "Editor Markdown")
  Rel(usuario, app, "Usa")`,
  },
  {
    category: 'Arquitectura',
    label: 'Block diagram',
    def: `block-beta
  columns 3
  a["Cabecera"]:3
  b["Menú"] c["Contenido"]:2`,
  },
]
```

- [ ] **Step 2: Verificar que compila**

Run: `pnpm build`
Expected: sale sin errores (tsc strict + vite build OK).

- [ ] **Step 3: Commit**

```bash
git add src/utils/mermaidTemplates.ts
git commit -m "feat: plantillas de diagramas Mermaid por categoría"
```

---

### Task 2: Componente MermaidDialog + CSS

**Files:**
- Create: `src/components/MermaidDialog.tsx`
- Modify: `src/index.css` (añadir al final)

- [ ] **Step 1: Añadir clases CSS al final de `src/index.css`**

```css
/* Diálogo de inserción de diagramas Mermaid */
.mermaid-type-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
}
.mermaid-type-btn:hover {
  background: var(--bg-tertiary);
  color: var(--brave-cyan-hover);
  border-color: var(--brave-cyan-hover);
}
.mermaid-type-btn.selected {
  background: var(--bg-tertiary);
  color: var(--brave-cyan);
  border-color: var(--brave-cyan);
}
.mermaid-dialog-category {
  margin: 12px 0 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--brave-cyan);
}
```

- [ ] **Step 2: Crear `src/components/MermaidDialog.tsx`**

Contenido completo:

```tsx
import { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import { MERMAID_TEMPLATES, asMermaidBlock } from '../utils/mermaidTemplates'
import type { MermaidTemplate } from '../utils/mermaidTemplates'

type MermaidDialogProps = {
  isOpen: boolean
  onClose: () => void
  onInsert: (markdown: string) => void
}

const CATEGORIES = [...new Set(MERMAID_TEMPLATES.map((t) => t.category))]

let previewIdCounter = 0

type PreviewState = { svg: string } | { error: string } | null

export function MermaidDialog({ isOpen, onClose, onInsert }: MermaidDialogProps) {
  const [selected, setSelected] = useState<MermaidTemplate>(MERMAID_TEMPLATES[0])
  const [preview, setPreview] = useState<PreviewState>(null)

  // Renderiza solo el tipo seleccionado (mermaid ya está inicializado en PreviewPane)
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    setPreview(null)
    const id = `mermaid-dialog-preview-${++previewIdCounter}`
    mermaid
      .render(id, selected.def)
      .then(({ svg }) => {
        if (!cancelled) setPreview({ svg })
      })
      .catch((err: unknown) => {
        // mermaid deja un svg de error suelto en el DOM al fallar el parseo
        document.getElementById(id)?.remove()
        if (!cancelled) setPreview({ error: err instanceof Error ? err.message : String(err) })
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, selected])

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
        role="dialog"
        aria-label="Insertar diagrama Mermaid"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--brave-cyan)',
          borderRadius: 8,
          padding: '20px 24px',
          maxWidth: 960,
          width: '95vw',
          height: 'min(620px, 90vh)',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Insertar diagrama Mermaid</h2>
          <button
            type="button"
            className="btn"
            style={{ fontSize: 16, padding: '4px 12px' }}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <nav style={{ width: 220, overflowY: 'auto', paddingRight: 12, flexShrink: 0 }} aria-label="Tipos de diagrama">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <h3 className="mermaid-dialog-category">{cat}</h3>
                {MERMAID_TEMPLATES.filter((t) => t.category === cat).map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    className={`mermaid-type-btn${t === selected ? ' selected' : ''}`}
                    onClick={() => setSelected(t)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Franja divisoria brave-cyan */}
          <div style={{ width: 2, background: 'var(--brave-cyan)', flexShrink: 0 }} aria-hidden="true" />

          <div style={{ flex: 1, paddingLeft: 16, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {preview === null && <span style={{ color: 'var(--text-muted)' }}>Cargando…</span>}
              {preview !== null && 'error' in preview && (
                <pre style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {preview.error}
                </pre>
              )}
              {preview !== null && 'svg' in preview && (
                <div style={{ maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: preview.svg }} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => onInsert(asMermaidBlock(selected.def))}>
                Insertar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

Notas para quien implementa:
- El SVG viene de `mermaid.render()` sobre plantillas fijas locales, mismo trato que `PreviewPane.tsx` (que también lo inyecta con innerHTML); no pasa por DOMPurify porque no es contenido de usuario.
- `t === selected` compara por referencia: válido porque `selected` siempre sale del mismo array `MERMAID_TEMPLATES`.
- El diálogo no cierra al insertar: eso lo decide el padre en `onInsert` (Task 3).

- [ ] **Step 3: Verificar build y lint**

Run: `pnpm build && pnpm lint`
Expected: ambos sin errores. (El componente aún no se usa; `noUnusedLocals` no aplica a exports.)

- [ ] **Step 4: Commit**

```bash
git add src/components/MermaidDialog.tsx src/index.css
git commit -m "feat: diálogo de inserción de diagramas Mermaid con preview en vivo"
```

---

### Task 3: Conectar la Toolbar

**Files:**
- Modify: `src/components/Toolbar.tsx`

- [ ] **Step 1: Actualizar imports y eliminar `MERMAID_TEMPLATES`**

Reemplazar (línea 1):

```tsx
import { useState, useRef, useEffect } from 'react'
```

por:

```tsx
import { useState } from 'react'
```

(`useRef`/`useEffect` solo los usaba el dropdown; `noUnusedLocals` fallaría si quedan.)

Añadir tras el import de `AboutDialog`:

```tsx
import { MermaidDialog } from './MermaidDialog'
import { MERMAID_VERTICAL_DEF, asMermaidBlock } from '../utils/mermaidTemplates'
```

Eliminar por completo el bloque (líneas 34-37):

```tsx
const MERMAID_TEMPLATES = {
  Vertical:   '```mermaid\ngraph TD\n  A --> B\n  A --> C\n```',
  Horizontal: '```mermaid\ngraph LR\n  subgraph Izquierda\n    direction TB\n    A --> B\n    A --> C\n  end\n  subgraph Derecha\n    direction TB\n    D --> E\n    D --> F\n  end\n  A --> D\n```',
}
```

- [ ] **Step 2: Reemplazar el estado del menú por el del diálogo**

Reemplazar (líneas 204-214):

```tsx
  const [showMermaidMenu, setShowMermaidMenu] = useState(false)
  const mermaidMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMermaidMenu) return
    const handler = (e: MouseEvent) => {
      if (!mermaidMenuRef.current?.contains(e.target as Node)) setShowMermaidMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMermaidMenu])
```

por:

```tsx
  const [showMermaidDialog, setShowMermaidDialog] = useState(false)
```

- [ ] **Step 3: Reemplazar el split-button y el dropdown**

Reemplazar todo el `<div ref={mermaidMenuRef} ...>` (líneas 264-314) por:

```tsx
          <div style={{ position: 'relative', display: 'flex', gap: 2 }}>
            <button
              type="button"
              className="btn"
              aria-label="Insertar diagrama Mermaid vertical"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onInsertText?.(asMermaidBlock(MERMAID_VERTICAL_DEF))}
            >
              Mermaid
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '4px 6px' }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowMermaidDialog(true)}
              aria-label="Más tipos de diagrama Mermaid"
              aria-haspopup="dialog"
            >
              ▾
            </button>
          </div>
```

- [ ] **Step 4: Renderizar el diálogo**

Junto al `<AboutDialog ...>` del final (línea 459), añadir:

```tsx
      <MermaidDialog
        isOpen={showMermaidDialog}
        onClose={() => setShowMermaidDialog(false)}
        onInsert={(md) => {
          onInsertText?.(md)
          setShowMermaidDialog(false)
        }}
      />
```

- [ ] **Step 5: Verificar build y lint**

Run: `pnpm build && pnpm lint`
Expected: ambos sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/Toolbar.tsx
git commit -m "feat: botón Mermaid inserta vertical y ▾ abre el diálogo de diagramas"
```

---

### Task 4: Verificación manual

**Files:** ninguno (solo verificación)

- [ ] **Step 1: Arrancar el dev server**

Run: `pnpm dev`
Expected: Vite sirve en `http://localhost:5173`.

- [ ] **Step 2: Checklist en el navegador**

1. Clic en **Mermaid** → se inserta el bloque ` ```mermaid graph TD ... ``` ` en el cursor y el preview del editor lo renderiza.
2. Clic en **▾** → se abre el popup "Insertar diagrama Mermaid" con borde y franja divisoria cyan.
3. Los 18 tipos aparecen agrupados en las 4 categorías; hover y selección en tonos brave-cyan.
4. Seleccionar varios tipos (mínimo: Flowchart horizontal, Sequence, Kanban, Sankey, Architecture, C4) → cada uno muestra su preview renderizado sin romper el popup.
5. **Insertar** → el código entra en el editor, el popup se cierra y el preview lo renderiza.
6. Clic en el fondo oscuro o en ✕ → el popup se cierra.

- [ ] **Step 3: Commit final si hubo ajustes**

Solo si el checklist obligó a retocar algo:

```bash
git add -A src/
git commit -m "fix: ajustes del diálogo Mermaid tras verificación manual"
```
