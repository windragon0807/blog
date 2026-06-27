'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ThreeDImageCarouselItem {
  src: string
  alt: string
  title?: string
}

interface ThreeDImageCarouselProps {
  items?: ThreeDImageCarouselItem[]
  slides?: ThreeDImageCarouselItem[]
  interval?: number
  autoplay?: boolean
  className?: string
}

const defaultItems: ThreeDImageCarouselItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    alt: 'Workspace',
    title: 'Workspace',
  },
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    alt: 'Laptop',
    title: 'Laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    alt: 'Architecture',
    title: 'Architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80',
    alt: 'Desk',
    title: 'Desk',
  },
]

function wrapIndex(value: number, length: number) {
  return ((value % length) + length) % length
}

export function ThreeDImageCarousel({
  items,
  slides,
  interval = 3200,
  autoplay = false,
  className,
}: ThreeDImageCarouselProps) {
  const carouselItems = slides ?? items ?? defaultItems
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!autoplay || carouselItems.length <= 1) return

    const id = window.setInterval(() => {
      setActive((current) => wrapIndex(current + 1, carouselItems.length))
    }, interval)

    return () => window.clearInterval(id)
  }, [autoplay, carouselItems.length, interval])

  if (carouselItems.length === 0) {
    return null
  }

  const go = (direction: number) => {
    setActive((current) => wrapIndex(current + direction, carouselItems.length))
  }

  return (
    <div
      className={cn(
        'relative mx-auto flex h-[380px] w-full max-w-5xl items-center justify-center overflow-hidden [perspective:1200px]',
        className
      )}
    >
      {carouselItems.map((item, index) => {
        const rawOffset = index - active
        const offset =
          Math.abs(rawOffset) > carouselItems.length / 2
            ? rawOffset - Math.sign(rawOffset) * carouselItems.length
            : rawOffset
        const distance = Math.abs(offset)
        const visible = distance <= 2

        return (
          <button
            key={`${item.src}-${index}`}
            type="button"
            className={cn(
              'absolute left-1/2 top-1/2 block h-[270px] w-[430px] max-w-[70vw] overflow-hidden rounded-2xl border border-white/80 bg-zinc-100 shadow-[0_32px_90px_-46px_rgba(15,23,42,0.75)] transition-all duration-500 ease-out [transform-style:preserve-3d]',
              !visible && 'pointer-events-none'
            )}
            style={{
              transform: `translate(-50%, -50%) translateX(${offset * 170}px) translateZ(${
                distance === 0 ? 120 : -120 * distance
              }px) rotateY(${offset * -26}deg) scale(${distance === 0 ? 1 : 0.82})`,
              zIndex: 20 - distance,
              opacity: visible ? (distance === 0 ? 1 : 0.55) : 0,
            }}
            onClick={() => setActive(index)}
            aria-label={`Show ${item.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
          </button>
        )
      })}

      <div className="pointer-events-none absolute inset-x-6 top-1/2 z-30 flex -translate-y-1/2 justify-between">
        <button
          type="button"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-800 shadow-sm backdrop-blur transition hover:scale-105 dark:border-zinc-800 dark:bg-zinc-950/85 dark:text-zinc-100"
          onClick={() => go(-1)}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-800 shadow-sm backdrop-blur transition hover:scale-105 dark:border-zinc-800 dark:bg-zinc-950/85 dark:text-zinc-100"
          onClick={() => go(1)}
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
