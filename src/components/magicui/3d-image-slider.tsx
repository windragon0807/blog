'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThreeDImageSliderItem {
  src: string
  alt: string
}

interface ThreeDImageSliderProps {
  items: ThreeDImageSliderItem[]
  className?: string
}

export function ThreeDImageSlider({ items, className }: ThreeDImageSliderProps) {
  const [active, setActive] = useState(0)
  const current = items[active]

  const move = (direction: number) => {
    setActive((index) => (index + direction + items.length) % items.length)
  }

  return (
    <div className={cn('grid w-full max-w-lg gap-4', className)}>
      <div className="relative h-64 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-[0_26px_80px_-48px_rgba(24,24,27,0.75)] [perspective:900px] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="absolute inset-8 rounded-xl transition-transform duration-500 [transform:rotateX(8deg)_rotateY(-12deg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt} className="h-full w-full rounded-xl object-cover" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => move(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm text-zinc-500">
          {active + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
