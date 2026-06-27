'use client'

import { useState, useSyncExternalStore, type MouseEvent } from 'react'
import { Check, Moon, Sparkles, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
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
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>
  }
}

function applyTheme(next: boolean, setTheme: (theme: string) => void) {
  document.documentElement.classList.toggle('dark', next)
  window.localStorage.setItem('theme', next ? 'dark' : 'light')
  setTheme(next ? 'dark' : 'light')
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
  const { resolvedTheme, setTheme } = useTheme()
  const documentChecked = useDocumentDarkTheme(defaultChecked ?? false)
  const [innerChecked, setInnerChecked] = useState(defaultChecked ?? false)
  const providerChecked =
    resolvedTheme === 'dark'
      ? true
      : resolvedTheme === 'light'
        ? false
        : documentChecked
  const active = checked ?? (defaultChecked === undefined ? providerChecked : innerChecked)

  const update = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !active
    const root = document.documentElement
    const rect = event.currentTarget.getBoundingClientRect()
    root.dataset.themeTransition = animationType
    root.style.setProperty(
      '--theme-transition-x',
      `${rect.left + rect.width / 2}px`
    )
    root.style.setProperty(
      '--theme-transition-y',
      `${rect.top + rect.height / 2}px`
    )

    const run = () => applyTheme(next, setTheme)
    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition?.bind(document)
    const clearTransition = () => {
      delete root.dataset.themeTransition
      root.style.removeProperty('--theme-transition-x')
      root.style.removeProperty('--theme-transition-y')
    }

    if (checked === undefined) setInnerChecked(next)
    onChange?.(next)

    if (startViewTransition) {
      const transition = startViewTransition(run)
      void transition.finished.finally(clearTransition)
    } else {
      run()
      window.setTimeout(clearTransition, 720)
    }
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
