'use client'

import { memo } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface BackgroundBoxesProps {
  rows?: number
  columns?: number
  colors?: string[]
  className?: string
  boxClassName?: string
}

const defaultColors = [
  '#93c5fd',
  '#f9a8d4',
  '#86efac',
  '#fde047',
  '#fca5a5',
  '#d8b4fe',
  '#a5b4fc',
  '#c4b5fd',
]

function BackgroundBoxesCore({
  rows = 60,
  columns = 40,
  colors = defaultColors,
  className,
  boxClassName,
}: BackgroundBoxesProps) {
  const rowItems = Array.from({ length: rows })
  const columnItems = Array.from({ length: columns })

  return (
    <div
      className={cn(
        'absolute -top-1/4 left-1/4 z-0 flex h-full w-full p-4',
        className
      )}
      style={{
        transform:
          'translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)',
      }}
    >
      {rowItems.map((_, rowIndex) => (
        <motion.div
          key={`row-${rowIndex}`}
          className="relative h-8 w-16 border-l border-slate-700/80"
        >
          {columnItems.map((__, columnIndex) => (
            <motion.div
              key={`column-${rowIndex}-${columnIndex}`}
              whileHover={{
                backgroundColor:
                  colors[(rowIndex * 17 + columnIndex * 31) % colors.length] ??
                  defaultColors[0],
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 2 } }}
              className={cn(
                'relative h-8 w-16 border-r border-t border-slate-700/80',
                boxClassName
              )}
            >
              {rowIndex % 2 === 0 && columnIndex % 2 === 0 ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="pointer-events-none absolute -left-[22px] -top-[14px] h-6 w-10 stroke-[1px] text-slate-700/90"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export const Boxes = memo(BackgroundBoxesCore)

export function BackgroundBoxes(props: BackgroundBoxesProps) {
  return <Boxes {...props} />
}
