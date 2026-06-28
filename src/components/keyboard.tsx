'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

type KeyDefinition = {
  kind?: 'key' | 'arrow-stack'
  code?: string
  codes?: ['ArrowUp', 'ArrowDown']
  label?: ReactNode
  top?: ReactNode
  bottom?: ReactNode
  className?: string
  childrenClassName?: string
}

interface KeyboardProps {
  className?: string
  enableSound?: boolean
  showPreview?: boolean
  keys?: string[]
  keyClassName?: string
}

const displayLabels: Record<string, string> = {
  Escape: 'esc',
  Backspace: 'delete',
  Tab: 'tab',
  Enter: 'return',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  ControlLeft: 'control',
  AltLeft: 'option',
  MetaLeft: 'command',
  MetaRight: 'command',
  Space: 'space',
  CapsLock: 'caps',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
}

const keyRows: KeyDefinition[][] = [
  [
    { code: 'Escape', label: 'esc', className: 'w-10 rounded-tl-lg', childrenClassName: 'items-start justify-end pb-[2px] pl-[4px]' },
    ...Array.from({ length: 12 }, (_, index) => ({
      code: `F${index + 1}`,
      top: functionIcon(index + 1),
      bottom: `F${index + 1}`,
    })),
    { label: <span className="h-4 w-4 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-300" />, className: 'rounded-tr-lg' },
  ],
  [
    { code: 'Backquote', top: '~', bottom: '`' },
    { code: 'Digit1', top: '!', bottom: '1' },
    { code: 'Digit2', top: '@', bottom: '2' },
    { code: 'Digit3', top: '#', bottom: '3' },
    { code: 'Digit4', top: '$', bottom: '4' },
    { code: 'Digit5', top: '%', bottom: '5' },
    { code: 'Digit6', top: '^', bottom: '6' },
    { code: 'Digit7', top: '&', bottom: '7' },
    { code: 'Digit8', top: '*', bottom: '8' },
    { code: 'Digit9', top: '(', bottom: '9' },
    { code: 'Digit0', top: ')', bottom: '0' },
    { code: 'Minus', top: '-', bottom: '_' },
    { code: 'Equal', top: '+', bottom: '=' },
    { code: 'Backspace', label: 'delete', className: 'w-10', childrenClassName: 'items-end justify-end pb-[2px] pr-[4px]' },
  ],
  [
    { code: 'Tab', label: 'tab', className: 'w-10', childrenClassName: 'items-start justify-end pb-[2px] pl-[4px]' },
    ...'QWERTYUIOP'.split('').map((letter) => ({ code: `Key${letter}`, label: letter })),
    { code: 'BracketLeft', top: '{', bottom: '[' },
    { code: 'BracketRight', top: '}', bottom: ']' },
    { code: 'Backslash', top: '|', bottom: '\\' },
  ],
  [
    { code: 'CapsLock', label: 'caps lock', className: 'w-[2.8rem]', childrenClassName: 'items-start justify-end pb-[2px] pl-[4px]' },
    ...'ASDFGHJKL'.split('').map((letter) => ({ code: `Key${letter}`, label: letter })),
    { code: 'Semicolon', top: ':', bottom: ';' },
    { code: 'Quote', top: '"', bottom: "'" },
    { code: 'Enter', label: 'return', className: 'w-[2.85rem]', childrenClassName: 'items-end justify-end pb-[2px] pr-[4px]' },
  ],
  [
    { code: 'ShiftLeft', label: 'shift', className: 'w-[3.65rem]', childrenClassName: 'items-start justify-end pb-[2px] pl-[4px]' },
    ...'ZXCVBNM'.split('').map((letter) => ({ code: `Key${letter}`, label: letter })),
    { code: 'Comma', top: '<', bottom: ',' },
    { code: 'Period', top: '>', bottom: '.' },
    { code: 'Slash', top: '?', bottom: '/' },
    { code: 'ShiftRight', label: 'shift', className: 'w-[3.65rem]', childrenClassName: 'items-end justify-end pb-[2px] pr-[4px]' },
  ],
  [
    { code: 'Fn', top: 'fn', bottom: 'globe', className: 'rounded-bl-lg' },
    { code: 'ControlLeft', top: '^', bottom: 'control' },
    { code: 'AltLeft', top: '⌥', bottom: 'option' },
    { code: 'MetaLeft', top: '⌘', bottom: 'command', className: 'w-8' },
    { code: 'Space', className: 'w-[8.2rem]' },
    { code: 'MetaRight', top: '⌘', bottom: 'command', className: 'w-8' },
    { code: 'AltRight', top: '⌥', bottom: 'option' },
    { code: 'ArrowLeft', label: '◀', className: 'h-6 w-6' },
    { kind: 'arrow-stack', codes: ['ArrowUp', 'ArrowDown'] },
    { code: 'ArrowRight', label: '▶', className: 'h-6 w-6 rounded-br-lg' },
  ],
]

export function Keyboard({
  className,
  enableSound = false,
  showPreview = false,
  keys,
  keyClassName,
}: KeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element || keys) return

    let visible = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(element)

    const setPressed = (code: string) => {
      setPressedKeys((current) => new Set(current).add(code))
      setLastPressedKey(code)
      if (enableSound) {
        // Consumer can wire their own sound sprite if needed; this local registry avoids shipping audio assets.
      }
    }
    const setReleased = (code: string) => {
      setPressedKeys((current) => {
        const next = new Set(current)
        next.delete(code)
        return next
      })
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!visible || event.repeat) return
      setPressed(event.code)
    }
    const handleKeyUp = (event: globalThis.KeyboardEvent) => {
      if (!visible) return
      setReleased(event.code)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      observer.disconnect()
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [enableSound, keys])

  if (keys) {
    return (
      <div className={cn('inline-flex items-center gap-1.5', className)}>
        {keys.map((key) => (
          <kbd
            key={key}
            className={cn(
              'flex h-10 min-w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-[inset_0_-3px_0_rgba(24,24,27,0.08),0_8px_24px_-18px_rgba(24,24,27,0.5)] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100',
              keyClassName
            )}
          >
            {key}
          </kbd>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('mx-auto w-fit origin-center scale-[1.35]', className)}>
      {showPreview ? <KeystrokePreview lastPressedKey={lastPressedKey} pressed={pressedKeys.size > 0} /> : null}
      <div className="h-full w-fit rounded-xl bg-zinc-200 p-1 shadow-sm ring-1 shadow-black/5 ring-black/5">
        {keyRows.map((row, rowIndex) => (
          <KeyboardRow key={rowIndex}>
            {row.map((key, keyIndex) => {
              if (key.kind === 'arrow-stack' && key.codes) {
                const [upCode, downCode] = key.codes

                return (
                  <ArrowStackKey
                    key={`arrow-stack-${rowIndex}-${keyIndex}`}
                    pressedUp={pressedKeys.has(upCode)}
                    pressedDown={pressedKeys.has(downCode)}
                    onPress={(code) => {
                      setPressedKeys((current) => new Set(current).add(code))
                      setLastPressedKey(code)
                    }}
                    onRelease={(code) => {
                      setPressedKeys((current) => {
                        const next = new Set(current)
                        next.delete(code)
                        return next
                      })
                    }}
                  />
                )
              }

              return (
                <KeyButton
                  key={`${key.code ?? keyIndex}-${rowIndex}`}
                  definition={key}
                  pressed={key.code ? pressedKeys.has(key.code) : false}
                  onPress={() => {
                    if (!key.code) return
                    setPressedKeys((current) => new Set(current).add(key.code as string))
                    setLastPressedKey(key.code)
                  }}
                  onRelease={() => {
                    if (!key.code) return
                    setPressedKeys((current) => {
                      const next = new Set(current)
                      next.delete(key.code as string)
                      return next
                    })
                  }}
                />
              )
            })}
          </KeyboardRow>
        ))}
      </div>
    </div>
  )
}

function KeystrokePreview({
  lastPressedKey,
  pressed,
}: {
  lastPressedKey: string | null
  pressed: boolean
}) {
  const label = lastPressedKey ? getDisplayLabel(lastPressedKey) : null

  return (
    <div className="relative flex h-10 w-full items-center justify-center">
      <AnimatePresence mode="popLayout">
        {label ? (
          <motion.div
            key={`${lastPressedKey}-${label}`}
            layout
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: pressed ? 0.95 : 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
            className="absolute flex items-center justify-center rounded-lg px-4 py-1.5 font-mono text-xl font-semibold tracking-normal text-white/30"
          >
            {label}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function KeyboardRow({ children }: { children: ReactNode }) {
  return <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>
}

function KeyButton({
  definition,
  pressed,
  onPress,
  onRelease,
}: {
  definition: KeyDefinition
  pressed: boolean
  onPress: () => void
  onRelease: () => void
}) {
  return (
    <div className="rounded-[4px] p-[0.5px]">
      <button
        type="button"
        onMouseDown={onPress}
        onMouseUp={onRelease}
        onMouseLeave={() => {
          if (pressed) onRelease()
        }}
        className={cn(
          'flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] bg-zinc-100 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,1)_inset] transition-transform duration-75 active:scale-[0.98]',
          pressed &&
            'scale-[0.98] bg-zinc-100/80 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,0.5)]',
          definition.className
        )}
      >
        <div
          className={cn(
            'flex h-full w-full flex-col items-center justify-center text-[5px] text-zinc-700',
            definition.childrenClassName
          )}
        >
          {definition.label ?? (
            <>
              {definition.top ? <span>{definition.top}</span> : null}
              {definition.bottom ? <span>{definition.bottom}</span> : null}
            </>
          )}
        </div>
      </button>
    </div>
  )
}

function ArrowStackKey({
  pressedUp,
  pressedDown,
  onPress,
  onRelease,
}: {
  pressedUp: boolean
  pressedDown: boolean
  onPress: (code: 'ArrowUp' | 'ArrowDown') => void
  onRelease: (code: 'ArrowUp' | 'ArrowDown') => void
}) {
  return (
    <div className="flex h-6 w-6 flex-col gap-[2px] rounded-[4px] p-[0.5px]">
      {([
        ['ArrowUp', '▲', pressedUp],
        ['ArrowDown', '▼', pressedDown],
      ] satisfies Array<['ArrowUp' | 'ArrowDown', string, boolean]>).map(([code, label, pressed]) => (
        <button
          key={code}
          type="button"
          onMouseDown={() => onPress(code)}
          onMouseUp={() => onRelease(code)}
          onMouseLeave={() => {
            if (pressed) onRelease(code)
          }}
          className={cn(
            'flex h-[11px] w-full cursor-pointer items-center justify-center rounded-[3.5px] bg-zinc-100 text-[5px] text-zinc-700 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,1)_inset] transition-transform duration-75 active:scale-[0.98]',
            pressed &&
              'scale-[0.98] bg-zinc-100/80 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,0.5)]'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function getDisplayLabel(code: string) {
  if (displayLabels[code]) return displayLabels[code]
  if (code.startsWith('Key')) return code.slice(3)
  if (code.startsWith('Digit')) return code.slice(5)
  return code
}

function functionIcon(index: number) {
  const icons = ['☀', '☀', '▦', '⌕', '◉', '☾', '◀', '▶', '▶', '▾', '▴', '◼']
  return <span className="text-[6px] leading-none">{icons[index - 1]}</span>
}
