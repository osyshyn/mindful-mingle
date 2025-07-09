/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop all existing policies
    - Create simplified RLS policies that work for both signup and authenticated users
    - Add service role access policy using correct JWT check
    
  2. Security
    - Enable RLS on profiles table
    - Allow public access for signup
    - Allow authenticated users to manage their own profiles
    - Allow service role full access
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their profile during signup" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Service role access" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Public signup access" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create service role access policy using JWT check
CREATE POLICY "Service role access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Create policy for users to manage their own profile
CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy for public signup
CREATE POLICY "Public signup access"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);