# NAWRA Database Migrations

This directory contains all database migrations for the NAWRA Library Management System.

## Available Migrations

| # | File | Description | Status |
|---|------|-------------|--------|
| 002 | `002_create_books_tables.sql` | Books and categories tables | ✅ Applied |
| 003 | `003_create_circulation_tables.sql` | Circulation and reservations | ✅ Applied |
| 004 | `004_add_arabic_name_column.sql` | Arabic name support | ✅ Applied |
| 005 | `005_create_book_requests_table.sql` | **Patron book requests** | ⏳ **NEW** |

## Migration 005: Book Requests Table

**What it creates:**
- `book_requests` table for patron self-service
- 7 performance indexes
- 6 Row Level Security (RLS) policies
- 2 helper functions (expire requests, check duplicates)
- Auto-update triggers

**Purpose:**
Enable patrons to:
- Request available books
- Join waitlists for borrowed books
- View their requests
- Cancel pending/reserved requests

---

## How to Run Migrations

### Method 1: Supabase Dashboard (RECOMMENDED)

1. **Login to Supabase**
   - Go to https://supabase.com/dashboard
   - Select your NAWRA project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "+ New Query"

3. **Run Migration**
   - Open the migration file (e.g., `005_create_book_requests_table.sql`)
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Success**
   - Check for green success message
   - Run verification queries (included in migration file)

---

### Method 2: PostgreSQL Command Line

```bash
# Using psql
psql $DATABASE_URL -f migrations/005_create_book_requests_table.sql

# Or with credentials
psql -h db.your-project.supabase.co \
     -U postgres \
     -d postgres \
     -f migrations/005_create_book_requests_table.sql
```

---

### Method 3: Python Script

```bash
# From backend directory
cd backend

# Run migration script
python run_migration_005.py

# View verification queries
python run_migration_005.py --verify
```

**Note:** The Python script provides instructions but requires manual execution in Supabase SQL Editor due to Supabase API limitations.

---

### Method 4: Database GUI Tools

**pgAdmin:**
1. Connect to your Supabase database
2. Right-click on your database → Query Tool
3. Open file: `migrations/005_create_book_requests_table.sql`
4. Execute (F5)

**DBeaver:**
1. Connect to PostgreSQL database
2. SQL Editor → Open SQL Script
3. Select `005_create_book_requests_table.sql`
4. Execute (Ctrl+Enter)

**TablePlus:**
1. Connect to database
2. Menu → SQL → Run SQL file
3. Select migration file

---

## Verification

After running migration 005, verify with these queries:

### 1. Check Table Exists
```sql
SELECT table_name,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'book_requests') as column_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'book_requests';
```

Expected: `book_requests` with 10 columns

### 2. Check Columns
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'book_requests'
ORDER BY ordinal_position;
```

Expected columns:
- id (uuid)
- user_id (uuid)
- book_id (uuid)
- status (character varying)
- request_date (timestamp with time zone)
- expiry_date (timestamp with time zone)
- notes (text)
- cancelled_date (timestamp with time zone)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

### 3. Check Indexes
```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'book_requests'
ORDER BY indexname;
```

Expected: 7 indexes
- `book_requests_pkey`
- `idx_book_requests_active`
- `idx_book_requests_book_id`
- `idx_book_requests_book_status`
- `idx_book_requests_expiry_date`
- `idx_book_requests_request_date`
- `idx_book_requests_status`
- `idx_book_requests_user_id`
- `idx_book_requests_user_status`

### 4. Check RLS Policies
```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'book_requests'
ORDER BY policyname;
```

Expected: 6 policies
- "Staff can manage all book requests" (ALL)
- "Staff can view all book requests" (SELECT)
- "Users can create own book requests" (INSERT)
- "Users can delete own book requests" (DELETE)
- "Users can update own book requests" (UPDATE)
- "Users can view own book requests" (SELECT)

### 5. Test Helper Functions
```sql
-- Check functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('expire_old_book_requests', 'has_active_book_request')
AND routine_schema = 'public';
```

Expected: 2 functions

---

## Rollback

If you need to rollback migration 005:

```sql
-- WARNING: This will delete all book request data!
DROP TABLE IF EXISTS book_requests CASCADE;
DROP FUNCTION IF EXISTS expire_old_book_requests();
DROP FUNCTION IF EXISTS has_active_book_request(UUID, UUID);
```

**Note:** The `update_updated_at_column()` function is shared with other tables, so don't drop it.

---

## Troubleshooting

### Error: "relation 'book_requests' does not exist"

**Solution:** Migration hasn't been run yet. Execute the migration file.

### Error: "permission denied for table book_requests"

**Solution:** RLS policies are working correctly. Make sure you're authenticated as a patron or staff member when accessing via API.

### Error: "relation 'users' does not exist"

**Solution:** You need to run earlier migrations first. Run in order: 002 → 003 → 004 → 005.

### Error: "column 'auth.uid' does not exist"

**Solution:** This happens if you're not using Supabase auth. You may need to adjust RLS policies or disable RLS:

```sql
ALTER TABLE book_requests DISABLE ROW LEVEL SECURITY;
```

**Warning:** Disabling RLS removes data isolation security!

### Migration runs but table doesn't appear

**Solution:**
1. Check you're connected to the correct database
2. Verify schema is 'public'
3. Refresh your database client
4. Check Supabase logs for errors

---

## Testing After Migration

### 1. Test via API

```bash
# Create a book request
curl -X POST http://localhost:8000/api/v1/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "book_id": "some-book-uuid",
    "notes": "Please reserve for me"
  }'

# Get my requests
curl http://localhost:8000/api/v1/requests/my-requests \
  -H "Authorization: Bearer YOUR_TOKEN"

# Cancel a request
curl -X DELETE http://localhost:8000/api/v1/requests/{request_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test via Frontend

```bash
# Start frontend
cd frontend
npm run dev

# Navigate to:
# http://localhost:3000/en/patron/catalog
# - Request a book
# - View requests: http://localhost:3000/en/patron/requests
# - Cancel a request
```

### 3. Test with Playwright

```bash
# Run patron request tests
npx playwright test tests/patron-requests.spec.ts

# Run all patron tests
npx playwright test tests/patron-*.spec.ts
```

---

## Database Maintenance

### Expire Old Reservations

Run this periodically (e.g., via cron job):

```sql
SELECT expire_old_book_requests();
```

This will automatically cancel reserved books that passed their expiry date.

### Check for Duplicate Requests

```sql
SELECT user_id, book_id, COUNT(*) as request_count
FROM book_requests
WHERE status IN ('pending', 'reserved')
GROUP BY user_id, book_id
HAVING COUNT(*) > 1;
```

Should return 0 rows (duplicates are prevented by application logic).

### View Request Statistics

```sql
SELECT
    status,
    COUNT(*) as count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT book_id) as unique_books
FROM book_requests
GROUP BY status
ORDER BY count DESC;
```

---

## Schema Documentation

### book_requests Table

| Column | Type | Null | Description |
|--------|------|------|-------------|
| id | UUID | NO | Primary key |
| user_id | UUID | NO | Patron who made request (FK to users) |
| book_id | UUID | NO | Requested book (FK to books) |
| status | VARCHAR(20) | NO | pending, reserved, fulfilled, cancelled |
| request_date | TIMESTAMP | NO | When request was created |
| expiry_date | TIMESTAMP | NO | When reservation expires (7 days) |
| notes | TEXT | YES | Optional patron notes (max 500 chars) |
| cancelled_date | TIMESTAMP | YES | When request was cancelled |
| created_at | TIMESTAMP | NO | Record creation time |
| updated_at | TIMESTAMP | NO | Record last update time |

### Constraints

- **Primary Key:** `id`
- **Foreign Keys:**
  - `user_id` → `users.id` (ON DELETE CASCADE)
  - `book_id` → `books.id` (ON DELETE CASCADE)
- **Check Constraints:**
  - `status` must be: pending, reserved, fulfilled, or cancelled
  - `notes` max length: 500 characters
  - `expiry_date` must be after `request_date`
  - `cancelled_date` required if status is cancelled

### Indexes

- **Primary:** `book_requests_pkey` on `id`
- **Foreign Keys:** `user_id`, `book_id`
- **Status:** `status`, `status + user_id`, `status + book_id`
- **Dates:** `request_date DESC`, `expiry_date` (for active only)
- **Active Requests:** `user_id + book_id` (for pending/reserved only)

---

## Environment Variables

Required in `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

---

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Review error messages carefully
3. Verify prerequisites are met
4. Check RLS policies aren't blocking expected access
5. Consult NAWRA development team

---

## Migration History

- **005** (2025-11-17): Book requests table for patron self-service
- **004** (Previous): Arabic name column support
- **003** (Previous): Circulation and reservations tables
- **002** (Previous): Books and categories tables

---

**Last Updated:** 2025-11-17
**NAWRA Version:** 1.0.0
**Database:** PostgreSQL (via Supabase)
