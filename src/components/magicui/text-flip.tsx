'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface TextFlipProps {
  words: string[]
  interval?: number
  className?: string
}

export function TextFlip({ words, interval = 1600, className }: TextFlipProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length)
    }, interval)

    return () => window.clearInterval(id)
  }, [interval, words.length])

  return (
    <span className={cn('inline-grid overflow-hidden text-5xl font-semibold', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ rotateX: -90, y: 18, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          exit={{ rotateX: 90, y: -18, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="[backface-visibility:hidden]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
