export const LOGO_MOTION_VALUES = [
  'typing',
  'jump',
  'wave',
  'slide',
  'dia-text-reveal',
  'highlighter',
] as const

export type LogoMotionName = (typeof LOGO_MOTION_VALUES)[number]

export const LOGO_MOTION_OPTIONS: ReadonlyArray<{
  value: LogoMotionName
  label: string
}> = [
  { value: 'typing', label: 'Typing' },
  { value: 'jump', label: 'Jump' },
  { value: 'wave', label: 'Wave' },
  { value: 'slide', label: 'Slide Reveal' },
  { value: 'dia-text-reveal', label: 'Dia Text Reveal' },
  { value: 'highlighter', label: 'Highlighter' },
]

export const DEFAULT_LOGO_MOTION: LogoMotionName = 'typing'

const LOGO_MOTION_SET = new Set<string>(LOGO_MOTION_VALUES)

export function isLogoMotionName(
  value: string | null | undefined
): value is LogoMotionName {
  return Boolean(value && LOGO_MOTION_SET.has(value))
}
