'use client'

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  Copy,
  Download,
  Heart,
  PenLine,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import { motion } from 'motion/react'
import { ThreeDImageCarousel } from '@/components/magicui/3d-image-carousel'
import { ThreeDMarquee } from '@/components/magicui/3d-marquee'
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar'
import { AuroraText } from '@/components/magicui/aurora-text'
import { AvatarGroup } from '@/components/magicui/avatar-group'
import { BackgroundBoxes } from '@/components/magicui/background-boxes'
import { BubbleCursor } from '@/components/magicui/bubble-cursor'
import { CanvasCursor } from '@/components/magicui/canvas-cursor'
import { Carousel } from '@/components/magicui/carousel'
import { CharacterCursor } from '@/components/magicui/character-cursor'
import { ClickSpark } from '@/components/magicui/click-spark'
import { ConfettiButton } from '@/components/magicui/confetti'
import { Counter } from '@/components/magicui/counter'
import { CurvedLoop } from '@/components/magicui/curved-loop'
import { DataTable } from '@/components/magicui/data-table'
import { DiaTextReveal } from '@/components/magicui/dia-text-reveal'
import { ElasticSlider } from '@/components/magicui/elastic-slider'
import { FairyDustCursor } from '@/components/magicui/fairy-dust-cursor'
import { FluidCursor } from '@/components/magicui/fluid-cursor'
import { Tree, type TreeViewElement } from '@/components/magicui/file-tree'
import { FlowerMenu } from '@/components/magicui/flower-menu'
import { Folder } from '@/components/magicui/folder'
import { GooeyInput } from '@/components/magicui/gooey-input'
import { Highlighter } from '@/components/magicui/highlighter'
import { IconCloud } from '@/components/magicui/icon-cloud'
import { Keyboard } from '@/components/magicui/keyboard'
import { Lens } from '@/components/magicui/lens'
import { Magnet } from '@/components/magicui/magnet'
import { Marquee } from '@/components/magicui/marquee'
import { Meteors } from '@/components/magicui/meteors'
import { MouseCustomCursor } from '@/components/magicui/mouse-custom-cursor'
import { MouseInvertCursor } from '@/components/magicui/mouse-invert-cursor'
import { MouseRippleCursor } from '@/components/magicui/mouse-ripple-cursor'
import { MouseTrailCursor } from '@/components/magicui/mouse-trail-cursor'
import { MorphingText } from '@/components/magicui/morphing-text'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Particles } from '@/components/magicui/particles'
import { PlaceholdersAndVanishInput } from '@/components/magicui/placeholders-and-vanish-input'
import { PlayfulTodoList } from '@/components/magicui/playful-todolist'
import { Pointer } from '@/components/magicui/pointer'
import { RippleButton } from '@/components/magicui/ripple-button'
import { ShineBorder } from '@/components/magicui/shine-border'
import { ShinyButton } from '@/components/magicui/shiny-button'
import { SlideArrowButton } from '@/components/magicui/slide-arrow-button'
import { SparkleCursor } from '@/components/magicui/sparkle-cursor'
import { Stack } from '@/components/magicui/stack'
import { TextFlip } from '@/components/magicui/text-flip'
import { ToggleTheme } from '@/components/magicui/toggle-theme'
import { TypingAnimation } from '@/components/magicui/typing-animation'
import { VideoText } from '@/components/magicui/video-text'
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
      {
        id: 'components-magicui',
        name: 'magicui',
        children: [
          { id: 'ripple-button', name: 'ripple-button.tsx' },
          { id: 'file-tree', name: 'file-tree.tsx' },
          { id: 'shiny-button', name: 'shiny-button.tsx' },
        ],
      },
    ],
  },
  {
    id: 'lib',
    name: 'lib',
    children: [{ id: 'lib-utils', name: 'utils.ts' }],
  },
]
const themeAccentButtonStyle = {
  backgroundColor: 'var(--theme-accent-current)',
  borderColor: 'var(--theme-accent-current)',
  color: 'var(--background)',
} as const satisfies CSSProperties
const themeGradientColors = [
  'var(--theme-progress-start)',
  'var(--theme-progress-mid)',
  'var(--theme-progress-end)',
] as const
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
function readThemeColor(variableName: string, fallback: string) {
  if (typeof window === 'undefined') return fallback

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim()
  const referencedVariable = value.match(/^var\((--[\w-]+)\)$/)?.[1]

  if (referencedVariable) {
    return readThemeColor(referencedVariable, fallback)
  }

  return value || fallback
}

function useThemeColor(variableName: string, fallback: string) {
  const [color, setColor] = useState(fallback)

  useEffect(() => {
    const root = document.documentElement
    const syncColor = () => {
      setColor(readThemeColor(variableName, fallback))
    }
    const observer = new MutationObserver(syncColor)

    syncColor()
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-blog-theme'],
    })

    return () => observer.disconnect()
  }, [fallback, variableName])

  return color
}

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
      className={`relative flex min-h-60 w-full items-center justify-center overflow-hidden rounded-[inherit] bg-background text-center text-foreground ${className}`}
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
    <div className="relative h-[420px] w-full overflow-hidden rounded-[inherit] bg-slate-900">
      <BackgroundBoxes />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(15,23,42,0.96)_78%)]" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <p className="text-4xl font-semibold text-white">
          Background Boxes
        </p>
      </div>
    </div>
  )
}

function KeyboardPreview() {
  return (
    <OuterEffectSurface className="min-h-[34rem] overflow-visible p-8">
      <Keyboard showPreview className="scale-[1.75]" />
    </OuterEffectSurface>
  )
}

function PlaceholdersAndVanishInputPreview() {
  return (
    <OuterEffectSurface>
      <PlaceholdersAndVanishInput
        className="max-w-md"
        placeholders={['Search components', 'Ask about registry', 'Find animations']}
      />
    </OuterEffectSurface>
  )
}

function GooeyInputPreview() {
  return (
    <OuterEffectSurface>
      <GooeyInput
        placeholder="search"
        classNames={{
          trigger:
            'bg-[var(--theme-accent-current)] text-[var(--background)]',
          input:
            'text-[var(--background)] placeholder:text-[var(--background)]/70',
          bubbleSurface:
            'bg-[var(--theme-accent-current)] text-[var(--background)]',
        }}
      />
    </OuterEffectSurface>
  )
}

function ThreeDMarqueePreview() {
  const marqueeImages = Array.from({ length: 8 }, () => previewImages)
    .flat()
    .map((image) => image.src)

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-[inherit] bg-white dark:bg-zinc-950">
      <ThreeDMarquee
        images={marqueeImages}
        className="rounded-[inherit]"
      />
    </div>
  )
}

function AvatarGroupPreview() {
  return (
    <OuterEffectSurface>
      <AvatarGroup items={avatarItems} />
    </OuterEffectSurface>
  )
}

function PlayfulTodoListPreview() {
  return (
    <OuterEffectSurface>
      <PlayfulTodoList />
    </OuterEffectSurface>
  )
}

function SlideArrowButtonPreview() {
  return (
    <OuterEffectSurface>
      <SlideArrowButton>Continue</SlideArrowButton>
    </OuterEffectSurface>
  )
}

function FlowerMenuPreview() {
  return (
    <OuterEffectSurface>
      <FlowerMenu items={actionItems} />
    </OuterEffectSurface>
  )
}

function TextFlipPreview() {
  return (
    <TextFlip
      prefix="Coding is"
      words={['fantastic', 'love', 'fire', 'awesome']}
      className="text-foreground"
      wordClassName="w-[10ch]"
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
    <OuterEffectSurface className="min-h-72">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {toggleThemePreviewAnimations.map((animationType) => (
          <ToggleTheme
            key={animationType}
            animationType={animationType}
            duration={360}
            label={animationType}
          />
        ))}
      </div>
    </OuterEffectSurface>
  )
}

function ThreeDImageCarouselPreview() {
  return (
    <OuterEffectSurface className="min-h-[30rem] p-0">
      <ThreeDImageCarousel items={previewImages} itemCount={3} />
    </OuterEffectSurface>
  )
}

function SparkleCursorPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <SparkleCursor className="flex min-h-[28rem] items-center justify-center bg-[#0d0b12] text-white">
        <div className="rounded-2xl border border-white/15 bg-white/5 px-8 py-6 text-center shadow-sm backdrop-blur">
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-yellow-300" />
          <p className="text-xl font-semibold">Move the cursor</p>
        </div>
      </SparkleCursor>
    </OuterEffectSurface>
  )
}

function DataTablePreview() {
  return (
    <OuterEffectSurface className="min-h-[26rem] p-4">
      <DataTable columns={tableColumns} rows={tableRows} />
    </OuterEffectSurface>
  )
}

function CursorDemoSurface({
  title,
  subtitle,
  accentClassName,
}: {
  title: string
  subtitle: string
  accentClassName: string
}) {
  return (
    <div className="relative flex min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-[#0a0a0f] p-8 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_62%)]" />
      <div className={cn('pointer-events-none absolute inset-0 opacity-30', accentClassName)} />
      <div className="relative z-10 max-w-md">
        <p className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
          cursor effect
        </p>
        <p className="mt-5 text-5xl font-semibold tracking-normal">
          {title}
        </p>
        <p className="mt-3 text-sm italic tracking-wide text-white/52">
          {subtitle}
        </p>
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
        <CursorDemoSurface
          title="Invert"
          subtitle="// move to invert the surface"
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
        <CursorDemoSurface
          title="Trail"
          subtitle="// fading dots follow your cursor"
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
        <CursorDemoSurface
          title="Ripple"
          subtitle="// click to expand"
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
        <CursorDemoSurface
          title="Custom Cursor"
          subtitle="// dot + ring following your cursor"
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
        <CursorDemoSurface
          title="Fairy Dust"
          subtitle="// stardust follows your cursor"
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
        <CursorDemoSurface
          title="Bubbles"
          subtitle="// move to float bubbles"
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
        <CursorDemoSurface
          title="Characters"
          subtitle="// characters under your control"
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
        <CursorDemoSurface
          title="Canvas Cursor"
          subtitle="// spring lines follow your cursor"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_55%)]"
        />
      </CanvasCursor>
    </OuterEffectSurface>
  )
}

function FluidCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <FluidCursor disabled={mode === 'thumbnail'}>
        <CursorDemoSurface
          title="Fluid Cursor"
          subtitle="// move or press to push dye"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.32),transparent_55%)]"
        />
      </FluidCursor>
    </OuterEffectSurface>
  )
}

function RippleButtonPreview() {
  return (
    <RippleButton
      rippleColor="rgba(255,255,255,0.72)"
      className="h-11 rounded-xl px-7 text-sm font-medium shadow-[0_18px_40px_-24px_var(--theme-accent-current)] transition-transform hover:-translate-y-0.5"
      style={themeAccentButtonStyle}
    >
      Ripple Button
    </RippleButton>
  )
}

function ShinyButtonPreview() {
  return (
    <ShinyButton
      className="h-11 rounded-xl px-7 shadow-[0_18px_40px_-24px_var(--theme-accent-current)]"
      style={themeAccentButtonStyle}
    >
      Shiny Button
    </ShinyButton>
  )
}

function MarqueePreview() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
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
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
    </div>
  )
}

function FileTreePreview() {
  return (
    <div className="relative h-72 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-[0_18px_48px_-34px_rgba(24,24,27,0.45)] dark:border-zinc-800 dark:bg-zinc-950">
      <Tree
        elements={fileTreeElements}
        initialSelectedId="file-tree"
        initialExpandedItems={['app', 'components', 'components-magicui']}
        className="h-full"
      />
    </div>
  )
}

function AnimatedCircularProgressBarPreview() {
  const [value, setValue] = useState(68)
  const themeAccentColor = useThemeColor('--theme-accent-current', '#18181b')

  useEffect(() => {
    const values = [68, 82, 42, 91]
    let index = 0
    const id = window.setInterval(() => {
      index = (index + 1) % values.length
      setValue(values[index])
    }, 1800)

    return () => window.clearInterval(id)
  }, [])

  return (
    <AnimatedCircularProgressBar
      value={value}
      gaugePrimaryColor={themeAccentColor}
      gaugeSecondaryColor="#e4e4e7"
      className="text-[var(--theme-accent-current)]"
    />
  )
}

function CurvedLoopPreview() {
  return (
    <div className="relative flex min-h-64 w-full items-center justify-center overflow-hidden">
      <CurvedLoop
        marqueeText="React Bits ✦ Curved Loop ✦ "
        speed={2.5}
        curveAmount={76}
        className="text-[58px] font-semibold tracking-normal text-[var(--theme-accent-current)]"
      />
    </div>
  )
}

function ClickSparkPreview() {
  const themeAccentColor = useThemeColor('--theme-accent-current', '#171717')

  return (
    <OuterEffectSurface className="min-h-[30rem] p-0">
      <ClickSpark
        sparkColor={themeAccentColor}
        sparkRadius={38}
        sparkSize={14}
        sparkCount={10}
        className="min-h-[30rem]"
      >
        <div className="flex min-h-[30rem] w-full cursor-crosshair items-center justify-center p-8">
          <button
            type="button"
            className="rounded-xl px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-24px_var(--theme-accent-current)]"
            style={themeAccentButtonStyle}
          >
            Click Spark
          </button>
        </div>
      </ClickSpark>
    </OuterEffectSurface>
  )
}

function MagnetPreview() {
  return (
    <OuterEffectSurface>
      <Magnet padding={90} magnetStrength={3}>
        <div
          className="rounded-full px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_70px_-28px_var(--theme-accent-current)]"
          style={themeAccentButtonStyle}
        >
          Magnet
        </div>
      </Magnet>
    </OuterEffectSurface>
  )
}

function StackPreview() {
  return (
    <div className="relative flex min-h-[30rem] w-full items-center justify-center overflow-hidden rounded-[inherit] bg-white p-8">
      <div className="relative h-64 w-64">
        <Stack
          cards={stackCards}
          sendToBackOnClick
        />
      </div>
    </div>
  )
}

function FolderPreview() {
  const themeAccentColor = useThemeColor('--theme-accent-current', '#171717')

  return (
    <OuterEffectSurface className="min-h-[320px] pt-24">
      <Folder
        color={themeAccentColor}
        size={1.2}
        items={[
          <div key="one" className="h-full rounded-md border border-zinc-200 bg-white/90" />,
          <div key="two" className="h-full rounded-md border border-zinc-200 bg-white/90" />,
          <div key="three" className="h-full rounded-md border border-zinc-200 bg-white/90" />,
        ]}
      />
    </OuterEffectSurface>
  )
}

function CarouselPreview() {
  return (
    <OuterEffectSurface>
      <Carousel autoplay loop pauseOnHover />
    </OuterEffectSurface>
  )
}

function ElasticSliderPreview() {
  return (
    <OuterEffectSurface>
      <ElasticSlider defaultValue={62} isStepped stepSize={4} />
    </OuterEffectSurface>
  )
}

function CounterPreview() {
  const themeAccentColor = useThemeColor('--theme-accent-current', '#171717')
  const [value, setValue] = useState(17.8)

  return (
    <div className="flex min-h-64 w-full flex-col items-center justify-center gap-5">
      <Counter
        value={value}
        fontSize={78}
        textColor={themeAccentColor}
        fontWeight={700}
        gradientFrom="var(--background)"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          aria-label="Decrease counter value"
          onClick={() => setValue((current) => Number((current - 1).toFixed(1)))}
        >
          -
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          aria-label="Increase counter value"
          onClick={() => setValue((current) => Number((current + 1).toFixed(1)))}
        >
          +
        </button>
      </div>
    </div>
  )
}

function IconCloudPreview() {
  return (
    <div className="relative flex size-full min-h-80 items-center justify-center overflow-hidden">
      <IconCloud images={iconCloudImages} />
    </div>
  )
}

function LensPreview() {
  return (
    <div className="relative max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
      <div className="p-6">
        <Lens zoomFactor={2} lensSize={150} isStatic={false}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image placeholder"
            width={500}
            height={500}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </Lens>
      </div>
      <div className="space-y-2 px-6 pb-6">
        <h3 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Your next camp
        </h3>
        <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          See our latest and best camp destinations across the globe.
        </p>
      </div>
    </div>
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
    <div className="relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="pointer-events-none flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

function PointerPreview() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-2">
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
  )
}

function ShineBorderPreview() {
  return (
    <OuterEffectSurface>
      <ShineBorder
        borderWidth={2}
        shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
      />
      <div>
        <p className="text-2xl font-semibold">Shine Border</p>
        <p className="mt-2 text-sm text-zinc-500">A soft animated border.</p>
      </div>
    </OuterEffectSurface>
  )
}

function MeteorsPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface>
      <Meteors
        number={mode === 'thumbnail' ? 8 : 22}
        className="text-[var(--theme-accent-current)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--theme-accent-current)_20%,transparent)]"
      />
      <div className="relative">
        <p className="text-2xl font-semibold">Meteors</p>
        <p className="mt-2 text-sm text-zinc-500">A shower across the card.</p>
      </div>
    </OuterEffectSurface>
  )
}

function ConfettiPreview() {
  return (
    <OuterEffectSurface>
      <ConfettiButton
        type="button"
        className="relative rounded-lg border shadow-[0_18px_40px_-24px_var(--theme-accent-current)]"
        style={themeAccentButtonStyle}
      >
        Celebrate
      </ConfettiButton>
    </OuterEffectSurface>
  )
}

function ParticlesPreview({ mode }: { mode: PreviewMode }) {
  const themeAccentColor = useThemeColor('--theme-accent-current', '#171717')

  return (
    <OuterEffectSurface>
      <Particles
        className="absolute inset-0"
        quantity={mode === 'thumbnail' ? 40 : 90}
        color={themeAccentColor}
        ease={80}
      />
      <div className="relative">
        <p className="text-2xl font-semibold">Particles</p>
        <p className="mt-2 text-sm text-zinc-500">Canvas depth and motion.</p>
      </div>
    </OuterEffectSurface>
  )
}

function TypingAnimationPreview() {
  return (
    <TypingAnimation
      words={['Typing Animation', 'Typed Motion', 'Text Loop']}
      loop
      className="text-4xl font-semibold text-[var(--theme-accent-current)]"
    />
  )
}

function AuroraTextPreview() {
  return (
    <p className="text-center text-5xl font-semibold tracking-normal">
      <AuroraText colors={[...themeGradientColors]}>
        Aurora Text
      </AuroraText>
    </p>
  )
}

function VideoTextPreview() {
  const userFontFamily = useUserFontFamily()

  return (
    <OuterEffectSurface className="min-h-60 p-0">
      <VideoText
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        fontSize={18}
        fontFamily={userFontFamily}
        className="h-48 w-full"
      >
        VIDEO
      </VideoText>
    </OuterEffectSurface>
  )
}

function NumberTickerPreview() {
  return (
    <p className="text-6xl font-semibold tabular-nums text-[var(--theme-accent-current)]">
      <NumberTicker value={12840} />
    </p>
  )
}

function DiaTextRevealPreview() {
  return (
    <DiaTextReveal
      text={['Dia Text Reveal', 'Color Sweep', 'Magic UI']}
      repeat
      colors={[...themeGradientColors]}
      className="text-center text-4xl font-semibold"
    />
  )
}

function MorphingTextPreview() {
  return (
    <MorphingText
      texts={['Design', 'Build', 'Ship']}
      className="h-20 text-[42px] text-[var(--theme-accent-current)] md:h-24"
    />
  )
}

function HighlighterPreview() {
  return (
    <p className="max-w-full whitespace-nowrap text-center text-xl leading-relaxed text-foreground md:text-2xl">
      The{' '}
      <Highlighter
        action="underline"
        color="#FF9800"
        strokeWidth={2}
        animationDuration={900}
        repeat
        repeatDelay={1400}
      >
        Magic UI Highlighter
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
    case 'shine-border':
      return <ShineBorderPreview />
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
    case 'gooey-input':
      return <GooeyInputPreview />
    case '3d-marquee':
      return <ThreeDMarqueePreview />
    case 'avatar-group':
      return <AvatarGroupPreview />
    case 'playful-todolist':
      return <PlayfulTodoListPreview />
    case 'slide-arrow-button':
      return <SlideArrowButtonPreview />
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
    case 'fluid-cursor':
      return <FluidCursorPreview mode={mode} />
    case 'data-table':
      return <DataTablePreview />
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
