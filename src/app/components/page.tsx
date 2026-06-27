import type { Metadata } from 'next'
import Link from 'next/link'
import { InstallCommand, PreviewFrame } from '@/features/component-library/component-docs'
import {
  componentCategories,
  componentSamples,
} from '@/features/component-library/component-data'

export const metadata: Metadata = {
  title: 'components | ryong.log',
  description: 'shadcn, Tailwind v4, React/Next 기준 컴포넌트 레지스트리',
  alternates: {
    canonical: '/components',
  },
}

function getCategoryName(categoryId: string) {
  return (
    componentCategories.find((category) => category.id === categoryId)?.name ??
    categoryId
  )
}

export default function ComponentsPage() {
  return (
    <>
      <header className="pb-10">
        <p className="text-sm font-medium text-zinc-500">ryong.components</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          Components
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          shadcn, Tailwind v4, React/Next 기준으로 정리하는 개인 컴포넌트 레지스트리입니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/components/${componentSamples[0]?.slug ?? ''}`}
            className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
          >
            Browse components
          </Link>
          <Link
            href="#installation"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Installation
          </Link>
        </div>
      </header>

      <section id="installation" className="scroll-mt-24 pb-12">
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Installation
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          배포된 registry item JSON을 shadcn CLI로 직접 가져오는 구조입니다.
        </p>
        <div className="mt-5">
          <InstallCommand command="pnpm dlx shadcn@latest add https://ryong.dev/r/marquee.json" />
        </div>
      </section>

      <section id="components" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Components
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              큰 흐름이 보이도록 Actions, Content, Data, Text, Effects 기준으로 컴포넌트를 다시 묶었습니다. 상세 문서는 개별 페이지에서 다룹니다.
            </p>
          </div>
          <p className="text-sm text-zinc-500">{componentSamples.length} samples</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {componentSamples.map((sample) => (
            <Link
              key={sample.slug}
              href={`/components/${sample.slug}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_18px_32px_-24px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <div className="p-3">
                <PreviewFrame sample={sample} mode="thumbnail" />
              </div>
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  {getCategoryName(sample.categoryId)}
                </p>
                <div className="mt-2">
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {sample.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {sample.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
