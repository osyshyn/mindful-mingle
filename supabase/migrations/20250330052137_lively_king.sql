/*
  # Add Biometric Integration

  1. New Tables
    - `biometric_connections`
      - Stores user's connected biometric devices and apps
      - Tracks connection status and access tokens
    - `biometric_data`
      - Stores stress levels and emotional state data
      - Links data to relationships for correlation analysis

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data

  3. Changes
    - Add indexes for efficient querying
    - Add foreign key constraints for data integrity
*/

-- Create biometric_connections table
CREATE TABLE IF NOT EXISTS biometric_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  provider_user_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  last_sync_at timestamptz,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Create biometric_data table
CREATE TABLE IF NOT EXISTS biometric_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  relationship_id uuid REFERENCES relationships(id) ON DELETE SET NULL,
  timestamp timestamptz NOT NULL,
  stress_level integer CHECK (stress_level BETWEEN 0 AND 100),
  heart_rate integer,
  voice_intensity float,
  emotion_detected text,
  source text NOT NULL,
  raw_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE biometric_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_data ENABLE ROW LEVEL SECURITY;

-- Policies for biometric_connections
CREATE POLICY "Users can manage their own biometric connections"
  ON biometric_connections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for biometric_data
CREATE POLICY "Users can manage their own biometric data"
  ON biometric_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_biometric_data_user_timestamp 
  ON biometric_data(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_biometric_data_relationship 
  ON biometric_data(relationship_id);
CREATE INDEX IF NOT EXISTS idx_biometric_connections_user 
  ON biometric_connections(user_id);