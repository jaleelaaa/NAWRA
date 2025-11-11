import { test } from '@playwright/test';

test('Dashboard Screenshot', async ({ page }) => {
  // Navigate to the dashboard
  await page.goto('http://localhost:3000/en/dashboard');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Take a full page screenshot
  await page.screenshot({
    path: 'dashboard-screenshot.png',
    fullPage: true
  });
});
