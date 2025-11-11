import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Visual Validation - Complete Application Flow', () => {
  // Create screenshots directory
  const screenshotDir = path.join(__dirname, 'screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test('Complete visual validation with screenshots', async ({ page }) => {
    console.log('\n========================================');
    console.log('VISUAL VALIDATION TEST - STARTING');
    console.log('========================================\n');

    // Track console messages
    const consoleLogs: string[] = [];
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.error('❌ PAGE ERROR:', error.message);
    });

    // Step 1: Test Root URL
    console.log('\n📍 STEP 1: Testing root URL http://localhost:3000/');
    console.log('Expected: Should redirect to /ar then /ar/dashboard');

    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 10000 });

      // Wait a bit for any redirects
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      console.log('✓ Current URL:', currentUrl);

      // Take screenshot
      await page.screenshot({
        path: path.join(screenshotDir, '01-root-url-result.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 01-root-url-result.png');

      // Check if we're on dashboard
      const isDashboard = currentUrl.includes('/dashboard');
      console.log(isDashboard ? '✓ Successfully redirected to dashboard' : '❌ NOT on dashboard page');

      // Check page content
      const pageTitle = await page.title();
      console.log('📄 Page title:', pageTitle);

      const bodyText = await page.locator('body').textContent();
      const hasArabicContent = bodyText?.includes('مرحباً') || bodyText?.includes('لوحة');
      console.log(hasArabicContent ? '✓ Arabic content detected' : '⚠ No Arabic content found');

    } catch (error: any) {
      console.error('❌ FAILED at root URL test:', error.message);
      await page.screenshot({
        path: path.join(screenshotDir, '01-root-url-ERROR.png'),
        fullPage: true
      });
    }

    // Step 2: Test /ar route
    console.log('\n📍 STEP 2: Testing /ar route');

    try {
      await page.goto('http://localhost:3000/ar', { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      console.log('✓ Current URL:', currentUrl);

      await page.screenshot({
        path: path.join(screenshotDir, '02-ar-route-result.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 02-ar-route-result.png');

    } catch (error: any) {
      console.error('❌ FAILED at /ar route:', error.message);
      await page.screenshot({
        path: path.join(screenshotDir, '02-ar-route-ERROR.png'),
        fullPage: true
      });
    }

    // Step 3: Test /en route
    console.log('\n📍 STEP 3: Testing /en route');

    try {
      await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      console.log('✓ Current URL:', currentUrl);

      await page.screenshot({
        path: path.join(screenshotDir, '03-en-route-result.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 03-en-route-result.png');

      const bodyText = await page.locator('body').textContent();
      const hasEnglishContent = bodyText?.includes('Welcome') || bodyText?.includes('Dashboard');
      console.log(hasEnglishContent ? '✓ English content detected' : '⚠ No English content found');

    } catch (error: any) {
      console.error('❌ FAILED at /en route:', error.message);
      await page.screenshot({
        path: path.join(screenshotDir, '03-en-route-ERROR.png'),
        fullPage: true
      });
    }

    // Step 4: Test Dashboard directly
    console.log('\n📍 STEP 4: Testing dashboard page directly');

    try {
      await page.goto('http://localhost:3000/en/dashboard', { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      console.log('✓ Current URL:', currentUrl);

      // Check for dashboard elements
      const hasDashboardContent = await page.locator('text=/Dashboard|Total Users|Total Books/i').count() > 0;
      console.log(hasDashboardContent ? '✓ Dashboard content visible' : '❌ Dashboard content NOT found');

      await page.screenshot({
        path: path.join(screenshotDir, '04-dashboard-page.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 04-dashboard-page.png');

    } catch (error: any) {
      console.error('❌ FAILED at dashboard page:', error.message);
      await page.screenshot({
        path: path.join(screenshotDir, '04-dashboard-ERROR.png'),
        fullPage: true
      });
    }

    // Step 5: Test Login Page
    console.log('\n📍 STEP 5: Testing login page');

    try {
      await page.goto('http://localhost:3000/en/login', { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      console.log('✓ Current URL:', currentUrl);

      // Check for login form
      const hasLoginForm = await page.locator('input[type="email"]').count() > 0;
      console.log(hasLoginForm ? '✓ Login form visible' : '❌ Login form NOT found');

      await page.screenshot({
        path: path.join(screenshotDir, '05-login-page.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 05-login-page.png');

    } catch (error: any) {
      console.error('❌ FAILED at login page:', error.message);
      await page.screenshot({
        path: path.join(screenshotDir, '05-login-ERROR.png'),
        fullPage: true
      });
    }

    // Step 6: Test Login Flow
    console.log('\n📍 STEP 6: Testing login flow with valid credentials');

    try {
      await page.goto('http://localhost:3000/en/login', { waitUntil: 'networkidle', timeout: 10000 });

      // Fill login form
      await page.fill('input[type="email"]', 'librarian@ministry.om');
      await page.fill('input[type="password"]', 'Test@123');

      await page.screenshot({
        path: path.join(screenshotDir, '06-login-filled.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 06-login-filled.png');

      // Click login
      await page.click('button[type="submit"]');
      console.log('✓ Login button clicked');

      // Wait for navigation
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });

      const finalUrl = page.url();
      console.log('✓ After login URL:', finalUrl);

      await page.screenshot({
        path: path.join(screenshotDir, '07-after-login.png'),
        fullPage: true
      });
      console.log('📸 Screenshot saved: 07-after-login.png');

      const loggedIn = finalUrl.includes('/dashboard');
      console.log(loggedIn ? '✓ Successfully logged in and redirected' : '❌ Login redirect failed');

    } catch (error: any) {
      console.error('❌ FAILED at login flow:', error.message);
      await page.screenshot({
        path: path.join(screenshotDir, '06-login-ERROR.png'),
        fullPage: true
      });
    }

    // Summary Report
    console.log('\n========================================');
    console.log('VISUAL VALIDATION TEST - SUMMARY');
    console.log('========================================\n');

    console.log('📊 Console Logs:', consoleLogs.length);
    console.log('❌ Console Errors:', consoleErrors.length);
    console.log('💥 Page Errors:', pageErrors.length);

    if (consoleErrors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS DETECTED:');
      consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }

    if (pageErrors.length > 0) {
      console.log('\n💥 PAGE ERRORS DETECTED:');
      pageErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }

    console.log('\n📁 Screenshots saved to:', screenshotDir);
    console.log('\n========================================\n');

    // Assert no critical errors
    expect(pageErrors.length).toBe(0);
  });
});
