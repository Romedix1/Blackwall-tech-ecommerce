import { test, expect } from '@playwright/test'

test.describe('Searching product', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test('Should correctly display found items', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /graphics cards/i }).click()

    const h1Element = page.locator('h1')
    await expect(h1Element).toHaveText(/4 records found/i)

    await page.getByRole('complementary').getByTestId('radio-amd').click()

    await expect(page).toHaveURL(/manufacturer=amd/)
    await expect(h1Element).toHaveText(/1 record found/i)

    await page.getByRole('button', { name: /Reset all filters/i }).click()

    await expect(h1Element).toHaveText(/4 records found/i)

    await page.keyboard.press('/')
    const searchProduct = page
      .getByRole('complementary')
      .getByLabel('Filter products')
    await expect(searchProduct).toBeFocused()

    await searchProduct.fill('40')

    await expect(page).toHaveURL(/search=40/)
    await expect(h1Element).toHaveText(/2 records found/i)
  })

  test('Should display 0 items is price range is invalid', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /peripherals/i }).click()

    const h1Element = page.locator('h1')

    const maxPriceSlider = page
      .getByRole('complementary')
      .getByRole('slider', { name: 'Max price' })

    await maxPriceSlider.focus()

    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('ArrowLeft')
    }

    await expect(maxPriceSlider).toHaveAttribute('aria-valuenow', '50')

    await expect(page).toHaveURL(/priceMax=50/)
    await expect(h1Element).toHaveText(/0 records found/i)
  })
})
