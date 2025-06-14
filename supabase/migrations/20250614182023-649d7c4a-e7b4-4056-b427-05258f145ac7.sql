
-- Fix Function Search Path Mutable warnings by setting search_path parameter
-- This prevents potential security issues with function calls

-- Fix get_current_user_id function
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid 
  FROM public.usuarios 
  WHERE email = (auth.jwt() ->> 'email')
  AND ativo = true;
  RETURN user_uuid;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = public, pg_temp;

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT cargo INTO user_role 
  FROM public.usuarios 
  WHERE email = (auth.jwt() ->> 'email')
  AND ativo = true;
  RETURN COALESCE(user_role, 'guest');
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = public, pg_temp;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Fix match_documents function
CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb)
RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Move vector extension from public to extensions schema (if possible)
-- Note: This might require recreating dependent objects
-- CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Fix Auth OTP expiry settings (this is typically done in Supabase dashboard)
-- The OTP expiry can be adjusted in Authentication > Settings > Auth
-- Recommended: Set to 600 seconds (10 minutes) or less

