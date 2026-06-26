'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BorderBeamButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function BorderBeamButton({
  children,
  className,
  ...props
}: BorderBeamButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-[0_18px_44px_-28px_rgba(24,24,27,0.75)] dark:bg-white dark:text-zinc-950',
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 rounded-[inherit] p-px [background:conic-gradient(from_0deg,transparent_0_55%,#60a5fa,#c084fc,#f9a8d4,transparent_82%)] motion-safe:animate-spin [animation-duration:2.8s]" />
      <span className="absolute inset-px rounded-[11px] bg-zinc-950 dark:bg-white" />
      <span className="relative">{children}</span>
    </button>
  )
}
