import { expect, test, type Page } from '@playwright/test'

const glassPreviewSlugs = [
  'placeholders-and-vanish-input',
  'playful-todolist',
  'flower-menu',
  'toggle-theme',
  'ripple-button',
  'shiny-button',
  'elastic-slider',
  'counter',
  'lens',
  'confetti',
] as const

async function expectNoConsoleErrors(page: Page) {
  const messages: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      messages.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    messages.push(error.message)
  })
  return () => expect(messages).toEqual([])
}

test.describe('component preview glass polish', () => {
  test('glass-targeted previews render translucent controls instead of solid theme chips', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const slug of glassPreviewSlugs) {
      const assertNoErrors = await expectNoConsoleErrors(page)
      await page.goto(`/components/${slug}`)

      const surface = page.locator('[data-preview-demo-surface]').first()
      await expect(surface).toBeVisible()

      const glassMetrics = await surface.evaluate((element) => {
        const candidates = Array.from(
          element.querySelectorAll<HTMLElement>(
            'form, button, input, [role="switch"], [data-slot="card"], [class*="backdrop-blur"]'
          )
        )
        const styles = candidates.map((candidate) => {
          const style = getComputedStyle(candidate)
          return {
            backdropFilter:
              style.backdropFilter || style.getPropertyValue('-webkit-backdrop-filter'),
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            boxShadow: style.boxShadow,
            color: style.color,
            className: candidate.className,
          }
        })

        return {
          hasTranslucentSurface: styles.some((style) =>
            style.backgroundColor.includes('rgba') ||
            style.backgroundColor.includes('/ 0.') ||
            String(style.className).includes('bg-white/[')
          ),
          hasBackdropBlur: styles.some((style) => style.backdropFilter !== 'none'),
          hasVisibleBorder: styles.some((style) => style.borderColor !== 'rgba(0, 0, 0, 0)'),
          hasShadow: styles.some((style) => style.boxShadow !== 'none'),
          textColors: styles.map((style) => style.color),
        }
      })

      expect(glassMetrics.hasTranslucentSurface, slug).toBe(true)
      expect(glassMetrics.hasVisibleBorder, slug).toBe(true)
      expect(glassMetrics.hasShadow || glassMetrics.hasBackdropBlur, slug).toBe(true)
      await assertNoErrors()
    }
  })

  test('data table keeps rows visually continuous across cells', async ({ page }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/data-table')

    const table = page.locator('table').first()
    await expect(table).toBeVisible()

    const metrics = await table.evaluate((element) => {
      const rows = Array.from(element.querySelectorAll<HTMLTableRowElement>('tbody tr'))
      const firstRowCells = rows[0]
        ? Array.from(rows[0].querySelectorAll<HTMLTableCellElement>('td'))
        : []
      const firstRowRects = firstRowCells.map((cell) => cell.getBoundingClientRect())
      const firstRowStyle = rows[0] ? getComputedStyle(rows[0]) : null
      const bodyStyle = getComputedStyle(element.querySelector('tbody')!)
      const headerRect = element.querySelector('thead')!.getBoundingClientRect()
      const bodyRect = element.querySelector('tbody')!.getBoundingClientRect()
      const tableRect = element.getBoundingClientRect()

      return {
        rowDisplay: firstRowStyle?.display ?? '',
        rowBackground: firstRowStyle?.backgroundColor ?? '',
        bodyBorderRadius: bodyStyle.borderRadius,
        shellBackground: getComputedStyle(element).backgroundColor,
        shellWidth: tableRect.width,
        headerWidth: headerRect.width,
        bodyWidth: bodyRect.width,
        bodyLeftInset: bodyRect.left - tableRect.left,
        bodyRightInset: tableRect.right - bodyRect.right,
        rowCount: rows.length,
        maxCellGap: firstRowRects.slice(1).reduce((maxGap, rect, index) => {
          const previous = firstRowRects[index]
          return Math.max(maxGap, Math.abs(rect.left - previous.right))
        }, 0),
        firstCellHeight: firstRowRects[0]?.height ?? 0,
        lastCellHeight: firstRowRects.at(-1)?.height ?? 0,
      }
    })

    expect(metrics.rowDisplay).toBe('grid')
    expect(metrics.rowBackground).toContain('/ 0.')
    expect(metrics.bodyBorderRadius).not.toBe('0px')
    expect(metrics.shellBackground).toContain('/ 0.')
    expect(metrics.headerWidth).toBeGreaterThanOrEqual(metrics.bodyWidth - 2)
    expect(metrics.bodyWidth).toBeLessThan(metrics.shellWidth)
    expect(metrics.bodyLeftInset).toBeGreaterThan(4)
    expect(metrics.bodyRightInset).toBeGreaterThan(4)
    expect(metrics.rowCount).toBeGreaterThanOrEqual(4)
    expect(metrics.maxCellGap).toBeLessThanOrEqual(1)
    expect(metrics.firstCellHeight).toBeCloseTo(metrics.lastCellHeight, 0)
    await assertNoErrors()
  })

  test('component props table reuses the data table row system', async ({ page }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/placeholders-and-vanish-input')

    const propsSection = page.locator('#props')
    await expect(propsSection.getByRole('heading', { name: 'Props' })).toBeVisible()

    const table = propsSection.locator('table').first()
    await expect(table).toBeVisible()

    const metrics = await table.evaluate((element) => {
      const rows = Array.from(element.querySelectorAll<HTMLTableRowElement>('tbody tr'))
      const firstRowCells = rows[0]
        ? Array.from(rows[0].querySelectorAll<HTMLTableCellElement>('td'))
        : []
      const firstRowRects = firstRowCells.map((cell) => cell.getBoundingClientRect())
      const firstRowStyle = rows[0] ? getComputedStyle(rows[0]) : null
      const body = element.querySelector('tbody')
      const bodyStyle = body ? getComputedStyle(body) : null
      const headerRect = element.querySelector('thead')!.getBoundingClientRect()
      const bodyRect = body!.getBoundingClientRect()
      const tableRect = element.getBoundingClientRect()

      return {
        rowDisplay: firstRowStyle?.display ?? '',
        bodyBorderRadius: bodyStyle?.borderRadius ?? '',
        shellBackground: getComputedStyle(element).backgroundColor,
        shellWidth: tableRect.width,
        headerWidth: headerRect.width,
        bodyWidth: bodyRect.width,
        bodyLeftInset: bodyRect.left - tableRect.left,
        bodyRightInset: tableRect.right - bodyRect.right,
        rowCount: rows.length,
        maxCellGap: firstRowRects.slice(1).reduce((maxGap, rect, index) => {
          const previous = firstRowRects[index]
          return Math.max(maxGap, Math.abs(rect.left - previous.right))
        }, 0),
      }
    })

    expect(metrics.rowDisplay).toBe('grid')
    expect(metrics.bodyBorderRadius).not.toBe('0px')
    expect(metrics.shellBackground).toContain('/ 0.')
    expect(metrics.headerWidth).toBeGreaterThanOrEqual(metrics.bodyWidth - 2)
    expect(metrics.bodyWidth).toBeLessThan(metrics.shellWidth)
    expect(metrics.bodyLeftInset).toBeGreaterThan(4)
    expect(metrics.bodyRightInset).toBeGreaterThan(4)
    expect(metrics.rowCount).toBeGreaterThanOrEqual(4)
    expect(metrics.maxCellGap).toBeLessThanOrEqual(1)
    await assertNoErrors()
  })

  test('component props table keeps code-heavy type values readable', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/data-table')

    const propsTable = page.locator('#props table').first()
    await expect(propsTable).toBeVisible()

    const metrics = await propsTable.evaluate((element) => {
      const rows = Array.from(element.querySelectorAll<HTMLTableRowElement>('tbody tr'))
      const columnsRow = rows.find((row) => {
        const propCell = row.querySelector<HTMLTableCellElement>('td')
        return propCell?.textContent?.trim() === 'columns'
      })

      if (!columnsRow) {
        return {
          foundColumnsRow: false,
          typeText: '',
          typeLineCount: 0,
          typeCellWidth: 0,
        }
      }

      const typeCell = columnsRow.querySelectorAll<HTMLTableCellElement>('td')[1]
      const range = document.createRange()
      range.selectNodeContents(typeCell)
      const typeLineCount = Array.from(range.getClientRects()).filter(
        (rect) => rect.width > 1 && rect.height > 1
      ).length

      return {
        foundColumnsRow: true,
        typeText: typeCell.textContent?.trim() ?? '',
        typeLineCount,
        typeCellWidth: typeCell.getBoundingClientRect().width,
      }
    })

    expect(metrics.foundColumnsRow).toBe(true)
    expect(metrics.typeText).toBe('DataTableColumn<T>[]')
    expect(metrics.typeLineCount).toBe(1)
    expect(metrics.typeCellWidth).toBeGreaterThan(280)
    await assertNoErrors()
  })

  test('component props table uses the table border as the outer edge', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/shiny-button')

    const propsTableShell = page.locator('#props .component-props-table')
    const propsTable = propsTableShell.locator('table').first()
    await expect(propsTableShell).toBeVisible()
    await expect(propsTable).toBeVisible()

    const metrics = await propsTableShell.evaluate((shell) => {
      const table = shell.querySelector('table')!
      const shellStyle = getComputedStyle(shell)
      const shellRect = shell.getBoundingClientRect()
      const tableRect = table.getBoundingClientRect()

      return {
        paddingTop: Number.parseFloat(shellStyle.paddingTop),
        paddingRight: Number.parseFloat(shellStyle.paddingRight),
        paddingBottom: Number.parseFloat(shellStyle.paddingBottom),
        paddingLeft: Number.parseFloat(shellStyle.paddingLeft),
        leftInset: tableRect.left - shellRect.left,
        rightInset: shellRect.right - tableRect.right,
        topInset: tableRect.top - shellRect.top,
        bottomInset: shellRect.bottom - tableRect.bottom,
      }
    })

    expect(metrics.paddingTop).toBe(0)
    expect(metrics.paddingRight).toBe(0)
    expect(metrics.paddingBottom).toBe(0)
    expect(metrics.paddingLeft).toBe(0)
    expect(metrics.leftInset).toBeLessThanOrEqual(1)
    expect(metrics.rightInset).toBeLessThanOrEqual(1)
    expect(metrics.topInset).toBeLessThanOrEqual(1)
    expect(metrics.bottomInset).toBeLessThanOrEqual(1)
    await assertNoErrors()
  })

  test('component props table has themed outer surfaces and light hover', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/placeholders-and-vanish-input')

    const propsTable = page.locator('#props .component-props-table table').first()
    const firstRow = propsTable.locator('tbody tr').first()
    await expect(propsTable).toBeVisible()
    await expect(firstRow).toBeVisible()

    const propsTableShellClassName =
      (await page.locator('#props .component-props-table').getAttribute('class')) ?? ''
    await page.evaluate(() => document.documentElement.classList.remove('dark'))
    const lightRowBackground = await firstRow.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )

    await firstRow.hover()
    const lightRowHoverBackground = await firstRow.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )

    expect(propsTableShellClassName).toContain('[&_table]:!bg-zinc-100/95')
    expect(propsTableShellClassName).toContain('dark:[&_table]:!bg-zinc-950/88')
    expect(propsTableShellClassName).toContain('[&_tbody]:!bg-white/86')
    expect(propsTableShellClassName).toContain('dark:[&_tbody]:!bg-zinc-900/68')
    expect(propsTableShellClassName).toContain(
      '[&_tbody_tr:hover]:!bg-zinc-100/90'
    )
    expect(lightRowHoverBackground).not.toBe(lightRowBackground)
    await assertNoErrors()
  })

  test('physics picker renders as a transparent installable interactive component', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })

    await page.goto('/components/physics-number-picker')
    await expect(
      page.getByRole('heading', { name: 'Physics Number Picker' }).first()
    ).toBeVisible()
    await expect(
      page.getByText('/r/physics-number-picker.json').first()
    ).toBeVisible()

    const spinbutton = page.getByRole('spinbutton', { name: 'Pace seconds' })
    await expect(spinbutton).toBeVisible()
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '24')
    await expect(page.getByText(/\d{2} sec/)).toHaveCount(0)
    const visualMetrics = await spinbutton.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        pickerFadeColor: element.style.getPropertyValue('--picker-fade-color'),
        hasCenterGuide: Boolean(
          element.parentElement?.querySelector('.via-white\\/12.w-px')
        ),
      }
    })
    expect(visualMetrics.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(visualMetrics.pickerFadeColor.trim()).toBe('transparent')
    expect(visualMetrics.hasCenterGuide).toBe(false)
    await spinbutton.click()
    await expect(spinbutton).toBeFocused()
    await spinbutton.press('ArrowDown')
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '25')
    const valueAfterKeyboard = await spinbutton.getAttribute('aria-valuenow')
    const pickerBox = await spinbutton.boundingBox()
    expect(pickerBox).not.toBeNull()
    if (pickerBox) {
      await page.mouse.move(
        pickerBox.x + pickerBox.width / 2,
        pickerBox.y + pickerBox.height / 2
      )
      await page.mouse.down()
      await page.mouse.move(
        pickerBox.x + pickerBox.width / 2,
        pickerBox.y + pickerBox.height / 2 - 108,
        { steps: 8 }
      )
      await page.mouse.up()
      await expect
        .poll(() => spinbutton.getAttribute('aria-valuenow'))
        .not.toBe(valueAfterKeyboard)
    }

    await assertNoErrors()
  })

  test('physics picker turns a fast drag exit into momentum without waiting for pointer up', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/physics-number-picker')

    const spinbutton = page.getByRole('spinbutton', { name: 'Pace seconds' })
    await expect(spinbutton).toBeVisible()
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '24')

    const pickerBox = await spinbutton.boundingBox()
    expect(pickerBox).not.toBeNull()
    if (!pickerBox) return

    await page.mouse.move(
      pickerBox.x + pickerBox.width / 2,
      pickerBox.y + pickerBox.height / 2
    )
    await page.mouse.down()
    await page.mouse.move(
      pickerBox.x + pickerBox.width / 2,
      pickerBox.y - 96,
      { steps: 4 }
    )

    await expect
      .poll(() => spinbutton.getAttribute('aria-valuenow'))
      .not.toBe('24')

    await page.mouse.up()
    await assertNoErrors()
  })

  test('physics picker carries a moderate flick with lighter momentum', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/physics-number-picker')

    const spinbutton = page.getByRole('spinbutton', { name: 'Pace seconds' })
    await expect(spinbutton).toBeVisible()
    await expect(spinbutton).toHaveAttribute('aria-valuenow', '24')

    const pickerBox = await spinbutton.boundingBox()
    expect(pickerBox).not.toBeNull()
    if (!pickerBox) return

    await spinbutton.click()
    await expect(spinbutton).toBeFocused()
    await page.mouse.move(
      pickerBox.x + pickerBox.width / 2,
      pickerBox.y + pickerBox.height / 2
    )
    await page.mouse.down()
    await page.mouse.move(
      pickerBox.x + pickerBox.width / 2,
      pickerBox.y + pickerBox.height / 2 - 84,
      { steps: 6 }
    )
    await page.mouse.up()

    await expect
      .poll(async () => Number(await spinbutton.getAttribute('aria-valuenow')), {
        timeout: 5_000,
      })
      .toBeGreaterThanOrEqual(27)

    const settledValue = Number(await spinbutton.getAttribute('aria-valuenow'))
    expect(settledValue).toBeGreaterThanOrEqual(27)
    expect(settledValue).toBeLessThanOrEqual(34)

    await assertNoErrors()
  })

  test('physics picker keeps motion continuous while settling into the selected row', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/physics-number-picker')

    const spinbutton = page.getByRole('spinbutton', { name: 'Pace seconds' })
    await expect(spinbutton).toBeVisible()

    const pickerBox = await spinbutton.boundingBox()
    expect(pickerBox).not.toBeNull()
    if (!pickerBox) return

    const samplesPromise = spinbutton.evaluate((element) => {
      return new Promise<number[]>((resolve) => {
        const samples: number[] = []
        const startedAt = performance.now()

        const sample = () => {
          const scrollY = Number(element.getAttribute('data-picker-scroll-y'))
          if (Number.isFinite(scrollY)) samples.push(scrollY)

          if (performance.now() - startedAt >= 620) {
            resolve(samples)
            return
          }

          requestAnimationFrame(sample)
        }

        requestAnimationFrame(sample)
      })
    })

    await page.mouse.move(
      pickerBox.x + pickerBox.width / 2,
      pickerBox.y + pickerBox.height / 2
    )
    await page.mouse.down()
    await page.mouse.move(
      pickerBox.x + pickerBox.width / 2,
      pickerBox.y + pickerBox.height / 2 - 96,
      { steps: 7 }
    )
    await page.mouse.up()

    const samples = await samplesPromise
    const frameDeltas = samples
      .slice(1)
      .map((sample, index) => Math.abs(sample - samples[index]))
    const largestFrameDelta = Math.max(...frameDeltas)

    expect(samples.length).toBeGreaterThanOrEqual(8)
    expect(largestFrameDelta).toBeLessThanOrEqual(24)
    await expect
      .poll(async () => {
        const offset = await spinbutton.evaluate((element) => {
          const selected = element.querySelector<HTMLElement>(
            '[data-picker-selected="true"]'
          )
          if (!selected) return Number.POSITIVE_INFINITY

          const pickerRect = element.getBoundingClientRect()
          const selectedRect = selected.getBoundingClientRect()
          return Math.abs(
            selectedRect.top +
              selectedRect.height / 2 -
              (pickerRect.top + pickerRect.height / 2)
          )
        })

        return offset
      })
      .toBeLessThanOrEqual(1)

    await assertNoErrors()
  })

  test('component preview surface scales down inside a mobile viewport', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/physics-number-picker')

    const surface = page.locator('[data-preview-demo-surface]').first()
    const previewTitle = surface.locator('[data-preview-demo-title]')
    const spinbutton = page.getByRole('spinbutton', { name: 'Pace seconds' })

    await expect(surface).toBeVisible()
    await expect(previewTitle).toBeVisible()
    await expect(spinbutton).toBeVisible()

    const metrics = await surface.evaluate((element) => {
      const title = element.querySelector<HTMLElement>('[data-preview-demo-title]')
      const content = element.querySelector<HTMLElement>('[data-preview-demo-content]')
      const picker = element.querySelector<HTMLElement>('[data-physics-number-picker]')
      const surfaceRect = element.getBoundingClientRect()
      const titleRect = title?.getBoundingClientRect()
      const contentRect = content?.getBoundingClientRect()
      const pickerRect = picker?.getBoundingClientRect()
      const titleStyle = title ? getComputedStyle(title) : null

      return {
        surfaceWidth: surfaceRect.width,
        titleWidth: titleRect?.width ?? 0,
        contentWidth: contentRect?.width ?? 0,
        pickerWidth: pickerRect?.width ?? 0,
        titleFontSize: Number.parseFloat(titleStyle?.fontSize ?? '0'),
      }
    })

    expect(metrics.titleWidth).toBeLessThanOrEqual(metrics.surfaceWidth - 32)
    expect(metrics.contentWidth).toBeLessThanOrEqual(metrics.surfaceWidth - 32)
    expect(metrics.pickerWidth).toBeLessThanOrEqual(112)
    expect(metrics.titleFontSize).toBeLessThanOrEqual(32)
    await assertNoErrors()
  })

  test('component preview frame follows compact mobile preview height', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/placeholders-and-vanish-input')

    const frame = page.locator('[data-component-preview-frame]').first()
    const surface = page.locator('[data-preview-demo-surface]').first()
    await expect(frame).toBeVisible()
    await expect(surface).toBeVisible()

    const frameMetrics = await frame.evaluate((element) => {
      const inner = element.querySelector<HTMLElement>(
        '[data-component-preview-frame-inner]'
      )
      const surface = element.querySelector<HTMLElement>(
        '[data-preview-demo-surface]'
      )
      const frameRect = element.getBoundingClientRect()
      const surfaceRect = surface?.getBoundingClientRect()
      const frameStyle = getComputedStyle(element)
      const innerStyle = inner ? getComputedStyle(inner) : null
      const surfaceStyle = surface ? getComputedStyle(surface) : null

      return {
        frameHeight: frameRect.height,
        frameMinHeight: Number.parseFloat(frameStyle.minHeight),
        innerMinHeight: Number.parseFloat(innerStyle?.minHeight ?? '0'),
        surfaceHeight: surfaceRect?.height ?? 0,
        surfaceMinHeight: Number.parseFloat(surfaceStyle?.minHeight ?? '0'),
      }
    })

    expect(frameMetrics.frameMinHeight).toBe(352)
    expect(frameMetrics.innerMinHeight).toBe(352)
    expect(frameMetrics.surfaceMinHeight).toBe(352)
    expect(frameMetrics.frameHeight).toBeLessThan(448)
    expect(
      Math.abs(frameMetrics.frameHeight - frameMetrics.surfaceHeight)
    ).toBeLessThanOrEqual(2)
    await assertNoErrors()
  })

  test('shiny button keeps its visible preview surface', async ({ page }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })

    await page.goto('/components/shiny-button')
    const shinyButton = page.getByRole('button', { name: /continue/i })
    await expect(shinyButton).toBeVisible()

    const beforeHover = await shinyButton.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        transform: style.transform,
      }
    })
    await shinyButton.hover()
    const afterHover = await shinyButton.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        transform: style.transform,
      }
    })

    expect(afterHover.backgroundColor).toBe(beforeHover.backgroundColor)
    expect(afterHover.transform).toBe(beforeHover.transform)
    await assertNoErrors()
  })

  test('folder preview uses theme color and glass document cards', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/folder')

    const folder = page.locator('[aria-label="Open folder"]').first()
    await expect(folder).toBeVisible()
    await folder.click()
    const openedFolder = page.locator('[aria-label="Close folder"]').first()
    await expect(openedFolder).toHaveAttribute('aria-expanded', 'true')

    const metrics = await openedFolder.evaluate((element) => {
      const front = element.querySelector<HTMLElement>('.z-30')
      const papers = Array.from(element.querySelectorAll<HTMLElement>('.z-20'))

      const probe = document.createElement('span')
      probe.style.color = 'var(--theme-accent-current)'
      document.body.append(probe)
      const themeColor = getComputedStyle(probe).color
      probe.remove()

      const mixedProbe = document.createElement('span')
      mixedProbe.style.color =
        'color-mix(in srgb, var(--theme-accent-current) 64%, #f8fafc)'
      document.body.append(mixedProbe)
      const folderColor = getComputedStyle(mixedProbe).color
      mixedProbe.remove()

      return {
        themeColor,
        folderColor,
        frontColor: front ? getComputedStyle(front).backgroundColor : '',
        frontBorder: front ? getComputedStyle(front).borderColor : '',
        paperCount: papers.length,
        glassPapers: papers.filter((paper) => {
          const style = getComputedStyle(paper)
          return (
            style.backgroundImage.includes('linear-gradient') &&
            style.backdropFilter !== 'none' &&
            style.borderColor.includes('255')
          )
        }).length,
      }
    })

    expect(metrics.frontColor).toBe(metrics.folderColor)
    expect(metrics.frontColor).not.toBe(metrics.themeColor)
    expect(metrics.paperCount).toBe(3)
    expect(metrics.glassPapers).toBe(3)
    await assertNoErrors()
  })

  test('curved loop uses an aurora SVG gradient on the moving text', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/components/curved-loop')

    const surface = page.locator('[data-preview-demo-surface]').first()
    const gradientStops = surface.locator('svg linearGradient[id^="curve-gradient"] stop')
    await expect(gradientStops).toHaveCount(6)

    const textFill = await surface.locator('svg text[fill]').first().getAttribute('fill')
    expect(textFill).toContain('url(#')
    await assertNoErrors()
  })

  test('click spark draws colorful aurora sparks on click', async ({ page }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 900, height: 620 })
    await page.goto('/components/click-spark')

    const root = page.locator('[data-click-spark-root]').first()
    const canvas = page.locator('[data-click-spark-canvas]').first()
    await expect(root).toBeVisible()
    await expect(canvas).toBeVisible()
    await expect
      .poll(() =>
        canvas.evaluate((element) => {
          const canvasElement = element as HTMLCanvasElement
          return canvasElement.width > 0 && canvasElement.height > 0
        })
      )
      .toBe(true)

    const box = await root.boundingBox()
    expect(box).not.toBeNull()
    if (!box) return

    await root.click({ position: { x: box.width * 0.5, y: box.height * 0.54 } })

    await expect
      .poll(() =>
        canvas.evaluate((element) => {
          const canvasElement = element as HTMLCanvasElement
          const context = canvasElement.getContext('2d')
          if (!context) return 0

          const { width, height } = canvasElement
          const data = context.getImageData(0, 0, width, height).data
          const colors = new Set<string>()

          for (let i = 0; i < data.length; i += 16) {
            const alpha = data[i + 3]
            if (alpha > 24) {
              colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`)
            }
          }

          return colors.size
        })
      )
      .toBeGreaterThan(1)
    await assertNoErrors()
  })

  test('particles canvas renders multiple cosmic colors', async ({ page }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 900, height: 620 })
    await page.goto('/components/particles')

    const canvas = page.locator('canvas').first()
    await expect(canvas).toBeVisible()
    await page.waitForTimeout(500)

    const colorCount = await canvas.evaluate((element) => {
      const canvasElement = element as HTMLCanvasElement
      const context = canvasElement.getContext('2d')
      if (!context) return 0

      const { width, height } = canvasElement
      const data = context.getImageData(0, 0, width, height).data
      const colors = new Set<string>()

      for (let i = 0; i < data.length; i += 64) {
        const alpha = data[i + 3]
        if (alpha > 12) {
          const red = Math.round(data[i] / 16) * 16
          const green = Math.round(data[i + 1] / 16) * 16
          const blue = Math.round(data[i + 2] / 16) * 16
          colors.add(`${red},${green},${blue}`)
        }
      }

      return colors.size
    })

    expect(colorCount).toBeGreaterThan(2)
    await assertNoErrors()
  })
})
