import { test, expect, APIRequestContext } from '@playwright/test'

test.describe('User dashboard', () => {
  async function resetUser(request: APIRequestContext, options = {}) {
    if (!process.env.TEST_USER_ID) {
      throw new Error('Missing TEST_USER_ID. Check playwright config')
    }

    const response = await request.post('/api/e2e-reset', {
      data: { userId: process.env.TEST_USER_ID, ...options },
    })

    if (!response.ok()) {
      const errorText = await response.text()
      throw new Error(`API error, Status: ${response.status()} - ${errorText}`)
    }
  }

  test('Should correctly update username', async ({ page, request }) => {
    await resetUser(request, {
      resetUsername: true,
    })

    await page.goto('/')

    await page.getByRole('button', { name: /testuser/i }).click()

    await page
      .getByRole('link', { name: /Dashboard/i })
      .filter({ visible: true })
      .click()
    await page.getByRole('link', { name: /settings/i }).click()

    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /testuser/i }).click()

    const usernameInput = page.getByRole('textbox', {
      name: /change username/i,
    })
    await usernameInput.fill('changedUser')

    await page.getByRole('button', { name: /change username/i }).click()

    const successAlert = page.getByText(/identity recalibrated/i)
    await expect(successAlert).toBeVisible()

    await page.reload()

    const nav = page.getByRole('navigation', { name: 'Main navigation' })

    await expect(nav).toHaveText(/changedUser/i)
  })

  test('Should correctly update user address', async ({ page, request }) => {
    await resetUser(request, { resetAddress: true })

    await page.goto('/')

    await page.getByRole('button', { name: /testuser/i }).click()

    await page
      .getByRole('link', { name: /Dashboard/i })
      .filter({ visible: true })
      .click()
    await page.getByRole('link', { name: /settings/i }).click()

    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /testuser/i }).click()

    const addressInput = page.getByRole('textbox', {
      name: /Shipping address/i,
    })
    const cityInput = page.getByRole('textbox', {
      name: /city/i,
    })
    const zipCodeInput = page.getByRole('textbox', {
      name: /zip code/i,
    })

    await addressInput.fill('Address test')
    await cityInput.fill('City test')
    await zipCodeInput.fill('12-345')

    await page.getByRole('button', { name: 'Update data' }).click()

    const successAlert = page.getByText('Address updated')
    await expect(successAlert).toBeVisible()
  })

  test('Should correctly update user password', async ({ page, request }) => {
    await resetUser(request, { resetPassword: true })

    await page.goto('/')

    await page.getByRole('button', { name: /testuser/i }).click()

    await page
      .getByRole('link', { name: /Dashboard/i })
      .filter({ visible: true })
      .click()
    await page.getByRole('link', { name: /settings/i }).click()

    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /testuser/i }).click()

    await page.getByRole('button', { name: /Change password/i }).click()

    expect(page.getByRole('dialog')).toBeVisible()

    const currentPasswordInput = page.getByRole('textbox', {
      name: 'Current password',
      exact: true,
    })
    const newPasswordInput = page.getByRole('textbox', {
      name: 'New password',
      exact: true,
    })
    const confirmPasswordInput = page.getByRole('textbox', {
      name: 'Confirm new password',
      exact: true,
    })

    await currentPasswordInput.fill('TestBlackwallUser!1')
    await newPasswordInput.fill('TestBlackwallUser!2')
    await confirmPasswordInput.fill('TestBlackwallUser!2')

    await page.getByRole('button', { name: /Confirm password change/i }).click()

    const successAlert = page.getByText(/Uplink initiated/i)
    await expect(successAlert).toBeVisible()

    await page.waitForTimeout(2000)
    await resetUser(request, { resetPassword: true })
  })
})
