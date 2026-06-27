'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface AvatarGroupItem {
  src?: string
  name: string
  fallback?: string
}

interface AvatarGroupProps {
  items?: AvatarGroupItem[]
  max?: number
  className?: string
  children?: ReactNode
}

const defaultItems: AvatarGroupItem[] = ['Mina', 'Joon', 'Ari', 'Theo', 'Lia', 'Noah'].map(
  (name) => ({
    name,
    src: `https://avatar.vercel.sh/${name}`,
  })
)

export function AvatarGroup({
  items = defaultItems,
  max = 5,
  className,
  children,
}: AvatarGroupProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const visible = items.slice(0, max)
  const extra = Math.max(items.length - visible.length, 0)

  if (children) {
    return <div className={cn('flex items-center -space-x-3', className)}>{children}</div>
  }

  return (
    <div className={cn('flex items-center -space-x-3', className)}>
      {visible.map((item, index) => (
        <motion.div
          key={item.name}
          className="relative"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
          onHoverStart={() => setHovered(item.name)}
          onHoverEnd={() => setHovered(null)}
          whileHover={{ y: -10, scale: 1.06, zIndex: 40 }}
          whileTap={{ scale: 0.96 }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-zinc-100 text-sm font-semibold text-zinc-700 shadow-[0_10px_24px_-16px_rgba(24,24,27,0.65)] dark:border-zinc-950 dark:bg-zinc-800 dark:text-zinc-200"
            title={item.name}
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              item.fallback ?? item.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <AnimatePresence>
            {hovered === item.name ? (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white shadow-sm"
              >
                {item.name}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ))}
      {extra > 0 && (
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[var(--theme-accent-current)] text-sm font-semibold text-[var(--background)] shadow-sm dark:border-zinc-950"
          whileHover={{ y: -10, scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          +{extra}
        </motion.div>
      )}
    </div>
  )
}
