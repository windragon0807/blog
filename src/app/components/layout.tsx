import type { ReactNode } from 'react'
import { ComponentSidebar } from '@/features/component-library/component-sidebar'

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="components-scroll-shell relative left-1/2 right-1/2 w-screen -translate-x-1/2 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:top-[6.25rem] lg:w-auto lg:translate-x-0 lg:overflow-hidden"
      data-lenis-prevent-wheel
    >
      <div className="mx-auto grid h-full w-full max-w-[1380px] gap-8 px-4 pb-20 pt-6 md:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:overflow-hidden lg:px-10 lg:pb-0">
        <ComponentSidebar />
        <div
          className="min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pb-20 lg:pr-2"
          data-lenis-prevent-wheel
        >
          {children}
        </div>
      </div>
    </div>
  )
}
