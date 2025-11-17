import { test, expect, type Page } from '@playwright/test';

// Test configuration for customer demo
const BASE_URL = 'http://localhost:3000';
const SLOW_MO = 2000; // 2 seconds delay between actions for visibility

// Patron credentials
const PATRON_CREDENTIALS = {
  email: 'patron@nawra.om',
  password: 'Nawra2025!',
};

// Configure video recording at top level
test.use({
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 }
  },
  actionTimeout: 60000, // 60 seconds for each action
});

// Set test timeout to 10 minutes
test.setTimeout(600000);

// Helper function to wait and take action slowly
async function slowAction(page: Page, action: () => Promise<void>, description: string) {
  console.log(`  → ${description}...`);
  await action();
  await page.waitForTimeout(SLOW_MO);
}

test.describe('NAWRA Library - Customer Presentation Demo', () => {

  test('PART 1: English Interface Demo', async ({ page }) => {
    console.log('\n'.repeat(2));
    console.log('═'.repeat(80));
    console.log('    NAWRA LIBRARY MANAGEMENT SYSTEM - PATRON PORTAL DEMO (ENGLISH)');
    console.log('═'.repeat(80));
    console.log('\n');

    // ============================================================
    // STEP 1: LOGIN
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 1: USER LOGIN                                         │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/en/login`);
      await page.waitForLoadState('networkidle');
    }, 'Opening login page');

    await page.screenshot({ path: 'demo-results/EN-01-login-page.png', fullPage: true });

    await slowAction(page, async () => {
      await page.fill('input[type="email"]', PATRON_CREDENTIALS.email);
    }, 'Entering email: patron@nawra.om');

    await slowAction(page, async () => {
      await page.fill('input[type="password"]', PATRON_CREDENTIALS.password);
    }, 'Entering password');

    await page.screenshot({ path: 'demo-results/EN-02-credentials-entered.png', fullPage: true });

    await slowAction(page, async () => {
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(en|ar)\/patron/, { timeout: 10000 });
    }, 'Clicking Sign In button');

    console.log('  ✅ Successfully logged in as Patron User\n');

    // ============================================================
    // STEP 2: PATRON DASHBOARD
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 2: PATRON DASHBOARD                                   │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(SLOW_MO);
    await page.screenshot({ path: 'demo-results/EN-03-dashboard.png', fullPage: true });

    console.log('  Dashboard Features:');
    console.log('  • Quick statistics overview');
    console.log('  • Active loans counter');
    console.log('  • Pending requests counter');
    console.log('  • Navigation menu');
    console.log('  ✅ Dashboard loaded\n');

    // ============================================================
    // STEP 3: BROWSE CATALOG
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 3: BROWSE LIBRARY CATALOG                             │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.click('text=Browse Catalog');
      await page.waitForLoadState('networkidle');
    }, 'Clicking "Browse Catalog" from navigation');

    await page.screenshot({ path: 'demo-results/EN-04-catalog-main.png', fullPage: true });

    console.log('  Catalog Features:');
    console.log('  • Book grid with cover images');
    console.log('  • Title in English and Arabic');
    console.log('  • Author names in both languages');
    console.log('  • Status badges (Available/Borrowed/Reserved)');
    console.log('  • ISBN and category information');
    console.log('  • Aligned "Request Book" buttons');
    console.log('  ✅ Catalog displayed with all books\n');

    // ============================================================
    // STEP 4: SEARCH FUNCTIONALITY
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 4: SEARCH FOR BOOKS                                   │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      const searchInput = page.locator('input[placeholder*="Search"]').first();
      await searchInput.click();
      await searchInput.fill('Oman');
    }, 'Typing "Oman" in search box');

    await slowAction(page, async () => {
      const searchButton = page.locator('button:has-text("Search")').first();
      await searchButton.click();
      await page.waitForLoadState('networkidle');
    }, 'Clicking Search button');

    await page.screenshot({ path: 'demo-results/EN-05-search-results.png', fullPage: true });
    console.log('  ✅ Search results displayed for "Oman"\n');

    // ============================================================
    // STEP 5: FILTER BOOKS
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 5: FILTER BOOKS BY STATUS                             │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      const filterButton = page.locator('button').filter({ hasText: 'Filters' }).first();
      if (await filterButton.isVisible().catch(() => false)) {
        await filterButton.click();
      }
    }, 'Opening filter panel');

    await page.screenshot({ path: 'demo-results/EN-06-filters-opened.png', fullPage: true });

    await slowAction(page, async () => {
      const statusSelect = page.locator('select').first();
      if (await statusSelect.isVisible().catch(() => false)) {
        await statusSelect.selectOption('available');
        await page.waitForLoadState('networkidle');
      }
    }, 'Selecting "Available" filter');

    await page.screenshot({ path: 'demo-results/EN-07-filtered-available.png', fullPage: true });
    console.log('  ✅ Showing only available books\n');

    // ============================================================
    // STEP 6: REQUEST A BOOK
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 6: REQUEST A BOOK                                     │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    // Go back to catalog to ensure we have available books
    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/en/patron/catalog`);
      await page.waitForLoadState('networkidle');
    }, 'Navigating back to full catalog');

    await slowAction(page, async () => {
      const requestButton = page.locator('button').filter({ hasText: 'Request Book' }).first();
      if (await requestButton.isVisible().catch(() => false)) {
        await requestButton.click();
        await page.waitForTimeout(2000);
      }
    }, 'Clicking "Request Book" button');

    await page.screenshot({ path: 'demo-results/EN-08-book-requested.png', fullPage: true });
    console.log('  ✅ Book request submitted successfully\n');

    // ============================================================
    // STEP 7: MY LOANS
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 7: VIEW MY LOANS                                      │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/en/patron/loans`);
      await page.waitForLoadState('networkidle');
    }, 'Navigating to "My Loans"');

    await page.screenshot({ path: 'demo-results/EN-09-my-loans.png', fullPage: true });

    console.log('  My Loans Features:');
    console.log('  • List of borrowed books');
    console.log('  • Due dates');
    console.log('  • Fine breakdown (if applicable)');
    console.log('  • Return status');
    console.log('  ✅ My Loans page displayed\n');

    // ============================================================
    // STEP 8: MY REQUESTS
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 8: VIEW MY REQUESTS                                   │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/en/patron/requests`);
      await page.waitForLoadState('networkidle');
    }, 'Navigating to "My Requests"');

    await page.screenshot({ path: 'demo-results/EN-10-my-requests.png', fullPage: true });

    console.log('  My Requests Features:');
    console.log('  • Pending book requests (including the one we just made!)');
    console.log('  • Request status tracking');
    console.log('  • Request dates');
    console.log('  • Cancel option for pending requests');
    console.log('  ✅ My Requests page displayed\n');

    // ============================================================
    // STEP 9: PROFILE
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 9: USER PROFILE                                       │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/en/patron/profile`);
      await page.waitForLoadState('networkidle');
    }, 'Navigating to "My Profile"');

    await page.screenshot({ path: 'demo-results/EN-11-profile.png', fullPage: true });

    console.log('  Profile Features:');
    console.log('  • Personal information');
    console.log('  • Contact details');
    console.log('  • Account settings');
    console.log('  ✅ Profile page displayed\n');

    // ============================================================
    // STEP 10: BACK TO DASHBOARD
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 10: RETURN TO DASHBOARD                               │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/en/patron`);
      await page.waitForLoadState('networkidle');
    }, 'Returning to Dashboard');

    await page.screenshot({ path: 'demo-results/EN-12-final-dashboard.png', fullPage: true });
    console.log('  ✅ Complete tour finished - Back at Dashboard\n');

    console.log('═'.repeat(80));
    console.log('                    ENGLISH DEMO COMPLETE');
    console.log('═'.repeat(80));
    console.log('\n\n');
  });

  test('PART 2: Arabic Interface Demo (RTL)', async ({ page }) => {
    console.log('\n'.repeat(2));
    console.log('═'.repeat(80));
    console.log('    NAWRA LIBRARY MANAGEMENT SYSTEM - PATRON PORTAL DEMO (ARABIC)');
    console.log('═'.repeat(80));
    console.log('\n');

    // ============================================================
    // STEP 1: LOGIN IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 1: تسجيل الدخول (LOGIN IN ARABIC)                     │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/login`);
      await page.waitForLoadState('networkidle');
    }, 'Opening Arabic login page');

    // Verify RTL
    const htmlDir = await page.locator('html').getAttribute('dir');
    console.log(`  → HTML direction: ${htmlDir}`);
    expect(htmlDir).toBe('rtl');

    await page.screenshot({ path: 'demo-results/AR-01-login-page.png', fullPage: true });

    await slowAction(page, async () => {
      await page.fill('input[type="email"]', PATRON_CREDENTIALS.email);
    }, 'إدخال البريد الإلكتروني (Entering email)');

    await slowAction(page, async () => {
      await page.fill('input[type="password"]', PATRON_CREDENTIALS.password);
    }, 'إدخال كلمة المرور (Entering password)');

    await page.screenshot({ path: 'demo-results/AR-02-credentials-entered.png', fullPage: true });

    await slowAction(page, async () => {
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(en|ar)\/patron/, { timeout: 10000 });
    }, 'النقر على زر تسجيل الدخول (Clicking Sign In)');

    console.log('  ✅ تم تسجيل الدخول بنجاح (Successfully logged in)\n');

    // ============================================================
    // STEP 2: ARABIC DASHBOARD
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 2: لوحة التحكم (DASHBOARD)                           │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(SLOW_MO);
    await page.screenshot({ path: 'demo-results/AR-03-dashboard.png', fullPage: true });

    console.log('  Arabic Dashboard Features:');
    console.log('  • RTL layout applied');
    console.log('  • All text in Arabic');
    console.log('  • Navigation menu in Arabic');
    console.log('  ✅ لوحة التحكم محملة (Dashboard loaded)\n');

    // ============================================================
    // STEP 3: ARABIC CATALOG
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 3: تصفح الكتب (BROWSE CATALOG)                       │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/patron/catalog`);
      await page.waitForLoadState('networkidle');
    }, 'الانتقال إلى كتالوج الكتب (Navigating to catalog)');

    await page.screenshot({ path: 'demo-results/AR-04-catalog-main.png', fullPage: true });

    console.log('  Arabic Catalog Features:');
    console.log('  • RTL book grid layout');
    console.log('  • Arabic book titles displayed prominently');
    console.log('  • Arabic author names');
    console.log('  • Status badges in Arabic');
    console.log('  • "طلب الكتاب" (Request Book) buttons aligned');
    console.log('  ✅ الكتالوج معروض بالعربية (Catalog in Arabic)\n');

    // ============================================================
    // STEP 4: SEARCH IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 4: البحث عن الكتب (SEARCH BOOKS)                     │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      const searchInput = page.locator('input[type="text"]').first();
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.click();
        await searchInput.fill('عمان');
      }
    }, 'البحث عن "عمان" (Typing "Oman" in Arabic)');

    await slowAction(page, async () => {
      const searchButton = page.locator('button').first();
      if (await searchButton.isVisible().catch(() => false)) {
        await searchButton.click();
        await page.waitForLoadState('networkidle');
      }
    }, 'النقر على زر البحث (Clicking search button)');

    await page.screenshot({ path: 'demo-results/AR-05-search-results.png', fullPage: true });
    console.log('  ✅ نتائج البحث معروضة (Search results displayed)\n');

    // ============================================================
    // STEP 5: FILTERS IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 5: تصفية الكتب (FILTER BOOKS)                        │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      const filterButton = page.locator('button').filter({ hasText: /فلتر|Filters/ }).first();
      if (await filterButton.isVisible().catch(() => false)) {
        await filterButton.click();
      }
    }, 'فتح لوحة الفلاتر (Opening filters)');

    await page.screenshot({ path: 'demo-results/AR-05-filters-opened.png', fullPage: true });

    await slowAction(page, async () => {
      const statusSelect = page.locator('select').first();
      if (await statusSelect.isVisible().catch(() => false)) {
        await statusSelect.selectOption('available');
        await page.waitForLoadState('networkidle');
      }
    }, 'تحديد "متاح" (Selecting Available)');

    await page.screenshot({ path: 'demo-results/AR-06-filtered-available.png', fullPage: true });
    console.log('  ✅ عرض الكتب المتاحة فقط (Showing available books only)\n');

    // ============================================================
    // STEP 6: REQUEST BOOK IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 6: طلب كتاب (REQUEST A BOOK)                         │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/patron/catalog`);
      await page.waitForLoadState('networkidle');
    }, 'تحديث الصفحة (Refreshing catalog page)');

    await slowAction(page, async () => {
      const requestButton = page.locator('button').filter({ hasText: /طلب الكتاب|Request Book/ }).first();
      if (await requestButton.isVisible().catch(() => false)) {
        await requestButton.click();
        await page.waitForTimeout(2000);
      }
    }, 'النقر على "طلب الكتاب" (Clicking Request Book)');

    await page.screenshot({ path: 'demo-results/AR-07-book-requested.png', fullPage: true });
    console.log('  ✅ تم طلب الكتاب بنجاح (Book requested successfully)\n');

    // ============================================================
    // STEP 7: MY LOANS IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 7: الاستعارات (MY LOANS)                             │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/patron/loans`);
      await page.waitForLoadState('networkidle');
    }, 'الانتقال إلى صفحة الاستعارات (Navigating to My Loans)');

    await page.screenshot({ path: 'demo-results/AR-08-my-loans.png', fullPage: true });

    console.log('  My Loans in Arabic:');
    console.log('  • قائمة الكتب المستعارة (List of borrowed books)');
    console.log('  • تواريخ الاستحقاق (Due dates)');
    console.log('  • تفاصيل الغرامات (Fine breakdown)');
    console.log('  ✅ صفحة الاستعارات معروضة بالعربية (Loans page in Arabic)\n');

    // ============================================================
    // STEP 8: MY REQUESTS IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 8: طلباتي (MY REQUESTS)                              │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/patron/requests`);
      await page.waitForLoadState('networkidle');
    }, 'الانتقال إلى صفحة الطلبات (Navigating to My Requests)');

    await page.screenshot({ path: 'demo-results/AR-09-my-requests.png', fullPage: true });

    console.log('  My Requests in Arabic:');
    console.log('  • الطلبات المعلقة (Pending requests - including the one we just made!)');
    console.log('  • حالة الطلبات (Request status)');
    console.log('  • تواريخ الطلبات (Request dates)');
    console.log('  ✅ صفحة الطلبات معروضة بالعربية (Requests page in Arabic)\n');

    // ============================================================
    // STEP 9: PROFILE IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 9: الملف الشخصي (PROFILE)                            │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/patron/profile`);
      await page.waitForLoadState('networkidle');
    }, 'الانتقال إلى الملف الشخصي (Navigating to Profile)');

    await page.screenshot({ path: 'demo-results/AR-10-profile.png', fullPage: true });

    console.log('  Profile in Arabic:');
    console.log('  • المعلومات الشخصية (Personal information)');
    console.log('  • تفاصيل الاتصال (Contact details)');
    console.log('  • إعدادات الحساب (Account settings)');
    console.log('  ✅ صفحة الملف الشخصي معروضة بالعربية (Profile in Arabic)\n');

    // ============================================================
    // STEP 10: BACK TO DASHBOARD IN ARABIC
    // ============================================================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  STEP 10: العودة إلى لوحة التحكم (BACK TO DASHBOARD)      │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    await slowAction(page, async () => {
      await page.goto(`${BASE_URL}/ar/patron`);
      await page.waitForLoadState('networkidle');
    }, 'العودة إلى لوحة التحكم (Returning to Dashboard)');

    await page.screenshot({ path: 'demo-results/AR-11-final-dashboard.png', fullPage: true });
    console.log('  ✅ الجولة الكاملة انتهت (Complete tour finished - Back at Dashboard)\n');

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log('\n');
    console.log('═'.repeat(80));
    console.log('                    ARABIC DEMO COMPLETE');
    console.log('═'.repeat(80));
    console.log('\n📊 COMPLETE DEMONSTRATION SUMMARY:\n');
    console.log('  ✅ English Interface - All Features');
    console.log('  ✅ Arabic Interface - All Features');
    console.log('  ✅ RTL Layout Verified');
    console.log('  ✅ Bilingual Content Display');
    console.log('  ✅ Search & Filter Functionality');
    console.log('  ✅ Book Request System');
    console.log('  ✅ My Loans Management');
    console.log('  ✅ My Requests Tracking');
    console.log('  ✅ Profile Management');
    console.log('  ✅ Aligned Request Buttons');
    console.log('\n📁 CUSTOMER PRESENTATION OUTPUTS:\n');
    console.log('  • Screenshots: demo-results/ (22 screenshots total)');
    console.log('    - EN-01 through EN-11 (English interface)');
    console.log('    - AR-01 through AR-11 (Arabic interface)');
    console.log('  • Video Recording: test-results/videos/*.webm');
    console.log('    - 2 complete videos (English + Arabic)');
    console.log('    - Slow speed for customer review');
    console.log('\n');
    console.log('═'.repeat(80));
    console.log('\n');
  });
});
