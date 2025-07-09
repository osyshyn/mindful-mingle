/*
  # Fix profiles table RLS policies for signup and service role

  1. Changes
    - Drop all existing policies
    - Enable RLS
    - Add service role bypass policy for ALL operations
    - Add policies for public and authenticated users
    - Fix policy ordering and permissions

  2. Security
    - Allow service role complete access
    - Allow public users to create profiles during signup
    - Allow authenticated users to manage their own profiles
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their profile during signup" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create service role bypass policy (must be first)
CREATE POLICY "Service role bypass"
  ON profiles
  FOR ALL
  TO public
  USING (
    CASE
      WHEN (auth.jwt() IS NULL) THEN false
      WHEN ((auth.jwt() ->> 'role'::text) = 'service_role'::text) THEN true
      ELSE false
    END
  );

-- Create INSERT policy for signup (public)
CREATE POLICY "Users can create their profile during signup"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Create INSERT policy for authenticated users
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create UPDATE policy
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create SELECT policy
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);