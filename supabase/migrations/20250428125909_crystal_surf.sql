/*
  # Initial Papertrail Schema

  1. New Tables
    - `newsletters`
      - Core content table for newsletter information
      - Includes basic metadata like title, description, author
      - Supports categories and tags as arrays
    
    - `users`
      - Extended user profile data
      - Links to Supabase Auth users
      - Stores user preferences and metadata
    
    - `favorites`
      - Tracks user favorites/bookmarks
      - Many-to-many relationship between users and newsletters
      - Includes timestamp for analytics

  2. Security
    - Enable RLS on all tables
    - Policies for:
      - Public read access to newsletters
      - Authenticated user access to their own data
      - Protected writes to user profiles
      - Protected favorites management

  3. Indexes
    - Optimized queries for categories and created_at
    - Full text search on newsletter content
*/

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  author_name text,
  description text,
  categories text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  image_url text,
  website_url text,
  subscriber_count integer DEFAULT 0,
  frequency text DEFAULT 'Weekly',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  display_name text,
  profile_pic text,
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, newsletter_id)
);

-- Enable Row Level Security
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Newsletters policies
CREATE POLICY "Newsletters are viewable by everyone"
  ON newsletters
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can create newsletters"
  ON newsletters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS newsletters_categories_idx ON newsletters USING GIN (categories);
CREATE INDEX IF NOT EXISTS newsletters_created_at_idx ON newsletters (created_at DESC);
CREATE INDEX IF NOT EXISTS newsletters_search_idx ON newsletters USING GIN (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(author_name, ''))
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_newsletters_updated_at
  BEFORE UPDATE ON newsletters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial categories for testing
INSERT INTO newsletters (name, description, author_name, categories, tags)
VALUES 
  ('Stratechery', 'Analysis of the strategy and business side of technology and media', 'Ben Thompson', 
   ARRAY['Technology', 'Business'], ARRAY['tech', 'strategy', 'analysis']),
  ('Morning Brew', 'Your daily dose of business news', 'Morning Brew Team',
   ARRAY['Business', 'Finance'], ARRAY['business', 'finance', 'news'])
ON CONFLICT DO NOTHING;
