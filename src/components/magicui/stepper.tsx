'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepperItem {
  title: string
  description?: string
}

interface StepperProps {
  steps: StepperItem[]
  defaultStep?: number
  className?: string
}

export function Stepper({ steps, defaultStep = 0, className }: StepperProps) {
  const [active, setActive] = useState(defaultStep)

  return (
    <div className={cn('w-full max-w-xl', className)}>
      <div className="flex items-start justify-between gap-3">
        {steps.map((step, index) => {
          const done = index < active
          const selected = index === active

          return (
            <button
              key={step.title}
              type="button"
              className="group flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
              onClick={() => setActive(index)}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                  done || selected
                    ? 'border-[var(--theme-accent-current)] bg-[var(--theme-accent-current)] text-[var(--background)]'
                    : 'border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950'
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{step.title}</span>
              {step.description && (
                <span className="text-xs leading-4 text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
