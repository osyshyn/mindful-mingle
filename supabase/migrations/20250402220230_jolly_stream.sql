/*
  # Fix profiles table RLS policies with simplified approach

  1. Changes
    - Drop all existing policies
    - Enable RLS on profiles table
    - Create simplified policies for profile access
    - Split service role and user policies for clarity

  2. Security
    - Maintain security while reducing complexity
    - Ensure proper access control for all operations
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

-- Create simplified service role policy
CREATE POLICY "Service role access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.role() = 'service_role');

-- Create user policies
CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create signup policy
CREATE POLICY "Public signup access"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);