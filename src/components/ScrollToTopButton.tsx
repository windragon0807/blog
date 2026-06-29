'use client'

import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLenisInstance } from '@/lib/lenis'

export function ScrollToTopButton() {
  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = getLenisInstance()

    if (lenis && !reduceMotion) {
      lenis.scrollTo(0, { duration: 0.56 })
      return
    }

    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <Button
      type="button"
      variant="iconGlass"
      size="iconLg"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className="scroll-to-top-button z-[60] inline-flex rounded-full bg-white/95 text-zinc-600 opacity-100 shadow-lg hover:bg-zinc-100 dark:bg-zinc-900/95 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <ArrowUp className="h-[18px] w-[18px]" aria-hidden="true" />
    </Button>
  )
}
