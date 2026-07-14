import type { EmoticonItem } from '../types'

const PNG_EXPORT_SIZE = 512

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export async function fetchSvgText(item: EmoticonItem) {
  const response = await fetch(item.src)

  if (!response.ok) {
    throw new Error('SVG 파일을 불러오지 못했습니다.')
  }

  return response.text()
}

export async function fetchSvgBlob(item: EmoticonItem) {
  const response = await fetch(item.src)

  if (!response.ok) {
    throw new Error('SVG 파일을 불러오지 못했습니다.')
  }

  return response.blob()
}

export async function fetchPngBlob(item: EmoticonItem) {
  if (!item.pngSrc) {
    return svgToPngBlob(item)
  }

  const response = await fetch(item.pngSrc)

  if (!response.ok) {
    throw new Error('PNG 파일을 불러오지 못했습니다.')
  }

  return response.blob()
}

async function svgToPngBlob(item: EmoticonItem, size = PNG_EXPORT_SIZE) {
  const svg = await fetchSvgText(item)

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const objectUrl = URL.createObjectURL(svgBlob)

  try {
    const image = new window.Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('PNG 변환을 지원하지 않는 브라우저입니다.')
    }

    canvas.width = size
    canvas.height = size
    context.clearRect(0, 0, size, size)
    context.drawImage(image, 0, 0, size, size)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })

    if (!blob) {
      throw new Error('PNG 파일을 만들지 못했습니다.')
    }

    return blob
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function copyPngToClipboard(blob: Blob) {
  const clipboard = navigator.clipboard
  const ClipboardItemConstructor = window.ClipboardItem

  if (!clipboard || !ClipboardItemConstructor) {
    throw new Error('이미지 복사를 지원하지 않는 브라우저입니다.')
  }

  await clipboard.write([
    new ClipboardItemConstructor({
      [blob.type]: blob,
    }),
  ])
}
