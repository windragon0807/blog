'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface ThreeDImageCarouselItem {
  src: string
  alt: string
}

interface ThreeDImageCarouselProps {
  items: ThreeDImageCarouselItem[]
  interval?: number
  className?: string
}

export function ThreeDImageCarousel({
  items,
  interval = 2200,
  className,
}: ThreeDImageCarouselProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length)
    }, interval)

    return () => window.clearInterval(id)
  }, [interval, items.length])

  return (
    <div className={cn('relative h-72 w-full [perspective:900px]', className)}>
      {items.map((item, index) => {
        const offset = (index - active + items.length) % items.length
        const normalized = offset > items.length / 2 ? offset - items.length : offset

        return (
          <div
            key={item.src}
            className="absolute left-1/2 top-1/2 h-52 w-36 overflow-hidden rounded-2xl border border-white/60 bg-zinc-100 shadow-[0_26px_80px_-42px_rgba(24,24,27,0.85)] transition-all duration-500 dark:border-zinc-800"
            style={{
              transform: `translate(-50%, -50%) rotateY(${normalized * -24}deg) translateX(${normalized * 78}px) translateZ(${80 - Math.abs(normalized) * 20}px)`,
              zIndex: 20 - Math.abs(normalized),
              opacity: Math.abs(normalized) > 2 ? 0 : 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
          </div>
        )
      })}
    </div>
  )
}
