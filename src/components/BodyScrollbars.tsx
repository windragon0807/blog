'use client'

import { useEffect } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'
import { BODY_SCROLLBAR_OPTIONS } from '@/lib/scrollbars'

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
