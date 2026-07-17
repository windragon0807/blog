'use client'

import { useEffect, useState } from 'react'
import {
  CODE_THEME_OPTIONS,
  CODE_THEME_PREVIEW_LINES,
  CODE_THEME_PREVIEW_PALETTES,
  CODE_THEME_STORAGE_KEY,
  DEFAULT_DARK_CODE_THEME,
  DEFAULT_LIGHT_CODE_THEME,
  type CodeThemeName,
  isCodeThemeName,
} from '@/lib/codeThemes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type CodeThemeSelectProps = {
  className?: string
}

export function CodeThemeSelect({ className = '' }: CodeThemeSelectProps) {
  const [selectedTheme, setSelectedTheme] = useState<CodeThemeName>(readInitialTheme)

  useEffect(() => {
    applyCodeTheme(selectedTheme)
    try {
      localStorage.setItem(CODE_THEME_STORAGE_KEY, selectedTheme)
    } catch {
      // Ignore storage failures in private mode.
    }
  }, [selectedTheme])

  const previewPalette = CODE_THEME_PREVIEW_PALETTES[selectedTheme]

  return (
    <div className="grid gap-3">
      <div
        aria-label="코드 테마 미리보기"
        className="overflow-hidden rounded-xl border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        style={{
          backgroundColor: previewPalette.background,
          color: previewPalette.foreground,
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-[10px] opacity-65">
          <span>theme.ts</span>
          <span>TypeScript</span>
        </div>
        <pre
          tabIndex={0}
          aria-label="테마 코드 예시"
          className="overflow-x-auto px-3 py-3 font-mono text-[10px] leading-[1.15rem] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
        >
          <code>
            {CODE_THEME_PREVIEW_LINES.map((line, lineIndex) => (
              <span key={lineIndex}>
                {line.map((segment) => (
                  <span
                    key={segment.id}
                    data-code-preview-token={segment.index}
                    data-code-preview-segment={segment.id}
                    style={{
                      color:
                        previewPalette.colors[
                          previewPalette.tokenColorIndexes[segment.index]
                        ],
                    }}
                  >
                    {segment.content}
                  </span>
                ))}
                {lineIndex < CODE_THEME_PREVIEW_LINES.length - 1 ? '\n' : null}
              </span>
            ))}
          </code>
        </pre>
      </div>

      <Select
        value={selectedTheme}
        onValueChange={(value) => setSelectedTheme(value as CodeThemeName)}
      >
        <SelectTrigger
          aria-label="코드 테마 선택"
          className={cn('h-10 w-full text-sm', className)}
        >
          <SelectValue placeholder="코드 테마를 선택하세요" />
        </SelectTrigger>
        <SelectContent position="popper" data-settings-menu-portal="">
          {CODE_THEME_OPTIONS.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function applyCodeTheme(theme: CodeThemeName) {
  document.documentElement.setAttribute('data-code-theme', theme)
}

function readInitialTheme(): CodeThemeName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LIGHT_CODE_THEME
  }

  const appliedTheme = document.documentElement.getAttribute('data-code-theme')
  if (isCodeThemeName(appliedTheme)) {
    return appliedTheme
  }

  try {
    const storedTheme = localStorage.getItem(CODE_THEME_STORAGE_KEY)
    if (isCodeThemeName(storedTheme)) {
      return storedTheme
    }
  } catch {
    // Storage can be unavailable in private mode.
  }

  return getDefaultCodeTheme()
}

function getDefaultCodeTheme(): CodeThemeName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LIGHT_CODE_THEME
  }

  const prefersDark =
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? DEFAULT_DARK_CODE_THEME : DEFAULT_LIGHT_CODE_THEME
}
