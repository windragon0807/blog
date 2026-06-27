import { expect, test } from '@playwright/test'

test('3d image carousel uses the source cascade motion classes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components/3d-image-carousel')

  const carousel = page.locator('[data-3d-image-carousel]')
  await expect(carousel).toBeVisible()

  const sourceContainer = carousel.locator('.cascade-slider_container')
  const previousCard = carousel.locator('.cascade-slider_item.prev')
  const activeCard = carousel.locator('.cascade-slider_item.now')
  const nextCard = carousel.locator('.cascade-slider_item.next')

  await expect(sourceContainer).toHaveCount(1)
  await expect(previousCard).toHaveCount(1)
  await expect(activeCard).toHaveCount(1)
  await expect(nextCard).toHaveCount(1)
  await expect(carousel.locator('[data-action="prev"]')).toHaveCount(1)
  await expect(carousel.locator('[data-action="next"]')).toHaveCount(1)

  const metrics = await carousel.evaluate((element) => {
    const previous = element.querySelector<HTMLElement>('.cascade-slider_item.prev')
    const active = element.querySelector<HTMLElement>('.cascade-slider_item.now')
    const next = element.querySelector<HTMLElement>('.cascade-slider_item.next')

    if (!previous || !active || !next) {
      throw new Error('Missing source carousel card classes')
    }

    const previousRect = previous.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const nextRect = next.getBoundingClientRect()

    return {
      activeWidth: activeRect.width,
      activePosition: getComputedStyle(active).position,
      activeTransform: getComputedStyle(active).transform,
      activeTransitionDuration: getComputedStyle(active).transitionDuration,
      activeTransitionProperty: getComputedStyle(active).transitionProperty,
      previousWidth: previousRect.width,
      nextWidth: nextRect.width,
      previousClassName: previous.className,
      nextClassName: next.className,
      previousTransform: getComputedStyle(previous).transform,
      nextTransform: getComputedStyle(next).transform,
      previousFilter: getComputedStyle(previous.querySelector('img')!).filter,
      nextFilter: getComputedStyle(next.querySelector('img')!).filter,
    }
  })

  expect(metrics.activeWidth).toBeGreaterThan(metrics.previousWidth * 1.35)
  expect(metrics.activeWidth).toBeGreaterThan(metrics.nextWidth * 1.35)
  expect(metrics.previousClassName).toContain('prev')
  expect(metrics.nextClassName).toContain('next')
  expect(metrics.previousFilter).toContain('grayscale')
  expect(metrics.nextFilter).toContain('grayscale')
  expect(metrics.activePosition).toBe('absolute')
  expect(metrics.activeTransform).not.toBe('none')
  expect(metrics.previousTransform).not.toBe(metrics.nextTransform)
  expect(metrics.activeTransitionProperty).toBe('all')
  expect(
    Math.max(
      ...metrics.activeTransitionDuration.split(',').map((duration) => {
        const trimmed = duration.trim()
        return trimmed.endsWith('ms')
          ? Number.parseFloat(trimmed)
          : Number.parseFloat(trimmed) * 1000
      })
    )
  ).toBeGreaterThanOrEqual(900)

  await carousel.locator('[data-action="next"]').click()
  await expect(
    carousel.locator('.cascade-slider_item.now[data-slide-number="1"]')
  ).toHaveCount(1)
})
