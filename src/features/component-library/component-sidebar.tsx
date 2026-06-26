'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { componentCategories, componentSamples } from './component-data'

const baseLinkClass =
  'block rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50'

function getLinkClass(isActive: boolean) {
  if (isActive) {
    return `${baseLinkClass} border-zinc-200 bg-zinc-100 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50`
  }

  return `${baseLinkClass} text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900`
}

export function ComponentSidebar() {
  const pathname = usePathname()

  return (
    <aside
      aria-label="컴포넌트 문서 탐색"
      className="lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pr-4"
    >
      <nav aria-label="Component categories" className="space-y-7 px-1 py-1">
        {componentCategories.map((category) => {
          const samples = componentSamples.filter(
            (sample) => sample.categoryId === category.id
          )

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
                    <Link
                      key={sample.slug}
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={getLinkClass(isActive)}
                    >
                      {sample.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
