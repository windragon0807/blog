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

  expect(triggerBox?.width).toBeLessThanOrEqual(64)
  expect(390 - ((triggerBox?.x ?? 0) + (triggerBox?.width ?? 0))).toBeGreaterThanOrEqual(12)
  expect(390 - ((triggerBox?.x ?? 0) + (triggerBox?.width ?? 0))).toBeLessThanOrEqual(28)
  expect(844 - ((triggerBox?.y ?? 0) + (triggerBox?.height ?? 0))).toBeGreaterThanOrEqual(12)
  expect(844 - ((triggerBox?.y ?? 0) + (triggerBox?.height ?? 0))).toBeLessThanOrEqual(32)

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

  const homeLink = page.getByRole('link', { name: '홈으로 이동' })
  const componentsLink = page.getByRole('link', {
    name: '컴포넌트 라이브러리로 이동',
  })
  const emoticonsLink = page.getByRole('link', {
    name: '이모티콘 스토리지로 이동',
  })

  await expect(componentsLink).toHaveAttribute('aria-current', 'page')
  await expect(componentsLink).toHaveAttribute('data-active-route', 'true')
  await expect(componentsLink).toHaveClass(/header-active-aurora/)
  await expect(componentsLink).toHaveClass(/border-transparent/)
  await expect(componentsLink).toHaveClass(/focus:ring-0/)
  await expect(homeLink).not.toHaveAttribute('aria-current', 'page')
  await expect(emoticonsLink).not.toHaveAttribute('aria-current', 'page')

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

test('mobile header app and settings panels open centered below the header', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components')

  const headerBox = await page.locator('header.header-sticky').boundingBox()
  expect(headerBox).not.toBeNull()
  const headerBottom = (headerBox?.y ?? 0) + (headerBox?.height ?? 0)

  async function expectPanelBelowHeader(panel: ReturnType<typeof page.getByLabel>) {
    await expect(panel).toBeVisible()
    const panelBox = await panel.boundingBox()
    expect(panelBox).not.toBeNull()
    expect(
      Math.abs(((panelBox?.x ?? 0) + (panelBox?.width ?? 0) / 2) - 195)
    ).toBeLessThanOrEqual(4)
    expect(panelBox?.y ?? 0).toBeGreaterThanOrEqual(headerBottom + 6)
    expect(panelBox?.y ?? 0).toBeLessThanOrEqual(headerBottom + 48)
  }

  await page.getByRole('button', { name: '애플리케이션 메뉴 열기' }).click()
  const appPanel = page.getByLabel('애플리케이션 패널')
  await expectPanelBelowHeader(appPanel)

  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: '환경설정 열기' }).click()
  const settingsPanel = page.getByLabel('환경설정 패널')
  await expectPanelBelowHeader(settingsPanel)
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

test('component introduction dark mode keeps search integrated without installation', async ({
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
  await expect(page.getByRole('heading', { name: 'Installation' })).toHaveCount(0)
  await expect(page.locator('#installation')).toHaveCount(0)

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

    const searchWrapperColor = searchWrapper
      ? getComputedStyle(searchWrapper).backgroundColor
      : ''
    const searchInputColor = searchInput
      ? getComputedStyle(searchInput).backgroundColor
      : ''

    return {
      searchWrapperColor,
      searchInputColor,
      searchWrapperNearBlack: isSolidNearBlack(searchWrapperColor),
      searchInputNearBlack: isSolidNearBlack(searchInputColor),
    }
  })

  expect(metrics.searchWrapperNearBlack, metrics.searchWrapperColor).toBe(false)
  expect(metrics.searchInputNearBlack, metrics.searchInputColor).toBe(false)
})

test('scroll shortcut is removed on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components/shiny-button')

  await expect(page.getByRole('button', { name: '맨 위로 이동' })).toHaveCount(0)
})

test('scroll shortcut is hidden on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components/shiny-button')

  await expect(page.getByRole('button', { name: '맨 위로 이동' })).toBeHidden()
})
