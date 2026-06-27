'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface TextFlipProps {
  prefix?: string
  words: string[]
  interval?: number
  className?: string
  wordClassName?: string
}

export function TextFlip({
  prefix = 'Coding is',
  words,
  interval = 2600,
  className,
  wordClassName,
}: TextFlipProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (words.length <= 1) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length)
    }, interval)

    return () => window.clearInterval(id)
  }, [interval, words.length])

  return (
    <span
      className={cn(
        'box-content inline-flex items-center gap-4 text-5xl font-semibold leading-none',
        className
      )}
    >
      <span className="text-foreground">{prefix}</span>
      <span className={cn('relative inline-grid w-[10ch] overflow-hidden text-left', wordClassName)}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[index]}
            initial={{ y: '110%', opacity: 0, rotateX: -28 }}
            animate={{ y: '0%', opacity: 1, rotateX: 0 }}
            exit={{ y: '-110%', opacity: 0, rotateX: 28 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="col-start-1 row-start-1 text-left text-[var(--theme-accent-current)] [backface-visibility:hidden]"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
