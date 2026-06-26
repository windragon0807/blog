'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@/components/icons'
import { IconControlButton } from './IconControlButton'

export function ThemeModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <IconControlButton
      srLabel={
        mounted ? (isDark ? '라이트 모드로 전환' : '다크 모드로 전환') : '테마 전환'
      }
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => {
        if (!mounted) return
        setTheme(isDark ? 'light' : 'dark')
      }}
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
        className={`absolute inset-0 grid place-items-center transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate,scale] ${
          isDark
            ? '-translate-x-7 scale-95 opacity-0'
            : 'translate-x-0 scale-100 opacity-100'
        }`}
      >
        <SunIcon className="h-[18px] w-[18px]" />
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate,scale] ${
          isDark
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-x-7 scale-95 opacity-0'
        }`}
      >
        <MoonIcon className="h-[18px] w-[18px]" />
      </span>
    </IconControlButton>
  )
}
