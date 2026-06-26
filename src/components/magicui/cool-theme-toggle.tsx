'use client'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface CoolThemeToggleProps {
  defaultDark?: boolean
  onChange?: (dark: boolean) => void
  className?: string
}

export function CoolThemeToggle({
  defaultDark = false,
  onChange,
  className,
}: CoolThemeToggleProps) {
  const [dark, setDark] = useState(defaultDark)

  const update = () => {
    const next = !dark
    setDark(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      onClick={update}
      className={cn(
        'relative h-12 w-24 overflow-hidden rounded-full border border-zinc-200 bg-sky-100 p-1 transition-colors data-[dark=true]:bg-zinc-950 dark:border-zinc-800',
        className
      )}
      data-dark={dark}
      aria-pressed={dark}
    >
      <motion.span
        className="absolute inset-y-1 left-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm"
        animate={{ x: dark ? 48 : 0, rotate: dark ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {dark ? <Moon className="h-4 w-4 text-zinc-700" /> : <Sun className="h-4 w-4" />}
      </motion.span>
      <span className="absolute left-4 top-3 h-1 w-1 rounded-full bg-white/80" />
      <span className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-white/70" />
    </button>
  )
}
