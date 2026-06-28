import { expect, test } from '@playwright/test'

test('component page uses a drawer navigation on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components/3d-image-carousel')

  await expect(
    page.getByRole('heading', { name: 'Depth Image Carousel' })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '컴포넌트 메뉴 열기' })
  ).toBeVisible()
  await expect(page.locator('.components-sidebar-slot')).toBeHidden()

  await page.getByRole('button', { name: '컴포넌트 메뉴 열기' }).click()

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('searchbox', { name: '컴포넌트 메뉴 검색' })
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Theme Toggle' })).toBeVisible()

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
})
