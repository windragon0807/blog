import { PDFArray, PDFBool, PDFName, PDFString } from 'pdf-lib'
import type { PDFDocument, PDFPage } from 'pdf-lib'
import {
  RESUME_A4_HEIGHT_PT,
  RESUME_A4_WIDTH_PT,
  RESUME_DOCUMENT_WIDTH,
} from '../constants'

export type ResumePdfLinkAnnotation = {
  href: string
  rect: {
    height: number
    width: number
    x: number
    y: number
  }
}

function getOrCreatePageAnnotations(pdf: PDFDocument, page: PDFPage) {
  const existingAnnotations = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray)

  if (existingAnnotations) {
    return existingAnnotations
  }

  const annotations = pdf.context.obj([]) as PDFArray
  page.node.set(PDFName.of('Annots'), annotations)

  return annotations
}

function addLinkAnnotation(
  pdf: PDFDocument,
  page: PDFPage,
  rect: [number, number, number, number],
  href: string
) {
  const annotations = getOrCreatePageAnnotations(pdf, page)
  const linkAnnotation = pdf.context.register(
    pdf.context.obj({
      Type: PDFName.of('Annot'),
      Subtype: PDFName.of('Link'),
      Rect: rect,
      Border: [0, 0, 0],
      A: {
        Type: PDFName.of('Action'),
        S: PDFName.of('URI'),
        URI: PDFString.of(href),
        NewWindow: PDFBool.True,
      },
    })
  )

  annotations.push(linkAnnotation)
}

export function addLinkAnnotationsToPage({
  links,
  page,
  pageIndex,
  pdf,
  sourcePageHeight,
}: {
  links: readonly ResumePdfLinkAnnotation[]
  page: PDFPage
  pageIndex: number
  pdf: PDFDocument
  sourcePageHeight: number
}) {
  const sourceToPdfScale = RESUME_A4_WIDTH_PT / RESUME_DOCUMENT_WIDTH
  const pageSourceTop = pageIndex * sourcePageHeight
  const pageSourceBottom = pageSourceTop + sourcePageHeight

  links.forEach((link) => {
    const sourceTop = link.rect.y
    const sourceBottom = link.rect.y + link.rect.height

    if (sourceBottom <= pageSourceTop || sourceTop >= pageSourceBottom) {
      return
    }

    const clippedSourceTop = Math.max(sourceTop, pageSourceTop)
    const clippedSourceBottom = Math.min(sourceBottom, pageSourceBottom)
    const clippedSourceLeft = Math.max(link.rect.x, 0)
    const clippedSourceRight = Math.min(link.rect.x + link.rect.width, RESUME_DOCUMENT_WIDTH)

    if (clippedSourceRight <= clippedSourceLeft || clippedSourceBottom <= clippedSourceTop) {
      return
    }

    const localSourceTop = clippedSourceTop - pageSourceTop
    const localSourceBottom = clippedSourceBottom - pageSourceTop

    addLinkAnnotation(
      pdf,
      page,
      [
        clippedSourceLeft * sourceToPdfScale,
        RESUME_A4_HEIGHT_PT - localSourceBottom * sourceToPdfScale,
        clippedSourceRight * sourceToPdfScale,
        RESUME_A4_HEIGHT_PT - localSourceTop * sourceToPdfScale,
      ],
      link.href
    )
  })
}
