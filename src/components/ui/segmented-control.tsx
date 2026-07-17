'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type SegmentedOption<Value extends string> = {
  label: string
  value: Value
}

type SegmentedControlProps<Value extends string> = {
  label: string
  options: readonly SegmentedOption<Value>[]
  value: Value
  onValueChange: (value: Value) => void
  className?: string
}

type SegmentedStyle = CSSProperties & {
  '--segment-count': number
  '--segment-translate': string
}

export function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<Value>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )
  const style: SegmentedStyle = {
    '--segment-count': options.length,
    '--segment-translate': `${selectedIndex * 100}%`,
    gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'settings-segmented-control relative grid rounded-xl bg-muted/70 p-1 dark:bg-white/[0.06]',
        className
      )}
      style={style}
    >
      <span
        aria-hidden="true"
        data-segmented-indicator=""
        className="settings-segmented-indicator absolute inset-y-1 left-1 rounded-lg bg-background shadow-sm dark:bg-zinc-800"
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onValueChange(option.value)}
          className="relative z-10 min-h-10 min-w-0 rounded-lg px-2 py-2 text-xs font-medium text-zinc-600 outline-none transition-[color,transform] hover:text-foreground active:translate-y-px focus-visible:ring-2 focus-visible:ring-ring/45 aria-pressed:text-foreground dark:text-zinc-300"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
