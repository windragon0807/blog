'use client'

import { useCallback, useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { RetryableImage, type NotionMediaRefreshConfig } from '@/components/RetryableImage'
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogRawContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  unoptimized?: boolean
  notionRefresh?: NotionMediaRefreshConfig
}

const MIN_IMAGE_SCALE = 1
const MAX_IMAGE_SCALE = 2.5
const IMAGE_SCALE_STEP = 0.25

export function LightboxImage({
  src,
  alt,
  width,
  height,
  className = '',
  unoptimized = false,
  notionRefresh,
}: Props) {
  const [open, setOpen] = useState(false)
  const [imageScale, setImageScale] = useState(MIN_IMAGE_SCALE)
  const [resolvedImage, setResolvedImage] = useState({
    originalSrc: src,
    resolvedSrc: src,
  })
  const [aspectRatio, setAspectRatio] = useState<number>(() => {
    if (width > 0 && height > 0) {
      return width / height
    }
    return 16 / 9
  })
  const resolvedSrc =
    resolvedImage.originalSrc === src ? resolvedImage.resolvedSrc : src

  const handleSourceResolved = (nextSrc: string) => {
    setResolvedImage((previousImage) => {
      if (
        previousImage.originalSrc === src &&
        previousImage.resolvedSrc === nextSrc
      ) {
        return previousImage
      }

      return {
        originalSrc: src,
        resolvedSrc: nextSrc,
      }
    })
  }

  const closeLightbox = useCallback(() => {
    setOpen(false)
    setImageScale(MIN_IMAGE_SCALE)
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(true)
      return
    }

    closeLightbox()
  }

  const zoomOut = () => {
    setImageScale((previousScale) =>
      Math.max(MIN_IMAGE_SCALE, previousScale - IMAGE_SCALE_STEP)
    )
  }

  const zoomIn = () => {
    setImageScale((previousScale) =>
      Math.min(MAX_IMAGE_SCALE, previousScale + IMAGE_SCALE_STEP)
    )
  }

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [closeLightbox, open])

  const openLightbox = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setImageScale(MIN_IMAGE_SCALE)
    setOpen(true)
  }
  const imageScaleStyle = {
    '--lightbox-scale': imageScale,
  } as CSSProperties
  const canZoomOut = imageScale > MIN_IMAGE_SCALE
  const canZoomIn = imageScale < MAX_IMAGE_SCALE

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <button
        type="button"
        data-lightbox-image-trigger=""
        onClick={openLightbox}
        onDragStart={(event) => event.preventDefault()}
        className="group relative block w-full cursor-zoom-in"
        style={{ aspectRatio }}
        aria-label="이미지 확대"
      >
        <RetryableImage
          key={src}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          unoptimized={unoptimized}
          notionRefresh={notionRefresh}
          onImageResolved={({ naturalWidth, naturalHeight }) => {
            setAspectRatio(naturalWidth / naturalHeight)
          }}
          onSourceResolved={handleSourceResolved}
          skeletonClassName="absolute inset-0 animate-pulse bg-zinc-200/80 dark:bg-zinc-700/65"
        />
      </button>

      <DialogPortal>
        <DialogOverlay className="lightbox-overlay z-[90] bg-black/86" />
        <DialogRawContent
          className="fixed inset-0 z-[91] flex items-center justify-center p-4 outline-none"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox()
            }
          }}
        >
          <DialogTitle className="sr-only">이미지 확대 보기</DialogTitle>
          <div className="lightbox-controls absolute left-1/2 top-4 z-[92] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-black/42 p-1 text-white shadow-2xl backdrop-blur-md">
            <button
              type="button"
              data-lightbox-zoom-out=""
              onClick={zoomOut}
              disabled={!canZoomOut}
              className="inline-grid h-9 w-9 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/12 hover:text-white disabled:pointer-events-none disabled:text-white/35"
              aria-label="이미지 축소하기"
            >
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-12 select-none text-center text-xs font-medium tabular-nums text-white/78">
              {Math.round(imageScale * 100)}%
            </span>
            <button
              type="button"
              data-lightbox-zoom-in=""
              onClick={zoomIn}
              disabled={!canZoomIn}
              className="inline-grid h-9 w-9 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/12 hover:text-white disabled:pointer-events-none disabled:text-white/35"
              aria-label="이미지 확대하기"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/40 p-2 text-white transition-colors hover:bg-black/70"
            aria-label="이미지 닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <RetryableImage
            key={resolvedSrc}
            src={resolvedSrc}
            alt={alt}
            width={width}
            height={height}
            className="lightbox-panel max-h-[88vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            style={imageScaleStyle}
            unoptimized={unoptimized}
            notionRefresh={notionRefresh}
            onImageResolved={({ naturalWidth, naturalHeight }) => {
              setAspectRatio(naturalWidth / naturalHeight)
            }}
            onSourceResolved={handleSourceResolved}
            skeletonClassName="fixed left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-zinc-200/20 backdrop-blur-sm dark:bg-white/10"
            data-state={open ? 'open' : 'closed'}
            draggable={false}
            onClick={(event) => event.stopPropagation()}
          />
        </DialogRawContent>
      </DialogPortal>
    </Dialog>
  )
}
