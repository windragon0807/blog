import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { ComponentPreviewKind } from '../component-data'
import { PreviewDemoSurface } from './shared/preview-demo-surface'

export function useDesktopPreviewAvailable() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine)'
    )
    const sync = () => setIsAvailable(query.matches)

    sync()
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  return isAvailable
}

export function MobileUnavailablePreview({
  slug,
  title,
  subtitle = 'desktop pointer preview',
  accentClassName = 'bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.22),transparent_58%)]',
}: {
  slug: ComponentPreviewKind
  title: string
  subtitle?: string
  accentClassName?: string
}) {
  return (
    <PreviewDemoSurface
      label="desktop only"
      title={title}
      subtitle={subtitle}
      accentClassName={accentClassName}
    >
      <div
        data-mobile-preview-unavailable={slug}
        className="rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-medium text-white/62 shadow-[0_18px_60px_-38px_rgba(255,255,255,0.32)] backdrop-blur-md sm:text-sm"
      >
        Desktop preview
      </div>
    </PreviewDemoSurface>
  )
}

export function DesktopOnlyPreview({
  slug,
  title,
  subtitle,
  accentClassName,
  children,
}: {
  slug: ComponentPreviewKind
  title: string
  subtitle?: string
  accentClassName?: string
  children: ReactNode
}) {
  const isDesktopPreviewAvailable = useDesktopPreviewAvailable()

  if (!isDesktopPreviewAvailable) {
    return (
      <MobileUnavailablePreview
        slug={slug}
        title={title}
        subtitle={subtitle}
        accentClassName={accentClassName}
      />
    )
  }

  return children
}
