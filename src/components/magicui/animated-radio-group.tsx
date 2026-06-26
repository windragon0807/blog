'use client'

import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface AnimatedRadioOption {
  label: string
  value: string
}

interface AnimatedRadioGroupProps {
  options: AnimatedRadioOption[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function AnimatedRadioGroup({
  options,
  defaultValue,
  value,
  onValueChange,
  className,
}: AnimatedRadioGroupProps) {
  const name = useId()
  const [innerValue, setInnerValue] = useState(defaultValue ?? options[0]?.value)
  const activeValue = value ?? innerValue

  const update = (next: string) => {
    setInnerValue(next)
    onValueChange?.(next)
  }

  return (
    <div className={cn('grid gap-2', className)} role="radiogroup">
      {options.map((option) => {
        const active = activeValue === option.value

        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => update(option.value)}
              className="sr-only"
            />
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700">
              {active && (
                <motion.span
                  layoutId={`${name}-radio-dot`}
                  className="h-2.5 w-2.5 rounded-full bg-[var(--theme-accent-current)]"
                />
              )}
            </span>
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
