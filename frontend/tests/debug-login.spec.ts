import { test, expect } from '@playwright/test';

test.describe('Debug Login - Console Capture', () => {
  test('should show error for non-existent email with console logs', async ({ page }) => {
    // Capture console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto('/en/login');

    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'SomePassword123');

    // Click sign in
    await page.click('button[type="submit"]');

    // Wait for API response
    await page.waitForLoadState('networkidle');

    // Wait a bit more for React to render
    await page.waitForTimeout(2000);

    // Print all console logs
    console.log('===== BROWSER CONSOLE LOGS =====');
    consoleLogs.forEach(log => console.log(log));
    console.log('================================');

    // Check page HTML
    const html = await page.content();
    console.log('===== PAGE HTML (search for error) =====');
    if (html.includes('login-error')) {
      console.log('Found login-error in HTML');
      const errorDiv = await page.locator('[data-testid="login-error"]').textContent();
      console.log('Error div text:', errorDiv);
    } else {
      console.log('login-error NOT found in HTML');
    }

    // Check if errorMessage is in the page at all
    const bodyText = await page.locator('body').textContent();
    if (bodyText?.includes('Incorrect')) {
      console.log('Found "Incorrect" text in body');
    } else {
      console.log('"Incorrect" text NOT found in body');
    }

    // Try to find the error div
    const errorDiv = page.locator('[data-testid="login-error"]');
    const errorExists = await errorDiv.count();
    console.log('Error div count:', errorExists);

    if (errorExists > 0) {
      const isVisible = await errorDiv.isVisible();
      console.log('Error div visible:', isVisible);
      const text = await errorDiv.textContent();
      console.log('Error div text:', text);
    }
  });
});
