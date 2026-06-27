import type { Metadata } from 'next'
import Link from 'next/link'
import { InstallCommand } from '@/features/component-library/component-docs'
import { componentSamples } from '@/features/component-library/component-data'

export const metadata: Metadata = {
  title: 'components | ryong.log',
  description: 'shadcn, Tailwind v4, React/Next 기준 컴포넌트 레지스트리',
  alternates: {
    canonical: '/components',
  },
}

export default function ComponentsPage() {
  return (
    <>
      <header className="pb-10">
        <p className="text-sm font-medium text-zinc-500">ryong.registry</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          Introduction
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          shadcn, Tailwind v4, React/Next 기준으로 정리하는 개인 UI 레지스트리입니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/components/${componentSamples[0]?.slug ?? ''}`}
            className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
          >
            Browse library
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
    </>
  )
}
