import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('font-theme', 'pretendard')
    window.localStorage.setItem('reading-font-weight', '400')
  })
  await page.goto('/')
})

test('반응형 설정 패널이 열리고 ESC로 닫은 뒤 트리거에 포커스를 돌려준다', async ({ page }) => {
  const trigger = page.getByRole('button', { name: '설정 열기' })
  await trigger.click()

  const drawer = page.getByRole('dialog', { name: '설정' })
  await expect(drawer).toBeVisible()
  await expect(drawer).not.toHaveAttribute('aria-describedby')
  await expect(drawer.getByText('색상과 글꼴, 읽기 환경을 조정합니다.')).toHaveCount(0)
  await expect
    .poll(() =>
      drawer.evaluate((element) =>
        element
          .getAnimations()
          .every((animation) => animation.playState === 'finished')
      )
    )
    .toBe(true)

  const viewport = page.viewportSize()
  expect(viewport).not.toBeNull()
  const box = await drawer.boundingBox()
  expect(box).not.toBeNull()

  if ((viewport?.width ?? 0) < 640) {
    expect(Math.abs((box?.width ?? 0) - (viewport?.width ?? 0))).toBeLessThan(2)
    await expect
      .poll(async () => {
        const currentBox = await drawer.boundingBox()
        return Math.abs(
          (currentBox?.y ?? 0) +
            (currentBox?.height ?? 0) -
            (viewport?.height ?? 0)
        )
      })
      .toBeLessThan(2)
    expect(box?.height).toBeLessThan((viewport?.height ?? 0) * 0.91)
  } else {
    expect(box?.width).toBeGreaterThanOrEqual(390)
    expect(box?.width).toBeLessThanOrEqual(410)
    expect(Math.abs((box?.x ?? 0) + (box?.width ?? 0) - (viewport?.width ?? 0) + 16)).toBeLessThan(2)
    expect(Math.abs((box?.y ?? 0) - 16)).toBeLessThan(2)
    expect(Math.abs((box?.height ?? 0) - (viewport?.height ?? 0) + 32)).toBeLessThan(2)
  }

  const titleBox = await drawer.getByRole('heading', { name: '설정' }).boundingBox()
  const closeBox = await drawer.getByRole('button', { name: '설정 닫기' }).boundingBox()
  expect(closeBox?.height).toBeGreaterThanOrEqual(35)
  expect(closeBox?.height).toBeLessThanOrEqual(37)
  expect(Math.abs((closeBox?.height ?? 0) - (titleBox?.height ?? 0))).toBeLessThanOrEqual(10)

  const headerBox = await drawer.locator('header').boundingBox()
  const firstSectionBox = await drawer.locator('section').first().boundingBox()
  expect((firstSectionBox?.y ?? 0) - ((headerBox?.y ?? 0) + (headerBox?.height ?? 0))).toBeLessThanOrEqual(8)

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('사용자 색상을 직접 선택하고 다시 불러온다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  await expect(page.getByLabel('HEX 색상 값')).toHaveValue('#171717')
  await page.getByRole('button', { name: '색상 팔레트 열기' }).click()
  const picker = page.getByRole('dialog', { name: '색상 선택' })
  await expect(picker).toBeVisible()
  await picker.getByLabel('컬러 피커 HEX 값').fill('#6d5dfc')
  await picker.getByLabel('컬러 피커 HEX 값').press('Enter')

  await expect(page.locator('html')).toHaveAttribute('data-blog-theme', 'custom')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('blog-theme-custom-color'))).toBe('#6D5DFC')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-blog-theme', 'custom')
  await page.getByRole('button', { name: '설정 열기' }).click()
  await expect(page.getByLabel('HEX 색상 값')).toHaveValue('#6D5DFC')

  const hexInput = page.getByLabel('HEX 색상 값')
  await hexInput.fill('FF5500')
  await hexInput.press('Enter')
  await expect(page.getByLabel('HEX 색상 값')).toHaveValue('#FF5500')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('blog-theme-custom-color'))).toBe('#FF5500')

  await page.getByRole('button', { name: 'Ink (기본) 색상' }).click()
  await expect(page.getByLabel('HEX 색상 값')).toHaveValue('#171717')
  await expect(page.locator('html')).toHaveAttribute('data-blog-theme', 'ink')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('blog-theme-custom-color'))).toBeNull()
})

test('커스텀 컬러 피커는 키보드와 포인터로 즉시 색상을 바꾼다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  await expect(page.locator('input[type="color"]')).toHaveCount(0)
  await page.getByRole('button', { name: '색상 팔레트 열기' }).click()
  const picker = page.getByRole('dialog', { name: '색상 선택' })
  const pickerHex = picker.getByLabel('컬러 피커 HEX 값')
  const externalHex = page.getByLabel('HEX 색상 값')

  await pickerHex.fill('#FF0000')
  await pickerHex.press('Enter')
  await expect(externalHex).toHaveValue('#FF0000')

  const saturation = picker.getByRole('slider', { name: '채도와 명도' })
  await expect
    .poll(() =>
      saturation.evaluate((element) => {
        const styles = getComputedStyle(element)
        return {
          borderWidth: styles.borderTopWidth,
          boxShadow: styles.boxShadow,
        }
      })
    )
    .toEqual({
      borderWidth: '0px',
      boxShadow: expect.stringContaining('inset'),
    })
  await saturation.press('ArrowLeft')
  await expect(externalHex).not.toHaveValue('#FF0000')

  const beforeHue = await externalHex.inputValue()
  await picker.getByRole('slider', { name: '색조' }).press('ArrowRight')
  await expect(externalHex).not.toHaveValue(beforeHue)

  const saturationBox = await saturation.boundingBox()
  expect(saturationBox).not.toBeNull()
  const beforePointer = await externalHex.inputValue()
  await saturation.click({
    position: {
      x: (saturationBox?.width ?? 0) * 0.45,
      y: (saturationBox?.height ?? 0) * 0.35,
    },
  })
  await expect(externalHex).not.toHaveValue(beforePointer)
})

test('색상 선택은 최근 색상 목록이나 별도 저장값을 만들지 않는다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const hexInput = page.getByLabel('HEX 색상 값')
  await hexInput.fill('#445566')
  await hexInput.press('Enter')

  await expect(page.getByText('최근 사용', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('group', { name: '최근 사용 색상' })).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('blog-theme-recent-colors'))).toBeNull()
})

test('사용자 색상은 밝고 어두운 배경에서 텍스트 대비를 유지한다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const hexInput = page.getByLabel('HEX 색상 값')

  await hexInput.fill('#ffffff')
  await hexInput.press('Enter')
  await expect.poll(() => readCurrentAccentContrast(page)).toBeGreaterThanOrEqual(4.5)

  await page.locator('html').evaluate((element) => element.classList.add('dark'))
  await hexInput.fill('#000000')
  await hexInput.press('Enter')
  await expect.poll(() => readCurrentAccentContrast(page)).toBeGreaterThanOrEqual(4.5)
})

test('설정 본문은 스크롤해서 마지막 항목까지 접근할 수 있다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  await expect
    .poll(() =>
      drawer.evaluate((element) =>
        element.getAnimations().every((animation) => animation.playState === 'finished')
      )
    )
    .toBe(true)
  const scrollArea = page.locator('.settings-drawer-scroll')
  const scrollViewport = scrollArea.locator('[data-overlayscrollbars-viewport]')
  const verticalScrollbar = scrollArea.locator('.os-scrollbar-vertical')
  const initialPageScroll = await page.evaluate(() => window.scrollY)

  await expect(verticalScrollbar).toHaveCount(1)
  await scrollArea.hover()
  await page.mouse.wheel(0, 700)

  await expect(page.getByRole('switch', { name: '모션 줄이기' })).toBeVisible()
  await expect.poll(() => scrollViewport.evaluate((element) => element.scrollTop > 0)).toBe(true)
  await expect(scrollArea).toHaveAttribute('data-slot', 'scroll-area')
  await expect(verticalScrollbar).not.toHaveClass(/os-scrollbar-auto-hide-hidden/)
  await expect(verticalScrollbar).toHaveClass(/os-scrollbar-auto-hide-hidden/, {
    timeout: 2_000,
  })
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(initialPageScroll)
})

test('모바일에서는 터치 스와이프로 설정 본문을 스크롤한다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium')

  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  await expect
    .poll(() =>
      drawer.evaluate((element) =>
        element.getAnimations().every((animation) => animation.playState === 'finished')
      )
    )
    .toBe(true)
  const scrollArea = page.locator('.settings-drawer-scroll')
  const scrollViewport = scrollArea.locator('[data-overlayscrollbars-viewport]')
  const box = await scrollViewport.boundingBox()
  expect(box).not.toBeNull()

  const client = await page.context().newCDPSession(page)
  const x = (box?.x ?? 0) + (box?.width ?? 0) / 2
  const startY = (box?.y ?? 0) + (box?.height ?? 0) * 0.75
  const endY = (box?.y ?? 0) + (box?.height ?? 0) * 0.25

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y: startY }],
  })
  for (let step = 1; step <= 6; step += 1) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: startY + ((endY - startY) * step) / 6 }],
    })
  }
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })

  await expect.poll(() => scrollViewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('Drawer 모서리는 화면 크기에 맞게 둥글다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })

  await expect
    .poll(() =>
      drawer.evaluate((element) => {
        const styles = getComputedStyle(element)
        return [
          styles.borderTopLeftRadius,
          styles.borderTopRightRadius,
          styles.borderBottomRightRadius,
          styles.borderBottomLeftRadius,
        ]
      })
    )
    .toEqual(
      (page.viewportSize()?.width ?? 0) < 640
        ? ['20px', '20px', '0px', '0px']
        : ['20px', '20px', '20px', '20px']
    )
})

test('폰트를 바꾸면 해당 폰트가 지원하는 굵기만 선택할 수 있다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })

  await drawer.getByRole('button', { name: '폰트 선택' }).click()
  await page
    .getByRole('dialog', { name: '폰트 선택' })
    .getByRole('button', { name: 'Maplestory' })
    .click()

  const weightTrigger = drawer.getByRole('combobox', {
    name: '글꼴 굵기 선택',
  })
  await expect(weightTrigger.locator('[data-font-weight-badge]')).toHaveText('400')
  await weightTrigger.click()
  const weightList = page.getByRole('listbox')
  await expect(weightList.getByRole('option')).toHaveCount(2)
  const selectedWeight = weightList.getByRole('option', { name: 'Regular 400' })
  await expect(selectedWeight).toBeVisible()
  await expect(selectedWeight.locator('[data-font-weight-badge]')).toHaveText('400')
  await expect(weightList.getByRole('option', { name: 'Bold 700' })).toBeVisible()
  await expect.poll(() => selectedWeight.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)')
  await expect
    .poll(() =>
      weightList
        .locator('[data-slot="select-viewport"]')
        .evaluate((element) => getComputedStyle(element).rowGap)
    )
    .toBe('2px')
  await weightList.getByRole('option', { name: 'Bold 700' }).click()

  await drawer.getByRole('button', { name: '폰트 선택' }).click()
  await page
    .getByRole('dialog', { name: '폰트 선택' })
    .getByRole('button', { name: '페이퍼로지' })
    .click()
  await drawer.getByRole('combobox', { name: '글꼴 굵기 선택' }).click()
  await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(9)
  await page.keyboard.press('Escape')

  await drawer.getByRole('button', { name: '폰트 선택' }).click()
  await page
    .getByRole('dialog', { name: '폰트 선택' })
    .getByRole('button', { name: '조선명조' })
    .click()
  await expect(drawer.getByRole('combobox', { name: '글꼴 굵기 선택' })).toHaveCount(0)
  await expect(drawer.getByText('글꼴 굵기', { exact: true })).toHaveCount(0)
  await expect(page.locator('html')).toHaveAttribute('data-reading-font-weight', '400')

  await drawer.getByRole('button', { name: '폰트 선택' }).click()
  await page
    .getByRole('dialog', { name: '폰트 선택' })
    .getByRole('button', { name: 'Pretendard' })
    .click()
  await expect(drawer.getByRole('combobox', { name: '글꼴 굵기 선택' })).toHaveText(
    'Regular 400'
  )

  await drawer.getByRole('button', { name: '설정 닫기' }).click()
  await page.getByRole('button', { name: '설정 열기' }).click()
  await expect(
    page
      .getByRole('dialog', { name: '설정' })
      .getByRole('combobox', { name: '글꼴 굵기 선택' })
  ).toHaveText('Regular 400')
})

test('현재 경로의 헤더 아이콘은 기본 stroke보다 굵다', async ({ page }) => {
  const activeIcon = page.locator(
    '[aria-current="page"] > svg:not(.header-aurora-icon-defs)'
  )

  await expect(activeIcon).toHaveCount(1)
  await expect
    .poll(() =>
      activeIcon.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).strokeWidth)
      )
    )
    .toBeGreaterThan(2)
})

test('선택한 폰트의 가벼운 굵기도 카드 제목에 그대로 적용한다', async ({ page }) => {
  const cardTitle = page.locator('[data-reading-surface="post-card-title"]').first()
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })

  await drawer.getByRole('combobox', { name: '글꼴 굵기 선택' }).click()
  await page.getByRole('option', { name: 'Thin 100' }).click()
  await expect
    .poll(() => cardTitle.evaluate((element) => getComputedStyle(element).fontWeight))
    .toBe('100')

  await drawer.getByRole('button', { name: '폰트 선택' }).click()
  await page
    .getByRole('dialog', { name: '폰트 선택' })
    .getByRole('button', { name: '페이퍼로지' })
    .click()
  await drawer.getByRole('combobox', { name: '글꼴 굵기 선택' }).click()
  await page.getByRole('option', { name: 'ExtraLight 200' }).click()
  await expect
    .poll(() => cardTitle.evaluate((element) => getComputedStyle(element).fontWeight))
    .toBe('200')
})

test('글자 크기와 줄 간격의 선택 표시가 같은 요소에서 부드럽게 이동한다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  const fontSizeGroup = drawer.getByRole('group', { name: '글자 크기' })
  const indicator = fontSizeGroup.locator('[data-segmented-indicator]')

  await expect(indicator).toHaveCount(1)
  await indicator.evaluate((element) =>
    element.setAttribute('data-test-identity', 'same-indicator')
  )
  const beforeTransform = await indicator.evaluate(
    (element) => getComputedStyle(element).transform
  )
  await fontSizeGroup.getByRole('button', { name: '크게', exact: true }).click()

  await expect
    .poll(() => indicator.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(beforeTransform)
  await expect(indicator).toHaveAttribute('data-test-identity', 'same-indicator')
  await expect(indicator).toHaveCSS('transition-property', /transform/)

  const lineHeightGroup = drawer.getByRole('group', { name: '줄 간격' })
  const lineHeightIndicator = lineHeightGroup.locator('[data-segmented-indicator]')
  const beforeLineHeightTransform = await lineHeightIndicator.evaluate(
    (element) => getComputedStyle(element).transform
  )
  await lineHeightGroup.getByRole('button', { name: '넓게' }).click()
  await expect
    .poll(() =>
      lineHeightIndicator.evaluate((element) => getComputedStyle(element).transform)
    )
    .not.toBe(beforeLineHeightTransform)

  await drawer.getByRole('switch', { name: '모션 줄이기' }).click()
  await expect(indicator).toHaveCSS('transition-duration', '0s')
  await expect(lineHeightIndicator).toHaveCSS('transition-duration', '0s')
})

test('읽기 설정을 즉시 적용하고 다시 열어도 유지한다', async ({ page }) => {
  test.setTimeout(60_000)
  const root = page.locator('html')
  const cardTitle = page.locator('[data-reading-surface="post-card-title"]').first()
  const postHref = await cardTitle.evaluate((element) =>
    element.closest('a')?.getAttribute('href')
  )
  const settingsTrigger = page.getByRole('button', { name: '설정 열기' })
  const siteHeader = page.locator('.header-sticky')
  const beforeHeaderStyle = await readTypography(siteHeader)
  const beforeCardStyle = await cardTitle.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
    }
  })
  expect(beforeCardStyle).toEqual({
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '24.75px',
  })
  await settingsTrigger.click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  const settingsHeading = drawer.locator('section h3').first()
  const beforeSettingsHeadingStyle = await readTypography(settingsHeading)

  await drawer.getByRole('combobox', { name: '글꼴 굵기 선택' }).click()
  await page.getByRole('option', { name: 'Bold 700' }).click()
  await drawer.getByRole('button', { name: '크게', exact: true }).click()
  await drawer.getByRole('button', { name: '넓게' }).click()
  await drawer.getByRole('switch', { name: '모션 줄이기' }).click()

  await expect(root).toHaveAttribute('data-reading-font-size', 'large')
  await expect(root).toHaveAttribute('data-reading-font-weight', '700')
  await expect(root).toHaveAttribute('data-reading-line-height', 'spacious')
  await expect(root).toHaveAttribute('data-reduced-motion', 'true')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('reading-font-size'))).toBe('large')
  await expect
    .poll(() =>
      cardTitle.evaluate((element) => {
        const styles = getComputedStyle(element)
        return {
          fontSize: Number.parseFloat(styles.fontSize),
          fontWeight: styles.fontWeight,
          lineHeight: Number.parseFloat(styles.lineHeight),
        }
      })
    )
    .toMatchObject({ fontWeight: '700' })
  const appliedCardStyle = await cardTitle.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      fontSize: Number.parseFloat(styles.fontSize),
      fontWeight: styles.fontWeight,
      lineHeight: Number.parseFloat(styles.lineHeight),
    }
  })
  expect(appliedCardStyle.fontSize).toBeCloseTo(19.28, 2)
  expect(appliedCardStyle.fontWeight).toBe('700')
  expect(appliedCardStyle.lineHeight / appliedCardStyle.fontSize).toBeCloseTo(1.5, 2)
  expect(`${appliedCardStyle.fontSize}px`).not.toBe(beforeCardStyle.fontSize)
  expect(appliedCardStyle.fontWeight).not.toBe(beforeCardStyle.fontWeight)
  expect(`${appliedCardStyle.lineHeight}px`).not.toBe(beforeCardStyle.lineHeight)
  expect(await readTypography(siteHeader)).toEqual(beforeHeaderStyle)
  expect(await readTypography(settingsHeading)).toEqual(beforeSettingsHeadingStyle)

  await drawer.getByRole('button', { name: '설정 닫기' }).click()
  await settingsTrigger.click()
  await expect(
    page
      .getByRole('dialog', { name: '설정' })
      .getByRole('button', { name: '크게', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')
  const reopenedSettingsHeading = page
    .getByRole('dialog', { name: '설정' })
    .locator('section h3')
    .first()
  expect(await readTypography(reopenedSettingsHeading)).toEqual(
    beforeSettingsHeadingStyle
  )

  expect(postHref).toBeTruthy()
  const reopenedDrawer = page.getByRole('dialog', { name: '설정' })
  await reopenedDrawer.getByRole('button', { name: '설정 닫기' }).click()
  await expect(reopenedDrawer).toBeHidden()
  await cardTitle.click()
  await expect
    .poll(() => page.evaluate(() => decodeURIComponent(window.location.pathname)))
    .toBe(postHref)
  const article = page.locator('.notion-content')
  const articleParagraph = article.locator('p').filter({ hasText: /\S/ }).first()
  await expect(articleParagraph).toBeVisible()
  const articleStyle = await article.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      fontSize: Number.parseFloat(styles.fontSize),
      fontWeight: styles.fontWeight,
    }
  })
  const paragraphLineHeight = await articleParagraph.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).lineHeight)
  )
  expect(articleStyle.fontSize).toBeCloseTo(17.28, 2)
  expect(articleStyle.fontWeight).toBe('700')
  expect(paragraphLineHeight / articleStyle.fontSize).toBeCloseTo(1.9, 2)
  expect(await readTypography(page.locator('.header-sticky'))).toEqual(
    beforeHeaderStyle
  )
})

test('설정에는 전체 초기화 동작이 없다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  await expect(drawer.getByRole('button', { name: '기본 설정으로 되돌리기' })).toHaveCount(0)
})

test('코드 테마 미리보기는 선택한 테마의 색상으로 갱신된다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  const preview = drawer.getByLabel('코드 테마 미리보기')
  const typeKeyword = preview.locator('[data-code-preview-segment="2:0"]')
  const primitiveType = preview.locator('[data-code-preview-segment="3:8"]')
  const declarationProperty = preview.locator('[data-code-preview-segment="3:2"]')
  const operator = preview.locator('[data-code-preview-segment="2:11"]')
  const stringQuote = preview.locator('[data-code-preview-segment="7:8"]')
  const stringContent = preview.locator('[data-code-preview-segment="7:9"]')
  await expect(preview).toBeVisible()
  expect(await preview.locator('[data-code-preview-token]').count()).toBeGreaterThanOrEqual(12)
  await expect
    .poll(() => typeKeyword.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(166, 38, 164)')
  await expect
    .poll(() => primitiveType.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(1, 132, 188)')
  await expect
    .poll(() =>
      declarationProperty.evaluate((element) => getComputedStyle(element).color)
    )
    .toBe('rgb(56, 58, 66)')
  await expect
    .poll(() => operator.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(1, 132, 188)')

  await drawer.getByRole('combobox', { name: '코드 테마 선택' }).click()
  await page.getByRole('option', { name: 'Dracula', exact: true }).click()

  await expect
    .poll(() => typeKeyword.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(255, 121, 198)')
  await expect
    .poll(() => primitiveType.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(139, 233, 253)')
  await expect
    .poll(() =>
      declarationProperty.evaluate((element) => getComputedStyle(element).color)
    )
    .toBe('rgb(248, 248, 242)')
  await expect
    .poll(() => stringQuote.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(233, 242, 132)')
  await expect
    .poll(() => stringContent.evaluate((element) => getComputedStyle(element).color))
    .toBe('rgb(241, 250, 140)')
})

test('코드 블럭은 글꼴 뒤, 접근성 앞에 배치된다', async ({ page }) => {
  await page.getByRole('button', { name: '설정 열기' }).click()
  const drawer = page.getByRole('dialog', { name: '설정' })
  const sectionLabels = await drawer.locator('section h3').allTextContents()

  expect(sectionLabels).toEqual(['색상', '글꼴', '코드 블럭', '접근성'])
})

async function readCurrentAccentContrast(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--theme-accent-current)'
    probe.style.backgroundColor = 'var(--background)'
    document.body.append(probe)
    const styles = getComputedStyle(probe)

    const parseRgb = (value: string) => {
      const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0]
      return channels.map((channel) => channel / 255)
    }
    const luminance = (value: string) => {
      const [red, green, blue] = parseRgb(value).map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4
      )
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue
    }
    const foreground = luminance(styles.color)
    const background = luminance(styles.backgroundColor)
    probe.remove()
    return (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05)
  })
}

async function readTypography(locator: import('@playwright/test').Locator) {
  return locator.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
    }
  })
}
