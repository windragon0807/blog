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
import {
  componentCategories,
  componentSamples,
  isComponentHiddenOnMobile,
} from './component-data'

const baseLinkClass =
  'relative isolate block rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50'

function getLinkClass(isActive: boolean) {
  if (isActive) {
    return `${baseLinkClass} text-zinc-950 dark:text-zinc-50`
  }

  return `${baseLinkClass} text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60`
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
            className="component-sidebar-active-indicator pointer-events-none absolute inset-0 z-[1] rounded-lg border border-zinc-200 bg-zinc-100 shadow-[0_10px_24px_-18px_rgba(24,24,27,0.42)] dark:border-zinc-700/70 dark:bg-zinc-800/70 dark:shadow-[0_14px_28px_-22px_rgba(2,6,23,0.86)]"
            style={stableStickyStyle}
            transition={{ type: 'spring', stiffness: 520, damping: 42, mass: 0.7 }}
          />
        ) : null}
      </AnimatePresence>
      <span data-component-sidebar-label="" className="relative z-[2]">
        {children}
      </span>
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
      className="relative z-30 bg-background/95 px-1 pb-3 pt-1 backdrop-blur-md"
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
        className="w-full rounded-xl border border-zinc-200/85 bg-white/90 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-[background-color,border-color,box-shadow,color] placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700/70 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:bg-zinc-900/80 dark:focus:ring-zinc-50/10"
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
  const visibleSamples = useMemo(
    () =>
      layoutScope === 'mobile'
        ? componentSamples.filter(
            (sample) => !isComponentHiddenOnMobile(sample.slug)
          )
        : componentSamples,
    [layoutScope]
  )
  const filteredSamples = useMemo(() => {
    if (!normalizedSearchQuery) return visibleSamples

    return visibleSamples.filter((sample) => {
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
  }, [normalizedSearchQuery, visibleSamples])
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
          <div className="space-y-6 px-1 pb-[max(5rem,env(safe-area-inset-bottom))] pt-5 lg:pt-6">
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
              <p className="rounded-lg border border-zinc-200 px-3 py-4 text-sm text-zinc-500 dark:border-zinc-700/70 dark:bg-zinc-900/45 dark:text-zinc-400">
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
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] lg:hidden">
        <DialogTrigger asChild>
          <button
            type="button"
            data-component-mobile-menu-trigger=""
            className="inline-grid h-12 w-12 place-items-center rounded-full border border-zinc-200 bg-white/94 text-zinc-600 shadow-[0_18px_44px_-24px_rgba(24,24,27,0.62)] backdrop-blur-xl transition-colors hover:bg-white hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-zinc-800/90 dark:bg-zinc-950/92 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus-visible:outline-zinc-50"
            aria-label="컴포넌트 메뉴 열기"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </DialogTrigger>
      </div>
      <DialogPortal>
        <DialogOverlay className="z-[70] bg-black/45 backdrop-blur-[2px]" />
        <DialogRawContent className="component-mobile-bottom-sheet fixed inset-x-0 bottom-0 z-[71] h-[min(82svh,40rem)] overflow-hidden rounded-t-[28px] border border-b-0 border-zinc-200 bg-white p-0 shadow-2xl outline-none dark:border-zinc-800 dark:bg-zinc-950">
          <DialogTitle className="sr-only">컴포넌트 메뉴</DialogTitle>
          <div className="flex h-full min-h-0 min-w-0 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            <div
              aria-hidden="true"
              className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800"
            />
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
