import { expect, test } from './fixtures'

test.describe('dialog', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialog')
  })

  test('dialog renders in portal', async ({ page }) => {
    await expect(page.locator(`[cmdk-dialog]`)).toHaveCount(1)
    await expect(page.locator(`[cmdk-overlay]`)).toHaveCount(1)
  })
})
