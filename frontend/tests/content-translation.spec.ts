import { test, expect } from '@playwright/test';

test.describe('Content Translation', () => {
  test('should display English content on /en/login', async ({ page }) => {
    await page.goto('/en/login');
    await expect(page).toHaveURL(/\/en\/login/);

    // Check for English text content
    await expect(page.getByText('Sign In to Your Account')).toBeVisible();
    await expect(page.getByText('Access the national library catalog and management system')).toBeVisible();
    await expect(page.getByText('Email Address')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Sultanate Library System')).toBeVisible();

    // Check that page direction is LTR
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');

    console.log('✓ English content verified on /en/login');
  });

  test('should display Arabic content on /ar/login', async ({ page }) => {
    await page.goto('/ar/login');
    await expect(page).toHaveURL(/\/ar\/login/);

    // Check for Arabic text content
    await expect(page.getByText('تسجيل الدخول إلى حسابك')).toBeVisible();
    await expect(page.getByText('الوصول إلى فهرس المكتبة الوطنية ونظام الإدارة')).toBeVisible();
    await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
    await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();
    await expect(page.getByText('نظام المكتبة السلطانية')).toBeVisible();

    // Check that page direction is RTL
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');

    console.log('✓ Arabic content verified on /ar/login');
  });

  test('should switch content when toggling languages', async ({ page }) => {
    // Start on Arabic page
    await page.goto('/ar/login');
    console.log('1. Started on Arabic page');

    // Verify Arabic content
    await expect(page.getByText('تسجيل الدخول إلى حسابك')).toBeVisible();
    let html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    console.log('2. Arabic content confirmed');

    // Switch to English
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('3. Switched to English');

    // Verify English content
    await expect(page).toHaveURL(/\/en\/login/);
    await expect(page.getByText('Sign In to Your Account')).toBeVisible();
    html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    console.log('4. English content confirmed');

    // Switch back to Arabic
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('5. Switched back to Arabic');

    // Verify Arabic content again
    await expect(page).toHaveURL(/\/ar\/login/);
    await expect(page.getByText('تسجيل الدخول إلى حسابك')).toBeVisible();
    html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    console.log('6. Arabic content confirmed again');

    // Switch to English again
    await page.locator('a:has(svg.lucide-globe)').click();
    await page.waitForLoadState('networkidle');
    console.log('7. Switched to English again');

    // Verify English content again
    await expect(page).toHaveURL(/\/en\/login/);
    await expect(page.getByText('Sign In to Your Account')).toBeVisible();
    html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    console.log('8. English content confirmed again');

    console.log('✓ All language toggles verified successfully');
  });
});
