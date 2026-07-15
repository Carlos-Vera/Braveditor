import { t } from '../i18n'

const DRAFT_KEY = 'braveditor-draft'

// File System Access API (Chrome/Edge): tipos mínimos que no están en lib.dom
type MarkdownPickerType = { description: string; accept: Record<string, string[]> }

declare global {
  interface Window {
    showOpenFilePicker?: (options?: { types?: MarkdownPickerType[] }) => Promise<FileSystemFileHandle[]>
    showSaveFilePicker?: (options?: { suggestedName?: string; types?: MarkdownPickerType[] }) => Promise<FileSystemFileHandle>
  }
}

const MD_PICKER_TYPES: MarkdownPickerType[] = [
  { description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown'] } },
]

export function supportsFilePickers(): boolean {
  return typeof window.showOpenFilePicker === 'function'
}

/** Abre un .md con picker nativo y devuelve el handle para poder reescribirlo luego. */
export async function openMarkdownFile(): Promise<{ handle: FileSystemFileHandle; text: string } | null> {
  if (!window.showOpenFilePicker) return null
  const [handle] = await window.showOpenFilePicker({ types: MD_PICKER_TYPES })
  const file = await handle.getFile()
  return { handle, text: await file.text() }
}

/** Sobrescribe el archivo en disco con el contenido actual. */
export async function writeMarkdownFile(handle: FileSystemFileHandle, content: string): Promise<void> {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

/** Pide destino una sola vez; las siguientes escrituras van directas al handle. */
export async function pickSaveHandle(filename: string): Promise<FileSystemFileHandle | null> {
  if (!window.showSaveFilePicker) return null
  return window.showSaveFilePicker({
    suggestedName: filename.endsWith('.md') ? filename : `${filename}.md`,
    types: MD_PICKER_TYPES,
  })
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file, 'UTF-8')
  })
}

export function downloadMarkdown(content: string, filename: string = t('appDefaultFilename')): void {
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
