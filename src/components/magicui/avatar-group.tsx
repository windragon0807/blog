'use client'

import { cn } from '@/lib/utils'

export interface AvatarGroupItem {
  src?: string
  name: string
  fallback?: string
}

interface AvatarGroupProps {
  items: AvatarGroupItem[]
  max?: number
  className?: string
}

export function AvatarGroup({ items, max = 5, className }: AvatarGroupProps) {
  const visible = items.slice(0, max)
  const extra = Math.max(items.length - visible.length, 0)

  return (
    <div className={cn('flex items-center -space-x-3', className)}>
      {visible.map((item) => (
        <div
          key={item.name}
          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-zinc-100 text-sm font-semibold text-zinc-700 shadow-sm dark:border-zinc-950 dark:bg-zinc-800 dark:text-zinc-200"
          title={item.name}
        >
          {item.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            item.fallback ?? item.name.slice(0, 2).toUpperCase()
          )}
        </div>
      ))}
      {extra > 0 && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[var(--theme-accent-current)] text-sm font-semibold text-[var(--background)] shadow-sm dark:border-zinc-950">
          +{extra}
        </div>
      )}
    </div>
  )
}
