/*
  # Enable Anonymous Posting

  1. New Tables
    - Modify `posts` table to support anonymous posting
    - Remove authentication requirements for posting

  2. Changes
    - Add `author_name` column to posts for anonymous authors
    - Make `user_id` nullable in posts table
    - Update RLS policies to allow anonymous posting
    - Remove authentication dependencies

  3. Security
    - Enable RLS on all tables
    - Allow public read access
    - Allow anonymous posting with rate limiting considerations
*/

-- Add author_name column to posts table for anonymous posting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE posts ADD COLUMN author_name text;
  END IF;
END $$;

-- Make user_id nullable in posts table to support anonymous posts
DO $$
BEGIN
  -- Check if the column exists and is not nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' 
    AND column_name = 'user_id' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Update posts policies for anonymous posting
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Allow anyone to create posts (anonymous posting)
CREATE POLICY "Anyone can create posts"
  ON posts FOR INSERT
  USING (true);

-- Allow anyone to read posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- Update likes policies for anonymous likes
DROP POLICY IF EXISTS "Authenticated users can like posts" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

-- Allow anonymous likes (with temporary user IDs)
CREATE POLICY "Anyone can like posts"
  ON likes FOR INSERT
  USING (true);

-- Allow reading likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

-- Update comments policies for anonymous comments
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Allow anonymous comments
CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  USING (true);

-- Allow reading comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

-- Update games policies to allow anonymous play
DROP POLICY IF EXISTS "Authenticated users can create game scores" ON game_scores;

-- Allow anonymous game scores
CREATE POLICY "Anyone can create game scores"
  ON game_scores FOR INSERT
  USING (true);

-- Ensure games can be updated for play counts
DROP POLICY IF EXISTS "Games can be updated by anyone (for play counts)" ON games;
CREATE POLICY "Games can be updated by anyone (for play counts)"
  ON games FOR UPDATE
  USING (true);