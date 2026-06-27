import { expect, test } from '@playwright/test'

test('avatar group tooltip arrow renders as a compact tail', async ({ page }) => {
  await page.setViewportSize({ width: 624, height: 336 })
  await page.goto('/components/avatar-group')

  const davidAvatar = page.getByAltText('David Haz')
  await davidAvatar.hover()

  const tooltip = page.getByText('David Haz')
  await expect(tooltip).toBeVisible()

  const arrow = page.locator('[data-avatar-tooltip-arrow]')
  await expect(arrow).toHaveCount(1)

  const metrics = await arrow.evaluate((element) => {
    const arrowRect = element.getBoundingClientRect()
    const tooltipRect = element.parentElement?.getBoundingClientRect()

    return {
      arrowHeight: arrowRect.height,
      outsideHeight: tooltipRect ? arrowRect.bottom - tooltipRect.bottom : 0,
    }
  })

  expect(metrics.arrowHeight).toBeLessThanOrEqual(12)
  expect(metrics.outsideHeight).toBeGreaterThanOrEqual(4)
  expect(metrics.outsideHeight).toBeLessThanOrEqual(8)
})
