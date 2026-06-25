'use client'

import { Download, Loader2 } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { ActionButton } from '@/components/common/ActionControl'
import {
  RESUME_DOCUMENT_HEIGHT,
  RESUME_DOCUMENT_WIDTH,
  RESUME_PDF_FILE_NAME,
} from '../constants'
import { buildResumePdfFromElement } from '../lib/build-resume-pdf'
import { ResumeDocument } from './ResumeDocument'

const RESUME_PREVIEW_MAX_SCALE = 2.675
const RESUME_PREVIEW_MAX_WIDTH = '70vw'

function downloadBytes(bytes: Uint8Array, fileName: string) {
  const buffer = new Uint8Array(bytes.byteLength)
  buffer.set(bytes)

  const blob = new Blob([buffer.buffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function ResumeShell() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const documentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  const [documentHeight, setDocumentHeight] = useState(RESUME_DOCUMENT_HEIGHT)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useLayoutEffect(() => {
    const updateScale = () => {
      const viewport = viewportRef.current

      if (!viewport) return

      const availableWidth = viewport.clientWidth
      const nextScale = Math.min(
        RESUME_PREVIEW_MAX_SCALE,
        availableWidth / RESUME_DOCUMENT_WIDTH
      )

      setScale((currentScale) =>
        currentScale === nextScale ? currentScale : nextScale
      )
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    const viewport = viewportRef.current

    if (viewport) {
      resizeObserver.observe(viewport)
    }

    window.addEventListener('resize', updateScale)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  useLayoutEffect(() => {
    if (scale === null) return

    const target = documentRef.current

    if (!target) return

    const updateHeight = () => {
      setDocumentHeight(Math.max(RESUME_DOCUMENT_HEIGHT, target.scrollHeight))
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(target)

    return () => resizeObserver.disconnect()
  }, [scale])

  const handleDownload = useCallback(async () => {
    const target = documentRef.current

    if (!target || isGenerating) return

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const pdfBytes = await buildResumePdfFromElement(target)
      downloadBytes(pdfBytes, RESUME_PDF_FILE_NAME)
    } catch (error) {
      console.error(error)
      setErrorMessage('PDF 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating])

  return (
    <>
      <div className="fixed right-4 top-[72px] z-40 flex max-w-[calc(100vw-32px)] flex-col items-end gap-2 md:right-[60px]">
        {errorMessage && (
          <p className="max-w-80 rounded-lg border border-rose-200 bg-white/95 px-3 py-2 text-right text-xs font-medium text-rose-600 shadow-sm backdrop-blur dark:border-rose-900/70 dark:bg-[#11141b]/95 dark:text-rose-300">
            {errorMessage}
          </p>
        )}
        <ActionButton
          type="button"
          onClick={handleDownload}
          disabled={scale === null || isGenerating}
          className="h-9 shrink-0 rounded-lg px-3 text-xs"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          PDF 다운로드
        </ActionButton>
      </div>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white px-3 pt-5 pb-3 dark:bg-[#11141b] sm:px-6 sm:pt-[61px]">
        <div
          ref={viewportRef}
          className="mx-auto w-full overflow-visible"
          style={{ maxWidth: RESUME_PREVIEW_MAX_WIDTH }}
        >
          {scale === null ? (
            <div
              className="mx-auto box-content overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.32)]"
              data-resume-skeleton
              style={{
                aspectRatio: `${RESUME_DOCUMENT_WIDTH} / ${RESUME_DOCUMENT_HEIGHT}`,
                width: '100%',
              }}
            >
              <div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,#f4f4f5_0%,#eceef2_48%,#f4f4f5_100%)]" />
            </div>
          ) : (
            <div
              className="mx-auto box-content overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_70px_-46px_rgba(15,23,42,0.52)]"
              style={{
                width: RESUME_DOCUMENT_WIDTH * scale,
                height: documentHeight * scale,
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: RESUME_DOCUMENT_WIDTH,
                }}
              >
                <ResumeDocument ref={documentRef} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
