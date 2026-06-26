'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type PixelSample = {
  x: number
  y: number
  r: number
  g: number
  b: number
  a: number
  drop: boolean
  seed: number
}

interface PixelatedCanvasProps {
  src?: string
  width?: number
  height?: number
  cellSize?: number
  dotScale?: number
  shape?: 'circle' | 'square'
  backgroundColor?: string
  grayscale?: boolean
  responsive?: boolean
  dropoutStrength?: number
  interactive?: boolean
  distortionStrength?: number
  distortionRadius?: number
  distortionMode?: 'repel' | 'attract' | 'swirl'
  followSpeed?: number
  sampleAverage?: boolean
  tintColor?: string
  tintStrength?: number
  maxFps?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  jitterStrength?: number
  jitterSpeed?: number
  fadeOnLeave?: boolean
  fadeSpeed?: number
  className?: string
}

const fallbackSource =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 520%22%3E%3Cdefs%3E%3CradialGradient id=%22a%22 cx=%2230%25%22 cy=%2225%25%22 r=%2270%25%22%3E%3Cstop stop-color=%22%23f9a8d4%22/%3E%3Cstop offset=%22.45%22 stop-color=%22%2393c5fd%22/%3E%3Cstop offset=%221%22 stop-color=%22%2318181b%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=%22800%22 height=%22520%22 fill=%22url(%23a)%22/%3E%3Ccircle cx=%22560%22 cy=%22140%22 r=%22110%22 fill=%22%23fde047%22 opacity=%22.85%22/%3E%3Crect x=%22120%22 y=%22280%22 width=%22420%22 height=%22120%22 rx=%2260%22 fill=%22%23ffffff%22 opacity=%22.8%22/%3E%3C/svg%3E'

export function PixelatedCanvas({
  src = fallbackSource,
  width = 400,
  height = 500,
  cellSize = 4,
  dotScale = 0.9,
  shape = 'square',
  backgroundColor = '#000000',
  grayscale = false,
  responsive = false,
  dropoutStrength = 0.35,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = 'swirl',
  followSpeed = 0.2,
  sampleAverage = true,
  tintColor = '#ffffff',
  tintStrength = 0.12,
  maxFps = 60,
  objectFit = 'cover',
  jitterStrength = 4,
  jitterSpeed = 4,
  fadeOnLeave = true,
  fadeSpeed = 0.1,
  className,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const samplesRef = useRef<PixelSample[]>([])
  const dimsRef = useRef({ width, height, dot: Math.max(1, cellSize * dotScale) })
  const targetMouseRef = useRef({ x: -9999, y: -9999 })
  const animMouseRef = useRef({ x: -9999, y: -9999 })
  const activityRef = useRef(0)
  const activityTargetRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src

    const parseRgb = (color: string): [number, number, number] | null => {
      if (color.startsWith('#')) {
        const hex = color.slice(1)
        const normalized =
          hex.length === 3
            ? hex
                .split('')
                .map((value) => value + value)
                .join('')
            : hex

        return [
          Number.parseInt(normalized.slice(0, 2), 16),
          Number.parseInt(normalized.slice(2, 4), 16),
          Number.parseInt(normalized.slice(4, 6), 16),
        ]
      }

      const match = color.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i)
      return match
        ? [
            Number.parseInt(match[1], 10),
            Number.parseInt(match[2], 10),
            Number.parseInt(match[3], 10),
          ]
        : null
    }

    const hash2D = (x: number, y: number) => {
      const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123
      return value - Math.floor(value)
    }

    const compute = () => {
      if (cancelled) return
      const parent = canvas.parentElement
      const parentRect = parent?.getBoundingClientRect()
      const displayWidth = responsive && parentRect?.width ? parentRect.width : width
      const displayHeight = responsive && parentRect?.height ? parentRect.height : height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.max(1, Math.floor(displayWidth * dpr))
      canvas.height = Math.max(1, Math.floor(displayHeight * dpr))
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.resetTransform()
      ctx.scale(dpr, dpr)

      const offscreen = document.createElement('canvas')
      offscreen.width = Math.max(1, Math.floor(displayWidth))
      offscreen.height = Math.max(1, Math.floor(displayHeight))
      const offscreenContext = offscreen.getContext('2d')
      if (!offscreenContext) return

      const sourceWidth = image.naturalWidth || displayWidth
      const sourceHeight = image.naturalHeight || displayHeight
      let drawWidth = displayWidth
      let drawHeight = displayHeight
      let drawX = 0
      let drawY = 0

      if (objectFit === 'cover') {
        const scale = Math.max(displayWidth / sourceWidth, displayHeight / sourceHeight)
        drawWidth = Math.ceil(sourceWidth * scale)
        drawHeight = Math.ceil(sourceHeight * scale)
        drawX = Math.floor((displayWidth - drawWidth) / 2)
        drawY = Math.floor((displayHeight - drawHeight) / 2)
      } else if (objectFit === 'contain') {
        const scale = Math.min(displayWidth / sourceWidth, displayHeight / sourceHeight)
        drawWidth = Math.ceil(sourceWidth * scale)
        drawHeight = Math.ceil(sourceHeight * scale)
        drawX = Math.floor((displayWidth - drawWidth) / 2)
        drawY = Math.floor((displayHeight - drawHeight) / 2)
      } else if (objectFit === 'none') {
        drawWidth = sourceWidth
        drawHeight = sourceHeight
        drawX = Math.floor((displayWidth - drawWidth) / 2)
        drawY = Math.floor((displayHeight - drawHeight) / 2)
      }

      offscreenContext.drawImage(image, drawX, drawY, drawWidth, drawHeight)

      let imageData: ImageData
      try {
        imageData = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height)
      } catch {
        ctx.drawImage(image, 0, 0, displayWidth, displayHeight)
        return
      }

      const data = imageData.data
      const stride = offscreen.width * 4
      const dot = Math.max(1, Math.floor(cellSize * dotScale))
      const tint = tintColor && tintStrength > 0 ? parseRgb(tintColor) : null
      const samples: PixelSample[] = []

      const luminanceAt = (x: number, y: number) => {
        const safeX = Math.max(0, Math.min(offscreen.width - 1, x))
        const safeY = Math.max(0, Math.min(offscreen.height - 1, y))
        const index = safeY * stride + safeX * 4
        return data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722
      }

      for (let y = 0; y < offscreen.height; y += cellSize) {
        const centerY = Math.min(offscreen.height - 1, y + Math.floor(cellSize / 2))

        for (let x = 0; x < offscreen.width; x += cellSize) {
          const centerX = Math.min(offscreen.width - 1, x + Math.floor(cellSize / 2))
          let r = 0
          let g = 0
          let b = 0
          let a = 0

          if (sampleAverage) {
            let count = 0
            for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
              for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
                const sampleX = Math.max(0, Math.min(offscreen.width - 1, centerX + offsetX))
                const sampleY = Math.max(0, Math.min(offscreen.height - 1, centerY + offsetY))
                const index = sampleY * stride + sampleX * 4
                r += data[index]
                g += data[index + 1]
                b += data[index + 2]
                a += data[index + 3] / 255
                count += 1
              }
            }
            r = Math.round(r / count)
            g = Math.round(g / count)
            b = Math.round(b / count)
            a /= count
          } else {
            const index = centerY * stride + centerX * 4
            r = data[index]
            g = data[index + 1]
            b = data[index + 2]
            a = data[index + 3] / 255
          }

          if (grayscale) {
            const luminance = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)
            r = luminance
            g = luminance
            b = luminance
          } else if (tint) {
            const mix = Math.max(0, Math.min(1, tintStrength))
            r = Math.round(r * (1 - mix) + tint[0] * mix)
            g = Math.round(g * (1 - mix) + tint[1] * mix)
            b = Math.round(b * (1 - mix) + tint[2] * mix)
          }

          const centerLuminance = luminanceAt(centerX, centerY)
          const gradient =
            Math.abs(luminanceAt(centerX + 1, centerY) - luminanceAt(centerX - 1, centerY)) +
            Math.abs(luminanceAt(centerX, centerY + 1) - luminanceAt(centerX, centerY - 1))
          const gradientNorm = Math.max(0, Math.min(1, gradient / 255))
          const dropoutProbability = Math.max(
            0,
            Math.min(1, (1 - gradientNorm) * dropoutStrength * (centerLuminance / 255))
          )

          samples.push({
            x,
            y,
            r,
            g,
            b,
            a,
            drop: hash2D(centerX, centerY) < dropoutProbability,
            seed: hash2D(centerX, centerY),
          })
        }
      }

      dimsRef.current = { width: displayWidth, height: displayHeight, dot }
      samplesRef.current = samples
    }

    const draw = (time: number) => {
      const ctx = canvas.getContext('2d')
      const dims = dimsRef.current
      const minDelta = 1000 / Math.max(1, maxFps)

      if (!ctx || time - lastFrameRef.current < minDelta) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      lastFrameRef.current = time
      animMouseRef.current.x += (targetMouseRef.current.x - animMouseRef.current.x) * followSpeed
      animMouseRef.current.y += (targetMouseRef.current.y - animMouseRef.current.y) * followSpeed
      activityRef.current += (activityTargetRef.current - activityRef.current) * fadeSpeed

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, dims.width, dims.height)
      } else {
        ctx.clearRect(0, 0, dims.width, dims.height)
      }

      const mx = animMouseRef.current.x
      const my = animMouseRef.current.y
      const sigma = Math.max(1, distortionRadius * 0.5)
      const jitterTime = time * 0.001 * jitterSpeed
      const activity = interactive ? Math.max(0, Math.min(1, activityRef.current)) : 0

      for (const sample of samplesRef.current) {
        if (sample.drop || sample.a <= 0) continue

        let drawX = sample.x + cellSize / 2
        let drawY = sample.y + cellSize / 2
        const dx = drawX - mx
        const dy = drawY - my
        const dist2 = dx * dx + dy * dy
        const influence = Math.exp(-dist2 / (2 * sigma * sigma)) * activity

        if (influence > 0.0005) {
          if (distortionMode === 'repel' || distortionMode === 'attract') {
            const dist = Math.sqrt(dist2) + 0.0001
            const direction = distortionMode === 'repel' ? 1 : -1
            drawX += (dx / dist) * distortionStrength * influence * direction
            drawY += (dy / dist) * distortionStrength * influence * direction
          } else {
            const angle = distortionStrength * 0.05 * influence
            const cosA = Math.cos(angle)
            const sinA = Math.sin(angle)
            drawX = mx + (cosA * dx - sinA * dy)
            drawY = my + (sinA * dx + cosA * dy)
          }

          drawX += Math.sin(jitterTime + sample.seed * 43758.5453) * jitterStrength * influence
          drawY += Math.cos(jitterTime + sample.seed * 49442.31) * jitterStrength * influence
        }

        ctx.globalAlpha = sample.a
        ctx.fillStyle = `rgb(${sample.r}, ${sample.g}, ${sample.b})`

        if (shape === 'circle') {
          ctx.beginPath()
          ctx.arc(drawX, drawY, dims.dot / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(drawX - dims.dot / 2, drawY - dims.dot / 2, dims.dot, dims.dot)
        }
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
      activityTargetRef.current = 1
    }
    const handlePointerLeave = () => {
      if (fadeOnLeave) {
        activityTargetRef.current = 0
      } else {
        targetMouseRef.current = { x: -9999, y: -9999 }
        activityTargetRef.current = 0
      }
    }

    image.onload = () => {
      compute()
      canvas.addEventListener('pointermove', handlePointerMove)
      canvas.addEventListener('pointerleave', handlePointerLeave)
      rafRef.current = requestAnimationFrame(draw)
    }

    const observer =
      responsive && canvas.parentElement
        ? new ResizeObserver(() => {
            if (image.complete) compute()
          })
        : null

    if (observer && canvas.parentElement) {
      observer.observe(canvas.parentElement)
    }

    return () => {
      cancelled = true
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      observer?.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [
    backgroundColor,
    cellSize,
    distortionMode,
    distortionRadius,
    distortionStrength,
    dotScale,
    dropoutStrength,
    fadeOnLeave,
    fadeSpeed,
    followSpeed,
    grayscale,
    height,
    interactive,
    jitterSpeed,
    jitterStrength,
    maxFps,
    objectFit,
    responsive,
    sampleAverage,
    shape,
    src,
    tintColor,
    tintStrength,
    width,
  ])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block rounded-[inherit]', className)}
      aria-label="Pixelated rendering of source image"
      role="img"
    />
  )
}
