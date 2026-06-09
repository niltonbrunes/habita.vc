-- Add completed_at column to tasks table if it doesn't exist
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
