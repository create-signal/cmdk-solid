import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['json', { outputFile: 'playwright-report.json' }]] : 'list',
  testDir: './test/tests',
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
  },
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  ...(!process.env.CI && { workers: 1 }),
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    cwd: './test',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}

export default config
