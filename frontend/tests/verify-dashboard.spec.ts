import { test, expect } from '@playwright/test';

test('verify high-aesthetic editorial dashboard matching image 2', async ({ page }) => {
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
  await expect(page.locator('text=TEACHING EFFICIENCY SCORE (TES)')).toBeVisible();

  // 1. Capture primary Neural State view matching Image 2
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/dashboard-neural-state.png',
    fullPage: false
  });

  // 2. Test interactive time filter (click 30d)
  await page.click('button:has-text("30d")');
  await expect(page.locator('text=92.4%')).toBeVisible();

  // 3. Test interactive concept selection (click Entropy & Microstates)
  await page.click('text=Entropy & Microstates');

  // 4. Test interactive Socratic transmit input
  await page.fill('input[placeholder*="Explain a concept simply"]', 'Wavepackets spread because different Fourier momentum components travel at different phase velocities.');
  await page.click('button:has-text("Transmit")');

  // Wait for Child Agent synthesized response in stream
  await page.waitForSelector('text=Child Agent inquiry', { timeout: 5000 });

  // 5. Capture post-interaction dashboard screenshot
  await page.screenshot({
    path: '/Users/agarwaldivyansh/.gemini/antigravity/brain/cea91eb2-c039-4a23-93b1-2e9ca64af719/dashboard-interactive-stream.png',
    fullPage: false
  });
});
