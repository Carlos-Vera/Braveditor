import { useState, useCallback, useEffect } from 'react'
import { markdownToHtmlAsync } from '../utils/markdown'
import { loadDraft, saveDraft } from '../utils/fileHandling'

const INITIAL = `# Hola Braveditor

Escribe **Markdown** aquí. La vista previa se actualiza en tiempo real.

- Lista
- De
- Items
`

export function useMarkdown() {
  const [raw, setRaw] = useState(() => loadDraft() ?? INITIAL)
  const [html, setHtml] = useState('')

  const setContent = useCallback((value: string) => {
    setRaw(value)
  }, [])

  useEffect(() => {
    let cancelled = false
    markdownToHtmlAsync(raw).then((out) => {
      if (!cancelled) setHtml(out)
    })
    return () => { cancelled = true }
  }, [raw])

  useEffect(() => {
    saveDraft(raw)
  }, [raw])

  return { raw, html, setContent }
}
