'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

type LightswindThemeAnimation =
  | 'none'
  | 'circle-spread'
  | 'round-morph'
  | 'swipe-left'
  | 'swipe-up'
  | 'diag-down-right'
  | 'fade-in-out'
  | 'shrink-grow'
  | 'flip-x-in'
  | 'split-vertical'
  | 'swipe-right'
  | 'swipe-down'
  | 'wave-ripple'

type LegacyThemeAnimation = 'circle' | 'wipe' | 'blur' | 'fade'

export type ToggleThemeAnimation =
  | LightswindThemeAnimation
  | LegacyThemeAnimation

interface ToggleThemeProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
  duration?: number
  animationType?: ToggleThemeAnimation
  label?: string
  variant?: 'default' | 'glass'
}

type ViewTransition = {
  ready: Promise<void>
  finished: Promise<void>
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition
}

const legacyAnimationMap: Record<
  LegacyThemeAnimation,
  LightswindThemeAnimation
> = {
  circle: 'circle-spread',
  wipe: 'swipe-left',
  blur: 'round-morph',
  fade: 'fade-in-out',
}

function normalizeAnimationType(
  animationType: ToggleThemeAnimation
): LightswindThemeAnimation {
  return animationType in legacyAnimationMap
    ? legacyAnimationMap[animationType as LegacyThemeAnimation]
    : (animationType as LightswindThemeAnimation)
}

function applyTheme(next: boolean, setTheme: (theme: string) => void) {
  document.documentElement.classList.toggle('dark', next)
  window.localStorage.setItem('theme', next ? 'dark' : 'light')
  setTheme(next ? 'dark' : 'light')
}

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

function createFlipTransitionStyle(duration: number) {
  const styleElement = document.createElement('style')
  styleElement.textContent = `
    ::view-transition-group(root) {
      perspective: 1000px;
    }

    ::view-transition-old(root) {
      transform-origin: center;
      animation: theme-flip-out ${duration}ms forwards;
    }

    ::view-transition-new(root) {
      transform-origin: center;
      animation: theme-flip-in ${duration}ms forwards;
    }

    @keyframes theme-flip-out {
      from {
        transform: rotateY(0deg);
        opacity: 1;
      }

      to {
        transform: rotateY(-90deg);
        opacity: 0;
      }
    }

    @keyframes theme-flip-in {
      from {
        transform: rotateY(90deg);
        opacity: 0;
      }

      to {
        transform: rotateY(0deg);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(styleElement)
  return styleElement
}

function subscribeToThemeChanges(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => observer.disconnect()
}

function getDocumentDarkTheme() {
  return document.documentElement.classList.contains('dark')
}

export function ToggleTheme({
  defaultChecked,
  checked,
  onChange,
  duration = 400,
  animationType = 'circle-spread',
  label,
  variant = 'default',
  className,
  disabled,
  ...props
}: ToggleThemeProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [documentChecked, setDocumentChecked] = useState(defaultChecked ?? false)
  const [innerChecked, setInnerChecked] = useState(defaultChecked ?? false)

  useEffect(() => {
    const updateTheme = () => setDocumentChecked(getDocumentDarkTheme())

    updateTheme()
    return subscribeToThemeChanges(updateTheme)
  }, [])

  const providerChecked =
    resolvedTheme === 'dark'
      ? true
      : resolvedTheme === 'light'
        ? false
        : documentChecked
  const active = checked ?? (defaultChecked === undefined ? providerChecked : innerChecked)
  const normalizedAnimationType = normalizeAnimationType(animationType)

  const commitTheme = useCallback(
    (next: boolean) => {
      if (checked === undefined) setInnerChecked(next)
      setDocumentChecked(next)
      onChange?.(next)
      applyTheme(next, setTheme)
    },
    [checked, onChange, setTheme]
  )

  const update = useCallback(async () => {
    if (disabled || !buttonRef.current) return

    const next = !getDocumentDarkTheme()
    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition?.bind(document)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (!startViewTransition || prefersReducedMotion) {
      commitTheme(next)
      return
    }

    const transitionStyle =
      normalizedAnimationType === 'flip-x-in'
        ? undefined
        : createViewTransitionResetStyle()
    const transition = startViewTransition(() => {
      flushSync(() => commitTheme(next))
    })

    try {
      await transition.ready
    } catch {
      transitionStyle?.remove()
      return
    }

    const button = buttonRef.current
    if (!button) {
      transitionStyle?.remove()
      return
    }

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )
    let flipStyle: HTMLStyleElement | undefined

    switch (normalizedAnimationType) {
      case 'circle-spread':
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'round-morph':
        document.documentElement.animate(
          [
            { opacity: 0, transform: 'scale(0.8) rotate(5deg)' },
            { opacity: 1, transform: 'scale(1) rotate(0deg)' },
          ],
          {
            duration: duration * 1.2,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'swipe-left':
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 0 0 ${viewportWidth}px)`,
              'inset(0 0 0 0)',
            ],
          },
          {
            duration,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'swipe-up':
        document.documentElement.animate(
          {
            clipPath: [
              `inset(${viewportHeight}px 0 0 0)`,
              'inset(0 0 0 0)',
            ],
          },
          {
            duration,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'diag-down-right':
        document.documentElement.animate(
          {
            clipPath: [
              'polygon(0 0, 0 0, 0 0, 0 0)',
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            ],
          },
          {
            duration: duration * 1.5,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'fade-in-out':
        document.documentElement.animate(
          {
            opacity: [0, 1],
          },
          {
            duration: duration * 0.5,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'shrink-grow':
        document.documentElement.animate(
          [
            { transform: 'scale(0.9)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          {
            duration: duration * 1.2,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        document.documentElement.animate(
          [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.05)', opacity: 0 },
          ],
          {
            duration: duration * 1.2,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            pseudoElement: '::view-transition-old(root)',
          }
        )
        break

      case 'flip-x-in':
        flipStyle = createFlipTransitionStyle(duration)
        break

      case 'split-vertical':
        document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: duration * 0.75,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        })
        document.documentElement.animate(
          [
            { clipPath: 'inset(0 0 0 0)', transform: 'none' },
            { clipPath: 'inset(0 40% 0 40%)', transform: 'scale(1.2)' },
            { clipPath: 'inset(0 50% 0 50%)', transform: 'scale(1)' },
          ],
          {
            duration: duration * 1.5,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            pseudoElement: '::view-transition-old(root)',
          }
        )
        break

      case 'swipe-right':
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 ${viewportWidth}px 0 0)`,
              'inset(0 0 0 0)',
            ],
          },
          {
            duration,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'swipe-down':
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 0 ${viewportHeight}px 0)`,
              'inset(0 0 0 0)',
            ],
          },
          {
            duration,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'wave-ripple':
        document.documentElement.animate(
          {
            clipPath: [
              'circle(0% at 50% 50%)',
              `circle(${maxRadius}px at 50% 50%)`,
            ],
          },
          {
            duration: duration * 1.5,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        break

      case 'none':
      default:
        break
    }

    void transition.finished.finally(() => {
      transitionStyle?.remove()
      flipStyle?.remove()
    })
  }, [
    commitTheme,
    disabled,
    duration,
    normalizedAnimationType,
  ])

  const hasLabel = label !== undefined
  const isGlass = variant === 'glass'

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={hasLabel ? undefined : 'Toggle theme'}
      disabled={disabled}
      onClick={update}
      className={cn(
        hasLabel
          ? cn(
              'group inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors duration-300',
              isGlass
                ? 'border border-white/10 bg-white/[0.08] text-white/82 shadow-[0_18px_58px_-38px_rgba(255,255,255,0.32)] backdrop-blur-md hover:bg-white/[0.13] hover:text-white'
                : 'border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
            )
          : 'rounded-full p-2 transition-colors duration-300 hover:text-blue-600',
        className
      )}
      {...props}
    >
      {hasLabel ? (
        <>
          <span
            className={cn(
              'relative flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-300',
              isGlass ? 'bg-white/[0.08] ring-1 ring-white/10' : 'bg-zinc-100 dark:bg-zinc-800',
              active && (isGlass ? 'bg-sky-400/18' : 'bg-blue-500/20 dark:bg-blue-400/30')
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-transform duration-300',
                isGlass ? 'bg-white/88 text-zinc-800' : 'bg-white text-zinc-700 dark:bg-zinc-100',
                active && 'translate-x-5'
              )}
            >
              {active ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </span>
          </span>
          <span>{label}</span>
        </>
      ) : active ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </button>
  )
}
