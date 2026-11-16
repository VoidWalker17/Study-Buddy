
import { test, expect } from '@playwright/test';

test('verify all user refinements: hero image, clean dashboard, visible history, and cohesive tool', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // 1. Verify Hero Element with provided desk photo
  const heroImg = page.locator('img[src*="hero-feynman-desk.jpg"]');
  await expect(heroImg).toBeVisible();
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/verified-hero-desk.png',
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });

  // 2. Log in to Dashboard
  await page.locator('header.ttl-nav button:has-text("Sign in")').first().click();
  await page.waitForSelector('text=Welcome back');

  await page.fill('input#email', 'divyansh@studybuddy.ai');
  await page.fill('input#password', 'Password123!');
  await page.click('button:has-text("Sign In to Dashboard")');

  // Wait for Dashboard to render
  await page.waitForSelector('text=Learning Dashboard');
  await expect(page.locator('h1:has-text("Welcome back, Divyansh")')).toBeVisible();

  // Verify removed items are NOT present in sidebar
  await expect(page.locator('text=Active Concepts')).toHaveCount(0);
  await expect(page.locator('text=Pedagogical Proof')).toHaveCount(0);
  await expect(page.locator('text=Dialogue Stream')).toHaveCount(0);

  // Capture clean Dashboard Overview
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/verified-dashboard-clean.png',
    fullPage: false
  });

  // 3. Navigate to Session History & Verify High-Contrast Text
  await page.click('button:has-text("Session History")');
  await page.waitForSelector('text=Feynman Session History & Records');
  await expect(page.locator('text=Audited cold baseline vs. blind final exams')).toBeVisible();

  // Capture Session History Tab
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/verified-session-history.png',
    fullPage: false
  });

  // 4. Launch the Actual Teaching Tool & Verify Cohesive Look
  await page.click('button:has-text("New Session")');
  await page.waitForSelector('text=Upload Study Material');
  await expect(page.locator('text=Step 1 • Course Material Setup')).toBeVisible();

  // Capture Refined Study Tool
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/verified-study-tool-cohesive.png',
    fullPage: false
  });
});
