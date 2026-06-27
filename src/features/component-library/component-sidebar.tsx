'use client'

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { componentCategories, componentSamples } from './component-data'

const baseLinkClass =
  'relative isolate block rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50'

function getLinkClass(isActive: boolean) {
  if (isActive) {
    return `${baseLinkClass} text-zinc-950 dark:text-zinc-50`
  }

  return `${baseLinkClass} text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900`
}

const stableStickyStyle = {
  willChange: 'transform',
  contain: 'layout paint',
  transform: 'translateZ(0)',
} as const satisfies CSSProperties

function SidebarLink({
  href,
  isActive,
  layoutDependency,
  children,
}: {
  href: string
  isActive: boolean
  layoutDependency: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={getLinkClass(isActive)}
    >
      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.span
            layoutId="component-sidebar-active-indicator"
            layoutDependency={layoutDependency}
            aria-hidden="true"
            className="absolute inset-0 z-0 rounded-lg border border-zinc-200 bg-zinc-100 shadow-[0_10px_24px_-18px_rgba(24,24,27,0.42)] dark:border-zinc-800 dark:bg-zinc-900"
            style={stableStickyStyle}
            transition={{ type: 'spring', stiffness: 520, damping: 42, mass: 0.7 }}
          />
        ) : null}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </Link>
  )
}

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase()
}

export function ComponentSidebar() {
  const pathname = usePathname()
  const isIntroActive = pathname === '/components'
  const [componentSearchQuery, setComponentSearchQuery] = useState('')
  const normalizedSearchQuery = normalizeSearchValue(componentSearchQuery)
  const filteredSamples = useMemo(() => {
    if (!normalizedSearchQuery) return componentSamples

    return componentSamples.filter((sample) => {
      const categoryName =
        componentCategories.find((category) => category.id === sample.categoryId)
          ?.name ?? ''
      const searchableText = [
        sample.title,
        sample.slug,
        sample.description,
        categoryName,
      ]
        .join(' ')
        .toLocaleLowerCase()

      return searchableText.includes(normalizedSearchQuery)
    })
  }, [normalizedSearchQuery])
  const showIntroLink =
    !normalizedSearchQuery ||
    'introduction 소개 인트로'.includes(normalizedSearchQuery)

  return (
    <ScrollArea
      element="aside"
      aria-label="컴포넌트 문서 탐색"
      className="lg:h-full lg:scroll-pb-24 lg:overflow-y-auto lg:overscroll-contain lg:pr-4"
      data-lenis-prevent-wheel
      orientation="vertical"
    >
      <nav aria-label="Component categories" className="space-y-7 px-1 pb-24 pt-1">
        <div
          className="sticky top-1 z-20 -mx-1 bg-white/95 px-1 pb-3 pt-1 backdrop-blur transform-gpu dark:bg-zinc-950/95"
          style={stableStickyStyle}
        >
          <label className="sr-only" htmlFor="component-search-input">
            컴포넌트 메뉴 검색
          </label>
          <input
            id="component-search-input"
            type="search"
            value={componentSearchQuery}
            onChange={(event) => setComponentSearchQuery(event.target.value)}
            aria-label="컴포넌트 메뉴 검색"
            placeholder="컴포넌트 검색"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
        </div>
        {showIntroLink ? (
          <div>
            <SidebarLink
              href="/components"
              isActive={isIntroActive}
              layoutDependency={pathname}
            >
              Introduction
            </SidebarLink>
          </div>
        ) : null}
        {componentCategories.map((category) => {
          const samples = filteredSamples.filter(
            (sample) => sample.categoryId === category.id
          )

          if (samples.length === 0) return null

          return (
            <div key={category.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                {category.name}
              </p>
              <div className="mt-2 space-y-1">
                {samples.map((sample) => {
                  const href = `/components/${sample.slug}`
                  const isActive = pathname === href

                  return (
                    <SidebarLink
                      key={sample.slug}
                      href={href}
                      isActive={isActive}
                      layoutDependency={pathname}
                    >
                      {sample.title}
                    </SidebarLink>
                  )
                })}
              </div>
            </div>
          )
        })}
        {normalizedSearchQuery && filteredSamples.length === 0 ? (
          <p className="rounded-lg border border-zinc-200 px-3 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            검색 결과가 없습니다.
          </p>
        ) : null}
      </nav>
    </ScrollArea>
  )
}
