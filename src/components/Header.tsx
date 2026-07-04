'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GitHubIcon,
  HouseIcon,
  PuzzleIcon,
  SmileStorageIcon,
} from '@/components/icons'
import { usePostsPrefetch } from '@/hooks/usePostsPrefetch'
import { cn } from '@/lib/utils'
import { AppLauncherMenu } from './AppLauncherMenu'
import { ICON_CONTROL_BUTTON_CLASS_NAME } from './IconControlButton'
import { ThemeModeButton } from './ThemeModeButton'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'

function HeaderAuroraIconDefs() {
  return (
    <svg
      aria-hidden="true"
      data-header-aurora-defs=""
      focusable="false"
      width="0"
      height="0"
      className="header-aurora-icon-defs pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <linearGradient
          id="header-active-aurora-icon-gradient"
          x1="3"
          y1="3"
          x2="21"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--header-active-aurora-violet)" />
          <stop offset="52%" stopColor="var(--header-active-aurora-blue)" />
          <stop offset="100%" stopColor="var(--header-active-aurora-violet)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function HeaderNavLink({
  href,
  label,
  isActive,
  children,
  onFocus,
  onMouseEnter,
  onTouchStart,
}: {
  href: string
  label: string
  isActive: boolean
  children: ReactNode
  onFocus?: () => void
  onMouseEnter?: () => void
  onTouchStart?: () => void
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      data-active-route={isActive ? 'true' : undefined}
      className={cn(
        ICON_CONTROL_BUTTON_CLASS_NAME,
        isActive &&
          'header-active-aurora overflow-visible border-transparent focus:ring-0 focus-visible:ring-0 dark:border-transparent'
      )}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
    >
      {isActive ? <HeaderAuroraIconDefs /> : null}
      <span className="sr-only">{label}</span>
      {children}
    </Link>
  )
}

export function Header() {
  const prefetchPosts = usePostsPrefetch()
  const pathname = usePathname()
  const isHomeActive = pathname === '/'
  const isComponentsActive = pathname === '/components' || pathname.startsWith('/components/')
  const isEmoticonsActive = pathname === '/emoticons'

  return (
    <header className="glass-surface header-sticky top-0 z-50">
      <div className="px-2.5 md:px-3">
        <div className="flex min-h-14 items-center justify-center py-2 sm:py-0">
          <nav
            aria-label="주요 이동"
            className="flex shrink-0 items-center justify-center gap-2 sm:gap-2.5"
          >
            <div
              role="group"
              aria-label="사이트 탐색"
              className="flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <HeaderNavLink
                href="/"
                label="홈으로 이동"
                isActive={isHomeActive}
                onFocus={prefetchPosts}
                onMouseEnter={prefetchPosts}
                onTouchStart={prefetchPosts}
              >
                <HouseIcon className="h-[18px] w-[18px]" />
              </HeaderNavLink>
              <HeaderNavLink
                href="/components"
                label="컴포넌트 라이브러리로 이동"
                isActive={isComponentsActive}
              >
                <PuzzleIcon className="h-[18px] w-[18px]" />
              </HeaderNavLink>
              <HeaderNavLink
                href="/emoticons"
                label="이모티콘 스토리지로 이동"
                isActive={isEmoticonsActive}
              >
                <SmileStorageIcon className="h-[18px] w-[18px]" />
              </HeaderNavLink>
              <AppLauncherMenu />
            </div>

            <span
              aria-hidden="true"
              className="h-7 w-px shrink-0 rounded-full bg-gradient-to-b from-transparent via-zinc-300/80 to-transparent dark:via-zinc-600/75"
            />

            <div
              role="group"
              aria-label="환경 및 외부 링크"
              className="flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <ThemeModeButton />
              <Link
                href="https://github.com/windragon0807"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub 프로필 새 창으로 열기"
                className={ICON_CONTROL_BUTTON_CLASS_NAME}
              >
                <span className="sr-only">GitHub 프로필 새 창으로 열기</span>
                <GitHubIcon className="h-[18px] w-[18px]" />
              </Link>
              <ThemeSettingsMenu />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
