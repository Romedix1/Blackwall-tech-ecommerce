import { test, expect, Page } from '@playwright/test'

test.describe('PC builder', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /testuser/i }).click()

    await page
      .getByRole('link', { name: /Dashboard/i })
      .filter({ visible: true })
      .click()
    await page.getByRole('link', { name: /Saved builds/ }).click()

    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /testuser/i }).click()

    const wipeButtons = page.getByRole('button', { name: /Delete build/i })
    console.log(wipeButtons)
    while ((await wipeButtons.count()) > 0) {
      await wipeButtons.first().click()

      const wipeModal = page.getByRole('alertdialog')

      await wipeModal.getByRole('button', { name: /Confirm delete/i }).click()

      await expect(wipeModal).toBeHidden()
    }

    const removeButtons = page.locator('button', {
      hasText: /remove/i,
    })

    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click()
      await page.waitForTimeout(300)
    }

    await page.waitForTimeout(2000)
  })

  test('Should display success information if all components are correctly matched', async ({
    page,
  }) => {
    test.setTimeout(40_000)

    await page.goto('/')

    await page.getByRole('button', { name: /start configuration/i }).click()

    const powerStatus = page.getByTestId('power-status-bar')
    const statusInformation = page.getByTestId('system-status')
    const priceBox = page.getByTestId('price-information')

    const sideBar = page.getByRole('complementary')

    async function selectProduct(
      page: Page,
      productName: string,
      quantity?: number,
    ) {
      const box = page.locator('article').filter({ hasText: productName })
      await box.getByRole('button', { name: /select part/i }).click()

      if (quantity) {
        for (let i = 0; i < quantity - 1; i++) {
          await box.getByRole('button', { name: '+' }).click()
        }
      }

      await page.waitForTimeout(2000)
    }

    async function checkStatuses(
      power: RegExp,
      price: RegExp,
      information: string | RegExp = /awaiting_critical_components/i,
    ) {
      await expect(powerStatus).toHaveText(power)
      await expect(statusInformation).toHaveText(information)
      await expect(priceBox).toHaveText(price)
    }

    // CPU
    await selectProduct(page, 'Intel Core Ultra 9 285K')
    await checkStatuses(/125W\s\/\s0W/, /629.00/)

    // MOTHERBOARDS
    await sideBar.getByRole('link', { name: /motherboard/i }).click()
    await expect(page).toHaveURL(/motherboards/)

    await selectProduct(page, 'ASRock Z890 Taichi Lite')
    await checkStatuses(/175W\s\/\s0W/, /1028.00/)

    // GPU
    await sideBar.getByRole('link', { name: /graphics/i }).click()
    await expect(page).toHaveURL(/gpu/)

    await selectProduct(page, 'GeForce RTX 4090 Phantom')
    await checkStatuses(/625W\s\/\s0W/, /2727.00/)

    // RAM
    await sideBar.getByRole('link', { name: /select ram/i }).click()
    await expect(page).toHaveURL(/memory/)

    await selectProduct(page, 'T-Force XTREEM DDR5 White', 2)
    await checkStatuses(/635W\s\/\s0W/, /3505.00/)

    // STORAGE
    await sideBar.getByRole('link', { name: /storage/i }).click()
    await expect(page).toHaveURL(/storage/)

    await selectProduct(page, 'Crucial T705 Gen5')
    await checkStatuses(/645W\s\/\s0W/, /3744.00/)

    // PSU
    await sideBar.getByRole('link', { name: /power supply/i }).click()
    await expect(page).toHaveURL(/psu/)

    await selectProduct(page, 'EVGA SuperNOVA 1000 G7')
    await checkStatuses(/645W\s\/\s1000W/, /3933.00/, /system stable/i)
  })
})
