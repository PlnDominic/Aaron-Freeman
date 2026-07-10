-- Adds structured block content (section titles + inline images) to blog_posts.
-- Safe to re-run.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS blocks JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN blog_posts.blocks IS
  'Ordered list of content blocks: [{ id, type: "heading" | "paragraph" | "image", text?, url?, caption? }]';
