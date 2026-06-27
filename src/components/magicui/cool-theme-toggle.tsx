'use client'

import { useState, useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface CoolThemeToggleProps {
  defaultDark?: boolean
  onChange?: (dark: boolean) => void
  className?: string
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void
}

function applyDocumentTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  window.localStorage.setItem('theme', dark ? 'dark' : 'light')
}

function subscribeToThemeChanges(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => observer.disconnect()
}

function useDocumentDarkTheme(serverSnapshot = false) {
  return useSyncExternalStore(
    subscribeToThemeChanges,
    () => document.documentElement.classList.contains('dark'),
    () => serverSnapshot
  )
}

export function CoolThemeToggle({
  defaultDark,
  onChange,
  className,
}: CoolThemeToggleProps) {
  const documentDark = useDocumentDarkTheme(defaultDark ?? false)
  const [localDark, setLocalDark] = useState(defaultDark ?? false)
  const dark = defaultDark === undefined ? documentDark : localDark

  const update = () => {
    const next = !dark
    const run = () => applyDocumentTheme(next)

    setLocalDark(next)
    onChange?.(next)

    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition?.bind(document)

    if (startViewTransition) {
      startViewTransition(run)
    } else {
      run()
    }
  }

  return (
    <button
      type="button"
      onClick={update}
      className={cn(
        'relative h-14 w-28 overflow-hidden rounded-full border border-zinc-200 bg-sky-200 p-1.5 shadow-inner transition-colors duration-500 data-[dark=true]:border-zinc-700 data-[dark=true]:bg-[#101827]',
        className
      )}
      data-dark={dark}
      aria-pressed={dark}
      aria-label="Toggle theme"
    >
      <motion.span
        aria-hidden="true"
        className="absolute left-5 top-7 h-2 w-7 rounded-full bg-white/80 shadow-[18px_3px_0_-2px_rgba(255,255,255,0.78),-10px_4px_0_-3px_rgba(255,255,255,0.72)]"
        animate={{ opacity: dark ? 0 : 1, y: dark ? 10 : 0 }}
        transition={{ duration: 0.35 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        animate={{ opacity: dark ? 1 : 0 }}
      >
        {[16, 34, 58, 78, 96].map((left, index) => (
          <span
            key={left}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left,
              top: index % 2 === 0 ? 14 : 30,
              opacity: 0.55 + index * 0.08,
            }}
          />
        ))}
      </motion.span>
      <motion.span
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-500 shadow-[0_8px_18px_-10px_rgba(15,23,42,0.6)]"
        animate={{ x: dark ? 56 : 0, rotate: dark ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 330, damping: 26 }}
      >
        {dark ? (
          <Moon className="h-5 w-5 text-zinc-800" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.span>
    </button>
  )
}
