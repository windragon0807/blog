'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface KineticCenterBuildProps {
  text: string
  className?: string
}

export function KineticCenterBuild({ text, className }: KineticCenterBuildProps) {
  const letters = text.split('')

  return (
    <span className={cn('inline-flex overflow-hidden text-5xl font-semibold', className)}>
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          initial={{ x: (index - letters.length / 2) * 18, opacity: 0, filter: 'blur(6px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: index * 0.025, type: 'spring', stiffness: 200, damping: 18 }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00a0' : letter}
        </motion.span>
      ))}
    </span>
  )
}
