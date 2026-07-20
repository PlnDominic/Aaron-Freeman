-- Adds a URL-friendly slug to blog_posts so reflection URLs can use
-- the article title instead of the raw UUID, e.g.
-- /reflections/why-ai-wont-replace-town-planners
-- Safe to re-run.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug TEXT;

-- Backfill any existing rows that don't have a slug yet, derived from their title.
-- NOTE: if two posts share the same title, this backfill will give them the
-- same slug and the UNIQUE index below will fail. If that happens, manually
-- disambiguate the duplicates (e.g. append "-2") before re-running this file.
UPDATE blog_posts
SET slug = trim(both '-' from regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

ALTER TABLE blog_posts ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
