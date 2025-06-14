
-- First, let's add proper foreign key constraints and RLS policies for security

-- Add user_id column to tables that need user-based access control
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.usuarios(id);
ALTER TABLE public.ordens_servico ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.usuarios(id);
ALTER TABLE public.estoque ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.usuarios(id);

-- Enable Row Level Security on all tables
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_atividades ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Usuarios podem ver próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem inserir usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem atualizar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Admins podem deletar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir visualizar logs" ON public.logs_atividades;
DROP POLICY IF EXISTS "Permitir inserir logs" ON public.logs_atividades;

-- Create security definer function to get current user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT cargo INTO user_role 
  FROM public.usuarios 
  WHERE id = (
    SELECT id FROM public.usuarios 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  );
  RETURN COALESCE(user_role, 'guest');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to get current user ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid 
  FROM public.usuarios 
  WHERE email = current_setting('request.jwt.claims', true)::json->>'email';
  RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for usuarios table
CREATE POLICY "Users can view own profile and admins can view all" 
ON public.usuarios FOR SELECT 
USING (
  id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Admins can insert users" 
ON public.usuarios FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Users can update own profile and admins can update all" 
ON public.usuarios FOR UPDATE 
USING (
  id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Admins can delete users" 
ON public.usuarios FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- RLS Policies for clientes table
CREATE POLICY "Users can view own clients" 
ON public.clientes FOR SELECT 
USING (
  user_id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Users can insert own clients" 
ON public.clientes FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update own clients" 
ON public.clientes FOR UPDATE 
USING (
  user_id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Users can delete own clients" 
ON public.clientes FOR DELETE 
USING (
  user_id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

-- RLS Policies for ordens_servico table
CREATE POLICY "Users can view own service orders" 
ON public.ordens_servico FOR SELECT 
USING (
  user_id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Users can insert own service orders" 
ON public.ordens_servico FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update own service orders" 
ON public.ordens_servico FOR UPDATE 
USING (
  user_id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Users can delete own service orders" 
ON public.ordens_servico FOR DELETE 
USING (
  user_id = public.get_current_user_id() OR 
  public.get_current_user_role() = 'admin'
);

-- RLS Policies for estoque table (admin-only for modifications)
CREATE POLICY "All can view stock" 
ON public.estoque FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert stock" 
ON public.estoque FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update stock" 
ON public.estoque FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete stock" 
ON public.estoque FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- RLS Policies for logs_atividades table (admin read-only)
CREATE POLICY "Admins can view all logs" 
ON public.logs_atividades FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "All authenticated users can insert logs" 
ON public.logs_atividades FOR INSERT 
WITH CHECK (public.get_current_user_id() IS NOT NULL);

-- Create index for better performance on user lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_user_id ON public.ordens_servico(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_atividades_usuario_id ON public.logs_atividades(usuario_id);

-- Update existing admin user to have a properly hashed password (placeholder - will be updated in code)
UPDATE public.usuarios 
SET senha_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email = 'admin@hitech.com';
