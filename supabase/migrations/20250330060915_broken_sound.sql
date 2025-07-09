/*
  # Update profiles table RLS policies

  1. Changes
    - Add policy to allow users to insert their own profile during signup
    - Ensure policy covers both authenticated and unauthenticated users for signup flow
    
  2. Security
    - Maintains existing RLS policies for authenticated users
    - Adds new policy specifically for profile creation during signup
    - Ensures users can only create their own profile
*/

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);