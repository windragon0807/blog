'use client'

import { useState } from 'react'
import { XIcon } from 'lucide-react'
import { SettingsSection } from '@/components/common/SettingsSection'
import { SettingsIcon } from '@/components/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { BlogThemeSelect } from './BlogThemeSelect'
import { IconControlButton } from './IconControlButton'
import { ReadingPreferencesControls } from './ReadingPreferencesControls'

const SETTINGS_MENU_PORTAL_SELECTOR = '[data-settings-menu-portal]'

function handleSettingsDrawerInteractOutside(event: Event) {
  const target = event.target

  if (
    target instanceof Element &&
    target.closest(SETTINGS_MENU_PORTAL_SELECTOR)
  ) {
    event.preventDefault()
  }
}

export function ThemeSettingsMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <IconControlButton srLabel="설정 열기">
          <SettingsIcon className="block h-[18px] w-[18px]" />
        </IconControlButton>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby={undefined}
        onInteractOutside={handleSettingsDrawerInteractOutside}
      >
        <header className="shrink-0 px-5 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-4">
            <DrawerTitle>설정</DrawerTitle>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="설정 닫기"
                className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground outline-none transition-[background-color,color,transform] after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-foreground active:translate-y-px focus-visible:ring-2 focus-visible:ring-ring/45"
              >
                <XIcon aria-hidden="true" className="size-[18px]" />
              </button>
            </DrawerClose>
          </div>
        </header>

        <ScrollArea
          data-lenis-prevent=""
          className="settings-drawer-scroll min-h-0 flex-1"
        >
          <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-1">
            <div className="grid gap-3">
              <SettingsSection
                label="색상"
                description="강조 색상과 코드 표시 색상에 함께 반영됩니다."
              >
                <BlogThemeSelect />
              </SettingsSection>

              <ReadingPreferencesControls />
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
