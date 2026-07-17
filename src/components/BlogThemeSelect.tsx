'use client'

import { useEffect, useState } from 'react'
import { CheckIcon } from 'lucide-react'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY,
  BLOG_THEME_OPTIONS,
  BLOG_THEME_STORAGE_KEY,
  BLOG_THEME_USER_SET_STORAGE_KEY,
  DEFAULT_BLOG_THEME,
  DEFAULT_CUSTOM_BLOG_THEME_COLOR,
  type BlogThemeName,
  type BlogThemePalette,
  createCustomBlogThemePalette,
  getBlogThemePalette,
  isBlogThemeName,
  isHexColor,
  normalizeHexColor,
} from '@/lib/blogThemes'
import { cn } from '@/lib/utils'

type ThemeSelection = BlogThemeName | 'custom'

type BlogThemeSelectProps = {
  className?: string
}

export function BlogThemeSelect({ className = '' }: BlogThemeSelectProps) {
  const [selectedTheme, setSelectedTheme] =
    useState<ThemeSelection>(readInitialTheme)
  const [customColor, setCustomColor] = useState(readInitialPickerColor)
  const [hexInput, setHexInput] = useState(readInitialPickerColor)
  const [shouldPersist, setShouldPersist] = useState(readPersistFlag)

  useEffect(() => {
    const palette =
      selectedTheme === 'custom'
        ? createCustomBlogThemePalette(customColor)
        : getBlogThemePalette(selectedTheme)
    applyBlogTheme(selectedTheme, palette)

    if (!shouldPersist) return

    try {
      localStorage.setItem(BLOG_THEME_STORAGE_KEY, selectedTheme)
      localStorage.setItem(BLOG_THEME_USER_SET_STORAGE_KEY, 'true')
      if (selectedTheme === 'custom') {
        localStorage.setItem(BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY, customColor)
      } else {
        localStorage.removeItem(BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY)
      }
    } catch {
      // Ignore storage failures in private mode.
    }
  }, [customColor, selectedTheme, shouldPersist])

  function chooseCustomColor(value: string) {
    const normalizedColor = normalizeHexColor(value)
    setShouldPersist(true)
    setSelectedTheme('custom')
    setCustomColor(normalizedColor)
    setHexInput(normalizedColor)
  }

  function commitHexInput() {
    const normalizedColor = normalizeHexColor(hexInput)
    if (isHexColor(normalizedColor)) {
      chooseCustomColor(normalizedColor)
    } else {
      setHexInput(customColor)
    }
  }

  function choosePresetTheme(theme: BlogThemeName) {
    const preset = BLOG_THEME_OPTIONS.find((option) => option.value === theme)
    setShouldPersist(true)
    setSelectedTheme(theme)

    if (preset && isHexColor(preset.accent)) {
      const presetColor = normalizeHexColor(preset.accent)
      setCustomColor(presetColor)
      setHexInput(presetColor)
    }
  }

  return (
    <div className={cn('grid gap-5', className)}>
      <div className="grid gap-2">
        <p className="text-xs font-medium text-foreground">직접 색상</p>
        <div
          data-color-picker-control=""
          data-selected={selectedTheme === 'custom' ? '' : undefined}
          className="group grid grid-cols-[minmax(0,1fr)_7.5rem] overflow-hidden rounded-xl border border-input bg-background/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_24px_-22px_rgba(15,23,42,0.58)] transition-[border-color,background-color,box-shadow] hover:border-ring/45 hover:bg-background/86 focus-within:border-ring/55 focus-within:ring-2 focus-within:ring-ring/35 data-[selected]:border-ring/50 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_0_0_2px_color-mix(in_srgb,var(--theme-accent-current)_16%,transparent)] dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_-24px_rgba(0,0,0,0.78)]"
        >
          <ColorPicker value={customColor} onValueChange={chooseCustomColor}>
            <button
              type="button"
              aria-label="색상 팔레트 열기"
              className="relative flex min-h-12 w-full items-center gap-3 px-3 text-left outline-none"
            >
              <span
                aria-hidden="true"
                className="size-8 shrink-0 rounded-lg border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.62),0_3px_8px_-5px_rgba(15,23,42,0.72)]"
                style={{ backgroundColor: customColor }}
              />
              <span aria-hidden="true" className="grid min-w-0 leading-tight">
                <span className="text-xs font-semibold text-foreground">팔레트 열기</span>
                <span className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  모든 색상에서 선택
                </span>
              </span>
            </button>
          </ColorPicker>
          <label className="flex min-w-0 items-center border-l border-border/70">
            <span className="sr-only">HEX 색상 값</span>
            <input
              type="text"
              aria-label="HEX 색상 값"
              value={hexInput}
              inputMode="text"
              maxLength={7}
              spellCheck={false}
              onChange={(event) => {
                const value = event.target.value.toUpperCase()
                if (/^#?[0-9A-F]{0,6}$/.test(value)) setHexInput(value)
              }}
              onBlur={commitHexInput}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitHexInput()
                  event.currentTarget.blur()
                }
              }}
              className="h-12 w-full bg-transparent px-3 font-mono text-sm uppercase text-foreground outline-none"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs font-medium text-foreground">추천 색상</p>
        <div role="group" aria-label="빠른 색상 선택" className="grid grid-cols-5 gap-2">
          {BLOG_THEME_OPTIONS.map((theme) => {
            const isSelected = selectedTheme === theme.value

            return (
              <button
                key={theme.value}
                type="button"
                title={theme.label}
                aria-label={`${theme.label} 색상`}
                aria-pressed={isSelected}
                onClick={() => choosePresetTheme(theme.value)}
                className="relative flex size-11 items-center justify-center justify-self-center rounded-xl border border-border/70 bg-background/55 outline-none transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-ring/45 focus-visible:ring-2 focus-visible:ring-ring/45 aria-pressed:border-ring/55 aria-pressed:shadow-[0_0_0_2px_color-mix(in_srgb,var(--theme-accent-current)_24%,transparent)]"
              >
                <span
                  aria-hidden="true"
                  className="size-6 rounded-full border border-black/8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)]"
                  style={{ backgroundColor: theme.accent }}
                />
                {isSelected ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="absolute size-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.65)]"
                    strokeWidth={3}
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function applyBlogTheme(theme: ThemeSelection, palette: BlogThemePalette) {
  const root = document.documentElement

  root.setAttribute('data-blog-theme', theme)
  root.style.setProperty('--theme-accent', palette.accent)
  root.style.setProperty('--theme-accent-dark', palette.accentDark)
  root.style.setProperty('--theme-selection-bg', palette.selection)
  root.style.setProperty('--theme-progress-start', palette.progressStart)
  root.style.setProperty('--theme-progress-mid', palette.progressMid)
  root.style.setProperty('--theme-progress-end', palette.progressEnd)
  root.style.setProperty('--theme-progress-glow', palette.progressGlow)
  root.style.setProperty('--theme-progress-dark-start', palette.progressDarkStart)
  root.style.setProperty('--theme-progress-dark-mid', palette.progressDarkMid)
  root.style.setProperty('--theme-progress-dark-end', palette.progressDarkEnd)
  root.style.setProperty('--theme-progress-dark-glow', palette.progressDarkGlow)
  root.style.setProperty('--theme-inline-code-bg', palette.inlineCodeBg)
  root.style.setProperty('--theme-inline-code-border', palette.inlineCodeBorder)
  root.style.setProperty('--theme-inline-code-text', palette.inlineCodeText)
  root.style.setProperty('--theme-inline-code-dark-bg', palette.inlineCodeDarkBg)
  root.style.setProperty('--theme-inline-code-dark-border', palette.inlineCodeDarkBorder)
  root.style.setProperty('--theme-inline-code-dark-text', palette.inlineCodeDarkText)
}

function readInitialTheme(): ThemeSelection {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_BLOG_THEME
  }

  const appliedTheme = document.documentElement.getAttribute('data-blog-theme')
  if (appliedTheme === 'custom' || isBlogThemeName(appliedTheme)) {
    return appliedTheme
  }

  try {
    const storedTheme = localStorage.getItem(BLOG_THEME_STORAGE_KEY)
    const isUserSetTheme =
      localStorage.getItem(BLOG_THEME_USER_SET_STORAGE_KEY) === 'true'
    const hasCustomColor = isHexColor(
      localStorage.getItem(BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY)
    )
    if (isUserSetTheme && storedTheme === 'custom' && hasCustomColor) {
      return 'custom'
    }

    const isLegacyExplicitTheme =
      isBlogThemeName(storedTheme) && storedTheme !== 'moss'
    if ((isUserSetTheme || isLegacyExplicitTheme) && isBlogThemeName(storedTheme)) {
      return storedTheme
    }
  } catch {
    // Storage can be unavailable.
  }

  return DEFAULT_BLOG_THEME
}

function readInitialPickerColor(): string {
  const initialTheme = readInitialTheme()

  if (initialTheme !== 'custom') {
    return normalizeHexColor(getBlogThemePalette(initialTheme).accent)
  }

  if (typeof window === 'undefined') return DEFAULT_CUSTOM_BLOG_THEME_COLOR

  try {
    const storedColor = localStorage.getItem(BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY)
    return isHexColor(storedColor)
      ? normalizeHexColor(storedColor)
      : DEFAULT_CUSTOM_BLOG_THEME_COLOR
  } catch {
    return DEFAULT_CUSTOM_BLOG_THEME_COLOR
  }
}

function readPersistFlag(): boolean {
  if (typeof window === 'undefined') return false

  try {
    if (localStorage.getItem(BLOG_THEME_USER_SET_STORAGE_KEY) === 'true') {
      return true
    }
    const storedTheme = localStorage.getItem(BLOG_THEME_STORAGE_KEY)
    return isBlogThemeName(storedTheme) && storedTheme !== 'moss'
  } catch {
    return false
  }
}
