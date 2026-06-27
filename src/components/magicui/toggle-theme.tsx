'use client'

import { useState, useSyncExternalStore } from 'react'
import { Check, Moon, Sparkles, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToggleThemeAnimation = 'circle' | 'wipe' | 'blur' | 'fade'

interface ToggleThemeProps {
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
  animationType?: ToggleThemeAnimation
  label?: string
  className?: string
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void
}

function applyTheme(next: boolean) {
  document.documentElement.classList.toggle('dark', next)
  window.localStorage.setItem('theme', next ? 'dark' : 'light')
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

export function ToggleTheme({
  defaultChecked,
  checked,
  onChange,
  animationType = 'circle',
  label,
  className,
}: ToggleThemeProps) {
  const documentChecked = useDocumentDarkTheme(defaultChecked ?? false)
  const [innerChecked, setInnerChecked] = useState(defaultChecked ?? false)
  const active = checked ?? (defaultChecked === undefined ? documentChecked : innerChecked)

  const update = () => {
    const next = !active
    const root = document.documentElement
    root.dataset.themeTransition = animationType

    const run = () => applyTheme(next)
    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition?.bind(document)

    if (checked === undefined) setInnerChecked(next)
    onChange?.(next)

    if (startViewTransition) {
      startViewTransition(run)
    } else {
      run()
    }

    window.setTimeout(() => {
      delete root.dataset.themeTransition
    }, 720)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={update}
      className={cn(
        'group inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100',
        className
      )}
    >
      <span
        className={cn(
          'relative flex h-7 w-12 items-center rounded-full bg-zinc-100 p-1 transition-colors duration-300 dark:bg-zinc-800',
          active && 'bg-[var(--theme-accent-current)]/20 dark:bg-[var(--theme-accent-current)]/30'
        )}
      >
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full bg-white text-zinc-700 shadow-sm transition-transform duration-300 dark:bg-zinc-100',
            active && 'translate-x-5'
          )}
        >
          {active ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </span>
      </span>
      <span>{label ?? animationType}</span>
      {active ? (
        <Check className="h-3.5 w-3.5 text-[var(--theme-accent-current)]" />
      ) : (
        <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
      )}
    </button>
  )
}
