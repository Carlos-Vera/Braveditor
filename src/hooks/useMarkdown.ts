import { useMemo, useState, useEffect } from 'react'
import { markdownToHtml } from '../utils/markdown'
import { loadDraft, saveDraft } from '../utils/fileHandling'
import { t } from '../i18n'

export const INITIAL = t('initialDocument')

export function useMarkdown() {
  const [raw, setRaw] = useState(() => loadDraft() ?? INITIAL)
  const html = useMemo(() => markdownToHtml(raw), [raw])

  useEffect(() => {
    saveDraft(raw)
  }, [raw])

  return { raw, html, setContent: setRaw }
}
