import { refractor } from 'refractor'
// import rehypePrismGenerator from 'rehype-prism-plus/generator'

// Extend markdown language with N8n variable pattern ({{ ... }})
if (refractor.languages?.markdown) {
  const originalMarkdown = { ...refractor.languages.markdown }
  refractor.languages.markdown = {
    'n8n-variable': {
      pattern: /\{\{[^}]+\}\}/,
      greedy: true,
    },
    ...originalMarkdown,
  }
  if (refractor.languages.mdx) {
    const originalMdx = { ...refractor.languages.mdx }
    refractor.languages.mdx = {
      'n8n-variable': {
        pattern: /\{\{[^}]+\}\}/,
        greedy: true,
      },
      ...originalMdx,
    }
  }
}

// export const rehypePrismWithN8n = rehypePrismGenerator(refractor)

/** @deprecated Use rehypePrismWithN8n and pass as rehypePlugins instead. Kept for backwards compatibility. */
export function setupN8nHighlighting() {
  // No-op: n8n is now applied via rehypePrismWithN8n in EditorPane
}
