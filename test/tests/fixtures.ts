import { test as base } from '@playwright/test'

/**
 * The pages are server rendered, so their markup — and Playwright's
 * actionability checks — are satisfied before the client has hydrated and
 * attached event handlers. Interacting in that window silently drops the
 * event, so every navigation waits for the app to signal that it is hydrated.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page)

    page.goto = async (url, options) => {
      const response = await goto(url, options)
      await page.waitForSelector('html[data-hydrated="true"]', { state: 'attached' })
      return response
    }

    await use(page)
  },
})

export { expect } from '@playwright/test'
