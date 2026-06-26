'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpeedDialItem {
  label: string
  icon: ReactNode
  onClick?: () => void
}

interface SpeedDialProps {
  items: SpeedDialItem[]
  className?: string
}

export function SpeedDial({ items, className }: SpeedDialProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('flex flex-col-reverse items-center gap-3', className)}>
      <button
        type="button"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--theme-accent-current)] text-[var(--background)] shadow-[0_18px_44px_-24px_var(--theme-accent-current)]"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Toggle speed dial"
      >
        <Plus className={cn('h-5 w-5 transition-transform duration-300', open && 'rotate-45')} />
      </button>
      <AnimatePresence>
        {open &&
          items.map((item, index) => (
            <motion.button
              key={item.label}
              type="button"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ delay: index * 0.035 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              onClick={item.onClick}
              aria-label={item.label}
            >
              {item.icon}
            </motion.button>
          ))}
      </AnimatePresence>
    </div>
  )
}
