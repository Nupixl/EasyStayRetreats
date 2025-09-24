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

async function renameStaffToAppHost() {
  console.log('🚀 Starting Supabase Staff to App Host migration...');
  
  try {
    // Step 1: Check if staff table exists
    const { data: staffTables, error: staffError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'staff');

    if (staffError) {
      console.error('❌ Error checking staff table:', staffError);
      return;
    }

    // Step 2: Check if app_hosts table already exists
    const { data: appHostsTables, error: appHostsError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'app_hosts');

    if (appHostsError) {
      console.error('❌ Error checking app_hosts table:', appHostsError);
      return;
    }

    if (staffTables.length > 0) {
      console.log('✅ Staff table found. Renaming to App Host...');
      
      // Rename staff table to app_hosts
      const { error: renameError } = await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE staff RENAME TO app_hosts;' 
      });
      
      if (renameError) {
        console.error('❌ Error renaming staff table:', renameError);
        return;
      }
      
      console.log('✅ Staff table renamed to app_hosts successfully');
      
      // Update RLS policies
      console.log('🔒 Updating RLS policies...');
      const { error: policyError } = await supabase.rpc('exec_sql', { 
        sql: `
          DROP POLICY IF EXISTS "Public read access for staff" ON app_hosts;
          CREATE POLICY "Public read access for app_hosts" ON app_hosts FOR SELECT USING (true);
        ` 
      });
      
      if (policyError) {
        console.error('❌ Error updating policies:', policyError);
        return;
      }
      
      console.log('✅ RLS policies updated successfully');
      
      // Update trigger
      console.log('⚡ Updating trigger...');
      const { error: triggerError } = await supabase.rpc('exec_sql', { 
        sql: `
          DROP TRIGGER IF EXISTS update_staff_updated_at ON app_hosts;
          CREATE TRIGGER update_app_hosts_updated_at BEFORE UPDATE ON app_hosts
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ` 
      });
      
      if (triggerError) {
        console.error('❌ Error updating trigger:', triggerError);
        return;
      }
      
      console.log('✅ Trigger updated successfully');
      
    } else if (appHostsTables.length > 0) {
      console.log('✅ App Hosts table already exists. No migration needed.');
      
    } else {
      console.log('⚠️  No Staff table found. Creating App Hosts table...');
      await createAppHostsTable();
    }

    // Step 3: Update any foreign key references
    console.log('🔗 Checking for foreign key references...');
    const { error: fkError } = await supabase.rpc('exec_sql', { 
      sql: `
        -- Update any foreign key references from staff to app_hosts
        DO $$ 
        BEGIN
          -- Check if property_staffs table exists and rename it
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'property_staffs') THEN
            ALTER TABLE property_staffs RENAME TO property_hosts;
            ALTER TABLE property_hosts DROP CONSTRAINT IF EXISTS property_staffs_staff_id_fkey;
            ALTER TABLE property_hosts 
            ADD CONSTRAINT property_hosts_host_id_fkey 
            FOREIGN KEY (host_id) REFERENCES app_hosts(id) ON DELETE CASCADE;
          END IF;
        END $$;
      ` 
    });
    
    if (fkError) {
      console.error('❌ Error updating foreign keys:', fkError);
      return;
    }
    
    console.log('✅ Foreign key references updated successfully');

    console.log('🎉 Migration completed successfully!');
    console.log('✅ Staff table has been renamed to App Hosts');
    console.log('✅ All references updated');
    console.log('✅ RLS policies updated');
    console.log('✅ Triggers updated');

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

  // Enable RLS
  const { error: rlsError } = await supabase.rpc('exec_sql', { 
    sql: 'ALTER TABLE app_hosts ENABLE ROW LEVEL SECURITY;' 
  });
  
  if (rlsError) {
    console.error('❌ Error enabling RLS:', rlsError);
    return;
  }

  // Create policy
  const { error: policyError } = await supabase.rpc('exec_sql', { 
    sql: 'CREATE POLICY "Public read access for app_hosts" ON app_hosts FOR SELECT USING (true);' 
  });
  
  if (policyError) {
    console.error('❌ Error creating policy:', policyError);
    return;
  }

  // Create trigger
  const { error: triggerError } = await supabase.rpc('exec_sql', { 
    sql: `
      CREATE TRIGGER update_app_hosts_updated_at BEFORE UPDATE ON app_hosts
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ` 
  });
  
  if (triggerError) {
    console.error('❌ Error creating trigger:', triggerError);
    return;
  }

  console.log('✅ app_hosts table created successfully');
}

// Execute migration
renameStaffToAppHost();

