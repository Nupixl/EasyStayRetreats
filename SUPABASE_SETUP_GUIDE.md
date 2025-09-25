# 🚀 Complete Supabase Setup Guide

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your account
3. **Create a new project:**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `easystay-retreats`
   - Set a strong database password
   - Choose a region close to you
   - Click "Create new project"

## Step 2: Get Your Credentials

Once your project is created (takes 1-2 minutes):

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click on "API" tab**
3. **Copy these values:**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Create Environment File

Create `.env.local` in your project root:

```bash
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

```

## Step 4: Set Up Database Schema

1. **Go to your Supabase dashboard**
2. **Click on "SQL Editor" in the sidebar**
3. **Click "New Query"**
4. **Copy and paste the entire contents of `supabase-schema.sql`**
5. **Click "Run" to execute the SQL**

This creates all the tables, relationships, and security policies.

## Step 5: Migrate Your Data

Run the migration script:

```bash
node scripts/migrate-to-supabase.js
```

This will:
- Create all unique amenities from your data
- Create all unique hosts from your data  
- Migrate all properties with relationships
- Show progress for each property

## Step 6: Test the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the API directly:**
   - Visit `http://localhost:3000/api/properties`
   - You should see your property data from Supabase

3. **Test the application:**
   - Visit `http://localhost:3000`
   - Properties should load from Supabase
   - Map search should work with Supabase data

## 🔧 Troubleshooting

### If you see "Supabase not configured":
- Check that `.env.local` exists and has the correct values
- Restart the dev server after adding env vars
- Verify the Supabase project is active

### If migration fails:
- Check that the database schema was created successfully
- Look at the error message and fix the issue
- Ensure your Supabase project is fully initialized

### If API returns errors:
- Check Supabase dashboard → Logs → API for specific errors
- Verify RLS policies are set up correctly
- Test with a simple query in the SQL editor

## ✅ Success Indicators

You'll know it's working when:
- ✅ No "Supabase not configured" messages in console
- ✅ API returns data from Supabase (not JSON fallback)
- ✅ Properties load correctly in the app
- ✅ Map search works with Supabase data

## 🆘 Need Help?

If you encounter issues:
1. Check the Supabase dashboard for error logs
2. Verify all environment variables are set correctly
3. Ensure the database schema was created successfully
4. Test the migration script step by step
