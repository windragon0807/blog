'use client'

import { BookOpen, FileDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { IconButton, iconButtonClassName } from '@/components/common/IconButton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  RESUME_DOCUMENT_HEIGHT,
  RESUME_DOCUMENT_WIDTH,
  RESUME_PDF_FILE_NAME,
} from '../constants'
import { buildResumePdfFromElement } from '../lib/build-resume-pdf'
import { ResumeDocument } from './ResumeDocument'

const RESUME_PREVIEW_MAX_WIDTH = 1000
const RESUME_PREVIEW_MAX_SCALE = RESUME_PREVIEW_MAX_WIDTH / RESUME_DOCUMENT_WIDTH

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

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(resolve, 0)
    })
  })
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

    let frameId: number | null = null
    let isDisposed = false

    const updateHeight = () => {
      frameId = null

      if (isDisposed) return

      setDocumentHeight((currentHeight) => {
        const nextHeight = Math.ceil(
          Math.max(
            RESUME_DOCUMENT_HEIGHT,
            target.scrollHeight,
            target.offsetHeight
          )
        )

        return currentHeight === nextHeight ? currentHeight : nextHeight
      })
    }

    const scheduleHeightUpdate = () => {
      if (isDisposed) return

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }

      frameId = window.requestAnimationFrame(updateHeight)
    }

    scheduleHeightUpdate()

    document.fonts?.ready.then(scheduleHeightUpdate).catch(() => undefined)

    const resizeObserver = new ResizeObserver(scheduleHeightUpdate)
    const measuredElements = [
      target,
      ...Array.from(
        target.querySelectorAll<HTMLElement>(
          '[data-resume-section-stack], section, article'
        )
      ),
    ]

    measuredElements.forEach((element) => resizeObserver.observe(element))
    window.addEventListener('load', scheduleHeightUpdate)

    return () => {
      isDisposed = true
      resizeObserver.disconnect()
      window.removeEventListener('load', scheduleHeightUpdate)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [scale])

  const handleDownload = useCallback(async () => {
    const target = documentRef.current

    if (!target || isGenerating) return

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      await waitForNextPaint()
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
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white px-0 py-0 dark:bg-[#11141b] sm:px-5 sm:py-5 lg:py-8">
        <div
          ref={viewportRef}
          className="relative mx-auto w-full overflow-visible"
          style={{ maxWidth: RESUME_PREVIEW_MAX_WIDTH }}
        >
          {errorMessage && (
            <p className="absolute right-0 top-0 z-20 max-w-80 -translate-y-[calc(100%+8px)] rounded-lg border border-rose-200 bg-white/95 px-3 py-2 text-right text-xs font-medium text-rose-600 shadow-sm backdrop-blur dark:border-rose-900/70 dark:bg-[#11141b]/95 dark:text-rose-300">
              {errorMessage}
            </p>
          )}
          {scale === null ? (
            <div
              className="mx-auto box-content overflow-hidden bg-zinc-100 shadow-none sm:rounded-3xl sm:border sm:border-zinc-200 sm:shadow-[0_24px_70px_-46px_rgba(15,23,42,0.32)]"
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
              className="relative mx-auto box-content overflow-hidden bg-white shadow-none sm:rounded-3xl sm:border sm:border-zinc-200 sm:shadow-[0_24px_70px_-46px_rgba(15,23,42,0.52)]"
              style={{
                width: RESUME_DOCUMENT_WIDTH * scale,
                height: documentHeight * scale,
              }}
            >
              <div className="absolute right-3 top-3 z-10 flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/resume/readable"
                        aria-label="읽기용 이력서 보기"
                        className={`${iconButtonClassName} inline-grid h-9 w-9 place-items-center rounded-xl border border-zinc-200/90 bg-white/80 text-zinc-500 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.55)] backdrop-blur-md hover:bg-white/95 hover:text-zinc-800 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-100`}
                      >
                        <span className="sr-only">읽기용 이력서 보기</span>
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>읽기용 이력서 보기</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <IconButton
                  type="button"
                  label={isGenerating ? 'PDF 생성 중' : 'PDF 다운로드'}
                  tooltip={isGenerating ? 'PDF 생성 중' : 'PDF 다운로드'}
                  onClick={handleDownload}
                  disabled={scale === null || isGenerating}
                  aria-busy={isGenerating}
                  className="h-9 w-9 rounded-xl bg-white/80 text-zinc-500 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.55)] backdrop-blur-md hover:bg-white/95 hover:text-zinc-800 disabled:text-zinc-400 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-100 dark:disabled:text-zinc-500"
                >
                  {isGenerating ? (
                    <Loader2
                      className="h-4 w-4 animate-spin text-zinc-400 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <FileDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </IconButton>
              </div>
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
      </div>
    </>
  )
}
