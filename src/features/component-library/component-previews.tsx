'use client'

import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  Copy,
  Download,
  Heart,
  PenLine,
  Settings,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react'
import { motion } from 'motion/react'
import { ThreeDImageCarousel } from '@/components/3d-image-carousel'
import { ThreeDMarquee } from '@/components/3d-marquee'
import { AnimatedCircularProgressBar } from '@/components/animated-circular-progress-bar'
import { AuroraText } from '@/components/aurora-text'
import { AvatarGroup } from '@/components/avatar-group'
import { BackgroundBoxes } from '@/components/background-boxes'
import { BubbleCursor } from '@/components/bubble-cursor'
import { CanvasCursor } from '@/components/canvas-cursor'
import { Carousel } from '@/components/carousel'
import { CharacterCursor } from '@/components/character-cursor'
import { ClickSpark } from '@/components/click-spark'
import { ConfettiButton } from '@/components/confetti'
import { Counter } from '@/components/counter'
import { CurvedLoop } from '@/components/curved-loop'
import { DataTable } from '@/components/data-table'
import { DiaTextReveal } from '@/components/dia-text-reveal'
import { ElasticSlider } from '@/components/elastic-slider'
import { FairyDustCursor } from '@/components/fairy-dust-cursor'
import { Tree, type TreeViewElement } from '@/components/file-tree'
import { FlowerMenu } from '@/components/flower-menu'
import { Folder } from '@/components/folder'
import { Highlighter } from '@/components/highlighter'
import { IconCloud } from '@/components/icon-cloud'
import { Keyboard } from '@/components/keyboard'
import { Lens } from '@/components/lens'
import { Magnet } from '@/components/magnet'
import { Marquee } from '@/components/marquee'
import { Meteors } from '@/components/meteors'
import { MouseCustomCursor } from '@/components/mouse-custom-cursor'
import { MouseInvertCursor } from '@/components/mouse-invert-cursor'
import { MouseRippleCursor } from '@/components/mouse-ripple-cursor'
import { MouseTrailCursor } from '@/components/mouse-trail-cursor'
import { MorphingText } from '@/components/morphing-text'
import { NumberTicker } from '@/components/number-ticker'
import { Particles } from '@/components/particles'
import {
  PhysicsNumberPicker,
  type PhysicsNumberPickerStyle,
} from '@/components/physics-number-picker'
import { PlaceholdersAndVanishInput } from '@/components/placeholders-and-vanish-input'
import { PlayfulTodoList } from '@/components/playful-todolist'
import { Pointer } from '@/components/pointer'
import { RippleButton } from '@/components/ripple-button'
import { ShinyButton } from '@/components/shiny-button'
import { SparkleCursor } from '@/components/sparkle-cursor'
import { Stack } from '@/components/stack'
import { TextFlip } from '@/components/text-flip'
import { ToggleTheme } from '@/components/toggle-theme'
import { TypingAnimation } from '@/components/typing-animation'
import { VideoText } from '@/components/video-text'
import { cn } from '@/lib/utils'
import type { ComponentSample } from './component-data'

type PreviewMode = 'interactive' | 'thumbnail'

const reviews = [
  {
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: 'John',
    username: '@john',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Jane',
    username: '@jane',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Jenny',
    username: '@jenny',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jenny',
  },
  {
    name: 'James',
    username: '@james',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/james',
  },
]

const iconCloudSlugs = [
  'typescript',
  'javascript',
  'react',
  'nextdotjs',
  'html5',
  'css3',
  'nodedotjs',
  'amazonaws',
  'postgresql',
  'firebase',
  'vercel',
  'testinglibrary',
  'jest',
  'cypress',
  'docker',
  'git',
  'github',
  'visualstudiocode',
  'figma',
]

const firstReviewRow = reviews.slice(0, reviews.length / 2)
const secondReviewRow = reviews.slice(reviews.length / 2)
const iconCloudImages = iconCloudSlugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
)
const fileTreeElements: TreeViewElement[] = [
  {
    id: 'app',
    name: 'app',
    children: [
      {
        id: 'app-components',
        name: 'components',
        children: [
          { id: 'app-components-page', name: 'page.tsx' },
          { id: 'app-components-layout', name: 'layout.tsx' },
        ],
      },
      { id: 'app-globals', name: 'globals.css' },
    ],
  },
  {
    id: 'components',
    name: 'components',
    children: [
      { id: 'ripple-button', name: 'ripple-button.tsx' },
      { id: 'file-tree', name: 'file-tree.tsx' },
      { id: 'shiny-button', name: 'shiny-button.tsx' },
    ],
  },
  {
    id: 'lib',
    name: 'lib',
    children: [{ id: 'lib-utils', name: 'utils.ts' }],
  },
]
const originalGradientColors = [
  '#60a5fa',
  '#a78bfa',
  '#f472b6',
] as const
const auroraOriginalColors = [
  '#f9a8d4',
  '#c4b5fd',
  '#93c5fd',
  '#a7f3d0',
] as const
const textFlipColors = [
  '#38bdf8',
  '#3b82f6',
  '#fb7185',
  '#fbbf24',
] as const
const auroraSparkColors = [...auroraOriginalColors, '#fcd34d', '#67e8f9'] as const
const cosmicParticleColors = [
  '#f9a8d4',
  '#c4b5fd',
  '#93c5fd',
  '#67e8f9',
  '#a7f3d0',
  '#fde68a',
] as const
const glassButtonClassName =
  'rounded-xl border border-white/12 bg-white/[0.08] px-7 text-sm font-semibold text-white shadow-[0_20px_60px_-34px_rgba(255,255,255,0.48)] backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.13]'
const glassStaticButtonClassName =
  'rounded-xl border border-white/12 bg-white/[0.08] px-7 text-sm font-semibold text-white shadow-[0_20px_60px_-34px_rgba(255,255,255,0.48)] backdrop-blur-md'
const glassIconButtonClassName =
  'border border-white/10 bg-white/[0.08] text-white shadow-[0_16px_48px_-30px_rgba(255,255,255,0.52)] backdrop-blur-md transition-colors hover:bg-white/[0.14]'
const folderPreviewColor =
  'color-mix(in srgb, var(--theme-accent-current) 64%, #f8fafc)'
const stackCardImages = [
  {
    src: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
    title: 'house',
  },
  {
    src: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
    title: 'beach',
  },
  {
    src: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
    title: 'mountain',
  },
  {
    src: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
    title: 'home',
  },
]
const stackCards = stackCardImages.map((image) => (
  <div
    key={image.title}
    className="h-full w-full overflow-hidden rounded-2xl bg-zinc-100"
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={image.src}
      alt={image.title}
      className="pointer-events-none h-full w-full object-cover"
    />
  </div>
)) satisfies ReactNode[]
const previewImages = [
  {
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
    alt: 'Workspace',
  },
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    alt: 'Laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
    alt: 'Architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=600&q=80',
    alt: 'Desk',
  },
]
const avatarItems = [
  {
    src: 'https://pbs.twimg.com/profile_images/1948770261848756224/oPwqXMD6_400x400.jpg',
    name: 'Skyleen',
    fallback: 'SK',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
    name: 'Shadcn',
    fallback: 'CN',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg',
    name: 'Adam Wathan',
    fallback: 'AW',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
    name: 'Guillermo Rauch',
    fallback: 'GR',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg',
    name: 'Jhey',
    fallback: 'JH',
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1927474594102784000/Al0g-I6o_400x400.jpg',
    name: 'David Haz',
    fallback: 'DH',
  },
]
const actionItems = [
  { label: 'Edit', icon: <PenLine className="h-4 w-4" /> },
  { label: 'Copy', icon: <Copy className="h-4 w-4" /> },
  { label: 'Share', icon: <Share2 className="h-4 w-4" /> },
  { label: 'Save', icon: <Heart className="h-4 w-4" /> },
  { label: 'Upload', icon: <Upload className="h-4 w-4" /> },
  { label: 'Download', icon: <Download className="h-4 w-4" /> },
  { label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  { label: 'Delete', icon: <Trash2 className="h-4 w-4" /> },
]
const tableColumns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'email', header: 'Email' },
] as const
const tableRows = [
  { name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
  { name: 'Michael Brown', role: 'CFO', status: 'Active', email: 'michael@acme.com' },
]
function ReviewCard({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) {
  return (
    <figure className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-4 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]">
      <div className="flex flex-row items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

function OuterEffectSurface({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative flex min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-background text-center text-foreground ${className}`}
    >
      {children}
    </div>
  )
}

function getUserFontFamily() {
  const rootStyles = window.getComputedStyle(document.documentElement)
  const userFont = rootStyles.getPropertyValue('--font-user').trim()

  return userFont || window.getComputedStyle(document.body).fontFamily || 'sans-serif'
}

function useUserFontFamily() {
  const [userFontFamily, setUserFontFamily] = useState('var(--font-user)')

  useEffect(() => {
    const syncFontFamily = () => {
      const nextFontFamily = getUserFontFamily()
      setUserFontFamily((currentFontFamily) =>
        currentFontFamily === nextFontFamily ? currentFontFamily : nextFontFamily
      )
    }
    const root = document.documentElement
    const observer = new MutationObserver(syncFontFamily)

    syncFontFamily()
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style', 'data-font-theme'],
    })
    window.addEventListener('storage', syncFontFamily)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', syncFontFamily)
    }
  }, [])

  return userFontFamily
}

function BackgroundBoxesPreview() {
  return (
    <PreviewDemoSurface
      label="ambient background"
      title="Hover Grid Background"
      subtitle="move across the grid"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.24),transparent_58%)]"
      overlay={
        <>
          <BackgroundBoxes />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(10,10,15,0.92)_76%)]" />
        </>
      }
    />
  )
}

function KeyboardPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Interactive Keyboard"
      subtitle="press keys or click keycaps"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24),transparent_55%)]"
      className="min-h-[44rem]"
      headingClassName="-translate-y-10 md:-translate-y-12"
      contentGapClassName="mt-3"
      contentClassName="max-w-5xl"
    >
      <Keyboard showPreview className="scale-[1.35] md:scale-[1.55]" />
    </PreviewDemoSurface>
  )
}

function PlaceholdersAndVanishInputPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Vanish Input"
      subtitle="submit to collapse the search"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.26),transparent_55%)]"
    >
      <PlaceholdersAndVanishInput
        variant="glass"
        className="max-w-md"
        placeholders={['Search components', 'Ask about registry', 'Find animations']}
      />
    </PreviewDemoSurface>
  )
}

function ThreeDMarqueePreview() {
  const marqueeImages = Array.from({ length: 8 }, () => previewImages)
    .flat()
    .map((image) => image.src)

  return (
    <PreviewDemoSurface
      label="content motion"
      title="Perspective Image Marquee"
      subtitle="perspective image strips"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_58%)]"
      className="min-h-[38rem]"
      overlay={
        <>
          <div className="absolute inset-0 opacity-55">
            <ThreeDMarquee
              images={marqueeImages}
              className="h-full rounded-[inherit]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,15,0.34),rgba(10,10,15,0.92)_78%)]" />
        </>
      }
    />
  )
}

function AvatarGroupPreview() {
  return (
    <PreviewDemoSurface
      label="content display"
      title="Hover Avatar Group"
      subtitle="compact people stack"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.24),transparent_55%)]"
      contentGapClassName="mt-16"
    >
      <AvatarGroup items={avatarItems} className="translate-y-7" />
    </PreviewDemoSurface>
  )
}

function PlayfulTodoListPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Animated Task List"
      subtitle="check tasks with motion"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.24),transparent_55%)]"
    >
      <PlayfulTodoList />
    </PreviewDemoSurface>
  )
}

function FlowerMenuPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Radial Action Menu"
      subtitle="open radial actions"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.24),transparent_55%)]"
    >
      <FlowerMenu
        items={actionItems}
        variant="glass"
      />
    </PreviewDemoSurface>
  )
}

function TextFlipPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <TextFlip
          prefix="Coding is"
          words={['fantastic', 'love', 'fire', 'awesome']}
          wordColors={textFlipColors}
          className="mx-auto gap-2 justify-center text-center [&>span:first-child]:!text-white"
          wordClassName="w-[9ch] justify-items-start text-left"
        />
      }
      subtitle="flip through short words"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.24),transparent_55%)]"
    />
  )
}

const toggleThemePreviewAnimations = [
  'circle-spread',
  'round-morph',
  'swipe-left',
  'swipe-up',
  'diag-down-right',
  'fade-in-out',
  'shrink-grow',
  'flip-x-in',
  'split-vertical',
  'swipe-right',
  'swipe-down',
  'wave-ripple',
] as const

function ToggleThemePreview() {
  return (
    <PreviewDemoSurface
      label="theme control"
      title="Theme Toggle"
      subtitle="switch with different transitions"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.22),transparent_55%)]"
      contentClassName="max-w-3xl"
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        {toggleThemePreviewAnimations.map((animationType) => (
          <ToggleTheme
            key={animationType}
            animationType={animationType}
            duration={360}
            label={animationType}
            variant="glass"
          />
        ))}
      </div>
    </PreviewDemoSurface>
  )
}

function ThreeDImageCarouselPreview() {
  return (
    <PreviewDemoSurface
      label="content media"
      title="Depth Image Carousel"
      subtitle="rotate through image cards"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.22),transparent_58%)]"
      className="min-h-[32rem]"
      contentClassName="max-w-6xl"
    >
      <div className="w-full max-w-5xl min-w-0 overflow-visible [&_[data-3d-image-carousel]]:!overflow-visible">
        <ThreeDImageCarousel
          items={previewImages}
          itemCount={3}
          className="w-full min-w-0"
        />
      </div>
    </PreviewDemoSurface>
  )
}

function SparkleCursorPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <SparkleCursor className="block w-full">
        <PreviewDemoSurface
          label="cursor effect"
          title="Sparkle Cursor Trail"
          subtitle="move to scatter sparkles"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.28),transparent_55%)]"
        />
      </SparkleCursor>
    </OuterEffectSurface>
  )
}

function DataTablePreview() {
  return (
    <PreviewDemoSurface
      label="data structure"
      title="Typed Data Table"
      subtitle="scan sortable rows"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.24),transparent_55%)]"
      contentClassName="max-w-5xl"
    >
      <DataTable columns={tableColumns} rows={tableRows} variant="dark" className="w-full max-w-4xl" />
    </PreviewDemoSurface>
  )
}

function PhysicsNumberPickerPreview() {
  const [value, setValue] = useState(24)

  return (
    <PreviewDemoSurface
      label="value control"
      title="Physics Number Picker"
      subtitle="drag or scroll to settle"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.26),transparent_56%)]"
      contentGapClassName="mt-7 sm:mt-8"
    >
      <div
        data-physics-picker-preview-stage=""
        className="relative isolate flex h-[17rem] w-[min(18rem,82vw)] items-center justify-center sm:h-[19rem]"
      >
        <div className="pointer-events-none absolute inset-x-8 top-10 h-28 rounded-full bg-teal-300/16 blur-3xl" />
        <PhysicsNumberPicker
          value={value}
          min={0}
          max={59}
          onValueChange={setValue}
          label="Pace seconds"
          itemHeight={48}
          visibleItems={5}
          className="!w-24 !rounded-[1.75rem] !bg-transparent !shadow-none sm:!w-28"
          style={{
            '--picker-fade-color': 'transparent',
            '--picker-selection-bg': 'rgba(255,255,255,0.11)',
            '--picker-selection-border': 'rgba(255,255,255,0.16)',
            '--picker-selection-highlight': 'rgba(255,255,255,0.26)',
            '--picker-selection-shadow': 'rgba(45,212,191,0.48)',
          } as PhysicsNumberPickerStyle}
          formatValue={(itemValue, isSelected) => (
            <span
              className={
                isSelected
                  ? 'text-[2.5rem] font-black tabular-nums text-white sm:text-[2.875rem]'
                  : 'text-[2.1rem] font-black tabular-nums text-white/35 sm:text-[2.45rem]'
              }
            >
              {String(itemValue).padStart(2, '0')}
            </span>
          )}
        />
      </div>
    </PreviewDemoSurface>
  )
}

function PreviewDemoSurface({
  label = 'component preview',
  title,
  subtitle,
  accentClassName,
  children,
  overlay,
  className,
  headingClassName,
  contentGapClassName,
  contentClassName,
}: {
  label?: string
  title: ReactNode
  subtitle: string
  accentClassName: string
  children?: ReactNode
  overlay?: ReactNode
  className?: string
  headingClassName?: string
  contentGapClassName?: string
  contentClassName?: string
}) {
  return (
    <div
      data-preview-demo-surface=""
      className={cn(
        'relative flex min-h-[22rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-[#0a0a0f] px-4 py-9 text-center text-white sm:min-h-[24rem] sm:px-6 sm:py-12 md:min-h-[28rem] md:px-8 md:py-16 lg:py-20',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_62%)]" />
      <div className={cn('pointer-events-none absolute inset-0 opacity-30', accentClassName)} />
      {overlay}
      <div className={cn('relative z-10 flex max-w-xl flex-col items-center', contentClassName)}>
        <div className={cn('flex flex-col items-center', headingClassName)}>
          <p className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/60 sm:text-xs sm:tracking-[0.18em]">
            {label}
          </p>
          <div
            data-preview-demo-title=""
            className="mt-4 max-w-full text-balance text-3xl font-semibold leading-[1.05] tracking-normal sm:text-4xl md:text-5xl"
          >
            {title}
          </div>
          <p className="mt-2 text-xs italic tracking-wide text-white/52 sm:mt-3 sm:text-sm">
            {subtitle}
          </p>
        </div>
        {children ? (
          <div
            data-preview-demo-content=""
            className={cn('mt-7 flex w-full items-center justify-center sm:mt-10', contentGapClassName)}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function MouseInvertCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <MouseInvertCursor
        size={50}
        smoothness={0.08}
        disabled={mode === 'thumbnail'}
      >
        <PreviewDemoSurface
          label="cursor effect"
          title="Invert"
          subtitle="move to invert the surface"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.34),transparent_55%)]"
        />
      </MouseInvertCursor>
    </OuterEffectSurface>
  )
}

function MouseTrailCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <MouseTrailCursor
        color="#c084fc"
        size={5}
        length={20}
        decay={0.05}
        blur={0}
        disabled={mode === 'thumbnail'}
      >
        <PreviewDemoSurface
          label="cursor effect"
          title="Trail"
          subtitle="fading dots follow your cursor"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.32),transparent_55%)]"
        />
      </MouseTrailCursor>
    </OuterEffectSurface>
  )
}

function MouseRippleCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <MouseRippleCursor
        color="rgba(96,165,250,0.60)"
        duration={600}
        maxSize={150}
        disabled={mode === 'thumbnail'}
      >
        <PreviewDemoSurface
          label="cursor effect"
          title="Ripple"
          subtitle="click to expand"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.34),transparent_55%)]"
        />
      </MouseRippleCursor>
    </OuterEffectSurface>
  )
}

function MouseCustomCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <MouseCustomCursor
        innerSize={6}
        outerSize={36}
        innerColor="#34d399"
        outerColor="rgba(52,211,153,0.3)"
        smoothness={0.15}
        disabled={mode === 'thumbnail'}
      >
        <PreviewDemoSurface
          label="cursor effect"
          title="Custom Cursor"
          subtitle="dot + ring following your cursor"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.3),transparent_55%)]"
        />
      </MouseCustomCursor>
    </OuterEffectSurface>
  )
}

function FairyDustCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <FairyDustCursor disabled={mode === 'thumbnail'}>
        <PreviewDemoSurface
          label="cursor effect"
          title="Fairy Dust"
          subtitle="stardust follows your cursor"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(231,216,75,0.28),transparent_55%)]"
        />
      </FairyDustCursor>
    </OuterEffectSurface>
  )
}

function BubbleCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <BubbleCursor disabled={mode === 'thumbnail'}>
        <PreviewDemoSurface
          label="cursor effect"
          title="Bubbles"
          subtitle="move to float bubbles"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(58,146,197,0.32),transparent_55%)]"
        />
      </BubbleCursor>
    </OuterEffectSurface>
  )
}

function CharacterCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <CharacterCursor disabled={mode === 'thumbnail'}>
        <PreviewDemoSurface
          label="cursor effect"
          title="Characters"
          subtitle="characters under your control"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(167,85,194,0.3),transparent_55%)]"
        />
      </CharacterCursor>
    </OuterEffectSurface>
  )
}

function CanvasCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <CanvasCursor disabled={mode === 'thumbnail'}>
        <PreviewDemoSurface
          label="cursor effect"
          title="Spring Line Cursor"
          subtitle="spring lines follow your cursor"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_55%)]"
        />
      </CanvasCursor>
    </OuterEffectSurface>
  )
}

function RippleButtonPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Click Ripple Button"
      subtitle="click to send a ripple"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.3),transparent_55%)]"
    >
      <RippleButton
        rippleColor="rgba(56,189,248,0.36)"
        className={`h-11 ${glassButtonClassName}`}
      >
        Click me
      </RippleButton>
    </PreviewDemoSurface>
  )
}

function ShinyButtonPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Shine Button"
      subtitle="hover for a soft shine"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.28),transparent_55%)]"
    >
      <ShinyButton
        shineColor="rgba(56,189,248,0.68)"
        className={`h-11 ${glassStaticButtonClassName}`}
      >
        continue
      </ShinyButton>
    </PreviewDemoSurface>
  )
}

function MarqueePreview() {
  return (
    <PreviewDemoSurface
      label="content motion"
      title="Continuous Marquee"
      subtitle="hover to pause the rows"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.24),transparent_55%)]"
      overlay={
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-4 opacity-45">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstReviewRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondReviewRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0f]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0a0a0f]" />
        </div>
      }
    />
  )
}

function FileTreePreview() {
  return (
    <PreviewDemoSurface
      label="data structure"
      title="Collapsible File Tree"
      subtitle="browse nested files"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_55%)]"
    >
      <div className="relative h-[28rem] w-[min(34rem,90vw)] rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left text-base text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.26)] backdrop-blur">
        <Tree
          elements={fileTreeElements}
          initialSelectedId="file-tree"
          initialExpandedItems={['app', 'components']}
          className="h-full text-base"
        />
      </div>
    </PreviewDemoSurface>
  )
}

function AnimatedCircularProgressBarPreview() {
  const [value, setValue] = useState(68)

  return (
    <PreviewDemoSurface
      label="data structure"
      title="Circular Progress"
      subtitle="adjust progress manually"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.24),transparent_55%)]"
    >
      <div className="flex flex-col items-center gap-6">
        <AnimatedCircularProgressBar
          value={value}
          gaugePrimaryColor="#34d399"
          gaugeSecondaryColor="rgba(255,255,255,0.18)"
          className="text-emerald-300"
        />
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-lg font-medium text-white/75 transition-colors hover:bg-white/10"
            aria-label="Decrease progress value"
            onClick={() => setValue((current) => Math.max(0, current - 5))}
          >
            -
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-lg font-medium text-white/75 transition-colors hover:bg-white/10"
            aria-label="Increase progress value"
            onClick={() => setValue((current) => Math.min(100, current + 5))}
          >
            +
          </button>
        </div>
      </div>
    </PreviewDemoSurface>
  )
}

function CurvedLoopPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title="Curved Text Marquee"
      subtitle="curved marquee text"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.24),transparent_55%)]"
      contentClassName="w-full max-w-none"
    >
      <div className="-mx-8 h-52 w-[calc(100%+4rem)] overflow-visible">
        <CurvedLoop
          marqueeText="React Bits ✦ Curved Loop ✦ "
          speed={2.5}
          curveAmount={150}
          colors={auroraSparkColors}
          className="text-[76px] font-semibold tracking-normal [text-shadow:0_18px_60px_rgba(255,255,255,0.22)]"
        />
      </div>
    </PreviewDemoSurface>
  )
}

function ClickSparkPreview() {
  return (
    <OuterEffectSurface className="min-h-[30rem] p-0">
      <ClickSpark
        sparkColors={auroraSparkColors}
        sparkRadius={38}
        sparkSize={14}
        sparkCount={10}
        className="min-h-[30rem] w-full [&>canvas]:z-20"
      >
        <PreviewDemoSurface
          label="interaction effect"
          title="Click Spark Burst"
          subtitle="click anywhere in the stage"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.28),transparent_55%)]"
          className="min-h-[30rem] cursor-crosshair"
        />
      </ClickSpark>
    </OuterEffectSurface>
  )
}

function MagnetPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="interaction effect"
        title="Magnetic Hover"
        subtitle="move near the chip"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.28),transparent_55%)]"
      >
        <Magnet padding={90} magnetStrength={3}>
          <div
            className="rounded-full border border-white/10 bg-white/[0.08] px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur transition-colors hover:bg-white/[0.12]"
          >
            Magnet
          </div>
        </Magnet>
      </PreviewDemoSurface>
    </OuterEffectSurface>
  )
}

function StackPreview() {
  return (
    <PreviewDemoSurface
      label="content stack"
      title="Swipe Card Stack"
      subtitle="click cards to send back"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.24),transparent_55%)]"
    >
      <div className="relative h-64 w-64">
        <Stack
          cards={stackCards}
          sendToBackOnClick
        />
      </div>
    </PreviewDemoSurface>
  )
}

function FolderPreview() {
  return (
    <PreviewDemoSurface
      label="content stack"
      title="Expandable Folder"
      subtitle="click to open stacked items"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.2),transparent_55%)]"
    >
      <div className="mt-16 md:mt-20">
        <Folder
          color={folderPreviewColor}
          paperVariant="glass"
          size={1.2}
          items={[
            <div key="one" className="h-full rounded-md border border-white/15 bg-white/[0.08]" />,
            <div key="two" className="h-full rounded-md border border-white/15 bg-white/[0.08]" />,
            <div key="three" className="h-full rounded-md border border-white/15 bg-white/[0.08]" />,
          ]}
        />
      </div>
    </PreviewDemoSurface>
  )
}

function CarouselPreview() {
  return (
    <PreviewDemoSurface
      label="content media"
      title="Card Carousel"
      subtitle="autoplay through cards"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24),transparent_55%)]"
    >
      <Carousel autoplay loop pauseOnHover variant="dark" />
    </PreviewDemoSurface>
  )
}

function ElasticSliderPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Spring Slider"
      subtitle="drag the stepped handle"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.24),transparent_55%)]"
    >
      <ElasticSlider defaultValue={62} isStepped stepSize={4} />
    </PreviewDemoSurface>
  )
}

function CounterPreview() {
  const [value, setValue] = useState(17.8)

  return (
    <PreviewDemoSurface
      label="data structure"
      title="Rolling Number Counter"
      subtitle="increment decimal values"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.24),transparent_55%)]"
    >
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <Counter
          value={value}
          fontSize={78}
          textColor="#ffffff"
          fontWeight={700}
          gradientHeight={0}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium ${glassIconButtonClassName}`}
            aria-label="Decrease counter value"
            onClick={() => setValue((current) => Number((current - 1).toFixed(1)))}
          >
            -
          </button>
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium ${glassIconButtonClassName}`}
            aria-label="Increase counter value"
            onClick={() => setValue((current) => Number((current + 1).toFixed(1)))}
          >
            +
          </button>
        </div>
      </div>
    </PreviewDemoSurface>
  )
}

function IconCloudPreview() {
  return (
    <PreviewDemoSurface
      label="content display"
      title="Rotating Icon Cloud"
      subtitle="drag the cloud of icons"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.24),transparent_55%)]"
    >
      <div className="relative flex size-72 items-center justify-center overflow-hidden">
        <IconCloud images={iconCloudImages} />
      </div>
    </PreviewDemoSurface>
  )
}

function LensPreview() {
  return (
    <PreviewDemoSurface
      label="content media"
      title="Magnifier Lens"
      subtitle="hover to inspect the image"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.22),transparent_55%)]"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] text-left text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur-md">
        <div className="p-4">
          <Lens zoomFactor={2} lensSize={150} isStatic={false}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="image placeholder"
              width={500}
              height={500}
              className="aspect-square w-full rounded-xl border border-white/10 object-cover"
            />
          </Lens>
        </div>
        <div className="space-y-1 px-4 pb-4">
          <h3 className="text-xl font-semibold text-white">
            Your next camp
          </h3>
          <p className="text-sm leading-6 text-white/58">
            See our latest and best camp destinations across the globe.
          </p>
        </div>
      </div>
    </PreviewDemoSurface>
  )
}

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

function PointerPreview() {
  return (
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
  )
}

function MeteorsPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="ambient effect"
        title="Meteor Background"
        subtitle="streaks pass across the stage"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.28),transparent_55%)]"
        overlay={
          <Meteors
            number={mode === 'thumbnail' ? 8 : 22}
            className="text-sky-300 shadow-[0_0_0_1px_rgba(125,211,252,0.2)]"
          />
        }
      />
    </OuterEffectSurface>
  )
}

function ConfettiPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="interaction effect"
        title="Confetti Button"
        subtitle="press to celebrate"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.28),transparent_55%)]"
      >
        <ConfettiButton
          type="button"
          className={`relative h-11 ${glassButtonClassName}`}
        >
          Celebrate
        </ConfettiButton>
      </PreviewDemoSurface>
    </OuterEffectSurface>
  )
}

function ParticlesPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="ambient effect"
        title="Particle Background"
        subtitle="canvas depth and motion"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.3),transparent_55%)]"
        overlay={
          <Particles
            className="absolute inset-0"
            quantity={mode === 'thumbnail' ? 40 : 90}
            colors={cosmicParticleColors}
            ease={80}
          />
        }
      />
    </OuterEffectSurface>
  )
}

function TypingAnimationPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <TypingAnimation
          words={['Typing Animation', 'Typed Motion', 'Text Loop']}
          loop
          className="text-5xl font-semibold text-white"
        />
      }
      subtitle="loop through short phrases"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_55%)]"
    />
  )
}

function AuroraTextPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <span className="text-center text-5xl font-semibold tracking-normal">
          <AuroraText colors={[...auroraOriginalColors]}>
            Aurora Text
          </AuroraText>
        </span>
      }
      subtitle="gradient color flows through text"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.28),transparent_55%)]"
    />
  )
}

function VideoTextPreview() {
  const userFontFamily = useUserFontFamily()

  return (
    <PreviewDemoSurface
      label="text media"
      title="Video Mask Text"
      subtitle="video fills the letter mask"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.24),transparent_55%)]"
      contentClassName="w-full max-w-4xl"
    >
      <VideoText
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        fontSize={17}
        fontFamily={userFontFamily}
        className="h-72 w-full max-w-4xl"
      >
        VIDEO
      </VideoText>
    </PreviewDemoSurface>
  )
}

function NumberTickerPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <span className="text-6xl font-semibold tabular-nums text-white">
          <NumberTicker value={12840} />
        </span>
      }
      subtitle="count up to the latest value"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.26),transparent_55%)]"
    />
  )
}

function DiaTextRevealPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <DiaTextReveal
          text={['Dia Text Reveal', 'Color Sweep', 'Gradient Text']}
          repeat
          colors={[...originalGradientColors]}
          textColor="#ffffff"
          finalTextColor="#ffffff"
          className="text-center text-4xl font-semibold text-white"
        />
      }
      subtitle="reveal letters with a color trail"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_55%)]"
    />
  )
}

function MorphingTextPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <div className="flex w-[min(42rem,82vw)] max-w-full justify-center">
          <MorphingText
            texts={['Design', 'Build', 'Ship']}
            className="mx-auto h-20 w-full text-center text-[42px] text-white md:h-24"
          />
        </div>
      }
      subtitle="morph between words"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.26),transparent_55%)]"
      contentClassName="w-full max-w-4xl"
    />
  )
}

function HighlighterPreview() {
  return (
    <PreviewDemoSurface
      label="text emphasis"
      title="Marker Highlight"
      subtitle="underline or mark important words"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.24),transparent_55%)]"
    >
      <p className="max-w-full whitespace-nowrap text-center text-lg leading-relaxed text-white md:text-xl">
        The{' '}
        <Highlighter
          action="underline"
          color="#FF9800"
          strokeWidth={2}
          animationDuration={900}
          repeat
          repeatDelay={1400}
        >
          Marker Highlighter
        </Highlighter>{' '}
        makes important{' '}
        <Highlighter
          action="highlight"
          color="#87CEFA"
          strokeWidth={2}
          animationDuration={900}
          repeat
          repeatDelay={1400}
        >
          text stand out
        </Highlighter>
        {' '}effortlessly.
      </p>
    </PreviewDemoSurface>
  )
}

function BasePreviewContent({
  sample,
  mode,
}: {
  sample: ComponentSample
  mode: PreviewMode
}) {
  const content = (() => {
    switch (sample.preview.kind) {
    case 'ripple-button':
      return <RippleButtonPreview />
    case 'shiny-button':
      return <ShinyButtonPreview />
    case 'marquee':
      return <MarqueePreview />
    case 'icon-cloud':
      return <IconCloudPreview />
    case 'lens':
      return <LensPreview />
    case 'pointer':
      return <PointerPreview />
    case 'file-tree':
      return <FileTreePreview />
    case 'animated-circular-progress-bar':
      return <AnimatedCircularProgressBarPreview />
    case 'curved-loop':
      return <CurvedLoopPreview />
    case 'click-spark':
      return <ClickSparkPreview />
    case 'magnet':
      return <MagnetPreview />
    case 'stack':
      return <StackPreview />
    case 'folder':
      return <FolderPreview />
    case 'carousel':
      return <CarouselPreview />
    case 'elastic-slider':
      return <ElasticSliderPreview />
    case 'counter':
      return <CounterPreview />
    case 'meteors':
      return <MeteorsPreview mode={mode} />
    case 'confetti':
      return <ConfettiPreview />
    case 'particles':
      return <ParticlesPreview mode={mode} />
    case 'typing-animation':
      return <TypingAnimationPreview />
    case 'aurora-text':
      return <AuroraTextPreview />
    case 'video-text':
      return <VideoTextPreview />
    case 'number-ticker':
      return <NumberTickerPreview />
    case 'dia-text-reveal':
      return <DiaTextRevealPreview />
    case 'morphing-text':
      return <MorphingTextPreview />
    case 'highlighter':
      return <HighlighterPreview />
    case 'background-boxes':
      return <BackgroundBoxesPreview />
    case 'keyboard':
      return <KeyboardPreview />
    case 'placeholders-and-vanish-input':
      return <PlaceholdersAndVanishInputPreview />
    case '3d-marquee':
      return <ThreeDMarqueePreview />
    case 'avatar-group':
      return <AvatarGroupPreview />
    case 'playful-todolist':
      return <PlayfulTodoListPreview />
    case 'flower-menu':
      return <FlowerMenuPreview />
    case 'text-flip':
      return <TextFlipPreview />
    case 'toggle-theme':
      return <ToggleThemePreview />
    case '3d-image-carousel':
      return <ThreeDImageCarouselPreview />
    case 'sparkle-cursor':
      return <SparkleCursorPreview />
    case 'mouse-invert-cursor':
      return <MouseInvertCursorPreview mode={mode} />
    case 'mouse-trail-cursor':
      return <MouseTrailCursorPreview mode={mode} />
    case 'mouse-ripple-cursor':
      return <MouseRippleCursorPreview mode={mode} />
    case 'mouse-custom-cursor':
      return <MouseCustomCursorPreview mode={mode} />
    case 'fairy-dust-cursor':
      return <FairyDustCursorPreview mode={mode} />
    case 'bubble-cursor':
      return <BubbleCursorPreview mode={mode} />
    case 'character-cursor':
      return <CharacterCursorPreview mode={mode} />
    case 'canvas-cursor':
      return <CanvasCursorPreview mode={mode} />
    case 'data-table':
      return <DataTablePreview />
    case 'physics-number-picker':
      return <PhysicsNumberPickerPreview />
    }
  })()

  return content
}

export function ComponentPreviewContent({
  sample,
  mode,
}: {
  sample: ComponentSample
  mode: PreviewMode
}) {
  return <BasePreviewContent sample={sample} mode={mode} />
}
