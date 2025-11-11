import { test, expect } from '@playwright/test';

/**
 * ROUTING FIX TESTS
 *
 * These tests verify that locale (EN/AR) is preserved during login flow
 * and that users are properly redirected to the home page after authentication.
 */

test.describe('Routing Fix - Locale Preservation', () => {
  const LIBRARIAN_EMAIL = 'librarian@ministry.om';
  const LIBRARIAN_PASSWORD = 'Test@123';

  test.beforeEach(async ({ page }) => {
    // Enable console logging to see debug messages
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('[LOGIN]')) {
        console.log(`Browser: ${msg.text()}`);
      }
    });
  });

  test('EN: Login from /en/login should redirect to /en', async ({ page }) => {
    console.log('\n=== Testing English Login Flow ===');

    // Navigate to English login page
    await page.goto('http://localhost:3000/en/login');
    console.log('✓ Navigated to /en/login');

    // Verify we're on the login page
    await expect(page).toHaveURL(/\/en\/login/);

    // Fill in login credentials
    await page.fill('input[type="email"]', LIBRARIAN_EMAIL);
    await page.fill('input[type="password"]', LIBRARIAN_PASSWORD);
    console.log('✓ Filled credentials');

    // Click submit button
    await page.click('button[type="submit"]');
    console.log('✓ Clicked submit');

    // Wait for redirect (up to 10 seconds)
    await page.waitForURL(/\/en\/?$/, { timeout: 10000 });
    console.log('✓ Redirected to:', page.url());

    // Verify we're on English home page
    expect(page.url()).toMatch(/\/en\/?$/);
    expect(page.url()).not.toContain('/login');
    expect(page.url()).not.toContain('/ar');

    // Verify page content is in English
    await expect(page.locator('text=Welcome to NAWRA Library Management System')).toBeVisible();
    console.log('✅ English login flow PASSED');
  });

  test('AR: Login from /ar/login should redirect to /ar', async ({ page }) => {
    console.log('\n=== Testing Arabic Login Flow ===');

    // Navigate to Arabic login page
    await page.goto('http://localhost:3000/ar/login');
    console.log('✓ Navigated to /ar/login');

    // Verify we're on the login page
    await expect(page).toHaveURL(/\/ar\/login/);

    // Verify RTL direction
    const html = await page.locator('html');
    const dir = await html.getAttribute('dir');
    expect(dir).toBe('rtl');
    console.log('✓ HTML direction: rtl');

    // Fill in login credentials
    await page.fill('input[type="email"]', LIBRARIAN_EMAIL);
    await page.fill('input[type="password"]', LIBRARIAN_PASSWORD);
    console.log('✓ Filled credentials');

    // Click submit button
    await page.click('button[type="submit"]');
    console.log('✓ Clicked submit');

    // Wait for redirect (up to 10 seconds)
    await page.waitForURL(/\/ar\/?$/, { timeout: 10000 });
    console.log('✓ Redirected to:', page.url());

    // Verify we're on Arabic home page
    expect(page.url()).toMatch(/\/ar\/?$/);
    expect(page.url()).not.toContain('/login');
    expect(page.url()).not.toContain('/en');

    // Verify page content is in Arabic
    await expect(page.locator('text=مرحباً بك في نظام إدارة المكتبة')).toBeVisible();
    console.log('✅ Arabic login flow PASSED');
  });

  test('EN: Invalid credentials should stay on /en/login', async ({ page }) => {
    console.log('\n=== Testing English Login with Invalid Credentials ===');

    await page.goto('http://localhost:3000/en/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');

    // Wait a bit for error message
    await page.waitForTimeout(2000);

    // Should still be on login page
    expect(page.url()).toContain('/en/login');

    // Should show error message
    const errorElement = await page.locator('.bg-red-50, .text-red-600').first();
    await expect(errorElement).toBeVisible();
    console.log('✅ English error handling PASSED');
  });

  test('AR: Invalid credentials should stay on /ar/login', async ({ page }) => {
    console.log('\n=== Testing Arabic Login with Invalid Credentials ===');

    await page.goto('http://localhost:3000/ar/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');

    // Wait a bit for error message
    await page.waitForTimeout(2000);

    // Should still be on login page
    expect(page.url()).toContain('/ar/login');

    // Should show error message
    const errorElement = await page.locator('.bg-red-50, .text-red-600').first();
    await expect(errorElement).toBeVisible();
    console.log('✅ Arabic error handling PASSED');
  });
});
