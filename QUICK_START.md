# 🚀 Quick Start Guide - EasyStay Retreats

## Current Status: ✅ Working with Fallback Data

Your application is now working with the original JSON data as a fallback while you set up Supabase. The error you saw should be resolved!

## Option 1: Continue with JSON Data (Immediate Solution)

Your app is already working! The API endpoints now automatically fall back to the original `data.json` file when Supabase isn't configured. You can:

1. **Test the application now:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` - everything should work!

## Option 2: Set Up Supabase (Recommended for Production)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Note down your project URL and API keys

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy this template and replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create all tables

### Step 4: Migrate Your Data

```bash
npm run migrate-supabase
```

This will automatically migrate all your existing property data to Supabase.

### Step 5: Test Supabase Integration

```bash
npm run dev
```

The app will now use Supabase instead of the JSON fallback.

## 🔧 Troubleshooting

### If you still see errors:

1. **Check the browser console** for specific error messages
2. **Verify your data.json exists** in the project root
3. **Restart the development server:**
   ```bash
   npm run dev
   ```

### Common Issues:

- **"We couldn't load retreats right now"** - This should be fixed now with the fallback
- **Map not loading** - Check if you have a Google Maps API key set
- **Properties not showing** - Verify `data.json` exists and has data

## 📊 What's Working Now

✅ **Property listings** - Load from JSON fallback  
✅ **Map search** - Works with original logic  
✅ **Individual property pages** - Load from JSON fallback  
✅ **All existing functionality** - Preserved exactly  

## 🚀 Next Steps

1. **Test the application** - Everything should work immediately
2. **Set up Supabase** (optional) - For production scalability
3. **Customize** - Add new features as needed

## 📞 Need Help?

If you're still seeing issues:

1. Check the terminal/console for error messages
2. Verify all files are in the correct locations
3. Ensure `data.json` contains your property data
4. Try restarting the development server

The application should now work perfectly with your existing data!
