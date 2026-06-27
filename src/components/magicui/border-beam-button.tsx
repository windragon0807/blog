'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BorderBeamButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  beamSize?: 'sm' | 'md' | 'lg'
}

export function BorderBeamButton({
  children,
  className,
  beamSize = 'sm',
  ...props
}: BorderBeamButtonProps) {
  const beamWidth = beamSize === 'lg' ? 'p-[3px]' : beamSize === 'md' ? 'p-0.5' : 'p-px'

  return (
    <button
      type="button"
      className={cn(
        'group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl bg-white px-6 font-[inherit] text-sm font-semibold text-zinc-950 shadow-[0_18px_44px_-30px_rgba(24,24,27,0.45)] ring-1 ring-zinc-200/80 transition-transform hover:-translate-y-0.5 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'absolute inset-0 rounded-[inherit] [background:conic-gradient(from_0deg,transparent_0_45%,#38bdf8,#a78bfa,#fb7185,#fbbf24,transparent_78%)] motion-safe:animate-spin [animation-duration:2.8s]',
          beamWidth
        )}
      />
      <span className="absolute inset-px rounded-[11px] bg-white dark:bg-zinc-950" />
      <span className="relative">{children}</span>
    </button>
  )
}
