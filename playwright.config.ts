import { defineConfig, devices } from '@playwright/test'

const startServer = process.env.RESUME_TEST_START_SERVER === '1'
const port = process.env.PORT ?? '3200'
const baseURL = process.env.RESUME_TEST_BASE_URL ?? `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests/resume',
  fullyParallel: false,
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  reporter: [['list']],
  outputDir: 'test-results/resume',
  webServer: startServer
    ? {
        command: `pnpm exec next dev -p ${port}`,
        reuseExistingServer: true,
        timeout: 120_000,
        url: baseURL,
      }
    : undefined,
})
