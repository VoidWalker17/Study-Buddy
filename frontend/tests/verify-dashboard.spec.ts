import { test, expect } from '@playwright/test';

test('verify complete login to dashboard flow', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // Click Sign in
  await page.locator('button:has-text("Sign in")').first().click();
  await page.waitForSelector('text=Welcome back');

  // Fill in demo credentials
  await page.fill('input#email', 'divyansh@studybuddy.ai');
  await page.fill('input#password', 'Password123!');

  // Click Sign In
  await page.click('button:has-text("Sign In to Dashboard")');

  // Wait for Dashboard to render with user greeting
  await page.waitForSelector('text=Welcome back, Divyansh!', { timeout: 10000 });
  await expect(page.locator('text=Welcome back, Divyansh!')).toBeVisible();

  // Take screenshot of authenticated Dashboard
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/dashboard-authenticated.png',
    fullPage: false
  });
});
