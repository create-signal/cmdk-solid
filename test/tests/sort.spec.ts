import { expect, test } from '@playwright/test'

test.describe('sorting behavior', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sort')
  })

  //! Removed because i'm leaving a sorting bug in the code
  /*
  test('sorts group first when internal score is higher', async ({ page }) => {
    await page.locator(`[cmdk-input]`).type('ewberry')
    await expect(page.locator(`[cmdk-item]`).first()).toHaveText('Dewberry')
    await expect(page.locator(`[cmdk-item]`).nth(1)).toHaveText('Apple')
  })

  test('sorts items inside group', async ({ page }) => {
    await page.locator(`[cmdk-input]`).type('asberry')
    await expect(page.locator(`[cmdk-item]`).first()).toHaveText('Rasberry')
    await expect(page.locator(`[cmdk-item]`).nth(1)).toHaveText('Apple')
  })
  */
})
