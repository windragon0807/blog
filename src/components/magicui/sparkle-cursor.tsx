'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface Sparkle {
  id: number
  x: number
  y: number
}

interface SparkleCursorProps {
  children?: React.ReactNode
  color?: string
  className?: string
}

export function SparkleCursor({
  children,
  color = 'var(--theme-accent-current)',
  className,
}: SparkleCursorProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  const addSparkle = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const id = Date.now()
    const next = {
      id,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    setSparkles((current) => [...current.slice(-10), next])
    window.setTimeout(() => {
      setSparkles((current) => current.filter((sparkle) => sparkle.id !== id))
    }, 700)
  }

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden rounded-[inherit]', className)}
      onPointerMove={addSparkle}
    >
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="pointer-events-none absolute h-2 w-2 rounded-full"
            style={{ left: sparkle.x, top: sparkle.y, backgroundColor: color }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0, y: -12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
