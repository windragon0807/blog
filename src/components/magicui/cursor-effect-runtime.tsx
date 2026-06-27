'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type Point = { x: number; y: number }
type CanvasSize = { width: number; height: number; ratio: number }

export interface CursorEffectBaseProps {
  children?: ReactNode
  className?: string
  disabled?: boolean
}

export interface MouseInvertCursorProps extends CursorEffectBaseProps {
  size?: number
  color?: string
  smoothness?: number
  hideDefault?: boolean
}

export interface MouseTrailCursorProps extends CursorEffectBaseProps {
  color?: string
  size?: number
  length?: number
  decay?: number
  blur?: number
}

export interface MouseRippleCursorProps extends CursorEffectBaseProps {
  color?: string
  duration?: number
  maxSize?: number
}

export interface MouseCustomCursorProps extends CursorEffectBaseProps {
  innerSize?: number
  outerSize?: number
  innerColor?: string
  outerColor?: string
  smoothness?: number
  hideDefault?: boolean
}

export interface FairyDustCursorProps extends CursorEffectBaseProps {
  colors?: string[]
  fairySymbol?: string
  maxParticles?: number
}

export interface BubbleCursorProps extends CursorEffectBaseProps {
  fillColor?: string
  strokeColor?: string
  maxParticles?: number
}

export interface CharacterCursorProps extends CursorEffectBaseProps {
  characters?: string[]
  colors?: string[]
  font?: string
  cursorOffset?: Point
  maxParticles?: number
}

interface TextImage {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

function useCanAnimate(disabled = false) {
  const [canAnimate, setCanAnimate] = useState(false)

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const sync = () => {
      setCanAnimate(
        !disabled && !reducedMotionQuery.matches && pointerQuery.matches
      )
    }

    sync()
    reducedMotionQuery.addEventListener('change', sync)
    pointerQuery.addEventListener('change', sync)

    return () => {
      reducedMotionQuery.removeEventListener('change', sync)
      pointerQuery.removeEventListener('change', sync)
    }
  }, [disabled])

  return canAnimate
}

function getLocalPoint(element: HTMLElement, event: PointerEvent<Element>) {
  const rect = element.getBoundingClientRect()

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function useCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  rootRef: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0, ratio: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root || !active) return

    const context = canvas.getContext('2d')
    if (!context) return

    const resize = () => {
      const rect = root.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))

      sizeRef.current = { width, height, ratio }
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root)
    window.addEventListener('resize', resize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [active, canvasRef, rootRef])

  return sizeRef
}

function clearCanvas(
  context: CanvasRenderingContext2D,
  size: CanvasSize
) {
  context.clearRect(0, 0, size.width, size.height)
}

function createTextImage(text: string, font: string, color: string): TextImage {
  const measureCanvas = document.createElement('canvas')
  const measureContext = measureCanvas.getContext('2d')

  if (!measureContext) {
    return { canvas: measureCanvas, width: 1, height: 1 }
  }

  measureContext.font = font
  measureContext.textAlign = 'center'
  measureContext.textBaseline = 'middle'

  const measurements = measureContext.measureText(text)
  const ascent = measurements.actualBoundingBoxAscent || 12
  const descent = measurements.actualBoundingBoxDescent || 4
  const width = Math.max(1, Math.ceil(measurements.width))
  const height = Math.max(1, Math.ceil((ascent + descent) * 2.5))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  if (context) {
    context.fillStyle = color
    context.textAlign = 'center'
    context.font = font
    context.textBaseline = 'middle'
    context.fillText(text, width / 2, ascent)
  }

  return { canvas, width, height }
}

function randomSign() {
  return Math.random() < 0.5 ? -1 : 1
}

function useRafCleanup() {
  const rafRef = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (rafRef.current === null) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  useEffect(() => cancel, [cancel])

  return { rafRef, cancel }
}

export function MouseInvertCursor({
  children,
  className,
  disabled,
  size = 50,
  color = '#ffffff',
  smoothness = 0.08,
  hideDefault = true,
}: MouseInvertCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const rawRef = useRef<Point>({ x: 0, y: 0 })
  const smoothRef = useRef<Point>({ x: 0, y: 0 })
  const [inside, setInside] = useState(false)
  const { rafRef, cancel } = useRafCleanup()

  const paint = useCallback((point: Point) => {
    const cursor = cursorRef.current
    if (!cursor) return
    cursor.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
  }, [])

  function step() {
    const smooth = smoothRef.current
    const raw = rawRef.current
    smooth.x += (raw.x - smooth.x) * smoothness
    smooth.y += (raw.y - smooth.y) * smoothness
    paint(smooth)

    if (Math.hypot(raw.x - smooth.x, raw.y - smooth.y) < 0.1) {
      smooth.x = raw.x
      smooth.y = raw.y
      paint(smooth)
      rafRef.current = null
      return
    }

    rafRef.current = requestAnimationFrame(step)
  }

  function start() {
    if (smoothness >= 1 || rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(step)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !canAnimate) return

    const point = getLocalPoint(root, event)
    rawRef.current = point

    if (!inside) {
      smoothRef.current = point
      paint(point)
      setInside(true)
    }

    if (smoothness >= 1) {
      smoothRef.current = point
      paint(point)
    } else {
      start()
    }
  }

  return (
    <div
      ref={rootRef}
      data-cursor-effect="mouse-invert-cursor"
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[inherit]',
        inside && hideDefault && canAnimate && 'cursor-none',
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setInside(false)
        cancel()
      }}
    >
      {children}
      {canAnimate && (
        <div
          ref={cursorRef}
          data-cursor-layer="invert"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 rounded-full mix-blend-difference will-change-transform"
          style={{
            width: size,
            height: size,
            background: color,
            opacity: inside ? 1 : 0,
          }}
        />
      )}
    </div>
  )
}

export function MouseCustomCursor({
  children,
  className,
  disabled,
  innerSize = 6,
  outerSize = 36,
  innerColor = '#34d399',
  outerColor = 'rgba(52,211,153,0.3)',
  smoothness = 0.15,
  hideDefault = true,
}: MouseCustomCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rawRef = useRef<Point>({ x: 0, y: 0 })
  const smoothRef = useRef<Point>({ x: 0, y: 0 })
  const [inside, setInside] = useState(false)
  const { rafRef, cancel } = useRafCleanup()

  const paintRing = useCallback((point: Point) => {
    const ring = ringRef.current
    if (!ring) return
    ring.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
  }, [])

  const paintDot = useCallback((point: Point) => {
    const dot = dotRef.current
    if (!dot) return
    dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
  }, [])

  function step() {
    const smooth = smoothRef.current
    const raw = rawRef.current
    smooth.x += (raw.x - smooth.x) * smoothness
    smooth.y += (raw.y - smooth.y) * smoothness
    paintRing(smooth)

    if (Math.hypot(raw.x - smooth.x, raw.y - smooth.y) < 0.1) {
      smooth.x = raw.x
      smooth.y = raw.y
      paintRing(smooth)
      rafRef.current = null
      return
    }

    rafRef.current = requestAnimationFrame(step)
  }

  function start() {
    if (smoothness >= 1 || rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(step)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !canAnimate) return

    const point = getLocalPoint(root, event)
    rawRef.current = point
    paintDot(point)

    if (!inside) {
      smoothRef.current = point
      paintRing(point)
      setInside(true)
    }

    if (smoothness >= 1) {
      smoothRef.current = point
      paintRing(point)
    } else {
      start()
    }
  }

  return (
    <div
      ref={rootRef}
      data-cursor-effect="mouse-custom-cursor"
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[inherit]',
        inside && hideDefault && canAnimate && 'cursor-none',
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setInside(false)
        cancel()
      }}
    >
      {children}
      {canAnimate && (
        <>
          <div
            ref={dotRef}
            data-cursor-layer="custom-dot"
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-30 rounded-full will-change-transform"
            style={{
              width: innerSize,
              height: innerSize,
              background: innerColor,
              opacity: inside ? 1 : 0,
            }}
          />
          <div
            ref={ringRef}
            data-cursor-layer="custom-ring"
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-30 rounded-full border-2 bg-transparent will-change-transform"
            style={{
              width: outerSize,
              height: outerSize,
              borderColor: outerColor,
              opacity: inside ? 1 : 0,
            }}
          />
        </>
      )}
    </div>
  )
}

export function MouseRippleCursor({
  children,
  className,
  disabled,
  color = 'rgba(96,165,250,0.60)',
  duration = 600,
  maxSize = 150,
}: MouseRippleCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !canAnimate) return

    const rect = root.getBoundingClientRect()
    const ripple = document.createElement('div')
    const x = event.clientX - rect.left - maxSize / 2
    const y = event.clientY - rect.top - maxSize / 2

    ripple.style.cssText = [
      'position:absolute',
      'border-radius:9999px',
      'pointer-events:none',
      `width:${maxSize}px`,
      `height:${maxSize}px`,
      `left:${x}px`,
      `top:${y}px`,
      `background:${color}`,
    ].join(';')
    ripple.dataset.cursorRipple = 'true'

    root.appendChild(ripple)
    const animation = ripple.animate(
      [
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      { duration, easing: 'ease-out', fill: 'forwards' }
    )
    animation.addEventListener('finish', () => ripple.remove(), { once: true })
  }

  return (
    <div
      ref={rootRef}
      data-cursor-effect="mouse-ripple-cursor"
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[inherit]',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

interface TrailPoint extends Point {
  alpha: number
}

export function MouseTrailCursor({
  children,
  className,
  disabled,
  color = '#c084fc',
  size = 5,
  length = 20,
  decay = 0.05,
  blur = 0,
}: MouseTrailCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<TrailPoint[]>([])
  const { rafRef, cancel } = useRafCleanup()
  const sizeRef = useCanvasSize(canvasRef, rootRef, canAnimate)

  function draw() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) {
      rafRef.current = null
      return
    }

    clearCanvas(context, sizeRef.current)

    const points = pointsRef.current
    const pointCount = points.length
    for (let index = 0; index < pointCount; index += 1) {
      const point = points[index]
      const ratio = (index + 1) / pointCount
      context.globalAlpha = point.alpha * ratio
      if (blur > 0) context.filter = `blur(${blur}px)`
      context.fillStyle = color
      context.beginPath()
      context.arc(point.x, point.y, Math.max(size * ratio, 0.5), 0, Math.PI * 2)
      context.fill()
      point.alpha = Math.max(0, point.alpha - decay)
    }

    context.globalAlpha = 1
    if (blur > 0) context.filter = 'none'
    pointsRef.current = points.filter((point) => point.alpha > 0)

    if (pointsRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      clearCanvas(context, sizeRef.current)
      rafRef.current = null
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !canAnimate) return

    const point = getLocalPoint(root, event)
    pointsRef.current.push({ ...point, alpha: 1 })
    if (pointsRef.current.length > length) pointsRef.current.shift()
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(draw)
    }
  }

  useEffect(() => {
    if (canAnimate) return
    pointsRef.current = []
    cancel()
  }, [canAnimate, cancel])

  return (
    <div
      ref={rootRef}
      data-cursor-effect="mouse-trail-cursor"
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[inherit]',
        className
      )}
      onPointerMove={handlePointerMove}
    >
      {children}
      {canAnimate && (
        <canvas
          ref={canvasRef}
          data-cursor-canvas="trail"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        />
      )}
    </div>
  )
}

class FairyParticle {
  initialLifeSpan: number
  lifeSpan: number
  velocity: Point
  position: Point
  image: TextImage

  constructor(x: number, y: number, image: TextImage) {
    const lifeSpan = Math.floor(Math.random() * 30 + 60)
    this.initialLifeSpan = lifeSpan
    this.lifeSpan = lifeSpan
    this.velocity = {
      x: randomSign() * (Math.random() / 2),
      y: Math.random() * 0.7 + 0.9,
    }
    this.position = { x, y }
    this.image = image
  }

  update(context: CanvasRenderingContext2D) {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.lifeSpan -= 1
    this.velocity.y += 0.02

    const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0)
    context.drawImage(
      this.image.canvas,
      this.position.x - (this.image.width / 2) * scale,
      this.position.y - this.image.height / 2,
      this.image.width * scale,
      this.image.height * scale
    )

    return this.lifeSpan >= 0
  }
}

class BubbleParticle {
  initialLifeSpan: number
  lifeSpan: number
  velocity: Point
  position: Point
  baseDimension = 4

  constructor(x: number, y: number) {
    const lifeSpan = Math.floor(Math.random() * 60 + 60)
    this.initialLifeSpan = lifeSpan
    this.lifeSpan = lifeSpan
    this.velocity = {
      x: randomSign() * (Math.random() / 10),
      y: -0.4 + Math.random() * -1,
    }
    this.position = { x, y }
  }

  update(
    context: CanvasRenderingContext2D,
    fillColor: string,
    strokeColor: string
  ) {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.x += (randomSign() * 2) / 75
    this.velocity.y -= Math.random() / 600
    this.lifeSpan -= 1

    const scale =
      0.2 + (this.initialLifeSpan - this.lifeSpan) / this.initialLifeSpan
    context.fillStyle = fillColor
    context.strokeStyle = strokeColor
    context.beginPath()
    context.arc(
      this.position.x - (this.baseDimension / 2) * scale,
      this.position.y - this.baseDimension / 2,
      this.baseDimension * scale,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.fill()
    context.closePath()

    return this.lifeSpan >= 0
  }
}

class CharacterParticle {
  age = 0
  initialLifeSpan: number
  lifeSpan: number
  rotationSign: number
  velocity: Point
  position: Point
  image: TextImage

  constructor(x: number, y: number, image: TextImage, cursorOffset: Point) {
    const lifeSpan = Math.floor(Math.random() * 60 + 80)
    this.initialLifeSpan = lifeSpan
    this.lifeSpan = lifeSpan
    this.rotationSign = randomSign()
    this.velocity = {
      x: randomSign() * Math.random() * 5,
      y: randomSign() * Math.random() * 5,
    }
    this.position = {
      x: x + cursorOffset.x,
      y: y + cursorOffset.y,
    }
    this.image = image
  }

  update(context: CanvasRenderingContext2D) {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.lifeSpan -= 1
    this.age += 1
    this.velocity.x += randomSign() / 30
    this.velocity.y += randomSign() / 15

    const lifeLeft = this.initialLifeSpan - this.age
    const scale = Math.max((lifeLeft / this.initialLifeSpan) * 2, 0)
    const radians = this.rotationSign * (lifeLeft / 5) * 0.0174533

    context.translate(this.position.x, this.position.y)
    context.rotate(radians)
    context.drawImage(
      this.image.canvas,
      (-this.image.width / 2) * scale,
      -this.image.height / 2,
      this.image.width * scale,
      this.image.height * scale
    )
    context.rotate(-radians)
    context.translate(-this.position.x, -this.position.y)

    return this.lifeSpan >= 0
  }
}

function createCanvasShellClass(className?: string) {
  return cn('relative h-full w-full overflow-hidden rounded-[inherit]', className)
}

export function FairyDustCursor({
  children,
  className,
  disabled,
  colors = ['#D61C59', '#E7D84B', '#1B8798'],
  fairySymbol = '*',
  maxParticles = 160,
}: FairyDustCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FairyParticle[]>([])
  const imagesRef = useRef<TextImage[]>([])
  const lastPointRef = useRef<Point | null>(null)
  const { rafRef, cancel } = useRafCleanup()
  const sizeRef = useCanvasSize(canvasRef, rootRef, canAnimate)

  useEffect(() => {
    if (!canAnimate) return
    imagesRef.current = colors.map((color) =>
      createTextImage(fairySymbol, '21px serif', color)
    )
  }, [canAnimate, colors, fairySymbol])

  function draw() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) {
      rafRef.current = null
      return
    }

    clearCanvas(context, sizeRef.current)
    particlesRef.current = particlesRef.current.filter((particle) =>
      particle.update(context)
    )

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      clearCanvas(context, sizeRef.current)
      rafRef.current = null
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    const images = imagesRef.current
    if (!root || !canAnimate || images.length === 0) return

    const point = getLocalPoint(root, event)
    const lastPoint = lastPointRef.current
    const distance = lastPoint
      ? Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y)
      : Number.POSITIVE_INFINITY

    if (distance <= 1.5) return
    lastPointRef.current = point
    particlesRef.current.push(
      new FairyParticle(
        point.x,
        point.y,
        images[Math.floor(Math.random() * images.length)]
      )
    )
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles)
    }
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(draw)
    }
  }

  useEffect(() => {
    if (canAnimate) return
    particlesRef.current = []
    lastPointRef.current = null
    cancel()
  }, [canAnimate, cancel])

  return (
    <div
      ref={rootRef}
      data-cursor-effect="fairy-dust-cursor"
      className={createCanvasShellClass(className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        lastPointRef.current = null
      }}
    >
      {children}
      {canAnimate && (
        <canvas
          ref={canvasRef}
          data-cursor-canvas="fairy-dust"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        />
      )}
    </div>
  )
}

export function BubbleCursor({
  children,
  className,
  disabled,
  fillColor = '#e6f1f7',
  strokeColor = '#3a92c5',
  maxParticles = 180,
}: BubbleCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<BubbleParticle[]>([])
  const { rafRef, cancel } = useRafCleanup()
  const sizeRef = useCanvasSize(canvasRef, rootRef, canAnimate)

  function draw() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) {
      rafRef.current = null
      return
    }

    clearCanvas(context, sizeRef.current)
    particlesRef.current = particlesRef.current.filter((particle) =>
      particle.update(context, fillColor, strokeColor)
    )

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      clearCanvas(context, sizeRef.current)
      rafRef.current = null
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !canAnimate) return

    const point = getLocalPoint(root, event)
    particlesRef.current.push(new BubbleParticle(point.x, point.y))
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles)
    }
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(draw)
    }
  }

  useEffect(() => {
    if (canAnimate) return
    particlesRef.current = []
    cancel()
  }, [canAnimate, cancel])

  return (
    <div
      ref={rootRef}
      data-cursor-effect="bubble-cursor"
      className={createCanvasShellClass(className)}
      onPointerMove={handlePointerMove}
    >
      {children}
      {canAnimate && (
        <canvas
          ref={canvasRef}
          data-cursor-canvas="bubble"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        />
      )}
    </div>
  )
}

export function CharacterCursor({
  children,
  className,
  disabled,
  characters = ['h', 'e', 'l', 'l', 'o'],
  colors = ['#6622CC', '#A755C2', '#B07C9E', '#B59194', '#D2A1B8'],
  font = '15px serif',
  cursorOffset = { x: 0, y: 0 },
  maxParticles = 170,
}: CharacterCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<CharacterParticle[]>([])
  const imagesRef = useRef<TextImage[]>([])
  const { rafRef, cancel } = useRafCleanup()
  const sizeRef = useCanvasSize(canvasRef, rootRef, canAnimate)

  useEffect(() => {
    if (!canAnimate) return
    imagesRef.current = characters.map((character) =>
      createTextImage(
        character,
        font,
        colors[Math.floor(Math.random() * colors.length)]
      )
    )
  }, [canAnimate, characters, colors, font])

  function draw() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) {
      rafRef.current = null
      return
    }

    clearCanvas(context, sizeRef.current)
    particlesRef.current = particlesRef.current.filter((particle) =>
      particle.update(context)
    )

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      clearCanvas(context, sizeRef.current)
      rafRef.current = null
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    const images = imagesRef.current
    if (!root || !canAnimate || images.length === 0) return

    const point = getLocalPoint(root, event)
    particlesRef.current.push(
      new CharacterParticle(
        point.x,
        point.y,
        images[Math.floor(Math.random() * images.length)],
        cursorOffset
      )
    )
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles)
    }
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(draw)
    }
  }

  useEffect(() => {
    if (canAnimate) return
    particlesRef.current = []
    cancel()
  }, [canAnimate, cancel])

  return (
    <div
      ref={rootRef}
      data-cursor-effect="character-cursor"
      className={createCanvasShellClass(className)}
      onPointerMove={handlePointerMove}
    >
      {children}
      {canAnimate && (
        <canvas
          ref={canvasRef}
          data-cursor-canvas="character"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        />
      )}
    </div>
  )
}

export const sourceAttribution = {
  mouseAnimations:
    'Adapted from tgomilar/mouse-animations MIT source and playground defaults.',
  cursorEffects:
    'Adapted from tholman/cursor-effects MIT source and demo defaults.',
} as const

export const cursorEffectBaseStyle = {
  isolation: 'isolate',
} satisfies CSSProperties
