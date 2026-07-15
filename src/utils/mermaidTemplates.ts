// Plantillas de diagramas Mermaid para el diálogo de inserción.
// `def` es el código Mermaid sin fences; envolver con asMermaidBlock() al insertar.

import { t } from '../i18n'

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
    category: t('mermaidCategoryProcess'),
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
    category: t('mermaidCategoryProcess'),
    label: 'Sequence diagram',
    def: `sequenceDiagram
  participant A as Ana
  participant B as Beto
  A->>B: Hola, ¿estado del pedido?
  B-->>A: Enviado ayer`,
  },
  {
    category: t('mermaidCategoryProcess'),
    label: 'State diagram',
    def: `stateDiagram-v2
  [*] --> Borrador
  Borrador --> Revision: enviar
  Revision --> Publicado: aprobar
  Revision --> Borrador: rechazar
  Publicado --> [*]`,
  },
  {
    category: t('mermaidCategoryProcess'),
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
    category: t('mermaidCategoryProcess'),
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
    category: t('mermaidCategoryData'),
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
    category: t('mermaidCategoryData'),
    label: 'XY chart',
    def: `xychart-beta
  title "Ventas por mes"
  x-axis [ene, feb, mar, abr]
  y-axis "Ventas" 0 --> 100
  bar [30, 55, 42, 70]
  line [30, 55, 42, 70]`,
  },
  {
    category: t('mermaidCategoryData'),
    label: 'Pie chart',
    def: `pie title Lenguajes
  "TypeScript" : 60
  "CSS" : 25
  "HTML" : 15`,
  },
  // ── Planificación y proyectos ──
  {
    category: t('mermaidCategoryPlanning'),
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
    category: t('mermaidCategoryPlanning'),
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
    category: t('mermaidCategoryPlanning'),
    label: 'Timeline',
    def: `timeline
  title Historia del producto
  2024 : Idea
  2025 : Prototipo
  2026 : Lanzamiento`,
  },
  {
    category: t('mermaidCategoryPlanning'),
    label: 'Mindmap',
    def: `mindmap
  root((Idea))
    Concepto
      Detalle
    Recurso
      Ejemplo`,
  },
  // ── Arquitectura ──
  {
    category: t('mermaidCategoryArchitecture'),
    label: 'Block diagram',
    def: `block-beta
  columns 3
  a["Cabecera"]:3
  b["Menú"] c["Contenido"]:2`,
  },
]
