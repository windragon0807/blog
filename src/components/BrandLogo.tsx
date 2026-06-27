'use client'

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  DEFAULT_LOGO_MOTION,
  isLogoMotionName,
  type LogoMotionName,
} from '@/lib/logoMotions'
import { DiaTextReveal } from './magicui/dia-text-reveal'
import { Highlighter } from './magicui/highlighter'
import TypingText from './TypingText'

// data-logo-motion 외부 store 구독 — useState/useEffect 없이 SSR/hydration 일관성 유지
function subscribeMotion(callback: () => void) {
  if (typeof document === 'undefined') return () => {}
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-logo-motion'],
  })
  return () => observer.disconnect()
}

function getMotionSnapshot(): LogoMotionName {
  if (typeof document === 'undefined') return DEFAULT_LOGO_MOTION
  const value = document.documentElement.getAttribute('data-logo-motion')
  return isLogoMotionName(value) ? value : DEFAULT_LOGO_MOTION
}

function useLogoMotion(): LogoMotionName {
  return useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    () => DEFAULT_LOGO_MOTION
  )
}

interface BrandLogoProps {
  label: string
}

type LogoHighlighterPhase = 'highlight' | 'underline'

function LogoHighlighterAnnotation({
  label,
  phase,
  visible,
}: {
  label: string
  phase: LogoHighlighterPhase
  visible: boolean
}) {
  const isHighlight = phase === 'highlight'

  return (
    <span
      aria-hidden
      data-logo-highlighter-phase={phase}
      data-logo-highlighter-visible={visible ? 'true' : 'false'}
      className={`pointer-events-none absolute inset-x-0 -inset-y-1 z-0 overflow-visible text-transparent transition-opacity duration-500 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span
        className="brand-logo-highlighter-target block w-full [&>span]:block [&>span]:w-full [&>span]:whitespace-nowrap"
        style={{
          width: 'calc(100% + 0.5em)',
          transform: 'translateY(0.5em)',
        }}
      >
        <Highlighter
          action={isHighlight ? 'highlight' : 'underline'}
          color={
            isHighlight
              ? 'rgba(250, 204, 21, 0.46)'
              : 'var(--theme-accent-current)'
          }
          strokeWidth={isHighlight ? 1.5 : 2}
          animationDuration={isHighlight ? 920 : 760}
          iterations={2}
          padding={isHighlight ? 4 : 3}
        >
          {label}
        </Highlighter>
      </span>
    </span>
  )
}

function HighlighterLogo({ label }: { label: string }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<LogoHighlighterPhase>('highlight')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion) return

    const visibleDuration = phase === 'highlight' ? 1240 : 1040
    const fadeDuration = 560
    const hideTimer = window.setTimeout(() => {
      setVisible(false)
    }, visibleDuration)
    const nextTimer = window.setTimeout(() => {
      setPhase((currentPhase) =>
        currentPhase === 'highlight' ? 'underline' : 'highlight'
      )
      setVisible(true)
    }, visibleDuration + fadeDuration)

    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(nextTimer)
    }
  }, [phase, prefersReducedMotion])

  return (
    <span className="brand-logo-highlight-frame relative -my-1 inline-block overflow-visible px-1 py-1">
      <span className="relative z-10">{label}</span>
      {!prefersReducedMotion && (
        <LogoHighlighterAnnotation
          key={phase}
          label={label}
          phase={phase}
          visible={visible}
        />
      )}
    </span>
  )
}

export function BrandLogo({ label }: BrandLogoProps) {
  const motion = useLogoMotion()
  const chars = useMemo(() => Array.from(label), [label])

  if (motion === 'typing') {
    return (
      <TypingText
        key={label}
        text={label}
        wrapper="span"
        charDelay={80}
        loop
        loopPause={1500}
        deleteOnLoop
        deleteCharDelay={50}
      />
    )
  }

  if (motion === 'dia-text-reveal') {
    return (
      <DiaTextReveal
        key={label}
        text={label}
        colors={[
          'var(--theme-progress-start)',
          'var(--theme-progress-mid)',
          'var(--theme-progress-end)',
        ]}
        textColor="currentColor"
        finalTextColor="currentColor"
        trailSize={28}
        duration={1.3}
        repeat
        repeatDelay={1.4}
        startOnView={false}
        once={false}
        fixedWidth
      />
    )
  }

  if (motion === 'highlighter') {
    return <HighlighterLogo key={label} label={label} />
  }

  return (
    <>
      <span className="brand-base block">{label}</span>
      <span aria-hidden className="brand-animated-layer">
        {chars.map((character, index) => (
          <span
            key={`${label}-${index}`}
            className="brand-animated-char"
            style={{ '--brand-char-index': index } as CSSProperties}
          >
            {character}
          </span>
        ))}
      </span>
    </>
  )
}
