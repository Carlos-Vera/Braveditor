/**
 * Dado un texto y un offset (índice), devuelve línea (1-based) y columna (1-based).
 * Usa el mismo texto que el del editor para que Ln/Col coincidan con la posición del cursor.
 */
export function getLineColumn(text: string, offset: number): { line: number; column: number } {
  if (!text || offset <= 0) return { line: 1, column: 1 }
  const safeOffset = Math.min(offset, text.length)
  const before = text.slice(0, safeOffset)
  const lines = before.split(/\r?\n/)
  const line = lines.length
  const column = (lines[lines.length - 1]?.length ?? 0) + 1
  return { line, column }
}

/**
 * Cuenta el número total de líneas del texto.
 */
export function getTotalLines(text: string): number {
  if (!text) return 1
  const lines = text.split(/\r?\n/)
  return lines.length
}

/**
 * Información de selección: líneas y caracteres seleccionados.
 */
export function getSelectionInfo(
  text: string,
  start: number,
  end: number
): { lineStart: number; lineEnd: number; selectedLines: number; selectedChars: number } {
  const lineStart = getLineColumn(text, start).line
  const lineEnd = getLineColumn(text, end).line
  const selectedLines = Math.max(1, lineEnd - lineStart + 1)
  const selectedChars = Math.max(0, end - start)
  return { lineStart, lineEnd, selectedLines, selectedChars }
}

/**
 * Tamaño en bytes del texto (UTF-8).
 */
export function getByteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

/**
 * Número de palabras (segmentos separados por espacios).
 */
export function getWordCount(text: string): number {
  const t = text.trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
}

/**
 * Estadísticas del contenido renderizado (HTML): caracteres, palabras y párrafos.
 * Cuenta párrafos gramaticalmente: bloques de contenido significativo incluyendo
 * <p>, <li>, <blockquote>, <h1>-<h6>, y <pre>.
 */
export function getPreviewStats(html: string): { characters: number; words: number; paragraphs: number } {
  if (!html || !html.trim()) {
    return { characters: 0, words: 0, paragraphs: 0 }
  }
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  // Contar bloques de contenido que gramaticalmente son párrafos
  const pTags = (html.match(/<p\b/gi) ?? []).length
  const liTags = (html.match(/<li\b/gi) ?? []).length
  const blockquotes = (html.match(/<blockquote\b/gi) ?? []).length
  const headings = (html.match(/<h[1-6]\b/gi) ?? []).length
  const codeBlocks = (html.match(/<pre\b/gi) ?? []).length

  const paragraphs = pTags + liTags + blockquotes + headings + codeBlocks

  return {
    characters: text.length,
    words: text ? text.split(/\s+/).filter(Boolean).length : 0,
    paragraphs,
  }
}
