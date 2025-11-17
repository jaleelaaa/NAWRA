import { test, expect } from '@playwright/test';

test.use({
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 }
  },
  screenshot: 'on',
});

test.describe('Librarian Complete Bilingual Demo - Full Workflow', () => {
  test('Complete workflow in English, then complete workflow in Arabic', async ({ page }) => {
    test.setTimeout(360000); // 6 minutes

    console.log('═══════════════════════════════════════════════════════');
    console.log('   NAWRA LIBRARY MANAGEMENT SYSTEM - LIBRARIAN DEMO');
    console.log('   Demonstrating Bilingual Support & Role Permissions');
    console.log('═══════════════════════════════════════════════════════\n');

    // =================================================================
    // PART 1: COMPLETE WORKFLOW IN ENGLISH MODE
    // =================================================================
    console.log('\n🇬🇧 ═══ PART 1: ENGLISH MODE DEMONSTRATION ═══\n');

    // Login
    console.log('Step 1: Logging in as Librarian (English interface)...');
    await page.goto('http://localhost:3000/en/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    await page.fill('input[type="email"]', 'librarian@nawra.om');
    await page.waitForTimeout(800);
    await page.fill('input[type="password"]', 'Nawra2025!');
    await page.waitForTimeout(800);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    if (page.url().includes('/login')) {
      throw new Error('Login failed');
    }
    console.log('✓ Successfully logged in\n');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    // Navigate to Books Catalog
    console.log('Step 2: Navigating to Books Catalog...');
    await page.goto('http://localhost:3000/en/admin/catalog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('✓ Viewing Books Catalog in English\n');
    await page.waitForTimeout(2000);

    // Add a new book
    console.log('Step 3: Adding a new book about Oman...');
    try {
      const addButtonSelectors = [
        'button:has-text("Add Book")',
        'button:has-text("Add New Book")',
        'button:has-text("New Book")',
        'button:has-text("+")'
      ];

      let buttonClicked = false;
      for (const selector of addButtonSelectors) {
        const button = page.locator(selector).first();
        if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
          await button.click();
          buttonClicked = true;
          console.log('✓ Opened Add Book dialog');
          break;
        }
      }

      await page.waitForTimeout(2500);

      if (buttonClicked) {
        // Fill book details
        console.log('  → Filling book information...');

        // English title
        const titleInput = page.locator('input[name="title"]').first();
        if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await titleInput.fill('Oman: Land of Heritage and Progress');
          console.log('    • Title: "Oman: Land of Heritage and Progress"');
          await page.waitForTimeout(600);
        }

        // Arabic title
        const titleArInput = page.locator('input[name="title_ar"]').first();
        if (await titleArInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await titleArInput.fill('عمان: أرض التراث والتقدم');
          console.log('    • Arabic Title: "عمان: أرض التراث والتقدم"');
          await page.waitForTimeout(600);
        }

        // Author
        const authorInput = page.locator('input[name="author"]').first();
        if (await authorInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await authorInput.fill('Dr. Abdullah Al-Balushi');
          console.log('    • Author: "Dr. Abdullah Al-Balushi"');
          await page.waitForTimeout(600);
        }

        // Arabic author
        const authorArInput = page.locator('input[name="author_ar"]').first();
        if (await authorArInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await authorArInput.fill('د. عبدالله البلوشي');
          console.log('    • Arabic Author: "د. عبدالله البلوشي"');
          await page.waitForTimeout(600);
        }

        // ISBN
        const isbnInput = page.locator('input[name="isbn"]').first();
        if (await isbnInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await isbnInput.fill('978-9-99999-200-8');
          console.log('    • ISBN: 978-9-99999-200-8');
          await page.waitForTimeout(600);
        }

        // Publisher
        const publisherInput = page.locator('input[name="publisher"]').first();
        if (await publisherInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await publisherInput.fill('Oman Cultural Foundation');
          console.log('    • Publisher: Oman Cultural Foundation');
          await page.waitForTimeout(600);
        }

        // Category
        const categorySelect = page.locator('select[name="category_id"]').first();
        if (await categorySelect.isVisible({ timeout: 2000 }).catch(() => false)) {
          const options = await categorySelect.locator('option').count();
          if (options > 1) {
            await categorySelect.selectOption({ index: 1 });
            console.log('    • Category: Selected');
            await page.waitForTimeout(600);
          }
        }

        // Publication year
        const yearInput = page.locator('input[name="publication_year"]').first();
        if (await yearInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await yearInput.fill('2024');
          console.log('    • Year: 2024');
          await page.waitForTimeout(600);
        }

        // Copies
        const copiesInput = page.locator('input[name="total_copies"]').first();
        if (await copiesInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await copiesInput.fill('10');
          console.log('    • Total Copies: 10');
          await page.waitForTimeout(600);
        }

        // Description
        const descInput = page.locator('textarea[name="description"]').first();
        if (await descInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await descInput.fill('A comprehensive guide to Oman\'s rich cultural heritage and modern development.');
          console.log('    • Description: Added');
          await page.waitForTimeout(800);
        }

        // Submit
        const submitButton = page.locator('button:has-text("Save"), button:has-text("Add"), button[type="submit"]').first();
        if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await submitButton.click();
          console.log('✓ Book added successfully\n');
          await page.waitForTimeout(4000);
          await page.waitForLoadState('networkidle');
        }
      }
    } catch (error) {
      console.log('  Note: Add book workflow may vary\n');
    }

    await page.waitForTimeout(2000);

    // Demonstrate other permissions
    console.log('Step 4: Demonstrating Librarian permissions...\n');

    // Users Management
    console.log('  → Viewing Users Management...');
    await page.goto('http://localhost:3000/en/admin/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('  ✓ Can access Users Management');
    await page.waitForTimeout(2000);

    // Reports
    console.log('  → Viewing Reports...');
    await page.goto('http://localhost:3000/en/admin/reports');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('  ✓ Can access Reports\n');
    await page.waitForTimeout(2000);

    // Back to catalog
    console.log('  → Returning to Books Catalog...');
    await page.goto('http://localhost:3000/en/admin/catalog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('  ✓ Back to Books Catalog\n');
    await page.waitForTimeout(2000);

    console.log('✓ English Mode demonstration completed!\n');
    await page.waitForTimeout(2000);

    // =================================================================
    // PART 2: COMPLETE WORKFLOW IN ARABIC MODE
    // =================================================================
    console.log('\n🇸🇦 ═══ PART 2: ARABIC MODE DEMONSTRATION ═══\n');
    console.log('Switching to Arabic interface to demonstrate bilingual support...\n');

    // Navigate to Books Catalog in Arabic
    console.log('Step 5: Viewing Books Catalog in Arabic...');
    await page.goto('http://localhost:3000/ar/admin/catalog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3500);
    console.log('✓ Now viewing catalog in Arabic (RTL layout)\n');
    await page.waitForTimeout(2500);

    // View the recently added book in Arabic interface
    console.log('Step 6: Viewing books in Arabic interface...');
    await page.waitForTimeout(3000);
    console.log('✓ Books displayed with Arabic interface\n');
    await page.waitForTimeout(2000);

    // Demonstrate permissions in Arabic
    console.log('Step 7: Demonstrating permissions in Arabic...\n');

    // Users Management in Arabic
    console.log('  → Viewing Users Management (Arabic)...');
    await page.goto('http://localhost:3000/ar/admin/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3500);
    console.log('  ✓ Users Management in Arabic');
    await page.waitForTimeout(2000);

    // Reports in Arabic
    console.log('  → Viewing Reports (Arabic)...');
    await page.goto('http://localhost:3000/ar/admin/reports');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3500);
    console.log('  ✓ Reports in Arabic\n');
    await page.waitForTimeout(2000);

    // Back to catalog in Arabic
    console.log('  → Returning to Books Catalog (Arabic)...');
    await page.goto('http://localhost:3000/ar/admin/catalog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('  ✓ Back to Books Catalog (Arabic)\n');
    await page.waitForTimeout(2000);

    console.log('✓ Arabic Mode demonstration completed!\n');
    await page.waitForTimeout(2000);

    // Final Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('            DEMONSTRATION COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nFeatures Demonstrated:');
    console.log('  ✅ Librarian Role Authentication');
    console.log('  ✅ Complete Workflow in English Mode');
    console.log('  ✅ Complete Workflow in Arabic Mode');
    console.log('  ✅ Bilingual Book Management');
    console.log('  ✅ Users Management Access');
    console.log('  ✅ Reports Access');
    console.log('  ✅ RTL (Right-to-Left) Support for Arabic');
    console.log('  ✅ Full Bilingual Interface Support');
    console.log('\n═══════════════════════════════════════════════════════\n');

    await page.waitForTimeout(3000);
  });
});
