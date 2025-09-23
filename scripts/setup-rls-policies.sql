-- RLS Policies for App-Properties table
-- Run this in your Supabase SQL Editor

-- First, check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'App-Properties';

-- Enable RLS on App-Properties table (if not already enabled)
ALTER TABLE "App-Properties" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access for all users
CREATE POLICY "Enable read access for all users" ON "App-Properties" 
FOR SELECT USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'App-Properties';

-- Test the policy by checking if anonymous users can access the table
-- This should return the count of records accessible to anonymous users
SELECT COUNT(*) as accessible_records FROM "App-Properties";
