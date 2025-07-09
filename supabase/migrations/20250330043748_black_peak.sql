/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add RLS policy to allow authenticated users to insert their own profile
    - Policy ensures users can only create a profile with their own user ID

  2. Security
    - Policy uses auth.uid() to verify user identity
    - Only allows INSERT when id matches authenticated user's ID
*/

-- Add INSERT policy for profiles table
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);