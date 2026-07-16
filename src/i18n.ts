// Diccionario de traducciones de BraveEditor (i18n).
// Sin dependencias externas, sin motor de interpolación: los componentes
// construyen las cadenas dinámicas concatenando `t('clave')` con variables,
// p.ej. `${n} ${t('words')}`. Para plurales se exponen pares singular/plural
// (p.ej. `day`/`days`, `paragraph`/`paragraphs`) y el componente elige con un
// ternario (`n !== 1 ? t('days') : t('day')`).

const en = {
  // ---- App.tsx ----
  appConfirmDiscard: 'Discard the current document?',
  appDefaultFilename: 'document.md',

  // ---- Toolbar.tsx ----
  toolbarBarAria: 'Format and file toolbar',
  toolbarAboutTooltip: 'About BraveEditor',
  toolbarVersionTooltip: 'BraveEditor version',
  toolbarEditorWord: 'Editor',
  toolbarTextMenu: 'Text menu',
  toolbarBold: 'Bold',
  toolbarItalic: 'Italic',
  toolbarH1: 'H1',
  toolbarH2: 'H2',
  toolbarH3: 'H3',
  toolbarUl: 'List',
  toolbarOl: 'Numbered list',
  toolbarLink: 'Link',
  toolbarImage: 'Image',
  toolbarCode: 'Code',
  toolbarAddPrefix: 'Add',
  toolbarMermaid: 'Mermaid',
  toolbarInsertMermaidAria: 'Insert Mermaid code',
  toolbarMoreMermaidAria: 'More Mermaid code types',
  toolbarAchievementsAria: 'Achievements and gamification',
  toolbarSyntaxButton: 'MD Syntax',
  toolbarSyntaxAria: 'Markdown syntax guide',
  toolbarFileMenu: 'File menu',
  toolbarNew: 'New',
  toolbarOpen: 'Open',
  toolbarSave: 'Save',
  toolbarUpdate: 'Update',
  toolbarSyntaxDialogTitle: 'Markdown Syntax Guide',
  toolbarSyntaxSourceLabel: 'Source:',

  // ---- Toolbar.tsx: SYNTAX_EXAMPLES (title + markdown body) ----
  syntaxH1Title: 'H1 - Heading level 1',
  syntaxH1Code: '# Heading level 1',
  syntaxH2Title: 'H2 - Heading level 2',
  syntaxH2Code: '## Heading level 2',
  syntaxH3Title: 'H3 - Heading level 3',
  syntaxH3Code: '### Heading level 3',
  syntaxH4Title: 'H4 - Heading level 4',
  syntaxH4Code: '#### Heading level 4',
  syntaxH5Title: 'H5 - Heading level 5',
  syntaxH5Code: '##### Heading level 5',
  syntaxH6Title: 'H6 - Heading level 6',
  syntaxH6Code: '###### Heading level 6',
  syntaxEmphasisTitle: 'Emphasis',
  syntaxEmphasisCode: `*italic* or _italic_
**bold** or __bold__
***bold and italic***`,
  syntaxListsTitle: 'Lists',
  syntaxListsCode: `Unordered list:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Ordered list:
1. First item
2. Second item
3. Third item`,
  syntaxLinksTitle: 'Links',
  syntaxLinksCode: `[Link text](https://example.com)
[Link with title](https://example.com "Title")

Automatic links:
<https://example.com>`,
  syntaxImagesTitle: 'Images',
  syntaxImagesCode: `![Alt text](https://via.placeholder.com/150)
![Image with title](image.jpg "Title")`,
  syntaxImagesAltText: 'Alt text',
  syntaxCodeTitle: 'Code',
  syntaxCodeCode: `Inline code: \`console.log("Hello")\`

Code block:
\`\`\`javascript
function greet() {
  console.log("Hello world");
}
\`\`\``,
  syntaxQuotesTitle: 'Quotes (Blockquotes)',
  syntaxQuotesCode: `> This is a quote.
> It can span multiple lines.

> Nested quotes:
> > Nesting level 2`,
  syntaxHrTitle: 'Horizontal rules',
  syntaxHrCode: `Text before

---

Text after`,
  syntaxTablesTitle: 'Tables',
  syntaxTablesCode: `| Column 1  | Column 2  | Column 3 |
|-----------|:---------:|---------:|
| Left      | Center    | Right    |
| Data 1    | Data 2    | Data 3   |`,
  syntaxTasksTitle: 'Task lists',
  syntaxTasksCode: `- [x] Completed task
- [ ] Pending task
- [ ] Another task to do`,
  syntaxCombinedTitle: 'Combinations',
  syntaxCombinedCode: `# Document title

This is a **paragraph** with *emphasis*.

## Feature list

- First feature
- Second feature
  - Sub-feature
- Third feature

> **Important note**: You can combine all the elements.

\`\`\`javascript
const example = "code";
\`\`\``,

  // ---- SyntaxExample.tsx ----
  syntaxExampleCodeLabel: 'Markdown code',
  syntaxExamplePreviewLabel: 'Preview',
  syntaxExampleInsertButton: 'Insert',
  syntaxExampleInsertTitle: 'Insert into editor',

  // ---- MermaidDialog.tsx ----
  mermaidDialogTitle: 'Insert Mermaid code',
  mermaidClose: 'Close',
  mermaidLoadingDiagram: 'Loading diagram',

  // ---- utils/mermaidTemplates.ts (category labels) ----
  mermaidCategoryProcess: 'Process and flow diagrams',
  mermaidCategoryData: 'Data and structure',
  mermaidCategoryPlanning: 'Planning and projects',
  mermaidCategoryArchitecture: 'Architecture',

  // ---- FontPicker.tsx ----
  fontSettingsAria: 'Settings',
  fontAdjustTitle: 'Font Settings',
  fontInUse: 'In use',
  fontAdd: 'Add',
  fontRemove: 'Remove font',
  fontClose: 'Close',

  // ---- EditorPane.tsx ----
  editorPlaceholder: 'Type your text here...',

  // ---- hooks/useMarkdown.ts (default document) ----
  initialDocument: `# Hello Braveditor

Write **Markdown** here. The preview updates in real time.

- List
- Of
- Items
`,

  // ---- PreviewPane.tsx ----
  previewPlaceholder: 'Your preview will appear here.',
  previewCopyCode: 'Copy code',
  previewRegionAria: 'Markdown preview',
  previewExpandDiagramAria: 'Expand diagram',
  previewDiagramError: 'Could not render diagram',
  previewZoomInAria: 'Zoom in',
  previewZoomInTitle: 'Zoom in 50%',
  previewZoomOutAria: 'Zoom out',
  previewZoomOutTitle: 'Zoom out 50%',
  previewResetViewAria: 'Reset view',
  previewResetViewTitle: 'Initial position and zoom',
  previewCloseAria: 'Close',

  // ---- SplitLayout.tsx ----
  splitResizeAria: 'Resize panels',
  splitHideToolbarAria: 'Hide toolbar',
  splitShowToolbarAria: 'Show toolbar',
  splitShowEditorOnlyAria: 'Show editor only',
  splitCopiedAria: 'Copied',
  splitCopyAllAria: 'Copy all Markdown code',
  splitSyncScrollOnAria: 'Sync scroll: on',
  splitSyncScrollOffAria: 'Sync scroll: off',
  splitShowPreviewOnlyAria: 'Show preview only',
  splitShowSplitViewAria: 'Show split view',
  splitHideFooterAria: 'Hide status bar',
  splitShowFooterAria: 'Show status bar',

  // ---- EditorStatusBar.tsx ----
  statusFooterAria: 'Editor information',
  statusEditorStatsAria: 'Editor statistics',
  statusPreviewStatsAria: 'Preview statistics',
  statusCharsWithSpaces: 'chars w/spaces',
  statusCharsWithoutSpaces: 'chars w/o spaces',
  statusLn: 'Ln',
  statusCol: 'Col',
  statusCodeType: 'Markdown',

  // ---- Generic count units (shared, unprefixed) ----
  words: 'words',
  lines: 'lines',
  characters: 'characters',
  paragraph: 'paragraph',
  paragraphs: 'paragraphs',
  day: 'day',
  days: 'days',

  // ---- AboutDialog.tsx ----
  aboutVersionLabel: 'Version',
  aboutTagline: 'Professional Markdown editor with gamification',
  aboutDescription:
    'BraveEditor is a minimalist yet powerful Markdown editor with real-time preview, built for writers and developers looking for productivity and motivation through an integrated gamification system.',
  aboutFeaturesTitle: 'Key features:',
  aboutFeature1: '✍️ Code editor built on CodeMirror 6 with syntax highlighting',
  aboutFeature2: '👁️ Real-time preview with Markdown rendering',
  aboutFeature3: '⚡ Synchronized scrolling between editor and preview',
  aboutFeature4: '🎯 Gamification system with XP, levels, and achievements',
  aboutFeature5: '🔥 Daily writing streak tracking',
  aboutFeature6: '📊 Detailed word count and writing time statistics',
  aboutFeature7: '🎨 Dark theme optimized for long sessions',
  aboutFeature8: '💾 Autosave and .md file management',
  aboutFeature9: '📝 Interactive Markdown syntax guide',
  aboutFeature10: '🏆 Achievement panel with unlockable badges',
  aboutFeature11: '🔒 HTML sanitization for security',
  aboutFeature12: '⌨️ Keyboard shortcuts for quick formatting',
  aboutCreatedByTitle: 'Created by:',
  aboutRoleDeveloper: 'Lead Developer',
  aboutRoleCollaborator: 'Collaborator',
  aboutLicenseTitle: 'License:',
  aboutLinksTitle: 'Links:',
  aboutLinkRepo: '📦 GitHub Repository',
  aboutRightsReserved: 'All rights reserved.',

  // ---- AchievementPanel.tsx ----
  achCategoryWriting: 'Writing',
  achCategoryMarkdown: 'Markdown',
  achCategoryProductivity: 'Productivity',
  achCategorySpecial: 'Special',
  achCategoryLevels: 'Levels',
  achDialogTitle: 'Achievements',
  achLevelWord: 'Level',
  achStatXpTotal: 'Total XP',
  achStatWords: 'Words',
  achStatSaved: 'Saved',
  achStatStreak: 'Streak',
  achMaxLabel: 'Max:',
  achGamificationSystemLabel: 'Gamification system',
  achEnabledLabel: 'Enabled',
  achDisabledLabel: 'Disabled',

  // ---- utils/achievementDefs.ts (name/description per achievement id) ----
  achFirstWordsName: 'First Words',
  achFirstWordsDesc: 'Write your first 200 words',
  achWordsmithName: 'Writer',
  achWordsmithDesc: 'Write 1,000 words in total',
  achNovelistName: 'Novelist',
  achNovelistDesc: 'Write 5,000 words in total',
  achProlificName: 'Prolific',
  achProlificDesc: 'Write 10,000 words in total',
  achMarathonName: 'Marathoner',
  achMarathonDesc: 'Write 20,000 words in total',
  achBoldMoveName: 'Bold Move',
  achBoldMoveDesc: 'Use bold text 20 times',
  achHeadingMasterName: 'Heading Master',
  achHeadingMasterDesc: 'Use headings 40 times',
  achLinkBuilderName: 'Link Builder',
  achLinkBuilderDesc: 'Insert 30 links',
  achCodeNinjaName: 'Code Ninja',
  achCodeNinjaDesc: 'Use code blocks 20 times',
  achListLoverName: 'List Lover',
  achListLoverDesc: 'Create 40 lists',
  achFormatExplorerName: 'Format Explorer',
  achFormatExplorerDesc: 'Use 10 different format types',
  achFirstSaveName: 'First Save',
  achFirstSaveDesc: 'Save your first document',
  achSaverName: 'Guardian',
  achSaverDesc: 'Save 20 documents',
  achTime10Name: '20 Minutes',
  achTime10Desc: 'Spend 20 minutes editing',
  achTime60Name: '2 Hours',
  achTime60Desc: 'Spend 2 hours editing',
  achStreak3Name: 'Streak of 6',
  achStreak3Desc: 'Keep a 6-day streak',
  achStreak7Name: 'Streak of 14',
  achStreak7Desc: 'Keep a 14-day streak',
  achBraveAceName: 'Braves Ace',
  achBraveAceDesc: 'Unlock all achievements',

  // ---- utils/gamification.ts (LEVEL_TIERS titles) ----
  levelApprentice: 'Apprentice',
  levelWriter: 'Writer',
  levelAuthor: 'Author',
  levelMaster: 'Master',
  levelLegend: 'Legend',
  levelGrandMaster: 'Grand Master',

  // ---- StreakCounter.tsx ----
  streakTodayCompletedAria: 'Today streak completed',
  streakCounterLabel: 'Streak of',
  streakKeepGoingHint: 'Write every day to keep it going',
  streakMultiplierLabel: 'XP multiplier',
  streakForWord: 'to',
  streakMaxMultiplierReached: '🏆 Maximum multiplier reached',

  // ---- StreakCalendar.tsx ----
  streakCalendarTitle: 'Last 30 days',
  streakNoActivity: 'No activity',

  // ---- XPBar.tsx ----
  xpLevelPrefix: 'Lv.',
  xpAbbrev: 'XP',
} as const;

const es: Record<TranslationKey, string> = {
  // ---- App.tsx ----
  appConfirmDiscard: '¿Descartar el documento actual?',
  appDefaultFilename: 'documento.md',

  // ---- Toolbar.tsx ----
  toolbarBarAria: 'Barra de formato y archivo',
  toolbarAboutTooltip: 'Acerca de BraveEditor',
  toolbarVersionTooltip: 'Versión de BraveEditor',
  toolbarEditorWord: 'Editor',
  toolbarTextMenu: 'Menú de texto',
  toolbarBold: 'Negrita',
  toolbarItalic: 'Cursiva',
  toolbarH1: 'H1',
  toolbarH2: 'H2',
  toolbarH3: 'H3',
  toolbarUl: 'Lista',
  toolbarOl: 'Lista numerada',
  toolbarLink: 'Enlace',
  toolbarImage: 'Imagen',
  toolbarCode: 'Código',
  toolbarAddPrefix: 'Agregar',
  toolbarMermaid: 'Mermaid',
  toolbarInsertMermaidAria: 'Insertar código Mermaid',
  toolbarMoreMermaidAria: 'Más tipos de código Mermaid',
  toolbarAchievementsAria: 'Logros y gamificación',
  toolbarSyntaxButton: 'Sintaxis MD',
  toolbarSyntaxAria: 'Guía de sintaxis Markdown',
  toolbarFileMenu: 'Menú de archivo',
  toolbarNew: 'Nuevo',
  toolbarOpen: 'Abrir',
  toolbarSave: 'Guardar',
  toolbarUpdate: 'Actualizar',
  toolbarSyntaxDialogTitle: 'Guía de Sintaxis Markdown',
  toolbarSyntaxSourceLabel: 'Fuente:',

  // ---- Toolbar.tsx: SYNTAX_EXAMPLES (title + markdown body) ----
  syntaxH1Title: 'H1 - Encabezado nivel 1',
  syntaxH1Code: '# Encabezado nivel 1',
  syntaxH2Title: 'H2 - Encabezado nivel 2',
  syntaxH2Code: '## Encabezado nivel 2',
  syntaxH3Title: 'H3 - Encabezado nivel 3',
  syntaxH3Code: '### Encabezado nivel 3',
  syntaxH4Title: 'H4 - Encabezado nivel 4',
  syntaxH4Code: '#### Encabezado nivel 4',
  syntaxH5Title: 'H5 - Encabezado nivel 5',
  syntaxH5Code: '##### Encabezado nivel 5',
  syntaxH6Title: 'H6 - Encabezado nivel 6',
  syntaxH6Code: '###### Encabezado nivel 6',
  syntaxEmphasisTitle: 'Énfasis',
  syntaxEmphasisCode: `*cursiva* o _cursiva_
**negrita** o __negrita__
***negrita y cursiva***`,
  syntaxListsTitle: 'Listas',
  syntaxListsCode: `Lista desordenada:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Lista ordenada:
1. Primer item
2. Segundo item
3. Tercer item`,
  syntaxLinksTitle: 'Enlaces',
  syntaxLinksCode: `[Texto del enlace](https://ejemplo.com)
[Enlace con título](https://ejemplo.com "Título")

Enlaces automáticos:
<https://ejemplo.com>`,
  syntaxImagesTitle: 'Imágenes',
  syntaxImagesCode: `![Texto alternativo](https://via.placeholder.com/150)
![Imagen con título](imagen.jpg "Título")`,
  syntaxImagesAltText: 'Texto alternativo',
  syntaxCodeTitle: 'Código',
  syntaxCodeCode: `Código en línea: \`console.log("Hola")\`

Bloque de código:
\`\`\`javascript
function saludar() {
  console.log("Hola mundo");
}
\`\`\``,
  syntaxQuotesTitle: 'Citas (Blockquotes)',
  syntaxQuotesCode: `> Esto es una cita.
> Puede tener múltiples líneas.

> Citas anidadas:
> > Nivel 2 de anidación`,
  syntaxHrTitle: 'Líneas horizontales',
  syntaxHrCode: `Texto antes

---

Texto después`,
  syntaxTablesTitle: 'Tablas',
  syntaxTablesCode: `| Columna 1 | Columna 2 | Columna 3 |
|-----------|:---------:|----------:|
| Izquierda | Centrado  | Derecha   |
| Dato 1    | Dato 2    | Dato 3    |`,
  syntaxTasksTitle: 'Listas de tareas',
  syntaxTasksCode: `- [x] Tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea por hacer`,
  syntaxCombinedTitle: 'Combinaciones',
  syntaxCombinedCode: `# Título del documento

Este es un **párrafo** con *énfasis*.

## Lista de características

- Primera característica
- Segunda característica
  - Sub-característica
- Tercera característica

> **Nota importante**: Puedes combinar todos los elementos.

\`\`\`javascript
const ejemplo = "código";
\`\`\``,

  // ---- SyntaxExample.tsx ----
  syntaxExampleCodeLabel: 'Código Markdown',
  syntaxExamplePreviewLabel: 'Preview',
  syntaxExampleInsertButton: 'Insertar',
  syntaxExampleInsertTitle: 'Insertar en editor',

  // ---- MermaidDialog.tsx ----
  mermaidDialogTitle: 'Insertar código Mermaid',
  mermaidClose: 'Cerrar',
  mermaidLoadingDiagram: 'Cargando diagrama',

  // ---- utils/mermaidTemplates.ts (category labels) ----
  mermaidCategoryProcess: 'Diagramas de proceso y flujo',
  mermaidCategoryData: 'Datos y estructura',
  mermaidCategoryPlanning: 'Planificación y proyectos',
  mermaidCategoryArchitecture: 'Arquitectura',

  // ---- FontPicker.tsx ----
  fontSettingsAria: 'Ajustes',
  fontAdjustTitle: 'Ajuste de Fuentes',
  fontInUse: 'En uso',
  fontAdd: 'Añadir',
  fontRemove: 'Quitar fuente',
  fontClose: 'Cerrar',

  // ---- EditorPane.tsx ----
  editorPlaceholder: 'Escribe aquí tu código...',

  // ---- hooks/useMarkdown.ts (default document) ----
  initialDocument: `# Hola Braveditor

Escribe **Markdown** aquí. La vista previa se actualiza en tiempo real.

- Lista
- De
- Items
`,

  // ---- PreviewPane.tsx ----
  previewPlaceholder: 'Tu vista previa aparecerá aquí.',
  previewCopyCode: 'Copiar código',
  previewRegionAria: 'Vista previa del Markdown',
  previewExpandDiagramAria: 'Expandir diagrama',
  previewDiagramError: 'No se pudo renderizar el diagrama',
  previewZoomInAria: 'Acercar',
  previewZoomInTitle: 'Acercar 50%',
  previewZoomOutAria: 'Alejar',
  previewZoomOutTitle: 'Alejar 50%',
  previewResetViewAria: 'Restablecer vista',
  previewResetViewTitle: 'Posición y zoom inicial',
  previewCloseAria: 'Cerrar',

  // ---- SplitLayout.tsx ----
  splitResizeAria: 'Redimensionar paneles',
  splitHideToolbarAria: 'Ocultar barra de navegación',
  splitShowToolbarAria: 'Mostrar barra de navegación',
  splitShowEditorOnlyAria: 'Mostrar solo editor',
  splitCopiedAria: 'Copiado',
  splitCopyAllAria: 'Copiar todo el Código Markdown',
  splitSyncScrollOnAria: 'Sincronizar scroll: activado',
  splitSyncScrollOffAria: 'Sincronizar scroll: desactivado',
  splitShowPreviewOnlyAria: 'Mostrar solo preview',
  splitShowSplitViewAria: 'Mostrar vista dividida',
  splitHideFooterAria: 'Ocultar barra de estado',
  splitShowFooterAria: 'Mostrar barra de estado',

  // ---- EditorStatusBar.tsx ----
  statusFooterAria: 'Información del editor',
  statusEditorStatsAria: 'Estadísticas del editor',
  statusPreviewStatsAria: 'Estadísticas de la preview',
  statusCharsWithSpaces: 'caract. c/espacios',
  statusCharsWithoutSpaces: 'caract. s/espacios',
  statusLn: 'Ln',
  statusCol: 'Col',
  statusCodeType: 'Markdown',

  // ---- Generic count units (shared, unprefixed) ----
  words: 'palabras',
  lines: 'líneas',
  characters: 'caracteres',
  paragraph: 'párrafo',
  paragraphs: 'párrafos',
  day: 'día',
  days: 'días',

  // ---- AboutDialog.tsx ----
  aboutVersionLabel: 'Versión',
  aboutTagline: 'Editor Markdown profesional con gamificación',
  aboutDescription:
    'Editor Markdown minimalista y potente con preview en tiempo real, diseñado para escritores y desarrolladores que buscan productividad y motivación mediante un sistema de gamificación integrado.',
  aboutFeaturesTitle: 'Funcionalidades principales:',
  aboutFeature1: '✍️ Editor de código basado en CodeMirror 6 con syntax highlighting',
  aboutFeature2: '👁️ Preview en tiempo real con renderizado Markdown',
  aboutFeature3: '⚡ Sincronización de scroll entre editor y preview',
  aboutFeature4: '🎯 Sistema de gamificación con XP, niveles y logros',
  aboutFeature5: '🔥 Tracking de rachas de escritura diaria',
  aboutFeature6: '📊 Estadísticas detalladas de palabras y tiempo de escritura',
  aboutFeature7: '🎨 Tema oscuro optimizado para largas sesiones',
  aboutFeature8: '💾 Autoguardado y gestión de archivos .md',
  aboutFeature9: '📝 Guía interactiva de sintaxis Markdown',
  aboutFeature10: '🏆 Panel de logros con badges desbloqueables',
  aboutFeature11: '🔒 Sanitización de HTML para seguridad',
  aboutFeature12: '⌨️ Atajos de teclado para formato rápido',
  aboutCreatedByTitle: 'Creado por:',
  aboutRoleDeveloper: 'Desarrollador Principal',
  aboutRoleCollaborator: 'Colaborador',
  aboutLicenseTitle: 'Licencia:',
  aboutLinksTitle: 'Enlaces:',
  aboutLinkRepo: '📦 Repositorio GitHub',
  aboutRightsReserved: 'Todos los derechos reservados.',

  // ---- AchievementPanel.tsx ----
  achCategoryWriting: 'Escritura',
  achCategoryMarkdown: 'Markdown',
  achCategoryProductivity: 'Productividad',
  achCategorySpecial: 'Especial',
  achCategoryLevels: 'Niveles',
  achDialogTitle: 'Logros',
  achLevelWord: 'Nivel',
  achStatXpTotal: 'XP Total',
  achStatWords: 'Palabras',
  achStatSaved: 'Guardados',
  achStatStreak: 'Racha',
  achMaxLabel: 'Máx:',
  achGamificationSystemLabel: 'Sistema de gamificación',
  achEnabledLabel: 'Activado',
  achDisabledLabel: 'Desactivado',

  // ---- utils/achievementDefs.ts (name/description per achievement id) ----
  achFirstWordsName: 'Primeras Palabras',
  achFirstWordsDesc: 'Escribe tus primeras 200 palabras',
  achWordsmithName: 'Escritor',
  achWordsmithDesc: 'Escribe 1,000 palabras en total',
  achNovelistName: 'Novelista',
  achNovelistDesc: 'Escribe 5,000 palabras en total',
  achProlificName: 'Prolífico',
  achProlificDesc: 'Escribe 10,000 palabras en total',
  achMarathonName: 'Maratonista',
  achMarathonDesc: 'Escribe 20,000 palabras en total',
  achBoldMoveName: 'Movimiento Audaz',
  achBoldMoveDesc: 'Usa negrita 20 veces',
  achHeadingMasterName: 'Maestro de Títulos',
  achHeadingMasterDesc: 'Usa encabezados 40 veces',
  achLinkBuilderName: 'Constructor de Enlaces',
  achLinkBuilderDesc: 'Inserta 30 enlaces',
  achCodeNinjaName: 'Ninja del Código',
  achCodeNinjaDesc: 'Usa bloques de código 20 veces',
  achListLoverName: 'Amante de Listas',
  achListLoverDesc: 'Crea 40 listas',
  achFormatExplorerName: 'Explorador de Formato',
  achFormatExplorerDesc: 'Usa 10 tipos de formato diferentes',
  achFirstSaveName: 'Primera Guardada',
  achFirstSaveDesc: 'Guarda tu primer documento',
  achSaverName: 'Guardián',
  achSaverDesc: 'Guarda 20 documentos',
  achTime10Name: '20 Minutos',
  achTime10Desc: 'Pasa 20 minutos editando',
  achTime60Name: '2 Horas',
  achTime60Desc: 'Pasa 2 horas editando',
  achStreak3Name: 'Racha de 6',
  achStreak3Desc: 'Mantén una racha de 6 días',
  achStreak7Name: 'Racha de 14',
  achStreak7Desc: 'Mantén una racha de 14 días',
  achBraveAceName: 'As de Braves',
  achBraveAceDesc: 'Consigue todos los logros',

  // ---- utils/gamification.ts (LEVEL_TIERS titles) ----
  levelApprentice: 'Aprendiz',
  levelWriter: 'Escritor',
  levelAuthor: 'Autor',
  levelMaster: 'Maestro',
  levelLegend: 'Leyenda',
  levelGrandMaster: 'Gran Maestro',

  // ---- StreakCounter.tsx ----
  streakTodayCompletedAria: 'Racha de hoy completada',
  streakCounterLabel: 'Racha de',
  streakKeepGoingHint: 'Escribe cada día para no perderla',
  streakMultiplierLabel: 'Multiplicador de XP',
  streakForWord: 'para',
  streakMaxMultiplierReached: '🏆 Multiplicador máximo alcanzado',

  // ---- StreakCalendar.tsx ----
  streakCalendarTitle: 'Últimos 30 días',
  streakNoActivity: 'Sin actividad',

  // ---- XPBar.tsx ----
  xpLevelPrefix: 'Nv.',
  xpAbbrev: 'XP',
};

export type TranslationKey = keyof typeof en;

export const lang: 'en' | 'es' = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';

document.documentElement.lang = lang;

const dict = lang === 'es' ? es : en;

export const t = (key: TranslationKey): string => dict[key];
