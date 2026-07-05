'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { LayoutGridIcon } from '@/components/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconControlButton } from './IconControlButton'

interface AppLink {
  id: string
  name: string
  description: string
  href: string
  iconSrc: string
}

const APP_LINKS: AppLink[] = [
  {
    id: 'openrun',
    name: 'OpenRun',
    description: '러닝 커뮤니티',
    href: 'https://open-run.vercel.app/',
    iconSrc: '/apps/openrun-icon.png',
  },
]

export function AppLauncherMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconControlButton srLabel="프로젝트 링크 열기">
          <LayoutGridIcon className="block h-[18px] w-[18px]" />
        </IconControlButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={9}
        aria-label="프로젝트 패널"
        data-mobile-center-popover=""
        className="settings-popover w-[min(92vw,21rem)] rounded-xl border border-border/80 bg-popover p-2.5 text-popover-foreground shadow-[0_18px_42px_-32px_rgba(15,23,42,0.42)] backdrop-blur-md dark:border-zinc-700/70 dark:shadow-[0_24px_54px_-36px_rgba(2,6,23,0.82)]"
      >
        <p className="px-1 text-xs font-semibold leading-none text-muted-foreground">
          프로젝트
        </p>

        <div className="mt-2 grid gap-2">
          {APP_LINKS.map((app) => (
            <a
              key={app.id}
              href={app.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="settings-item group flex min-h-12 items-center gap-3 rounded-lg border border-transparent bg-muted/45 p-2.5 text-left transition-[background-color,border-color,box-shadow] hover:border-border/70 hover:bg-background/80 focus-visible:border-ring/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
            >
              <Image
                src={app.iconSrc}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg bg-background/70 object-cover ring-1 ring-border/60"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {app.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {app.description}
                </p>
              </div>
              <ExternalLink
                className="h-3.5 w-3.5 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
