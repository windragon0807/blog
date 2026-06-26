'use client'

import { useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { cn } from '@/lib/utils'

export interface FloatingDockItem {
  title: string
  icon: ReactNode
  href?: string
  onClick?: () => void
}

interface FloatingDockProps {
  items: FloatingDockItem[]
  className?: string
  desktopClassName?: string
  mobileClassName?: string
}

export function FloatingDock({
  items,
  className,
  desktopClassName,
  mobileClassName,
}: FloatingDockProps) {
  return (
    <div className={className}>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </div>
  )
}

function FloatingDockMobile({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open ? (
          <motion.div
            layoutId="floating-dock-mobile-nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: index * 0.05 } }}
                transition={{ delay: (items.length - 1 - index) * 0.05 }}
              >
                <DockAction
                  item={item}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <span className="h-4 w-4">{item.icon}</span>
                </DockAction>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
        aria-expanded={open}
        aria-label="Toggle dock"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M6 9h12M8 13h8M10 17h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

function FloatingDockDesktop({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-zinc-100 px-4 pb-3 md:flex dark:bg-zinc-900',
        className
      )}
    >
      {items.map((item) => (
        <IconContainer key={item.title} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>
  item: FloatingDockItem
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return value - bounds.x - bounds.width / 2
  })
  const width = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const height = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const iconWidth = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const iconHeight = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <DockAction item={item}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
      >
        <AnimatePresence>
          {hovered ? (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              {item.title}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.div style={{ width: iconWidth, height: iconHeight }} className="flex items-center justify-center">
          {item.icon}
        </motion.div>
      </motion.div>
    </DockAction>
  )
}

function DockAction({
  item,
  children,
  className,
}: {
  item: FloatingDockItem
  children: ReactNode
  className?: string
}) {
  if (item.href) {
    return (
      <a href={item.href} aria-label={item.title} className={className}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={item.onClick} aria-label={item.title} className={className}>
      {children}
    </button>
  )
}
