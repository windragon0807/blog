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
            className="flex shrink-0 items-center justify-center gap-1.5 sm:gap-2"
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
            <ThemeModeButton />
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
          </nav>
        </div>
      </div>
    </header>
  )
}
