'use client'

import { XIcon } from 'lucide-react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { CircleCheckIcon, CopyIcon, DownloadIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import type { EmoticonItem } from '../types'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export type ActionKey = 'download-svg' | 'download-png' | 'copy-svg' | 'copy-png'

export type ActionFeedback = {
  key: ActionKey
  status: 'success' | 'error'
} | null

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    return !element.hasAttribute('disabled') && !element.getAttribute('hidden')
  })
}

function getActionButtonState({
  actionKey,
  feedback,
  visibleLabel,
  defaultAriaLabel,
  successAriaLabel,
  errorAriaLabel,
  defaultIcon,
}: {
  actionKey: ActionKey
  feedback: ActionFeedback
  visibleLabel: string
  defaultAriaLabel: string
  successAriaLabel: string
  errorAriaLabel: string
  defaultIcon: ReactNode
}) {
  if (feedback?.key !== actionKey) {
    return {
      ariaLabel: defaultAriaLabel,
      icon: defaultIcon,
      label: visibleLabel,
      tone: 'default' as const,
    }
  }

  if (feedback.status === 'success') {
    return {
      ariaLabel: successAriaLabel,
      icon: <CircleCheckIcon className="h-4 w-4" />,
      label: visibleLabel,
      tone: 'success' as const,
    }
  }

  return {
    ariaLabel: errorAriaLabel,
    icon: <XIcon className="h-4 w-4" />,
    label: visibleLabel,
    tone: 'error' as const,
  }
}

function ActionButton({
  ariaLabel,
  icon,
  label,
  tone,
  onClick,
}: {
  ariaLabel: string
  icon: ReactNode
  label: string
  tone: 'default' | 'success' | 'error'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      data-emoticon-action-button=""
      data-tone={tone}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'emoticon-action-button inline-flex h-11 min-w-0 translate-y-0 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-bold transition-[background-color,border-color,box-shadow,transform,color,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 sm:gap-2 sm:px-3 sm:text-sm',
        tone === 'default' &&
          'border border-white/65 bg-white/58 text-zinc-700 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.32),0_4px_14px_-10px_rgba(15,23,42,0.20),inset_0_1px_0_rgba(255,255,255,0.94)] backdrop-blur-xl focus-visible:ring-zinc-400/35 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:shadow-[0_18px_38px_-20px_rgba(2,6,23,0.78),0_4px_16px_-10px_rgba(2,6,23,0.60),inset_0_1px_0_rgba(255,255,255,0.12)]',
        tone === 'success' &&
          'bg-emerald-500 text-white shadow-[0_12px_30px_-16px_rgba(16,185,129,0.9)] focus-visible:ring-emerald-400/45 dark:bg-emerald-500 dark:text-white',
        tone === 'error' &&
          'bg-rose-500 text-white shadow-[0_12px_30px_-16px_rgba(244,63,94,0.85)] focus-visible:ring-rose-400/45 dark:bg-rose-500 dark:text-white'
      )}
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

export function BottomActionSheet({
  item,
  feedback,
  isClosing,
  centerX,
  onClose,
  onDownloadSvg,
  onDownloadPng,
  onCopySvg,
  onCopyImage,
}: {
  item: EmoticonItem
  feedback: ActionFeedback
  isClosing: boolean
  centerX: number | null
  onClose: () => void
  onDownloadSvg: () => void
  onDownloadPng: () => void
  onCopySvg: () => void
  onCopyImage: () => void
}) {
  const titleId = useId()
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const svgDownloadState = getActionButtonState({
    actionKey: 'download-svg',
    feedback,
    visibleLabel: 'SVG',
    defaultAriaLabel: 'Download SVG',
    successAriaLabel: 'Downloaded SVG',
    errorAriaLabel: 'Download SVG failed',
    defaultIcon: <DownloadIcon className="h-4 w-4" />,
  })
  const pngDownloadState = getActionButtonState({
    actionKey: 'download-png',
    feedback,
    visibleLabel: 'PNG',
    defaultAriaLabel: 'Download PNG',
    successAriaLabel: 'Downloaded PNG',
    errorAriaLabel: 'Download PNG failed',
    defaultIcon: <DownloadIcon className="h-4 w-4" />,
  })
  const svgCopyState = getActionButtonState({
    actionKey: 'copy-svg',
    feedback,
    visibleLabel: 'SVG',
    defaultAriaLabel: 'Copy SVG',
    successAriaLabel: 'Copied SVG',
    errorAriaLabel: 'Copy SVG failed',
    defaultIcon: <CopyIcon className="h-4 w-4" />,
  })
  const pngCopyState = getActionButtonState({
    actionKey: 'copy-png',
    feedback,
    visibleLabel: 'PNG',
    defaultAriaLabel: 'Copy PNG',
    successAriaLabel: 'Copied PNG',
    errorAriaLabel: 'Copy PNG failed',
    defaultIcon: <CopyIcon className="h-4 w-4" />,
  })

  useEffect(() => {
    if (isClosing) {
      return
    }

    const sheet = sheetRef.current

    if (!sheet) {
      return
    }

    const firstFocusable = getFocusableElements(sheet)[0]

    requestAnimationFrame(() => {
      ;(firstFocusable ?? sheet).focus({ preventScroll: true })
    })
  }, [isClosing, item.id])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return
    }

    const sheet = sheetRef.current

    if (!sheet) {
      return
    }

    const focusableElements = getFocusableElements(sheet)

    if (focusableElements.length === 0) {
      event.preventDefault()
      sheet.focus({ preventScroll: true })
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus({ preventScroll: true })
      return
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus({ preventScroll: true })
    }
  }

  return (
    <div
      className="pointer-events-none fixed bottom-[max(16px,env(safe-area-inset-bottom))] z-[70] w-[min(540px,calc(100vw-1.5rem))] -translate-x-1/2"
      style={{ left: centerX === null ? '50%' : `${centerX}px` }}
    >
      <div
        ref={sheetRef}
        data-emoticon-bottom-sheet=""
        data-state={isClosing ? 'closing' : 'open'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'pointer-events-auto relative isolate w-full overflow-hidden rounded-[28px] border border-white/65 bg-white/70 p-3 shadow-[0_28px_90px_-34px_rgba(15,23,42,0.46),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-zinc-950/5 backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-white/90 after:pointer-events-none after:absolute after:-left-20 after:-top-24 after:h-48 after:w-48 after:rounded-full after:bg-sky-200/35 after:blur-3xl dark:border-white/10 dark:bg-zinc-950/72 dark:shadow-[0_30px_92px_-34px_rgba(2,6,23,0.88),inset_0_1px_0_rgba(255,255,255,0.08)] dark:ring-white/10 dark:after:bg-blue-400/12',
          isClosing
            ? 'motion-safe:animate-[emoticon-bottom-sheet-exit_180ms_cubic-bezier(0.4,0,1,1)_both]'
            : 'motion-safe:animate-[emoticon-bottom-sheet-enter_220ms_cubic-bezier(0.22,1,0.36,1)_both]'
        )}
      >
        <button
          type="button"
          aria-label="액션 시트 닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-zinc-400 transition hover:bg-white/70 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 dark:hover:bg-white/10 dark:hover:text-zinc-100"
        >
          <XIcon className="h-4 w-4" />
        </button>

        <div className="grid min-w-0 grid-cols-[92px_minmax(0,1fr)] gap-2.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
          <figure
            data-emoticon-selected-identity=""
            className="flex min-w-0 flex-col items-center justify-center px-1 py-1 sm:px-2 sm:py-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-emoticon-selected-preview=""
              src={item.src}
              alt=""
              className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_16px_24px_rgba(15,23,42,0.12)] dark:drop-shadow-[0_18px_26px_rgba(2,6,23,0.48)] sm:h-20 sm:w-20"
            />
            <figcaption
              id={titleId}
              className="mt-2 w-full truncate text-center text-xs font-semibold leading-5 text-zinc-700 dark:text-zinc-300 sm:text-sm"
            >
              {item.name}
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col justify-end pt-11">
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                ariaLabel={svgDownloadState.ariaLabel}
                icon={svgDownloadState.icon}
                label={svgDownloadState.label}
                tone={svgDownloadState.tone}
                onClick={onDownloadSvg}
              />
              <ActionButton
                ariaLabel={pngDownloadState.ariaLabel}
                icon={pngDownloadState.icon}
                label={pngDownloadState.label}
                tone={pngDownloadState.tone}
                onClick={onDownloadPng}
              />
              <ActionButton
                ariaLabel={svgCopyState.ariaLabel}
                icon={svgCopyState.icon}
                label={svgCopyState.label}
                tone={svgCopyState.tone}
                onClick={onCopySvg}
              />
              <ActionButton
                ariaLabel={pngCopyState.ariaLabel}
                icon={pngCopyState.icon}
                label={pngCopyState.label}
                tone={pngCopyState.tone}
                onClick={onCopyImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
