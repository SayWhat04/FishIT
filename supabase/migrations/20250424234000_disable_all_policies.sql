-- Migration: 20250424234000_disable_all_policies.sql
-- Purpose: Disable all previously defined row-level security policies
-- Author: System Generated

-- Drop policies for boxes table
DROP POLICY IF EXISTS "Users can view their own boxes" ON public.boxes;
DROP POLICY IF EXISTS "Users can insert their own boxes" ON public.boxes;
DROP POLICY IF EXISTS "Users can update their own boxes" ON public.boxes;
DROP POLICY IF EXISTS "Users can soft delete their own boxes" ON public.boxes;

-- Drop policies for flashcards table
DROP POLICY IF EXISTS "Users can view flashcards in their boxes" ON public.flashcards;
DROP POLICY IF EXISTS "Users can insert flashcards in their boxes" ON public.flashcards;
DROP POLICY IF EXISTS "Users can update flashcards in their boxes" ON public.flashcards;
DROP POLICY IF EXISTS "Users can soft delete flashcards in their boxes" ON public.flashcards;

-- Drop policies for box_tags table
DROP POLICY IF EXISTS "Users can view tags for their boxes" ON public.box_tags;
DROP POLICY IF EXISTS "Users can add tags to their boxes" ON public.box_tags;
DROP POLICY IF EXISTS "Users can delete tags from their boxes" ON public.box_tags;

-- Drop policies for tags table
DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
DROP POLICY IF EXISTS "Anyone can insert tags" ON public.tags;

-- Drop policies for generation_log table
DROP POLICY IF EXISTS "Users can view their generation logs" ON public.generation_log;
DROP POLICY IF EXISTS "Users can create their generation logs" ON public.generation_log;

-- Optionally, disable RLS on tables if you want to completely remove access control
-- Uncomment these lines if you want to disable RLS entirely
-- ALTER TABLE public.boxes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.flashcards DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.box_tags DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tags DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.generation_log DISABLE ROW LEVEL SECURITY; 