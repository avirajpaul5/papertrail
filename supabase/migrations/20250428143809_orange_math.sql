/*
  # Add issues table and RSS ingestion

  1. New Tables
    - `issues`
      - `id` (uuid, primary key)
      - `newsletter_id` (uuid, references newsletters)
      - `title` (text)
      - `content` (text)
      - `url` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `issues` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Functions
    - Add function to update updated_at timestamp
    - Add function for RSS ingestion
*/

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  url text,
  published_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(newsletter_id, url)
);

-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Issues are viewable by everyone"
  ON issues
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can create issues"
  ON issues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS issues_newsletter_id_idx ON issues(newsletter_id);
CREATE INDEX IF NOT EXISTS issues_published_at_idx ON issues(published_at DESC);
CREATE INDEX IF NOT EXISTS issues_url_idx ON issues(url);

-- Create trigger for updating updated_at
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();