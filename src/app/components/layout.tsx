import type { ReactNode } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ComponentMobileSidebarTrigger,
  ComponentSidebar,
} from '@/features/component-library/component-sidebar'

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="components-scroll-shell relative left-1/2 right-1/2 -mt-9 w-screen -translate-x-1/2 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:top-[6.25rem] lg:mt-0 lg:w-auto lg:translate-x-0 lg:overflow-hidden"
      data-lenis-prevent-wheel
    >
      <div className="components-shell-grid h-full w-full px-4 pb-20 pt-6 md:px-8 lg:overflow-hidden lg:px-0 lg:pb-0">
        <div className="components-sidebar-slot hidden min-w-0 lg:block">
          <ComponentSidebar />
        </div>
        <ScrollArea
          className="components-content-scroll min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain"
          data-lenis-prevent-wheel
          orientation="vertical"
        >
          <div className="components-content-inner lg:pb-20 lg:pr-10">
            <ComponentMobileSidebarTrigger />
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
