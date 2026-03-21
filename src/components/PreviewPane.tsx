import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'

type PreviewPaneProps = {
  html: string
}

export const PreviewPane = forwardRef<HTMLDivElement, PreviewPaneProps>(
  function PreviewPane({ html }, forwardedRef) {
    const containerRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(forwardedRef, () => containerRef.current!, [])

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const codeBlocks = container.querySelectorAll('pre')
      const controllers: AbortController[] = []

      codeBlocks.forEach((pre) => {
        const button = document.createElement('button')
        button.className = 'copy-code-button'
        button.setAttribute('aria-label', 'Copiar código')
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
        button.title = 'Copiar código'

        const wrapper = document.createElement('div')
        wrapper.className = 'code-block-wrapper'

        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)
        wrapper.appendChild(button)

        const controller = new AbortController()
        controllers.push(controller)

        button.addEventListener('click', async () => {
          const code = pre.querySelector('code')?.textContent || pre.textContent || ''
          try {
            await navigator.clipboard.writeText(code)
            button.classList.add('copied')
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`
            setTimeout(() => {
              button.classList.remove('copied')
              button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
            }, 2000)
          } catch (err) {
            console.error('Error al copiar:', err)
          }
        }, { signal: controller.signal })
      })

      return () => {
        controllers.forEach(c => c.abort())
        codeBlocks.forEach((pre) => {
          const wrapper = pre.parentElement
          if (wrapper?.classList.contains('code-block-wrapper')) {
            wrapper.parentNode?.insertBefore(pre, wrapper)
            wrapper.remove()
          }
        })
      }
    }, [html])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'auto' }}>
        <div
          ref={containerRef}
          className="preview-content"
          role="region"
          aria-label="Vista previa del Markdown"
          style={{
            flex: 1,
            padding: '1rem',
            overflow: 'auto',
            background: 'var(--bg-secondary)',
          }}
          dangerouslySetInnerHTML={{ __html: html || '<p class="preview-placeholder" style="color:var(--text-muted)">Tu vista previa aparecerá aquí.</p>' }}
        />
      </div>
    )
  }
)
