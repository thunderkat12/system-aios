
-- Create empresa_config table to store company configuration
CREATE TABLE public.empresa_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  tema_primario TEXT NOT NULL,
  tema_secundario TEXT NOT NULL,
  webhook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT Now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT Now()
);

-- Add an index for user_id to speed up lookups
CREATE INDEX idx_empresa_config_user_id ON public.empresa_config(user_id);

-- Enable Row Level Security to protect configuration data
ALTER TABLE public.empresa_config ENABLE ROW LEVEL SECURITY;

-- Allow only each user to select (read) their config row or admin to read all
CREATE POLICY "User can read own config or admin can read all"
  ON public.empresa_config FOR SELECT
  USING (
    user_id = public.get_current_user_id() OR
    public.get_current_user_role() = 'admin'
  );

-- Allow user to insert their own config row
CREATE POLICY "User can insert own config"
  ON public.empresa_config FOR INSERT
  WITH CHECK (
    user_id = public.get_current_user_id()
  );

-- Allow user to update their own config or admin update all
CREATE POLICY "User can update own config or admin"
  ON public.empresa_config FOR UPDATE
  USING (
    user_id = public.get_current_user_id() OR
    public.get_current_user_role() = 'admin'
  );

-- Allow user to delete own config or admin delete all
CREATE POLICY "User can delete own config or admin"
  ON public.empresa_config FOR DELETE
  USING (
    user_id = public.get_current_user_id() OR
    public.get_current_user_role() = 'admin'
  );

-- Add trigger to update updated_at on modification
CREATE OR REPLACE FUNCTION public.set_empresa_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_empresa_config_updated_at ON public.empresa_config;
CREATE TRIGGER set_empresa_config_updated_at
  BEFORE UPDATE ON public.empresa_config
  FOR EACH ROW EXECUTE FUNCTION public.set_empresa_config_updated_at();
