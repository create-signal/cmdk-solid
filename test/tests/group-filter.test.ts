import { expect, test } from '@playwright/test'

test.describe('group filters', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/group-filter')
  })

  test('search results stay in sync with term', async ({ page }) => {
    await page.locator(`[cmdk-input]`).fill('bar')
    await expect(page.locator(`[cmdk-item][data-value="Installation"]`)).not.toBeVisible()
    await expect(page.locator(`[cmdk-item][data-value="Bar List"]`)).toBeVisible()
    await page.locator(`[cmdk-input]`).fill('ba')
    await expect(page.locator(`[cmdk-item][data-value="About"]`)).toBeVisible()
  })
})
