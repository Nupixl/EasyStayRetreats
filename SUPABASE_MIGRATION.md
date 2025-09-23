# Supabase Migration Guide

This guide will help you migrate the EasyStay Retreats property CMS from the static JSON file to Supabase database.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. The existing `data.json` file with property data

## Setup Steps

### 1. Install Dependencies

The Supabase client is already installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables

Create or update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables and relationships

### 4. Run the Migration

```bash
node scripts/migrate-to-supabase.js
```

This will:
- Create all unique amenities from your existing data
- Create all unique hosts from your existing data
- Migrate all properties with their relationships
- Preserve the exact data structure for compatibility

### 5. Test the Application

```bash
npm run dev
```

Visit your application and verify that:
- Properties load correctly
- Search functionality works
- Map filtering works
- Individual property pages load

## Database Schema

### Core Tables

- **properties**: Main property data (title, price, location, etc.)
- **property_images**: Property photos with ordering
- **hosts**: Property hosts/owners
- **reviews**: Property reviews and ratings
- **amenities**: Available amenities (wifi, pool, etc.)
- **categories**: Property categories

### Relationships

- Properties → Images (one-to-many)
- Properties → Hosts (many-to-many via property_hosts)
- Properties → Reviews (one-to-many)
- Properties → Amenities (many-to-many via property_amenities)
- Properties → Categories (many-to-many via property_categories)

## API Endpoints

The migration creates new API endpoints that maintain compatibility:

- `/api/properties` - Get all properties (replaces `/api/listings`)
- `/api/properties/search` - Search properties by map bounds (replaces `/api/search`)
- `/api/properties/[id]` - Get individual property

## Data Transformation

The migration automatically transforms the data to match the expected format:

- Converts price strings to decimal numbers
- Extracts and normalizes ratings
- Parses review counts
- Links hosts to properties
- Associates amenities with properties
- Maintains geolocation data for map functionality

## Troubleshooting

### Common Issues

1. **Environment variables not set**: Ensure all Supabase credentials are in `.env.local`
2. **Database schema errors**: Make sure you've run the SQL schema in Supabase
3. **Migration fails**: Check the console output for specific error messages
4. **Properties not loading**: Verify the API endpoints are working by testing them directly

### Verification

To verify the migration worked:

1. Check your Supabase dashboard for the new tables and data
2. Test the API endpoints directly:
   ```bash
   curl http://localhost:3000/api/properties
   ```
3. Ensure the application loads without errors

## Rollback

If you need to rollback to the JSON file:

1. Update the API endpoints to use the original data source
2. Remove the Supabase configuration
3. Restore the original component imports

## Support

If you encounter issues:

1. Check the Supabase logs in your project dashboard
2. Verify all environment variables are set correctly
3. Ensure the database schema was created successfully
4. Test the API endpoints individually
