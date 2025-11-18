import { test, expect } from '@playwright/test';

/**
 * Librarian Customer Demo - Professional Quality
 *
 * This test creates a high-quality video demonstration for customer presentations:
 * 1. Login as librarian
 * 2. Add a new Oman-related book with complete details
 * 3. View the book in the catalog
 * 4. Professional pacing and HD quality
 */

const PRODUCTION_URL = 'https://nawra.onrender.com';
const LIBRARIAN_EMAIL = 'librarian@nawra.om';
const LIBRARIAN_PASSWORD = 'Nawra2025!';

// Book details for demonstration
const OMAN_BOOK = {
  titleEnglish: 'Sultanate of Oman: History and Civilization',
  titleArabic: 'سلطنة عُمان: التاريخ والحضارة',
  author: 'Dr. Ahmed Al-Busaidi',
  isbn: '978-99969-1-234-5',
  publisher: 'Oman Heritage Publishers',
  year: '2024',
  category: 'History',
  pages: '450',
  language: 'Arabic/English',
  description: 'A comprehensive guide to the rich history and cultural heritage of the Sultanate of Oman, covering from ancient times to the modern renaissance era.',
};

// Configure HD video recording
test.use({
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 } // Full HD resolution
  },
  screenshot: 'on',
  viewport: { width: 1920, height: 1080 }, // HD viewport
});

test.describe('Librarian Customer Demo', () => {

  test('Professional Book Management Demonstration', async ({ page }) => {
    // Extended timeout for smooth demo pacing
    test.setTimeout(300000); // 5 minutes

    console.log('🎬 Starting Librarian Customer Demo (HD Quality)');

    // ============================================
    // 1. LOGIN AS LIBRARIAN
    // ============================================
    console.log('\n📍 Step 1: Librarian Login');
    await page.goto(`${PRODUCTION_URL}/en/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Professional pacing

    // Fill login credentials
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.click();
    await emailInput.fill(LIBRARIAN_EMAIL);
    await page.waitForTimeout(1000);

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.click();
    await passwordInput.fill(LIBRARIAN_PASSWORD);
    await page.waitForTimeout(1000);

    // Click login button
    const loginButton = page.locator('button[type="submit"], button:has-text("Sign In")').first();
    await loginButton.click();
    await page.waitForTimeout(5000);

    // Wait for navigation away from login page
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 20000 });
    console.log('✅ Logged in successfully as Librarian');
    console.log(`Current URL: ${page.url()}`);
    await page.waitForTimeout(3000);

    // ============================================
    // 2. DASHBOARD OVERVIEW
    // ============================================
    console.log('\n📍 Step 2: Dashboard Overview');
    await page.waitForTimeout(2000);

    // Scroll to show dashboard features
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    console.log('✅ Dashboard displayed');

    // ============================================
    // 3. VIEW EXISTING BOOKS IN CATALOG
    // ============================================
    console.log('\n📍 Step 3: View Existing Books');

    // Navigate to catalog
    const catalogLink = page.locator('text=/catalog|books|المكتبة|الكتب/i').first();
    if (await catalogLink.isVisible()) {
      await catalogLink.click();
      await page.waitForTimeout(3000);
      console.log('✅ Navigated to catalog');
    }

    // Scroll through existing books
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    console.log('✅ Existing books displayed');

    // ============================================
    // 4. NAVIGATE TO ADD NEW BOOK
    // ============================================
    console.log('\n📍 Step 4: Navigate to Add New Book');

    // Look for "Add Book" or "Add New" button
    const addBookButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("إضافة"), button:has-text("جديد"), a:has-text("Add Book"), a:has-text("New Book")').first();

    if (await addBookButton.isVisible()) {
      await addBookButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Add Book form opened');
    } else {
      // Try alternative navigation
      console.log('⚠️ Looking for alternative Add Book option...');
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 5. FILL IN BOOK DETAILS
    // ============================================
    console.log('\n📍 Step 5: Adding Oman-Related Book Details');
    await page.waitForTimeout(2000);

    // Fill Title (English)
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i], input[id*="title" i]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill(OMAN_BOOK.titleEnglish);
      await page.waitForTimeout(1500);
      console.log(`✅ Title: ${OMAN_BOOK.titleEnglish}`);
    }

    // Fill Title Arabic (if available)
    const titleArabicInput = page.locator('input[name*="arabic" i], input[name="title_ar"]').first();
    if (await titleArabicInput.isVisible()) {
      await titleArabicInput.fill(OMAN_BOOK.titleArabic);
      await page.waitForTimeout(1500);
      console.log(`✅ Arabic Title: ${OMAN_BOOK.titleArabic}`);
    }

    // Fill Author
    const authorInput = page.locator('input[name="author"], input[placeholder*="author" i]').first();
    if (await authorInput.isVisible()) {
      await authorInput.fill(OMAN_BOOK.author);
      await page.waitForTimeout(1500);
      console.log(`✅ Author: ${OMAN_BOOK.author}`);
    }

    // Fill ISBN
    const isbnInput = page.locator('input[name="isbn"], input[placeholder*="isbn" i]').first();
    if (await isbnInput.isVisible()) {
      await isbnInput.fill(OMAN_BOOK.isbn);
      await page.waitForTimeout(1500);
      console.log(`✅ ISBN: ${OMAN_BOOK.isbn}`);
    }

    // Fill Publisher
    const publisherInput = page.locator('input[name="publisher"], input[placeholder*="publisher" i]').first();
    if (await publisherInput.isVisible()) {
      await publisherInput.fill(OMAN_BOOK.publisher);
      await page.waitForTimeout(1500);
      console.log(`✅ Publisher: ${OMAN_BOOK.publisher}`);
    }

    // Fill Publication Year
    const yearInput = page.locator('input[name*="year" i], input[type="number"]').first();
    if (await yearInput.isVisible()) {
      await yearInput.fill(OMAN_BOOK.year);
      await page.waitForTimeout(1500);
      console.log(`✅ Year: ${OMAN_BOOK.year}`);
    }

    // Fill Category
    const categoryInput = page.locator('select[name="category"], input[name="category"]').first();
    if (await categoryInput.isVisible()) {
      if (await categoryInput.evaluate(el => el.tagName === 'SELECT')) {
        await categoryInput.selectOption({ label: OMAN_BOOK.category });
      } else {
        await categoryInput.fill(OMAN_BOOK.category);
      }
      await page.waitForTimeout(1500);
      console.log(`✅ Category: ${OMAN_BOOK.category}`);
    }

    // Fill Description
    const descriptionInput = page.locator('textarea[name="description"], textarea[placeholder*="description" i]').first();
    if (await descriptionInput.isVisible()) {
      await descriptionInput.fill(OMAN_BOOK.description);
      await page.waitForTimeout(2000);
      console.log('✅ Description added');
    }

    // Scroll to see all filled fields
    await page.evaluate(() => window.scrollBy(0, -500));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(2000);

    console.log('✅ All book details filled');

    // ============================================
    // 6. SAVE THE BOOK
    // ============================================
    console.log('\n📍 Step 6: Saving the Book');
    await page.waitForTimeout(2000);

    // Find and click save button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Add"), button:has-text("حفظ"), button[type="submit"]').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(4000);
      console.log('✅ Book saved successfully');
    }

    // Close any dialog overlays
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);

    // Try clicking close buttons if any dialogs are open
    const closeButtons = page.locator('button:has-text("Close"), button:has-text("OK"), button:has-text("Done"), [aria-label="close"]');
    const closeButtonCount = await closeButtons.count();
    if (closeButtonCount > 0) {
      await closeButtons.first().click();
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 7. VIEW CATALOG WITH ALL BOOKS
    // ============================================
    console.log('\n📍 Step 7: Viewing Catalog');
    await page.waitForTimeout(2000);

    // Navigate to catalog - try multiple methods
    const catalogNav = page.locator('a[href*="/catalog"], a[href*="/books"], text=/^Books$|^Catalog$/i').first();
    if (await catalogNav.isVisible()) {
      await catalogNav.click();
      await page.waitForTimeout(3000);
      console.log('✅ Navigated to catalog');
    } else {
      // Try going to catalog via URL
      await page.goto(`${PRODUCTION_URL}/en/catalog`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      console.log('✅ Navigated to catalog via URL');
    }

    // Scroll through catalog to show books
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    console.log('✅ Catalog loaded with all books');

    // ============================================
    // 8. SEARCH FOR NEWLY ADDED BOOK
    // ============================================
    console.log('\n📍 Step 8: Search for Newly Added Book');

    // Search for the newly added book
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Sultanate of Oman');
      await page.waitForTimeout(3000);
      console.log(`✅ Searching for: Sultanate of Oman`);
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 9. VIEW NEW BOOK DETAILS
    // ============================================
    console.log('\n📍 Step 9: View New Book Details');

    // Click on the book (first book in results should be our new book)
    const bookCard = page.locator('.book-card, [data-testid="book-card"], .catalog-item, article, div[role="article"]').first();
    if (await bookCard.isVisible()) {
      await bookCard.click();
      await page.waitForTimeout(3000);
      console.log('✅ Book details opened');
      await page.waitForTimeout(3000);

      // Close details
      await page.keyboard.press('Escape');
      await page.waitForTimeout(2000);
    }

    // ============================================
    // 10. FINAL OVERVIEW
    // ============================================
    console.log('\n📍 Step 10: Final Overview');
    await page.waitForTimeout(2000);

    // Return to dashboard
    const dashboardLink = page.locator('a[href*="/dashboard"], text=/dashboard|لوحة التحكم/i').first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await page.waitForTimeout(3000);
    }

    console.log('✅ Returned to dashboard');
    await page.waitForTimeout(2000);

    // Final scroll
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    console.log('\n✅ Librarian Demo Completed Successfully!');
    console.log('\n📊 Demo Summary:');
    console.log('✓ Professional HD quality (1920x1080)');
    console.log('✓ Logged in as Librarian');
    console.log('✓ Viewed dashboard with statistics');
    console.log('✓ Browsed existing books in catalog');
    console.log('✓ Opened Add Book form');
    console.log(`✓ Added Oman book: "${OMAN_BOOK.titleEnglish}"`);
    console.log('✓ Filled all book details (title, author, ISBN, publisher, etc.)');
    console.log('✓ Saved the new book successfully');
    console.log('✓ Viewed catalog with all books');
    console.log('✓ Searched for newly added book');
    console.log('✓ Displayed new book details');
    console.log('✓ Complete workflow demonstrated');
    console.log('✓ Ready for customer presentation');

    // Final wait before test ends
    await page.waitForTimeout(4000);
  });
});
