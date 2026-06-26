import { PDFDocument } from 'pdf-lib'
import {
  RESUME_A4_HEIGHT_PT,
  RESUME_A4_WIDTH_PT,
  RESUME_PDF_PAGE_COUNT,
} from '../constants'
import {
  addLinkAnnotationsToPage,
  type ResumePdfLinkAnnotation,
} from './resume-pdf-annotations'

type ResumePdfWorkerRequest = {
  imageBytes: ArrayBuffer
  imageType: string
  linkAnnotations: ResumePdfLinkAnnotation[]
  sourcePageHeight: number
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

type ResumePdfWorkerScope = {
  onmessage: ((event: MessageEvent<ResumePdfWorkerRequest>) => void) | null
  postMessage: (message: ResumePdfWorkerResponse, transfer?: Transferable[]) => void
}

const workerScope = self as unknown as ResumePdfWorkerScope

function toTransferableArrayBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)

  return buffer
}

async function buildPdfInWorker({
  imageBytes,
  imageType,
  linkAnnotations,
  sourcePageHeight,
}: ResumePdfWorkerRequest) {
  const imageBlob = new Blob([imageBytes], { type: imageType || 'image/png' })
  const sourceImage = await createImageBitmap(imageBlob)
  const pdf = await PDFDocument.create()
  const sliceHeight = Math.floor(
    (sourceImage.width * RESUME_A4_HEIGHT_PT) / RESUME_A4_WIDTH_PT
  )

  try {
    for (let pageIndex = 0; pageIndex < RESUME_PDF_PAGE_COUNT; pageIndex += 1) {
      const offsetY = pageIndex * sliceHeight
      const canvas = new OffscreenCanvas(sourceImage.width, sliceHeight)
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Worker canvas context를 만들 수 없습니다.')
      }

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(
        sourceImage,
        0,
        offsetY,
        sourceImage.width,
        sliceHeight,
        0,
        0,
        sourceImage.width,
        sliceHeight
      )

      const page = pdf.addPage([RESUME_A4_WIDTH_PT, RESUME_A4_HEIGHT_PT])
      const jpgBlob = await canvas.convertToBlob({
        quality: 0.96,
        type: 'image/jpeg',
      })
      const jpgBytes = await jpgBlob.arrayBuffer()
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
    }
  } finally {
    sourceImage.close()
  }

  return toTransferableArrayBuffer(await pdf.save())
}

workerScope.onmessage = (event: MessageEvent<ResumePdfWorkerRequest>) => {
  buildPdfInWorker(event.data)
    .then((pdfBytes) => {
      const response: ResumePdfWorkerResponse = {
        pdfBytes,
        type: 'success',
      }

      workerScope.postMessage(response, [pdfBytes])
    })
    .catch((error: unknown) => {
      const response: ResumePdfWorkerResponse = {
        message: error instanceof Error ? error.message : 'PDF worker 처리에 실패했습니다.',
        type: 'error',
      }

      workerScope.postMessage(response)
    })
}
