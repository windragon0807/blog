"use client"

import React, { useMemo } from "react"

import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000
  return value - Math.floor(value)
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const meteorStyles = useMemo<Array<React.CSSProperties>>(() => {
    const viewportWidth =
      typeof window === "undefined" ? 1200 : window.innerWidth

    return [...new Array(number)].map((_, index) => ({
      "--angle": -angle + "deg",
      top: "-5%",
      left: `calc(0% + ${Math.floor(
        seededRandom(index * 3 + 1) * viewportWidth
      )}px)`,
      animationDelay:
        seededRandom(index * 3 + 2) * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(
          seededRandom(index * 3 + 3) * (maxDuration - minDuration) +
            minDuration
        ) +
        "s",
    }))
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rotate-(--angle) rounded-full bg-current text-[var(--theme-accent-current)] shadow-[0_0_0_1px_#ffffff10] [animation-fill-mode:backwards] will-change-transform",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-current to-transparent" />
        </span>
      ))}
    </>
  )
}
