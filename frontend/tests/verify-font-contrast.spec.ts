
import { test, expect } from '@playwright/test';

test('verify font visibility in light mode and dark mode under system dark preference', async ({ page }) => {
  // Emulate system dark mode (which previously caused Tailwind v4 to leak dark:text-white)
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 1440, height: 950 });

  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // Open Sign in
  await page.locator('header.ttl-nav button:has-text("Sign in")').first().click();
  await page.waitForSelector('text=Welcome back');

  await page.fill('input#email', 'divyansh@studybuddy.ai');
  await page.fill('input#password', 'Password123!');
  await page.click('button:has-text("Sign In to Dashboard")');

  // Wait for Dashboard
  await page.waitForSelector('text=Learning Dashboard');
  const welcomeHeading = page.locator('h1:has-text("Welcome back, Divyansh")');
  await expect(welcomeHeading).toBeVisible();

  // Capture screenshot of Dashboard in light mode under OS dark setting
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/verified-font-visibility-light.png',
    fullPage: false
  });

  // Now click toggle theme to test actual dark mode
  await page.locator('button[title*="theme"], button[aria-label*="theme"], button:has(svg.lucide-moon), button:has(svg.lucide-sun)').first().click();
  await page.waitForTimeout(400);

  // Capture screenshot of Dashboard in actual dark mode
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/verified-font-visibility-dark.png',
    fullPage: false
  });
});
