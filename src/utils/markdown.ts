import { marked } from 'marked'
import type { Token } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td']

// Renderiza bloque por bloque inyectando data-source-line (1-based) en cada
// elemento de nivel superior, para anclar el scroll editor<->preview por línea.
export async function markdownToHtmlAsync(md: string): Promise<string> {
  const tokens = marked.lexer(md)
  let line = 1
  let html = ''

  for (const token of tokens as Token[]) {
    const startLine = line
    const raw = token.raw ?? ''
    line += (raw.match(/\n/g)?.length ?? 0)

    if (token.type === 'space') continue

    const part = marked.parser([token])
    // Inyecta el atributo en la primera etiqueta de apertura del bloque
    html += part.replace(/^(\s*)<([a-zA-Z][\w-]*)/, `$1<$2 data-source-line="${startLine}"`)
  }

  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ADD_ATTR: ['data-source-line'] })
}
