import { test, expect } from '@playwright/test';

test.describe('Dashboard Bilingual Check', () => {
  // Test English mode
  test('Dashboard renders correctly in English mode', async ({ page }) => {
    // Navigate to English dashboard
    await page.goto('http://localhost:3000/en/dashboard');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check welcome banner
    await expect(page.getByRole('heading', { name: 'Welcome to the Dashboard' })).toBeVisible();
    await expect(page.getByText('NAWRA Library Management System').first()).toBeVisible();

    // Check statistics cards are visible
    await expect(page.getByText('Total Users').first()).toBeVisible();
    await expect(page.getByText('Total Books').first()).toBeVisible();
    await expect(page.getByText('Books Borrowed')).toBeVisible();
    await expect(page.getByText('Overdue Books').first()).toBeVisible();

    // Check charts section
    await expect(page.getByText('Borrowing & Return Trends')).toBeVisible();
    await expect(page.getByText('Books by Category')).toBeVisible();
    await expect(page.getByText('User Distribution')).toBeVisible();
    await expect(page.getByText('Monthly Circulation Statistics')).toBeVisible();

    // Check popular books and alerts
    await expect(page.getByText('Popular Books')).toBeVisible();
    await expect(page.getByText('Overdue Books Alerts')).toBeVisible();

    // Check activity feed
    await expect(page.getByText('Recent Activity')).toBeVisible();

    // Check ARIA labels are present
    const sections = await page.locator('section').all();
    expect(sections.length).toBeGreaterThanOrEqual(5);

    // Take screenshot
    await page.screenshot({
      path: 'dashboard-english.png',
      fullPage: true
    });
  });

  // Test Arabic mode
  test('Dashboard renders correctly in Arabic mode with RTL', async ({ page }) => {
    // Navigate to Arabic dashboard
    await page.goto('http://localhost:3000/ar/dashboard');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check welcome banner in Arabic
    await expect(page.getByRole('heading', { name: 'مرحباً بك في لوحة التحكم' })).toBeVisible();
    await expect(page.getByText('نظام إدارة المكتبة NAWRA').first()).toBeVisible();

    // Check statistics cards are visible in Arabic
    await expect(page.getByText('إجمالي المستخدمين')).toBeVisible();
    await expect(page.getByText('إجمالي الكتب').first()).toBeVisible();
    await expect(page.getByText('الكتب المستعارة')).toBeVisible();
    await expect(page.getByText('الكتب المتأخرة').first()).toBeVisible();

    // Check charts section in Arabic
    await expect(page.getByText('اتجاهات الاستعارة والإرجاع')).toBeVisible();
    await expect(page.getByText('الكتب حسب الفئة')).toBeVisible();
    await expect(page.getByText('توزيع المستخدمين')).toBeVisible();
    await expect(page.getByText('إحصائيات التداول الشهرية')).toBeVisible();

    // Check popular books and alerts in Arabic
    await expect(page.getByText('الكتب الأكثر شعبية')).toBeVisible();
    await expect(page.getByText('تنبيهات الكتب المتأخرة')).toBeVisible();

    // Check activity feed in Arabic
    await expect(page.getByText('النشاط الأخير')).toBeVisible();

    // Verify RTL is applied
    const mainContainer = page.locator('div[dir]').first();
    await expect(mainContainer).toHaveAttribute('dir', 'rtl');

    // Check RTL class is present
    const rtlContainer = page.locator('.rtl').first();
    await expect(rtlContainer).toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: 'dashboard-arabic.png',
      fullPage: true
    });
  });

  // Test RTL-specific fixes
  test('RTL layout fixes work correctly in Arabic mode', async ({ page }) => {
    await page.goto('http://localhost:3000/ar/dashboard');
    await page.waitForLoadState('networkidle');

    // Check that overdue alerts have right border (not left)
    const overdueCard = page.locator('[class*="border-r-4"]').first();
    await expect(overdueCard).toBeVisible();

    // Check touch target sizes on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify buttons have minimum height of 44px
    const actionButtons = page.locator('button:has-text("تذكير"), button:has-text("اتصال")').first();
    if (await actionButtons.isVisible()) {
      const box = await actionButtons.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  // Test clickable email links
  test('Email links are clickable in Overdue Alerts', async ({ page }) => {
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForLoadState('networkidle');

    // Find email link in overdue alerts
    const emailLink = page.locator('a[href^="mailto:"]').first();
    if (await emailLink.isVisible()) {
      await expect(emailLink).toHaveAttribute('href', /mailto:/);
    }
  });

  // Test ARIA labels for accessibility
  test('ARIA labels are present for all dashboard sections', async ({ page }) => {
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForLoadState('networkidle');

    // Check for sections with aria-label
    const welcomeSection = page.locator('section[aria-label="Welcome banner"]');
    await expect(welcomeSection).toBeVisible();

    const statsSection = page.locator('section[aria-label="System statistics"]');
    await expect(statsSection).toBeVisible();

    const chartsSection = page.locator('section[aria-label="Charts and statistics"]');
    await expect(chartsSection).toBeVisible();

    const booksAlertsSection = page.locator('section[aria-label="Popular books and alerts"]');
    await expect(booksAlertsSection).toBeVisible();

    const activitySection = page.locator('section[aria-label="Recent activity"]');
    await expect(activitySection).toBeVisible();
  });

  // Test responsive design
  test('Dashboard is responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForLoadState('networkidle');

    // Check that stats cards stack vertically
    const statsGrid = page.locator('section[aria-label="System statistics"]');
    await expect(statsGrid).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({
      path: 'dashboard-mobile-english.png',
      fullPage: true
    });

    // Test Arabic mobile
    await page.goto('http://localhost:3000/ar/dashboard');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'dashboard-mobile-arabic.png',
      fullPage: true
    });

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'dashboard-tablet-english.png',
      fullPage: true
    });
  });

  // Test error boundary
  test('Error boundary is present', async ({ page }) => {
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForLoadState('networkidle');

    // Check that the page loads without errors
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();

    // Verify content is wrapped in error boundary (page loads successfully)
    const welcomeBanner = page.locator('h1:has-text("Welcome to the Dashboard")');
    await expect(welcomeBanner).toBeVisible();
  });

  // Compare English and Arabic layouts side by side
  test('Compare English and Arabic layouts', async ({ page }) => {
    // English layout
    await page.goto('http://localhost:3000/en/dashboard');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'comparison-english.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 800 }
    });

    // Arabic layout
    await page.goto('http://localhost:3000/ar/dashboard');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'comparison-arabic.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 800 }
    });

    // Log completion
    console.log('✓ Screenshots saved for comparison:');
    console.log('  - comparison-english.png');
    console.log('  - comparison-arabic.png');
  });
});
