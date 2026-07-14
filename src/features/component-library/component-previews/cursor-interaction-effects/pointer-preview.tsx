import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Pointer } from '@/components/pointer'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

function HeartPointer() {
  return (
    <motion.div
      animate={{
        scale: [0.8, 1, 0.8],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-pink-600"
      >
        <motion.path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  )
}

function PointerTile({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="relative flex h-36 flex-col items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white/[0.04] px-6 py-4">
      <div className="pointer-events-none flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        <p className="text-sm text-white/55">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

export function PointerPreview() {
  return (
    <DesktopOnlyPreview
      slug="pointer"
      title="Hover Pointer"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.24),transparent_55%)]"
    >
      <PreviewDemoSurface
        label="cursor effect"
        title="Hover Pointer"
        subtitle="custom pointer shapes"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.24),transparent_55%)]"
        contentClassName="max-w-3xl"
      >
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          <PointerTile title="Animated Pointer" description="Animated pointer">
            <Pointer>
              <HeartPointer />
            </Pointer>
          </PointerTile>
          <PointerTile title="Colored Pointer" description="Custom color">
            <Pointer className="fill-blue-500" />
          </PointerTile>
          <PointerTile title="Custom Shape" description="Custom SVG shape">
            <Pointer>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" className="fill-purple-500" />
                <circle cx="12" cy="12" r="5" className="fill-background" />
              </svg>
            </Pointer>
          </PointerTile>
          <PointerTile title="Text Pointer" description="Custom text">
            <Pointer>
              <div className="text-lg font-semibold text-rose-500">Click</div>
            </Pointer>
          </PointerTile>
        </div>
      </PreviewDemoSurface>
    </DesktopOnlyPreview>
  )
}
