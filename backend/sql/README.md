# NAWRA Database Setup Guide

## 📋 How to Run the SQL Schema in Supabase

### Step 1: Access Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one if you haven't)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Schema

1. Open the file `001_initial_schema.sql`
2. Copy all the SQL content
3. Paste it into the Supabase SQL Editor
4. Click **RUN** button (or press Ctrl/Cmd + Enter)

### Step 3: Verify Setup

After running the SQL, verify in **Table Editor**:
- ✅ `roles` table (5 roles)
- ✅ `users` table (5 test users)
- ✅ `refresh_tokens` table
- ✅ `audit_logs` table

---

## 👥 Default Test Users

After running the schema, you'll have these test accounts:

| Email | Password | Role | Type |
|-------|----------|------|------|
| admin@ministry.om | Admin@123 | Administrator | Staff |
| librarian@ministry.om | Admin@123 | Librarian | Staff |
| circulation@ministry.om | Admin@123 | Circulation Staff | Staff |
| cataloger@ministry.om | Admin@123 | Cataloger | Staff |
| patron@ministry.om | Admin@123 | Patron | Patron |

**⚠️ IMPORTANT**: Change these passwords in production!

---

## 🔐 Get Your Supabase Credentials

After creating your project, get these credentials:

### 1. Project URL & API Keys
Go to: **Settings → API**

Copy these values to your `backend/.env` file:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-public-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### 2. Database Connection String
Go to: **Settings → Database**

Copy the **Connection String** (make sure to replace `[YOUR-PASSWORD]` with your actual password):
```env
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
```

---

## 📊 Database Schema Overview

### Tables Created:

1. **roles** - User roles with permissions
   - Administrator
   - Librarian
   - Circulation Staff
   - Cataloger
   - Patron

2. **users** - System users (staff + patrons)
   - Includes authentication fields
   - Links to roles
   - Profile data in JSONB

3. **refresh_tokens** - JWT refresh token management
   - Secure token rotation
   - Automatic expiry

4. **audit_logs** - Activity tracking
   - All user actions logged
   - IP and user agent tracking

### Features Included:

- ✅ UUID primary keys
- ✅ Automatic timestamps
- ✅ Indexes for performance
- ✅ Foreign key constraints
- ✅ JSONB for flexible data
- ✅ Triggers for auto-updates
- ✅ Cleanup function for expired tokens

---

## 🔧 Maintenance

### Clean up expired refresh tokens:
```sql
SELECT cleanup_expired_refresh_tokens();
```

You can run this manually or set up a cron job in Supabase.

---

## 🚀 Next Steps

After setting up the database:

1. ✅ Update `backend/.env` with your Supabase credentials
2. ✅ Update `frontend/.env.local` with Supabase public URL and anon key
3. ✅ Test login with one of the default users
4. ✅ Change default passwords in production

---

## ❓ Troubleshooting

**Issue**: "relation already exists"
- **Solution**: Tables are already created. Safe to ignore or drop tables first.

**Issue**: "permission denied"
- **Solution**: Make sure you're using the service role key, not anon key.

**Issue**: Can't connect from backend
- **Solution**: Check your DATABASE_URL format and password.

---

For more help, see [Supabase Documentation](https://supabase.com/docs)
