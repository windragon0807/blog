'use client'

import { useEffect } from 'react'
import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars'

const BODY_SCROLLBAR_OPTIONS = {
  overflow: {
    x: 'hidden',
    y: 'scroll',
  },
  scrollbars: {
    autoHide: 'scroll',
    autoHideDelay: 640,
    clickScroll: true,
    dragScroll: true,
    theme: 'os-theme-ryonglog',
  },
} satisfies PartialOptions

export function BodyScrollbars() {
  useEffect(() => {
    const body = document.body
    body.setAttribute('data-overlayscrollbars-initialize', '')

    const instance = OverlayScrollbars(
      {
        target: body,
        cancel: {
          body: false,
          nativeScrollbarsOverlaid: false,
        },
      },
      BODY_SCROLLBAR_OPTIONS
    )

    return () => {
      instance.destroy()
      body.removeAttribute('data-overlayscrollbars-initialize')
    }
  }, [])

  return null
}
