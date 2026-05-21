-- Migration: add missing columns to social_posts
-- These were added to generate-social.ts but never applied to the live schema.

ALTER TABLE social_posts
  ADD COLUMN IF NOT EXISTS image_prompt  text,
  ADD COLUMN IF NOT EXISTS video_prompt  text,
  ADD COLUMN IF NOT EXISTS image_urls    text[]  NOT NULL DEFAULT '{}';
