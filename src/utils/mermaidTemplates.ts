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
