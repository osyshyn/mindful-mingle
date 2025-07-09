/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop all existing policies to avoid conflicts
    - Enable RLS on profiles table
    - Create INSERT policy for public users during signup
    - Create INSERT policy for authenticated users
    - Create UPDATE and SELECT policies for authenticated users

  2. Security
    - Enable RLS on profiles table
    - Allow users to create their own profile during signup
    - Allow users to manage their own profile after authentication
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their profile during signup" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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