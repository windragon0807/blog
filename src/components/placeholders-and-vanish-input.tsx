'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

type VanishParticle = {
  x: number
  y: number
  radius: number
  color: string
}

interface PlaceholdersAndVanishInputProps {
  placeholders: string[]
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (value: string, event: FormEvent<HTMLFormElement>) => void
  className?: string
  variant?: 'light' | 'glass'
}

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className,
  variant = 'light',
}: PlaceholdersAndVanishInputProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [value, setValue] = useState('')
  const [animating, setAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<VanishParticle[]>([])
  const isGlass = variant === 'glass'

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentPlaceholder((current) => (current + 1) % placeholders.length)
    }, 3000)

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        window.clearInterval(id)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [placeholders.length])

  const drawTextToParticles = useCallback(() => {
    const canvas = canvasRef.current
    const input = inputRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !input || !context) return

    canvas.width = 800
    canvas.height = 800
    context.clearRect(0, 0, canvas.width, canvas.height)

    const computedStyles = window.getComputedStyle(input)
    const fontSize = Number.parseFloat(computedStyles.fontSize)
    context.font = `${fontSize * 2}px ${computedStyles.fontFamily}`
    context.fillStyle = '#ffffff'
    context.fillText(value, 16, 40)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const particles: VanishParticle[] = []

    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const index = (y * canvas.width + x) * 4
        if (
          imageData.data[index] !== 0 ||
          imageData.data[index + 1] !== 0 ||
          imageData.data[index + 2] !== 0
        ) {
          particles.push({
            x,
            y,
            radius: 1,
            color: `rgba(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]}, ${imageData.data[index + 3]})`,
          })
        }
      }
    }

    particlesRef.current = particles
  }, [value])

  const animate = (start: number) => {
    const frame = (position = start) => {
      requestAnimationFrame(() => {
        const context = canvasRef.current?.getContext('2d')
        if (!context) return

        const nextParticles: VanishParticle[] = []

        for (const particle of particlesRef.current) {
          if (particle.x < position) {
            nextParticles.push(particle)
            continue
          }

          if (particle.radius <= 0) continue

          particle.x += Math.random() > 0.5 ? 1 : -1
          particle.y += Math.random() > 0.5 ? 1 : -1
          particle.radius -= 0.05 * Math.random()
          nextParticles.push(particle)
        }

        particlesRef.current = nextParticles
        context.clearRect(position, 0, 800, 800)
        for (const particle of particlesRef.current) {
          if (particle.x > position) {
            context.beginPath()
            context.rect(particle.x, particle.y, particle.radius, particle.radius)
            context.fillStyle = particle.color
            context.strokeStyle = particle.color
            context.stroke()
          }
        }

        if (particlesRef.current.length > 0) {
          frame(position - 8)
        } else {
          setValue('')
          setAnimating(false)
        }
      })
    }

    frame(start)
  }

  const vanish = () => {
    if (!value || animating) return

    setAnimating(true)
    drawTextToParticles()
    const maxX = particlesRef.current.reduce(
      (previous, current) => (current.x > previous ? current.x : previous),
      0
    )
    animate(maxX)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!value.trim()) return

    const submittedValue = value
    vanish()
    onSubmit?.(submittedValue, event)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative mx-auto h-12 w-full max-w-xl overflow-hidden rounded-full transition duration-200',
        isGlass
          ? 'border border-white/10 bg-white/[0.08] text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur-md'
          : 'bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:bg-zinc-800',
        value && (isGlass ? 'bg-white/[0.11]' : 'bg-zinc-50'),
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          'pointer-events-none absolute left-2 top-[20%] origin-top-left scale-50 pr-20 text-base filter sm:left-4',
          !isGlass && 'invert dark:invert-0',
          animating ? 'opacity-100' : 'opacity-0'
        )}
      />
      <input
        ref={inputRef}
        value={value}
        type="text"
        onChange={(event) => {
          if (animating) return
          setValue(event.target.value)
          onChange?.(event)
        }}
        className={cn(
          'relative z-50 h-full w-full rounded-full border-none bg-transparent pl-4 pr-20 text-sm outline-none focus:outline-none focus:ring-0 sm:pl-6 sm:text-base',
          isGlass ? 'text-white placeholder:text-white/45' : 'text-black dark:text-white',
          animating && 'text-transparent dark:text-transparent'
        )}
      />
      <button
        disabled={!value}
        type="submit"
        className={cn(
          'absolute right-2 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition duration-200',
          isGlass
            ? 'border border-white/10 bg-white/[0.10] text-white/75 disabled:bg-white/[0.05] disabled:text-white/28'
            : 'bg-black text-zinc-300 disabled:bg-zinc-100 dark:bg-zinc-900 dark:disabled:bg-zinc-800'
        )}
        aria-label="Submit"
      >
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <motion.path
            d="M5 12h14"
            initial={{ strokeDasharray: '50%', strokeDashoffset: '50%' }}
            animate={{ strokeDashoffset: value ? 0 : '50%' }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
          <path d="m13 18 6-6" />
          <path d="m13 6 6 6" />
        </motion.svg>
      </button>
      <div className="pointer-events-none absolute inset-0 flex items-center rounded-full">
        <AnimatePresence mode="wait">
          {!value ? (
            <motion.p
              key={`placeholder-${currentPlaceholder}`}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'linear' }}
              className={cn(
                'w-[calc(100%-2rem)] truncate pl-4 text-left text-sm font-normal sm:pl-6 sm:text-base',
                isGlass ? 'text-white/45' : 'text-neutral-500 dark:text-zinc-500'
              )}
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  )
}
