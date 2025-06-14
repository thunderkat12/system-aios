
-- Phase 2: Database Security Cleanup - Fixed version to handle dependencies

-- First, drop all existing RLS policies that depend on the functions
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can insert users" ON public.usuarios;
DROP POLICY IF EXISTS "Users can update own profile and admins can update all" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can delete users" ON public.usuarios;
DROP POLICY IF EXISTS "Users can view own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can view own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "Users can insert own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "Users can update own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "Users can delete own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "All can view stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can insert stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can update stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can delete stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can view all logs" ON public.logs_atividades;
DROP POLICY IF EXISTS "All authenticated users can insert logs" ON public.logs_atividades;

-- Drop any remaining permissive policies
DROP POLICY IF EXISTS "Permitir tudo clientes" ON public.clientes;
DROP POLICY IF EXISTS "Permitir tudo ordens_servico" ON public.ordens_servico;
DROP POLICY IF EXISTS "Permitir tudo estoque" ON public.estoque;
DROP POLICY IF EXISTS "Permitir tudo tecnicos" ON public.tecnicos;
DROP POLICY IF EXISTS "Permitir tudo atividades" ON public.atividades;

-- Now we can drop the functions
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_current_user_id();

-- Disable RLS on all tables since we're using custom authentication
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_atividades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividades DISABLE ROW LEVEL SECURITY;

-- Make user_id columns NOT NULL where they should be required for security
ALTER TABLE public.clientes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.ordens_servico ALTER COLUMN user_id SET NOT NULL;

-- Update existing records to have a user_id (use the admin user as default)
UPDATE public.clientes SET user_id = (
  SELECT id FROM public.usuarios WHERE email = 'admin@hitech.com' LIMIT 1
) WHERE user_id IS NULL;

UPDATE public.ordens_servico SET user_id = (
  SELECT id FROM public.usuarios WHERE email = 'admin@hitech.com' LIMIT 1
) WHERE user_id IS NULL;

-- Add indexes for better performance on user-based queries
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_user_id ON public.ordens_servico(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_atividades_usuario_id ON public.logs_atividades(usuario_id);

-- Remove the default admin password hash and require proper password setup
UPDATE public.usuarios 
SET senha_hash = 'REQUIRES_RESET' 
WHERE email = 'admin@hitech.com' AND senha_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
