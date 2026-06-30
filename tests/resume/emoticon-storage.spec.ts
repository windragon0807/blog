import { expect, test } from '@playwright/test'

test('emoticon storage virtualizes the icon grid instead of rendering every item', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')

  await expect(
    page.getByRole('heading', { name: 'Emoticon Storage' })
  ).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: '주요 이동' })).toBeVisible()
  const emoticonsHeaderLink = page.getByRole('link', {
    name: '이모티콘 스토리지로 이동',
  })
  await expect(emoticonsHeaderLink).toHaveAttribute('aria-current', 'page')
  await expect(emoticonsHeaderLink).toHaveClass(/header-active-aurora/)

  const tablist = page.getByRole('tablist', { name: '이모티콘 종류' })
  await expect(tablist).toBeVisible()
  const tablistBox = await tablist.boundingBox()
  expect(tablistBox?.y).toBeLessThan(140)
  await expect(page.getByRole('button', { name: 'Copy SVG' })).toHaveCount(0)
  await expect(page.getByRole('searchbox')).toHaveCount(0)
  const gridShell = page.locator('[data-emoticon-grid-shell]')
  await expect(gridShell).toBeVisible()
  expect(
    await gridShell.evaluate((element) => getComputedStyle(element).borderWidth)
  ).toBe('0px')
  await expect(page.getByRole('button', { name: /파일 아이콘/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /폴더 아이콘/ })).toBeVisible()
  const allSubcategoryButton = page.getByRole('button', {
    name: '전체',
    exact: true,
  })
  await expect(allSubcategoryButton).toBeVisible()
  await expect(allSubcategoryButton).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('heading', { name: '파일 아이콘' })
  ).toHaveCSS('color', 'rgb(107, 118, 132)')
  await expect(page.getByRole('heading', { name: '전체' })).toHaveCount(0)
  await expect(
    page
      .getByRole('button', { name: /파일 아이콘/ })
      .locator('img[src="/emoticons/material/typescript.svg"]')
  ).toHaveCount(1)
  await expect(
    page
      .getByRole('button', { name: /폴더 아이콘/ })
      .locator('img[src="/emoticons/material/folder-src.svg"]')
  ).toHaveCount(1)
  const materialIcons = page.locator(
    '[data-emoticon-card] img[src^="/emoticons/material/"]'
  )
  const gridScroll = page.locator('[data-emoticon-grid-scroll]')
  await expect(gridScroll).toBeVisible()
  const gridScrollBox = await gridScroll.boundingBox()
  const gridContentBox = await page
    .locator('[data-emoticon-grid-content]')
    .boundingBox()
  expect(gridScrollBox).not.toBeNull()
  expect(gridContentBox).not.toBeNull()
  expect(Math.abs((gridScrollBox?.x ?? 0) + (gridScrollBox?.width ?? 0) - 1280)).toBeLessThan(
    2
  )
  expect(gridContentBox?.width ?? 0).toBeLessThanOrEqual(1181)
  const firstGridImage = page.locator('[data-emoticon-card] img').first()
  await expect(firstGridImage).toHaveAttribute('loading', 'eager')
  await expect(firstGridImage).toHaveAttribute('decoding', 'async')
  await expect(firstGridImage).not.toHaveAttribute('fetchpriority', 'low')
  const gridImages = page.locator('[data-emoticon-card] img')
  const eagerGridImages = await page
    .locator('[data-emoticon-card] img[loading="eager"]')
    .count()
  const lazyGridImages = await page
    .locator('[data-emoticon-card] img[loading="lazy"]')
    .count()
  expect(eagerGridImages).toBeGreaterThan(0)
  expect(lazyGridImages).toBeGreaterThan(0)
  expect(eagerGridImages).toBeLessThan(await gridImages.count())
  await expect(
    page.locator('[data-emoticon-card] img[fetchpriority="low"]')
  ).toHaveCount(0)
  await expect(
    page.locator('[data-emoticon-card] img[fetchpriority="high"]')
  ).toHaveCount(0)
  await expect(gridScroll).toHaveAttribute('data-emoticon-grid-overscan', '4')
  await expect(gridScroll).toHaveAttribute(
    'data-emoticon-prefetch-lookahead',
    '12'
  )
  await expect(gridScroll).toHaveAttribute(
    'data-emoticon-prefetch-lookbehind',
    '6'
  )
  await expect(gridScroll).toHaveAttribute(
    'data-emoticon-prefetch-mode',
    'while-scrolling'
  )
  const allFirstCardBox = await page.locator('[data-emoticon-card]').first().boundingBox()
  expect(allFirstCardBox).not.toBeNull()

  await page.getByRole('button', { name: /폴더 아이콘/ }).click()
  await expect(
    page.getByRole('heading', { name: '폴더 아이콘' })
  ).toHaveCount(0)
  await expect(materialIcons.first()).toBeVisible()
  const folderSources = await materialIcons.evaluateAll((images) =>
    images.map((image) => image.getAttribute('src') ?? '')
  )
  expect(folderSources.length).toBeGreaterThan(0)
  expect(folderSources.every((src) => src.includes('/folder-'))).toBe(true)
  await expect(page.getByText('3d', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: /파일 아이콘/ }).click()
  await expect(
    page.getByRole('heading', { name: '파일 아이콘' })
  ).toHaveCount(0)

  await expect(materialIcons.first()).toBeVisible()
  const fileFirstCardBox = await page.locator('[data-emoticon-card]').first().boundingBox()
  const fileGridShellBox = await gridShell.boundingBox()
  expect(fileFirstCardBox).not.toBeNull()
  expect(fileGridShellBox).not.toBeNull()
  expect((fileFirstCardBox?.y ?? 0)).toBeLessThan((allFirstCardBox?.y ?? 0) - 40)
  expect((fileFirstCardBox?.y ?? 0) - (fileGridShellBox?.y ?? 0)).toBeLessThan(
    8
  )
  const renderedMaterialIcons = await materialIcons.count()
  const fileRowMetrics = await page.locator('[data-emoticon-card]').evaluateAll(
    (cards) => {
      const scrollElement = document.querySelector(
        '[data-emoticon-grid-scroll]'
      )

      if (!scrollElement) {
        return { renderedRows: 0, visibleRows: 0 }
      }

      const scrollRect = scrollElement.getBoundingClientRect()
      const renderedRows = new Set<number>()
      const visibleRows = new Set<number>()

      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        const rowTop = Math.round(rect.top)

        renderedRows.add(rowTop)

        if (rect.bottom >= scrollRect.top && rect.top <= scrollRect.bottom) {
          visibleRows.add(rowTop)
        }
      }

      return {
        renderedRows: renderedRows.size,
        visibleRows: visibleRows.size,
      }
    }
  )

  expect(renderedMaterialIcons).toBeGreaterThan(0)
  expect(renderedMaterialIcons).toBeLessThan(420)
  expect(fileRowMetrics.renderedRows - fileRowMetrics.visibleRows).toBeGreaterThanOrEqual(
    4
  )

  await allSubcategoryButton.click()
  await expect(materialIcons.first()).toBeVisible()
  const windowScrollBeforeGridScroll = await page.evaluate(() => window.scrollY)
  await gridScroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.82
  })
  await expect
    .poll(() =>
      page
        .locator('[data-emoticon-card] img[src^="/emoticons/material/folder-"]')
        .count()
    )
    .toBeGreaterThan(0)

  await gridScroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.45
  })
  await expect
    .poll(() => gridScroll.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(100)
  expect(await page.evaluate(() => window.scrollY)).toBe(
    windowScrollBeforeGridScroll
  )
  expect(await materialIcons.count()).toBeLessThan(420)

  const subcategoryNav = page.getByRole('navigation', {
    name: '이모티콘 세부 카테고리',
  })
  await expect
    .poll(() =>
      subcategoryNav.evaluate((element) => getComputedStyle(element).backdropFilter)
    )
    .toBe('none')
  await expect
    .poll(() =>
      subcategoryNav.evaluate(
        (element) =>
          (
            getComputedStyle(element) as CSSStyleDeclaration & {
              webkitBackdropFilter?: string
            }
          ).webkitBackdropFilter ?? 'none'
      )
    )
    .toBe('none')

  await page.getByRole('tab', { name: /Tossface/ }).click()
  await expect(
    page.getByRole('button', { name: '전체', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')
  const tossLogo = page.locator(
    'img[src*="toss-symbol"], img[srcset*="toss-symbol"]'
  )
  await expect(tossLogo.first()).toBeVisible()
  await expect(
    page.getByRole('button', { name: '얼굴 및 사람', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '동물 및 자연', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '음식', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '활동', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '여행', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '물건', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '기호', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '깃발', exact: true })
  ).toBeVisible()
  await expect(
    page
      .getByRole('button', { name: '음식', exact: true })
      .locator('img[src^="/emoticons/tossface/"]')
  ).toHaveCount(1)
  const subcategoryScroll = page.locator('[data-emoticon-subcategory-scroll]')
  await expect(subcategoryScroll).toHaveAttribute(
    'data-overlayscrollbars-initialize',
    ''
  )
  await expect(
    subcategoryScroll.locator('.os-scrollbar-horizontal')
  ).toHaveCount(1)

  const tossfaceIcons = page.locator('img[src^="/emoticons/tossface/"]')
  await expect(tossfaceIcons.first()).toBeVisible()
  const renderedTossfaceIcons = await tossfaceIcons.count()

  expect(renderedTossfaceIcons).toBeGreaterThan(0)
  expect(renderedTossfaceIcons).toBeLessThan(420)
})

test('emoticon storage keeps mobile category navigation compact', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 802 })
  await page.goto('/emoticons')

  await expect(page.getByRole('navigation', { name: '주요 이동' })).toBeVisible()

  const siteHeader = page.locator('header.header-sticky')
  const tablist = page.getByRole('tablist', { name: '이모티콘 종류' })
  const subcategoryList = page.locator('[data-emoticon-subcategory-list]')

  await expect(siteHeader).toBeVisible()
  await expect(tablist).toBeVisible()
  await expect(subcategoryList).toBeVisible()

  const siteHeaderBox = await siteHeader.boundingBox()
  const tablistBox = await tablist.boundingBox()

  expect(siteHeaderBox).not.toBeNull()
  expect(tablistBox).not.toBeNull()
  expect(
    (tablistBox?.y ?? 0) -
      ((siteHeaderBox?.y ?? 0) + (siteHeaderBox?.height ?? 0))
  ).toBeGreaterThanOrEqual(32)
  expect(
    (tablistBox?.y ?? 0) -
      ((siteHeaderBox?.y ?? 0) + (siteHeaderBox?.height ?? 0))
  ).toBeLessThanOrEqual(64)
  expect(tablistBox?.x ?? 0).toBeGreaterThanOrEqual(24)

  const materialTab = page.getByRole('tab', { name: /Material/ })
  const tossfaceTab = page.getByRole('tab', { name: /Tossface/ })
  const materialBox = await materialTab.boundingBox()
  const tossfaceBox = await tossfaceTab.boundingBox()

  expect(materialBox).not.toBeNull()
  expect(tossfaceBox).not.toBeNull()
  expect(materialBox?.height ?? 0).toBeLessThanOrEqual(32)
  expect(
    (tossfaceBox?.x ?? 0) -
      ((materialBox?.x ?? 0) + (materialBox?.width ?? 0))
  ).toBeGreaterThanOrEqual(20)
  expect(
    (tossfaceBox?.x ?? 0) -
      ((materialBox?.x ?? 0) + (materialBox?.width ?? 0))
  ).toBeLessThanOrEqual(36)
  const materialLogoState = await materialTab
    .locator('[data-emoticon-collection-logo]')
    .evaluate((element) => {
      const style = getComputedStyle(element)
      const buttonStyle = getComputedStyle(element.closest('button')!)
      const label = element
        .closest('button')
        ?.querySelector<HTMLElement>('.emoticon-collection-label')
      const logoRect = element.getBoundingClientRect()
      const labelRect = label?.getBoundingClientRect()

      return {
        active: element.getAttribute('data-active'),
        filter: style.filter,
        labelCenterDelta: labelRect
          ? Math.abs(
              logoRect.top +
                logoRect.height / 2 -
                (labelRect.top + labelRect.height / 2)
            )
          : -1,
        opacity: style.opacity,
        transitionDuration: style.transitionDuration,
        parentTransitionDuration: buttonStyle.transitionDuration,
      }
    })
  const tossfaceLogoState = await tossfaceTab
    .locator('[data-emoticon-collection-logo]')
    .evaluate((element) => {
      const style = getComputedStyle(element)

      return {
        active: element.getAttribute('data-active'),
        filter: style.filter,
        opacity: style.opacity,
      }
    })

  expect(materialLogoState.active).toBe('true')
  expect(tossfaceLogoState.active).toBe('false')
  expect(materialLogoState.transitionDuration).toContain('0.5s')
  expect(materialLogoState.parentTransitionDuration).toContain('0.5s')
  expect(materialLogoState.labelCenterDelta).toBeGreaterThanOrEqual(0)
  expect(materialLogoState.labelCenterDelta).toBeLessThanOrEqual(2)
  expect(Number(tossfaceLogoState.opacity)).toBeLessThan(
    Number(materialLogoState.opacity)
  )
  expect(tossfaceLogoState.filter).toContain('grayscale')

  await expect
    .poll(() =>
      subcategoryList.evaluate((element) => getComputedStyle(element).columnGap)
    )
    .toBe('6px')

  const allSubcategoryButton = page.getByRole('button', {
    name: '전체',
    exact: true,
  })
  const allSubcategoryBox = await allSubcategoryButton.boundingBox()

  expect(allSubcategoryBox).not.toBeNull()
  expect(allSubcategoryBox?.height ?? 0).toBeGreaterThanOrEqual(38)
  expect(allSubcategoryBox?.height ?? 0).toBeLessThanOrEqual(42)

  const subcategoryNavBox = await page
    .getByRole('navigation', { name: '이모티콘 세부 카테고리' })
    .boundingBox()
  const firstSectionHeading = page.getByRole('heading', {
    name: '파일 아이콘',
  })
  await expect(firstSectionHeading).toBeVisible()
  await expect(firstSectionHeading).toHaveCSS('font-size', '18px')
  const firstSectionHeadingBox = await firstSectionHeading.boundingBox()

  expect(subcategoryNavBox).not.toBeNull()
  expect(firstSectionHeadingBox).not.toBeNull()
  expect(
    (firstSectionHeadingBox?.y ?? 0) -
      ((subcategoryNavBox?.y ?? 0) + (subcategoryNavBox?.height ?? 0))
  ).toBeLessThanOrEqual(48)
})

test('emoticon page shell fills the mobile browser viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/emoticons')

  await expect(page.locator('[data-emoticon-grid-shell]')).toBeVisible()

  const shellMetrics = await page.locator('[data-emoticon-page-shell]').evaluate(
    (shell) => {
      const rect = shell.getBoundingClientRect()
      const style = getComputedStyle(shell)

      return {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        viewportHeight: window.innerHeight,
        className: shell.getAttribute('class') ?? '',
        minHeight: style.minHeight,
        viewportContract: shell.getAttribute('data-emoticon-viewport-contract'),
      }
    }
  )

  expect(shellMetrics.viewportContract).toBe('dynamic-safe-area')
  expect(shellMetrics.className).toContain('min-h-[100svh]')
  expect(shellMetrics.top).toBeLessThanOrEqual(1)
  expect(shellMetrics.bottom).toBeGreaterThanOrEqual(
    shellMetrics.viewportHeight - 1
  )
  expect(shellMetrics.height).toBeGreaterThanOrEqual(
    shellMetrics.viewportHeight - 1
  )
})

test('tossface food category follows Tossface-style order and shows hover tooltip', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')
  await page.getByRole('tab', { name: /Tossface/ }).click()
  await page.getByRole('button', { name: '음식', exact: true }).click()

  const foodIcons = page.locator(
    '[data-emoticon-card] img[src^="/emoticons/tossface/"]'
  )
  await expect(foodIcons.first()).toBeVisible()

  const visibleFoodNames = await foodIcons.evaluateAll((images) =>
    images.slice(0, 9).map((image) => {
      const src = image.getAttribute('src') ?? ''
      return decodeURIComponent(src.split('/').pop() ?? '').replace(/\.svg$/, '')
    })
  )

  expect(visibleFoodNames).toEqual([
    '초록 사과',
    '빨간 사과',
    '배',
    '귤',
    '레몬',
    '바나나',
    '수박',
    '포도',
    '딸기',
  ])

  const firstCard = page.locator('[data-emoticon-card]').first()
  await expect(
    page.locator('[data-emoticon-card][data-slot="tooltip-trigger"]')
  ).toHaveCount(0)
  await firstCard.hover()
  await expect(page.getByRole('tooltip')).toHaveCount(1)
  await expect(page.getByRole('tooltip')).toContainText('초록 사과')
  await expect(page.locator('[data-emoticon-floating-tooltip]')).toContainText(
    '초록 사과'
  )
})

test.describe('emoticon storage touch input', () => {
  test.use({ hasTouch: true, isMobile: true })

  test('does not show hover tooltips on touch based devices', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/emoticons')
    await page.getByRole('tab', { name: /Tossface/ }).click()
    await page.getByRole('button', { name: '음식', exact: true }).click()

    const firstCard = page.locator('[data-emoticon-card]').first()
    await expect(firstCard).toBeVisible()
    await expect(page.locator('[data-emoticon-card][data-touch-input="true"]').first()).toBeVisible()

    await firstCard.hover()
    await expect(page.getByRole('tooltip')).toHaveCount(0)

    await firstCard.focus()
    await expect(page.getByRole('tooltip')).toHaveCount(0)
  })
})

test('emoticon grid prefetches nearby offscreen images while scrolling', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeImage = window.Image
    const srcDescriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src'
    )
    const prefetchSrcs: string[] = []

    function TrackingImage(width?: number, height?: number) {
      const image =
        typeof width === 'number' || typeof height === 'number'
          ? new NativeImage(width, height)
          : new NativeImage()

      if (srcDescriptor?.get && srcDescriptor.set) {
        Object.defineProperty(image, 'src', {
          configurable: true,
          get() {
            return srcDescriptor.get?.call(this)
          },
          set(value: string) {
            prefetchSrcs.push(String(value))
            srcDescriptor.set?.call(this, value)
          },
        })
      }

      return image
    }

    Object.setPrototypeOf(TrackingImage, NativeImage)
    TrackingImage.prototype = NativeImage.prototype

    Object.defineProperty(window, 'Image', {
      configurable: true,
      value: TrackingImage,
    })
    Object.defineProperty(window, '__emoticonPrefetchSrcs', {
      configurable: true,
      value: prefetchSrcs,
    })
  })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')

  const gridScroll = page.locator('[data-emoticon-grid-scroll]')
  await expect(page.locator('[data-emoticon-card]').first()).toBeVisible()
  await page.evaluate(() => {
    ;(window as Window & { __emoticonPrefetchSrcs?: string[] })
      .__emoticonPrefetchSrcs?.splice(0)
  })

  await gridScroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.72
  })

  await expect
    .poll(() =>
      page.evaluate(() => {
        return (
          (window as Window & { __emoticonPrefetchSrcs?: string[] })
            .__emoticonPrefetchSrcs?.length ?? 0
        )
      })
    )
    .toBeGreaterThan(0)

  const renderedSrcs = await page
    .locator('[data-emoticon-card] img')
    .evaluateAll((images) =>
      images.map((image) => image.getAttribute('src') ?? '')
    )
  const prefetchSrcs = await page.evaluate(() => {
    return (
      (window as Window & { __emoticonPrefetchSrcs?: string[] })
        .__emoticonPrefetchSrcs ?? []
    )
  })

  expect(prefetchSrcs.some((src) => !renderedSrcs.includes(src))).toBe(true)
})

test('emoticon grid keeps warming lower images after the first viewport renders', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeImage = window.Image
    const srcDescriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src'
    )
    const prefetchSrcs: string[] = []

    window.requestIdleCallback = (callback) => {
      return window.setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => 50,
        })
      }, 0)
    }
    window.cancelIdleCallback = (handle) => {
      window.clearTimeout(handle)
    }

    function TrackingImage(width?: number, height?: number) {
      const image =
        typeof width === 'number' || typeof height === 'number'
          ? new NativeImage(width, height)
          : new NativeImage()

      image.decode = () => Promise.resolve()

      if (srcDescriptor?.get && srcDescriptor.set) {
        Object.defineProperty(image, 'src', {
          configurable: true,
          get() {
            return srcDescriptor.get?.call(this)
          },
          set(value: string) {
            prefetchSrcs.push(String(value))
            srcDescriptor.set?.call(this, value)
            window.setTimeout(() => {
              image.onload?.(new Event('load'))
            }, 0)
          },
        })
      }

      return image
    }

    Object.setPrototypeOf(TrackingImage, NativeImage)
    TrackingImage.prototype = NativeImage.prototype

    Object.defineProperty(window, 'Image', {
      configurable: true,
      value: TrackingImage,
    })
    Object.defineProperty(window, '__emoticonPrefetchSrcs', {
      configurable: true,
      value: prefetchSrcs,
    })
  })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')
  await page.getByRole('tab', { name: /Tossface/ }).click()

  const gridScroll = page.locator('[data-emoticon-grid-scroll]')
  await expect(gridScroll).toBeVisible()
  await expect(page.locator('[data-emoticon-card]').first()).toBeVisible()
  await expect.poll(() => gridScroll.evaluate((element) => element.scrollTop)).toBe(0)

  await expect
    .poll(() =>
      page.evaluate(() => {
        return (
          (window as Window & { __emoticonPrefetchSrcs?: string[] })
            .__emoticonPrefetchSrcs?.filter((src) =>
              src.includes('/emoticons/tossface/')
            ).length ?? 0
        )
      })
    )
    .toBeGreaterThan(700)

  const renderedTossfaceIcons = await page
    .locator('[data-emoticon-card] img[src^="/emoticons/tossface/"]')
    .count()
  expect(renderedTossfaceIcons).toBeLessThan(420)
})

test('tossface animal category follows the Tossface section order', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')
  await page.getByRole('tab', { name: /Tossface/ }).click()
  await page.getByRole('button', { name: '동물 및 자연', exact: true }).click()

  await expect(
    page.getByRole('heading', { name: '동물 및 자연' })
  ).toHaveCount(0)

  const animalIcons = page.locator(
    '[data-emoticon-card] img[src^="/emoticons/tossface/"]'
  )
  await expect(animalIcons.first()).toBeVisible()

  const visibleAnimalNames = await animalIcons.evaluateAll((images) =>
    images.slice(0, 16).map((image) => {
      const src = image.getAttribute('src') ?? ''
      return decodeURIComponent(src.split('/').pop() ?? '').replace(/\.svg$/, '')
    })
  )

  expect(visibleAnimalNames).toEqual([
    '강아지 얼굴',
    '고양이 얼굴',
    '쥐 얼굴',
    '햄스터 얼굴',
    '토끼 얼굴',
    '여우 얼굴',
    '곰 얼굴',
    '판다 얼굴',
    '북극곰',
    '코알라',
    '호랑이 얼굴',
    '사자 얼굴',
    '소 얼굴',
    '돼지 얼굴',
    '돼지코',
    '개구리 얼굴',
  ])
})

test('emoticon storage shows skeleton placeholders while loading manifest', async ({
  page,
}) => {
  let releaseManifest!: () => void
  const manifestWait = new Promise<void>((resolve) => {
    releaseManifest = resolve
  })

  await page.route('**/emoticons/manifest.json', async (route) => {
    await manifestWait
    await route.continue()
  })

  const responsePromise = page.goto('/emoticons')

  const skeleton = page.locator('[data-emoticon-skeleton]')
  await expect(skeleton).toBeVisible()
  await expect(skeleton.locator('.animate-pulse').first()).toBeVisible()
  await expect(
    skeleton.locator('[data-emoticon-skeleton-section-heading]')
  ).toBeVisible()
  await expect(page.getByText('검색 결과가 없습니다.')).toHaveCount(0)

  releaseManifest()
  await responsePromise
  await expect(skeleton).toHaveCount(0)
  await expect(page.locator('[data-emoticon-card]').first()).toBeVisible()
})

test('loaded emoticon cards do not show skeleton again after virtualized remount', async ({
  page,
}) => {
  const requestCounts = new Map<string, number>()
  let blockedPath: string | null = null
  let releaseBlockedImage!: () => void
  const blockedImageWait = new Promise<void>((resolve) => {
    releaseBlockedImage = resolve
  })

  await page.route('**/emoticons/material/*.svg', async (route) => {
    const pathname = new URL(route.request().url()).pathname
    const requestCount = requestCounts.get(pathname) ?? 0

    requestCounts.set(pathname, requestCount + 1)

    if (blockedPath === pathname && requestCount > 0) {
      await blockedImageWait
    }

    await route.continue()
  })

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')

  const gridScroll = page.locator('[data-emoticon-grid-scroll]')
  const firstCard = page.locator('[data-emoticon-card]').first()

  await expect(firstCard).toBeVisible()
  await expect(firstCard.locator('[data-emoticon-card-skeleton]')).toHaveCount(
    0
  )

  const firstSrc = await firstCard.locator('img').getAttribute('src')

  expect(firstSrc).not.toBeNull()
  blockedPath = firstSrc

  await gridScroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.82
  })
  await expect(
    page.locator('[data-emoticon-card]').filter({
      has: page.locator(`img[src="${firstSrc}"]`),
    })
  ).toHaveCount(0)

  await gridScroll.evaluate((element) => {
    element.scrollTop = 0
  })
  await expect
    .poll(() => gridScroll.evaluate((element) => element.scrollTop))
    .toBe(0)

  const restoredCard = page.locator('[data-emoticon-card]').filter({
    has: page.locator(`img[src="${firstSrc}"]`),
  })

  await expect(restoredCard).toBeVisible()
  expect(
    await restoredCard.locator('[data-emoticon-card-skeleton]').count()
  ).toBe(0)

  releaseBlockedImage()
})

test('emoticon actions open in a bottom sheet with button-level feedback', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => undefined,
        write: async () => undefined,
      },
    })
  })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')

  const firstCard = page.locator('[data-emoticon-card]').first()
  await expect(firstCard).toBeVisible()
  const cardBox = await firstCard.boundingBox()
  expect(cardBox).not.toBeNull()

  await firstCard.click()

  const actionPanel = page.locator('[data-emoticon-action-panel]')
  await expect(actionPanel).toHaveCount(0)
  const bottomSheet = page.locator('[data-emoticon-bottom-sheet]')
  await expect(bottomSheet).toBeVisible()
  await expect(
    bottomSheet.getByRole('button', { name: 'Download SVG', exact: true })
  ).toBeVisible()
  await expect(
    bottomSheet.getByRole('button', { name: 'Copy SVG' })
  ).toBeVisible()
  await expect(bottomSheet.getByText('MATERIAL ICON THEME')).toHaveCount(0)
  await expect(bottomSheet.getByText(/\\.svg$/)).toHaveCount(0)
  await expect(bottomSheet.getByText(/선택됨/)).toHaveCount(0)

  const actionButtonNames = [
    'Download SVG',
    'Download PNG',
    'Copy SVG',
    'Copy PNG',
  ]
  const actionButtonBackgrounds = await Promise.all(
    actionButtonNames.map((name) =>
      bottomSheet
        .getByRole('button', { name, exact: true })
        .evaluate((element) => getComputedStyle(element).backgroundColor)
    )
  )
  expect(new Set(actionButtonBackgrounds).size).toBe(1)
  const sheetSurface = await bottomSheet.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      backdropFilter: style.backdropFilter,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
    }
  })
  expect(sheetSurface.backdropFilter).not.toBe('none')
  expect(sheetSurface.backgroundColor).toMatch(/(rgba\(|\/ 0\.)/)
  expect(sheetSurface.borderColor).not.toBe('rgb(228, 228, 231)')

  const selectedIdentity = bottomSheet.locator('[data-emoticon-selected-identity]')
  const selectedIdentitySurface = await selectedIdentity.evaluate((element) => {
    const style = getComputedStyle(element)
    const preview = element.querySelector<HTMLElement>(
      '[data-emoticon-selected-preview]'
    )
    const previewParentStyle = preview?.parentElement
      ? getComputedStyle(preview.parentElement)
      : null

    return {
      backgroundColor: style.backgroundColor,
      borderWidth: style.borderWidth,
      previewParentBackgroundColor: previewParentStyle?.backgroundColor ?? '',
      previewParentBorderWidth: previewParentStyle?.borderWidth ?? '',
    }
  })
  expect(selectedIdentitySurface.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(selectedIdentitySurface.borderWidth).toBe('0px')
  expect(selectedIdentitySurface.previewParentBackgroundColor).toBe(
    'rgba(0, 0, 0, 0)'
  )
  expect(selectedIdentitySurface.previewParentBorderWidth).toBe('0px')

  const previewImageBox = await bottomSheet
    .locator('[data-emoticon-selected-preview]')
    .boundingBox()
  const titleBox = await selectedIdentity.locator('figcaption').boundingBox()
  const downloadSvgBox = await bottomSheet
    .getByRole('button', { name: 'Download SVG', exact: true })
    .boundingBox()
  const downloadPngBox = await bottomSheet
    .getByRole('button', { name: 'Download PNG', exact: true })
    .boundingBox()
  const copySvgBox = await bottomSheet
    .getByRole('button', { name: 'Copy SVG', exact: true })
    .boundingBox()
  const copyPngBox = await bottomSheet
    .getByRole('button', { name: 'Copy PNG', exact: true })
    .boundingBox()

  expect(previewImageBox).not.toBeNull()
  expect(titleBox).not.toBeNull()
  expect(downloadSvgBox).not.toBeNull()
  expect(downloadPngBox).not.toBeNull()
  expect(copySvgBox).not.toBeNull()
  expect(copyPngBox).not.toBeNull()

  const previewImageCenterX =
    (previewImageBox?.x ?? 0) + (previewImageBox?.width ?? 0) / 2
  const titleCenterX = (titleBox?.x ?? 0) + (titleBox?.width ?? 0) / 2
  expect(titleBox?.y ?? 0).toBeGreaterThan(
    (previewImageBox?.y ?? 0) + (previewImageBox?.height ?? 0)
  )
  expect(Math.abs(previewImageCenterX - titleCenterX)).toBeLessThan(16)
  expect(previewImageBox?.y ?? 0).toBeLessThan((downloadSvgBox?.y ?? 0) - 12)
  expect(titleBox?.y ?? 0).toBeLessThan(copySvgBox?.y ?? 0)
  expect(downloadSvgBox?.x ?? 0).toBeGreaterThan(previewImageBox?.x ?? 0)
  expect(Math.abs((downloadSvgBox?.y ?? 0) - (downloadPngBox?.y ?? 0))).toBeLessThan(
    4
  )
  expect(copySvgBox?.y ?? 0).toBeGreaterThan(downloadSvgBox?.y ?? 0)
  expect(Math.abs((copySvgBox?.y ?? 0) - (copyPngBox?.y ?? 0))).toBeLessThan(4)

  const downloadSvgButton = bottomSheet.getByRole('button', {
    name: 'Download SVG',
    exact: true,
  })
  const buttonBeforeHover = await downloadSvgButton.evaluate((element) => {
    const style = getComputedStyle(element)

    return {
      boxShadow: style.boxShadow,
      transform: style.transform,
    }
  })
  await downloadSvgButton.hover()
  await expect
    .poll(() =>
      downloadSvgButton.evaluate((element) => getComputedStyle(element).transform)
    )
    .not.toBe(buttonBeforeHover.transform)
  const buttonAfterHover = await downloadSvgButton.evaluate((element) => {
    const style = getComputedStyle(element)

    return {
      boxShadow: style.boxShadow,
      transform: style.transform,
    }
  })
  expect(buttonAfterHover.boxShadow).not.toBe(buttonBeforeHover.boxShadow)

  const panelBox = await bottomSheet.boundingBox()
  const gridBox = await page.locator('[data-emoticon-grid-shell]').boundingBox()
  const viewportHeight = page.viewportSize()?.height ?? 900
  expect(panelBox).not.toBeNull()
  expect(gridBox).not.toBeNull()
  const panelCenterX = (panelBox?.x ?? 0) + (panelBox?.width ?? 0) / 2
  const gridCenterX = (gridBox?.x ?? 0) + (gridBox?.width ?? 0) / 2
  expect(Math.abs(panelCenterX - gridCenterX)).toBeLessThan(6)
  expect((panelBox?.y ?? 0) + (panelBox?.height ?? 0)).toBeGreaterThan(820)
  expect((panelBox?.y ?? 0) + (panelBox?.height ?? 0)).toBeLessThanOrEqual(
    viewportHeight
  )
  await expect(firstCard).not.toHaveClass(/sky/)

  await bottomSheet.getByRole('button', { name: 'Copy SVG' }).click()
  const copiedButton = bottomSheet.getByRole('button', { name: 'Copied!' })
  await expect(copiedButton).toBeVisible()
  await expect(copiedButton).toHaveClass(/bg-emerald-500/)
  await expect(
    bottomSheet.getByRole('button', { name: 'Copy SVG', exact: true })
  ).toBeVisible({ timeout: 2500 })
  await expect(copiedButton).toHaveCount(0)

  await firstCard.click()
  await expect(bottomSheet).toHaveAttribute('data-state', 'closing')
  await expect(bottomSheet).toHaveCount(0)
})

test('emoticon cards show skeleton placeholders while icon images are loading', async ({
  page,
}) => {
  let releaseImages!: () => void
  const imageWait = new Promise<void>((resolve) => {
    releaseImages = resolve
  })

  await page.route('**/emoticons/material/*.svg', async (route) => {
    await imageWait
    await route.continue()
  })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons', { waitUntil: 'domcontentloaded' })

  const cardSkeleton = page.locator('[data-emoticon-card-skeleton]').first()
  await expect(cardSkeleton).toBeVisible()

  releaseImages()
  await expect(cardSkeleton).toHaveCount(0)
})

test('emoticon action sheet keeps keyboard focus contained and returns it on close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/emoticons')

  const firstCard = page.locator('[data-emoticon-card]').first()
  await expect(firstCard).toBeVisible()
  await firstCard.click()

  const bottomSheet = page.locator('[data-emoticon-bottom-sheet]')
  await expect(bottomSheet).toBeVisible()
  await expect(bottomSheet).toHaveAttribute('aria-modal', 'true')

  await expect
    .poll(() =>
      bottomSheet.evaluate((sheet) =>
        sheet.contains(document.activeElement)
      )
    )
    .toBe(true)

  for (let index = 0; index < 7; index += 1) {
    await page.keyboard.press('Tab')
    expect(
      await bottomSheet.evaluate((sheet) =>
        sheet.contains(document.activeElement)
      )
    ).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(bottomSheet).toHaveAttribute('data-state', 'closing')
  await expect(bottomSheet).toHaveCount(0)
  await expect
    .poll(() =>
      firstCard.evaluate((card) => document.activeElement === card)
    )
    .toBe(true)
})

test('emoticon actions report failed when svg assets cannot be fetched', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => undefined,
        write: async () => undefined,
      },
    })
  })
  await page.route('**/emoticons/material/*.svg', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'text/plain',
      body: 'missing svg',
    })
  )
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')

  const firstCard = page.locator('[data-emoticon-card]').first()
  await expect(firstCard).toBeVisible()
  await firstCard.click()

  const bottomSheet = page.locator('[data-emoticon-bottom-sheet]')
  await expect(bottomSheet).toBeVisible()

  await bottomSheet.getByRole('button', { name: 'Copy SVG' }).click()
  await expect(
    bottomSheet.getByRole('button', { name: 'Failed' })
  ).toBeVisible()
})

test('emoticon page keeps document scroll fixed and scrolls only the grid', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/emoticons')

  await expect(page.locator('[data-emoticon-card]').first()).toBeVisible()
  const gridScroll = page.locator('[data-emoticon-grid-scroll]')
  await expect(gridScroll).toBeVisible()
  await gridScroll.evaluate((element) => {
    element.scrollTop = 180
  })
  await expect
    .poll(() => gridScroll.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(80)

  const windowScrollBefore = await page.evaluate(() => window.scrollY)
  await page.getByRole('button', { name: /파일 아이콘/ }).click()
  const windowScrollAfter = await page.evaluate(() => window.scrollY)

  expect(Math.abs(windowScrollAfter - windowScrollBefore)).toBeLessThan(5)
})
