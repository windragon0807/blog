import {
  ALL_FONT_WEIGHTS,
  DEFAULT_FONT_THEME,
  normalizeFontWeight,
  type FontThemeName,
  type FontWeight,
} from '@/lib/fontThemes'

export const READING_FONT_SIZE_OPTIONS = [
  { value: 'small', label: '작게', cssValue: '0.94rem' },
  { value: 'default', label: '기본', cssValue: '1rem' },
  { value: 'large', label: '크게', cssValue: '1.08rem' },
  { value: 'extra-large', label: '매우 크게', cssValue: '1.16rem' },
] as const

export const READING_LINE_HEIGHT_OPTIONS = [
  { value: 'compact', label: '좁게', cssValue: '1.6' },
  { value: 'comfortable', label: '기본', cssValue: '1.75' },
  { value: 'spacious', label: '넓게', cssValue: '1.9' },
] as const

export type ReadingFontSize = (typeof READING_FONT_SIZE_OPTIONS)[number]['value']
export type ReadingLineHeight = (typeof READING_LINE_HEIGHT_OPTIONS)[number]['value']

export type ReadingPreferences = {
  fontWeight: FontWeight
  fontSize: ReadingFontSize
  lineHeight: ReadingLineHeight
  reducedMotion: boolean
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  fontWeight: 400,
  fontSize: 'default',
  lineHeight: 'comfortable',
  reducedMotion: false,
}

export const READING_PREFERENCE_STORAGE_KEYS = {
  fontWeight: 'reading-font-weight',
  fontSize: 'reading-font-size',
  lineHeight: 'reading-line-height',
  reducedMotion: 'reading-reduced-motion',
} as const

export const READING_FONT_SIZE_CSS = Object.fromEntries(
  READING_FONT_SIZE_OPTIONS.map(({ value, cssValue }) => [value, cssValue])
) as Record<ReadingFontSize, string>

export const READING_LINE_HEIGHT_CSS = Object.fromEntries(
  READING_LINE_HEIGHT_OPTIONS.map(({ value, cssValue }) => [value, cssValue])
) as Record<ReadingLineHeight, string>

const FONT_SIZE_SET = new Set<string>(
  READING_FONT_SIZE_OPTIONS.map(({ value }) => value)
)
const LINE_HEIGHT_SET = new Set<string>(
  READING_LINE_HEIGHT_OPTIONS.map(({ value }) => value)
)

export function readStoredReadingPreferences(
  fontTheme: FontThemeName = DEFAULT_FONT_THEME
): ReadingPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_READING_PREFERENCES
  }

  try {
    const storedWeightValue = localStorage.getItem(
      READING_PREFERENCE_STORAGE_KEYS.fontWeight
    )
    const parsedWeight = Number(storedWeightValue)
    const storedWeight =
      storedWeightValue &&
      ALL_FONT_WEIGHTS.includes(parsedWeight as FontWeight)
        ? parsedWeight
        : DEFAULT_READING_PREFERENCES.fontWeight
    const storedSize = localStorage.getItem(
      READING_PREFERENCE_STORAGE_KEYS.fontSize
    )
    const storedLineHeight = localStorage.getItem(
      READING_PREFERENCE_STORAGE_KEYS.lineHeight
    )

    return {
      fontWeight: normalizeFontWeight(fontTheme, storedWeight),
      fontSize: FONT_SIZE_SET.has(storedSize ?? '')
        ? (storedSize as ReadingFontSize)
        : DEFAULT_READING_PREFERENCES.fontSize,
      lineHeight: LINE_HEIGHT_SET.has(storedLineHeight ?? '')
        ? (storedLineHeight as ReadingLineHeight)
        : DEFAULT_READING_PREFERENCES.lineHeight,
      reducedMotion:
        localStorage.getItem(READING_PREFERENCE_STORAGE_KEYS.reducedMotion) ===
        'true',
    }
  } catch {
    return DEFAULT_READING_PREFERENCES
  }
}

export function applyReadingPreferences(preferences: ReadingPreferences) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.setAttribute('data-reading-font-weight', String(preferences.fontWeight))
  root.setAttribute('data-reading-font-size', preferences.fontSize)
  root.setAttribute('data-reading-line-height', preferences.lineHeight)
  root.style.setProperty('--reading-font-weight', String(preferences.fontWeight))
  root.style.setProperty(
    '--reading-font-size',
    READING_FONT_SIZE_CSS[preferences.fontSize]
  )
  root.style.setProperty(
    '--reading-line-height',
    READING_LINE_HEIGHT_CSS[preferences.lineHeight]
  )

  if (preferences.reducedMotion) {
    root.setAttribute('data-reduced-motion', 'true')
  } else {
    root.removeAttribute('data-reduced-motion')
  }
}

export function persistReadingPreferences(preferences: ReadingPreferences) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(
      READING_PREFERENCE_STORAGE_KEYS.fontWeight,
      String(preferences.fontWeight)
    )
    localStorage.setItem(
      READING_PREFERENCE_STORAGE_KEYS.fontSize,
      preferences.fontSize
    )
    localStorage.setItem(
      READING_PREFERENCE_STORAGE_KEYS.lineHeight,
      preferences.lineHeight
    )
    localStorage.setItem(
      READING_PREFERENCE_STORAGE_KEYS.reducedMotion,
      String(preferences.reducedMotion)
    )
  } catch {
    // Storage can be unavailable in private mode.
  }
}
