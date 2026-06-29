'use client'

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from 'react'

export type PhysicsNumberPickerStyle = CSSProperties &
  Partial<Record<`--${string}`, string | number>>

export interface PhysicsNumberPickerProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  onValueChange?: (value: number) => void
  wrap?: boolean
  itemHeight?: number
  visibleItems?: 5 | 7 | 9
  formatValue?: (value: number, isSelected: boolean) => ReactNode
  label?: string
  className?: string
  style?: PhysicsNumberPickerStyle
}

interface UsePhysicsScrollOptions {
  totalItems: number
  itemHeight: number
  wrap: boolean
  selectedIndex: number
  onIndexChange: (index: number) => void
}

interface UsePhysicsScrollReturn {
  centerIndex: number
  scrollY: number
  subPixelOffset: number
  containerRef: React.RefObject<HTMLDivElement | null>
  handlers: {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => void
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => void
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void
    onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => void
    onWheel: (event: WheelEvent<HTMLDivElement>) => void
  }
  syncToIndex: (index: number) => void
}

const BASE_ITEM_HEIGHT = 56
const BASE_PHYSICS = {
  DECELERATION_RATE_MS: 0.9945,
  MOMENTUM_GAIN: 0.94,
  MIN_THROW_VELOCITY: 80,
  MAX_RELEASE_VELOCITY: 4200,
  MAX_PROJECTED_ROWS: 12,
  SETTLE_EPSILON_PX: 0.35,
  SETTLE_VELOCITY: 8,
  LOW_VELOCITY_SETTLE_K: 7.5,
  MIN_SETTLE_K: 3.2,
  MAX_SETTLE_K: 7.5,
} as const
const DEFAULT_PICKER_STYLE = {
  '--picker-fade-color': 'rgba(255,255,255,0.92)',
  '--picker-selection-bg': 'rgba(244,244,245,0.78)',
  '--picker-selection-border': 'rgba(24,24,27,0.10)',
  '--picker-selection-highlight': 'rgba(255,255,255,0.72)',
  '--picker-selection-shadow': 'rgba(24,24,27,0.24)',
} as const

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function mod(value: number, total: number) {
  return ((value % total) + total) % total
}

function normalizeVisibleItems(value: 5 | 7 | 9) {
  return value % 2 === 0 ? 7 : value
}

function usePhysicsScroll({
  totalItems,
  itemHeight,
  wrap,
  selectedIndex,
  onIndexChange,
}: UsePhysicsScrollOptions): UsePhysicsScrollReturn {
  const scale = itemHeight / BASE_ITEM_HEIGHT
  const physics = useMemo(
    () => ({
      ...BASE_PHYSICS,
      MAX_RELEASE_VELOCITY: BASE_PHYSICS.MAX_RELEASE_VELOCITY * scale,
      MIN_THROW_VELOCITY: BASE_PHYSICS.MIN_THROW_VELOCITY * scale,
      SETTLE_VELOCITY: BASE_PHYSICS.SETTLE_VELOCITY * scale,
      DRAG_EXIT_PX: 48 * scale,
    }),
    [scale]
  )

  const initialScrollY = selectedIndex * itemHeight
  const scrollYRef = useRef(initialScrollY)
  const [scrollY, setScrollY] = useState(initialScrollY)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const activePointerIdRef = useRef<number | null>(null)
  const dragBoundsRef = useRef<DOMRectReadOnly | null>(null)
  const dragStartYRef = useRef(0)
  const dragStartScrollRef = useRef(0)
  const velocitySamplesRef = useRef<Array<{ time: number; y: number }>>([])
  const rafIdRef = useRef<number | null>(null)
  const onIndexChangeRef = useRef(onIndexChange)
  const pendingSyncIndexRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    onIndexChangeRef.current = onIndexChange
  }, [onIndexChange])

  const cancelAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  const updateScrollY = useCallback((nextScrollY: number) => {
    scrollYRef.current = nextScrollY
    setScrollY(nextScrollY)
  }, [])

  const syncToIndex = useCallback(
    (index: number) => {
      const normalizedIndex = wrap ? mod(index, totalItems) : clamp(index, 0, totalItems - 1)

      if (isDraggingRef.current || isAnimatingRef.current) {
        pendingSyncIndexRef.current = normalizedIndex
        return
      }

      pendingSyncIndexRef.current = null
      updateScrollY(normalizedIndex * itemHeight)
    },
    [itemHeight, totalItems, updateScrollY, wrap]
  )

  const flushPendingSync = useCallback(() => {
    const pendingIndex = pendingSyncIndexRef.current
    if (pendingIndex === null) return false

    pendingSyncIndexRef.current = null
    isAnimatingRef.current = false
    updateScrollY(pendingIndex * itemHeight)
    return true
  }, [itemHeight, updateScrollY])

  const normalizeScrollY = useCallback(
    (nextScrollY: number) => {
      if (!wrap) {
        return clamp(nextScrollY, 0, (totalItems - 1) * itemHeight)
      }

      return mod(nextScrollY, totalItems * itemHeight)
    },
    [itemHeight, totalItems, wrap]
  )

  const getCommittedIndex = useCallback(
    (position: number) => {
      const roundedIndex = Math.round(position / itemHeight)
      return wrap ? mod(roundedIndex, totalItems) : clamp(roundedIndex, 0, totalItems - 1)
    },
    [itemHeight, totalItems, wrap]
  )

  const getTargetPosition = useCallback(
    (projectedPosition: number) => {
      const roundedIndex = Math.round(projectedPosition / itemHeight)
      const targetIndex = wrap
        ? mod(roundedIndex, totalItems)
        : clamp(roundedIndex, 0, totalItems - 1)
      const targetPosition = wrap ? roundedIndex * itemHeight : targetIndex * itemHeight

      return { targetIndex, targetPosition }
    },
    [itemHeight, totalItems, wrap]
  )

  const getProjectedTargetPosition = useCallback(
    (fromPosition: number, releaseVelocity: number) => {
      const decelerationK = -Math.log(physics.DECELERATION_RATE_MS) * 1000
      const projectedDistance = releaseVelocity / decelerationK
      const maxProjectedDistance = physics.MAX_PROJECTED_ROWS * itemHeight
      const projectedPosition =
        fromPosition +
        clamp(projectedDistance, -maxProjectedDistance, maxProjectedDistance)
      const boundedProjection = wrap
        ? projectedPosition
        : clamp(projectedPosition, 0, (totalItems - 1) * itemHeight)

      return getTargetPosition(boundedProjection).targetPosition
    },
    [
      getTargetPosition,
      itemHeight,
      physics.DECELERATION_RATE_MS,
      physics.MAX_PROJECTED_ROWS,
      totalItems,
      wrap,
    ]
  )

  const settleToTarget = useCallback(
    (fromPosition: number, targetPosition: number, releaseVelocity: number) => {
      cancelAnimation()
      let position = fromPosition
      let lastTime = performance.now()
      const distance = targetPosition - fromPosition

      if (Math.abs(distance) <= physics.SETTLE_EPSILON_PX) {
        const finalPosition = normalizeScrollY(targetPosition)
        updateScrollY(finalPosition)
        isAnimatingRef.current = false
        if (flushPendingSync()) return
        onIndexChangeRef.current(getCommittedIndex(finalPosition))
        return
      }

      const settleK =
        Math.abs(releaseVelocity) > physics.MIN_THROW_VELOCITY &&
        Math.abs(distance) > 1
          ? clamp(
              Math.abs(releaseVelocity / distance),
              physics.MIN_SETTLE_K,
              physics.MAX_SETTLE_K
            )
          : physics.LOW_VELOCITY_SETTLE_K

      const animateSettle = (now: number) => {
        const deltaSeconds = Math.min(now - lastTime, 48) / 1000
        lastTime = now
        const alpha = 1 - Math.exp(-settleK * deltaSeconds)
        const nextPosition = position + (targetPosition - position) * alpha
        const frameVelocity =
          deltaSeconds > 0 ? Math.abs(nextPosition - position) / deltaSeconds : 0
        position = nextPosition

        if (
          Math.abs(targetPosition - position) <= physics.SETTLE_EPSILON_PX &&
          frameVelocity <= physics.SETTLE_VELOCITY
        ) {
          const finalPosition = normalizeScrollY(targetPosition)
          updateScrollY(finalPosition)
          isAnimatingRef.current = false
          if (flushPendingSync()) return
          onIndexChangeRef.current(getCommittedIndex(finalPosition))
          return
        }

        updateScrollY(position)
        rafIdRef.current = requestAnimationFrame(animateSettle)
      }

      rafIdRef.current = requestAnimationFrame(animateSettle)
    },
    [
      cancelAnimation,
      getCommittedIndex,
      normalizeScrollY,
      flushPendingSync,
      physics.LOW_VELOCITY_SETTLE_K,
      physics.MAX_SETTLE_K,
      physics.MIN_SETTLE_K,
      physics.MIN_THROW_VELOCITY,
      physics.SETTLE_EPSILON_PX,
      physics.SETTLE_VELOCITY,
      updateScrollY,
    ]
  )

  const calculateReleaseVelocity = useCallback(() => {
    const samples = velocitySamplesRef.current
    if (samples.length < 2) return 0

    const first = samples[0]
    const last = samples[samples.length - 1]
    const duration = last.time - first.time
    if (duration === 0) return 0

    const pointerVelocity = (last.y - first.y) / duration
    const scrollVelocity = -pointerVelocity * 1000 * physics.MOMENTUM_GAIN
    return clamp(
      scrollVelocity,
      -physics.MAX_RELEASE_VELOCITY,
      physics.MAX_RELEASE_VELOCITY
    )
  }, [physics.MAX_RELEASE_VELOCITY, physics.MOMENTUM_GAIN])

  const releaseWithMomentum = useCallback(
    (releaseVelocity: number) => {
      isAnimatingRef.current = true
      const fromPosition = scrollYRef.current
      const targetPosition = getProjectedTargetPosition(fromPosition, releaseVelocity)
      settleToTarget(fromPosition, targetPosition, releaseVelocity)
    },
    [getProjectedTargetPosition, settleToTarget]
  )

  const releasePointerCapture = useCallback(
    (pointerId: number | null, target?: HTMLDivElement) => {
      const element = target ?? containerRef.current
      if (pointerId === null || !element?.hasPointerCapture(pointerId)) return

      element.releasePointerCapture(pointerId)
    },
    []
  )

  const handleStart = useCallback(
    (clientY: number, pointerId: number, bounds: DOMRectReadOnly) => {
      cancelAnimation()
      isDraggingRef.current = true
      isAnimatingRef.current = false
      activePointerIdRef.current = pointerId
      dragBoundsRef.current = bounds
      dragStartYRef.current = clientY
      dragStartScrollRef.current = scrollYRef.current
      velocitySamplesRef.current = [{ time: performance.now(), y: clientY }]
    },
    [cancelAnimation]
  )

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDraggingRef.current || isAnimatingRef.current) return

      const distance = dragStartYRef.current - clientY
      const nextScrollY = wrap
        ? dragStartScrollRef.current + distance
        : clamp(dragStartScrollRef.current + distance, 0, (totalItems - 1) * itemHeight)
      updateScrollY(nextScrollY)

      const now = performance.now()
      velocitySamplesRef.current = [
        ...velocitySamplesRef.current.filter((sample) => now - sample.time <= 100),
        { time: now, y: clientY },
      ]
    },
    [itemHeight, totalItems, updateScrollY, wrap]
  )

  const isPastDragExit = useCallback(
    (clientY: number) => {
      const bounds = dragBoundsRef.current
      if (!bounds) return false

      return (
        clientY < bounds.top - physics.DRAG_EXIT_PX ||
        clientY > bounds.bottom + physics.DRAG_EXIT_PX
      )
    },
    [physics.DRAG_EXIT_PX]
  )

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false
    activePointerIdRef.current = null
    dragBoundsRef.current = null
    releaseWithMomentum(calculateReleaseVelocity())
  }, [calculateReleaseVelocity, releaseWithMomentum])

  useLayoutEffect(() => {
    syncToIndex(selectedIndex)
  }, [selectedIndex, syncToIndex])

  useLayoutEffect(() => {
    return () => cancelAnimation()
  }, [cancelAnimation])

  useLayoutEffect(() => {
    window.addEventListener('blur', handleEnd)
    return () => window.removeEventListener('blur', handleEnd)
  }, [handleEnd])

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.focus({ preventScroll: true })
      handleStart(
        event.clientY,
        event.pointerId,
        event.currentTarget.getBoundingClientRect()
      )
    },
    [handleStart]
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return
      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return
      }

      event.preventDefault()
      handleMove(event.clientY)

      if (isPastDragExit(event.clientY)) {
        const pointerId = event.pointerId
        handleEnd()
        releasePointerCapture(pointerId, event.currentTarget)
      }
    },
    [handleEnd, handleMove, isPastDragExit, releasePointerCapture]
  )

  const onPointerEnd = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return
      }

      releasePointerCapture(event.pointerId, event.currentTarget)
      handleEnd()
    },
    [handleEnd, releasePointerCapture]
  )

  const onLostPointerCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return
      }

      handleEnd()
    },
    [handleEnd]
  )

  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault()
      const direction = event.deltaY > 0 ? 1 : -1
      const nextIndex = getCommittedIndex(scrollYRef.current) + direction
      const nextPosition =
        (wrap ? mod(nextIndex, totalItems) : clamp(nextIndex, 0, totalItems - 1)) *
        itemHeight
      isAnimatingRef.current = true
      settleToTarget(scrollYRef.current, nextPosition, 0)
    },
    [
      getCommittedIndex,
      itemHeight,
      settleToTarget,
      totalItems,
      wrap,
    ]
  )

  const centerFloat = scrollY / itemHeight
  const centerIndex = Math.round(centerFloat)
  const subPixelOffset = (centerFloat - centerIndex) * itemHeight

  return {
    centerIndex,
    scrollY,
    subPixelOffset,
    containerRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onLostPointerCapture,
      onWheel,
    },
    syncToIndex,
  }
}

export function PhysicsNumberPicker({
  value,
  defaultValue,
  min = 0,
  max = 59,
  onValueChange,
  wrap = true,
  itemHeight = BASE_ITEM_HEIGHT,
  visibleItems = 7,
  formatValue,
  label = 'Number picker',
  className = '',
  style,
}: PhysicsNumberPickerProps) {
  const totalItems = Math.max(1, max - min + 1)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    clamp(defaultValue ?? value ?? min, min, max)
  )
  const currentValue = clamp(isControlled ? value : internalValue, min, max)

  const commitIndex = useCallback(
    (index: number) => {
      const normalizedIndex = wrap ? mod(index, totalItems) : clamp(index, 0, totalItems - 1)
      const nextValue = min + normalizedIndex

      if (!isControlled) {
        setInternalValue(nextValue)
      }

      onValueChange?.(nextValue)
    },
    [isControlled, min, onValueChange, totalItems, wrap]
  )

  const selectedIndex = currentValue - min
  const normalizedVisibleItems = normalizeVisibleItems(visibleItems)
  const centerSlot = Math.floor(normalizedVisibleItems / 2)
  const containerHeight = normalizedVisibleItems * itemHeight
  const pickerStyle = {
    ...DEFAULT_PICKER_STYLE,
    ...style,
    '--picker-height': `${containerHeight}px`,
    '--picker-item-height': `${itemHeight}px`,
  } as CSSProperties
  const { centerIndex, scrollY, subPixelOffset, containerRef, handlers, syncToIndex } =
    usePhysicsScroll({
      totalItems,
      itemHeight,
      wrap,
      selectedIndex,
      onIndexChange: commitIndex,
    })

  const moveBy = useCallback(
    (delta: number) => {
      commitIndex(selectedIndex + delta)
      syncToIndex(selectedIndex + delta)
    },
    [commitIndex, selectedIndex, syncToIndex]
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      moveBy(1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      moveBy(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      commitIndex(0)
      syncToIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      commitIndex(totalItems - 1)
      syncToIndex(totalItems - 1)
    }
  }

  return (
    <div
      ref={containerRef}
      data-physics-number-picker=""
      data-picker-scroll-y={scrollY.toFixed(3)}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentValue}
      className={`relative isolate h-[var(--picker-height)] w-28 cursor-grab touch-none select-none overflow-hidden rounded-[2rem] bg-transparent outline-none ring-0 transition-[box-shadow] focus-visible:shadow-[0_0_0_4px_rgba(45,212,191,0.24)] active:cursor-grabbing ${className}`}
      style={pickerStyle}
      onKeyDown={handleKeyDown}
      {...handlers}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-1/2 z-[1] h-[var(--picker-item-height)] -translate-y-1/2 rounded-2xl border backdrop-blur-xl"
        style={{
          background: 'var(--picker-selection-bg)',
          borderColor: 'var(--picker-selection-border)',
          boxShadow:
            'inset 0 1px 0 var(--picker-selection-highlight), 0 18px 48px -32px var(--picker-selection-shadow)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-20"
        style={{
          background:
            'linear-gradient(to bottom, var(--picker-fade-color), color-mix(in srgb, var(--picker-fade-color) 62%, transparent), transparent)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-20"
        style={{
          background:
            'linear-gradient(to top, var(--picker-fade-color), color-mix(in srgb, var(--picker-fade-color) 62%, transparent), transparent)',
        }}
      />
      {Array.from({ length: normalizedVisibleItems }, (_, slotIndex) => {
        const slot = slotIndex - centerSlot
        const rawIndex = centerIndex + slot
        const itemIndex = wrap ? mod(rawIndex, totalItems) : rawIndex
        if (!wrap && (itemIndex < 0 || itemIndex >= totalItems)) return null

        const itemValue = min + itemIndex
        const yPosition = slot * itemHeight - subPixelOffset + centerSlot * itemHeight
        const distance = Math.abs(slot - subPixelOffset / itemHeight)
        const opacity = clamp(1 - distance * 0.26, 0.16, 1)
        const scale = clamp(1 - distance * 0.055, 0.82, 1)
        const isSelected = distance < 0.5

        return (
          <div
            key={`${itemValue}-${slot}`}
            data-picker-item=""
            data-picker-selected={isSelected ? 'true' : 'false'}
            data-picker-value={itemValue}
            aria-hidden={!isSelected}
            className="absolute inset-x-0 z-[2] flex items-center justify-center text-[2.625rem] font-black italic tracking-normal text-zinc-950/86 transition-colors dark:text-zinc-50"
            style={{
              height: itemHeight,
              opacity,
              transform: `translateY(${yPosition}px) scale(${scale})`,
            }}
          >
            {formatValue
              ? formatValue(itemValue, isSelected)
              : String(itemValue).padStart(2, '0')}
          </div>
        )
      })}
    </div>
  )
}
