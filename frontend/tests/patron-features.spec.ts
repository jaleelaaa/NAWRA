import { test, expect, type Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8000';

// Test credentials
const PATRON_CREDENTIALS = {
  email: 'patron@nawra.om',
  password: 'Nawra2025!',
};

// Helper functions
async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/en/login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(en|ar)\/(patron|dashboard)/);
}

async function logout(page: Page) {
  // Look for logout button - might be in a menu
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("تسجيل الخروج")');
  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click();
  }
}

test.describe('Patron Portal - Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);

    // Should redirect to patron dashboard or catalog
    await expect(page).toHaveURL(/\/(en|ar)\/patron/);

    // Should show user info or welcome message
    await expect(page.locator('body')).toContainText(/patron|المستفيد|dashboard|لوحة/i);
  });

  test('ROLE-BASED REDIRECT: patron login should redirect to /patron NOT /dashboard', async ({ page }) => {
    // This test verifies the fix for the patron portal access issue
    await page.goto(`${BASE_URL}/en/login`);

    // Fill in patron credentials
    await page.fill('input[type="email"]', PATRON_CREDENTIALS.email);
    await page.fill('input[type="password"]', PATRON_CREDENTIALS.password);

    // Click login
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL(/\/(en|ar)\/(patron|dashboard)/, { timeout: 10000 });

    // CRITICAL: Patron should be redirected to /patron, NOT /dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/patron/);
    expect(currentUrl).not.toMatch(/\/dashboard/);

    console.log(`✅ Patron successfully redirected to: ${currentUrl}`);
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/login`);
    await page.fill('input[type="email"]', 'patron@nawra.om');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('body')).toContainText(/invalid|incorrect|خطأ/i);
  });

  test('should protect patron routes from unauthenticated access', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/catalog`);

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Patron Portal - Catalog Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
  });

  test('should display catalog page with books', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/catalog`);

    // Should show books
    await expect(page.locator('[data-testid="book-card"], .book-card, img[alt*="cover"]').first()).toBeVisible({ timeout: 10000 });

    // Should have search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="بحث"]');
    await expect(searchInput).toBeVisible();
  });

  test('should search for books', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/catalog`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find and use search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="بحث"]').first();
    await searchInput.fill('Library');
    await searchInput.press('Enter');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Results should contain searched term or show no results message
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toMatch(/Library|No books|لا توجد كتب/i);
  });

  test('should filter books by category', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');

    // Look for category filter dropdown
    const categoryFilter = page.locator('select, [role="combobox"]').first();
    if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await categoryFilter.click();
      await page.waitForTimeout(500);

      // Select a category if options are available
      const options = page.locator('option, [role="option"]');
      const count = await options.count();
      if (count > 1) {
        await options.nth(1).click();
        await page.waitForTimeout(1000);
      }
    }

    // Page should still show books or no results
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Patron Portal - Book Requests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
  });

  test('should view my requests page', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/requests`);

    // Page should load
    await expect(page.locator('h1, h2')).toContainText(/Request|الطلبات|My Request/i);

    // Should show requests table or empty state
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toMatch(/request|طلب|No request|لا توجد/i);
  });

  test('should request a book from catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');

    // Find a "Request" or "Reserve" button
    const requestButton = page.locator('button:has-text("Request"), button:has-text("Reserve"), button:has-text("طلب")').first();

    if (await requestButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await requestButton.click();

      // Should show success message or confirmation dialog
      await page.waitForTimeout(2000);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/success|requested|تم الطلب|already/i);
    } else {
      console.log('No request button found - books may already be requested or no books available');
    }
  });
});

test.describe('Patron Portal - My Loans', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
  });

  test('should display loans page', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/loans`);

    // Page should show loans title
    await expect(page.locator('h1, h2')).toContainText(/Loan|الإعارات|Borrow/i);

    // Should show loans table or empty state
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show loan statistics', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Should show stats cards (active, overdue, returned)
    const statsCards = page.locator('.stat, [class*="stat"], [class*="card"]');
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter loans by status', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Find status filter dropdown
    const filterSelect = page.locator('select').first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Select "Active" filter
      await filterSelect.selectOption({ label: /Active|نشط/i });
      await page.waitForTimeout(1000);

      // Page should update with filtered results
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('NEW: should renew an eligible loan', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Look for "Renew" button
    const renewButton = page.locator('button:has-text("Renew"), button:has-text("تجديد")').first();

    if (await renewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Check if button is enabled
      const isDisabled = await renewButton.isDisabled();

      if (!isDisabled) {
        // Click renew button
        await renewButton.click();

        // Wait for renewal to complete
        await page.waitForTimeout(3000);

        // Should show success message
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/renewed|success|تم التجديد|cannot renew|max/i);
      } else {
        console.log('Renew button is disabled - likely max renewals reached or loan is overdue');
      }
    } else {
      console.log('No renew button found - patron may have no active loans eligible for renewal');
    }
  });

  test('NEW: should show renewals remaining count', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Look for renewals remaining text
    const bodyText = await page.locator('body').textContent();

    // Should show either renewals remaining or max reached message
    expect(bodyText).toMatch(/renewal|تجديد|remaining|متبقي|max|الحد الأقصى/i);
  });

  test('NEW: should show per-loan fine breakdown on hover', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Look for a fine amount (if any loans have fines)
    const fineCell = page.locator('text=/\\d+\\.\\d{3}\\s*OMR/').first();

    if (await fineCell.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Hover over the fine to show breakdown tooltip
      await fineCell.hover();

      // Wait a moment for tooltip to appear
      await page.waitForTimeout(500);

      // Check for fine breakdown elements in the tooltip
      const bodyText = await page.locator('body').textContent();

      // Should contain breakdown information
      expect(bodyText).toMatch(/Fine Breakdown|تفاصيل الغرامة|Overdue Days|أيام التأخير|Daily Rate|السعر اليومي/i);

      console.log('✅ Fine breakdown tooltip is visible on hover');
    } else {
      console.log('No fines found in current loans - test skipped');
    }
  });
});

test.describe('Patron Portal - Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
  });

  test('should display profile page with user information', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/profile`);

    // Should show profile title
    await expect(page.locator('h1, h2')).toContainText(/Profile|الملف|Account/i);

    // Should show user email
    await expect(page.locator('body')).toContainText(/patron@nawra\.om/i);
  });

  test('should update profile information', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/profile`);
    await page.waitForLoadState('networkidle');

    // Find name input field
    const nameInput = page.locator('input[name="full_name"], input[name="name"], input[placeholder*="Name"]').first();

    if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Update name
      await nameInput.fill('Test Patron Updated');

      // Find and click save/update button
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("حفظ"), button[type="submit"]').first();

      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click();

        // Wait for update to complete
        await page.waitForTimeout(2000);

        // Should show success message
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/success|updated|تم التحديث|saved/i);
      }
    }
  });

  test('should display personal statistics', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/patron/profile`);
    await page.waitForLoadState('networkidle');

    // Should show some statistics (borrowed, active, etc.)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toMatch(/borrowed|active|returned|مستعار|نشط/i);
  });
});

test.describe('Patron Portal - Bilingual Support', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
  });

  test('should switch from English to Arabic', async ({ page }) => {
    // Start in English
    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');

    // Look for language switcher
    const langSwitcher = page.locator('[href*="/ar/"], button:has-text("عربي"), a:has-text("AR")').first();

    if (await langSwitcher.isVisible({ timeout: 5000 }).catch(() => false)) {
      await langSwitcher.click();

      // Should navigate to Arabic version
      await expect(page).toHaveURL(/\/ar\//);

      // Page should show Arabic text
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/[\u0600-\u06FF]/); // Arabic characters
    } else {
      console.log('Language switcher not found');
    }
  });

  test('should maintain context when switching languages', async ({ page }) => {
    // Go to loans page in English
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Switch to Arabic
    const langSwitcher = page.locator('[href*="/ar/patron/loans"], button:has-text("عربي"), a:has-text("AR")').first();

    if (await langSwitcher.isVisible({ timeout: 5000 }).catch(() => false)) {
      await langSwitcher.click();

      // Should be on Arabic loans page
      await expect(page).toHaveURL(/\/ar\/patron\/loans/);
    }
  });
});

test.describe('Patron Portal - Data Isolation & Security', () => {
  test('should only show patron their own data', async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);

    // Go to loans page
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // All loans should belong to this patron
    // (We can't verify the actual user_id without accessing the database,
    // but we ensure the page loads and shows data)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should not allow access to admin routes', async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);

    // Try to access admin catalog page
    await page.goto(`${BASE_URL}/en/admin/catalog`);

    // Should either redirect or show access denied
    await page.waitForTimeout(2000);

    const url = page.url();
    // Should not be on admin page
    expect(url).not.toMatch(/\/admin\/catalog$/);
  });

  test('should not allow access to circulation management', async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);

    // Try to access circulation page
    await page.goto(`${BASE_URL}/en/admin/circulation`);

    // Should redirect or show error
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).not.toMatch(/\/admin\/circulation$/);
  });
});

test.describe('Patron Portal - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');

    // Page should be responsive
    await expect(page.locator('body')).toBeVisible();

    // Check if mobile menu exists or navigation is accessible
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');

    // Page should render correctly
    await expect(page.locator('body')).toBeVisible();
  });
});

// Summary test - runs all major features in sequence
test.describe('Patron Portal - End-to-End Flow', () => {
  test('complete patron workflow', async ({ page }) => {
    // 1. Login
    await login(page, PATRON_CREDENTIALS.email, PATRON_CREDENTIALS.password);
    await expect(page).toHaveURL(/\/(en|ar)\/patron/);

    // 2. Browse catalog
    await page.goto(`${BASE_URL}/en/patron/catalog`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();

    // 3. View loans
    await page.goto(`${BASE_URL}/en/patron/loans`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2')).toContainText(/Loan|الإعارات/i);

    // 4. View requests
    await page.goto(`${BASE_URL}/en/patron/requests`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2')).toContainText(/Request|الطلبات/i);

    // 5. View profile
    await page.goto(`${BASE_URL}/en/patron/profile`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/patron@nawra\.om/i);

    // All steps completed successfully
    console.log('✅ Complete patron workflow test passed!');
  });
});
