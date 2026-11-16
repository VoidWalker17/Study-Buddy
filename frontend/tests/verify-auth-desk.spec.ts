import { test, expect } from '@playwright/test';

test('verify updated navbar and study desk auth modal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // 1. Capture the sleek updated navbar
  const nav = page.locator('header.ttl-nav');
  await expect(nav).toBeVisible();
  await expect(nav.locator('button:has-text("How It Works")')).toBeVisible();
  await expect(nav.locator('a.ttl-nav-link:has-text("Methodology")')).toBeVisible();
  await expect(nav.locator('a.ttl-nav-link:has-text("Architecture")')).toBeVisible();
  await expect(nav.locator('a.ttl-nav-link:has-text("Research")')).toBeVisible();

  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/navbar-updated.png',
    clip: { x: 0, y: 0, width: 1440, height: 80 }
  });

  // 2. Click Sign In in the top navigation to open the split auth modal
  await page.locator('header.ttl-nav button:has-text("Sign in")').first().click();
  await page.waitForSelector('text=Welcome back');

  // Verify the new study desk image is mounted and visible
  const deskImg = page.locator('img[alt="Study Buddy — Learn smarter. Achieve more."]');
  await expect(deskImg).toBeVisible();

  // 3. Capture the auth modal with the new desk photo matching the user's reference mockup
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/auth-study-desk-view.png',
    fullPage: false
  });
});
