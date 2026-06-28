'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ThreeDImageCarouselItem {
  id?: number
  src: string
  alt?: string
  href?: string
  title?: string
}

interface ThreeDImageCarouselProps {
  items?: ThreeDImageCarouselItem[]
  slides?: ThreeDImageCarouselItem[]
  itemCount?: 3 | 5
  interval?: number
  delay?: number
  autoplay?: boolean
  pauseOnHover?: boolean
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

const embeddedCss = `
/* --- Cascade Slider Styles --- */

.cascade-slider_container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    z-index: 20;
    user-select: none;
    -webkit-user-select: none;
    touch-action: pan-y;
}

.cascade-slider_slides {
    position: relative;
    height: 100%;
}

.cascade-slider_item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(0.3);
    transition: all 1s ease;
    opacity: 0;
    z-index: 1;
    cursor: grab;
}
.cascade-slider_item.now {
    cursor: default;
}
.cascade-slider_item:active {
    cursor: grabbing;
}

/* Slide Positioning Classes (Core 3D Logic - MUST REMAIN IN CSS) */
.cascade-slider_item.next {
    left: 50%;
    transform: translateY(-50%) translateX(-120%) scale(0.6);
    opacity: 1;
    z-index: 4;
}
.cascade-slider_item.prev {
    left: 50%;
    transform: translateY(-50%) translateX(20%) scale(0.6);
    opacity: 1;
    z-index: 4;
}
.cascade-slider_item.now {
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(1);
    opacity: 1;
    z-index: 5;
}

/* Arrows - Structural CSS remains for positioning/size */
.cascade-slider_arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 6;
    transform: translate(0, -50%);
    width: 40px;
    height: 40px;
    transition: all 0.3s ease;
}

/* Arrow Positioning Fix (Responsive CSS) */
@media screen and (max-width: 575px) {
    .cascade-slider_arrow-left {
        left: 5px;
    }
    .cascade-slider_arrow-right {
        right: 5px;
    }
}
@media screen and (min-width: 576px) {
    .cascade-slider_arrow-left { left: -4%; }
    .cascade-slider_arrow-right { right: -4%; }
}

/* Images */
.cascade-slider_slides img {
    max-width: 150px;
    height: auto;
    border-radius: 35px;
    display: block;
    transition: filter 1s ease;
}
.cascade-slider_item:not(.now) img {
    filter: grayscale(0.95);
}

/* --- Media Queries (Minimized to only include structural layout changes) --- */
@media screen and (min-width: 414px) {
    .cascade-slider_container { height: 40vh; }
    .cascade-slider_slides img { max-width: 200px; }
}
@media screen and (min-width: 576px) {
    .cascade-slider_container { height: 60vh; }
    .cascade-slider_slides img { max-width: 270px; }
}
@media screen and (min-width: 768px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-125%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(25%) scale(0.6); }
    .cascade-slider_slides img { max-width: 250px; }
}
@media screen and (min-width: 991px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-115%) scale(0.55); z-index: 4; }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(15%) scale(0.55); z-index: 4; }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-150%) scale(0.37); z-index: 1; }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(50%) scale(0.37); z-index: 2; }
    .cascade-slider_slides img { max-width: 300px; }
    .cascade-slider_container { height: 37vh; }
}
@media screen and (min-width: 1100px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-130%) scale(0.55); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(30%) scale(0.55); }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-180%) scale(0.37); }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(80%) scale(0.37); }
    .cascade-slider_slides img { max-width: 350px; }
}
`

function getSlideClasses(
  index: number,
  activeIndex: number,
  total: number,
  visibleCount: 3 | 5
) {
  const diff = index - activeIndex
  if (diff === 0) return 'now'
  if (diff === 1 || diff === -total + 1) return 'next'
  if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) {
    return 'next2'
  }
  if (diff === -1 || diff === total - 1) return 'prev'
  if (visibleCount === 5 && (diff === -2 || diff === total - 2)) {
    return 'prev2'
  }
  return ''
}

export function ThreeDImageCarousel({
  items,
  slides,
  itemCount = 5,
  autoplay = false,
  interval,
  delay,
  pauseOnHover = true,
  className = '',
}: ThreeDImageCarouselProps) {
  const carouselSlides = (slides ?? items ?? defaultItems).map((slide, index) => ({
    ...slide,
    id: slide.id ?? index,
    href: slide.href ?? '#',
  }))
  const [activeIndex, setActiveIndex] = useState(0)
  const autoplayIntervalRef = useRef<number | null>(null)
  const total = carouselSlides.length
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const swipeThreshold = 50
  const autoplayDelay = delay ?? (interval ? interval / 1000 : 3)

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      setActiveIndex((current) => {
        if (direction === 'next') {
          return (current + 1) % total
        }
        return (current - 1 + total) % total
      })
    },
    [total]
  )

  const startAutoplay = useCallback(() => {
    if (autoplay && total > 1) {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
      autoplayIntervalRef.current = window.setInterval(() => {
        navigate('next')
      }, autoplayDelay * 1000)
    }
  }, [autoplay, autoplayDelay, navigate, total])

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => {
      stopAutoplay()
    }
  }, [startAutoplay, stopAutoplay])

  if (total === 0) {
    return null
  }

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      stopAutoplay()
    }
  }

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    stopAutoplay()
  }

  const handleEnd = (clientX: number) => {
    if (!isDragging) return

    const distance = clientX - startX

    if (Math.abs(distance) > swipeThreshold) {
      if (distance < 0) {
        navigate('next')
      } else {
        navigate('prev')
      }
    }

    setIsDragging(false)
    setStartX(0)
  }

  const handleExit = (event: MouseEvent<HTMLDivElement>) => {
    if (autoplay && pauseOnHover) {
      startAutoplay()
    }

    if (isDragging) {
      handleEnd(event.clientX)
    }
  }

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    handleStart(event.clientX)
  }

  const onMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    handleEnd(event.clientX)
    startAutoplay()
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    handleStart(event.touches[0].clientX)
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    handleEnd(event.changedTouches[0].clientX)
    startAutoplay()
  }

  return (
    <div
      data-3d-image-carousel=""
      className="relative flex h-[30rem] min-h-[30rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-transparent"
    >
      <style dangerouslySetInnerHTML={{ __html: embeddedCss }} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(24, 24, 27, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div
        className={cn(
          'cascade-slider_container min-w-[600px] bg-transparent',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleExit}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cascade-slider_slides">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`cascade-slider_item ${getSlideClasses(
                index,
                activeIndex,
                total,
                itemCount
              )}`}
              data-slide-number={index}
            >
              <a href={slide.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt ?? `Slide ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=Slide%20${
                      index + 1
                    }`
                  }}
                />
              </a>
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="cascade-slider_arrow cascade-slider_arrow-left rounded-full border border-white/10 bg-white/[0.08] p-2 text-white/80 shadow-[0_16px_48px_-30px_rgba(255,255,255,0.52)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              onClick={(event) => {
                event.stopPropagation()
                navigate('prev')
              }}
              data-action="prev"
            >
              <ArrowLeftCircle size={30} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="cascade-slider_arrow cascade-slider_arrow-right rounded-full border border-white/10 bg-white/[0.08] p-2 text-white/80 shadow-[0_16px_48px_-30px_rgba(255,255,255,0.52)] backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              onClick={(event) => {
                event.stopPropagation()
                navigate('next')
              }}
              data-action="next"
            >
              <ArrowRightCircle size={30} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ThreeDImageCarousel
