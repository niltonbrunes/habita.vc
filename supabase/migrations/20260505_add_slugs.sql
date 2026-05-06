-- Migration: Add slug columns for SEO
-- Tables: properties, developments, profiles

-- 0. Enable Unaccent Extension
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1. Update Properties Table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS properties_slug_idx ON public.properties (slug);

-- 2. Update Developments Table
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS developments_slug_idx ON public.developments (slug);

-- 3. Update Profiles Table (for broker personal pages)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_slug_idx ON public.profiles (slug);

-- 4. Function to generate slugs for existing data (optional run)
-- This is a simple helper. In production, we usually use a more robust slugify function.
CREATE OR REPLACE FUNCTION slugify(value TEXT)
RETURNS TEXT AS $$
  WITH removed_accents AS (
    SELECT unaccent(value) as val
  ),
  lowercase AS (
    SELECT lower(val) as val FROM removed_accents
  ),
  removed_special AS (
    SELECT regexp_replace(val, '[^a-z0-9\s-]', '', 'g') as val FROM lowercase
  ),
  replaced_spaces AS (
    SELECT regexp_replace(val, '\s+', '-', 'g') as val FROM removed_special
  ),
  trimmed AS (
    SELECT regexp_replace(val, '^-+|-+$', '', 'g') as val FROM replaced_spaces
  )
  SELECT val FROM trimmed;
$$ LANGUAGE SQL IMMUTABLE;

-- 5. Comments for documentation
COMMENT ON COLUMN public.properties.slug IS 'URL amigável para SEO do imóvel';
COMMENT ON COLUMN public.developments.slug IS 'URL amigável para SEO do empreendimento';
COMMENT ON COLUMN public.profiles.slug IS 'URL amigável para a página do corretor';
