import { test, expect } from '@playwright/test'

test.describe('Order placing process (checkout) - Guest', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await page.evaluate(() => window.localStorage.clear())

    await page.reload()
  })

  test('Guest successfully places an order from the homepage', async ({
    page,
  }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /Graphics cards/i }).click()
    await expect(page.getByText('gpu_division')).toBeVisible()

    const RX7900ProductBox = page
      .locator('article')
      .filter({ hasText: 'Radeon RX 7900 XTX Phantom Gaming' })
    const RTX5070ProductBox = page
      .locator('article')
      .filter({ hasText: 'GeForce RTX 5070 Windforce OC' })

    await RX7900ProductBox.getByRole('button', { name: /add to cart/i }).click()
    await RTX5070ProductBox.getByRole('button', {
      name: /add to cart/i,
    }).click()

    const cartButton = page.getByRole('button', { name: 'Open cart' })

    await cartButton.click()

    const RTX5070CartItem = page
      .locator('div')
      .filter({
        has: page.getByRole('heading', {
          name: 'GeForce RTX 5070 Windforce OC',
          level: 5,
        }),
      })
      .last()

    await RTX5070CartItem.getByRole('button', {
      name: '+',
      exact: true,
    }).click()

    await expect(RTX5070CartItem).toContainText('02')
    await expect(page.getByText(/2227.00/)).toBeVisible()

    await page.getByRole('link', { name: /initialize checkout/i }).click()

    const mainContent = page.getByRole('main')

    await expect(
      mainContent.getByText('GeForce RTX 5070 Windforce OC', { exact: true }),
    ).toBeVisible()

    await expect(
      mainContent.getByText('Radeon RX 7900 XTX Phantom Gaming', {
        exact: true,
      }),
    ).toBeVisible()

    await expect(mainContent.getByText(/2227.00/)).toBeVisible()

    await page.getByLabel('Full name').fill('David Martinez')
    await page.getByLabel('Shipping address').fill('Megabuilding H4, Apt 1234')
    await page.getByLabel('City').fill('Night City')
    await page.getByLabel('Zip code').fill('RC-637')
    await page.getByLabel('Email').fill('david.martinez@example.com')
    await page.getByLabel('Phone number').fill('5550198372')

    await page.getByRole('button', { name: /confirm order/i }).click()

    await page.waitForURL(/.*stripe\.com.*/, { timeout: 15_000 })

    await page.getByRole('radio', { name: 'Card' }).click({ force: true })

    await page.getByLabel('Card number').fill('4242424242424242')
    await page.getByLabel('Expiration').fill('02/36')
    await page.getByRole('textbox', { name: 'CVC' }).fill('222')
    await page.getByLabel('Cardholder name').fill('David Martinez')

    await page.getByTestId('hosted-payment-submit-button').click()

    await page.waitForURL(/\/checkout\/success\?session_id=.+/, {
      timeout: 15_000,
    })

    await expect(page.getByText(/Transaction_authorized/i)).toBeVisible()
  })

  test('Should handle declined card payment on Stripe', async ({ page }) => {
    test.setTimeout(70_000)
    await page.goto('/')

    await page.getByRole('link', { name: /Graphics cards/i }).click()
    await expect(page.getByText('gpu_division')).toBeVisible()

    const RX7900ProductBox = page
      .locator('article')
      .filter({ hasText: 'Radeon RX 7900 XTX Phantom Gaming' })
    const RTX5070ProductBox = page
      .locator('article')
      .filter({ hasText: 'GeForce RTX 5070 Windforce OC' })

    await RX7900ProductBox.getByRole('button', { name: /add to cart/i }).click()
    await RTX5070ProductBox.getByRole('button', {
      name: /add to cart/i,
    }).click()

    const cartButton = page.getByRole('button', { name: 'Open cart' })

    await cartButton.click()

    const RTX5070CartItem = page
      .locator('div')
      .filter({
        has: page.getByRole('heading', {
          name: 'GeForce RTX 5070 Windforce OC',
          level: 5,
        }),
      })
      .last()

    await RTX5070CartItem.getByRole('button', {
      name: '+',
      exact: true,
    }).click()

    await expect(RTX5070CartItem).toContainText('02')
    await expect(page.getByText(/2227.00/)).toBeVisible()

    await page.getByRole('link', { name: /initialize checkout/i }).click()

    const mainContent = page.getByRole('main')

    await expect(
      mainContent.getByText('GeForce RTX 5070 Windforce OC', { exact: true }),
    ).toBeVisible()

    await expect(
      mainContent.getByText('Radeon RX 7900 XTX Phantom Gaming', {
        exact: true,
      }),
    ).toBeVisible()

    await expect(mainContent.getByText(/2227.00/)).toBeVisible()

    await page.getByLabel('Full name').fill('David Martinez')
    await page.getByLabel('Shipping address').fill('Megabuilding H4, Apt 1234')
    await page.getByLabel('City').fill('Night City')
    await page.getByLabel('Zip code').fill('RC-637')
    await page.getByLabel('Email').fill('david.martinez@example.com')
    await page.getByLabel('Phone number').fill('5550198372')

    await page.getByRole('button', { name: /confirm order/i }).click()

    await page.waitForURL(/.*stripe\.com.*/, { timeout: 15_000 })

    await page
      .getByRole('radio', { name: 'US bank account' })
      .click({ force: true })

    await page.getByRole('button', { name: 'Test (Non-OAuth)' }).click()
    await page.waitForTimeout(1000)

    const stripeModalFrame = page.locator('iframe').first().contentFrame()

    await stripeModalFrame
      .getByRole('button', { name: 'Agree and continue' })
      .click()

    await stripeModalFrame.getByRole('button', { name: 'Failure' }).click()

    await stripeModalFrame
      .getByRole('button', { name: 'Connect account' })
      .click()

    await stripeModalFrame
      .getByRole('button', { name: 'Finish without saving' })
      .click()

    await stripeModalFrame
      .getByRole('button', { name: 'Continue to New business sandbox' })
      .click()

    await page.locator('#billingName').fill('David Martinez')

    await page.getByTestId('hosted-payment-submit-button').click()

    await expect(page.getByText(/Transaction_processing/i)).toBeVisible()

    await page.waitForURL(/\/checkout\/success\?session_id=.+/, {
      timeout: 15_000,
    })

    await expect(page.getByText(/Transaction_failed/i)).toBeVisible({
      timeout: 25_000,
    })
  })
})

test.describe('Order placing process (checkout) - Logged In', () => {
  test.use({ storageState: 'playwright/.auth/user.json' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await page.getByRole('button', { name: 'Open cart' }).click()

    const removeButtons = page.locator('button', {
      hasText: /remove/i,
    })

    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click()
      await page.waitForTimeout(300)
    }

    await page.waitForTimeout(2000)
  })

  test('Logged user successfully places an order from the homepage', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Peripherals/i }).click()

    const Aerox5ProductBox = page
      .locator('article')
      .filter({ hasText: 'SteelSeries Aerox 5 Wired' })

    await Aerox5ProductBox.getByRole('button', { name: /add to cart/i }).click()

    const cartButton = page.getByRole('button', { name: 'Open cart' })

    await cartButton.click()

    const Aerox5CartItem = page
      .locator('div')
      .filter({
        has: page.getByRole('heading', {
          name: 'SteelSeries Aerox 5 Wired',
          level: 5,
        }),
      })
      .last()

    const Aerox5PlusButton = Aerox5CartItem.getByRole('button', {
      name: '+',
      exact: true,
    })

    await page.waitForTimeout(400)

    await Aerox5PlusButton.click()
    await Aerox5PlusButton.click()
    await Aerox5PlusButton.click()

    await expect(Aerox5CartItem).toContainText('04')
    await expect(page.getByText(/316.00/)).toBeVisible()

    await page.getByRole('link', { name: /initialize checkout/i }).click()

    const mainContent = page.getByRole('main')

    await expect(
      mainContent.getByText('SteelSeries Aerox 5 Wired', { exact: true }),
    ).toBeVisible()

    const uplinkSection = mainContent
      .locator('div')
      .filter({ hasText: /Uplink authorization/i })
    await expect(uplinkSection.getByText(/316.00/).first()).toBeVisible()

    await expect(page.getByLabel('Shipping address')).toHaveValue(
      'Address test',
    )
    await expect(page.getByLabel('Email')).toHaveValue(
      'test.user@blackwall.com',
    )
    await expect(page.getByLabel('City')).toHaveValue('City test')
    await expect(page.getByLabel('Zip code')).toHaveValue('12-345')

    await page.getByLabel('Full name').fill('Test user')
    await page.getByLabel('Phone number').fill('111222333')

    await page.getByRole('button', { name: /confirm order/i }).click()

    await page.waitForURL(/.*stripe\.com.*/, { timeout: 15_000 })

    await page.getByRole('radio', { name: 'Card' }).click({ force: true })

    await page.getByLabel('Card number').fill('4242424242424242')
    await page.getByLabel('Expiration').fill('02/36')
    await page.getByRole('textbox', { name: 'CVC' }).fill('222')
    await page.getByLabel('Cardholder name').fill('Test user')

    await page.getByTestId('hosted-payment-submit-button').click()

    await page.waitForURL(/\/checkout\/success\?session_id=.+/, {
      timeout: 15_000,
    })

    await expect(page.getByText(/Transaction_authorized/i)).toBeVisible()
  })
})
