import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td']

export async function markdownToHtmlAsync(md: string): Promise<string> {
  const raw = await marked.parse(md)
  return DOMPurify.sanitize(String(raw ?? ''), { ALLOWED_TAGS })
}
