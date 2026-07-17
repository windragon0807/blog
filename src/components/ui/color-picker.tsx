'use client'

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { CheckIcon } from 'lucide-react'
import { hexToHsv, hsvToHex, type HsvColor } from '@/lib/color'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type ColorPickerProps = {
  children: ReactNode
  value: string
  onValueChange: (value: string) => void
}

const HEX_PATTERN = /^#[0-9A-F]{6}$/

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function ColorPicker({
  children,
  value,
  onValueChange,
}: ColorPickerProps) {
  const hsv = useMemo(() => hexToHsv(value), [value])
  const [hexDraft, setHexDraft] = useState({
    source: value,
    input: value.toUpperCase(),
  })
  const saturationRef = useRef<HTMLDivElement>(null)
  const hexInput =
    hexDraft.source === value ? hexDraft.input : value.toUpperCase()

  function updateHsv(next: HsvColor) {
    onValueChange(hsvToHex(next))
  }

  function updateSaturationAndValue(
    event: PointerEvent<HTMLDivElement>
  ) {
    const rect = event.currentTarget.getBoundingClientRect()
    updateHsv({
      h: hsv.h,
      s: clamp((event.clientX - rect.left) / rect.width),
      v: clamp(1 - (event.clientY - rect.top) / rect.height),
    })
  }

  function handleSaturationPointerDown(
    event: PointerEvent<HTMLDivElement>
  ) {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateSaturationAndValue(event)
  }

  function handleSaturationPointerMove(
    event: PointerEvent<HTMLDivElement>
  ) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    updateSaturationAndValue(event)
  }

  function handleSaturationKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 0.05 : 0.01
    let next = hsv

    if (event.key === 'ArrowLeft') next = { ...hsv, s: clamp(hsv.s - step) }
    else if (event.key === 'ArrowRight') next = { ...hsv, s: clamp(hsv.s + step) }
    else if (event.key === 'ArrowUp') next = { ...hsv, v: clamp(hsv.v + step) }
    else if (event.key === 'ArrowDown') next = { ...hsv, v: clamp(hsv.v - step) }
    else return

    event.preventDefault()
    updateHsv(next)
  }

  function commitHexInput() {
    const normalized = hexInput.startsWith('#')
      ? hexInput.toUpperCase()
      : `#${hexInput.toUpperCase()}`

    if (HEX_PATTERN.test(normalized)) {
      setHexDraft({ source: normalized, input: normalized })
      onValueChange(normalized)
    } else {
      setHexDraft({ source: value, input: value.toUpperCase() })
    }
  }

  const pureHue = hsvToHex({ h: hsv.h, s: 1, v: 1 })

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        aria-label="색상 선택"
        align="start"
        sideOffset={10}
        collisionPadding={16}
        data-settings-menu-portal=""
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          saturationRef.current?.focus({ preventScroll: true })
        }}
        className="settings-popover z-[90] w-[min(19rem,calc(100vw-2rem))] rounded-2xl border-border/65 bg-background/88 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_24px_64px_-30px_rgba(15,23,42,0.68)] backdrop-blur-2xl dark:bg-zinc-950/88 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_28px_72px_-30px_rgba(0,0,0,0.86)]"
      >
        <div className="grid gap-3">
          <div
            ref={saturationRef}
            role="slider"
            tabIndex={0}
            aria-label="채도와 명도"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(hsv.v * 100)}
            aria-valuetext={`채도 ${Math.round(hsv.s * 100)}%, 명도 ${Math.round(hsv.v * 100)}%`}
            onPointerDown={handleSaturationPointerDown}
            onPointerMove={handleSaturationPointerMove}
            onKeyDown={handleSaturationKeyDown}
            className="color-picker-saturation relative h-36 touch-none overflow-hidden rounded-xl outline-none"
            style={{ backgroundColor: pureHue }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.72),0_2px_7px_rgba(0,0,0,0.34)]"
              style={{
                left: `clamp(0.5rem, ${hsv.s * 100}%, calc(100% - 0.5rem))`,
                top: `clamp(0.5rem, ${(1 - hsv.v) * 100}%, calc(100% - 0.5rem))`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-xl border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.62),0_5px_12px_-7px_rgba(15,23,42,0.72)]"
              style={{ backgroundColor: value }}
            >
              <CheckIcon
                className="size-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.72)]"
                strokeWidth={2.5}
              />
            </span>
            <input
              type="range"
              aria-label="색조"
              min={0}
              max={359}
              value={Math.round(hsv.h)}
              onChange={(event) =>
                updateHsv({ ...hsv, h: Number(event.target.value) })
              }
              style={{ '--color-picker-hue-thumb': pureHue } as CSSProperties}
              className="color-picker-hue h-8 w-full appearance-none rounded-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
            />
          </div>

          <label className="grid grid-cols-[auto_minmax(0,1fr)] items-center overflow-hidden rounded-xl border border-border/70 bg-background/72 focus-within:border-ring/55 focus-within:ring-2 focus-within:ring-ring/30 dark:bg-white/[0.045]">
            <span className="border-r border-border/70 px-3 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground">
              HEX
            </span>
            <input
              type="text"
              aria-label="컬러 피커 HEX 값"
              value={hexInput}
              maxLength={7}
              spellCheck={false}
              onChange={(event) => {
                const next = event.target.value.toUpperCase()
                if (/^#?[0-9A-F]{0,6}$/.test(next)) {
                  setHexDraft({ source: value, input: next })
                }
              }}
              onBlur={commitHexInput}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                commitHexInput()
              }}
              className="h-10 min-w-0 bg-transparent px-3 font-mono text-xs uppercase text-foreground outline-none"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  )
}
