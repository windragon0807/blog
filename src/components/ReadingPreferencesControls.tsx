'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  getSupportedFontWeights,
  normalizeFontWeight,
  readFontThemePreference,
  type FontThemeName,
  type FontWeight,
} from '@/lib/fontThemes'
import {
  READING_FONT_SIZE_OPTIONS,
  READING_LINE_HEIGHT_OPTIONS,
  applyReadingPreferences,
  persistReadingPreferences,
  readStoredReadingPreferences,
  type ReadingFontSize,
  type ReadingLineHeight,
  type ReadingPreferences,
} from '@/lib/readingPreferences'
import { cn } from '@/lib/utils'
import { SettingsSection } from '@/components/common/SettingsSection'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { CodeThemeSelect } from './CodeThemeSelect'
import { FontThemeSelect } from './FontThemeSelect'

const FONT_WEIGHT_LABELS: Record<FontWeight, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
}

type ReadingSettingsState = {
  fontTheme: FontThemeName
  preferences: ReadingPreferences
}

function readInitialReadingSettings(): ReadingSettingsState {
  const fontTheme = readFontThemePreference()
  return {
    fontTheme,
    preferences: readStoredReadingPreferences(fontTheme),
  }
}

export function ReadingPreferencesControls() {
  const [{ fontTheme, preferences }, setSettings] =
    useState<ReadingSettingsState>(readInitialReadingSettings)
  const supportedWeights = getSupportedFontWeights(fontTheme)
  const effectivePreferences = useMemo(
    () => ({
      ...preferences,
      fontWeight: normalizeFontWeight(fontTheme, preferences.fontWeight),
    }),
    [fontTheme, preferences]
  )

  function handleFontThemeChange(nextTheme: FontThemeName) {
    setSettings((current) => {
      const normalizedWeight = normalizeFontWeight(
        nextTheme,
        current.preferences.fontWeight
      )

      return {
        fontTheme: nextTheme,
        preferences:
          normalizedWeight === current.preferences.fontWeight
            ? current.preferences
            : { ...current.preferences, fontWeight: normalizedWeight },
      }
    })
  }

  useEffect(() => {
    applyReadingPreferences(effectivePreferences)
    persistReadingPreferences(effectivePreferences)
  }, [effectivePreferences])

  function updatePreference<Key extends keyof ReadingPreferences>(
    key: Key,
    value: ReadingPreferences[Key]
  ) {
    setSettings((current) => ({
      ...current,
      preferences: { ...current.preferences, [key]: value },
    }))
  }

  return (
    <>
      <SettingsSection
        label="글꼴"
        description="본문 전체의 글꼴과 읽기 밀도를 조정합니다."
      >
        <div className="grid gap-5">
          <PreferenceField label="글꼴 선택">
            <FontThemeSelect
              className="h-11 w-full"
              onThemeChange={handleFontThemeChange}
            />
          </PreferenceField>

          {supportedWeights.length > 1 ? (
            <PreferenceField label="글꼴 굵기">
              <Select
                value={String(effectivePreferences.fontWeight)}
                onValueChange={(value) =>
                  updatePreference('fontWeight', Number(value) as FontWeight)
                }
              >
                <SelectTrigger aria-label="글꼴 굵기 선택" className="h-11 w-full">
                  <SelectValue>
                    <FontWeightLabel weight={effectivePreferences.fontWeight} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  viewportClassName="grid gap-0.5"
                  data-settings-menu-portal=""
                >
                  {supportedWeights.map((weight) => (
                    <SelectItem
                      key={weight}
                      value={String(weight)}
                      textValue={`${FONT_WEIGHT_LABELS[weight]} ${weight}`}
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                    >
                      <FontWeightLabel weight={weight} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PreferenceField>
          ) : null}

          <PreferenceField label="글자 크기">
            <SegmentedControl<ReadingFontSize>
              label="글자 크기"
              options={READING_FONT_SIZE_OPTIONS}
              value={preferences.fontSize}
              onValueChange={(value) => updatePreference('fontSize', value)}
            />
          </PreferenceField>

          <PreferenceField label="줄 간격">
            <SegmentedControl<ReadingLineHeight>
              label="줄 간격"
              options={READING_LINE_HEIGHT_OPTIONS}
              value={preferences.lineHeight}
              onValueChange={(value) => updatePreference('lineHeight', value)}
            />
          </PreferenceField>
        </div>
      </SettingsSection>

      <SettingsSection
        label="코드 블럭"
        description="코드 블럭의 문법 강조 색상을 선택합니다."
      >
        <CodeThemeSelect className="h-11 w-full" />
      </SettingsSection>

      <SettingsSection
        label="접근성"
        description="전환과 장식 애니메이션의 움직임을 줄입니다."
      >
        <button
          type="button"
          role="switch"
          aria-label="모션 줄이기"
          aria-checked={preferences.reducedMotion}
          onClick={() =>
            updatePreference('reducedMotion', !preferences.reducedMotion)
          }
          className="flex min-h-11 w-full items-center justify-between gap-4 rounded-xl border border-input bg-background/95 px-3 text-left text-sm outline-none transition-colors hover:border-ring/45 focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-zinc-900/80"
        >
          <span>모션 줄이기</span>
          <span
            aria-hidden="true"
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full bg-muted-foreground/35 transition-colors',
              preferences.reducedMotion && 'bg-[var(--theme-accent-current)]'
            )}
          >
            <span
              className={cn(
                'absolute left-0.5 top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform',
                preferences.reducedMotion && 'translate-x-5'
              )}
            />
          </span>
        </button>
      </SettingsSection>
    </>
  )
}

function FontWeightLabel({ weight }: { weight: FontWeight }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span>{`${FONT_WEIGHT_LABELS[weight]} `}</span>
      <Badge
        data-font-weight-badge=""
        variant="secondary"
        className="h-5 min-w-8 justify-center border border-border/60 bg-muted/80 px-1.5 py-0 font-mono text-[10px] font-semibold leading-none tabular-nums text-foreground/75 shadow-none"
      >
        {weight}
      </Badge>
    </span>
  )
}

function PreferenceField({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
