import { test, expect } from '@playwright/test';

test.describe('Manual Login Flow Testing', () => {

  test('English login with valid credentials - Full Flow', async ({ page }) => {
    console.log('\n=== Testing English Login ===');

    // Navigate to English login
    await page.goto('http://localhost:3000/en/login');
    console.log('✓ Navigated to /en/login');

    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/en-login-page.png' });

    // Fill credentials
    await page.fill('input[type="email"]', 'librarian@ministry.om');
    await page.fill('input[type="password"]', 'Test@123');
    console.log('✓ Filled credentials');

    // Submit form
    await page.click('button[type="submit"]');
    console.log('✓ Clicked submit button');

    // Wait for navigation with timeout
    try {
      await page.waitForURL(/\/(en|ar)/, { timeout: 10000 });
      console.log('✓ Successfully redirected to:', page.url());

      // Take screenshot of destination
      await page.screenshot({ path: 'test-results/en-login-success.png' });

      // Verify we're not on login page anymore
      expect(page.url()).not.toContain('/login');
      console.log('✓ Confirmed not on login page');
    } catch (error) {
      console.log('✗ Navigation timeout or error');
      await page.screenshot({ path: 'test-results/en-login-error.png' });
      throw error;
    }
  });

  test('Arabic login with valid credentials - Full Flow', async ({ page }) => {
    console.log('\n=== Testing Arabic Login ===');

    // Navigate to Arabic login
    await page.goto('http://localhost:3000/ar/login');
    console.log('✓ Navigated to /ar/login');

    // Verify RTL direction
    const dir = await page.locator('html').getAttribute('dir');
    console.log('✓ HTML direction:', dir);
    expect(dir).toBe('rtl');

    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/ar-login-page.png' });

    // Fill credentials
    await page.fill('input[type="email"]', 'librarian@ministry.om');
    await page.fill('input[type="password"]', 'Test@123');
    console.log('✓ Filled credentials');

    // Submit form
    await page.click('button[type="submit"]');
    console.log('✓ Clicked submit button');

    // Wait for navigation with timeout
    try {
      await page.waitForURL(/\/(en|ar)/, { timeout: 10000 });
      console.log('✓ Successfully redirected to:', page.url());

      // Take screenshot of destination
      await page.screenshot({ path: 'test-results/ar-login-success.png' });

      // Verify we're not on login page anymore
      expect(page.url()).not.toContain('/login');
      console.log('✓ Confirmed not on login page');
    } catch (error) {
      console.log('✗ Navigation timeout or error');
      await page.screenshot({ path: 'test-results/ar-login-error.png' });
      throw error;
    }
  });

  test('English login with invalid credentials', async ({ page }) => {
    console.log('\n=== Testing English Login with Invalid Credentials ===');

    await page.goto('http://localhost:3000/en/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/en-login-invalid.png' });

    // Should still be on login page
    expect(page.url()).toContain('/login');
    console.log('✓ Stayed on login page after invalid credentials');

    // Should show error
    const errorVisible = await page.locator('.bg-red-50, [role="alert"], text=/error|incorrect|failed/i').isVisible();
    console.log('✓ Error message visible:', errorVisible);
  });

  test('Arabic login with invalid credentials', async ({ page }) => {
    console.log('\n=== Testing Arabic Login with Invalid Credentials ===');

    await page.goto('http://localhost:3000/ar/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/ar-login-invalid.png' });

    // Should still be on login page
    expect(page.url()).toContain('/login');
    console.log('✓ Stayed on login page after invalid credentials');

    // Should show error
    const errorVisible = await page.locator('.bg-red-50, [role="alert"], text=/خطأ|فشل|غير صحيحة/').isVisible();
    console.log('✓ Error message visible:', errorVisible);
  });

  test('Test all user accounts - English', async ({ page }) => {
    const users = [
      { email: 'librarian@ministry.om', password: 'Test@123', role: 'Librarian' },
      { email: 'admin@nawra.om', password: 'Admin@123', role: 'Admin' },
      { email: 'cataloger@ministry.om', password: 'Catalog@123', role: 'Cataloger' },
      { email: 'circulation@ministry.om', password: 'Circulate@123', role: 'Circulation' },
      { email: 'patron@test.om', password: 'Patron@123', role: 'Patron' },
    ];

    for (const user of users) {
      console.log(`\n=== Testing ${user.role} Login ===`);

      await page.goto('http://localhost:3000/en/login');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');

      try {
        await page.waitForURL(/\/(en|ar)/, { timeout: 10000 });
        console.log(`✓ ${user.role} login successful - redirected to:`, page.url());
        expect(page.url()).not.toContain('/login');
      } catch (error) {
        console.log(`✗ ${user.role} login failed`);
        await page.screenshot({ path: `test-results/en-${user.role.toLowerCase()}-error.png` });
        throw error;
      }
    }
  });

  test('Test all user accounts - Arabic', async ({ page }) => {
    const users = [
      { email: 'librarian@ministry.om', password: 'Test@123', role: 'Librarian' },
      { email: 'admin@nawra.om', password: 'Admin@123', role: 'Admin' },
      { email: 'cataloger@ministry.om', password: 'Catalog@123', role: 'Cataloger' },
      { email: 'circulation@ministry.om', password: 'Circulate@123', role: 'Circulation' },
      { email: 'patron@test.om', password: 'Patron@123', role: 'Patron' },
    ];

    for (const user of users) {
      console.log(`\n=== Testing ${user.role} Login (Arabic) ===`);

      await page.goto('http://localhost:3000/ar/login');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');

      try {
        await page.waitForURL(/\/(en|ar)/, { timeout: 10000 });
        console.log(`✓ ${user.role} login successful - redirected to:`, page.url());
        expect(page.url()).not.toContain('/login');
      } catch (error) {
        console.log(`✗ ${user.role} login failed`);
        await page.screenshot({ path: `test-results/ar-${user.role.toLowerCase()}-error.png` });
        throw error;
      }
    }
  });
});
