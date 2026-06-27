'use client'

import * as React from 'react'
import type { EventListeners, PartialOptions } from 'overlayscrollbars'
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react'
import { cn } from '@/lib/utils'

type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

type ScrollAreaProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children?: React.ReactNode
  defer?: boolean | IdleRequestOptions
  element?: React.ElementType
  events?: EventListeners | false | null
  options?: PartialOptions | false | null
  orientation?: ScrollAreaOrientation
}

const DEFAULT_SCROLLBAR_OPTIONS = {
  autoHide: 'scroll',
  autoHideDelay: 640,
  clickScroll: true,
  dragScroll: true,
  theme: 'os-theme-ryonglog',
} satisfies NonNullable<PartialOptions['scrollbars']>

function getOverflowOptions(orientation: ScrollAreaOrientation) {
  if (orientation === 'horizontal') {
    return { x: 'scroll', y: 'hidden' } satisfies PartialOptions['overflow']
  }

  if (orientation === 'both') {
    return { x: 'scroll', y: 'scroll' } satisfies PartialOptions['overflow']
  }

  return { x: 'hidden', y: 'scroll' } satisfies PartialOptions['overflow']
}

function getScrollAreaOptions(
  orientation: ScrollAreaOrientation,
  options: ScrollAreaProps['options']
) {
  if (options === false || options === null) return options

  return {
    ...options,
    overflow: {
      ...getOverflowOptions(orientation),
      ...options?.overflow,
    },
    scrollbars: {
      ...DEFAULT_SCROLLBAR_OPTIONS,
      ...options?.scrollbars,
    },
  } satisfies PartialOptions
}

function callEventHandlers(value: unknown, args: unknown[]) {
  if (Array.isArray(value)) {
    value.forEach((handler) => callEventHandlers(handler, args))
    return
  }

  if (typeof value === 'function') {
    value(...args)
  }
}

function getScrollAreaEvents(events: ScrollAreaProps['events']) {
  if (events === false || events === null) return events

  return {
    ...events,
    initialized: (...args) => {
      callEventHandlers(events?.initialized, args)
    },
    updated: (...args) => {
      callEventHandlers(events?.updated, args)
    },
  } satisfies EventListeners
}

const ScrollArea = React.forwardRef<HTMLElement, ScrollAreaProps>(
  function ScrollArea(
    {
      className,
      children,
      defer = true,
      element = 'div',
      events,
      options,
      orientation = 'vertical',
      ...props
    },
    forwardedRef
  ) {
    const componentRef = React.useRef<OverlayScrollbarsComponentRef | null>(null)

    React.useImperativeHandle(
      forwardedRef,
      () => componentRef.current?.getElement() as HTMLElement,
      []
    )

    return (
      <OverlayScrollbarsComponent
        ref={componentRef}
        data-slot="scroll-area"
        data-overlayscrollbars-initialize=""
        defer={defer}
        element={element}
        events={getScrollAreaEvents(events)}
        options={getScrollAreaOptions(orientation, options)}
        className={cn(
          'relative transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1',
          className
        )}
        {...props}
      >
        {children}
      </OverlayScrollbarsComponent>
    )
  }
)

function ScrollBar() {
  return null
}

export { ScrollArea, ScrollBar }
