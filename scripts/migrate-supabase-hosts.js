const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateHostsTable() {
  console.log('🚀 Starting Supabase hosts table migration...');
  
  try {
    // Step 1: Check if hosts table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'hosts');

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
      return;
    }

    if (tables.length === 0) {
      console.log('⚠️  Hosts table not found. Creating app_hosts table...');
      await createAppHostsTable();
      return;
    }

    console.log('✅ Hosts table found. Starting migration...');

    // Step 2: Add new columns to hosts table
    console.log('📝 Adding new columns to hosts table...');
    const addColumnsSQL = `
      ALTER TABLE hosts 
      ADD COLUMN IF NOT EXISTS slug TEXT,
      ADD COLUMN IF NOT EXISTS first_name TEXT,
      ADD COLUMN IF NOT EXISTS last_name TEXT,
      ADD COLUMN IF NOT EXISTS card_image_url TEXT,
      ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
      ADD COLUMN IF NOT EXISTS agent_location TEXT,
      ADD COLUMN IF NOT EXISTS short_bio TEXT,
      ADD COLUMN IF NOT EXISTS vacation_image_first_url TEXT,
      ADD COLUMN IF NOT EXISTS vacation_image_second_url TEXT,
      ADD COLUMN IF NOT EXISTS email TEXT,
      ADD COLUMN IF NOT EXISTS phone TEXT,
      ADD COLUMN IF NOT EXISTS instagram_link TEXT,
      ADD COLUMN IF NOT EXISTS facebook_link TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_link TEXT,
      ADD COLUMN IF NOT EXISTS youtube_link TEXT,
      ADD COLUMN IF NOT EXISTS super_host BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS plus_host BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS premium_host BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS verified_host BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS accolade_icon_url TEXT,
      ADD COLUMN IF NOT EXISTS host_accolades_switch BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS host_accolade_image_switch BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS account_owner TEXT,
      ADD COLUMN IF NOT EXISTS whalesync_postgres_id TEXT;
    `;

    const { error: addColumnsError } = await supabase.rpc('exec_sql', { sql: addColumnsSQL });
    if (addColumnsError) {
      console.error('❌ Error adding columns:', addColumnsError);
      return;
    }
    console.log('✅ Columns added successfully');

    // Step 3: Create unique constraint on slug
    console.log('🔗 Adding unique constraint on slug...');
    const { error: constraintError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE hosts ADD CONSTRAINT hosts_slug_unique UNIQUE (slug);' 
    });
    if (constraintError && !constraintError.message.includes('already exists')) {
      console.error('❌ Error adding constraint:', constraintError);
      return;
    }
    console.log('✅ Constraint added successfully');

    // Step 4: Rename table from hosts to app_hosts
    console.log('🔄 Renaming hosts table to app_hosts...');
    const { error: renameError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE hosts RENAME TO app_hosts;' 
    });
    if (renameError) {
      console.error('❌ Error renaming table:', renameError);
      return;
    }
    console.log('✅ Table renamed successfully');

    // Step 5: Update foreign key references
    console.log('🔗 Updating foreign key references...');
    const { error: fkError } = await supabase.rpc('exec_sql', { 
      sql: `
        ALTER TABLE property_hosts DROP CONSTRAINT IF EXISTS property_hosts_host_id_fkey;
        ALTER TABLE property_hosts 
        ADD CONSTRAINT property_hosts_host_id_fkey 
        FOREIGN KEY (host_id) REFERENCES app_hosts(id) ON DELETE CASCADE;
      ` 
    });
    if (fkError) {
      console.error('❌ Error updating foreign keys:', fkError);
      return;
    }
    console.log('✅ Foreign keys updated successfully');

    // Step 6: Update RLS policies
    console.log('🔒 Updating RLS policies...');
    const { error: policyError } = await supabase.rpc('exec_sql', { 
      sql: `
        DROP POLICY IF EXISTS "Public read access for hosts" ON app_hosts;
        CREATE POLICY "Public read access for app_hosts" ON app_hosts FOR SELECT USING (true);
      ` 
    });
    if (policyError) {
      console.error('❌ Error updating policies:', policyError);
      return;
    }
    console.log('✅ RLS policies updated successfully');

    // Step 7: Update trigger
    console.log('⚡ Updating trigger...');
    const { error: triggerError } = await supabase.rpc('exec_sql', { 
      sql: `
        DROP TRIGGER IF EXISTS update_hosts_updated_at ON app_hosts;
        CREATE TRIGGER update_app_hosts_updated_at BEFORE UPDATE ON app_hosts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      ` 
    });
    if (triggerError) {
      console.error('❌ Error updating trigger:', triggerError);
      return;
    }
    console.log('✅ Trigger updated successfully');

    // Step 8: Create new indexes
    console.log('📊 Creating new indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', { 
      sql: `
        CREATE INDEX IF NOT EXISTS idx_app_hosts_slug ON app_hosts(slug);
        CREATE INDEX IF NOT EXISTS idx_property_hosts_host_id ON property_hosts(host_id);
      ` 
    });
    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
      return;
    }
    console.log('✅ Indexes created successfully');

    // Step 9: Update existing data to have proper slugs
    console.log('📝 Updating existing data with slugs...');
    const { error: slugError } = await supabase.rpc('exec_sql', { 
      sql: `
        UPDATE app_hosts 
        SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '.', ''))
        WHERE slug IS NULL OR slug = '';
      ` 
    });
    if (slugError) {
      console.error('❌ Error updating slugs:', slugError);
      return;
    }
    console.log('✅ Slugs updated successfully');

    // Step 10: Add NOT NULL constraint to slug
    console.log('🔒 Adding NOT NULL constraint to slug...');
    const { error: notNullError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE app_hosts ALTER COLUMN slug SET NOT NULL;' 
    });
    if (notNullError) {
      console.error('❌ Error adding NOT NULL constraint:', notNullError);
      return;
    }
    console.log('✅ NOT NULL constraint added successfully');

    console.log('🎉 Migration completed successfully!');
    console.log('✅ Hosts table has been renamed to app_hosts');
    console.log('✅ All new fields have been added');
    console.log('✅ Foreign key references updated');
    console.log('✅ RLS policies updated');
    console.log('✅ Triggers updated');
    console.log('✅ Indexes created');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

async function createAppHostsTable() {
  console.log('📝 Creating app_hosts table from scratch...');
  
  const createTableSQL = `
    CREATE TABLE app_hosts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      first_name TEXT,
      last_name TEXT,
      card_image_url TEXT,
      hero_image_url TEXT,
      agent_location TEXT,
      short_bio TEXT,
      vacation_image_first_url TEXT,
      vacation_image_second_url TEXT,
      email TEXT,
      phone TEXT,
      instagram_link TEXT,
      facebook_link TEXT,
      linkedin_link TEXT,
      youtube_link TEXT,
      super_host BOOLEAN DEFAULT FALSE,
      plus_host BOOLEAN DEFAULT FALSE,
      premium_host BOOLEAN DEFAULT FALSE,
      verified_host BOOLEAN DEFAULT FALSE,
      accolade_icon_url TEXT,
      host_accolades_switch BOOLEAN DEFAULT FALSE,
      host_accolade_image_switch BOOLEAN DEFAULT FALSE,
      account_owner TEXT,
      whalesync_postgres_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
  if (error) {
    console.error('❌ Error creating app_hosts table:', error);
    return;
  }

  console.log('✅ app_hosts table created successfully');
}

// Execute migration
migrateHostsTable();

