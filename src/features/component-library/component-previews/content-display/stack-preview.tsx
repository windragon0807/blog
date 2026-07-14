import type { ReactNode } from 'react'
import { Stack } from '@/components/stack'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

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

export function StackPreview() {
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
