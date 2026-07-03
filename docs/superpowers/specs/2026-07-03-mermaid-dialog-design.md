# Popup de diagramas Mermaid — Diseño

**Fecha:** 2026-07-03

## Objetivo

El botón "Mermaid" de la toolbar inserta directamente la plantilla vertical. El dropdown actual (Vertical/Horizontal) se sustituye por un popup modal con todos los tipos de diagrama Mermaid, con preview en vivo y selección visual.

## Cambios

### 1. `src/components/Toolbar.tsx`

- Botón **Mermaid**: `onClick` inserta la plantilla vertical actual (`graph TD`) vía `onInsertText`.
- Botón **▾**: abre el nuevo `MermaidDialog` (estado `showMermaidDialog`).
- Se elimina: el dropdown, el efecto de click-fuera (`mermaidMenuRef`), y `MERMAID_TEMPLATES` (la vertical se queda como constante local; la horizontal se muda a las plantillas nuevas).

### 2. `src/utils/mermaidTemplates.ts` (nuevo)

Array de plantillas `{ category, label, code }`, con `code` como bloque ` ```mermaid ` listo para insertar. Ejemplos mínimos por tipo:

| Categoría | Tipos |
|---|---|
| Diagramas de proceso y flujo | Flowchart horizontal, Sequence, State, User Journey, Kanban |
| Datos y estructura | ER, Class, Sankey, Quadrant, XY chart, Pie |
| Planificación y proyectos | Gantt, Git graph, Timeline, Mindmap |
| Arquitectura | Architecture, C4, Block |

### 3. `src/components/MermaidDialog.tsx` (nuevo)

Modal con el mismo patrón de overlay que la guía de sintaxis (fixed, click en el fondo cierra):

- Cabecera: título "Insertar diagrama Mermaid" + botón ✕.
- **Master-detail**: columna izquierda con los tipos agrupados por categoría; franja divisoria vertical; panel derecho con el preview.
- Al seleccionar un tipo, se renderiza su diagrama con `mermaid.render()` (mermaid ya está inicializado globalmente en `PreviewPane.tsx`). Solo se renderiza el tipo seleccionado.
- Botón **Insertar**: llama a `onInsertText(code)` y cierra el popup.
- Estado inicial: primer tipo seleccionado (Flowchart horizontal).

### 4. Estilo (nota del usuario)

Colores brave en el popup: bordes y franja divisoria en `var(--brave-cyan)`, hovers en `var(--brave-cyan-hover)` para botones de tipo, Insertar y ✕. Fondos con las variables existentes (`--bg-primary`, `--bg-secondary`).

## Manejo de errores

Si `mermaid.render()` falla para una plantilla, el panel de preview muestra el mensaje de error; el popup no se rompe y el botón Insertar sigue funcionando.

## Verificación

- `pnpm build` y `pnpm lint` limpios.
- Manual: botón Mermaid inserta vertical; ▾ abre popup; seleccionar tipo muestra preview; Insertar mete el código en el cursor y el preview del editor lo renderiza.
