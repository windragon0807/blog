'use client'

import { toPng } from 'html-to-image'
import { PDFDocument } from 'pdf-lib'
import {
  RESUME_A4_HEIGHT_PT,
  RESUME_A4_WIDTH_PT,
  RESUME_DOCUMENT_WIDTH,
  RESUME_PDF_PAGE_COUNT,
} from '../constants'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

async function dataUrlToArrayBuffer(dataUrl: string) {
  const response = await fetch(dataUrl)
  return response.arrayBuffer()
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

  const imageDataUrl = await toPng(element, {
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

  const sourceImage = await loadImage(imageDataUrl)
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

    const page = pdf.addPage([RESUME_A4_WIDTH_PT, RESUME_A4_HEIGHT_PT])
    const jpgBytes = await dataUrlToArrayBuffer(canvas.toDataURL('image/jpeg', 0.96))
    const jpg = await pdf.embedJpg(jpgBytes)

    page.drawImage(jpg, {
      x: 0,
      y: 0,
      width: RESUME_A4_WIDTH_PT,
      height: RESUME_A4_HEIGHT_PT,
    })
  }

  return pdf.save()
}
