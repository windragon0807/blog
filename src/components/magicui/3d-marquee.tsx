'use client'

import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ThreeDMarqueeProps {
  images?: string[]
  items?: ReactNode[]
  className?: string
}

export function ThreeDMarquee({ images, items, className }: ThreeDMarqueeProps) {
  const imageItems = images ?? []
  const chunkSize = Math.ceil(Math.max(imageItems.length, 1) / 4)
  const imageChunks = Array.from({ length: 4 }, (_, columnIndex) => {
    const start = columnIndex * chunkSize
    return imageItems.slice(start, start + chunkSize)
  })

  if (!images && items) {
    return <LegacyThreeDMarquee items={items} className={className} />
  }

  return (
    <div
      className={cn(
        'mx-auto block h-[600px] overflow-hidden rounded-2xl bg-white max-sm:h-[25rem] dark:bg-zinc-950',
        className
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            className="relative left-[8%] top-96 grid size-full origin-top-left grid-cols-4 gap-8 [transform-style:preserve-3d]"
            style={{ transform: 'rotateX(55deg) rotateY(0deg) rotateZ(-45deg)' }}
          >
            {imageChunks.map((chunk, columnIndex) => (
              <motion.div
                key={`marquee-column-${columnIndex}`}
                animate={{ y: columnIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: columnIndex % 2 === 0 ? 10 : 15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="relative flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {chunk.map((image, imageIndex) => (
                  <div key={`${image}-${imageIndex}`} className="relative">
                    <GridLineHorizontal className="-top-4" offset="20px" />
                    <motion.img
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      width={970}
                      height={700}
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="aspect-[970/700] rounded-lg object-cover ring ring-zinc-950/5 hover:shadow-2xl"
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LegacyThreeDMarquee({
  items,
  className,
}: {
  items: ReactNode[]
  className?: string
}) {
  const rows = [items, [...items].reverse(), items]

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[inherit] bg-white [perspective:900px] dark:bg-zinc-950',
        className
      )}
    >
      <div className="absolute inset-0 flex -rotate-x-12 rotate-z-6 flex-col justify-center gap-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              'flex min-w-max gap-4 [--duration:26s] animate-marquee',
              rowIndex % 2 === 1 && '[animation-direction:reverse]'
            )}
          >
            {[...row, ...row].map((item, index) => (
              <div
                key={`${rowIndex}-${index}`}
                className="h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,white_74%)] dark:bg-[radial-gradient(circle_at_center,transparent,#09090b_74%)]" />
    </div>
  )
}

function GridLineHorizontal({
  className,
  offset = '200px',
}: {
  className?: string
  offset?: string
}) {
  return (
    <div
      className={cn(
        'absolute left-[calc(var(--offset)/2*-1)] z-30 h-px w-[calc(100%+var(--offset))] [--background:#ffffff] [--color:rgba(0,0,0,0.2)] [--color-dark:rgba(255,255,255,0.2)] [--fade-stop:90%] [--height:1px] [--width:5px] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]',
        className
      )}
      style={{ '--offset': offset } as CSSProperties}
    />
  )
}

function GridLineVertical({
  className,
  offset = '150px',
}: {
  className?: string
  offset?: string
}) {
  return (
    <div
      className={cn(
        'absolute top-[calc(var(--offset)/2*-1)] z-30 h-[calc(100%+var(--offset))] w-px [--background:#ffffff] [--color:rgba(0,0,0,0.2)] [--color-dark:rgba(255,255,255,0.2)] [--fade-stop:90%] [--height:5px] [--width:1px] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]',
        className
      )}
      style={{ '--offset': offset } as CSSProperties}
    />
  )
}
