'use client'

import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { MoonIcon, SunIcon } from '@/components/icons'
import { IconControlButton } from './IconControlButton'

type ViewTransition = {
  ready: Promise<void>
  finished: Promise<void>
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition
}

const themeModeAnimationType = 'fade-in-out'
const themeModeTransitionDuration = 400

function createViewTransitionResetStyle() {
  const styleElement = document.createElement('style')
  styleElement.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
  `
  document.head.appendChild(styleElement)
  return styleElement
}

async function runThemeModeTransition(commitTheme: () => void) {
  const startViewTransition = (document as ViewTransitionDocument)
    .startViewTransition?.bind(document)
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (!startViewTransition || prefersReducedMotion) {
    commitTheme()
    return
  }

  const transitionStyle = createViewTransitionResetStyle()
  const transition = startViewTransition(() => {
    flushSync(commitTheme)
  })

  try {
    await transition.ready
  } catch {
    transitionStyle.remove()
    return
  }

  if (themeModeAnimationType === 'fade-in-out') {
    document.documentElement.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: themeModeTransitionDuration * 0.5,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }

  void transition.finished.finally(() => {
    transitionStyle.remove()
  })
}

export function ThemeModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const handleToggleTheme = useCallback(() => {
    if (!mounted) return

    const nextIsDark = !isDark
    const nextTheme = nextIsDark ? 'dark' : 'light'

    void runThemeModeTransition(() => {
      document.documentElement.classList.toggle('dark', nextIsDark)
      window.localStorage.setItem('theme', nextTheme)
      setTheme(nextTheme)
    })
  }, [isDark, mounted, setTheme])

  return (
    <IconControlButton
      srLabel={
        mounted ? (isDark ? '라이트 모드로 전환' : '다크 모드로 전환') : '테마 전환'
      }
      aria-pressed={mounted ? isDark : undefined}
      onClick={handleToggleTheme}
      className="relative overflow-hidden"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isDark
            ? 'opacity-100 bg-[radial-gradient(circle_at_30%_28%,rgba(250,250,255,0.18),transparent_38%),linear-gradient(180deg,rgba(59,130,246,0.12),rgba(15,23,42,0.08))]'
            : 'opacity-100 bg-[radial-gradient(circle_at_30%_28%,rgba(250,204,21,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(250,204,21,0.06))]'
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,rotate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,rotate,scale] ${
          isDark ? 'rotate-45 scale-90 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      >
        <SunIcon className="h-[18px] w-[18px]" />
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,rotate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,rotate,scale] ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-45 scale-90 opacity-0'
        }`}
      >
        <MoonIcon className="h-[18px] w-[18px]" />
      </span>
    </IconControlButton>
  )
}
