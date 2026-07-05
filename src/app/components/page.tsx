import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Boxes,
  Code2,
  Component,
  Layers3,
  PackagePlus,
  Sparkles,
} from 'lucide-react'
import {
  componentCategories,
  componentRegistryBaseUrl,
  componentSamples,
  getComponentSampleBySlug,
  type ComponentCategory,
  type ComponentSample,
} from '@/features/component-library/component-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'components',
    description:
      'shadcn, Tailwind v4, React/Next 기준으로 정리한 개인 UI 컴포넌트 레지스트리입니다.',
    path: '/components',
    imageTitle: 'ryong.components',
    tags: ['UI Components', 'shadcn', 'Tailwind CSS', 'React'],
  }),
}

const featuredComponentSlugs = [
  'data-table',
  'file-tree',
  'toggle-theme',
  'placeholders-and-vanish-input',
  '3d-image-carousel',
  'typing-animation',
] as const

const featuredComponents = featuredComponentSlugs
  .map((slug) => getComponentSampleBySlug(slug))
  .filter((sample): sample is ComponentSample => Boolean(sample))

const installExampleSlug = 'data-table'
const installTarget = `${componentRegistryBaseUrl}/${installExampleSlug}.json`
const installCommand = `pnpm dlx shadcn@latest add ${installTarget}`

function getCategorySamples(categoryId: ComponentCategory['id']) {
  return componentSamples.filter((sample) => sample.categoryId === categoryId)
}

function getCategoryIcon(categoryId: ComponentCategory['id']) {
  switch (categoryId) {
    case 'controls-inputs':
      return Component
    case 'menus-actions':
      return Sparkles
    case 'content-display':
      return Layers3
    case 'data-status':
      return Boxes
    case 'text-effects':
      return Code2
    case 'background-atmosphere':
      return Sparkles
    case 'cursor-interaction-effects':
      return Component
  }
}

export default function ComponentsPage() {
  const categorySummaries = componentCategories
    .map((category) => {
      const samples = getCategorySamples(category.id)
      return {
        category,
        count: samples.length,
        href: samples[0] ? `/components/${samples[0].slug}` : '/components',
      }
    })
    .filter((summary) => summary.count > 0)

  return (
    <article className="pb-20">
      <header className="pb-8">
        <p className="text-sm font-medium text-zinc-500">ryong.registry</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          Components
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          좋아하는 컴포넌트 및 인터렉션 요소들을 모아놓은 공간입니다.
        </p>
      </header>

      <section
        aria-label="Registry summary"
        className="grid gap-3 sm:grid-cols-3"
      >
        {[
          { label: 'Components', value: componentSamples.length },
          { label: 'Categories', value: categorySummaries.length },
          { label: 'Package managers', value: 4 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white/86 p-4 shadow-[0_14px_34px_-30px_rgba(24,24,27,0.38)] dark:border-zinc-800/80 dark:bg-zinc-900/48 dark:shadow-[0_18px_44px_-34px_rgba(2,6,23,0.9)]"
          >
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-500">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section
        aria-labelledby="quick-start-heading"
        className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/82 p-5 dark:border-zinc-800/78 dark:bg-zinc-900/44"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-500">Quick start</p>
            <h2
              id="quick-start-heading"
              className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50"
            >
              Registry install
            </h2>
          </div>
          <PackagePlus
            className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
        </div>
        <code className="mt-4 block overflow-x-auto rounded-xl border border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/72 dark:text-zinc-100">
          {installCommand}
        </code>
      </section>

      <section aria-labelledby="categories-heading" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-500">Browse</p>
            <h2
              id="categories-heading"
              className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50"
            >
              Categories
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categorySummaries.map(({ category, count, href }) => {
            const Icon = getCategoryIcon(category.id)

            return (
              <Link
                key={category.id}
                href={href}
                className="group grid min-h-40 rounded-2xl border border-zinc-200 bg-white/86 p-5 shadow-[0_14px_34px_-30px_rgba(24,24,27,0.38)] transition-[background-color,border-color,box-shadow] hover:border-zinc-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-zinc-800/82 dark:bg-zinc-900/48 dark:shadow-[0_18px_44px_-34px_rgba(2,6,23,0.9)] dark:hover:border-zinc-700 dark:hover:bg-zinc-900/68 dark:focus-visible:outline-zinc-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {count} items
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {category.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {category.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-accent-current)]">
                  Open
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="mt-10">
        <div>
          <p className="text-sm font-medium text-zinc-500">Start here</p>
          <h2
            id="featured-heading"
            className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50"
          >
            Featured components
          </h2>
        </div>

        <div className="mt-5 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white/86 dark:divide-zinc-800 dark:border-zinc-800/82 dark:bg-zinc-900/48">
          {featuredComponents.map((sample) => {
            const categoryName =
              componentCategories.find(
                (category) => category.id === sample.categoryId
              )?.name ?? 'Component'

            return (
              <Link
                key={sample.slug}
                href={`/components/${sample.slug}`}
                className="group grid gap-3 p-5 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-950 dark:hover:bg-zinc-800/46 dark:focus-visible:outline-zinc-50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-500">
                    {categoryName}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {sample.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {sample.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-accent-current)]">
                  Preview
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </article>
  )
}
