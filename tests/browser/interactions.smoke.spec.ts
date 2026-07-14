import { expect, test, type Locator, type Page } from '@playwright/test'

const pageErrors = new WeakMap<Page, string[]>()

test.beforeEach(({ page }) => {
  const errors: string[] = []
  pageErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push(error.message))
})

test.afterEach(({ page }) => {
  const errors = pageErrors.get(page) ?? []

  expect(
    errors,
    `Expected no uncaught page errors on ${page.url()}, received:\n${errors.join('\n')}`
  ).toEqual([])
})

async function focusWithTab(page: Page, target: Locator) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await page.keyboard.press('Tab')

    if (await target.evaluate((element) => element === document.activeElement)) {
      break
    }
  }

  await expect(target).toBeFocused()
}

test.describe('core interaction contracts', () => {
  test('header theme control works from the keyboard and persists', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.addInitScript(() => {
      if (window.localStorage.getItem('theme') === null) {
        window.localStorage.setItem('theme', 'light')
      }
    })

    await page.goto('/portfolio')

    const lightThemeControl = page.getByRole('button', {
      name: '다크 모드로 전환',
    })
    await expect(lightThemeControl).toBeVisible()
    await expect(lightThemeControl).toHaveAttribute('aria-pressed', 'false')
    await focusWithTab(page, lightThemeControl)
    await page.keyboard.press('Enter')

    const darkThemeControl = page.getByRole('button', {
      name: '라이트 모드로 전환',
    })
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(darkThemeControl).toHaveAttribute('aria-pressed', 'true')

    await page.reload()

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(darkThemeControl).toBeVisible()
    await expect(darkThemeControl).toHaveAttribute('aria-pressed', 'true')
  })

  test('component documentation navigation and responsive menu stay usable', async ({
    page,
  }) => {
    await page.goto('/components')

    const viewportWidth = page.viewportSize()?.width ?? 0
    const isDesktop = viewportWidth >= 1024

    if (isDesktop) {
      const navigation = page.getByRole('navigation', {
        name: 'Component categories',
      })
      await expect(navigation).toBeVisible()

      const links = navigation.getByRole('link')
      const linkCount = await links.count()
      let firstComponentLink: Locator | null = null

      for (let index = 0; index < linkCount; index += 1) {
        const candidate = links.nth(index)
        const href = await candidate.getAttribute('href')

        if (href && /^\/components\/[^/]+$/.test(href)) {
          firstComponentLink = candidate
          break
        }
      }

      if (!firstComponentLink) {
        throw new Error('Expected a component document link')
      }

      const href = await firstComponentLink.getAttribute('href')

      if (!href) {
        throw new Error('Expected the component document link to have an href')
      }

      await firstComponentLink.click()
      await expect(page).toHaveURL(new RegExp(`${href}$`))
    } else {
      const trigger = page.getByRole('button', {
        name: '컴포넌트 메뉴 열기',
      })
      await expect(trigger).toBeVisible()
      await trigger.click()

      const dialog = page.getByRole('dialog', { name: '컴포넌트 메뉴' })
      await expect(dialog).toBeVisible()
      await expect(
        dialog.getByRole('heading', { name: '컴포넌트 메뉴' })
      ).toBeAttached()
      await expect(
        dialog.getByRole('searchbox', { name: '컴포넌트 메뉴 검색' })
      ).toBeVisible()

      await dialog.getByRole('button', { name: '컴포넌트 메뉴 닫기' }).click()
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    }

    await page.goto('/components/data-table')

    await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Code', exact: true })).toBeVisible()
    await expect(page.locator('[data-component-preview-frame]')).toBeVisible()
  })

  test('emoticon collection selection and action sheet preserve focus', async ({
    page,
  }) => {
    await page.goto('/emoticons')

    const tablist = page.getByRole('tablist', { name: '이모티콘 종류' })
    await expect(tablist).toBeVisible()

    const firstUnselectedTab = tablist
      .getByRole('tab', { selected: false })
      .first()
    await expect(firstUnselectedTab).toBeVisible()

    const tabName = (await firstUnselectedTab.innerText()).trim()
    const selectedTab = tablist.getByRole('tab', { name: tabName, exact: true })
    await selectedTab.click()
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true')

    const selectedCard = page.locator('[data-emoticon-card]:visible').first()
    await expect(selectedCard).toBeVisible()
    await selectedCard.click()

    const actionSheet = page.locator(
      '[data-emoticon-bottom-sheet][role="dialog"]'
    )
    await expect(actionSheet).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(actionSheet).toBeHidden()
    await expect(selectedCard).toBeFocused()
  })

  test('resume document and PDF control become available', async ({ page }) => {
    await page.goto('/resume')

    await expect(page.locator('[data-resume-document]')).toBeVisible()

    const downloadButton = page.getByRole('button', { name: 'PDF 다운로드' })
    await expect(downloadButton).toBeVisible()
    await expect(downloadButton).toBeEnabled()
  })
})
