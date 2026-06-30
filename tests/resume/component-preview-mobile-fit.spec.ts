import { expect, test } from '@playwright/test'

async function expectNoHorizontalPageOverflow(page: import('@playwright/test').Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
}

test.describe('component preview mobile fit', () => {
  test.use({ hasTouch: true, isMobile: true })

  test('desktop-only previews do not mount pointer or keyboard heavy demos on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    for (const slug of [
      'keyboard',
      'background-boxes',
      'mouse-invert-cursor',
      'sparkle-cursor',
      'pointer',
    ]) {
      await page.goto(`/components/${slug}`)

      await expect(
        page.locator(`[data-mobile-preview-unavailable="${slug}"]`)
      ).toBeVisible()
      await expectNoHorizontalPageOverflow(page)
    }
  })

  test('click-based cursor preview remains usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/mouse-ripple-cursor')

    await expect(
      page.locator('[data-mobile-preview-unavailable="mouse-ripple-cursor"]')
    ).toHaveCount(0)

    const effectRoot = page.locator('[data-cursor-effect="mouse-ripple-cursor"]')
    await expect(effectRoot).toBeVisible()
    await effectRoot.click()
    await expect(page.locator('[data-cursor-ripple="true"]')).toHaveCount(1)
  })

  test('mobile menu hides desktop pointer demos but keeps tap demos', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components')
    await page.getByRole('button', { name: '컴포넌트 메뉴 열기' }).click()

    await expect(
      page.getByRole('link', { name: 'Interactive Keyboard' })
    ).toHaveCount(0)
    await expect(
      page.getByRole('link', { name: 'Hover Grid Background' })
    ).toHaveCount(0)
    await expect(
      page.getByRole('link', { name: 'Sparkle Cursor Trail' })
    ).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Hover Pointer' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Click Spark Burst' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Click Ripple Cursor' })).toBeVisible()
  })

  test('data table and props table switch to compact mobile cards', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/data-table')

    await expect(page.locator('[data-data-table-mobile-list]').first()).toBeVisible()
    await expect(page.locator('#preview table').first()).toBeHidden()
    await expect(page.locator('#props [data-data-table-mobile-list]').first()).toBeVisible()
    await expect(page.locator('#props table').first()).toBeHidden()
    await expectNoHorizontalPageOverflow(page)
  })

  test('rotating word flip stays on one line on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/text-flip')

    const flip = page.locator('[data-text-flip]').first()
    await expect(flip).toBeVisible()

    const metrics = await flip.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)

      return {
        height: rect.height,
        lineHeight: Number.parseFloat(style.lineHeight),
        width: rect.width,
      }
    })

    expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight * 1.35)
    expect(metrics.width).toBeLessThanOrEqual(340)
  })

  test('morphing word uses a static mobile-safe mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/morphing-text')

    const morphingText = page.locator('[data-morphing-text]').first()
    await expect(morphingText).toBeVisible()
    await expect(morphingText).toHaveAttribute('data-morphing-text-mode', 'static')
  })

  test('perspective marquee fills the mobile preview surface with imagery', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/3d-marquee')

    const metrics = await page.locator('[data-preview-demo-surface]').first().evaluate(
      (surface) => {
        const surfaceRect = surface.getBoundingClientRect()
        const imageRects = Array.from(
          surface.querySelectorAll<HTMLImageElement>('img[alt^="Image"]')
        ).map((image) => image.getBoundingClientRect())
        const visibleRects = imageRects.filter(
          (rect) =>
            rect.bottom > surfaceRect.top &&
            rect.top < surfaceRect.bottom &&
            rect.right > surfaceRect.left &&
            rect.left < surfaceRect.right
        )
        const top = Math.min(...visibleRects.map((rect) => rect.top))
        const bottom = Math.max(...visibleRects.map((rect) => rect.bottom))

        return {
          visibleCount: visibleRects.length,
          imageTopOffset: top - surfaceRect.top,
          imageBottomGap: surfaceRect.bottom - bottom,
          surfaceHeight: surfaceRect.height,
        }
      }
    )

    expect(metrics.visibleCount).toBeGreaterThan(4)
    expect(metrics.imageTopOffset).toBeLessThan(64)
    expect(metrics.imageBottomGap).toBeLessThan(metrics.surfaceHeight * 0.28)
  })

  test('hover avatar group is removed from the component library', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components')
    await page.getByRole('button', { name: '컴포넌트 메뉴 열기' }).click()

    await expect(page.getByRole('link', { name: 'Hover Avatar Group' })).toHaveCount(0)

    const response = await page.goto('/components/avatar-group')
    expect(response?.status()).toBe(404)
  })
})
