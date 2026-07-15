import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from 'react'
import mermaid from 'mermaid'
import elkLayouts from '@mermaid-js/layout-elk'
import svgPanZoom from 'svg-pan-zoom'
import { FontPicker } from './FontPicker'
import { t } from '../i18n'

// Layout ELK: líneas rectas ortogonales y mínimo de cruces entre aristas
mermaid.registerLayoutLoaders(elkLayouts)

// Los temas de mermaid piden series numeradas (cScale0..7, git0..7…) con el
// mismo valor; genera { key0: value, …, key{count-1}: value }
const series = (key: string, count: number, value: string): Record<string, string> =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [`${key}${i}`, value]))

mermaid.initialize({
  startOnLoad: false,
  // Tema base con la paleta de la app para que encaje sobre el fondo del preview
  theme: 'base',
  themeVariables: {
    darkMode: true,
    background: '#1a1a1a',
    primaryColor: '#262626',
    primaryTextColor: '#f2f2f2',
    // Bordes de cajas casi invisibles; líneas/flechas en blanco
    primaryBorderColor: '#333333',
    lineColor: '#e0e0e0',
    secondaryColor: '#262626',
    tertiaryColor: '#303030',
    clusterBkg: 'transparent',
    clusterBorder: 'transparent',
    edgeLabelBackground: '#1a1a1a',
    // Títulos (subgrafos, gantt, timeline, journey…) en blanco
    titleColor: '#e0e0e0',
    // Misma tipografía que los bloques de código del preview
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '15px',

    // Secciones (timeline, mindmap): relleno gris, borde casi invisible
    ...series('cScale', 8, '#262626'),
    ...series('cScalePeer', 8, '#333333'),
    ...series('cScaleLabel', 8, '#e0e0e0'),

    // User Journey: relleno neutro de secciones y tareas
    ...series('fillType', 8, '#262626'),

    // Pie chart: cian oscuro / verde apagado / rojo apagado, sin borde, texto blanco
    pie1: '#018f89',
    pie2: '#2f7a3f',
    pie3: '#a13538',
    pie4: '#018f89',
    pie5: '#2f7a3f',
    pie6: '#a13538',
    pie7: '#018f89',
    pie8: '#2f7a3f',
    pieTitleTextColor: '#e0e0e0',
    pieSectionTextColor: '#0d0d0d',
    pieLegendTextColor: '#e0e0e0',
    pieStrokeColor: 'none',
    pieStrokeWidth: '0px',
    pieOuterStrokeColor: 'none',
    pieOuterStrokeWidth: '0px',
    pieOpacity: '1',

    // Git graph: ramas blancas, commits con borde casi invisible
    ...series('git', 8, '#e0e0e0'),
    ...series('gitBranchLabel', 8, '#e0e0e0'),
    commitLabelColor: '#e0e0e0',
    commitLabelBackground: '#262626',
    tagLabelColor: '#e0e0e0',
    tagLabelBackground: '#262626',
    tagLabelBorder: '#333333',

    // Gantt: colores neutros
    sectionBkgColor: 'rgba(255, 255, 255, 0.05)',
    altSectionBkgColor: 'transparent',
    sectionBkgColor2: 'rgba(255, 255, 255, 0.08)',
    taskBkgColor: '#262626',
    taskBorderColor: '#333333',
    taskTextColor: '#f2f2f2',
    taskTextLightColor: '#f2f2f2',
    taskTextDarkColor: '#0d0d0d',
    taskTextOutsideColor: '#e0e0e0',
    activeTaskBkgColor: '#444444',
    activeTaskBorderColor: '#333333',
    doneTaskBkgColor: '#46a758',
    doneTaskBorderColor: '#46a758',
    critBkgColor: '#e5484d',
    critBorderColor: '#e5484d',
    todayLineColor: '#e5484d',
    gridColor: '#333333',

    // Quadrant chart: neutro
    quadrant1Fill: 'rgba(255, 255, 255, 0.06)',
    quadrant2Fill: 'rgba(255, 255, 255, 0.04)',
    quadrant3Fill: 'rgba(255, 255, 255, 0.05)',
    quadrant4Fill: 'rgba(255, 255, 255, 0.05)',
    quadrant1TextFill: '#e0e0e0',
    quadrant2TextFill: '#e0e0e0',
    quadrant3TextFill: '#e0e0e0',
    quadrant4TextFill: '#e0e0e0',
    quadrantPointFill: '#888888',
    quadrantPointTextFill: '#e0e0e0',
    quadrantXAxisTextFill: '#9ca3af',
    quadrantYAxisTextFill: '#9ca3af',
    quadrantTitleFill: '#e0e0e0',
    quadrantInternalBorderStrokeFill: '#333333',
    quadrantExternalBorderStrokeFill: '#333333',

    // Sequence diagram: actores con borde casi invisible, flechas/líneas blancas
    actorBkg: '#262626',
    actorBorder: '#333333',
    actorTextColor: '#f2f2f2',
    actorLineColor: '#e0e0e0',
    signalColor: '#e0e0e0',
    signalTextColor: '#e0e0e0',
    activationBkgColor: '#262626',
    activationBorderColor: '#333333',
    noteBkgColor: '#262626',
    noteBorderColor: '#333333',
    noteTextColor: '#f2f2f2',
    labelBoxBkgColor: '#262626',
    labelBoxBorderColor: '#333333',
    loopTextColor: '#e0e0e0',

    // ER: filas alternas oscuras (la cabecera se pinta por CSS)
    attributeBackgroundColorOdd: '#1a1a1a',
    attributeBackgroundColorEven: '#262626',

    // C4
    personBkg: '#262626',
    personBorder: '#333333',

    // Architecture: bordes casi invisibles, flechas blancas
    archEdgeColor: '#e0e0e0',
    archEdgeArrowColor: '#e0e0e0',
    archGroupBorderColor: '#333333',

    // XY chart (excepción: barras con borde cian, textos blancos)
    xyChart: {
      backgroundColor: 'transparent',
      titleColor: '#e0e0e0',
      xAxisLabelColor: '#e0e0e0',
      xAxisTitleColor: '#e0e0e0',
      xAxisTickColor: '#333333',
      xAxisLineColor: '#333333',
      yAxisLabelColor: '#e0e0e0',
      yAxisTitleColor: '#e0e0e0',
      yAxisTickColor: '#333333',
      yAxisLineColor: '#333333',
      // Barras del gris del fondo (el borde cian lo pone el CSS)
      plotColorPalette: '#262626, #46a758',
    },
  },
  // Aire arriba y abajo de los títulos (los diagramas que lo soportan)
  quadrantChart: { titlePadding: 24 },
  xyChart: { titlePadding: 24 },
  gantt: { titleTopMargin: 30 },
  flowchart: { curve: 'linear' },
  layout: 'elk',
})

let mermaidIdCounter = 0

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`

type PreviewPaneProps = {
  html: string
}

export const PreviewPane = forwardRef<HTMLDivElement, PreviewPaneProps>(
  function PreviewPane({ html }, forwardedRef) {
    const containerRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(forwardedRef, () => containerRef.current!, [])

    const [expandedSvg, setExpandedSvg] = useState<string | null>(null)
    const svgContainerRef = useRef<HTMLDivElement>(null)
    const panZoomRef = useRef<SvgPanZoom.Instance | null>(null)

    // Pan/zoom del modal con svg-pan-zoom (el mismo motor que usan las
    // extensiones de Mermaid): zoom suave hacia el cursor y arrastre para mover
    useEffect(() => {
      if (!expandedSvg) return
      document.body.style.overflow = 'hidden'

      const svgEl = svgContainerRef.current?.querySelector('svg')
      let panZoom: SvgPanZoom.Instance | null = null
      if (svgEl) {
        // Mermaid fija max-width inline; el svg debe llenar el contenedor
        svgEl.style.width = '100%'
        svgEl.style.height = '100%'
        svgEl.style.maxWidth = 'none'
        panZoom = svgPanZoom(svgEl, {
          zoomEnabled: true,
          panEnabled: true,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true,
          preventMouseEventsDefault: true,
          zoomScaleSensitivity: 0.15,
          // Zoom out máximo: apenas más pequeño que el diagrama ajustado (1 = fit)
          minZoom: 0.85,
          maxZoom: 40,
          fit: true,
          center: true,
        })
        // Margen de respiro alrededor del diagrama ajustado
        panZoom.zoomBy(0.9)
        panZoom.center()
        panZoomRef.current = panZoom
      }

      return () => {
        panZoomRef.current = null
        panZoom?.destroy()
        document.body.style.overflow = ''
      }
    }, [expandedSvg])

    // Vuelve a la posición y zoom inicial (ajustado con margen)
    const resetView = () => {
      const pz = panZoomRef.current
      if (!pz) return
      pz.fit()
      pz.center()
      pz.zoomBy(0.9)
    }

    // Copy button effect
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const codeBlocks = container.querySelectorAll('pre')
      const controllers: AbortController[] = []

      codeBlocks.forEach((pre) => {
        if (pre.querySelector('code.language-mermaid')) return

        const button = document.createElement('button')
        button.className = 'copy-code-button'
        button.setAttribute('aria-label', t('previewCopyCode'))
        button.innerHTML = COPY_ICON
        button.title = t('previewCopyCode')

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
            button.innerHTML = CHECK_ICON
            setTimeout(() => {
              button.classList.remove('copied')
              button.innerHTML = COPY_ICON
            }, 2000)
          } catch (err) {
            console.error('Error al copiar:', err)
          }
        }, { signal: controller.signal })
      })

      return () => {
        controllers.forEach(c => c.abort())
        codeBlocks.forEach((pre) => {
          if (pre.querySelector('code.language-mermaid')) return
          const wrapper = pre.parentElement
          if (wrapper?.classList.contains('code-block-wrapper')) {
            wrapper.parentNode?.insertBefore(pre, wrapper)
            wrapper.remove()
          }
        })
      }
    }, [html])

    // Mermaid rendering effect
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const mermaidCodes = container.querySelectorAll<HTMLElement>('pre code.language-mermaid')
      if (mermaidCodes.length === 0) return

      const renderAll = async () => {
        const codesArray = Array.from(mermaidCodes)
        for (let i = 0; i < codesArray.length; i++) {
          const codeEl = codesArray[i]
          let definition = codeEl.textContent || ''
          // El renderer ER de mermaid 11 aplana el diagrama con su TB por
          // defecto; LR lo ordena en columnas (como las extensiones de
          // Mermaid) salvo que el autor indique una dirección explícita
          if (/\berDiagram\b/.test(definition) && !/^\s*direction\s+(TB|BT|LR|RL)\b/m.test(definition)) {
            definition = definition.replace(/\berDiagram\b/, 'erDiagram\ndirection LR')
          }
          const pre = codeEl.closest('pre')
          if (!pre) continue

          try {
            const id = `mermaid-graph-${++mermaidIdCounter}-${i}`
            const { svg } = await mermaid.render(id, definition)

            const wrapper = document.createElement('div')
            wrapper.className = 'mermaid-diagram'
            const sourceLine = pre.getAttribute('data-source-line')
            if (sourceLine) wrapper.setAttribute('data-source-line', sourceLine)

            const toolbar = document.createElement('div')
            toolbar.className = 'mermaid-diagram-toolbar'

            const expandBtn = document.createElement('button')
            expandBtn.className = 'btn'
            expandBtn.setAttribute('aria-label', t('previewExpandDiagramAria'))
            expandBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`
            expandBtn.addEventListener('click', () => setExpandedSvg(svg))
            toolbar.appendChild(expandBtn)

            const content = document.createElement('div')
            content.className = 'mermaid-diagram-content'
            content.innerHTML = svg

            wrapper.appendChild(toolbar)
            wrapper.appendChild(content)
            pre.parentNode?.replaceChild(wrapper, pre)
          } catch (err) {
            console.error('Mermaid render error:', err)
          }
        }
      }
      renderAll()
    }, [html])

    const closeModal = () => setExpandedSvg(null)

    return (
      <>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'auto', background: 'var(--bg-secondary)' }}>
          <div style={{ position: 'absolute', top: 8, right: 12, zIndex: 20 }}>
            <FontPicker />
          </div>
          <div
            ref={containerRef}
            className="preview-content"
            role="region"
            aria-label={t('previewRegionAria')}
            style={{ flex: 1, padding: '1rem', overflow: 'auto' }}
            dangerouslySetInnerHTML={{ __html: html || `<p class="preview-placeholder" style="color:var(--text-muted)">${t('previewPlaceholder')}</p>` }}
          />
        </div>

        {expandedSvg && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              zIndex: 2000,
              userSelect: 'none',
            }}
          >
            <div className="mermaid-modal-controls">
              <button
                className="btn"
                onClick={() => panZoomRef.current?.zoomBy(1.5)}
                aria-label={t('previewZoomInAria')}
                title={t('previewZoomInTitle')}
                dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>` }}
              />
              <button
                className="btn"
                onClick={() => panZoomRef.current?.zoomBy(1 / 1.5)}
                aria-label={t('previewZoomOutAria')}
                title={t('previewZoomOutTitle')}
                dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>` }}
              />
              <button
                className="btn"
                onClick={resetView}
                aria-label={t('previewResetViewAria')}
                title={t('previewResetViewTitle')}
                dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>` }}
              />
              <button
                className="btn"
                onClick={closeModal}
                aria-label={t('previewCloseAria')}
              >
                ✕
              </button>
            </div>
            <div
              ref={svgContainerRef}
              className="mermaid-modal-svg"
              dangerouslySetInnerHTML={{ __html: expandedSvg }}
            />
          </div>
        )}
      </>
    )
  }
)
