import type { Metadata } from 'next'
import { InstallCommand } from '@/features/component-library/component-docs'
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
      </header>

      <section
        id="installation"
        className="scroll-mt-24 pb-12"
      >
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">
          Installation
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-500">
          배포된 registry item JSON을 shadcn CLI로 직접 가져오는 구조입니다.
        </p>
        <div className="mt-5">
          <InstallCommand command="pnpm dlx shadcn@latest add https://ryong.dev/r/marquee.json" />
        </div>
      </section>
    </>
  )
}
