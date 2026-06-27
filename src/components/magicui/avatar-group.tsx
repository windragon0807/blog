'use client'

import { useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  type Transition,
} from 'motion/react'
import { cn } from '@/lib/utils'

export interface AvatarGroupItem {
  src?: string
  name: string
  fallback?: string
  tooltip?: string
}

interface AvatarGroupProps {
  items?: AvatarGroupItem[]
  max?: number
  className?: string
  children?: ReactNode
  invertOverlap?: boolean
  translate?: string | number
  transition?: Transition
  tooltipTransition?: Transition
}

const defaultItems: AvatarGroupItem[] = [
  {
    src: 'https://pbs.twimg.com/profile_images/1948770261848756224/oPwqXMD6_400x400.jpg',
    name: 'Skyleen',
    fallback: 'SK',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
    name: 'Shadcn',
    fallback: 'CN',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg',
    name: 'Adam Wathan',
    fallback: 'AW',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
    name: 'Guillermo Rauch',
    fallback: 'GR',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg',
    name: 'Jhey',
    fallback: 'JH',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1927474594102784000/Al0g-I6o_400x400.jpg',
    name: 'David Haz',
    fallback: 'DH',
  },
]

const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 17,
}

const defaultTooltipTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 35,
}

export function AvatarGroup({
  items = defaultItems,
  max = 6,
  className,
  children,
  invertOverlap = true,
  translate = '-30%',
  transition = defaultTransition,
  tooltipTransition = defaultTooltipTransition,
}: AvatarGroupProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const visible = items.slice(0, max)
  const extra = Math.max(items.length - visible.length, 0)

  if (children) {
    return <div className={cn('flex h-12 items-center -space-x-3', className)}>{children}</div>
  }

  return (
    <div className={cn('flex h-12 items-center -space-x-3', className)}>
      {visible.map((item, index) => (
        <motion.div
          key={item.name}
          className="relative"
          initial="initial"
          whileHover="hover"
          whileTap="hover"
          style={{
            zIndex: invertOverlap ? visible.length - index : index,
          }}
          onHoverStart={() => setHovered(item.name)}
          onHoverEnd={() => setHovered(null)}
        >
          <motion.div
            variants={{
              initial: { y: 0 },
              hover: { y: translate },
            }}
            transition={transition}
            className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border-[3px] border-background bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              item.fallback ?? item.name.slice(0, 2).toUpperCase()
            )}
          </motion.div>
          <AnimatePresence>
            {hovered === item.name ? (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={tooltipTransition}
                className="pointer-events-none absolute bottom-[calc(100%+25px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-sm"
              >
                {item.tooltip ?? item.name}
                <span className="absolute left-1/2 top-full size-3 -translate-x-1/2 -translate-y-px rotate-45 rounded-[2px] bg-primary" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ))}
      {extra > 0 && (
        <motion.div
          initial="initial"
          whileHover="hover"
          whileTap="hover"
          variants={{
            initial: { y: 0 },
            hover: { y: translate },
          }}
          transition={transition}
          className="flex size-12 items-center justify-center rounded-full border-[3px] border-background bg-primary text-sm font-semibold text-primary-foreground"
        >
          +{extra}
        </motion.div>
      )}
    </div>
  )
}
