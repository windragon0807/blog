import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'

const lightswindAnimationTypes = [
  'circle-spread',
  'round-morph',
  'swipe-left',
  'swipe-up',
  'diag-down-right',
  'fade-in-out',
  'shrink-grow',
  'flip-x-in',
  'split-vertical',
  'swipe-right',
  'swipe-down',
  'wave-ripple',
] as const

declare global {
  interface Window {
    __toggleThemeAnimateCalls: Array<{
      keyframes: unknown
      options:
        | number
        | {
            duration?: unknown
            easing?: string
            pseudoElement?: string
          }
        | undefined
    }>
  }
}

test('toggle theme keeps the Lightswind View Transition implementation shape', async () => {
  const componentSource = readFileSync(
    join(process.cwd(), 'src/components/toggle-theme.tsx'),
    'utf8'
  )
  const globalStylesSource = readFileSync(
    join(process.cwd(), 'src/app/globals.css'),
    'utf8'
  )
  const registry = JSON.parse(
    readFileSync(join(process.cwd(), 'public/r/toggle-theme.json'), 'utf8')
  )
  const registryCss = JSON.stringify(registry.css ?? {})

  expect(componentSource).toContain('startViewTransition')
  expect(componentSource).toContain('flushSync')
  expect(componentSource).toContain('document.documentElement.animate')
  expect(componentSource).toContain("pseudoElement: '::view-transition-new(root)'")
  expect(componentSource).toContain("pseudoElement: '::view-transition-old(root)'")
  expect(componentSource).not.toContain('data-theme-transition-overlay')
  expect(componentSource).not.toContain('root.dataset.themeTransition')
  expect(globalStylesSource).not.toContain('data-theme-transition-overlay')
  expect(globalStylesSource).not.toContain('theme-blur-out')
  expect(registryCss).not.toContain('data-theme-transition-overlay')
  expect(registry.files[0].content).toContain('startViewTransition')

  for (const animationType of lightswindAnimationTypes) {
    expect(componentSource).toContain(`'${animationType}'`)
  }
})

test('toggle theme switches every Lightswind mode and runs view-transition animations', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const originalAnimate = Element.prototype.animate

    window.__toggleThemeAnimateCalls = []
    window.localStorage.setItem('theme', 'light')

    Element.prototype.animate = function (keyframes, options) {
      if (this === document.documentElement) {
        const animationOptions =
          options && typeof options === 'object'
            ? (options as KeyframeAnimationOptions)
            : undefined

        window.__toggleThemeAnimateCalls.push({
          keyframes,
          options: animationOptions
            ? {
                duration: animationOptions.duration,
                easing: animationOptions.easing,
                pseudoElement: animationOptions.pseudoElement ?? undefined,
              }
            : typeof options === 'number'
              ? options
              : undefined,
        })
      }

      return originalAnimate.call(this, keyframes, options)
    }
  })

  await page.emulateMedia({ colorScheme: 'light' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components/toggle-theme')

  await expect(page.locator('html')).not.toHaveClass(/dark/)

  for (const animationType of lightswindAnimationTypes) {
    const button = page.getByRole('switch', { name: animationType })
    const wasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )

    await button.click()

    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.classList.contains('dark'))
      )
      .toBe(!wasDark)
  }

  const animateCalls = await page.evaluate(() => window.__toggleThemeAnimateCalls)

  expect(animateCalls.length).toBeGreaterThanOrEqual(10)
  expect(
    animateCalls.some(
      (call) =>
        typeof call.options === 'object' &&
        call.options?.pseudoElement === '::view-transition-new(root)'
    )
  ).toBe(true)
  expect(
    animateCalls.some(
      (call) =>
        typeof call.options === 'object' &&
        call.options?.pseudoElement === '::view-transition-old(root)'
    )
  ).toBe(true)
})
