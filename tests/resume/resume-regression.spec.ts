import path from 'node:path'
import { expect, test } from '@playwright/test'
import {
  RESUME_A4_HEIGHT_PT,
  RESUME_A4_WIDTH_PT,
  RESUME_DOCUMENT_WIDTH,
  RESUME_PDF_PAGE_COUNT,
} from '../../src/features/resume/constants'
import {
  extractPdfText,
  readPdfInfo,
  readPdfLinkAnnotationsByPage,
  readPdfLinkUrisByPage,
  readPngHasNonWhitePixels,
  readPngSize,
  renderPdfToPngs,
} from './pdf-inspection'

const expectedLinkUris = [
  'https://github.com/windragon0807',
  'https://ryong.blog/',
]

async function waitForResumeAssets(page: import('@playwright/test').Page) {
  await page.goto('/resume')
  await page.locator('[data-resume-document]').waitFor({ state: 'visible' })
  await page.evaluate(async () => {
    await document.fonts?.ready

    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener('error', () => resolve(), { once: true })
            })
        )
    )
  })
}

test.describe('resume PDF regression', () => {
  test('keeps the current resume document inside the 4-page PDF bounds', async ({
    page,
  }) => {
    await waitForResumeAssets(page)

    const metrics = await page.locator('[data-resume-document]').evaluate(
      (element, documentWidth) => {
        const rect = element.getBoundingClientRect()
        const sourcePageHeight = (documentWidth * 841.89) / 595.28

        return {
          renderedWidth: rect.width,
          sourceWidth: (element as HTMLElement).offsetWidth,
          scrollHeight: element.scrollHeight,
          scrollWidth: element.scrollWidth,
          sourcePageHeight,
          viewportWidth: document.documentElement.clientWidth,
        }
      },
      RESUME_DOCUMENT_WIDTH
    )

    expect(metrics.renderedWidth).toBeGreaterThanOrEqual(RESUME_DOCUMENT_WIDTH)
    expect(metrics.sourceWidth).toBe(RESUME_DOCUMENT_WIDTH)
    expect(metrics.scrollWidth).toBeLessThanOrEqual(RESUME_DOCUMENT_WIDTH + 1)
    expect(metrics.scrollHeight).toBeLessThanOrEqual(
      Math.ceil(metrics.sourcePageHeight * RESUME_PDF_PAGE_COUNT)
    )
    expect(metrics.viewportWidth).toBeGreaterThan(0)
  })

  test('downloads a 4-page A4 PDF with clickable profile links', async ({
    page,
  }, testInfo) => {
    await waitForResumeAssets(page)

    const expectedLinkRectsByHref = await page
      .locator('[data-resume-document]')
      .evaluate(
        (
          element,
          {
            a4Height,
            a4Width,
            documentWidth,
          }: { a4Height: number; a4Width: number; documentWidth: number }
        ) => {
          const elementRect = element.getBoundingClientRect()
          const sourceScaleX = documentWidth / elementRect.width
          const sourceScaleY = element.scrollHeight / elementRect.height
          const sourcePageHeight = (documentWidth * a4Height) / a4Width
          const sourceToPdfScale = a4Width / documentWidth
          const entries = Array.from(
            element.querySelectorAll<HTMLAnchorElement>('a[data-resume-pdf-link]')
          ).map((anchor) => {
            const anchorRect = anchor.getBoundingClientRect()
            const sourceX = (anchorRect.left - elementRect.left) * sourceScaleX
            const sourceY = (anchorRect.top - elementRect.top) * sourceScaleY
            const sourceWidth = anchorRect.width * sourceScaleX
            const sourceHeight = anchorRect.height * sourceScaleY
            const pageIndex = Math.floor(sourceY / sourcePageHeight)
            const localSourceY = sourceY - pageIndex * sourcePageHeight

            return [
              anchor.dataset.resumePdfLink ?? anchor.href,
              {
                pageIndex,
                rect: [
                  sourceX * sourceToPdfScale,
                  a4Height - (localSourceY + sourceHeight) * sourceToPdfScale,
                  (sourceX + sourceWidth) * sourceToPdfScale,
                  a4Height - localSourceY * sourceToPdfScale,
                ],
              },
            ] as const
          })

          return Object.fromEntries(entries)
        },
        {
          a4Height: RESUME_A4_HEIGHT_PT,
          a4Width: RESUME_A4_WIDTH_PT,
          documentWidth: RESUME_DOCUMENT_WIDTH,
        }
      )

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'PDF 다운로드' }).click()
    const download = await downloadPromise
    const pdfPath = path.join(testInfo.outputDir, 'jung-seungryong-resume.pdf')

    await download.saveAs(pdfPath)

    const pdfInfo = await readPdfInfo(pdfPath)
    expect(pdfInfo.pages).toBe(RESUME_PDF_PAGE_COUNT)
    expect(pdfInfo.pageSizeText).toContain(`${RESUME_A4_WIDTH_PT}`)
    expect(pdfInfo.pageSizeText).toContain(`${RESUME_A4_HEIGHT_PT}`)

    const linkUrisByPage = await readPdfLinkUrisByPage(pdfPath)
    expect(linkUrisByPage[0]).toEqual(expect.arrayContaining(expectedLinkUris))
    expect(linkUrisByPage.slice(1).flat()).toHaveLength(0)

    const linkAnnotationsByPage = await readPdfLinkAnnotationsByPage(pdfPath)
    const firstPageAnnotations = linkAnnotationsByPage[0]
    expect(firstPageAnnotations).toHaveLength(2)

    firstPageAnnotations.forEach((annotation) => {
      const expectedAnnotation = expectedLinkRectsByHref[annotation.uri]

      expect(expectedAnnotation?.pageIndex).toBe(0)
      expect(annotation.newWindow).toBe(true)
      expect(annotation.rect).not.toBeNull()
      expect(annotation.rect?.[0]).toBeGreaterThanOrEqual(0)
      expect(annotation.rect?.[1]).toBeGreaterThanOrEqual(0)
      expect(annotation.rect?.[2]).toBeLessThanOrEqual(RESUME_A4_WIDTH_PT)
      expect(annotation.rect?.[3]).toBeLessThanOrEqual(RESUME_A4_HEIGHT_PT)

      annotation.rect?.forEach((value, index) => {
        expect(value).toBeCloseTo(expectedAnnotation.rect[index], 1)
      })
    })

    const extractedText = await extractPdfText(pdfPath)
    expect(extractedText).toContain('정승룡')
    expect(extractedText).toContain('TOPIA Live')
    expect(extractedText).toContain('Network Waterfall')
    expect(extractedText).toContain('github.com/windragon0807')

    const renderedPages = await renderPdfToPngs({
      outputPrefix: path.join(testInfo.outputDir, 'rendered', 'page'),
      pdfPath,
    })

    expect(renderedPages).toHaveLength(RESUME_PDF_PAGE_COUNT)

    for (const actualPath of renderedPages) {
      const size = await readPngSize(actualPath)

      expect(size.width).toBeGreaterThan(1100)
      expect(size.height).toBeGreaterThan(1600)
      await expect(readPngHasNonWhitePixels(actualPath)).resolves.toBe(true)
    }
  })

  test('keeps searchable links when worker APIs are unavailable', async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'Worker', {
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(window, 'OffscreenCanvas', {
        configurable: true,
        value: undefined,
      })
      Object.defineProperty(window, 'createImageBitmap', {
        configurable: true,
        value: undefined,
      })
    })
    await waitForResumeAssets(page)

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'PDF 다운로드' }).click()
    const download = await downloadPromise
    const pdfPath = path.join(
      testInfo.outputDir,
      'jung-seungryong-resume-fallback.pdf'
    )

    await download.saveAs(pdfPath)

    const pdfInfo = await readPdfInfo(pdfPath)
    expect(pdfInfo.pages).toBe(RESUME_PDF_PAGE_COUNT)

    const linkUrisByPage = await readPdfLinkUrisByPage(pdfPath)
    expect(linkUrisByPage[0]).toEqual(expect.arrayContaining(expectedLinkUris))

    const extractedText = await extractPdfText(pdfPath)
    expect(extractedText).toContain('정승룡')
    expect(extractedText).toContain('TOPIA Live')
  })
})

test.describe('resume readable view', () => {
  test('is discoverable from the PDF preview shell', async ({ page }) => {
    await waitForResumeAssets(page)

    await expect(
      page.getByRole('link', { name: '읽기용 이력서 보기' })
    ).toHaveAttribute('href', '/resume/readable')
  })

  test('renders a separated readable route without changing the PDF route', async ({
    page,
  }) => {
    await page.goto('/resume/readable')

    await expect(page.getByRole('heading', { name: '정승룡' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '경력' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '프로젝트' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /github\.com\/windragon0807/i })
    ).toHaveAttribute('href', 'https://github.com/windragon0807')
    await expect(page.getByRole('link', { name: /ryong\.blog/i })).toHaveAttribute(
      'href',
      'https://ryong.blog/'
    )

    const width = await page.locator('[data-resume-readable-document]').evaluate(
      (element) => element.getBoundingClientRect().width
    )

    expect(width).toBeLessThanOrEqual(1000)
  })
})
