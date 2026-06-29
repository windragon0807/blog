import { expect, test } from '@playwright/test'

test('component page opens an animated bottom sheet navigation on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components/3d-image-carousel')

  await expect(
    page.getByRole('heading', { name: 'Depth Image Carousel' })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '컴포넌트 메뉴 열기' })
  ).toBeVisible()
  await expect(page.getByText('Browse', { exact: true })).toBeHidden()
  await expect(page.locator('.components-sidebar-slot')).toBeHidden()

  const trigger = page.getByRole('button', { name: '컴포넌트 메뉴 열기' })
  const triggerBox = await trigger.boundingBox()
  const headerBox = await page.locator('header.header-sticky').boundingBox()
  const componentMenuGap =
    (triggerBox?.y ?? 0) - ((headerBox?.y ?? 0) + (headerBox?.height ?? 0))

  expect(triggerBox?.width).toBeLessThanOrEqual(64)
  expect(componentMenuGap).toBeGreaterThanOrEqual(16)
  expect(componentMenuGap).toBeLessThanOrEqual(32)

  await trigger.click()

  await expect(page.getByRole('dialog')).toBeVisible()
  const bottomSheet = page.locator('.component-mobile-bottom-sheet')
  await expect(bottomSheet).toBeVisible()
  const bottomSheetBox = await bottomSheet.boundingBox()
  expect(bottomSheetBox?.x).toBeLessThanOrEqual(1)
  expect(bottomSheetBox?.width).toBeGreaterThanOrEqual(389)
  expect(bottomSheetBox?.y).toBeGreaterThan(120)
  expect((bottomSheetBox?.y ?? 0) + (bottomSheetBox?.height ?? 0)).toBeGreaterThan(840)
  await expect(bottomSheet).toHaveCSS(
    'animation-name',
    'component-mobile-bottom-sheet-enter'
  )
  await expect(
    page.getByRole('searchbox', { name: '컴포넌트 메뉴 검색' })
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Theme Toggle' })).toBeVisible()

  const scrollViewport = bottomSheet
    .locator('[data-overlayscrollbars-viewport]')
    .first()
  const scrollMetrics = await scrollViewport.evaluate((element) => {
    element.scrollTop = 0
    element.scrollTop = 320

    return {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    }
  })

  expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight)
  expect(scrollMetrics.scrollTop).toBeGreaterThan(0)

  await page.getByRole('link', { name: 'Theme Toggle' }).click()

  await expect(page).toHaveURL(/\/components\/toggle-theme$/)
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('header renders centered icon controls with GitHub link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components')

  await expect(page.getByText('ryong.components')).toHaveCount(0)

  const githubLink = page.getByRole('link', {
    name: 'GitHub 프로필 새 창으로 열기',
  })

  await expect(githubLink).toBeVisible()
  await expect(githubLink).toHaveAttribute(
    'href',
    'https://github.com/windragon0807'
  )
  await expect(page.getByRole('navigation', { name: '주요 이동' })).toBeVisible()

  const desktopHeaderBox = await page.locator('header.header-sticky').boundingBox()
  expect(desktopHeaderBox?.width).toBeLessThan(380)
  expect(1440 - ((desktopHeaderBox?.x ?? 0) + (desktopHeaderBox?.width ?? 0))).toBeLessThan(48)

  await page.setViewportSize({ width: 390, height: 844 })
  const mobileHeaderBox = await page.locator('header.header-sticky').boundingBox()
  expect(mobileHeaderBox?.width).toBeLessThan(360)
  expect(
    Math.abs(((mobileHeaderBox?.x ?? 0) + (mobileHeaderBox?.width ?? 0) / 2) - 195)
  ).toBeLessThan(4)
})

test('desktop component sidebar keeps active text above the moving indicator', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components/placeholders-and-vanish-input')

  await page.getByRole('link', { name: 'Theme Toggle' }).click()
  await expect(page).toHaveURL(/\/components\/toggle-theme$/)

  const activeLink = page.getByRole('link', { name: 'Theme Toggle' })
  await expect(activeLink).toBeVisible()

  const hitTarget = await activeLink.evaluate((link) => {
    const label = link.querySelector('[data-component-sidebar-label]')
    if (!label) return { hasLabel: false, topElementIsHiddenLayer: true }

    const rect = label.getBoundingClientRect()
    const topElement = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    )

    return {
      hasLabel: true,
      topElementIsHiddenLayer: topElement?.getAttribute('aria-hidden') === 'true',
    }
  })

  expect(hitTarget.hasLabel).toBe(true)
  expect(hitTarget.topElementIsHiddenLayer).toBe(false)
})

test('desktop component sidebar top fog does not crowd the introduction link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components')

  const metrics = await page
    .locator('.components-sidebar-list-scroll')
    .evaluate((scrollShell) => {
      const viewport =
        scrollShell.querySelector('[data-overlayscrollbars-viewport]') ??
        scrollShell
      const introLink = scrollShell.querySelector('a[href="/components"]')
      const fog = scrollShell.parentElement?.querySelector(
        '.components-sidebar-fog-top'
      )
      const viewportRect = viewport.getBoundingClientRect()
      const introRect = introLink?.getBoundingClientRect()
      const fogRect = fog?.getBoundingClientRect()

      return {
        introTopOffset: introRect ? introRect.top - viewportRect.top : -1,
        fogHeight: fogRect?.height ?? 0,
      }
    })

  expect(metrics.introTopOffset).toBeGreaterThanOrEqual(metrics.fogHeight + 4)
  expect(metrics.introTopOffset).toBeLessThanOrEqual(metrics.fogHeight + 16)
})

test('component dark mode keeps search and installation surfaces integrated', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('theme', 'dark')
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components')

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(
    page.getByRole('searchbox', { name: '컴포넌트 메뉴 검색' })
  ).toBeVisible()

  const metrics = await page.evaluate(() => {
    function isSolidNearBlack(color: string) {
      const oklabMatch = color.match(/oklab\(([0-9.]+)/)
      if (oklabMatch) {
        return Number(oklabMatch[1]) <= 0.12
      }

      const labMatch = color.match(/lab\(([0-9.]+)/)
      if (labMatch) {
        return Number(labMatch[1]) <= 6
      }

      const match = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/
      )
      if (!match) return false

      const [, red, green, blue, alpha = '1'] = match
      return (
        Number(alpha) > 0.94 &&
        Number(red) <= 18 &&
        Number(green) <= 18 &&
        Number(blue) <= 18
      )
    }

    const searchInput = document.querySelector<HTMLElement>(
      '#component-search-input'
    )
    const searchWrapper = searchInput?.parentElement as HTMLElement | null
    const installShell = document
      .querySelector<HTMLElement>('#installation [role="tablist"]')
      ?.closest<HTMLElement>('div.overflow-hidden')

    const searchWrapperColor = searchWrapper
      ? getComputedStyle(searchWrapper).backgroundColor
      : ''
    const searchInputColor = searchInput
      ? getComputedStyle(searchInput).backgroundColor
      : ''
    const installShellColor = installShell
      ? getComputedStyle(installShell).backgroundColor
      : ''

    return {
      searchWrapperColor,
      searchInputColor,
      installShellColor,
      searchWrapperNearBlack: isSolidNearBlack(searchWrapperColor),
      searchInputNearBlack: isSolidNearBlack(searchInputColor),
      installShellNearBlack: isSolidNearBlack(installShellColor),
    }
  })

  expect(metrics.searchWrapperNearBlack, metrics.searchWrapperColor).toBe(false)
  expect(metrics.searchInputNearBlack, metrics.searchInputColor).toBe(false)
  expect(metrics.installShellNearBlack, metrics.installShellColor).toBe(false)
})

test('scroll shortcut stays fixed at the bottom center on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components/shiny-button')

  const shortcut = page.getByRole('button', { name: '맨 위로 이동' })
  await expect(shortcut).toBeVisible()

  const initialBox = await shortcut.boundingBox()
  expect(initialBox).not.toBeNull()
  expect(
    Math.abs(((initialBox?.x ?? 0) + (initialBox?.width ?? 0) / 2) - 195)
  ).toBeLessThanOrEqual(3)
  expect(844 - ((initialBox?.y ?? 0) + (initialBox?.height ?? 0))).toBeGreaterThanOrEqual(16)
  expect(844 - ((initialBox?.y ?? 0) + (initialBox?.height ?? 0))).toBeLessThanOrEqual(40)

  await page.mouse.wheel(0, 900)

  const scrolledBox = await shortcut.boundingBox()
  expect(scrolledBox).not.toBeNull()
  expect(
    Math.abs(((scrolledBox?.x ?? 0) + (scrolledBox?.width ?? 0) / 2) - 195)
  ).toBeLessThanOrEqual(3)
  expect(Math.abs((scrolledBox?.y ?? 0) - (initialBox?.y ?? 0))).toBeLessThanOrEqual(2)
})

test('scroll shortcut is hidden on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components/shiny-button')

  await expect(page.getByRole('button', { name: '맨 위로 이동' })).toBeHidden()
})
