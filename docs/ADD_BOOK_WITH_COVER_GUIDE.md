# 📘 Add Book with Cover Image - Step-by-Step Guide

This guide shows you exactly how to add a new Oman-related book with cover image to your NAWRA system.

---

## 🎯 Quick Start Checklist

Before you begin:
- [ ] Login as librarian (librarian@nawra.om / Nawra2025!)
- [ ] Have book data ready (see options below)
- [ ] Have cover image URL ready (see image hosting section)

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Navigate to Add Book Form

1. Login at: https://nawra.onrender.com/en/login
2. Go to **Books** or **Catalog** section
3. Click **"Add Book"** or **"New Book"** button

### Step 2: Fill Basic Information Section

#### **books.form.basicInformation**

| Field | Value | Example |
|-------|-------|---------|
| **books.form.title** | Title in English | Traditional Omani Crafts and Heritage Arts |
| **books.form.titleAr** | Title in Arabic | الحرف التقليدية العُمانية والفنون التراثية |
| **books.form.author** | Author name | Fatima Al-Lawati |
| **books.form.authorAr** | Author in Arabic | فاطمة اللواتي |
| **books.form.isbn** | ISBN-13 format | 978-99969-2-567-8 |
| **books.form.barcode** | Barcode (optional) | Leave blank or use same as ISBN |
| **books.form.publisher** | Publisher name | Ministry of Heritage and Tourism, Oman |
| **books.form.publicationYear** | Year | 2024 |
| **books.form.category** | Select from dropdown | Culture / Arts |
| **books.form.language** | Select from dropdown | Bilingual or English |
| **books.form.pages** | Number of pages | 320 |
| **books.form.quantity** | Number of copies | 1 |
| **books.form.shelfLocation** | Shelf location code | A-101 or OM-CULT-001 |

### Step 3: Fill Description Section

#### **books.form.description**

| Field | Value |
|-------|-------|
| **books.form.description** | English description (see below) |
| **books.form.descriptionAr** | Arabic description (optional) |

**English Description:**
```
An illustrated exploration of Oman's traditional crafts including silver jewelry, pottery, weaving, and shipbuilding. This comprehensive guide features interviews with master craftsmen from Nizwa, Bahla, and Sur, accompanied by stunning photography of Omani heritage arts. Essential reading for understanding Oman's rich cultural legacy and artisan traditions.
```

**Arabic Description (Optional):**
```
استكشاف مصور للحرف التقليدية العُمانية بما في ذلك المجوهرات الفضية والفخار والنسيج وبناء السفن. يتضمن مقابلات مع الحرفيين الرئيسيين وصور مذهلة للفنون التراثية العُمانية.
```

### Step 4: Add Cover Images

#### **books.form.coverImages**

You need **image URLs** (not file uploads). Here's how:

#### Option A: Use Imgur (Fastest - Free)

1. Go to https://imgur.com
2. Click **"New post"** (no account needed)
3. Upload your book cover image
4. Right-click the uploaded image → **"Copy image address"**
5. Paste URL into **books.form.coverImageUrl**
6. (Optional) Use same URL for thumbnail or create smaller version

**Example URLs:**
- **coverImageUrl**: `https://i.imgur.com/abc123.jpg`
- **thumbnailUrl**: `https://i.imgur.com/abc123m.jpg` (add 'm' for medium size)

#### Option B: Use Cloudinary (Professional)

1. Sign up free at https://cloudinary.com
2. Upload image to Media Library
3. Copy the public URL
4. Paste into form

#### Option C: Use Existing Web Images

Search for Oman-related images and copy their URL:
- Unsplash: https://unsplash.com/s/photos/oman
- Pexels: https://www.pexels.com/search/oman/
- Right-click image → **"Copy image address"**

**⚠️ Important:**
- URLs must start with `https://`
- URLs must end with image extension (`.jpg`, `.png`, `.jpeg`)
- Images should be 600x900px or larger

### Step 5: Save the Book

1. Review all filled fields
2. Scroll to bottom of form
3. Click **"books.form.create"** button
4. Wait for success message

---

## 📚 READY-TO-USE BOOK DATA

### Option 1: Traditional Omani Crafts ⭐ RECOMMENDED

**Basic Information:**
```
Title: Traditional Omani Crafts and Heritage Arts
Title (Arabic): الحرف التقليدية العُمانية والفنون التراثية
Author: Fatima Al-Lawati
Author (Arabic): فاطمة اللواتي
ISBN: 978-99969-2-567-8
Publisher: Ministry of Heritage and Tourism, Oman
Year: 2024
Category: Culture (or Arts)
Language: Bilingual
Pages: 320
Quantity: 1
Shelf Location: OM-CULT-001
```

**Description:**
```
An illustrated exploration of Oman's traditional crafts including silver jewelry, pottery, weaving, and shipbuilding. Features interviews with master craftsmen from Nizwa, Bahla, and Sur, accompanied by stunning photography of Omani heritage arts.
```

**Cover Image URLs (Sample):**
- Search Unsplash for "Oman silver jewelry" or "Oman crafts"
- Example: `https://images.unsplash.com/photo-1234567890` (use actual image)

---

### Option 2: Forts and Castles of Oman

**Basic Information:**
```
Title: Forts and Castles of Oman: Guardians of History
Title (Arabic): حصون وقلاع عُمان: حراس التاريخ
Author: Mohammed Al-Harthy
Author (Arabic): محمد الحارثي
ISBN: 978-99969-3-890-1
Publisher: National Museum of Oman
Year: 2024
Category: History
Language: Bilingual
Pages: 280
Quantity: 1
Shelf Location: OM-HIST-002
```

**Description:**
```
A comprehensive guide to Oman's magnificent forts and castles, exploring their architectural significance and role in Omani history. Features detailed documentation of Nizwa Fort, Bahla Fort (UNESCO World Heritage), and over 50 other historical fortifications.
```

**Cover Image Search:**
- Search: "Nizwa Fort Oman" or "Bahla Fort"

---

### Option 3: Marine Biodiversity of Oman

**Basic Information:**
```
Title: Marine Biodiversity of the Sultanate of Oman
Title (Arabic): التنوع البيولوجي البحري في سلطنة عُمان
Author: Dr. Khalid Al-Akhzami
Author (Arabic): د. خالد الأخزمي
ISBN: 978-99969-4-123-6
Publisher: Sultan Qaboos University Press
Year: 2024
Category: Science
Language: English
Pages: 412
Quantity: 1
Shelf Location: OM-SCI-003
```

**Description:**
```
Scientific documentation of marine species in Omani waters, covering the Arabian Sea, Gulf of Oman, and Arabian Gulf regions. Features comprehensive research on coral reefs, endangered sea turtles, dolphins, whale sharks, and over 900 fish species.
```

**Cover Image Search:**
- Search: "Oman sea turtle" or "Oman coral reef"

---

## 🖼️ HOW TO GET COVER IMAGE URLS

### Method 1: Upload to Imgur (Recommended for Demo)

**Step-by-step:**

1. **Create or Download Book Cover Image:**
   - Use Canva (free): https://www.canva.com
   - Search "Book Cover" templates
   - Customize with your book title
   - Download as JPG or PNG

2. **Upload to Imgur:**
   ```
   1. Go to: https://imgur.com
   2. Click "New post"
   3. Drag & drop your cover image
   4. Wait for upload to complete
   5. Right-click on image
   6. Select "Copy image address"
   7. You'll get URL like: https://i.imgur.com/ABC123.jpg
   ```

3. **Use the URL:**
   - Paste in **coverImageUrl** field
   - For thumbnail, add 'm' before .jpg: https://i.imgur.com/ABC123m.jpg

### Method 2: Use Free Stock Images

**Unsplash (Best Quality):**
```
1. Go to: https://unsplash.com/s/photos/oman-fort
2. Find relevant image
3. Right-click on image
4. "Copy image address"
5. Paste into form
```

**Pexels:**
```
1. Go to: https://www.pexels.com/search/oman/
2. Click on image
3. Click "Download" → "Free Download"
4. Or right-click and copy image URL
```

### Method 3: Create Custom Cover with Canva

**Free Book Cover Creation:**

1. **Go to Canva.com** (free account)

2. **Search for "Book Cover"**

3. **Choose template** and customize:
   - Add English title
   - Add Arabic title (use Arabic keyboard)
   - Use Oman colors: Red, White, Green
   - Add relevant image (fort, crafts, etc.)

4. **Download:**
   - Click "Share" → "Download"
   - Format: JPG (recommended)
   - Quality: High

5. **Upload to Imgur** (see Method 1)

---

## ✅ COMPLETE EXAMPLE WALKTHROUGH

Here's a complete example for adding "Traditional Omani Crafts":

### 1. Prepare Cover Image

- Go to Canva.com
- Create book cover (or download sample Oman image)
- Upload to Imgur.com
- Copy URL: `https://i.imgur.com/XyZ789.jpg`

### 2. Fill Form - Basic Information

```
Title: Traditional Omani Crafts and Heritage Arts
Title Arabic: الحرف التقليدية العُمانية والفنون التراثية
Author: Fatima Al-Lawati
Author Arabic: فاطمة اللواتي
ISBN: 978-99969-2-567-8
Barcode: (leave blank)
Publisher: Ministry of Heritage and Tourism, Oman
Publication Year: 2024
Category: Culture (select from dropdown)
Language: books.language.english (select from dropdown)
Pages: 320
Quantity: 1
Shelf Location: OM-CULT-001
```

### 3. Fill Form - Description

```
Description: An illustrated exploration of Oman's traditional crafts including silver jewelry, pottery, weaving, and shipbuilding. Features interviews with master craftsmen from Nizwa, Bahla, and Sur, accompanied by stunning photography of Omani heritage arts.

Description Arabic: (optional - can leave blank)
```

### 4. Fill Form - Cover Images

```
Cover Image URL: https://i.imgur.com/XyZ789.jpg
Thumbnail URL: https://i.imgur.com/XyZ789m.jpg
```

### 5. Click Create

- Click blue **"books.form.create"** button
- Wait for success message
- Book is now in your catalog!

---

## 🎬 FOR VIDEO DEMO RECORDING

**Recording Tips:**

1. **Before Recording:**
   - Have all data ready (copy-paste from above)
   - Upload cover image to Imgur first
   - Copy all URLs to notepad
   - Close unnecessary browser tabs

2. **During Recording:**
   - Type slowly and clearly
   - Pause 2-3 seconds between fields
   - Show the cover image preview
   - Scroll up/down to show all fields filled

3. **After Adding Book:**
   - Go to catalog
   - Search for your new book
   - Show it appears in results
   - Click to view details with cover image

---

## 🔍 VERIFICATION CHECKLIST

After adding the book, verify:

- [ ] Book appears in catalog
- [ ] Cover image displays correctly
- [ ] Search finds the book
- [ ] All bilingual text displays (English/Arabic)
- [ ] Book details show all information
- [ ] Arabic title displays in RTL format

---

## ⚠️ COMMON ISSUES & SOLUTIONS

| Issue | Solution |
|-------|----------|
| Cover image not showing | Check URL is valid HTTPS image link |
| ISBN already exists | Use different ISBN from options above |
| Category dropdown empty | Select from available categories |
| Arabic text not showing | Make sure browser supports Arabic fonts |
| Form validation error | Check all required fields are filled |

---

## 📝 QUICK REFERENCE - Field Mapping

| Form Label | What to Enter | Example |
|------------|---------------|---------|
| books.form.title | English title | Traditional Omani Crafts and Heritage Arts |
| books.form.titleAr | Arabic title | الحرف التقليدية العُمانية والفنون التراثية |
| books.form.author | Author name | Fatima Al-Lawati |
| books.form.isbn | 13-digit ISBN | 978-99969-2-567-8 |
| books.form.publisher | Publisher | Ministry of Heritage and Tourism, Oman |
| books.form.publicationYear | Year | 2024 |
| books.form.pages | Number | 320 |
| books.form.shelfLocation | Location code | OM-CULT-001 |
| books.form.coverImageUrl | Image URL | https://i.imgur.com/abc.jpg |

---

**You're now ready to add a professional Oman-related book with cover image to NAWRA!** 🎉

For customer demo video recording, follow the timing and pacing guidelines in [LIBRARIAN_DEMO_SCRIPT.md](LIBRARIAN_DEMO_SCRIPT.md).
