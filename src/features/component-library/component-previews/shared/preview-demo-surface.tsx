import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function OuterEffectSurface({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative flex min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-background text-center text-foreground ${className}`}
    >
      {children}
    </div>
  )
}

export function PreviewDemoSurface({
  label = 'component preview',
  title,
  subtitle,
  accentClassName,
  children,
  overlay,
  className,
  headingClassName,
  contentGapClassName,
  contentClassName,
}: {
  label?: string
  title: ReactNode
  subtitle: string
  accentClassName: string
  children?: ReactNode
  overlay?: ReactNode
  className?: string
  headingClassName?: string
  contentGapClassName?: string
  contentClassName?: string
}) {
  return (
    <div
      data-preview-demo-surface=""
      className={cn(
        'relative flex min-h-[22rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-[#0a0a0f] px-4 py-9 text-center text-white sm:min-h-[24rem] sm:px-6 sm:py-12 md:min-h-[28rem] md:px-8 md:py-16 lg:py-20',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_62%)]" />
      <div className={cn('pointer-events-none absolute inset-0 opacity-30', accentClassName)} />
      {overlay}
      <div className={cn('relative z-10 flex max-w-xl flex-col items-center', contentClassName)}>
        <div className={cn('flex flex-col items-center', headingClassName)}>
          <p className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/60 sm:text-xs sm:tracking-[0.18em]">
            {label}
          </p>
          <div
            data-preview-demo-title=""
            className="mt-4 max-w-full text-balance text-3xl font-semibold leading-[1.05] tracking-normal sm:text-4xl md:text-5xl"
          >
            {title}
          </div>
          <p className="mt-2 text-xs italic tracking-wide text-white/52 sm:mt-3 sm:text-sm">
            {subtitle}
          </p>
        </div>
        {children ? (
          <div
            data-preview-demo-content=""
            className={cn('mt-7 flex w-full items-center justify-center sm:mt-10', contentGapClassName)}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
