'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FlowerMenuItem {
  label: string
  icon: ReactNode
  onClick?: () => void
}

interface FlowerMenuProps {
  items: FlowerMenuItem[]
  className?: string
}

export function FlowerMenu({ items, className }: FlowerMenuProps) {
  const [open, setOpen] = useState(false)
  const radius = 76

  return (
    <div className={cn('relative h-48 w-48', className)}>
      <AnimatePresence>
        {open &&
          items.map((item, index) => {
            const angle = (-140 + (280 / Math.max(items.length - 1, 1)) * index) * (Math.PI / 180)
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            return (
              <motion.button
                key={item.label}
                type="button"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                animate={{ x, y, opacity: 1, scale: 1 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                onClick={item.onClick}
                aria-label={item.label}
              >
                {item.icon}
              </motion.button>
            )
          })}
      </AnimatePresence>
      <button
        type="button"
        className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--theme-accent-current)] text-[var(--background)] shadow-[0_18px_44px_-24px_var(--theme-accent-current)]"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Toggle flower menu"
      >
        <Plus className={cn('h-5 w-5 transition-transform duration-300', open && 'rotate-45')} />
      </button>
    </div>
  )
}
