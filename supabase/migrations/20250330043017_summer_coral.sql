/*
  # Add coaching preferences to profiles table

  1. Changes
    - Add coaching_preferences column to profiles table
      - JSONB type to store flexible preference data
      - Default empty JSON object
      - Includes methodology, focus areas, communication style, and expert preferences

  2. Notes
    - Using JSONB for flexibility in preference structure
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' 
    AND column_name = 'coaching_preferences'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN coaching_preferences JSONB DEFAULT '{
      "methodology": "",
      "focus_areas": [],
      "communication_style": "",
      "spiritual_inclusion": false,
      "preferred_experts": []
    }'::jsonb;
  END IF;
END $$;