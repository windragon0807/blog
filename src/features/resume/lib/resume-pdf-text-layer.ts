'use client'

import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb } from 'pdf-lib'
import {
  RESUME_A4_HEIGHT_PT,
  RESUME_A4_WIDTH_PT,
  RESUME_DOCUMENT_WIDTH,
  RESUME_PDF_PAGE_COUNT,
} from '../constants'

export type ResumePdfTextRun = {
  fontSize: number
  height: number
  text: string
  width: number
  x: number
  y: number
}

function isVisibleTextNode(textNode: Text) {
  const parent = textNode.parentElement

  if (!parent) return false
  if (parent.closest('[aria-hidden="true"]')) return false

  const style = window.getComputedStyle(parent)

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    Number.parseFloat(style.opacity || '1') > 0
  )
}

function normalizePdfText(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

export function collectResumeTextRuns(element: HTMLElement): ResumePdfTextRun[] {
  const elementRect = element.getBoundingClientRect()

  if (elementRect.width <= 0 || elementRect.height <= 0) {
    return []
  }

  const sourceScaleX = RESUME_DOCUMENT_WIDTH / elementRect.width
  const sourceScaleY = element.scrollHeight / elementRect.height
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const textRuns: ResumePdfTextRun[] = []

  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text
    const text = normalizePdfText(textNode.textContent ?? '')

    if (!text || !isVisibleTextNode(textNode)) continue

    const range = document.createRange()
    range.selectNodeContents(textNode)
    const rect = Array.from(range.getClientRects()).find(
      (clientRect) => clientRect.width > 0 && clientRect.height > 0
    )
    range.detach()

    if (!rect) continue

    const parent = textNode.parentElement
    const style = parent ? window.getComputedStyle(parent) : null
    const fontSize = style ? Number.parseFloat(style.fontSize) : 10

    textRuns.push({
      fontSize: Number.isFinite(fontSize) ? fontSize * sourceScaleY : 10,
      height: rect.height * sourceScaleY,
      text,
      width: rect.width * sourceScaleX,
      x: (rect.left - elementRect.left) * sourceScaleX,
      y: (rect.top - elementRect.top) * sourceScaleY,
    })
  }

  return textRuns
}

export async function fetchResumePdfFontBytes() {
  const response = await fetch('/resume/font/pretendard-regular')

  if (!response.ok) {
    throw new Error(`PDF 텍스트 폰트를 불러오지 못했습니다. status=${response.status}`)
  }

  return response.arrayBuffer()
}

export async function addSearchableTextRunsToPdfDocument({
  fontBytes,
  pdf,
  sourcePageHeight,
  textRuns,
}: {
  fontBytes: ArrayBuffer
  pdf: PDFDocument
  sourcePageHeight: number
  textRuns: readonly ResumePdfTextRun[]
}) {
  if (textRuns.length === 0) {
    return
  }

  pdf.registerFontkit(fontkit)

  const font = await pdf.embedFont(fontBytes, { subset: true })
  const pages = pdf.getPages()
  const sourceToPdfScale = RESUME_A4_WIDTH_PT / RESUME_DOCUMENT_WIDTH

  textRuns.forEach((textRun) => {
    const pageIndex = Math.floor(textRun.y / sourcePageHeight)

    if (pageIndex < 0 || pageIndex >= RESUME_PDF_PAGE_COUNT) return

    const page = pages[pageIndex]
    const localSourceY = textRun.y - pageIndex * sourcePageHeight
    const x = textRun.x * sourceToPdfScale
    const y =
      RESUME_A4_HEIGHT_PT -
      (localSourceY + textRun.height * 0.82) * sourceToPdfScale

    page.drawText(textRun.text, {
      color: rgb(0, 0, 0),
      font,
      opacity: 0,
      size: Math.max(1, textRun.fontSize * sourceToPdfScale),
      x,
      y,
    })
  })
}

export async function addSearchableTextLayerToResumePdf({
  pdfBytes,
  sourcePageHeight,
  textRuns,
}: {
  pdfBytes: Uint8Array
  sourcePageHeight: number
  textRuns: readonly ResumePdfTextRun[]
}) {
  if (textRuns.length === 0) {
    return pdfBytes
  }

  const pdf = await PDFDocument.load(pdfBytes)
  const fontBytes = await fetchResumePdfFontBytes()

  await addSearchableTextRunsToPdfDocument({
    fontBytes,
    pdf,
    sourcePageHeight,
    textRuns,
  })

  return pdf.save()
}
