'use client'

import Link from 'next/link'
import {
  GitHubIcon,
  HouseIcon,
  PuzzleIcon,
  SmileStorageIcon,
} from '@/components/icons'
import { usePostsPrefetch } from '@/hooks/usePostsPrefetch'
import { AppLauncherMenu } from './AppLauncherMenu'
import { ICON_CONTROL_BUTTON_CLASS_NAME } from './IconControlButton'
import { ThemeModeButton } from './ThemeModeButton'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'

export function Header() {
  const prefetchPosts = usePostsPrefetch()

  return (
    <header className="glass-surface header-sticky top-0 z-50">
      <div className="px-2.5 md:px-3">
        <div className="flex min-h-14 items-center justify-center py-2 sm:py-0">
          <nav
            aria-label="주요 이동"
            className="flex shrink-0 items-center justify-center gap-1.5 sm:gap-2"
          >
            <Link
              href="/"
              aria-label="홈으로 이동"
              className={ICON_CONTROL_BUTTON_CLASS_NAME}
              onFocus={prefetchPosts}
              onMouseEnter={prefetchPosts}
              onTouchStart={prefetchPosts}
            >
              <span className="sr-only">홈으로 이동</span>
              <HouseIcon className="h-[18px] w-[18px]" />
            </Link>
            <ThemeModeButton />
            <Link
              href="/components"
              aria-label="컴포넌트 라이브러리로 이동"
              className={ICON_CONTROL_BUTTON_CLASS_NAME}
            >
              <span className="sr-only">컴포넌트 라이브러리로 이동</span>
              <PuzzleIcon className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/emoticons"
              aria-label="이모티콘 스토리지로 이동"
              className={ICON_CONTROL_BUTTON_CLASS_NAME}
            >
              <span className="sr-only">이모티콘 스토리지로 이동</span>
              <SmileStorageIcon className="h-[18px] w-[18px]" />
            </Link>
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
