'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { subscribeToTouchInputDeviceChange } from '@/lib/touch-input'
import { cn } from '@/lib/utils'
import { EMOTICON_CONTENT_CLASS_NAME } from '../emoticon-layout-contract'
import type { EmoticonGridSection } from '../model/prepare-collections'
import {
  PREFETCH_ROW_LOOKAHEAD,
  PREFETCH_ROW_LOOKBEHIND,
  BACKGROUND_PREFETCH_CHUNK_SIZE,
  markEmoticonImageSettled,
  hasSettledEmoticonImage,
  scheduleEmoticonImagePrefetch,
  scheduleBackgroundEmoticonImageWarmup,
} from '../prefetch/emoticon-image-prefetch'
import type { EmoticonCollectionId, EmoticonItem } from '../types'

const GRID_GAP = 10
const GRID_EDGE_BLEED = 8
const GRID_ROW_HEIGHT = 62
const MOBILE_GRID_SECTION_HEADING_HEIGHT = 42
const DESKTOP_GRID_SECTION_HEADING_HEIGHT = 74
const MOBILE_CARD_MIN_WIDTH = 54
const DESKTOP_CARD_MIN_WIDTH = 56
const GRID_OVERSCAN = 4
const EAGER_ROW_BUFFER = 1

type EmoticonGridRow =
  | {
      type: 'heading'
      key: string
      label: string
    }
  | {
      type: 'icons'
      key: string
      items: EmoticonItem[]
    }

type FloatingTooltipState = {
  itemId: string
  label: string
  x: number
  y: number
} | null

function getColumnCount(width: number) {
  const innerWidth = Math.max(0, width - GRID_EDGE_BLEED * 2)
  const minCardWidth =
    innerWidth >= 640 ? DESKTOP_CARD_MIN_WIDTH : MOBILE_CARD_MIN_WIDTH

  return Math.max(
    1,
    Math.floor((innerWidth + GRID_GAP) / (minCardWidth + GRID_GAP))
  )
}

const EmoticonCard = memo(function EmoticonCard({
  item,
  isSelected,
  collectionId,
  imageLoading,
  isTouchInput,
  onSelect,
  onTooltipHide,
  onTooltipShow,
}: {
  item: EmoticonItem
  isSelected: boolean
  collectionId: EmoticonCollectionId
  imageLoading: 'eager' | 'lazy'
  isTouchInput: boolean
  onSelect: (item: EmoticonItem, trigger: HTMLButtonElement) => void
  onTooltipHide: (itemId: string) => void
  onTooltipShow: (item: EmoticonItem, trigger: HTMLButtonElement) => void
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(() =>
    hasSettledEmoticonImage(item.src)
  )
  const handleImageSettled = () => {
    markEmoticonImageSettled(item.src)
    setIsImageLoaded(true)
  }

  return (
    <button
      type="button"
      data-emoticon-card=""
      data-collection={collectionId}
      data-touch-input={isTouchInput ? 'true' : undefined}
      aria-label={`${item.name} 선택`}
      onBlur={() => {
        if (!isTouchInput) onTooltipHide(item.id)
      }}
      onClick={(event) => onSelect(item, event.currentTarget)}
      onFocus={(event) => {
        if (!isTouchInput) onTooltipShow(item, event.currentTarget)
      }}
      onMouseEnter={(event) => {
        if (!isTouchInput) onTooltipShow(item, event.currentTarget)
      }}
      onMouseLeave={() => {
        if (!isTouchInput) onTooltipHide(item.id)
      }}
      className={cn(
        'group grid h-14 place-items-center rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35',
        isSelected
          ? 'bg-zinc-100 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10'
          : 'bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/70'
      )}
    >
      <span className="relative grid h-12 w-12 place-items-center">
        {!isImageLoaded ? (
          <span
            data-emoticon-card-skeleton=""
            className="absolute inset-1.5 animate-pulse rounded-xl bg-zinc-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:bg-zinc-800/80"
          />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt=""
          decoding="async"
          height={36}
          loading={imageLoading}
          onError={handleImageSettled}
          onLoad={handleImageSettled}
          width={36}
          className={cn(
            'relative h-9 w-9 object-contain transition duration-200 group-hover:scale-110',
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      </span>
    </button>
  )
})

EmoticonCard.displayName = 'EmoticonCard'

export function VirtualizedEmoticonGrid({
  collectionId,
  sections,
  showSectionHeadings,
  selectedItemId,
  onSelect,
}: {
  collectionId: EmoticonCollectionId
  sections: EmoticonGridSection[]
  showSectionHeadings: boolean
  selectedItemId: string | null
  onSelect: (item: EmoticonItem, trigger: HTMLButtonElement) => void
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [columnCount, setColumnCount] = useState(1)
  const [isCompactGrid, setIsCompactGrid] = useState(false)
  const [isTouchInput, setIsTouchInput] = useState(false)
  const [tooltip, setTooltip] = useState<FloatingTooltipState>(null)
  const rows = useMemo<EmoticonGridRow[]>(() => {
    const nextRows: EmoticonGridRow[] = []

    for (const section of sections) {
      if (showSectionHeadings) {
        nextRows.push({
          type: 'heading',
          key: `${section.id}-heading`,
          label: section.label,
        })
      }

      for (let index = 0; index < section.items.length; index += columnCount) {
        nextRows.push({
          type: 'icons',
          key: `${section.id}-${index}`,
          items: section.items.slice(index, index + columnCount),
        })
      }
    }

    return nextRows
  }, [columnCount, sections, showSectionHeadings])

  useLayoutEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    const syncLayout = () => {
      const rect = contentElement.getBoundingClientRect()

      setColumnCount(getColumnCount(rect.width))
      setIsCompactGrid(rect.width < 640)
    }

    syncLayout()
    const observer = new ResizeObserver(syncLayout)
    observer.observe(contentElement)
    window.addEventListener('resize', syncLayout)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncLayout)
    }
  }, [])

  useEffect(() => {
    return subscribeToTouchInputDeviceChange((nextIsTouchInput) => {
      setIsTouchInput(nextIsTouchInput)

      if (nextIsTouchInput) {
        setTooltip(null)
      }
    })
  }, [])

  const sectionHeadingHeight = isCompactGrid
    ? MOBILE_GRID_SECTION_HEADING_HEIGHT
    : DESKTOP_GRID_SECTION_HEADING_HEIGHT

  // TanStack Virtual keeps mutable methods on the virtualizer instance.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      rows[index]?.type === 'heading'
        ? sectionHeadingHeight
        : GRID_ROW_HEIGHT,
    overscan: GRID_OVERSCAN,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const firstVirtualRowIndex = virtualRows[0]?.index ?? 0
  const lastVirtualRowIndex =
    virtualRows[virtualRows.length - 1]?.index ?? firstVirtualRowIndex
  const scrollOffset = rowVirtualizer.scrollOffset ?? 0
  const viewportHeight = scrollRef.current?.clientHeight ?? 0

  useEffect(() => {
    rowVirtualizer.measure()
  }, [
    collectionId,
    columnCount,
    rowVirtualizer,
    rows.length,
    sectionHeadingHeight,
  ])

  const handleTooltipShow = useCallback(
    (item: EmoticonItem, trigger: HTMLButtonElement) => {
      if (isTouchInput) {
        setTooltip(null)
        return
      }

      const rect = trigger.getBoundingClientRect()

      setTooltip({
        itemId: item.id,
        label: item.name,
        x: rect.left + rect.width / 2,
        y: Math.max(12, rect.top - 10),
      })
    },
    [isTouchInput]
  )

  const handleTooltipHide = useCallback((itemId: string) => {
    setTooltip((currentTooltip) => {
      if (currentTooltip?.itemId !== itemId) {
        return currentTooltip
      }

      return null
    })
  }, [])

  useEffect(() => {
    if (rows.length === 0 || lastVirtualRowIndex < 0) {
      return
    }

    const startRow = Math.max(0, firstVirtualRowIndex - PREFETCH_ROW_LOOKBEHIND)
    const endRow = Math.min(
      rows.length,
      lastVirtualRowIndex + PREFETCH_ROW_LOOKAHEAD
    )
    const prefetchSrcs = rows
      .slice(startRow, endRow + 1)
      .flatMap((row) => (row.type === 'icons' ? row.items : []))
      .map((item) => item.src)

    return scheduleEmoticonImagePrefetch(prefetchSrcs)
  }, [collectionId, firstVirtualRowIndex, lastVirtualRowIndex, rows])

  useEffect(() => {
    if (rows.length === 0 || lastVirtualRowIndex < 0) {
      return
    }

    const warmupSrcs = rows
      .slice(lastVirtualRowIndex + 1)
      .flatMap((row) => (row.type === 'icons' ? row.items : []))
      .map((item) => item.src)

    return scheduleBackgroundEmoticonImageWarmup(warmupSrcs)
  }, [collectionId, lastVirtualRowIndex, rows])

  return (
    <div
      ref={scrollRef}
      data-emoticon-grid-scroll=""
      data-emoticon-grid-overscan={GRID_OVERSCAN}
      data-lenis-prevent=""
      data-emoticon-prefetch-lookahead={PREFETCH_ROW_LOOKAHEAD}
      data-emoticon-prefetch-lookbehind={PREFETCH_ROW_LOOKBEHIND}
      data-emoticon-background-prefetch="continuous"
      data-emoticon-background-prefetch-chunk={BACKGROUND_PREFETCH_CHUNK_SIZE}
      data-emoticon-prefetch-mode="while-scrolling"
      className="h-full w-full overflow-y-auto overscroll-contain"
      style={{
        contain: 'layout paint style',
        scrollbarGutter: 'stable',
      }}
    >
      <div
        ref={contentRef}
        data-emoticon-grid-content=""
        className={cn('relative', EMOTICON_CONTENT_CLASS_NAME)}
        style={{
          contain: 'layout paint style',
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {virtualRows.map((virtualRow) => {
          const row = rows[virtualRow.index]

          if (!row) {
            return null
          }

          const transform = `translateY(${virtualRow.start}px)`

          if (row.type === 'heading') {
            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 flex items-end pb-2 sm:pb-4"
                style={{
                  height: `${sectionHeadingHeight}px`,
                  left: `${GRID_EDGE_BLEED}px`,
                  right: `${GRID_EDGE_BLEED}px`,
                  transform,
                }}
              >
                {row.label ? (
                  <h2 className="text-lg font-black leading-none tracking-tight text-[#6B7684] sm:text-2xl">
                    {row.label}
                  </h2>
                ) : null}
              </div>
            )
          }

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                height: `${GRID_ROW_HEIGHT - GRID_GAP}px`,
                left: `${GRID_EDGE_BLEED}px`,
                right: `${GRID_EDGE_BLEED}px`,
                transform,
              }}
            >
              {row.items.map((item) => {
                const rowEnd = virtualRow.start + virtualRow.size
                const isNearViewport =
                  rowEnd >= scrollOffset - GRID_ROW_HEIGHT * EAGER_ROW_BUFFER &&
                  virtualRow.start <=
                    scrollOffset +
                      viewportHeight +
                      GRID_ROW_HEIGHT * EAGER_ROW_BUFFER

                return (
                  <EmoticonCard
                    key={item.id}
                    item={item}
                    collectionId={collectionId}
                    imageLoading={isNearViewport ? 'eager' : 'lazy'}
                    isTouchInput={isTouchInput}
                    isSelected={selectedItemId === item.id}
                    onSelect={onSelect}
                    onTooltipHide={handleTooltipHide}
                    onTooltipShow={handleTooltipShow}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      {tooltip && typeof document !== 'undefined'
        ? createPortal(<FloatingEmoticonTooltip tooltip={tooltip} />, document.body)
        : null}
    </div>
  )
}

function FloatingEmoticonTooltip({
  tooltip,
}: {
  tooltip: NonNullable<FloatingTooltipState>
}) {
  return (
    <div
      role="tooltip"
      data-emoticon-floating-tooltip=""
      className="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-full rounded-xl border border-zinc-950/5 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white shadow-[0_14px_34px_-18px_rgba(15,23,42,0.64)] dark:border-white/10 dark:bg-zinc-100 dark:text-zinc-950"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
      }}
    >
      {tooltip.label}
    </div>
  )
}
