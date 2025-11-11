import { test, expect } from '@playwright/test';

test.describe('Manual API Test - Bypass Form', () => {
  test('test API call directly in browser context', async ({ page }) => {
    await page.goto('/en/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Inject and execute API call directly
    const result = await page.evaluate(async () => {
      try {
        // Import the auth API module
        const authModule = await import('@/lib/api/auth');

        console.log('[Manual Test] About to call login API');

        // Call login with invalid credentials
        const response = await authModule.login({
          email: 'nonexistent@example.com',
          password: 'SomePassword123',
          remember_me: false,
        });

        console.log('[Manual Test] Response:', response);
        return { success: true, response };
      } catch (error: any) {
        console.log('[Manual Test] Error caught:', error);
        console.log('[Manual Test] Error status:', error?.response?.status);
        console.log('[Manual Test] Error data:', error?.response?.data);
        return {
          success: false,
          error: {
            status: error?.response?.status,
            data: error?.response?.data,
            message: error?.message,
            code: error?.code
          }
        };
      }
    });

    console.log('===== TEST RESULT =====');
    console.log(JSON.stringify(result, null, 2));
    console.log('=======================');

    // Verify error was caught
    expect(result.success).toBe(false);
    expect(result.error?.status).toBe(401);
  });
});
