'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface WobbleCardProps {
  children: ReactNode
  containerClassName?: string
  className?: string
}

export function WobbleCard({
  children,
  containerClassName,
  className,
}: WobbleCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - (rect.left + rect.width / 2)) / 20
    const y = (event.clientY - (rect.top + rect.height / 2)) / 20

    setMousePosition({ x, y })
  }

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      className={cn(
        'relative mx-auto w-full overflow-hidden rounded-2xl bg-indigo-800',
        containerClassName
      )}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`
          : 'translate3d(0px, 0px, 0)',
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div
        className="relative h-full overflow-hidden bg-[radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))]"
        style={{
          boxShadow:
            '0 10px 32px rgba(34,42,53,0.12), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(34,42,53,0.05), 0 4px 6px rgba(34,42,53,0.08), 0 24px 108px rgba(47,48,55,0.10)',
        }}
      >
        <motion.div
          className={cn('relative h-full px-5 py-16 sm:px-10', className)}
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
            transition: 'transform 0.1s ease-out',
          }}
        >
          <div className="pointer-events-none absolute inset-0 scale-[1.2] opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:12px_12px] [mask-image:radial-gradient(#fff,transparent_75%)]" />
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}
