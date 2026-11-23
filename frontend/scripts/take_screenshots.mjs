import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('../screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Demo token for Feynman Scholar Demo (usr_d63c560fcb2e5780)
const demoToken = 'sbt_eyJ1aWQiOiJ1c3JfZDYzYzU2MGZjYjJlNTc4MCIsIm5hbWUiOiJGZXlubWFuIFNjaG9sYXIgRGVtbyIsImVtYWlsIjoiZGVtb0BzdHVkeWJ1ZGR5LmFpIiwiaWF0IjoxNzk1NDE5ODMyLCJleHAiOjE3OTgwMTE4MzJ9.1e602fd1428a7df45f44a72e0951780fa74b3ddf46d22405d9426f54b7948d29';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  console.log('1. Capturing Landing Hero...');
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '01_landing_hero.png') });

  console.log('2. Capturing Landing 2-Agent Architecture...');
  await page.evaluate(() => window.scrollBy(0, 950));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '02_landing_features.png') });

  console.log('3. Capturing Landing Socratic Loop & Workflow...');
  await page.evaluate(() => window.scrollBy(0, 950));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '03_landing_workflow.png') });

  console.log('4. Capturing Sign In Modal / Auth Screen...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const signInBtn = page.locator('button:has-text("Sign in"), button:has-text("Sign In")').first();
  if (await signInBtn.isVisible()) {
    await signInBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, '04_auth_modal.png') });
  }

  console.log('5. Capturing Student Dashboard (Overview)...');
  await page.evaluate((tok) => {
    localStorage.setItem('sb_auth_token', tok);
    localStorage.removeItem('sb_theme'); // ensure light mode initially
  }, demoToken);
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(1500);

  const launchBtn = page.locator('button:has-text("Launch Learning Session"), button:has-text("Launch Studio")').first();
  if (await launchBtn.isVisible()) {
    await launchBtn.click();
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '05_dashboard_overview.png') });

  console.log('6. Capturing Audited Session History...');
  const historyBtn = page.locator('button:has-text("Session History")').first();
  if (await historyBtn.isVisible()) {
    await historyBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, '06_session_history.png') });
  }

  console.log('7. Capturing Teaching Chamber - Step 1: Upload Material Setup...');
  const teachBtn = page.locator('button:has-text("Teach Child AI")').first();
  if (await teachBtn.isVisible()) {
    await teachBtn.click();
    await page.waitForTimeout(1500);
    // Fill title
    const titleInput = page.locator('input[placeholder*="Quantum Mechanics"]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill('Quantum Mechanics & Wave-Particle Duality (PHYS 401)');
    }
    await page.screenshot({ path: path.join(outDir, '07_teaching_chamber_step1_setup.png') });
  }

  console.log('8. Capturing Teaching Chamber - Step 2: Cold Baseline Exam...');
  const step2Btn = page.locator('button:has-text("Cold Baseline")').first();
  if (await step2Btn.isVisible()) {
    await step2Btn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, '08_teaching_chamber_step2_baseline.png') });
  }

  console.log('9. Capturing Teaching Chamber - Step 3: Socratic Dialogue & Voice Teaching...');
  const step3Btn = page.locator('button:has-text("Teach Child AI")').nth(1); // second button is the step 3 pill
  if (await step3Btn.isVisible()) {
    await step3Btn.click();
    await page.waitForTimeout(1000);
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      await textarea.fill('Light behaves simultaneously as a wave and a stream of localized energy packets called photons. In the photoelectric effect, photons transfer their exact discrete quantum of energy E = h * f directly to electrons in the metal surface.');
    }
    await page.screenshot({ path: path.join(outDir, '09_teaching_chamber_step3_socratic.png') });
  }

  console.log('10. Capturing Teaching Chamber - Step 4: Final TES Score & Blind Exam Report...');
  const historyNav = page.locator('button:has-text("Session History")').first();
  if (await historyNav.isVisible()) {
    await historyNav.click();
    await page.waitForTimeout(1000);
    const resumeBtn = page.locator('button:has-text("Resume")').first();
    if (await resumeBtn.isVisible()) {
      await resumeBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(outDir, '10_teaching_chamber_step4_tes_report.png') });
    }
  }

  console.log('11. Capturing Dashboard in Dark Mode...');
  const dashBtn = page.locator('button:has-text("Dashboard")').first();
  if (await dashBtn.isVisible()) {
    await dashBtn.click();
    await page.waitForTimeout(1000);
    const themeBtn = page.locator('button:has(svg.lucide-moon), button:has(svg.lucide-sun)').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outDir, '11_dashboard_dark_mode.png') });
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
