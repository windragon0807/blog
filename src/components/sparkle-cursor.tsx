'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

interface SparkleParticle {
  id: number
  x: number
  y: number
  sy: number
  b: number
  r: number
  size: number
  scale: number
  alpha: number
}

interface SparkleGlow {
  id: string
  x: number
  y: number
  size: number
  scale: number
}

interface SparkleCursorProps {
  children?: ReactNode
  color?: string
  className?: string
  fullScreen?: boolean
  distance?: number
  glow?: boolean
}

function createStarUrl(color: string) {
  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${color}">
      <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
    </svg>
  `

  return URL.createObjectURL(
    new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  )
}

function drawFallbackStar(
  context: CanvasRenderingContext2D,
  size: number,
  color: string
) {
  const outerRadius = size / 2
  const innerRadius = outerRadius * 0.45

  context.beginPath()
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outerRadius : innerRadius
    const angle = -Math.PI / 2 + (point * Math.PI) / 5
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (point === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.closePath()
  context.fillStyle = color
  context.fill()
}

export function SparkleCursor({
  children,
  color = 'hsl(40 90% 80%)',
  className,
  fullScreen = false,
  distance = 50,
  glow = true,
}: SparkleCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<SparkleParticle[]>([])
  const glowsRef = useRef<SparkleGlow[]>([])
  const distanceRef = useRef(0)
  const lastPointRef = useRef<[number, number] | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const context = canvas.getContext('2d')
    if (!context) return

    let disposed = false
    let imageLoaded = false
    const starUrl = createStarUrl(color)
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      imageLoaded = image.naturalWidth > 0
    }
    image.onerror = () => {
      imageLoaded = false
    }
    image.src = starUrl

    if (image.decode) {
      void image.decode().then(
        () => {
          if (!disposed) imageLoaded = image.naturalWidth > 0
        },
        () => {
          if (!disposed) imageLoaded = false
        }
      )
    }

    const getRect = () =>
      fullScreen
        ? {
            width: window.innerWidth,
            height: window.innerHeight,
            left: 0,
            top: 0,
          }
        : root.getBoundingClientRect()

    const resize = () => {
      const rect = getRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    const render = () => {
      const ratio = window.devicePixelRatio || 1
      context.clearRect(0, 0, canvas.width, canvas.height)

      for (const sparkleGlow of glowsRef.current) {
        context.beginPath()
        context.arc(
          sparkleGlow.x,
          sparkleGlow.y,
          sparkleGlow.size * sparkleGlow.scale * ratio,
          0,
          Math.PI * 2
        )
        context.fillStyle = 'hsl(265 90% 80% / 0.2)'
        context.fill()
      }

      for (const particle of particlesRef.current) {
        context.save()
        context.globalAlpha = particle.alpha
        context.filter = `brightness(${particle.sy < 0 ? particle.b + 0.5 : particle.b})`
        context.translate(particle.x * ratio, particle.y * ratio)
        context.rotate(particle.r * (Math.PI / 180))
        context.scale(1, particle.sy)

        const size = particle.size * particle.scale * ratio
        if (imageLoaded && image.complete && image.naturalWidth > 0) {
          context.drawImage(image, size * -0.5, size * -0.5, size, size)
        } else {
          drawFallbackStar(context, size, color)
        }
        context.restore()
      }
    }

    const paint = (event: PointerEvent) => {
      const rect = getRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const ratio = window.devicePixelRatio || 1

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return

      if (lastPointRef.current) {
        const moved = Math.hypot(x - lastPointRef.current[0], y - lastPointRef.current[1])
        if (!Number.isNaN(moved)) distanceRef.current += moved
      }

      lastPointRef.current = [x, y]

      if (glow) {
        const sparkleGlow: SparkleGlow = {
          id: `glow-${Date.now()}-${Math.random()}`,
          size: 30,
          scale: 1,
          x: x * ratio,
          y: y * ratio,
        }

        glowsRef.current.push(sparkleGlow)
        gsap.to(sparkleGlow, {
          duration: 0.2,
          scale: 0,
          onComplete: () => {
            glowsRef.current = glowsRef.current.filter((item) => item.id !== sparkleGlow.id)
          },
        })
      }

      if (distanceRef.current < distance) return
      distanceRef.current = 0

      const particle: SparkleParticle = {
        id: Date.now() + Math.random(),
        x,
        y,
        sy: Math.random() > 0.5 ? 1 : -1,
        b: gsap.utils.random(0.5, 1.5),
        r: gsap.utils.random(0, 359, 1),
        size: gsap.utils.random(10, 40, 1),
        scale: 1,
        alpha: 1,
      }

      const spin = gsap.to(particle, {
        sy: particle.sy < 0 ? 1 : -1,
        duration: gsap.utils.random(0.1, 0.5),
        repeat: gsap.utils.random(0, 10, 1),
      })

      gsap.to(particle, {
        duration: gsap.utils.random(0.5, 2.5),
        r: particle.r + gsap.utils.random(-45, 45, 1),
        y: y + gsap.utils.random(50, 350, 1),
        alpha: 0,
        scale: 0,
        onComplete: () => {
          spin.kill()
          particlesRef.current = particlesRef.current.filter((item) => item.id !== particle.id)
        },
      })

      particlesRef.current.push(particle)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root)
    window.addEventListener('resize', resize)
    root.addEventListener('pointermove', paint)
    gsap.ticker.add(render)

    return () => {
      disposed = true
      root.removeEventListener('pointermove', paint)
      window.removeEventListener('resize', resize)
      resizeObserver.disconnect()
      gsap.ticker.remove(render)
      particlesRef.current = []
      glowsRef.current = []
      URL.revokeObjectURL(starUrl)
    }
  }, [color, distance, fullScreen, glow])

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[inherit]',
        fullScreen && 'fixed inset-0 z-[99999]',
        className
      )}
      onPointerLeave={() => {
        lastPointRef.current = null
        distanceRef.current = 0
      }}
    >
      {children}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
    </div>
  )
}
