import { expect, test } from '@playwright/test'

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

test.describe('scroll behavior', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scroll')
  })

  test('does not hijack page scroll', async ({ page }) => {
    const scrollable = await page.getByTestId('scrollable')
    const toggle = await page.getByTestId('toggle')

    await page.getByRole('option', { name: 'Lemon' }).isVisible()

    await sleep(1)

    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))

    await toggle.click()
    await toggle.click()

    await expect(scrollable).not.toBeInViewport()

    const isScrolledDown = await page.evaluate(() => {
      const scrollable = document.querySelector('[data-testid="scrollable"]')
      if (!scrollable) return false
      return scrollable.scrollHeight - scrollable.scrollTop === scrollable.clientHeight
    })

    await expect(isScrolledDown).toBe(true)
  })
})
