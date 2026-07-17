'use client'

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react'
import { ChevronDownIcon, SquareArrowOutUpRightIcon } from 'lucide-react'
import {
  FONT_THEME_OPTIONS,
  applyFontTheme,
  getFontThemeStack,
  persistFontThemePreference,
  readFontThemePreference,
  type FontThemeName,
} from '@/lib/fontThemes'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type FontThemeSelectProps = {
  className?: string
  onThemeChange?: (theme: FontThemeName) => void
}

export function FontThemeSelect({
  className = '',
  onThemeChange,
}: FontThemeSelectProps) {
  const [open, setOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] =
    useState<FontThemeName>(readFontThemePreference)
  const selectedIndex = Math.max(
    0,
    FONT_THEME_OPTIONS.findIndex((option) => option.value === selectedTheme)
  )
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const typeaheadQueryRef = useRef('')
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedOption = FONT_THEME_OPTIONS.find(
    (option) => option.value === selectedTheme
  )

  useEffect(() => {
    applyFontTheme(selectedTheme)
    persistFontThemePreference(selectedTheme)
  }, [selectedTheme])

  useEffect(() => {
    return () => {
      if (typeaheadTimerRef.current) {
        clearTimeout(typeaheadTimerRef.current)
      }
    }
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setActiveIndex(selectedIndex)
    }
    setOpen(nextOpen)
  }

  function handleThemeChange(theme: FontThemeName) {
    setSelectedTheme(theme)
    onThemeChange?.(theme)
    setOpen(false)
  }

  function handleOpenAutoFocus(event: Event) {
    event.preventDefault()
    optionRefs.current[selectedIndex]?.focus()
  }

  function focusOption(index: number) {
    const normalizedIndex =
      (index + FONT_THEME_OPTIONS.length) % FONT_THEME_OPTIONS.length

    setActiveIndex(normalizedIndex)
    optionRefs.current[normalizedIndex]?.focus()
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    const navigationIndex = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: FONT_THEME_OPTIONS.length - 1,
    }[event.key]

    if (navigationIndex !== undefined) {
      event.preventDefault()
      focusOption(navigationIndex)
      return
    }

    if (
      event.key.length !== 1 ||
      !event.key.trim() ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return
    }

    event.preventDefault()
    const key = event.key.toLocaleLowerCase()
    const combinedQuery = `${typeaheadQueryRef.current}${key}`
    const candidates = FONT_THEME_OPTIONS.map((_, offset) =>
      (index + offset + 1) % FONT_THEME_OPTIONS.length
    )
    const findMatch = (query: string) =>
      candidates.find((candidateIndex) =>
        FONT_THEME_OPTIONS[candidateIndex].label
          .toLocaleLowerCase()
          .startsWith(query)
      )
    const combinedMatchIndex = findMatch(combinedQuery)
    const matchIndex = combinedMatchIndex ?? findMatch(key)

    typeaheadQueryRef.current =
      matchIndex === undefined
        ? ''
        : combinedMatchIndex === undefined
          ? key
          : combinedQuery
    if (typeaheadTimerRef.current) {
      clearTimeout(typeaheadTimerRef.current)
    }
    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadQueryRef.current = ''
    }, 500)

    if (matchIndex !== undefined) {
      focusOption(matchIndex)
    }
  }

  return (
    <Popover modal open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="폰트 선택"
          aria-expanded={open}
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background/95 px-3 text-left text-sm text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors hover:border-ring/45 focus:border-ring/55 focus:ring-2 focus:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900/80',
            className
          )}
        >
          <span
            className="min-w-0 truncate"
            style={{ fontFamily: getFontThemeStack(selectedTheme) }}
          >
            {selectedOption?.label ?? selectedTheme}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0 opacity-55 transition-transform',
              open && 'rotate-180'
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        aria-label="폰트 선택"
        onOpenAutoFocus={handleOpenAutoFocus}
        data-settings-menu-portal=""
        className="z-[90] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-border bg-popover/95 p-0 text-popover-foreground shadow-[0_28px_60px_-28px_rgba(0,0,0,0.35)] backdrop-blur-md"
      >
        <ScrollArea defer={false} data-lenis-prevent="" className="max-h-80">
          <div className="grid gap-0.5 p-1.5">
            {FONT_THEME_OPTIONS.map((theme, index) => {
              const selected = selectedTheme === theme.value

              return (
                <div
                  key={theme.value}
                  data-font-theme-option=""
                  data-selected={selected}
                  className="flex min-h-11 items-stretch rounded-lg transition-colors hover:bg-accent focus-within:bg-accent data-[selected=true]:bg-accent"
                >
                  <button
                    ref={(element) => {
                      optionRefs.current[index] = element
                    }}
                    type="button"
                    aria-pressed={selectedTheme === theme.value}
                    tabIndex={activeIndex === index ? 0 : -1}
                    onFocus={() => setActiveIndex(index)}
                    onKeyDown={(event) => handleOptionKeyDown(event, index)}
                    onClick={() => handleThemeChange(theme.value)}
                    className="min-w-0 flex-1 rounded-l-lg px-2.5 py-2 text-left text-sm text-popover-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                  >
                    <span
                      className="block truncate"
                      style={{ fontFamily: getFontThemeStack(theme.value) }}
                    >
                      {theme.label}
                    </span>
                  </button>

                  <a
                    href={theme.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${theme.label} 다운로드 페이지 열기`}
                    onPointerDown={stopLinkEventPropagation}
                    onClick={stopLinkEventPropagation}
                    onKeyDown={stopLinkKeyDownPropagation}
                    className="flex w-11 shrink-0 items-center justify-center rounded-r-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                  >
                    <SquareArrowOutUpRightIcon
                      aria-hidden="true"
                      className="size-4"
                    />
                  </a>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function stopLinkEventPropagation(event: SyntheticEvent) {
  event.stopPropagation()
}

function stopLinkKeyDownPropagation(event: KeyboardEvent<HTMLAnchorElement>) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.stopPropagation()
  }
}
