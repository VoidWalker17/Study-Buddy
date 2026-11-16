import { test, expect } from '@playwright/test';

test.describe('Study Buddy Feynman Workflow & Theme Verification', () => {
  test('Landing page loads, toggles theme, and opens Auth Modal', async ({ page }) => {
    await page.goto('http://localhost:3002/');

    // 1. Verify Title & Hero
    await expect(page.locator('text=Study Buddy')).toBeVisible();
    await expect(page.locator('text=You teach the AI.')).toBeVisible();

    // 2. Test Light / Dark Theme Switcher
    const themeBtn = page.locator('button[aria-label="Toggle theme"]').first();
    await expect(themeBtn).toBeVisible();

    // Initial state check
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');
    
    // Toggle theme
    await themeBtn.click();
    await page.waitForTimeout(300);
    const toggledClass = await html.getAttribute('class');
    expect(toggledClass).not.toBe(initialClass);

    // 3. Open Sign In Modal
    const signInBtn = page.locator('button:has-text("Sign In")').first();
    if (await signInBtn.isVisible()) {
      await signInBtn.click();
      await expect(page.locator('text=Welcome Back')).toBeVisible();

      // Click demo credentials link
      const demoBtn = page.locator('button:has-text("divyansh@studybuddy.ai")');
      if (await demoBtn.isVisible()) {
        await demoBtn.click();
        await page.locator('button:has-text("Sign In to Dashboard")').click();
        
        // Wait for dashboard view to appear
        await page.waitForTimeout(1000);
        await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible();
        await expect(page.locator('button:has-text("New Learning Session")')).toBeVisible();
        await expect(page.locator('text=Your Learning Sessions')).toBeVisible();
      }
    }
  });

  test('Direct workspace launch', async ({ page }) => {
    await page.goto('http://localhost:3002/');
    const launchBtn = page.locator('button:has-text("Launch Learning Tool")').first();
    await launchBtn.click();

    // Verify Study Tool is active on Step 1
    await expect(page.locator('text=Upload Study Material')).toBeVisible();
    await expect(page.locator('text=Step 1 • Course Material Setup')).toBeVisible();
  });
});
