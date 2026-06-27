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

  test('gooey input and shiny button keep their visible preview surfaces', async ({
    page,
  }) => {
    const assertNoErrors = await expectNoConsoleErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })

    await page.goto('/components/gooey-input')
    const gooeyButton = page.getByRole('button', { name: /search something/i })
    await expect(gooeyButton).toBeVisible()
    await expect(gooeyButton).toHaveCSS('opacity', '1')

    const gooeyMetrics = await gooeyButton.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      const surface = element.closest('[data-preview-demo-surface]')
      const filterWrap = surface?.querySelector<HTMLElement>('[data-gooey-filter-wrap]')

      return {
        width: rect.width,
        height: rect.height,
        filter: filterWrap ? getComputedStyle(filterWrap).filter : '',
        backgroundColor: style.backgroundColor,
        color: style.color,
      }
    })

    expect(gooeyMetrics.width).toBeGreaterThan(390)
    expect(gooeyMetrics.height).toBeGreaterThan(44)
    expect(gooeyMetrics.filter).toContain('url(')
    expect(gooeyMetrics.backgroundColor).not.toBe('rgb(255, 255, 255)')
    expect(gooeyMetrics.color).toContain('/ 0.75')

    await gooeyButton.click()
    await expect(page.getByPlaceholder('Search Something')).toBeVisible()
    await page.waitForTimeout(450)
    const expandedGooeyMetrics = await page
      .locator('[data-preview-demo-surface]')
      .first()
      .evaluate((surface) => {
        const trigger = surface.querySelector<HTMLElement>('[data-gooey-trigger]')
        const bubble = surface.querySelector<HTMLElement>('[data-gooey-bubble]')
        const triggerRect = trigger?.getBoundingClientRect()
        const bubbleRect = bubble?.getBoundingClientRect()

        return {
          triggerWidth: triggerRect?.width ?? 0,
          bubbleWidth: bubbleRect?.width ?? 0,
          gap: triggerRect && bubbleRect ? triggerRect.left - bubbleRect.right : 0,
        }
      })

    expect(expandedGooeyMetrics.triggerWidth).toBeGreaterThan(360)
    expect(expandedGooeyMetrics.bubbleWidth).toBeGreaterThan(40)
    expect(expandedGooeyMetrics.gap).toBeGreaterThan(0)

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
