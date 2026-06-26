'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HouseIcon, PuzzleIcon } from '@/components/icons'
import { AppLauncherMenu } from './AppLauncherMenu'
import { BrandLogo } from './BrandLogo'
import { useHeaderBrandScope } from './HeaderBrandScopeProvider'
import { ICON_CONTROL_BUTTON_CLASS_NAME } from './IconControlButton'
import { ThemeModeButton } from './ThemeModeButton'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'

export function Header() {
  const pathname = usePathname()
  const { scope } = useHeaderBrandScope()
  const shouldShowHomeButton =
    pathname === '/resume' ||
    pathname === '/portfolio' ||
    pathname.startsWith('/components')
  const brandLabel =
    scope === 'resume'
      ? 'ryong.resume'
      : scope === 'portfolio'
        ? 'ryong.portfolio'
        : scope === 'components'
          ? 'ryong.components'
        : 'ryong.log'
  const brandHref =
    scope === 'portfolio'
      ? '/portfolio'
      : scope === 'components'
        ? '/components'
        : '/'

  return (
    <header className="glass-surface header-sticky top-0 z-50 w-full">
      <div className="w-full px-5 md:px-6">
        <div className="flex min-h-14 items-center justify-between gap-3 py-2 sm:gap-4 sm:py-0">
          <div className="min-w-0">
            <Link
              href={brandHref}
              className="brand-link relative inline-grid max-w-full truncate font-bold text-lg text-zinc-900 dark:text-zinc-100"
            >
              <BrandLogo label={brandLabel} />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {shouldShowHomeButton && (
              <Link
                href="/"
                aria-label="홈으로 이동"
                className={ICON_CONTROL_BUTTON_CLASS_NAME}
              >
                <span className="sr-only">홈으로 이동</span>
                <HouseIcon className="h-[18px] w-[18px]" />
              </Link>
            )}
            <ThemeModeButton />
            <Link
              href="/components"
              aria-label="컴포넌트 라이브러리로 이동"
              className={ICON_CONTROL_BUTTON_CLASS_NAME}
            >
              <span className="sr-only">컴포넌트 라이브러리로 이동</span>
              <PuzzleIcon className="h-[18px] w-[18px]" />
            </Link>
            <AppLauncherMenu />
            <ThemeSettingsMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
