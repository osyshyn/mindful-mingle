/*
  # Fix profiles table RLS policies for signup

  1. Changes
    - Drop all existing policies to avoid conflicts
    - Enable RLS on profiles table
    - Create public INSERT policy for signup
    - Create authenticated INSERT policy
    - Create UPDATE and SELECT policies
    - Add service role bypass for system operations

  2. Security
    - Allow public users to create profiles during signup
    - Maintain security by checking auth.uid() matches profile id
    - Add service role bypass for system operations
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

-- Create bypass policy for service role using CASE expression
CREATE POLICY "Service role bypass"
  ON profiles
  USING (
    CASE 
      WHEN auth.jwt() IS NULL THEN FALSE
      WHEN auth.jwt()->>'role' = 'service_role' THEN TRUE
      ELSE FALSE
    END
  );

-- Create new INSERT policy for public users (during signup)
CREATE POLICY "Users can create their profile during signup"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Create new INSERT policy for authenticated users
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