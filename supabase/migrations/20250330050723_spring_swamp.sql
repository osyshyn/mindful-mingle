/*
  # Add Relationship Management Tables

  1. New Tables
    - `relationships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text) - Name of the person
      - `relationship_type` (text) - Type of relationship (family, friend, work, etc.)
      - `specific_role` (text) - Specific role (mother, boss, etc.)
      - `notes` (text) - General notes about the relationship
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `relationship_assessments`
      - `id` (uuid, primary key)
      - `relationship_id` (uuid, references relationships)
      - `taken_at` (timestamp)
      - `score` (integer) - Overall relationship score
      - `answers` (jsonb) - Detailed assessment answers
      - `created_at` (timestamp)

    - `relationship_goals`
      - `id` (uuid, primary key)
      - `relationship_id` (uuid, references relationships)
      - `title` (text)
      - `description` (text)
      - `status` (text) - 'not_started', 'in_progress', 'completed'
      - `due_date` (timestamp)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  relationship_type text NOT NULL,
  specific_role text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create relationship_assessments table
CREATE TABLE IF NOT EXISTS relationship_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE NOT NULL,
  taken_at timestamptz DEFAULT now(),
  score integer NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create relationship_goals table
CREATE TABLE IF NOT EXISTS relationship_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'not_started',
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

-- Enable Row Level Security
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_goals ENABLE ROW LEVEL SECURITY;

-- Policies for relationships
CREATE POLICY "Users can manage their own relationships"
  ON relationships
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for relationship_assessments
CREATE POLICY "Users can manage assessments for their relationships"
  ON relationship_assessments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = relationship_id
      AND relationships.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

-- Policies for relationship_goals
CREATE POLICY "Users can manage goals for their relationships"
  ON relationship_goals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = relationship_id
      AND relationships.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_relationships_user_id ON relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_relationship_assessments_relationship_id ON relationship_assessments(relationship_id);
CREATE INDEX IF NOT EXISTS idx_relationship_goals_relationship_id ON relationship_goals(relationship_id);
CREATE INDEX IF NOT EXISTS idx_relationship_goals_status ON relationship_goals(status);