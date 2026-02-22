export type ToolbarAction =
  | 'bold'
  | 'italic'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'ul'
  | 'ol'
  | 'code'
  | 'link'
  | 'image'

/**
 * Información de la selección del editor.
 * Solo contiene offsets para evitar duplicar el contenido del texto.
 */
export type EditorSelection = {
  start: number
  end: number
}
