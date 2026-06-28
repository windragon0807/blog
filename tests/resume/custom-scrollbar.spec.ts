import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'

test('component library scroll regions use OverlayScrollbars', async ({ page }) => {
  const scrollAreaSource = readFileSync(
    join(process.cwd(), 'src/components/ui/scroll-area.tsx'),
    'utf8'
  )
  const globalStylesSource = readFileSync(
    join(process.cwd(), 'src/app/globals.css'),
    'utf8'
  )
  const bodyScrollbarsSource = readFileSync(
    join(process.cwd(), 'src/components/BodyScrollbars.tsx'),
    'utf8'
  )

  expect(scrollAreaSource).toContain('OverlayScrollbarsComponent')
  expect(scrollAreaSource).toContain("autoHide: 'scroll'")
  expect(scrollAreaSource).toContain('autoHideDelay: 640')
  expect(bodyScrollbarsSource).toContain("autoHide: 'scroll'")
  expect(bodyScrollbarsSource).toContain('autoHideDelay: 640')
  expect(globalStylesSource).toContain('os-theme-ryonglog')
  expect(globalStylesSource).toContain('opacity 420ms ease')
  expect(globalStylesSource).not.toContain('--scrollbar-glass')

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components')

  const contentScroll = page.locator('.components-content-scroll')
  const sidebarScroll = page.locator('.components-sidebar-list-scroll')

  await expect(contentScroll).toHaveAttribute(
    'data-overlayscrollbars-initialize',
    ''
  )
  await expect(sidebarScroll).toHaveAttribute(
    'data-overlayscrollbars-initialize',
    ''
  )

  await expect(
    page.locator('.components-content-scroll > .os-scrollbar-vertical')
  ).toHaveCount(1)
  await expect(
    page.locator(
      '.components-sidebar-list-scroll > .os-scrollbar-vertical'
    )
  ).toHaveCount(1)

  const transitionDurationMs = await page
    .locator('.components-content-scroll > .os-scrollbar-vertical')
    .evaluate((element) => {
      const durations = getComputedStyle(element).transitionDuration
        .split(',')
        .map((duration) => duration.trim())
        .map((duration) =>
          duration.endsWith('ms')
            ? Number.parseFloat(duration)
            : Number.parseFloat(duration) * 1000
        )

      return Math.max(...durations)
    })

  expect(transitionDurationMs).toBeGreaterThanOrEqual(420)
})

test('document body uses OverlayScrollbars for root scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const body = page.locator('body')

  await expect(body).toHaveAttribute('data-overlayscrollbars-initialize', '')
  await expect(body.locator('.os-scrollbar-vertical')).toHaveCount(1)
})
