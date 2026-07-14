import { expect, test, type Page } from '@playwright/test'

type VisualTheme = 'light' | 'dark'
type VisualRoute = '/' | '/components' | '/emoticons' | '/resume' | '/portfolio'

const themes: readonly VisualTheme[] = ['light', 'dark']
const sharedRoutes: readonly VisualRoute[] = [
  '/',
  '/components',
  '/emoticons',
  '/resume',
]

function routesForProject(projectName: string): readonly VisualRoute[] {
  return projectName === 'tablet-chromium'
    ? sharedRoutes
    : [...sharedRoutes, '/portfolio']
}

function snapshotName(route: VisualRoute, theme: VisualTheme) {
  const routeName = route === '/' ? 'home' : route.slice(1)
  return `${routeName}-${theme}.png`
}

async function waitForTwoAnimationFrames(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )
}

async function seedVisualPreferences(page: Page, theme: VisualTheme) {
  await page.emulateMedia({ colorScheme: theme })
  await page.addInitScript(
    ({ nextTheme, codeTheme }) => {
      window.localStorage.setItem('theme', nextTheme)
      window.localStorage.setItem('font-theme', 'pretendard')
      window.localStorage.setItem('blog-theme', 'ink')
      window.localStorage.setItem('blog-theme-user-set', 'true')
      window.localStorage.setItem('code-theme', codeTheme)
    },
    {
      nextTheme: theme,
      codeTheme: theme === 'light' ? 'one-light' : 'one-dark-pro',
    }
  )
}

async function expectStableTheme(page: Page, theme: VisualTheme) {
  const root = page.locator('html')

  if (theme === 'dark') {
    await expect(root).toHaveClass(/\bdark\b/)
  } else {
    await expect(root).not.toHaveClass(/\bdark\b/)
  }

  await expect(root).toHaveAttribute('data-font-theme', 'pretendard')
  await expect(root).toHaveAttribute('data-blog-theme', 'ink')
  await expect(root).toHaveAttribute(
    'data-code-theme',
    theme === 'light' ? 'one-light' : 'one-dark-pro'
  )

  const themeButton = page.getByRole('button', {
    name: theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환',
  })
  await expect(themeButton).toBeVisible()
  await expect(themeButton).toHaveAttribute(
    'aria-pressed',
    theme === 'dark' ? 'true' : 'false'
  )
}

async function removeIdleNextDevPortal(page: Page) {
  await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal')

    if (!portal) {
      return
    }

    const shadowRoot = portal.shadowRoot
    const badge = shadowRoot?.querySelector('[data-next-badge]')
    const errorState = badge?.getAttribute('data-error')
    const errorExpanded = badge?.getAttribute('data-error-expanded')
    const buildStatus = badge?.getAttribute('data-status')

    if (
      !shadowRoot ||
      !badge ||
      errorState !== 'false' ||
      errorExpanded !== 'false' ||
      buildStatus !== 'none'
    ) {
      throw new Error(
        `Refusing to remove a non-idle Next dev portal: error=${errorState}, expanded=${errorExpanded}, status=${buildStatus}`
      )
    }

    portal.remove()
  })
}

async function stepScrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const waitForFrames = () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })

    let nextScrollTop = 0

    while (nextScrollTop < document.documentElement.scrollHeight) {
      window.scrollTo(0, nextScrollTop)
      await waitForFrames()
      nextScrollTop += Math.max(1, window.innerHeight)
    }

    window.scrollTo(0, document.documentElement.scrollHeight)
    await waitForFrames()
  })
}

async function waitForRenderedImages(page: Page) {
  await page.waitForFunction(
    () =>
      Array.from(document.images).every(
        (image) =>
          image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
      ),
    undefined,
    { timeout: 45_000 }
  )

  await page.waitForFunction(
    () =>
      Array.from(document.images).every(
        (image) => Number.parseFloat(getComputedStyle(image).opacity) >= 1
      ),
    undefined,
    { timeout: 45_000 }
  )
}

async function prepareScrollableContent(page: Page) {
  await stepScrollThroughPage(page)
  await waitForRenderedImages(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForFunction(() => window.scrollY === 0)
  await waitForTwoAnimationFrames(page)
}

async function prepareComponents(page: Page) {
  await expect(
    page.getByRole('heading', { level: 1, name: 'Components' })
  ).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Registry summary' })
  ).toBeVisible()
}

async function readVirtualGridSignature(page: Page) {
  return page.locator('[data-emoticon-grid-content]').evaluate((content) => {
    const rows = Array.from(content.children).map((child) => ({
      height: getComputedStyle(child).height,
      transform: getComputedStyle(child).transform,
    }))

    return JSON.stringify({
      cardCount: content.querySelectorAll('[data-emoticon-card]').length,
      contentHeight: getComputedStyle(content).height,
      rows,
    })
  })
}

async function prepareEmoticons(page: Page) {
  await expect(page.locator('[data-emoticon-skeleton]')).toHaveCount(0)
  await expect(
    page.getByRole('tablist', { name: '이모티콘 종류' })
  ).toBeVisible()

  const cards = page.locator('[data-emoticon-card]')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThan(0)
  await expect(
    page.locator('[data-emoticon-card-skeleton]:visible')
  ).toHaveCount(0)

  const gridScroll = page.locator('[data-emoticon-grid-scroll]')
  await expect(gridScroll).toBeVisible()
  expect(await gridScroll.evaluate((element) => element.scrollTop)).toBe(0)

  await gridScroll.evaluate((element) => {
    element.style.scrollbarGutter = 'stable both-edges'
  })
  await waitForTwoAnimationFrames(page)

  const firstSignature = await readVirtualGridSignature(page)
  await waitForTwoAnimationFrames(page)
  const secondSignature = await readVirtualGridSignature(page)
  expect(secondSignature).toBe(firstSignature)
}

async function prepareResume(page: Page) {
  await expect(page.locator('[data-resume-skeleton]')).toHaveCount(0, {
    timeout: 45_000,
  })

  const document = page.locator('[data-resume-document]')
  await expect(document).toBeVisible({ timeout: 45_000 })
  await page.waitForFunction(
    () => {
      const resumeDocument = window.document.querySelector(
        '[data-resume-document]'
      )

      if (!resumeDocument) {
        return false
      }

      return Array.from(resumeDocument.querySelectorAll('img')).every(
        (image) =>
          image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
      )
    },
    undefined,
    { timeout: 45_000 }
  )

  const firstBox = await document.boundingBox()
  expect(firstBox).not.toBeNull()
  await waitForTwoAnimationFrames(page)
  expect(await document.boundingBox()).toEqual(firstBox)
}

async function prepareRoute(page: Page, route: VisualRoute) {
  if (route === '/' || route === '/portfolio') {
    await prepareScrollableContent(page)
    return
  }

  if (route === '/components') {
    await prepareComponents(page)
    return
  }

  if (route === '/emoticons') {
    await prepareEmoticons(page)
    return
  }

  await prepareResume(page)
}

function shouldUseFullPageCapture(route: VisualRoute, viewportWidth: number) {
  if (route === '/emoticons') {
    return false
  }

  if (route === '/components') {
    return viewportWidth < 1024
  }

  return true
}

test.describe('migration visual baseline', () => {
  for (const theme of themes) {
    test(`${theme} route matrix`, async ({ page }, testInfo) => {
      test.setTimeout(180_000)

      const pageErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      await seedVisualPreferences(page, theme)

      const viewportWidth = page.viewportSize()?.width ?? 0
      const routes = routesForProject(testInfo.project.name)

      for (const route of routes) {
        const response = await page.goto(route)

        expect(response, `Expected a navigation response for ${route}`).not.toBeNull()
        expect(
          response?.ok(),
          `Expected ${route} to return a successful status`
        ).toBe(true)
        await expect(page.getByRole('main')).toBeVisible()
        await expectStableTheme(page, theme)
        await page.evaluate(async () => {
          await document.fonts.ready
        })
        await waitForTwoAnimationFrames(page)
        await prepareRoute(page, route)
        await removeIdleNextDevPortal(page)

        const screenshotOptions = {
          animations: 'disabled' as const,
          caret: 'hide' as const,
          fullPage: shouldUseFullPageCapture(route, viewportWidth),
          scale: 'css' as const,
        }

        if (route === '/resume') {
          const ageValue = page
            .getByText('나이', { exact: true })
            .locator('..')
            .locator('dd')
          const currentDurationSummaries = page.getByText(
            /^총 (?:\d+년(?: \d+개월)?|\d+개월)$/
          )

          const screenshot = await page.screenshot({
            ...screenshotOptions,
            mask: [ageValue, currentDurationSummaries],
          })
          expect(screenshot).toMatchSnapshot(snapshotName(route, theme))
        } else {
          const screenshot = await page.screenshot(screenshotOptions)
          expect(screenshot).toMatchSnapshot(snapshotName(route, theme))
        }
      }

      expect(
        pageErrors,
        `Expected no uncaught page errors, received:\n${pageErrors.join('\n')}`
      ).toEqual([])
    })
  }
})
