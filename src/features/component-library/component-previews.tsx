'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { IconCloud } from '@/components/magicui/icon-cloud'
import { Lens } from '@/components/magicui/lens'
import { Marquee } from '@/components/magicui/marquee'
import { Pointer } from '@/components/magicui/pointer'
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
    <figure
      className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-4 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
    >
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
          See our latest and best camp destinations all across the five
          continents of the globe.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950"
          >
            Let&apos;s go
          </button>
          <button
            type="button"
            className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
          >
            Another time
          </button>
        </div>
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
      <PointerTile
        title="Colored Pointer"
        description="A custom pointer with different color"
      >
        <Pointer className="fill-blue-500" />
      </PointerTile>
      <PointerTile title="Custom Shape" description="A pointer with a custom SVG shape">
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
      <PointerTile title="Emoji Pointer" description="Using an emoji as a custom pointer">
        <Pointer>
          <div className="text-2xl">Up</div>
        </Pointer>
      </PointerTile>
    </div>
  )
}

function BasePreviewContent({
  sample,
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
