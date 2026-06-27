'use client'

import React from 'react'
import { motion, type MotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

const animationProps: MotionProps = {
  initial: { '--x': '100%' },
  animate: { '--x': '-100%' },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
  },
}

interface ShinyButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode
  className?: string
  shineColor?: string
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, shineColor = 'currentColor', style, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border px-6 py-2 text-center font-medium backdrop-blur-xl dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/10%_0%,transparent_60%)]',
        className
      )}
      style={style}
      {...animationProps}
      {...props}
    >
      <span
        className="relative z-20 inline-flex size-full items-center justify-center text-center text-sm tracking-wide text-current uppercase dark:font-light"
        style={{
          maskImage:
            'linear-gradient(-75deg,#000 calc(var(--x) + 20%),transparent calc(var(--x) + 30%),#000 calc(var(--x) + 100%))',
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
          WebkitMask:
            'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
          backgroundImage:
            `linear-gradient(-75deg,transparent calc(var(--x)+20%),${shineColor} calc(var(--x)+25%),transparent calc(var(--x)+100%))`,
          opacity: 0.68,
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] p-px"
      />
    </motion.button>
  )
})

ShinyButton.displayName = 'ShinyButton'
