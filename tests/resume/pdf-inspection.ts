import { execFile } from 'node:child_process'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { inflateSync } from 'node:zlib'
import {
  PDFArray,
  PDFBool,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFString,
} from 'pdf-lib'

const execFileAsync = promisify(execFile)

async function execPdfTool(command: string, args: readonly string[]) {
  try {
    return await execFileAsync(command, [...args])
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      throw new Error(
        `${command} 명령을 찾을 수 없습니다. macOS에서는 \`brew install poppler\` 후 다시 실행하세요.`
      )
    }

    throw error
  }
}

export type PdfInfo = {
  pages: number
  pageSizeText: string
  raw: string
}

export async function readPdfInfo(pdfPath: string): Promise<PdfInfo> {
  const { stdout } = await execPdfTool('pdfinfo', [pdfPath])
  const pagesMatch = stdout.match(/^Pages:\s+(\d+)$/m)
  const pageSizeMatch = stdout.match(/^Page size:\s+(.+)$/m)

  if (!pagesMatch || !pageSizeMatch) {
    throw new Error(`pdfinfo 출력에서 페이지 정보를 찾을 수 없습니다.\n${stdout}`)
  }

  return {
    pages: Number(pagesMatch[1]),
    pageSizeText: pageSizeMatch[1],
    raw: stdout,
  }
}

export async function extractPdfText(pdfPath: string) {
  const { stdout } = await execPdfTool('pdftotext', ['-layout', pdfPath, '-'])

  return stdout
    .replace(/\u000c/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

function lookupUri(annotation: PDFDict) {
  const action = annotation.lookupMaybe(PDFName.of('A'), PDFDict)
  const uri = action?.lookupMaybe(PDFName.of('URI'), PDFString)

  return uri?.decodeText()
}

function lookupNewWindow(annotation: PDFDict) {
  const action = annotation.lookupMaybe(PDFName.of('A'), PDFDict)
  const newWindow = action?.lookupMaybe(PDFName.of('NewWindow'), PDFBool)

  return newWindow?.asBoolean() ?? false
}

function lookupRect(annotation: PDFDict) {
  const rect = annotation.lookupMaybe(PDFName.of('Rect'), PDFArray)

  if (!rect || rect.size() !== 4) return null

  return rect.asArray().map((value) => {
    if (!(value instanceof PDFNumber)) {
      throw new Error('PDF link annotation Rect 값이 숫자가 아닙니다.')
    }

    return value.asNumber()
  }) as [number, number, number, number]
}

export type PdfLinkAnnotation = {
  newWindow: boolean
  rect: [number, number, number, number] | null
  uri: string
}

export async function readPdfLinkAnnotationsByPage(pdfPath: string) {
  const bytes = await readFile(pdfPath)
  const pdf = await PDFDocument.load(bytes)

  return pdf.getPages().map((page) => {
    const annotations = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray)

    if (!annotations) return []

    return annotations
      .asArray()
      .map((annotationRef) => pdf.context.lookup(annotationRef))
      .filter((annotation): annotation is PDFDict => annotation instanceof PDFDict)
      .map((annotation) => ({
        newWindow: lookupNewWindow(annotation),
        rect: lookupRect(annotation),
        uri: lookupUri(annotation),
      }))
      .filter(
        (annotation): annotation is PdfLinkAnnotation =>
          typeof annotation.uri === 'string'
      )
  })
}

export async function readPdfLinkUrisByPage(pdfPath: string) {
  const annotationsByPage = await readPdfLinkAnnotationsByPage(pdfPath)

  return annotationsByPage.map((annotations) =>
    annotations.map((annotation) => annotation.uri)
  )
}

export async function renderPdfToPngs({
  outputPrefix,
  pdfPath,
}: {
  outputPrefix: string
  pdfPath: string
}) {
  await mkdir(path.dirname(outputPrefix), { recursive: true })
  await execPdfTool('pdftoppm', ['-r', '144', '-png', pdfPath, outputPrefix])

  const outputDirectory = path.dirname(outputPrefix)
  const outputBaseName = path.basename(outputPrefix)
  const files = await readdir(outputDirectory)

  return files
    .filter((file) => file.startsWith(outputBaseName) && file.endsWith('.png'))
    .sort()
    .map((file) => path.join(outputDirectory, file))
}

export async function readPngSize(pngPath: string) {
  const bytes = await readFile(pngPath)
  const imageData = parsePngImageData(bytes, pngPath)

  return {
    height: imageData.height,
    width: imageData.width,
  }
}

export async function readPngHasNonWhitePixels(pngPath: string) {
  const bytes = await readFile(pngPath)
  const imageData = parsePngImageData(bytes, pngPath)
  let checkedPixels = 0

  const stride = imageData.channels * 180

  for (let index = 0; index < imageData.pixels.length; index += stride) {
    checkedPixels += 1

    const red = imageData.pixels[index]
    const green = imageData.pixels[index + 1]
    const blue = imageData.pixels[index + 2]
    const alpha =
      imageData.channels === 4 ? imageData.pixels[index + 3] : 255

    if (alpha > 0 && (red < 245 || green < 245 || blue < 245)) {
      return true
    }
  }

  if (checkedPixels === 0) {
    throw new Error(`${pngPath} 파일에서 확인할 픽셀이 없습니다.`)
  }

  return false
}

function parsePngImageData(bytes: Buffer, pngPath: string) {
  const pngSignature = '89504e470d0a1a0a'

  if (bytes.subarray(0, 8).toString('hex') !== pngSignature) {
    throw new Error(`${pngPath} 파일이 PNG 형식이 아닙니다.`)
  }

  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  const bitDepth = bytes[24]
  const colorType = bytes[25]
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0

  if (bitDepth !== 8 || channels === 0) {
    throw new Error(
      `${pngPath} 파일의 PNG 형식(bitDepth=${bitDepth}, colorType=${colorType})을 처리할 수 없습니다.`
    )
  }

  let offset = 8
  const compressedChunks: Buffer[] = []

  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset)
    const type = bytes.subarray(offset + 4, offset + 8).toString('ascii')
    const dataStart = offset + 8
    const dataEnd = dataStart + length

    if (type === 'IDAT') {
      compressedChunks.push(bytes.subarray(dataStart, dataEnd))
    }

    if (type === 'IEND') break

    offset = dataEnd + 4
  }

  const inflated = inflateSync(Buffer.concat(compressedChunks))
  const bytesPerPixel = channels
  const rowSize = width * bytesPerPixel
  const pixels = Buffer.alloc(width * height * bytesPerPixel)

  for (let row = 0; row < height; row += 1) {
    const sourceOffset = row * (rowSize + 1)
    const filterType = inflated[sourceOffset]
    const sourceRow = inflated.subarray(sourceOffset + 1, sourceOffset + 1 + rowSize)
    const targetOffset = row * rowSize
    const previousOffset = targetOffset - rowSize

    if (filterType > 4) {
      throw new Error(`${pngPath} 파일의 PNG filter type(${filterType})을 처리할 수 없습니다.`)
    }

    for (let index = 0; index < rowSize; index += 1) {
      const left = index >= bytesPerPixel ? pixels[targetOffset + index - bytesPerPixel] : 0
      const up = row > 0 ? pixels[previousOffset + index] : 0
      const upLeft =
        row > 0 && index >= bytesPerPixel
          ? pixels[previousOffset + index - bytesPerPixel]
          : 0
      let value = sourceRow[index]

      if (filterType === 1) {
        value = (value + left) & 0xff
      } else if (filterType === 2) {
        value = (value + up) & 0xff
      } else if (filterType === 3) {
        value = (value + Math.floor((left + up) / 2)) & 0xff
      } else if (filterType === 4) {
        value = (value + paethPredictor(left, up, upLeft)) & 0xff
      }

      pixels[targetOffset + index] = value
    }
  }

  return {
    height,
    channels,
    pixels,
    width,
  }
}

function paethPredictor(left: number, up: number, upLeft: number) {
  const estimate = left + up - upLeft
  const leftDistance = Math.abs(estimate - left)
  const upDistance = Math.abs(estimate - up)
  const upLeftDistance = Math.abs(estimate - upLeft)

  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left
  if (upDistance <= upLeftDistance) return up

  return upLeft
}
