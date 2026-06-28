'use client'

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogRawContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  layoutScope,
  onNavigate,
  children,
}: {
  href: string
  isActive: boolean
  layoutDependency: string
  layoutScope: string
  onNavigate?: () => void
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={getLinkClass(isActive)}
      onClick={onNavigate}
    >
      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.span
            layoutId={`component-sidebar-active-indicator-${layoutScope}`}
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

function ComponentSearchInput({
  value,
  onChange,
  inputId,
}: {
  value: string
  onChange: (value: string) => void
  inputId: string
}) {
  return (
    <div
      className="relative z-30 bg-white px-1 pb-3 pt-1 dark:bg-zinc-950"
      style={stableStickyStyle}
    >
      <label className="sr-only" htmlFor={inputId}>
        컴포넌트 메뉴 검색
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="컴포넌트 메뉴 검색"
        placeholder="컴포넌트 검색"
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
      />
    </div>
  )
}

function ComponentSidebarContent({
  layoutScope,
  inputId,
  onNavigate,
}: {
  layoutScope: string
  inputId: string
  onNavigate?: () => void
}) {
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
    <div className="flex h-full min-h-0 flex-col">
      <ComponentSearchInput
        inputId={inputId}
        value={componentSearchQuery}
        onChange={setComponentSearchQuery}
      />
      <div className="relative min-h-0 flex-1">
        <ScrollArea
          element="nav"
          aria-label="Component categories"
          className="components-sidebar-list-scroll h-full scroll-pb-24 overflow-y-auto overscroll-contain pr-4"
          data-lenis-prevent-wheel
          orientation="vertical"
        >
          <div className="space-y-7 px-1 pb-[max(6rem,env(safe-area-inset-bottom))] pt-3">
            {showIntroLink ? (
              <div>
                <SidebarLink
                  href="/components"
                  isActive={isIntroActive}
                  layoutDependency={pathname}
                  layoutScope={layoutScope}
                  onNavigate={onNavigate}
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
                          layoutScope={layoutScope}
                          onNavigate={onNavigate}
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
          </div>
        </ScrollArea>
        <span aria-hidden="true" className="components-sidebar-fog-top" />
        <span aria-hidden="true" className="components-sidebar-fog-bottom" />
      </div>
    </div>
  )
}

function getCurrentComponentTitle(pathname: string) {
  const slug = pathname.startsWith('/components/')
    ? pathname.replace('/components/', '')
    : ''

  return componentSamples.find((sample) => sample.slug === slug)?.title
}

export function ComponentSidebar() {
  return (
    <aside
      aria-label="컴포넌트 문서 탐색"
      className="flex h-full min-h-0 flex-col"
    >
      <ComponentSidebarContent
        inputId="component-search-input"
        layoutScope="desktop"
      />
    </aside>
  )
}

export function ComponentMobileSidebarTrigger() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const currentTitle = getCurrentComponentTitle(pathname) ?? 'Components'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-5 lg:hidden">
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-semibold text-zinc-900 shadow-[0_18px_34px_-28px_rgba(24,24,27,0.45)] transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus-visible:outline-zinc-50"
            aria-label="컴포넌트 메뉴 열기"
          >
            <span className="min-w-0">
              <span className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                Browse
              </span>
              <span className="mt-0.5 block truncate">{currentTitle}</span>
            </span>
            <Menu className="h-5 w-5 shrink-0 text-zinc-500" aria-hidden="true" />
          </button>
        </DialogTrigger>
      </div>
      <DialogPortal>
        <DialogOverlay className="z-[70] bg-black/45 backdrop-blur-[2px]" />
        <DialogRawContent className="component-mobile-nav-panel fixed left-0 top-0 z-[71] h-svh w-[min(22rem,86vw)] border-r border-zinc-200 bg-white p-0 shadow-2xl outline-none dark:border-zinc-800 dark:bg-zinc-950">
          <DialogTitle className="sr-only">컴포넌트 메뉴</DialogTitle>
          <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Components
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:outline-zinc-50"
                aria-label="컴포넌트 메뉴 닫기"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ComponentSidebarContent
              inputId="component-search-input-mobile"
              layoutScope="mobile"
              onNavigate={() => setOpen(false)}
            />
          </div>
        </DialogRawContent>
      </DialogPortal>
    </Dialog>
  )
}
