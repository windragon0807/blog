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

export interface CanvasCursorProps extends CursorEffectBaseProps {
  trails?: number
  nodeCount?: number
  friction?: number
  dampening?: number
  tension?: number
  lineWidth?: number
  hueOffset?: number
  hueAmplitude?: number
  hueFrequency?: number
  opacity?: number
}

export interface FluidCursorProps extends CursorEffectBaseProps {
  colors?: string[]
  densityDissipation?: number
  velocityDissipation?: number
  splatRadius?: number
  splatForce?: number
  colorUpdateSpeed?: number
  maxSplats?: number
  blur?: number
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

function useRenderActive(
  rootRef: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  const [renderVisible, setRenderVisible] = useState(true)

  useEffect(() => {
    if (!active) return

    const root = rootRef.current
    if (!root) return

    let intersectionVisible = true
    let contentVisible = true
    let intersectionObserver: IntersectionObserver | null = null

    const sync = () => {
      setRenderVisible(intersectionVisible && contentVisible)
    }
    const handleContentVisibility = (event: Event) => {
      contentVisible = !(event as Event & { skipped?: boolean }).skipped
      sync()
    }

    root.addEventListener(
      'contentvisibilityautostatechange',
      handleContentVisibility
    )

    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          intersectionVisible = entry.isIntersecting
          sync()
        },
        { rootMargin: '240px' }
      )
      intersectionObserver.observe(root)
    }

    return () => {
      root.removeEventListener(
        'contentvisibilityautostatechange',
        handleContentVisibility
      )
      intersectionObserver?.disconnect()
    }
  }, [active, rootRef])

  return active && renderVisible
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

interface CanvasTrailNode extends Point {
  vx: number
  vy: number
}

class CanvasCursorHue {
  phase: number
  offset: number
  frequency: number
  amplitude: number

  constructor({
    phase,
    offset,
    frequency,
    amplitude,
  }: {
    phase: number
    offset: number
    frequency: number
    amplitude: number
  }) {
    this.phase = phase
    this.offset = offset
    this.frequency = frequency
    this.amplitude = amplitude
  }

  update() {
    this.phase += this.frequency
    return this.offset + Math.sin(this.phase) * this.amplitude
  }
}

class CanvasCursorLine {
  spring: number
  friction: number
  dampening: number
  tension: number
  nodes: CanvasTrailNode[]

  constructor({
    start,
    spring,
    friction,
    dampening,
    tension,
    nodeCount,
  }: {
    start: Point
    spring: number
    friction: number
    dampening: number
    tension: number
    nodeCount: number
  }) {
    this.spring = spring + 0.1 * Math.random() - 0.02
    this.friction = friction + 0.01 * Math.random() - 0.002
    this.dampening = dampening
    this.tension = tension
    this.nodes = Array.from({ length: nodeCount }, () => ({
      x: start.x,
      y: start.y,
      vx: 0,
      vy: 0,
    }))
  }

  update(target: Point) {
    let spring = this.spring
    let energy = 0
    let node = this.nodes[0]

    node.vx += (target.x - node.x) * spring
    node.vy += (target.y - node.y) * spring

    for (let index = 0; index < this.nodes.length; index += 1) {
      node = this.nodes[index]

      if (index > 0) {
        const previousNode = this.nodes[index - 1]
        node.vx += (previousNode.x - node.x) * spring
        node.vy += (previousNode.y - node.y) * spring
        node.vx += previousNode.vx * this.dampening
        node.vy += previousNode.vy * this.dampening
      }

      node.vx *= this.friction
      node.vy *= this.friction
      node.x += node.vx
      node.y += node.vy
      spring *= this.tension
      energy += Math.abs(node.vx) + Math.abs(node.vy)
    }

    return energy
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.nodes.length < 2) return

    let node = this.nodes[0]
    let x = node.x
    let y = node.y

    context.beginPath()
    context.moveTo(x, y)

    for (let index = 1; index < this.nodes.length - 2; index += 1) {
      node = this.nodes[index]
      const nextNode = this.nodes[index + 1]
      x = 0.5 * (node.x + nextNode.x)
      y = 0.5 * (node.y + nextNode.y)
      context.quadraticCurveTo(node.x, node.y, x, y)
    }

    const secondLastNode = this.nodes[this.nodes.length - 2]
    const lastNode = this.nodes[this.nodes.length - 1]
    context.quadraticCurveTo(
      secondLastNode.x,
      secondLastNode.y,
      lastNode.x,
      lastNode.y
    )
    context.stroke()
    context.closePath()
  }
}

function parseHexColor(hexColor: string) {
  const normalized = hexColor.replace('#', '').trim()
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized.padEnd(6, '0').slice(0, 6)
  const numericValue = Number.parseInt(value, 16)

  return {
    r: (numericValue >> 16) & 255,
    g: (numericValue >> 8) & 255,
    b: numericValue & 255,
  }
}

class FluidSplat {
  position: Point
  velocity: Point
  radius: number
  color: string
  alpha = 0.72
  age = 0

  constructor({
    point,
    velocity,
    radius,
    color,
  }: {
    point: Point
    velocity: Point
    radius: number
    color: string
  }) {
    this.position = { ...point }
    this.velocity = { ...velocity }
    this.radius = radius
    this.color = color
  }

  update({
    densityDissipation,
    velocityDissipation,
  }: {
    densityDissipation: number
    velocityDissipation: number
  }) {
    const drag = Math.max(0.84, 1 - velocityDissipation * 0.006)

    this.age += 1
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.x *= drag
    this.velocity.y *= drag
    this.radius += Math.max(0.22, this.radius * 0.006)
    this.alpha *= Math.max(0.92, 1 - densityDissipation * 0.008)

    return this.alpha > 0.012 && this.radius < 360
  }

  draw(context: CanvasRenderingContext2D) {
    const { r, g, b } = parseHexColor(this.color)
    const gradient = context.createRadialGradient(
      this.position.x,
      this.position.y,
      0,
      this.position.x,
      this.position.y,
      this.radius
    )

    gradient.addColorStop(0, `rgba(${r},${g},${b},${this.alpha})`)
    gradient.addColorStop(
      0.42,
      `rgba(${r},${g},${b},${this.alpha * 0.34})`
    )
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`)

    context.fillStyle = gradient
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }
}

export function CanvasCursor({
  children,
  className,
  disabled,
  trails = 20,
  nodeCount = 50,
  friction = 0.5,
  dampening = 0.25,
  tension = 0.98,
  lineWidth = 1,
  hueOffset = 285,
  hueAmplitude = 85,
  hueFrequency = 0.0015,
  opacity = 0.2,
}: CanvasCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderActive = useRenderActive(rootRef, canAnimate)
  const active = canAnimate && renderActive
  const { rafRef, cancel } = useRafCleanup()
  const sizeRef = useCanvasSize(canvasRef, rootRef, active)
  const targetRef = useRef<Point>({ x: 0, y: 0 })
  const linesRef = useRef<CanvasCursorLine[]>([])
  const idleFramesRef = useRef(0)
  const hueRef = useRef(
    new CanvasCursorHue({
      phase: Math.random() * Math.PI * 2,
      amplitude: hueAmplitude,
      frequency: hueFrequency,
      offset: hueOffset,
    })
  )

  useEffect(() => {
    hueRef.current = new CanvasCursorHue({
      phase: hueRef.current.phase,
      amplitude: hueAmplitude,
      frequency: hueFrequency,
      offset: hueOffset,
    })
  }, [hueAmplitude, hueFrequency, hueOffset])

  function initialize(point: Point) {
    targetRef.current = point
    const safeTrails = Math.max(1, Math.min(trails, 32))
    const safeNodeCount = Math.max(6, Math.min(nodeCount, 72))

    linesRef.current = Array.from({ length: safeTrails }, (_, index) => {
      const spring = 0.4 + (index / safeTrails) * 0.025
      return new CanvasCursorLine({
        start: point,
        spring,
        friction,
        dampening,
        tension,
        nodeCount: safeNodeCount,
      })
    })
  }

  function draw() {
    const context = canvasRef.current?.getContext('2d')
    if (!context || !active) {
      rafRef.current = null
      return
    }

    const size = sizeRef.current
    clearCanvas(context, size)
    context.globalCompositeOperation = 'lighter'
    context.strokeStyle = `hsla(${Math.round(
      hueRef.current.update()
    )},50%,50%,${opacity})`
    context.lineWidth = lineWidth

    let energy = 0
    for (const line of linesRef.current) {
      energy += line.update(targetRef.current)
      line.draw(context)
    }
    context.globalCompositeOperation = 'source-over'

    if (idleFramesRef.current > 0) idleFramesRef.current -= 1
    if (energy > 0.1 || idleFramesRef.current > 0) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      rafRef.current = null
    }
  }

  function start() {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(draw)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !active) return

    const point = getLocalPoint(root, event)
    if (linesRef.current.length === 0) initialize(point)
    targetRef.current = point
    idleFramesRef.current = 90
    start()
  }

  useEffect(() => {
    if (active) return
    linesRef.current = []
    idleFramesRef.current = 0
    cancel()
    const context = canvasRef.current?.getContext('2d')
    if (context) clearCanvas(context, sizeRef.current)
  }, [active, cancel, sizeRef])

  return (
    <div
      ref={rootRef}
      data-cursor-effect="canvas-cursor"
      className={createCanvasShellClass(className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        idleFramesRef.current = 45
      }}
      style={cursorEffectBaseStyle}
    >
      {children}
      {canAnimate && (
        <canvas
          ref={canvasRef}
          data-cursor-canvas="cursify-canvas"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        />
      )}
    </div>
  )
}

export function FluidCursor({
  children,
  className,
  disabled,
  colors = ['#22d3ee', '#8b5cf6', '#ec4899', '#f97316'],
  densityDissipation = 3.5,
  velocityDissipation = 2,
  splatRadius = 0.2,
  splatForce = 6000,
  colorUpdateSpeed = 10,
  maxSplats = 96,
  blur = 18,
}: FluidCursorProps) {
  const canAnimate = useCanAnimate(disabled)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderActive = useRenderActive(rootRef, canAnimate)
  const active = canAnimate && renderActive
  const { rafRef, cancel } = useRafCleanup()
  const sizeRef = useCanvasSize(canvasRef, rootRef, active)
  const splatsRef = useRef<FluidSplat[]>([])
  const lastPointRef = useRef<Point | null>(null)
  const colorCursorRef = useRef(0)

  function getNextColor() {
    const safeColors = colors.length > 0 ? colors : ['#22d3ee']
    const tick = Math.max(1, Math.floor(60 / Math.max(colorUpdateSpeed, 1)))
    colorCursorRef.current += 1
    const index = Math.floor(colorCursorRef.current / tick) % safeColors.length

    return safeColors[index]
  }

  function pushSplat(point: Point, velocity: Point, radiusScale = 1) {
    const size = sizeRef.current
    const baseRadius =
      Math.max(24, Math.min(size.width, size.height) * splatRadius * 0.72) *
      radiusScale
    const forceScale = splatForce / 6000

    splatsRef.current.push(
      new FluidSplat({
        point,
        velocity: {
          x: velocity.x * 0.32 * forceScale,
          y: velocity.y * 0.32 * forceScale,
        },
        radius: Math.min(baseRadius, 132),
        color: getNextColor(),
      })
    )

    if (splatsRef.current.length > maxSplats) {
      splatsRef.current.splice(0, splatsRef.current.length - maxSplats)
    }
  }

  function draw() {
    const context = canvasRef.current?.getContext('2d')
    if (!context || !active) {
      rafRef.current = null
      return
    }

    const size = sizeRef.current
    context.save()
    context.globalCompositeOperation = 'destination-out'
    context.fillStyle = `rgba(0,0,0,${Math.min(
      0.34,
      densityDissipation * 0.018
    )})`
    context.fillRect(0, 0, size.width, size.height)
    context.restore()

    context.save()
    context.globalCompositeOperation = 'lighter'
    context.filter = blur > 0 ? `blur(${blur}px)` : 'none'
    splatsRef.current = splatsRef.current.filter((splat) => {
      const alive = splat.update({
        densityDissipation,
        velocityDissipation,
      })
      splat.draw(context)
      return alive
    })
    context.restore()

    if (splatsRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      clearCanvas(context, size)
      rafRef.current = null
    }
  }

  function start() {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(draw)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !active) return

    const point = getLocalPoint(root, event)
    const lastPoint = lastPointRef.current ?? point
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y)

    if (distance < 2) return
    pushSplat(point, {
      x: point.x - lastPoint.x,
      y: point.y - lastPoint.y,
    })
    lastPointRef.current = point
    start()
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current
    if (!root || !active) return

    const point = getLocalPoint(root, event)
    for (let index = 0; index < 5; index += 1) {
      pushSplat(
        point,
        {
          x: (Math.random() - 0.5) * 24,
          y: (Math.random() - 0.5) * 24,
        },
        1.2
      )
    }
    start()
  }

  useEffect(() => {
    if (active) return
    splatsRef.current = []
    lastPointRef.current = null
    cancel()
    const context = canvasRef.current?.getContext('2d')
    if (context) clearCanvas(context, sizeRef.current)
  }, [active, cancel, sizeRef])

  return (
    <div
      ref={rootRef}
      data-cursor-effect="fluid-cursor"
      className={createCanvasShellClass(className)}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={() => {
        lastPointRef.current = null
      }}
      style={cursorEffectBaseStyle}
    >
      {children}
      {canAnimate && (
        <canvas
          ref={canvasRef}
          data-cursor-canvas="cursify-fluid"
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
  cursify:
    'Adapted from Cursify canvas-cursor and fluid-cursor behavior with scoped rendering and bounded animation loops.',
} as const

export const cursorEffectBaseStyle = {
  isolation: 'isolate',
  contentVisibility: 'auto',
  containIntrinsicSize: 'auto 448px',
} satisfies CSSProperties
