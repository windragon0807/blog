'use client'

import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedCheckboxProps {
  label?: string
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function AnimatedCheckbox({
  label = 'Accept terms',
  defaultChecked = false,
  checked,
  onCheckedChange,
  className,
}: AnimatedCheckboxProps) {
  const id = useId()
  const [innerChecked, setInnerChecked] = useState(defaultChecked)
  const active = checked ?? innerChecked

  const update = (next: boolean) => {
    setInnerChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <label
      htmlFor={id}
      className={cn('inline-flex cursor-pointer items-center gap-3 text-sm font-medium', className)}
    >
      <input
        id={id}
        type="checkbox"
        checked={active}
        onChange={(event) => update(event.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
          active
            ? 'border-[var(--theme-accent-current)] bg-[var(--theme-accent-current)] text-[var(--background)]'
            : 'border-zinc-300 bg-white text-transparent dark:border-zinc-700 dark:bg-zinc-950'
        )}
      >
        {active && (
          <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>
            <Check className="h-4 w-4" />
          </motion.span>
        )}
      </span>
      {label}
    </label>
  )
}
