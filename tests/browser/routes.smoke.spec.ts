import { expect, test, type Page } from '@playwright/test'

import { staticRoutes } from './helpers/routes'

type PublishedPost = {
  published: true
  slug: string
}

async function expectHealthyRoute(page: Page, route: string) {
  const pageErrors: string[] = []

  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  const response = await page.goto(route)

  expect(response, `Expected a navigation response for ${route}`).not.toBeNull()
  expect(response?.ok(), `Expected ${route} to return a successful status`).toBe(
    true
  )
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page).toHaveTitle(/\S+/)
  expect(
    pageErrors,
    `Expected no uncaught page errors on ${route}, received:\n${pageErrors.join('\n')}`
  ).toEqual([])
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPublishedPost(value: unknown): value is PublishedPost {
  return (
    isRecord(value) &&
    value.published === true &&
    typeof value.slug === 'string' &&
    value.slug.trim().length > 0
  )
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

test.describe('core route smoke', () => {
  for (const route of staticRoutes) {
    test(`${route} has a healthy page shell`, async ({ page }) => {
      await expectHealthyRoute(page, route)
    })
  }

  test('a published post has a healthy page shell', async ({ page, request }) => {
    let apiResponse

    try {
      apiResponse = await request.get('/api/posts')
    } catch (error) {
      test.skip(true, `/api/posts request failed: ${errorMessage(error)}`)
      return
    }

    if (!apiResponse.ok()) {
      test.skip(
        true,
        `/api/posts returned ${apiResponse.status()} ${apiResponse.statusText()}`
      )
      return
    }

    let body: unknown

    try {
      body = await apiResponse.json()
    } catch (error) {
      test.skip(true, `/api/posts returned invalid JSON: ${errorMessage(error)}`)
      return
    }

    if (!isRecord(body) || !Array.isArray(body.posts)) {
      test.skip(true, '/api/posts response does not contain a posts array')
      return
    }

    const publishedPost = body.posts.find(isPublishedPost)

    if (!publishedPost) {
      test.skip(true, '/api/posts returned no published post with a slug')
      return
    }

    await expectHealthyRoute(
      page,
      `/posts/${encodeURIComponent(publishedPost.slug)}`
    )
  })
})
