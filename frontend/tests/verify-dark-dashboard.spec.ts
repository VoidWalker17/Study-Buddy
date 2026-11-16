import { test, expect } from '@playwright/test';

test('verify dark mode aesthetic', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // Open Sign in
  await page.locator('button:has-text("Sign in")').first().click();
  await page.waitForSelector('text=Welcome back');

  // Fill in demo credentials
  await page.fill('input#email', 'divyansh@studybuddy.ai');
  await page.fill('input#password', 'Password123!');
  await page.click('button:has-text("Sign In to Dashboard")');

  // Wait for Dashboard to render
  await page.waitForSelector('text=Neural Retention State', { timeout: 10000 });

  // Toggle Dark Mode
  await page.click('button[title*="Toggle theme"], button:has(.lucide-moon), button:has(.lucide-sun)');

  // Wait a moment for dark theme to apply
  await page.waitForTimeout(400);

  // Take screenshot in dark mode
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/dashboard-dark-mode.png',
    fullPage: false
  });
});
