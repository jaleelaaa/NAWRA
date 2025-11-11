import { test, expect } from '@playwright/test';

test.describe('Language Switcher', () => {
  test('should switch from Arabic to English correctly', async ({ page }) => {
    // Start at Arabic login page
    await page.goto('/ar/login');
    await expect(page).toHaveURL(/\/ar\/login/);

    // Click the language switcher button (Globe icon)
    const languageSwitcher = page.locator('a:has-text("English")').or(page.locator('a:has(svg.lucide-globe)'));
    await languageSwitcher.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should navigate to English login page
    const currentURL = page.url();
    console.log('After clicking switcher (AR->EN), URL is:', currentURL);

    // Check that we're on /en/login, not /en/en/login
    await expect(page).toHaveURL(/\/en\/login$/);
    expect(currentURL).not.toContain('/en/en/');
  });

  test('should switch from English to Arabic correctly', async ({ page }) => {
    // Start at English login page
    await page.goto('/en/login');
    await expect(page).toHaveURL(/\/en\/login/);

    // Click the language switcher button
    const languageSwitcher = page.locator('a:has-text("العربية")').or(page.locator('a:has(svg.lucide-globe)'));
    await languageSwitcher.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should navigate to Arabic login page
    const currentURL = page.url();
    console.log('After clicking switcher (EN->AR), URL is:', currentURL);

    // Check that we're on /ar/login, not /ar/ar/login
    await expect(page).toHaveURL(/\/ar\/login$/);
    expect(currentURL).not.toContain('/ar/ar/');
  });

  test('should toggle between languages multiple times', async ({ page }) => {
    // Start at Arabic
    await page.goto('/ar/login');
    console.log('1. Started at:', page.url());

    // Switch to English
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('2. After AR->EN:', page.url());
    expect(page.url()).toMatch(/\/en\/login$/);

    // Switch back to Arabic
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('3. After EN->AR:', page.url());
    expect(page.url()).toMatch(/\/ar\/login$/);

    // Switch to English again
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('4. After AR->EN (2nd time):', page.url());
    expect(page.url()).toMatch(/\/en\/login$/);

    // Switch back to Arabic again
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('5. After EN->AR (2nd time):', page.url());
    expect(page.url()).toMatch(/\/ar\/login$/);
  });
});
