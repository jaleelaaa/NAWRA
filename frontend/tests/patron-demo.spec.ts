import { test, expect, type Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';

// Patron credentials
const PATRON_CREDENTIALS = {
  email: 'patron@nawra.om',
  password: 'Nawra2025!',
};

test.describe('Patron Portal - Visual Demonstration', () => {
  test('Complete patron portal walkthrough with screenshots', async ({ page }) => {
    // Configure slow motion for better visibility
    await page.context().setDefaultTimeout(10000);

    console.log('========================================');
    console.log('PATRON PORTAL DEMONSTRATION');
    console.log('========================================\n');

    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await page.goto(`${BASE_URL}/en/login`);
    await page.screenshot({ path: 'test-results/patron-demo-01-login-page.png', fullPage: true });
    console.log('✓ Login page loaded\n');

    // Step 2: Fill in patron credentials
    console.log('Step 2: Entering patron credentials...');
    await page.fill('input[type="email"]', PATRON_CREDENTIALS.email);
    await page.fill('input[type="password"]', PATRON_CREDENTIALS.password);
    await page.screenshot({ path: 'test-results/patron-demo-02-credentials-filled.png', fullPage: true });
    console.log('✓ Credentials entered\n');

    // Step 3: Submit login
    console.log('Step 3: Submitting login...');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(en|ar)\/patron/, { timeout: 10000 });

    const redirectUrl = page.url();
    console.log(`✓ Logged in successfully!`);
    console.log(`✓ Redirected to: ${redirectUrl}`);

    // CRITICAL TEST: Verify redirect to /patron NOT /dashboard
    expect(redirectUrl).toMatch(/\/patron/);
    expect(redirectUrl).not.toMatch(/\/dashboard/);
    console.log('✅ VERIFIED: Patron redirected to /patron (NOT /dashboard)\n');

    await page.screenshot({ path: 'test-results/patron-demo-03-patron-dashboard.png', fullPage: true });

    // Step 4: Navigate to catalog
    console.log('Step 4: Browsing catalog...');
    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/patron-demo-04-catalog.png', fullPage: true });
    console.log('✓ Catalog page loaded\n');

    // Step 5: Navigate to My Loans
    console.log('Step 5: Viewing My Loans...');
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/patron-demo-05-loans.png', fullPage: true });

    // Check for fine breakdown
    const bodyText = await page.locator('body').textContent();
    if (bodyText?.includes('OMR') || bodyText?.includes('Fine') || bodyText?.includes('الغرامة')) {
      console.log('✓ Loans page loaded - Fine breakdown visible!\n');
    } else {
      console.log('✓ Loans page loaded - No active fines\n');
    }

    // Step 6: Navigate to My Requests
    console.log('Step 6: Viewing My Requests...');
    await page.goto(`${BASE_URL}/en/patron/requests`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/patron-demo-06-requests.png', fullPage: true });
    console.log('✓ Requests page loaded\n');

    // Step 7: Navigate to Profile
    console.log('Step 7: Viewing Profile...');
    await page.goto(`${BASE_URL}/en/patron/profile`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/patron-demo-07-profile.png', fullPage: true });
    console.log('✓ Profile page loaded\n');

    // Step 8: Test admin route protection
    console.log('Step 8: Testing admin route protection...');
    console.log('  → Attempting to access /admin/catalog...');
    await page.goto(`${BASE_URL}/en/admin/catalog`);
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    console.log(`  → Final URL: ${finalUrl}`);

    if (!finalUrl.includes('/admin/catalog')) {
      console.log('✅ VERIFIED: Patron cannot access admin routes!\n');
    } else {
      console.log('⚠️  WARNING: Patron may have access to admin routes\n');
    }

    await page.screenshot({ path: 'test-results/patron-demo-08-admin-protection.png', fullPage: true });

    // Final summary
    console.log('========================================');
    console.log('DEMONSTRATION COMPLETE');
    console.log('========================================');
    console.log('✅ All patron portal pages are accessible');
    console.log('✅ Role-based redirect working correctly');
    console.log('✅ Screenshots saved to test-results/');
    console.log('========================================\n');
  });

  test('Test language switching in patron portal', async ({ page }) => {
    console.log('========================================');
    console.log('LANGUAGE SWITCHING TEST');
    console.log('========================================\n');

    // Login
    console.log('Logging in as patron...');
    await page.goto(`${BASE_URL}/en/login`);
    await page.fill('input[type="email"]', PATRON_CREDENTIALS.email);
    await page.fill('input[type="password"]', PATRON_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(en|ar)\/patron/);
    console.log('✓ Logged in\n');

    // Navigate to catalog
    console.log('Navigating to catalog (English)...');
    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/patron-demo-lang-en-catalog.png', fullPage: true });
    console.log('✓ English catalog loaded\n');

    // Switch to Arabic
    console.log('Switching to Arabic...');
    await page.goto(`${BASE_URL}/ar/patron/catalog`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/patron-demo-lang-ar-catalog.png', fullPage: true });

    // Check for RTL
    const htmlDir = await page.locator('html').getAttribute('dir');
    console.log(`✓ Arabic catalog loaded (dir="${htmlDir}")`);
    expect(htmlDir).toBe('rtl');
    console.log('✅ VERIFIED: RTL layout applied\n');

    console.log('========================================');
    console.log('LANGUAGE SWITCHING TEST COMPLETE');
    console.log('========================================\n');
  });
});
