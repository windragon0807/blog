'use client'

import { useState } from 'react'
import { SettingsSection } from '@/components/common/SettingsSection'
import { SettingsIcon } from '@/components/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BlogThemeSelect } from './BlogThemeSelect'
import { CodeThemeSelect } from './CodeThemeSelect'
import { FontThemeSelect } from './FontThemeSelect'
import { IconControlButton } from './IconControlButton'

const SETTINGS_MENU_PORTAL_SELECTOR = '[data-settings-menu-portal]'

function handleSettingsMenuInteractOutside(event: Event) {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconControlButton srLabel="보기 설정 열기">
          <SettingsIcon className="block h-[18px] w-[18px]" />
        </IconControlButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={9}
        aria-label="보기 설정 패널"
        data-settings-menu-portal=""
        data-mobile-center-popover=""
        onInteractOutside={handleSettingsMenuInteractOutside}
        className="settings-popover w-[min(92vw,21rem)] rounded-xl border border-border/80 bg-popover p-2.5 text-popover-foreground shadow-[0_18px_42px_-32px_rgba(15,23,42,0.42)] backdrop-blur-md dark:border-zinc-700/70 dark:shadow-[0_24px_54px_-36px_rgba(2,6,23,0.82)]"
      >
        <p className="px-1 text-xs font-semibold leading-none text-muted-foreground">
          보기 설정
        </p>

        <div className="mt-2 grid gap-2">
          <SettingsSection label="색상">
            <BlogThemeSelect className="h-10 w-full text-sm" />
          </SettingsSection>
          <SettingsSection label="글꼴">
            <FontThemeSelect className="h-10 w-full text-sm" />
          </SettingsSection>
          <SettingsSection label="코드">
            <CodeThemeSelect className="h-10 w-full text-sm" />
          </SettingsSection>
        </div>
      </PopoverContent>
    </Popover>
  )
}
