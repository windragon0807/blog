'use client'

import { useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'motion/react'
import { cn } from '@/lib/utils'

type LinkPreviewProps = {
  children: ReactNode
  url?: string
  href?: string
  className?: string
  width?: number
  height?: number
  quality?: number
  isStatic?: boolean
  imageSrc?: string
  image?: string
  title?: string
  description?: string
}

export function LinkPreview({
  children,
  url,
  href,
  className,
  width = 200,
  height = 125,
  quality = 50,
  isStatic = false,
  imageSrc,
  image,
}: LinkPreviewProps) {
  const previewUrl = url ?? href ?? '#'
  const staticImage = imageSrc ?? image
  const [open, setOpen] = useState(false)
  const x = useMotionValue(0)
  const translateX = useSpring(x, { stiffness: 100, damping: 15 })

  const previewImage =
    isStatic && staticImage
      ? staticImage
      : staticImage ??
        `https://api.microlink.io/?${new URLSearchParams({
          url: previewUrl,
          screenshot: 'true',
          meta: 'false',
          embed: 'screenshot.url',
          colorScheme: 'dark',
          'viewport.isMobile': 'true',
          'viewport.deviceScaleFactor': '1',
          'viewport.width': String(width * 3),
          'viewport.height': String(height * 3),
          quality: String(quality),
        }).toString()}`

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewImage} width={width} height={height} alt="" />
      </span>
      <a
        href={previewUrl}
        className={cn('font-medium text-black dark:text-white', className)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          x.set((event.clientX - rect.left - rect.width / 2) / 2)
        }}
      >
        {children}
      </a>
      <AnimatePresence>
        {open ? (
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 260, damping: 20 },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            className="absolute bottom-full left-1/2 z-50 mb-3 block rounded-xl shadow-xl"
            style={{ x: translateX, width, height, marginLeft: -width / 2 }}
          >
            <span className="block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-zinc-200 dark:bg-zinc-950 dark:hover:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                width={width}
                height={height}
                alt=""
                className="rounded-lg object-cover"
                style={{ width, height }}
              />
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
