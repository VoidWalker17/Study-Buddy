import { test, expect } from '@playwright/test';

test('capture auth screen with aesthetic sculpture and duplicate error handling', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // Click Sign In in the top navigation
  const signInBtn = page.locator('button:has-text("Sign in")').first();
  await signInBtn.click();
  await page.waitForSelector('text=Study Buddy');

  // Verify the aesthetic 3D sculpture image is mounted and loaded
  const sculptureImg = page.locator('img[alt="Study Buddy Neural Kinetic Sculpture"]');
  await expect(sculptureImg).toBeVisible();

  // Take screenshot of Sign In view
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/auth-signin-view.png',
    fullPage: false
  });

  // Switch to Create Account mode
  await page.click('button:has-text("Create Account")');

  // Fill in form with the existing email as in user screenshot
  await page.fill('input#name', 'Divyansh Agarwal');
  await page.fill('input#email', 'divyansh@studybuddy.ai');
  await page.fill('input#password', 'Password123!');

  // Submit registration
  await page.click('button[type="submit"]');

  // Wait for the clear, friendly error banner
  const errorBanner = page.locator('text=already exists');
  await expect(errorBanner).toBeVisible({ timeout: 7000 });

  // Take screenshot of the friendly duplicate message with switch button
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/auth-duplicate-view.png',
    fullPage: false
  });

  // Click Switch to Sign In button
  await page.click('button:has-text("Switch to Sign In →")');

  // Ensure switched to Sign In smoothly
  await expect(page.locator('text=Welcome back')).toBeVisible();

  // Take screenshot of smooth transition
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/auth-switched-view.png',
    fullPage: false
  });
});
