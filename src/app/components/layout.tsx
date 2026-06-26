import type { ReactNode } from 'react'
import { ComponentSidebar } from '@/features/component-library/component-docs'

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
      <div className="mx-auto grid w-full max-w-[1380px] gap-8 px-4 pb-20 pt-6 md:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:px-10">
        <ComponentSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
