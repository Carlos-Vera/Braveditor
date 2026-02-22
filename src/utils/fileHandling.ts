const DRAFT_KEY = 'braveditor-draft'

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file, 'UTF-8')
  })
}

export function downloadMarkdown(content: string, filename: string = 'documento.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function saveDraft(content: string): void {
  try {
    // Validar tamaño (localStorage límite típico: 5-10MB)
    const sizeInBytes = new Blob([content]).size
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (sizeInBytes > maxSize) {
      if (import.meta.env.DEV) {
        console.warn(`Draft content too large: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`)
      }
      return
    }

    localStorage.setItem(DRAFT_KEY, content)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error saving draft:', error)
    }
  }
}

export function loadDraft(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error loading draft:', error)
    }
    return null
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}
