export const FONT_THEME_VALUES = [
  'pretendard',
  'maplestory',
  'hancom-malangmalang',
  'chosun-myeongjo',
  'moneygraphy',
  'chosun-gulim',
  'paperlogy',
] as const

export type FontThemeName = (typeof FONT_THEME_VALUES)[number]

export const ALL_FONT_WEIGHTS = [
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
] as const

export type FontWeight = (typeof ALL_FONT_WEIGHTS)[number]

export const FONT_THEME_WEIGHT_MAP: Record<
  FontThemeName,
  readonly FontWeight[]
> = {
  pretendard: ALL_FONT_WEIGHTS,
  maplestory: [400, 700],
  'hancom-malangmalang': [400, 700],
  'chosun-myeongjo': [400],
  moneygraphy: [400],
  'chosun-gulim': [400],
  paperlogy: ALL_FONT_WEIGHTS,
}

export const FONT_THEME_OPTIONS: ReadonlyArray<{
  value: FontThemeName
  label: string
  fontFamily: string
  downloadUrl: string
}> = [
  {
    value: 'pretendard',
    label: 'Pretendard',
    fontFamily: "Pretendard",
    downloadUrl: 'https://cactus.tistory.com/306',
  },
  {
    value: 'maplestory',
    label: 'Maplestory',
    fontFamily: "'Maplestory OTF'",
    downloadUrl:
      'https://brand.nexon.com/ko/ci-brand-guidelines/typeface#section-mapleStory',
  },
  {
    value: 'hancom-malangmalang',
    label: '한컴 말랑말랑체',
    fontFamily: "'Hancom MalangMalang'",
    downloadUrl: 'https://font.hancom.com/pc/sub/sub2_1.php',
  },
  {
    value: 'chosun-myeongjo',
    label: '조선명조',
    fontFamily: "'Chosun Myeongjo'",
    downloadUrl: 'https://event.chosun.com/100/100font.html',
  },
  {
    value: 'moneygraphy',
    label: '토스 머니그래피',
    fontFamily: "'Moneygraphy Rounded'",
    downloadUrl: 'https://toss.im/moneygraphy-font',
  },
  {
    value: 'chosun-gulim',
    label: '조선굴림',
    fontFamily: "'Chosun Gulim'",
    downloadUrl: 'https://event.chosun.com/100/100font.html',
  },
  {
    value: 'paperlogy',
    label: '페이퍼로지',
    fontFamily: "'Paperlogy'",
    downloadUrl: 'https://freesentation.blog/paperlogyfont',
  },
]

export const DEFAULT_FONT_THEME: FontThemeName = 'pretendard'
export const FONT_THEME_STORAGE_KEY = 'font-theme'

const FONT_THEME_SET = new Set<string>(FONT_THEME_VALUES)

export function isFontThemeName(
  value: string | null | undefined
): value is FontThemeName {
  return Boolean(value && FONT_THEME_SET.has(value))
}

const FALLBACK_FONT_STACK =
  "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"

const FONT_THEME_STACKS = Object.fromEntries(
  FONT_THEME_OPTIONS.map(({ value, fontFamily }) => [
    value,
    value === DEFAULT_FONT_THEME
      ? FALLBACK_FONT_STACK
      : `${fontFamily}, ${FALLBACK_FONT_STACK}`,
  ])
) as Record<FontThemeName, string>

export function getFontThemeStack(theme: FontThemeName): string {
  return FONT_THEME_STACKS[theme]
}

export function applyFontTheme(theme: FontThemeName) {
  if (typeof document === 'undefined') return

  const stack = getFontThemeStack(theme)
  const root = document.documentElement
  root.setAttribute('data-font-theme', theme)
  root.style.setProperty('--font-user', stack)
  document.body?.style.setProperty('font-family', stack)
}

export function persistFontThemePreference(theme: FontThemeName) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(FONT_THEME_STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable in private mode.
  }
}

export function readFontThemePreference(): FontThemeName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_FONT_THEME
  }

  const appliedTheme = document.documentElement.getAttribute('data-font-theme')
  if (isFontThemeName(appliedTheme)) return appliedTheme

  try {
    const storedTheme = localStorage.getItem(FONT_THEME_STORAGE_KEY)
    if (isFontThemeName(storedTheme)) return storedTheme
  } catch {
    // Storage can be unavailable.
  }

  return DEFAULT_FONT_THEME
}

export function getSupportedFontWeights(
  theme: FontThemeName
): readonly FontWeight[] {
  return FONT_THEME_WEIGHT_MAP[theme]
}

export function normalizeFontWeight(
  theme: FontThemeName,
  requestedWeight: number
): FontWeight {
  const supportedWeights = getSupportedFontWeights(theme)

  return supportedWeights.reduce((closest, weight) =>
    Math.abs(weight - requestedWeight) < Math.abs(closest - requestedWeight)
      ? weight
      : closest
  )
}
