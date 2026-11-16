import { test, expect } from '@playwright/test';

test.describe('Study Buddy Feynman Workflow & Theme Verification', () => {
  test('Landing page loads, toggles theme, logs in via full-screen auth, and renders GoGenius dashboard', async ({ page }) => {
    await page.goto('http://localhost:3002/');

    // 1. Verify Title & Hero
    await expect(page.locator('text=Study Buddy').first()).toBeVisible();
    await expect(page.locator('text=Teach the AI.').first()).toBeVisible();

    // 2. Test Light / Dark Theme Switcher
    const themeBtn = page.locator('button[aria-label="Toggle theme"]').first();
    await expect(themeBtn).toBeVisible();

    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');
    await themeBtn.click();
    await page.waitForTimeout(300);
    const toggledClass = await html.getAttribute('class');
    expect(toggledClass).not.toBe(initialClass);

    // 3. Open Full-Screen Auth Page
    const signInBtn = page.locator('button:has-text("Sign in")').first();
    await signInBtn.click();

    // Verify Full Screen Split-Screen Auth Page
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('text=If you cannot explain it simply')).toBeVisible();

    // Fill demo credentials
    const demoBtn = page.locator('button:has-text("Use Demo Student Credentials")');
    await demoBtn.click();

    // Submit sign in
    await page.locator('button:has-text("Sign In to Dashboard")').click();

    // 4. Verify GoGenius / Editorial Dashboard loads
    await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=Ready to continue your Feynman development journey?')).toBeVisible();

    // Check Left Sidebar navigation
    await expect(page.locator('aside button:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('aside button:has-text("My Learning")')).toBeVisible();
    await expect(page.locator('aside button:has-text("Assignments")')).toBeVisible();
    await expect(page.locator('aside button:has-text("History")')).toBeVisible();
    await expect(page.locator('aside button:has-text("Performance")')).toBeVisible();

    // Check Top Bar Streak & Search
    await expect(page.locator('text=5 day streak')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search for courses"]')).toBeVisible();

    // Check 4 Top KPI Cards
    await expect(page.locator('text=Total TES Score').first()).toBeVisible();
    await expect(page.locator('text=Modules Mastered').first()).toBeVisible();
    await expect(page.locator('text=Sessions This Week').first()).toBeVisible();
    await expect(page.locator('text=Active Streak').first()).toBeVisible();

    // Check Progress & Quick Launch Cards
    await expect(page.locator('text=Overall Progress')).toBeVisible();
    await expect(page.locator('text=Skills & Topics Overview')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Quick Launch')).toBeVisible();

    // Click "New Learning Session" to launch study tool
    const newSessionBtn = page.locator('button:has-text("New Learning Session")').first();
    await newSessionBtn.click();
    await expect(page.locator('text=Upload Study Material')).toBeVisible({ timeout: 5000 });
  });

  test('Feynman Studio interactive teaching & science matrix', async ({ page }) => {
    await page.goto('http://localhost:3002/');

    // Wait for GSAP entrance animation to complete
    await page.waitForTimeout(1500);

    // Check Hero dashboard components inside .ttl-dash
    const dash = page.locator('.ttl-dash');
    await dash.scrollIntoViewIfNeeded();
    await expect(dash.locator('text=Quantum Superposition').first()).toBeVisible();

    // Click "Teach Agent" tab inside dashboard
    const teachTab = dash.locator('button:has-text("Teach Agent")').first();
    await teachTab.click();
    await expect(dash.locator('text=Teach Child Agent')).toBeVisible();

    // Transmit explanation
    const transmitBtn = dash.locator('button:has-text("Transmit Explanation")');
    await transmitBtn.click();
    await expect(dash.locator('text=Transmitting Concept...')).toBeVisible();

    // Confirm transmission
    const confirmBtn = dash.locator('button:has-text("Confirm Neural Ingestion")');
    await confirmBtn.click();
    await expect(dash.locator('text=Knowledge Consolidated')).toBeVisible({ timeout: 5000 });

    // Verify 500-Synapse matrix slider & dots exist after scroll
    const covSection = page.locator('[data-sec="coverage"]');
    await covSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(page.locator('text=500 Neural Concept Nodes')).toBeVisible();

    // Verify Resource cards exist after scroll
    const resSection = page.locator('[data-sec="resources"]');
    await resSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(page.locator('text=The Neurobiology of Active Teaching')).toBeVisible();
    await expect(page.locator('text=Dual-Agent Cognitive Isolation')).toBeVisible();
  });
});
