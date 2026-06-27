'use client'

import { useRef, type MouseEvent, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { cn } from '@/lib/utils'

interface CometCardProps {
  rotateDepth?: number
  translateDepth?: number
  className?: string
  cardClassName?: string
  children: ReactNode
}

export function CometCard({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  cardClassName,
  children,
}: CometCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`]
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`]
  )
  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`]
  )
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`]
  )
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.9) 10%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0) 80%)`

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div className={cn('[perspective:1200px] [transform-style:preserve-3d]', className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0)
          y.set(0)
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={{ scale: 1.05, z: 50, transition: { duration: 0.2 } }}
        className={cn(
          'relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_24px_70px_-44px_rgba(24,24,27,0.55)] dark:border-zinc-800 dark:bg-zinc-950',
          cardClassName
        )}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          boxShadow:
            'rgba(0,0,0,0.08) 0px 36px 70px -42px, rgba(0,0,0,0.18) 0px 18px 38px -30px',
        }}
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[inherit] mix-blend-overlay"
          style={{ background: glareBackground, opacity: 0.6 }}
        />
      </motion.div>
    </div>
  )
}
