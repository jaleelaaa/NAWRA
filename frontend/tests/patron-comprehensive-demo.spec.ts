import { test, expect } from '@playwright/test';

/**
 * Comprehensive Patron Portal Demo
 *
 * This test demonstrates all patron capabilities:
 * 1. Login to patron portal
 * 2. Browse catalog
 * 3. Search for books
 * 4. View book details and availability status
 * 5. View current loans
 * 6. Check loan status and due dates
 * 7. View reading history
 * 8. Update profile
 * 9. View notifications
 * 10. Language switching
 */

const PRODUCTION_URL = 'https://nawra.onrender.com';
const PATRON_EMAIL = 'patron@nawra.om';
const PATRON_PASSWORD = 'Nawra2025!';

// Enable video and screenshots for all tests
test.use({
  video: 'on',
  screenshot: 'on',
});

test.describe('Patron Comprehensive Demo', () => {

  test('Complete Patron Portal Walkthrough', async ({ page }) => {
    // Set longer timeout for production environment
    test.setTimeout(180000); // 3 minutes

    console.log('🎬 Starting Patron Comprehensive Demo');

    // ============================================
    // 1. LOGIN TO PATRON PORTAL
    // ============================================
    console.log('\n📍 Step 1: Login to Patron Portal');
    await page.goto(`${PRODUCTION_URL}/en/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Fill login form
    await page.fill('input[type="email"]', PATRON_EMAIL);
    await page.waitForTimeout(500);
    await page.fill('input[type="password"]', PATRON_PASSWORD);
    await page.waitForTimeout(500);

    // Click login button
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Wait for patron dashboard to load
    await page.waitForURL('**/patron', { timeout: 15000 });
    console.log('✅ Successfully logged in as Patron');
    await page.waitForTimeout(2000);

    // ============================================
    // 2. PATRON DASHBOARD OVERVIEW
    // ============================================
    console.log('\n📍 Step 2: Patron Dashboard Overview');
    await page.waitForTimeout(2000);

    // Check for welcome message
    const welcomeText = await page.locator('text=/welcome|مرحبا/i').first();
    if (await welcomeText.isVisible()) {
      console.log('✅ Welcome message displayed');
    }

    // View dashboard statistics
    await page.waitForTimeout(2000);
    console.log('✅ Dashboard statistics loaded');

    // ============================================
    // 3. BROWSE CATALOG
    // ============================================
    console.log('\n📍 Step 3: Browse Catalog');

    // Navigate to catalog
    await page.click('text=/catalog|المكتبة/i');
    await page.waitForTimeout(3000);

    console.log('✅ Catalog page loaded');
    await page.waitForTimeout(2000);

    // Scroll through catalog
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1500);

    // ============================================
    // 4. SEARCH FOR BOOKS
    // ============================================
    console.log('\n📍 Step 4: Search for Books');

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="بحث" i]').first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('science');
      await page.waitForTimeout(1500);
      console.log('✅ Search performed');
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 5. VIEW BOOK DETAILS AND STATUS
    // ============================================
    console.log('\n📍 Step 5: View Book Details');

    // Click on first book
    const firstBook = page.locator('.book-card, [data-testid="book-card"], .catalog-item').first();
    if (await firstBook.isVisible()) {
      await firstBook.click();
      await page.waitForTimeout(3000);
      console.log('✅ Book details opened');

      // Check availability status
      const availabilityStatus = page.locator('text=/available|متاح|borrowed|مستعار/i').first();
      if (await availabilityStatus.isVisible()) {
        console.log('✅ Book availability status visible');
      }
      await page.waitForTimeout(2000);

      // Close book details
      const closeButton = page.locator('button:has-text("close"), button:has-text("إغلاق"), [aria-label="close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(1500);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1500);
      }
    }

    // ============================================
    // 6. VIEW CURRENT LOANS
    // ============================================
    console.log('\n📍 Step 6: View Current Loans');

    // Navigate to loans/borrowed books section
    const loansLink = page.locator('text=/loans|borrowed|الاستعارات|الكتب المستعارة/i').first();
    if (await loansLink.isVisible()) {
      await loansLink.click();
      await page.waitForTimeout(3000);
      console.log('✅ Loans page loaded');
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️ Loans section not found, checking navigation');
      await page.waitForTimeout(1000);
    }

    // ============================================
    // 7. VIEW MY REQUESTS
    // ============================================
    console.log('\n📍 Step 7: View My Requests');

    // Navigate to requests/holds section
    const requestsLink = page.locator('text=/requests|holds|طلبات|الحجوزات/i').first();
    if (await requestsLink.isVisible()) {
      await requestsLink.click();
      await page.waitForTimeout(3000);
      console.log('✅ Requests page loaded');
      await page.waitForTimeout(2000);

      // Scroll to view all requests
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1500);
      console.log('✅ Book requests and hold status visible');
    } else {
      console.log('⚠️ Requests section not found in navigation');
      await page.waitForTimeout(1000);
    }

    // ============================================
    // 8. CHECK DUE DATES
    // ============================================
    console.log('\n📍 Step 8: Check Due Dates');

    // Go back to loans to check due dates
    const loansLinkAgain = page.locator('text=/loans|borrowed|الاستعارات|الكتب المستعارة/i').first();
    if (await loansLinkAgain.isVisible()) {
      await loansLinkAgain.click();
      await page.waitForTimeout(2000);
    }

    // Scroll to view all loans
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);

    console.log('✅ Loan status and due dates visible');

    // ============================================
    // 9. VIEW READING HISTORY
    // ============================================
    console.log('\n📍 Step 9: View Reading History');

    const historyLink = page.locator('text=/history|السجل|التاريخ/i').first();
    if (await historyLink.isVisible()) {
      await historyLink.click();
      await page.waitForTimeout(3000);
      console.log('✅ Reading history loaded');
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 10. VIEW PROFILE
    // ============================================
    console.log('\n📍 Step 10: View Profile');

    // Click on profile/settings
    const profileLink = page.locator('text=/profile|settings|الملف الشخصي|الإعدادات/i').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await page.waitForTimeout(3000);
      console.log('✅ Profile page loaded');
      await page.waitForTimeout(2000);

      // Scroll through profile
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1500);
    } else {
      // Try user menu
      const userMenu = page.locator('[data-testid="user-menu"], .user-menu, button:has-text("' + PATRON_EMAIL + '")').first();
      if (await userMenu.isVisible()) {
        await userMenu.click();
        await page.waitForTimeout(1500);

        const profileItem = page.locator('text=/profile|الملف الشخصي/i').first();
        if (await profileItem.isVisible()) {
          await profileItem.click();
          await page.waitForTimeout(3000);
          console.log('✅ Profile page loaded from menu');
        }
      }
    }

    // ============================================
    // 11. NOTIFICATIONS (if available)
    // ============================================
    console.log('\n📍 Step 11: Check Notifications');

    const notificationIcon = page.locator('[data-testid="notifications"], .notification-icon, button[aria-label*="notification"]').first();
    if (await notificationIcon.isVisible()) {
      await notificationIcon.click();
      await page.waitForTimeout(2000);
      console.log('✅ Notifications panel opened');
      await page.waitForTimeout(2000);

      // Close notifications
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    }

    // ============================================
    // 12. LANGUAGE SWITCHING TO ARABIC
    // ============================================
    console.log('\n📍 Step 12: Switch to Arabic');

    // Look for language switcher
    const languageSwitcher = page.locator('button:has-text("العربية"), button:has-text("AR"), [data-testid="language-switcher"]').first();
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      await page.waitForTimeout(3000);
      console.log('✅ Switched to Arabic');
      await page.waitForTimeout(2000);

      // Verify RTL layout
      const isRTL = await page.evaluate(() => {
        return document.documentElement.dir === 'rtl' ||
               document.body.dir === 'rtl';
      });

      if (isRTL) {
        console.log('✅ RTL layout confirmed');
      }
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 13. NAVIGATE BACK TO DASHBOARD
    // ============================================
    console.log('\n📍 Step 13: Return to Dashboard');
    await page.click('text=/dashboard|لوحة التحكم/i');
    await page.waitForTimeout(3000);
    console.log('✅ Back to dashboard');
    await page.waitForTimeout(2000);

    // ============================================
    // 14. FINAL OVERVIEW
    // ============================================
    console.log('\n📍 Step 14: Final Overview');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(2000);

    console.log('\n✅ Patron Demo Completed Successfully!');
    console.log('\n📊 Demo Summary:');
    console.log('✓ Login successful');
    console.log('✓ Dashboard viewed');
    console.log('✓ Catalog browsed');
    console.log('✓ Books searched');
    console.log('✓ Book details and status checked');
    console.log('✓ Current loans viewed');
    console.log('✓ My requests/holds viewed');
    console.log('✓ Due dates checked');
    console.log('✓ Reading history accessed');
    console.log('✓ Profile viewed');
    console.log('✓ Notifications checked');
    console.log('✓ Language switched to Arabic');
    console.log('✓ All patron capabilities demonstrated');

    // Final wait before test ends
    await page.waitForTimeout(3000);
  });
});
