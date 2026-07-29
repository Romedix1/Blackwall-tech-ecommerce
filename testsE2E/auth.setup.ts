import { test as setup, expect } from '@playwright/test'
import fs from 'fs'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile)
    const ageMinutes = (Date.now() - stats.mtimeMs) / 1000 / 60

    if (ageMinutes < 30) {
      console.log('Reusing existing auth state, skipping login')
      return
    }
  }

  await page.goto('/login')

  await page.getByLabel('Email').fill('test.user@blackwall.com')
  await page.getByLabel('Password').fill('TestBlackwallUser!1')
  await page.getByRole('button', { name: 'login' }).click()

  await expect(page).toHaveURL('/')

  await page.context().storageState({ path: authFile })
})
