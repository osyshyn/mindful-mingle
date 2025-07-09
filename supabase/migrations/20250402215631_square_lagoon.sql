/*
  # Fix service role bypass policy for profiles table

  1. Changes
    - Drop existing policies
    - Create new service role bypass policy with correct syntax
    - Re-create user policies in correct order
    - Ensure proper policy permissions and scoping

  2. Security
    - Service role has full access
    - Public users can create profiles during signup
    - Authenticated users can manage their own profiles
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
      WHEN auth.jwt() IS NULL THEN false
      WHEN auth.role() = 'service_role' THEN true
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