'use client'

import { toBlob } from 'html-to-image'
import { PDFDocument } from 'pdf-lib'
import {
  RESUME_A4_HEIGHT_PT,
  RESUME_A4_WIDTH_PT,
  RESUME_DOCUMENT_WIDTH,
  RESUME_PDF_PAGE_COUNT,
} from '../constants'
import {
  addLinkAnnotationsToPage,
  type ResumePdfLinkAnnotation,
} from './resume-pdf-annotations'
import {
  addSearchableTextLayerToResumePdf,
  collectResumeTextRuns,
  fetchResumePdfFontBytes,
} from './resume-pdf-text-layer'

type SchedulerWindow = Window & {
  scheduler?: {
    yield?: () => Promise<void>
  }
}

type ResumePdfWorkerResponse =
  | {
      pdfBytes: ArrayBuffer
      type: 'success'
    }
  | {
      message: string
      type: 'error'
    }

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function canvasToJpegBytes(canvas: HTMLCanvasElement) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas를 JPEG Blob으로 변환할 수 없습니다.'))
          return
        }

        blob.arrayBuffer().then(resolve).catch(reject)
      },
      'image/jpeg',
      0.96
    )
  })
}

function waitForFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

async function yieldToMain() {
  const scheduler = (window as SchedulerWindow).scheduler

  if (scheduler?.yield) {
    await scheduler.yield()
    return
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0)
  })
}

function setTemporaryInlineStyle(
  element: Element,
  styles: Record<string, string>
) {
  const previousStyle = element.getAttribute('style')
  const styledElement = element as HTMLElement | SVGElement

  Object.entries(styles).forEach(([property, value]) => {
    styledElement.style.setProperty(property, value)
  })

  return () => {
    if (previousStyle === null) {
      element.removeAttribute('style')
      return
    }

    element.setAttribute('style', previousStyle)
  }
}

function applyResumeExportStyleOverrides(element: HTMLElement) {
  const restoreStyles = [
    ...Array.from(element.querySelectorAll('[data-resume-link-icon-base]')).map((node) =>
      setTemporaryInlineStyle(node, {
        opacity: '1',
        stroke: '#667088',
        visibility: 'visible',
      })
    ),
    ...Array.from(element.querySelectorAll('[data-resume-link-icon-gradient]')).map((node) =>
      setTemporaryInlineStyle(node, {
        display: 'none',
        opacity: '0',
        visibility: 'hidden',
      })
    ),
  ]

  return () => {
    restoreStyles.forEach((restoreStyle) => restoreStyle())
  }
}

function collectResumeLinkAnnotations(element: HTMLElement): ResumePdfLinkAnnotation[] {
  const elementRect = element.getBoundingClientRect()

  if (elementRect.width <= 0 || elementRect.height <= 0) {
    return []
  }

  const sourceScaleX = RESUME_DOCUMENT_WIDTH / elementRect.width
  const sourceScaleY = element.scrollHeight / elementRect.height

  return Array.from(
    element.querySelectorAll<HTMLAnchorElement>('a[data-resume-pdf-link]')
  ).map((anchor) => {
    const anchorRect = anchor.getBoundingClientRect()

    return {
      href: anchor.dataset.resumePdfLink ?? anchor.href,
      rect: {
        x: (anchorRect.left - elementRect.left) * sourceScaleX,
        y: (anchorRect.top - elementRect.top) * sourceScaleY,
        width: anchorRect.width * sourceScaleX,
        height: anchorRect.height * sourceScaleY,
      },
    }
  })
}

function supportsResumePdfWorker() {
  return (
    typeof Worker !== 'undefined' &&
    typeof OffscreenCanvas !== 'undefined' &&
    typeof createImageBitmap !== 'undefined'
  )
}

async function buildPdfInWorker({
  imageBlob,
  linkAnnotations,
  sourcePageHeight,
  textRuns,
}: {
  imageBlob: Blob
  linkAnnotations: ResumePdfLinkAnnotation[]
  sourcePageHeight: number
  textRuns: ReturnType<typeof collectResumeTextRuns>
}) {
  const worker = new Worker(new URL('./resume-pdf.worker.ts', import.meta.url), {
    type: 'module',
  })

  try {
    const imageBytes = await imageBlob.arrayBuffer()
    const fontBytes =
      textRuns.length > 0 ? await fetchResumePdfFontBytes() : undefined

    return await new Promise<Uint8Array>((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<ResumePdfWorkerResponse>) => {
        const response = event.data

        if (response.type === 'error') {
          reject(new Error(response.message))
          return
        }

        resolve(new Uint8Array(response.pdfBytes))
      }

      worker.onerror = (event) => {
        reject(new Error(event.message || 'PDF worker 처리에 실패했습니다.'))
      }

      worker.postMessage(
        {
          fontBytes,
          imageBytes,
          imageType: imageBlob.type,
          linkAnnotations,
          sourcePageHeight,
          textRuns,
        },
        fontBytes ? [imageBytes, fontBytes] : [imageBytes]
      )
    })
  } finally {
    worker.terminate()
  }
}

async function buildPdfOnMainThread({
  imageBlob,
  linkAnnotations,
  sourcePageHeight,
}: {
  imageBlob: Blob
  linkAnnotations: ResumePdfLinkAnnotation[]
  sourcePageHeight: number
}) {
  const imageUrl = URL.createObjectURL(imageBlob)

  try {
    const sourceImage = await loadImage(imageUrl)
    const pdf = await PDFDocument.create()
    const sliceHeight = Math.floor(
      (sourceImage.naturalWidth * RESUME_A4_HEIGHT_PT) / RESUME_A4_WIDTH_PT
    )

    for (let pageIndex = 0; pageIndex < RESUME_PDF_PAGE_COUNT; pageIndex += 1) {
      const offsetY = pageIndex * sliceHeight
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Canvas context를 만들 수 없습니다.')
      }

      canvas.width = sourceImage.naturalWidth
      canvas.height = sliceHeight

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(
        sourceImage,
        0,
        offsetY,
        sourceImage.naturalWidth,
        sliceHeight,
        0,
        0,
        sourceImage.naturalWidth,
        sliceHeight
      )

      await yieldToMain()

      const page = pdf.addPage([RESUME_A4_WIDTH_PT, RESUME_A4_HEIGHT_PT])
      const jpgBytes = await canvasToJpegBytes(canvas)
      const jpg = await pdf.embedJpg(jpgBytes)

      page.drawImage(jpg, {
        x: 0,
        y: 0,
        width: RESUME_A4_WIDTH_PT,
        height: RESUME_A4_HEIGHT_PT,
      })

      addLinkAnnotationsToPage({
        links: linkAnnotations,
        page,
        pageIndex,
        pdf,
        sourcePageHeight,
      })

      await yieldToMain()
    }

    return pdf.save()
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

export async function buildResumePdfFromElement(element: HTMLElement) {
  await document.fonts?.ready

  const sourcePageHeight =
    (RESUME_DOCUMENT_WIDTH * RESUME_A4_HEIGHT_PT) / RESUME_A4_WIDTH_PT
  const captureHeight = Math.ceil(sourcePageHeight * RESUME_PDF_PAGE_COUNT)
  const contentHeight = Math.ceil(element.scrollHeight)

  if (contentHeight > captureHeight) {
    throw new Error(
      `이력서 콘텐츠 높이(${contentHeight}px)가 4페이지 제한(${captureHeight}px)을 초과했습니다.`
    )
  }

  element.dataset.resumeExport = 'true'
  const restoreExportStyleOverrides = applyResumeExportStyleOverrides(element)
  await waitForFrame()
  await yieldToMain()

  let imageBlob: Blob | null
  const linkAnnotations = collectResumeLinkAnnotations(element)
  const textRuns = collectResumeTextRuns(element)

  try {
    imageBlob = await toBlob(element, {
      backgroundColor: '#ffffff',
      cacheBust: true,
      height: captureHeight,
      pixelRatio: 2,
      skipAutoScale: true,
      width: RESUME_DOCUMENT_WIDTH,
      style: {
        height: `${captureHeight}px`,
        margin: '0',
        minHeight: `${captureHeight}px`,
        transform: 'none',
        transformOrigin: 'top left',
      },
    })
  } finally {
    restoreExportStyleOverrides()
    delete element.dataset.resumeExport
  }

  if (!imageBlob) {
    throw new Error('이력서 이미지를 생성할 수 없습니다.')
  }

  await yieldToMain()

  let pdfBytes: Uint8Array

  if (supportsResumePdfWorker()) {
    try {
      pdfBytes = await buildPdfInWorker({
        imageBlob,
        linkAnnotations,
        sourcePageHeight,
        textRuns,
      })
      return pdfBytes
    } catch (error) {
      console.warn('PDF worker 처리 실패. 메인 스레드 fallback으로 전환합니다.', error)
      await yieldToMain()
      pdfBytes = await buildPdfOnMainThread({
        imageBlob,
        linkAnnotations,
        sourcePageHeight,
      })
    }
  } else {
    pdfBytes = await buildPdfOnMainThread({
      imageBlob,
      linkAnnotations,
      sourcePageHeight,
    })
  }

  try {
    return await addSearchableTextLayerToResumePdf({
      pdfBytes,
      sourcePageHeight,
      textRuns,
    })
  } catch (error) {
    console.warn('PDF 텍스트 레이어 추가 실패. 이미지 PDF로 다운로드합니다.', error)
    return pdfBytes
  }
}
