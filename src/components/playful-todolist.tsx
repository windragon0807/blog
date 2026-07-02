'use client'

import { useState } from 'react'
import { motion, type Transition } from 'motion/react'
import { cn } from '@/lib/utils'

interface TodoItem {
  id: number
  label: string
  defaultChecked: boolean
}

interface PlayfulTodoListProps {
  items?: TodoItem[]
  className?: string
}

const checkboxItems: TodoItem[] = [
  {
    id: 1,
    label: 'Code in Assembly 💾',
    defaultChecked: false,
  },
  {
    id: 2,
    label: 'Present a bug as a feature 🪲',
    defaultChecked: false,
  },
  {
    id: 3,
    label: 'Push to prod on a Friday 🚀',
    defaultChecked: false,
  },
]

const getPathAnimate = (checked: boolean) => ({
  pathLength: checked ? 1 : 0,
  opacity: checked ? 1 : 0,
})

const getPathTransition = (checked: boolean): Transition => ({
  pathLength: {
    duration: checked ? 1 : 0.45,
    ease: 'easeInOut',
  },
  opacity: {
    duration: 0.01,
    delay: checked ? 0 : 0.45,
  },
})

export function PlayfulTodoList({
  items = checkboxItems,
  className,
}: PlayfulTodoListProps) {
  const [checked, setChecked] = useState(items.map((item) => item.defaultChecked))

  return (
    <div
      className={cn(
        'w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-white/[0.07] p-5 text-left text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur-md',
        className
      )}
    >
      {items.map((item, index) => (
        <div key={item.id} className="space-y-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              id={`checkbox-${item.id}`}
              aria-pressed={checked[index]}
              onClick={() => {
                setChecked((current) => {
                  const updated = [...current]
                  updated[index] = !updated[index]
                  return updated
                })
              }}
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-md border border-white/18 bg-white/[0.08] text-sky-300 shadow-[0_12px_28px_-22px_rgba(255,255,255,0.5)] transition-colors',
                checked[index] &&
                  'border-sky-300/35 bg-sky-300/15 text-sky-200'
              )}
            >
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
                initial={false}
                animate={{
                  scale: checked[index] ? 1 : 0,
                  opacity: checked[index] ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 520, damping: 26 }}
              >
                <path d="M20 6 9 17l-5-5" />
              </motion.svg>
            </button>

            <div className="relative inline-block">
              <label
                htmlFor={`checkbox-${item.id}`}
                className={cn(
                  'cursor-pointer text-base font-medium text-white transition-colors',
                  checked[index] && 'text-white/42'
                )}
              >
                {item.label}
              </label>
              <motion.svg
                width="340"
                height="32"
                viewBox="0 0 340 32"
                className="pointer-events-none absolute left-0 top-1/2 z-20 h-10 w-full -translate-y-1/2"
              >
                <motion.path
                  d="M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeMiterlimit={10}
                  fill="none"
                  initial={false}
                  animate={getPathAnimate(checked[index])}
                  transition={getPathTransition(checked[index])}
                  className={cn(
                    'stroke-white/80 transition-colors',
                    checked[index] && 'stroke-white/38'
                  )}
                />
              </motion.svg>
            </div>
          </div>

          {index !== items.length - 1 ? (
            <div className="border-t border-white/12" />
          ) : null}
        </div>
      ))}
    </div>
  )
}
