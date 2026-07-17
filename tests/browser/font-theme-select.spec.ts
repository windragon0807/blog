import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('font-theme', 'pretendard')
  })
  await page.goto('/')
})

test('폰트 선택과 다운로드 페이지 링크가 독립적으로 동작한다', async ({ page }) => {
  const root = page.locator('html')

  await page.getByRole('button', { name: '설정 열기' }).click()
  await page.getByRole('button', { name: '폰트 선택' }).click()

  const fontDialog = page.getByRole('dialog', { name: '폰트 선택' })
  const themeButtons = fontDialog.locator('button[aria-pressed]')
  const chosunLink = fontDialog.getByRole('link', {
    name: '조선명조 다운로드 페이지 열기',
  })

  await expect(themeButtons).toHaveCount(7)
  await expect(chosunLink).toHaveAttribute(
    'href',
    'https://event.chosun.com/100/100font.html'
  )
  await expect(chosunLink).toHaveAttribute('target', '_blank')

  await chosunLink.evaluate((element) => {
    element.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    })
  })
  await chosunLink.click()

  await expect(root).toHaveAttribute('data-font-theme', 'pretendard')
  await expect(fontDialog).toBeVisible()

  await fontDialog.getByRole('button', { name: '조선명조' }).click()

  await expect(root).toHaveAttribute('data-font-theme', 'chosun-myeongjo')
  await expect(fontDialog).toBeHidden()

  await page.getByRole('button', { name: '폰트 선택' }).click()
  await expect(
    page
      .getByRole('dialog', { name: '폰트 선택' })
      .getByRole('button', { name: '조선명조' })
  ).toHaveAttribute('aria-pressed', 'true')
})

test('폰트 선택 목록은 각 항목의 실제 글꼴을 미리 보여준다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  await page.getByRole('button', { name: '폰트 선택' }).click()

  const fontDialog = page.getByRole('dialog', { name: '폰트 선택' })
  const previews = [
    ['Pretendard', 'Pretendard', false],
    ['Maplestory', 'Maplestory OTF', true],
    ['한컴 말랑말랑체', 'Hancom MalangMalang', true],
    ['조선명조', 'Chosun Myeongjo', false],
    ['토스 머니그래피', 'Moneygraphy Rounded', false],
    ['조선굴림', 'Chosun Gulim', true],
    ['페이퍼로지', 'Paperlogy', true],
  ] as const

  for (const [label, family, verifyLoad] of previews) {
    const preview = fontDialog
      .getByRole('button', { name: label, exact: true })
      .locator('span')

    await expect
      .poll(() => preview.evaluate((element) => getComputedStyle(element).fontFamily))
      .toContain(family)

    if (verifyLoad) {
      await expect
        .poll(() =>
          page.evaluate(
            async ({ family, label }) =>
              (await document.fonts.load(`16px "${family}"`, label)).length,
            { family, label }
          )
        )
        .toBeGreaterThan(0)
    }
  }
})

test('작은 화면에서도 폰트 목록만 휠로 스크롤한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 500 })
  await page.getByRole('button', { name: '설정 열기' }).click()
  await page.getByRole('button', { name: '폰트 선택' }).click()

  const fontDialog = page.getByRole('dialog', { name: '폰트 선택' })
  const scrollArea = fontDialog.locator('[data-slot="scroll-area"]')
  const scrollViewport = scrollArea.locator('[data-overlayscrollbars-viewport]')
  const initialPageScroll = await page.evaluate(() => window.scrollY)

  await scrollArea.evaluate((element) => {
    element.style.maxHeight = '160px'
  })
  await scrollViewport.hover()
  await page.mouse.wheel(0, 700)

  await expect
    .poll(() => scrollViewport.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(initialPageScroll)
})

test('토스 머니그래피는 공식 CDN 폰트를 선택 후 로드한다', async ({ page }) => {
  const fontResponse = page.waitForResponse(
    (response) =>
      response.url() ===
      'https://static.toss.im/assets/homepage/moneygraphy-font/font/Moneygraphy-Rounded-1.1.woff2'
  )

  await page.getByRole('button', { name: '설정 열기' }).click()
  await page.getByRole('button', { name: '폰트 선택' }).click()
  await page
    .getByRole('dialog', { name: '폰트 선택' })
    .getByRole('button', { name: '토스 머니그래피' })
    .click()

  await expect(page.locator('html')).toHaveAttribute(
    'data-font-theme',
    'moneygraphy'
  )
  await expect.poll(async () => (await fontResponse).ok()).toBe(true)
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const fonts = await document.fonts.load(
          '16px "Moneygraphy Rounded"',
          '토스 머니그래피'
        )
        return fonts.length
      })
    )
    .toBeGreaterThan(0)
})

test('폰트 옵션은 화살표·처음·끝·문자 키로 탐색한다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  await page.getByRole('button', { name: '폰트 선택' }).click()

  const fontDialog = page.getByRole('dialog', { name: '폰트 선택' })
  const themeButtons = fontDialog.locator('button[aria-pressed]')
  const pretendard = fontDialog.getByRole('button', { name: 'Pretendard' })
  const maplestory = fontDialog.getByRole('button', { name: 'Maplestory' })
  const paperlogy = fontDialog.getByRole('button', { name: '페이퍼로지' })

  await expect(pretendard).toBeFocused()
  await expect(pretendard).toHaveAttribute('tabindex', '0')

  await pretendard.press('ArrowDown')
  await expect(maplestory).toBeFocused()

  await maplestory.press('End')
  await expect(paperlogy).toBeFocused()

  await paperlogy.press('Home')
  await expect(pretendard).toBeFocused()

  await pretendard.press('m')
  await expect(maplestory).toBeFocused()

  await expect(themeButtons.evaluateAll((buttons) =>
    buttons.filter((button) => button.tabIndex === 0).length
  )).resolves.toBe(1)
})
