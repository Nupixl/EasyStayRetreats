# EasyStay Retreats - Unified Schema Migration Guide

This guide walks you through the complete migration from separate `properties` and `App-Properties` tables to a unified schema that consolidates all property data.

## 🎯 Migration Overview

**Goal**: Merge `properties` (legacy template data) and `App-Properties` (EasyStay dataset) into a single `unified_properties` table with proper relational structure.

**Benefits**:
- Single source of truth for all property data
- Proper relational structure with images, hosts, reviews, amenities, categories
- Better performance with optimized queries
- Easier maintenance and updates
- Support for advanced features like availability management

## 📋 Prerequisites

1. **Supabase Project**: Ensure your Supabase project is accessible
2. **Environment Variables**: Verify `.env.local` contains:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. **Backup**: Always backup your data before starting

## 🚀 Migration Steps

### Phase 0: Prepare & Safeguard

#### Step 1: Create Data Backups
```bash
# Run the comprehensive backup script
node scripts/backup-supabase-data.js
```

This creates a timestamped backup in `backups/backup-YYYY-MM-DDTHH-MM-SS/` containing:
- JSON and CSV exports of all tables
- Database schema information
- RLS policies
- SQL schema backup

#### Step 2: Analyze Schema Differences
```bash
# Analyze differences between tables
node scripts/analyze-schema-differences.js
```

This will show you:
- Column differences between tables
- Data type mismatches
- Sample data from both tables
- Migration recommendations

### Phase 1: Create Unified Schema

#### Step 3: Create the Unified Schema
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `scripts/generate-unified-schema.sql`
4. Execute the SQL

This creates:
- `unified_properties` table with all necessary columns
- Supporting tables: `property_images`, `hosts`, `property_hosts`, `reviews`, `amenities`, `property_amenities`, `categories`, `property_categories`, `property_availability`
- Proper indexes for performance
- RLS policies for security
- Default amenities and categories
- A comprehensive view `properties_with_details`

### Phase 2: Migrate Data

#### Step 4: Run the Migration Script
```bash
# Migrate data from both tables to unified schema
node scripts/migrate-to-unified-schema.js
```

This script:
- Migrates all `App-Properties` data (your main dataset)
- Migrates all `properties` data (avoiding duplicates)
- Creates default host and links all properties
- Handles image migration
- Validates the migration

#### Step 5: Update API Endpoints
```bash
# Update API endpoints to use unified schema
node scripts/update-api-endpoints.js
```

This updates:
- `/api/properties` - List all properties
- `/api/properties/search` - Map-based search
- `/api/properties/[id]` - Individual property details

### Phase 3: Testing & Validation

#### Step 6: Test the Application
1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test key functionality**:
   - Homepage loads with property listings
   - Map search works correctly
   - Property detail pages load
   - Fallback mechanism works if Supabase is unavailable

3. **Verify data integrity**:
   - Check that all properties are visible
   - Verify images are loading
   - Confirm search results are accurate
   - Test with different map bounds

#### Step 7: Performance Testing
- Test with large datasets
- Verify query performance
- Check for any slow queries in Supabase logs

### Phase 4: Production Rollout

#### Step 8: Deploy to Production
1. **Update production environment variables**
2. **Run migration scripts on production**
3. **Update production API endpoints**
4. **Test production functionality**

#### Step 9: Cleanup (Optional)
Once everything is working:
- Archive old tables
- Remove unused columns
- Optimize indexes

## 🔧 Troubleshooting

### Common Issues

#### 1. "Table does not exist" errors
**Solution**: Ensure you've run the unified schema SQL in Supabase

#### 2. RLS policy errors
**Solution**: Check that RLS policies are created correctly in the schema

#### 3. API returning empty results
**Solution**: 
- Verify `is_active = true` in your data
- Check that the unified_properties table has data
- Test the Supabase connection

#### 4. Images not loading
**Solution**: 
- Check that `property_images` table has data
- Verify image URLs are accessible
- Check the image mapping in the API

#### 5. Search not working
**Solution**:
- Verify latitude/longitude data exists
- Check that coordinates are within the search bounds
- Test with a wider search area

### Debugging Commands

```bash
# Check if unified_properties table exists and has data
node scripts/check-properties-table.js

# Test API endpoints directly
curl "http://localhost:3000/api/properties"
curl "http://localhost:3000/api/properties/search?data[0][lat]=36&data[0][lng]=-78&data[1][lat]=38&data[1][lng]=-76&data[2][lat]=35&data[2][lng]=-79&data[3][lat]=39&data[3][lng]=-75"

# Check Supabase logs in dashboard
# Go to Logs → API to see detailed error messages
```

## 📊 Expected Results

After successful migration:

1. **Single Source of Truth**: All property data in `unified_properties`
2. **Relational Data**: Proper structure with images, hosts, reviews, amenities
3. **Better Performance**: Optimized queries and indexes
4. **Enhanced Features**: Support for availability, categories, amenities
5. **Maintainable Code**: Clean API endpoints with proper error handling

## 🎉 Success Criteria

- ✅ All properties visible on homepage
- ✅ Map search returns correct results
- ✅ Property detail pages load with all data
- ✅ Images display correctly
- ✅ Host information shows properly
- ✅ Amenities and categories are accessible
- ✅ Fallback mechanism works when needed
- ✅ No console errors
- ✅ Good performance

## 📞 Support

If you encounter issues:

1. **Check the backup**: Your data is safely backed up
2. **Review logs**: Check Supabase logs for detailed error messages
3. **Test incrementally**: Test each component separately
4. **Rollback if needed**: You can always revert to the old tables

## 🔄 Rollback Plan

If you need to rollback:

1. **Revert API endpoints**: Use the original API files
2. **Switch back to old tables**: Update API to use `properties` or `App-Properties`
3. **Restore from backup**: Use your backup data if needed

The old tables remain untouched during migration, so rollback is always possible.

---

**Remember**: This migration is designed to be safe and reversible. Your original data remains intact throughout the process.
