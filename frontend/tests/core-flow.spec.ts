import { test, expect } from '@playwright/test';

test('has title and back button works', async ({ page }) => {
  await page.goto('http://localhost:3002/');

  // Check title
  await expect(page).toHaveTitle('StudyBuddy');

  // Click Get Started
  await page.getByRole('button', { name: 'Get Started' }).click();

  // Ensure we are in StudyTool
  await expect(page.getByText('Initialize Parse Sequence')).toBeVisible();

  // Test back button
  await page.getByRole('link', { name: 'Back' }).click();

  // Ensure we are back on LandingPage
  await expect(page.getByText('Get Started')).toBeVisible();
});
