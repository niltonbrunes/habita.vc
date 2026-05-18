-- Add funnel_config to profiles
ALTER TABLE profiles ADD COLUMN funnel_config JSONB DEFAULT '{}'::jsonb;

-- Comment for the new column
COMMENT ON COLUMN profiles.funnel_config IS 'Stores the custom settings for the broker''s sales funnel simulator (goals, average ticket, conversion rates)';
