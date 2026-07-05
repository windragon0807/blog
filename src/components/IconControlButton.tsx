'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  IconButton,
  iconButtonClassName,
} from '@/components/common/IconButton'
import { cn } from '@/lib/utils'

interface IconControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  srLabel: string
  children: ReactNode
}

export const ICON_CONTROL_BUTTON_CLASS_NAME =
  `header-action-control glass-surface inline-flex h-9 w-9 translate-y-0 items-center justify-center rounded-xl border border-zinc-200/90 bg-white/82 text-zinc-500 shadow-sm leading-none backdrop-blur-md transition-[background-color,border-color,color,box-shadow,translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white/95 hover:text-zinc-700 hover:shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)] focus-visible:ring-2 focus-visible:ring-ring/45 data-[state=open]:border-zinc-300 data-[state=open]:bg-white/95 data-[state=open]:text-zinc-800 data-[state=open]:shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)] dark:border-zinc-700/80 dark:bg-zinc-800/75 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/80 dark:hover:text-zinc-100 dark:hover:shadow-[0_14px_28px_-18px_rgba(2,6,23,0.75)] dark:data-[state=open]:border-zinc-500 dark:data-[state=open]:bg-zinc-700/80 dark:data-[state=open]:text-zinc-100 dark:data-[state=open]:shadow-[0_14px_28px_-18px_rgba(2,6,23,0.75)] ${iconButtonClassName}`

export function IconControlButton({
  srLabel,
  className = '',
  children,
  ...props
}: IconControlButtonProps) {
  return (
    <IconButton
      label={srLabel}
      className={cn(ICON_CONTROL_BUTTON_CLASS_NAME, className)}
      {...props}
    >
      {children}
    </IconButton>
  )
}
