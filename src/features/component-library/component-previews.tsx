'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { AuroraText } from '@/components/magicui/aurora-text'
import { BorderBeam } from '@/components/magicui/border-beam'
import { ConfettiButton } from '@/components/magicui/confetti'
import { DiaTextReveal } from '@/components/magicui/dia-text-reveal'
import { Highlighter } from '@/components/magicui/highlighter'
import { IconCloud } from '@/components/magicui/icon-cloud'
import { Lens } from '@/components/magicui/lens'
import { Marquee } from '@/components/magicui/marquee'
import { Meteors } from '@/components/magicui/meteors'
import { MorphingText } from '@/components/magicui/morphing-text'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Particles } from '@/components/magicui/particles'
import { Pointer } from '@/components/magicui/pointer'
import { ShineBorder } from '@/components/magicui/shine-border'
import { TextAnimate } from '@/components/magicui/text-animate'
import { TypingAnimation } from '@/components/magicui/typing-animation'
import { VideoText } from '@/components/magicui/video-text'
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

function PreviewSurface({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative flex min-h-52 w-full max-w-xl items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
    >
      {children}
    </div>
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
      className={`relative flex min-h-60 w-full items-center justify-center overflow-hidden rounded-[inherit] bg-white p-8 text-center text-zinc-950 dark:bg-white dark:text-zinc-950 ${className}`}
    >
      {children}
    </div>
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
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="relative flex h-40 flex-col items-center justify-center">
        <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
            <circle cx="12" cy="12" r="5" className="fill-white" />
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
        colorFrom="#2563eb"
        colorTo="#ec4899"
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
    <PreviewSurface>
      <ShineBorder
        borderWidth={2}
        shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
      />
      <div>
        <p className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Shine Border
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          A soft animated border.
        </p>
      </div>
    </PreviewSurface>
  )
}

function MeteorsPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface>
      <Meteors
        number={mode === 'thumbnail' ? 8 : 22}
        className="bg-sky-500 shadow-[0_0_0_1px_rgba(14,165,233,0.2)]"
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
      <ConfettiButton type="button" className="relative rounded-lg">
        Celebrate
      </ConfettiButton>
    </OuterEffectSurface>
  )
}

function ParticlesPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface>
      <Particles
        className="absolute inset-0"
        quantity={mode === 'thumbnail' ? 40 : 90}
        color="#0ea5e9"
        ease={80}
      />
      <div className="relative">
        <p className="text-2xl font-semibold">Particles</p>
        <p className="mt-2 text-sm text-zinc-500">Canvas depth and motion.</p>
      </div>
    </OuterEffectSurface>
  )
}

function TextAnimatePreview() {
  return (
    <TextAnimate
      by="word"
      animation="blurInUp"
      className="text-center text-4xl font-semibold text-zinc-950 dark:text-zinc-50"
    >
      Text Animate
    </TextAnimate>
  )
}

function TypingAnimationPreview() {
  return (
    <TypingAnimation
      words={['Typing Animation', 'Typed Motion', 'Text Loop']}
      loop
      className="text-4xl font-semibold text-zinc-950 dark:text-zinc-50"
    />
  )
}

function AuroraTextPreview() {
  return (
    <p className="text-center text-5xl font-semibold tracking-normal">
      <AuroraText>Aurora Text</AuroraText>
    </p>
  )
}

function VideoTextPreview() {
  return (
    <OuterEffectSurface className="min-h-60 p-0">
      <VideoText
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        fontSize={18}
        className="h-48 w-full"
      >
        VIDEO
      </VideoText>
    </OuterEffectSurface>
  )
}

function NumberTickerPreview() {
  return (
    <p className="text-6xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
      <NumberTicker value={12840} />
    </p>
  )
}

function AnimatedShinyTextPreview() {
  return (
    <AnimatedShinyText className="text-4xl font-semibold">
      Animated Shiny Text
    </AnimatedShinyText>
  )
}

function AnimatedGradientTextPreview() {
  return (
    <AnimatedGradientText className="text-4xl font-semibold">
      Animated Gradient Text
    </AnimatedGradientText>
  )
}

function DiaTextRevealPreview() {
  return (
    <DiaTextReveal
      text={['Dia Text Reveal', 'Color Sweep', 'Magic UI']}
      repeat
      className="text-center text-4xl font-semibold"
    />
  )
}

function MorphingTextPreview() {
  return (
    <MorphingText
      texts={['Design', 'Build', 'Ship']}
      className="h-20 text-[42px] md:h-24"
    />
  )
}

function HighlighterPreview() {
  return (
    <p className="max-w-2xl text-center text-4xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
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
  switch (sample.preview.kind) {
    case 'marquee':
      return <MarqueePreview />
    case 'icon-cloud':
      return <IconCloudPreview />
    case 'lens':
      return <LensPreview />
    case 'pointer':
      return <PointerPreview />
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
    case 'text-animate':
      return <TextAnimatePreview />
    case 'typing-animation':
      return <TypingAnimationPreview />
    case 'aurora-text':
      return <AuroraTextPreview />
    case 'video-text':
      return <VideoTextPreview />
    case 'number-ticker':
      return <NumberTickerPreview />
    case 'animated-shiny-text':
      return <AnimatedShinyTextPreview />
    case 'animated-gradient-text':
      return <AnimatedGradientTextPreview />
    case 'dia-text-reveal':
      return <DiaTextRevealPreview />
    case 'morphing-text':
      return <MorphingTextPreview />
    case 'highlighter':
      return <HighlighterPreview />
  }
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
