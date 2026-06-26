'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ToggleThemeProps {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export function ToggleTheme({
  defaultChecked = false,
  onChange,
  className,
}: ToggleThemeProps) {
  const [checked, setChecked] = useState(defaultChecked)

  const update = () => {
    const next = !checked
    setChecked(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={update}
      className={cn(
        'relative h-9 w-16 rounded-full border border-zinc-200 bg-zinc-100 p-1 transition-colors aria-checked:bg-[var(--theme-accent-current)] dark:border-zinc-800 dark:bg-zinc-900',
        className
      )}
    >
      <span
        className={cn(
          'block h-7 w-7 rounded-full bg-white shadow-sm transition-transform',
          checked && 'translate-x-7'
        )}
      />
    </button>
  )
}
