import type { PartialOptions } from 'overlayscrollbars'

export const APP_SCROLLBAR_OPTIONS = {
  scrollbars: {
    autoHide: 'scroll',
    autoHideDelay: 640,
    clickScroll: true,
    dragScroll: true,
    theme: 'os-theme-ryonglog',
  },
} satisfies PartialOptions

export const BODY_SCROLLBAR_OPTIONS = {
  ...APP_SCROLLBAR_OPTIONS,
  overflow: {
    x: 'hidden',
    y: 'scroll',
  },
} satisfies PartialOptions
