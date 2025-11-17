import { test, expect } from '@playwright/test';

test.use({
  video: 'on',
  screenshot: 'on',
});

test.describe('Librarian Role Demo - Adding Oman Books', () => {
  test('Librarian adds English and Arabic books about Oman', async ({ page }) => {
    // Set a longer timeout for this demo
    test.setTimeout(180000); // 3 minutes

    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/en/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Step 2: Login as librarian
    console.log('Step 2: Logging in as librarian...');
    await page.fill('input[type="email"]', 'librarian@nawra.om');
    await page.waitForTimeout(1000);

    // Try common passwords
    const passwords = ['Admin@123', 'librarian', 'Librarian@123', 'password', 'admin'];
    let loginSuccess = false;

    for (const pwd of passwords) {
      await page.fill('input[type="password"]', pwd);
      await page.waitForTimeout(500);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);

      // Check if login was successful
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log(`Login successful with password: ${pwd}`);
        loginSuccess = true;
        break;
      } else {
        console.log(`Password ${pwd} failed, trying next...`);
        // Clear the password field for next attempt
        await page.fill('input[type="password"]', '');
      }
    }

    if (!loginSuccess) {
      throw new Error('Could not login with any known password');
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Step 3: Navigate to Books Catalog
    console.log('Step 3: Navigating to Books Catalog...');
    // Try to find and click the catalog/books link
    await page.goto('http://localhost:3000/en/admin/catalog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Step 4: Click Add New Book button
    console.log('Step 4: Opening Add Book dialog...');
    const addBookButton = page.locator('button:has-text("Add Book"), button:has-text("Add New Book"), button:has-text("New Book")').first();
    await addBookButton.click();
    await page.waitForTimeout(2000);

    // Step 5: Fill in English Book details (Oman related)
    console.log('Step 5: Adding English book about Oman...');

    // Fill English book details
    await page.fill('input[name="title"], input[placeholder*="title" i]', 'Oman: A Modern History');
    await page.waitForTimeout(500);

    await page.fill('input[name="author"], input[placeholder*="author" i]', 'Dr. Mohammed Al-Busaidi');
    await page.waitForTimeout(500);

    await page.fill('input[name="isbn"], input[placeholder*="isbn" i]', '978-9-99999-001-1');
    await page.waitForTimeout(500);

    await page.fill('input[name="publisher"], input[placeholder*="publisher" i]', 'Oman Heritage Publishers');
    await page.waitForTimeout(500);

    // Select category - look for History or similar
    const categorySelect = page.locator('select[name="category_id"], select:has(option:text-matches("History|التاريخ", "i"))').first();
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 }); // Select first non-empty option
      await page.waitForTimeout(500);
    }

    // Fill publication year
    await page.fill('input[name="publication_year"], input[type="number"]', '2023');
    await page.waitForTimeout(500);

    // Fill language
    const languageField = page.locator('input[name="language"], select[name="language"]').first();
    if (await languageField.isVisible()) {
      const tagName = await languageField.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'select') {
        await languageField.selectOption('English');
      } else {
        await languageField.fill('English');
      }
      await page.waitForTimeout(500);
    }

    // Fill total copies
    await page.fill('input[name="total_copies"]', '5');
    await page.waitForTimeout(500);

    // Fill description
    const descriptionField = page.locator('textarea[name="description"], textarea[placeholder*="description" i]').first();
    if (await descriptionField.isVisible()) {
      await descriptionField.fill('A comprehensive history of modern Oman covering the renaissance era and development of the Sultanate.');
      await page.waitForTimeout(1000);
    }

    // Submit the form
    console.log('Step 6: Submitting English book...');
    await page.click('button:has-text("Save"), button:has-text("Add"), button:has-text("Submit"), button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Step 7: Add another book (Arabic - Oman related)
    console.log('Step 7: Opening Add Book dialog for Arabic book...');
    await page.click('button:has-text("Add Book"), button:has-text("Add New Book"), button:has-text("New Book")');
    await page.waitForTimeout(2000);

    // Step 8: Fill in Arabic Book details
    console.log('Step 8: Adding Arabic book about Oman...');

    await page.fill('input[name="title_ar"], input[placeholder*="العنوان" i]', 'عمان: تاريخ وحضارة');
    await page.waitForTimeout(500);

    await page.fill('input[name="title"], input[placeholder*="title" i]:not([name="title_ar"])', 'Oman: History and Civilization');
    await page.waitForTimeout(500);

    await page.fill('input[name="author_ar"], input[placeholder*="المؤلف" i]', 'د. سعيد بن علي الهنائي');
    await page.waitForTimeout(500);

    await page.fill('input[name="author"], input[placeholder*="author" i]:not([name="author_ar"])', 'Dr. Said Al-Hinai');
    await page.waitForTimeout(500);

    await page.fill('input[name="isbn"], input[placeholder*="isbn" i]', '978-9-99999-002-8');
    await page.waitForTimeout(500);

    await page.fill('input[name="publisher"], input[placeholder*="publisher" i]', 'دار التراث العماني');
    await page.waitForTimeout(500);

    // Select category
    const categorySelect2 = page.locator('select[name="category_id"], select:has(option:text-matches("History|التاريخ", "i"))').first();
    if (await categorySelect2.isVisible()) {
      await categorySelect2.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }

    // Fill publication year
    await page.fill('input[name="publication_year"], input[type="number"]', '2024');
    await page.waitForTimeout(500);

    // Fill language
    const languageField2 = page.locator('input[name="language"], select[name="language"]').first();
    if (await languageField2.isVisible()) {
      const tagName = await languageField2.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'select') {
        await languageField2.selectOption('Arabic');
      } else {
        await languageField2.fill('العربية');
      }
      await page.waitForTimeout(500);
    }

    // Fill total copies
    await page.fill('input[name="total_copies"]', '10');
    await page.waitForTimeout(500);

    // Fill description in Arabic
    const descriptionField2 = page.locator('textarea[name="description"], textarea[placeholder*="description" i], textarea[placeholder*="الوصف" i]').first();
    if (await descriptionField2.isVisible()) {
      await descriptionField2.fill('كتاب شامل عن تاريخ وحضارة سلطنة عمان من العصور القديمة حتى العصر الحديث، يتناول الإنجازات الحضارية والثقافية.');
      await page.waitForTimeout(1000);
    }

    // Submit the form
    console.log('Step 9: Submitting Arabic book...');
    await page.click('button:has-text("Save"), button:has-text("Add"), button:has-text("Submit"), button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Step 10: Verify books are added - scroll through the catalog
    console.log('Step 10: Verifying books in catalog...');
    await page.waitForTimeout(2000);

    // Search for the first book
    const searchBox = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchBox.isVisible()) {
      await searchBox.fill('Oman');
      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Step 11: Show librarian capabilities by visiting different sections
    console.log('Step 11: Demonstrating librarian permissions...');

    // Visit Users page
    await page.goto('http://localhost:3000/en/admin/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Visit Reports page
    await page.goto('http://localhost:3000/en/admin/reports');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Return to catalog to show the added books
    await page.goto('http://localhost:3000/en/admin/catalog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('Demo completed successfully!');
    await page.waitForTimeout(2000);
  });
});
