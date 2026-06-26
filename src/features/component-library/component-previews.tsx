'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  Home,
  PenLine,
  Search,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import { motion } from 'motion/react'
import { ThreeDImageCarousel } from '@/components/magicui/3d-image-carousel'
import { ThreeDImageSlider } from '@/components/magicui/3d-image-slider'
import { ThreeDMarquee } from '@/components/magicui/3d-marquee'
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar'
import { AnimatedCheckbox } from '@/components/magicui/animated-checkbox'
import { AnimatedRadioGroup } from '@/components/magicui/animated-radio-group'
import { Aurora } from '@/components/magicui/aurora'
import { AuroraText } from '@/components/magicui/aurora-text'
import { AvatarGroup } from '@/components/magicui/avatar-group'
import { BackgroundBoxes } from '@/components/magicui/background-boxes'
import { BorderBeamButton } from '@/components/magicui/border-beam-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { BorderGlow } from '@/components/magicui/border-glow'
import { Carousel } from '@/components/magicui/carousel'
import { CircularGallery } from '@/components/magicui/circular-gallery'
import { ClickSpark } from '@/components/magicui/click-spark'
import { CometCard } from '@/components/magicui/comet-card'
import { ConfettiButton } from '@/components/magicui/confetti'
import { CoolThemeToggle } from '@/components/magicui/cool-theme-toggle'
import { Counter } from '@/components/magicui/counter'
import { CurvedLoop } from '@/components/magicui/curved-loop'
import { DataTable } from '@/components/magicui/data-table'
import { DiaTextReveal } from '@/components/magicui/dia-text-reveal'
import { DotField } from '@/components/magicui/dot-field'
import { ElasticSlider } from '@/components/magicui/elastic-slider'
import { Tree, type TreeViewElement } from '@/components/magicui/file-tree'
import { FileUpload } from '@/components/magicui/file-upload'
import { FloatingDock } from '@/components/magicui/floating-dock'
import { FlowerMenu } from '@/components/magicui/flower-menu'
import { Folder } from '@/components/magicui/folder'
import { GlassSurface } from '@/components/magicui/glass-surface'
import { GooeyInput } from '@/components/magicui/gooey-input'
import { Highlighter } from '@/components/magicui/highlighter'
import { IconCloud } from '@/components/magicui/icon-cloud'
import { Keyboard } from '@/components/magicui/keyboard'
import { KineticCenterBuild } from '@/components/magicui/kinetic-center-build'
import { Lanyard } from '@/components/magicui/lanyard'
import { Lens } from '@/components/magicui/lens'
import { LinkPreview } from '@/components/magicui/link-preview'
import { Magnet } from '@/components/magicui/magnet'
import { Marquee } from '@/components/magicui/marquee'
import { Meteors } from '@/components/magicui/meteors'
import { MorphingText } from '@/components/magicui/morphing-text'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Particles } from '@/components/magicui/particles'
import { PixelatedCanvas } from '@/components/magicui/pixelated-canvas'
import { PlaceholdersAndVanishInput } from '@/components/magicui/placeholders-and-vanish-input'
import { PlayfulTodoList } from '@/components/magicui/playful-todolist'
import { Pointer } from '@/components/magicui/pointer'
import { RippleButton } from '@/components/magicui/ripple-button'
import { ShineBorder } from '@/components/magicui/shine-border'
import { ShinyButton } from '@/components/magicui/shiny-button'
import { SignupForm } from '@/components/magicui/signup-form'
import { SlideArrowButton } from '@/components/magicui/slide-arrow-button'
import { SparkleCursor } from '@/components/magicui/sparkle-cursor'
import { SpeedDial } from '@/components/magicui/speed-dial'
import { Stack } from '@/components/magicui/stack'
import { Stepper } from '@/components/magicui/stepper'
import { Strands } from '@/components/magicui/strands'
import { TextFlip } from '@/components/magicui/text-flip'
import { ToggleTheme } from '@/components/magicui/toggle-theme'
import { TypingAnimation } from '@/components/magicui/typing-animation'
import { VariableProximity } from '@/components/magicui/variable-proximity'
import { VideoText } from '@/components/magicui/video-text'
import { WobbleCard } from '@/components/magicui/wobble-card'
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
const textPreviewFontStyle = {
  fontFamily: "'Hancom MalangMalang', Pretendard, sans-serif",
} as const
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
const stackCards = [
  <div
    key="stack-one"
    className="flex h-full w-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
  >
    <div className="h-9 w-9 rounded-xl bg-[var(--theme-accent-current)]/12 ring-1 ring-[var(--theme-accent-current)]/20" />
    <div>
      <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Design
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Motion-ready card
      </p>
    </div>
  </div>,
  <div
    key="stack-two"
    className="flex h-full w-full flex-col justify-between rounded-2xl border border-violet-200 bg-violet-50 p-5 text-left shadow-sm dark:border-violet-400/20 dark:bg-violet-500/10"
  >
    <div className="h-9 w-16 rounded-full bg-violet-500/20" />
    <div>
      <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Build
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Drag or click
      </p>
    </div>
  </div>,
  <div
    key="stack-three"
    className="flex h-full w-full flex-col justify-between rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-left shadow-sm dark:border-cyan-400/20 dark:bg-cyan-500/10"
  >
    <div className="grid grid-cols-3 gap-1.5">
      <span className="h-3 rounded-full bg-cyan-500/35" />
      <span className="h-3 rounded-full bg-cyan-500/20" />
      <span className="h-3 rounded-full bg-cyan-500/45" />
    </div>
    <div>
      <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Ship
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Layered preview
      </p>
    </div>
  </div>,
] satisfies ReactNode[]
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
const avatarItems = ['Mina', 'Joon', 'Ari', 'Theo', 'Lia', 'Noah'].map((name) => ({
  name,
  src: `https://avatar.vercel.sh/${name}`,
}))
const dockItems = [
  { title: 'Home', icon: <Home className="h-5 w-5" />, href: '#' },
  { title: 'Search', icon: <Search className="h-5 w-5" />, href: '#' },
  { title: 'Profile', icon: <User className="h-5 w-5" />, href: '#' },
  { title: 'Settings', icon: <Settings className="h-5 w-5" />, href: '#' },
]
const actionItems = [
  { label: 'Edit', icon: <PenLine className="h-4 w-4" /> },
  { label: 'Share', icon: <Share2 className="h-4 w-4" /> },
  { label: 'Upload', icon: <Upload className="h-4 w-4" /> },
  { label: 'Delete', icon: <Trash2 className="h-4 w-4" /> },
]
const tableColumns = [
  { key: 'component', header: 'Component' },
  { key: 'category', header: 'Category' },
  { key: 'status', header: 'Status' },
] as const
const tableRows = [
  { component: 'Wobble Card', category: 'Cards', status: 'Ready' },
  { component: 'Gooey Input', category: 'Forms', status: 'Ready' },
  { component: 'Stepper', category: 'Controls', status: 'Ready' },
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
      className={`relative flex min-h-60 w-full items-center justify-center overflow-hidden rounded-[inherit] bg-background p-8 text-center text-foreground ${className}`}
    >
      {children}
    </div>
  )
}

function TextPreviewFont({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-60 w-full items-center justify-center"
      style={textPreviewFontStyle}
    >
      {children}
    </div>
  )
}

function BackgroundBoxesPreview() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-[inherit] bg-slate-900">
      <BackgroundBoxes rows={46} columns={32} />
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
    <OuterEffectSurface className="min-h-72 overflow-hidden">
      <Keyboard showPreview className="scale-[1.08]" />
    </OuterEffectSurface>
  )
}

function PixelatedCanvasPreview() {
  return (
    <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-[inherit] bg-black">
      <PixelatedCanvas
        responsive
        cellSize={5}
        dotScale={0.82}
        shape="circle"
        backgroundColor="#050505"
        tintColor="#ffffff"
        tintStrength={0.08}
        className="h-full w-full"
      />
    </div>
  )
}

function WobbleCardPreview() {
  return (
    <OuterEffectSurface>
      <WobbleCard containerClassName="min-h-44 w-full max-w-md text-left">
        <p className="text-2xl font-semibold text-white">Wobble Card</p>
        <p className="mt-2 text-sm text-white/70">
          Move the pointer over this card.
        </p>
      </WobbleCard>
    </OuterEffectSurface>
  )
}

function CometCardPreview() {
  return (
    <OuterEffectSurface>
      <CometCard className="w-full max-w-md" cardClassName="min-h-44 text-left">
        <p className="text-2xl font-semibold">Comet Card</p>
        <p className="mt-2 text-sm text-zinc-500">
          Tilt and glare follow the pointer.
        </p>
      </CometCard>
    </OuterEffectSurface>
  )
}

function FloatingDockPreview() {
  return (
    <OuterEffectSurface>
      <FloatingDock items={dockItems} />
    </OuterEffectSurface>
  )
}

function SignupFormPreview() {
  return (
    <OuterEffectSurface>
      <SignupForm />
    </OuterEffectSurface>
  )
}

function PlaceholdersAndVanishInputPreview() {
  return (
    <OuterEffectSurface>
      <PlaceholdersAndVanishInput
        placeholders={['Search components', 'Ask about registry', 'Find animations']}
      />
    </OuterEffectSurface>
  )
}

function GooeyInputPreview() {
  return (
    <OuterEffectSurface>
      <GooeyInput />
    </OuterEffectSurface>
  )
}

function LinkPreviewPreview() {
  return (
    <OuterEffectSurface>
      <p className="text-2xl font-semibold">
        Hover the{' '}
        <LinkPreview
          url="https://ryong.dev"
          isStatic
          imageSrc={previewImages[0].src}
          className="underline decoration-zinc-300 underline-offset-4"
        >
          component link
        </LinkPreview>
      </p>
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
      <AvatarGroup items={avatarItems} max={5} />
    </OuterEffectSurface>
  )
}

function AnimatedCheckboxPreview() {
  return (
    <OuterEffectSurface>
      <AnimatedCheckbox label="Send weekly updates" defaultChecked />
    </OuterEffectSurface>
  )
}

function FileUploadPreview() {
  return (
    <OuterEffectSurface>
      <FileUpload />
    </OuterEffectSurface>
  )
}

function AnimatedRadioGroupPreview() {
  return (
    <OuterEffectSurface>
      <AnimatedRadioGroup
        defaultValue="preview"
        options={[
          { label: 'Preview', value: 'preview' },
          { label: 'Code', value: 'code' },
          { label: 'Install', value: 'install' },
        ]}
        className="w-full max-w-sm"
      />
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

function BorderBeamButtonPreview() {
  return (
    <OuterEffectSurface>
      <BorderBeamButton>Border Beam</BorderBeamButton>
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

function SpeedDialPreview() {
  return (
    <OuterEffectSurface>
      <SpeedDial items={actionItems} />
    </OuterEffectSurface>
  )
}

function KineticCenterBuildPreview() {
  return <KineticCenterBuild text="Kinetic Build" className="text-[var(--theme-accent-current)]" />
}

function TextFlipPreview() {
  return <TextFlip words={['Design', 'Build', 'Ship']} className="text-[var(--theme-accent-current)]" />
}

function CoolThemeTogglePreview() {
  return (
    <OuterEffectSurface>
      <CoolThemeToggle />
    </OuterEffectSurface>
  )
}

function ToggleThemePreview() {
  return (
    <OuterEffectSurface>
      <ToggleTheme />
    </OuterEffectSurface>
  )
}

function ThreeDImageCarouselPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <ThreeDImageCarousel items={previewImages} />
    </OuterEffectSurface>
  )
}

function ThreeDImageSliderPreview() {
  return (
    <OuterEffectSurface>
      <ThreeDImageSlider items={previewImages} />
    </OuterEffectSurface>
  )
}

function SparkleCursorPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <SparkleCursor className="flex min-h-60 items-center justify-center">
        <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-[var(--theme-accent-current)]" />
          <p className="text-xl font-semibold">Move here</p>
        </div>
      </SparkleCursor>
    </OuterEffectSurface>
  )
}

function StepperPreview() {
  return (
    <OuterEffectSurface>
      <Stepper
        defaultStep={1}
        steps={[
          { title: 'Design', description: 'Shape' },
          { title: 'Build', description: 'Code' },
          { title: 'Ship', description: 'Review' },
        ]}
      />
    </OuterEffectSurface>
  )
}

function DataTablePreview() {
  return (
    <OuterEffectSurface>
      <DataTable columns={tableColumns} rows={tableRows} />
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

function VariableProximityPreview() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="flex min-h-64 w-full items-center justify-center px-6 text-center"
    >
      <VariableProximity
        label="Variable Proximity"
        containerRef={containerRef}
        fromFontVariationSettings="'wght' 420"
        toFontVariationSettings="'wght' 900"
        radius={150}
        className="text-5xl leading-tight text-foreground"
        style={textPreviewFontStyle}
      />
    </div>
  )
}

function ClickSparkPreview() {
  const themeAccentColor = useThemeColor('--theme-accent-current', '#171717')

  return (
    <OuterEffectSurface className="p-0">
      <ClickSpark
        sparkColor={themeAccentColor}
        sparkRadius={38}
        sparkSize={14}
        sparkCount={10}
      >
        <div className="flex min-h-60 w-full cursor-crosshair items-center justify-center p-8">
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

function StrandsPreview({ mode }: { mode: PreviewMode }) {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-[inherit] bg-white">
      <Strands
        colors={['#2563eb', '#8b5cf6', '#ec4899', '#14b8a6']}
        count={mode === 'thumbnail' ? 2 : 4}
        speed={0.45}
        amplitude={1}
        glow={1.8}
        opacity={0.9}
        saturation={1.2}
      />
    </div>
  )
}

function CircularGalleryPreview() {
  return (
    <div className="h-80 w-full overflow-hidden rounded-[inherit] bg-white dark:bg-zinc-950">
      <CircularGallery
        bend={0.25}
        borderRadius={0.08}
        scrollSpeed={0.75}
        scrollEase={0.08}
        textColor="#71717a"
      />
    </div>
  )
}

function StackPreview() {
  return (
    <OuterEffectSurface>
      <div className="relative h-64 w-64">
        <Stack
          cards={stackCards}
          randomRotation
          sendToBackOnClick
          autoplay
          pauseOnHover
        />
      </div>
    </OuterEffectSurface>
  )
}

function GlassSurfacePreview() {
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-[inherit] bg-white dark:bg-zinc-950">
      <div className="absolute left-10 top-8 h-28 w-48 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 h-3 w-20 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2 w-2/3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
      <div className="absolute right-12 bottom-8 grid h-24 w-40 grid-cols-3 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span className="rounded-lg bg-[var(--theme-progress-start)]/30" />
        <span className="rounded-lg bg-[var(--theme-progress-mid)]/30" />
        <span className="rounded-lg bg-[var(--theme-progress-end)]/30" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--theme-progress-start),transparent_30%),radial-gradient(circle_at_70%_70%,var(--theme-progress-mid),transparent_34%)] opacity-35" />
      <GlassSurface
        width={320}
        height={118}
        borderRadius={24}
        backgroundOpacity={0.2}
        displace={12}
        saturation={1.45}
      >
        <span className="text-lg font-semibold text-zinc-950 dark:text-white">
          Glass Surface
        </span>
      </GlassSurface>
    </div>
  )
}

function FolderPreview() {
  const themeAccentColor = useThemeColor('--theme-accent-current', '#171717')

  return (
    <OuterEffectSurface>
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

function LanyardPreview({ mode }: { mode: PreviewMode }) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[inherit] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] dark:border-zinc-800 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,var(--theme-progress-start),transparent_28%),radial-gradient(circle_at_62%_68%,var(--theme-progress-mid),transparent_34%)] opacity-20 dark:opacity-30" />
      <Lanyard position={[0, 0, 24]} fov={mode === 'thumbnail' ? 24 : 22} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,transparent,rgba(255,255,255,0.34))] dark:bg-[radial-gradient(circle_at_50%_22%,transparent,rgba(0,0,0,0.38))]" />
    </div>
  )
}

function CarouselPreview() {
  return (
    <OuterEffectSurface>
      <Carousel autoplay loop pauseOnHover />
    </OuterEffectSurface>
  )
}

function BorderGlowReactBitsPreview() {
  return (
    <OuterEffectSurface>
      <BorderGlow
        className="w-full max-w-md"
        backgroundColor="var(--background)"
        colors={['hsl(260 100% 72%)', 'hsl(322 92% 72%)', 'hsl(190 95% 68%)']}
        fillOpacity={0.28}
        glowRadius={18}
        glowIntensity={0.7}
      >
        <div className="space-y-2 p-8 text-left">
          <p className="text-2xl font-semibold">Border Glow</p>
          <p className="text-sm text-muted-foreground">Move near the edge.</p>
        </div>
      </BorderGlow>
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

function AuroraPreview() {
  return (
    <div className="h-72 w-full overflow-hidden rounded-[inherit] bg-white">
      <Aurora
        colorStops={['#93c5fd', '#c4b5fd', '#f9a8d4']}
        amplitude={1.1}
        blend={0.68}
      />
    </div>
  )
}

function DotFieldPreview() {
  return (
    <div className="h-72 w-full overflow-hidden rounded-[inherit] bg-white">
      <DotField
        dotRadius={3}
        dotSpacing={12}
        cursorRadius={420}
        gradientFrom="rgba(24, 24, 27, 0.78)"
        gradientTo="rgba(37, 99, 235, 0.72)"
        glowColor="rgba(37, 99, 235, 0.22)"
        sparkle
        waveAmplitude={0.15}
      />
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

function BorderBeamPreview() {
  return (
    <OuterEffectSurface>
      <BorderBeam
        size={110}
        duration={7}
        borderWidth={2}
        colorFrom="var(--theme-progress-start)"
        colorTo="var(--theme-progress-end)"
      />
      <div>
        <p className="text-2xl font-semibold">Border Beam</p>
        <p className="mt-2 text-sm text-zinc-500">Light travels the edge.</p>
      </div>
    </OuterEffectSurface>
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
  return (
    <OuterEffectSurface className="min-h-60 p-0">
      <VideoText
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        fontSize={18}
        fontFamily="Hancom MalangMalang"
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
    <p className="max-w-2xl text-center text-4xl font-semibold leading-tight text-foreground">
      Build with{' '}
      <Highlighter
        color="#fde68a"
        strokeWidth={2.5}
        padding={6}
        animationDuration={900}
      >
        hand drawn
      </Highlighter>{' '}
      marks and{' '}
      <Highlighter
        action="underline"
        color="#38bdf8"
        strokeWidth={2}
        padding={6}
        animationDuration={900}
      >
        underlines
      </Highlighter>
      .
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
    case 'variable-proximity':
      return <VariableProximityPreview />
    case 'click-spark':
      return <ClickSparkPreview />
    case 'magnet':
      return <MagnetPreview />
    case 'strands':
      return <StrandsPreview mode={mode} />
    case 'circular-gallery':
      return <CircularGalleryPreview />
    case 'stack':
      return <StackPreview />
    case 'glass-surface':
      return <GlassSurfacePreview />
    case 'folder':
      return <FolderPreview />
    case 'lanyard':
      return <LanyardPreview mode={mode} />
    case 'carousel':
      return <CarouselPreview />
    case 'border-glow':
      return <BorderGlowReactBitsPreview />
    case 'elastic-slider':
      return <ElasticSliderPreview />
    case 'counter':
      return <CounterPreview />
    case 'aurora':
      return <AuroraPreview />
    case 'dot-field':
      return <DotFieldPreview />
    case 'border-beam':
      return <BorderBeamPreview />
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
    case 'pixelated-canvas':
      return <PixelatedCanvasPreview />
    case 'wobble-card':
      return <WobbleCardPreview />
    case 'comet-card':
      return <CometCardPreview />
    case 'floating-dock':
      return <FloatingDockPreview />
    case 'signup-form':
      return <SignupFormPreview />
    case 'placeholders-and-vanish-input':
      return <PlaceholdersAndVanishInputPreview />
    case 'gooey-input':
      return <GooeyInputPreview />
    case 'link-preview':
      return <LinkPreviewPreview />
    case '3d-marquee':
      return <ThreeDMarqueePreview />
    case 'avatar-group':
      return <AvatarGroupPreview />
    case 'animated-checkbox':
      return <AnimatedCheckboxPreview />
    case 'file-upload':
      return <FileUploadPreview />
    case 'animated-radio-group':
      return <AnimatedRadioGroupPreview />
    case 'playful-todolist':
      return <PlayfulTodoListPreview />
    case 'border-beam-button':
      return <BorderBeamButtonPreview />
    case 'slide-arrow-button':
      return <SlideArrowButtonPreview />
    case 'flower-menu':
      return <FlowerMenuPreview />
    case 'speed-dial':
      return <SpeedDialPreview />
    case 'kinetic-center-build':
      return <KineticCenterBuildPreview />
    case 'text-flip':
      return <TextFlipPreview />
    case 'cool-theme-toggle':
      return <CoolThemeTogglePreview />
    case 'toggle-theme':
      return <ToggleThemePreview />
    case '3d-image-carousel':
      return <ThreeDImageCarouselPreview />
    case '3d-image-slider':
      return <ThreeDImageSliderPreview />
    case 'sparkle-cursor':
      return <SparkleCursorPreview />
    case 'stepper':
      return <StepperPreview />
    case 'data-table':
      return <DataTablePreview />
    }
  })()

  if (sample.categoryId === 'text') {
    return <TextPreviewFont>{content}</TextPreviewFont>
  }

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
