
-- Phase 1: Drop ALL policies depending on get_current_user_role() so we can safely drop and recreate the function

-- usuarios
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can insert users" ON public.usuarios;
DROP POLICY IF EXISTS "Users can update own profile and admins can update all" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can delete users" ON public.usuarios;

-- clientes
DROP POLICY IF EXISTS "Users can view own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clientes;

-- ordens_servico
DROP POLICY IF EXISTS "Users can view own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "Users can insert own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "Users can update own service orders" ON public.ordens_servico;
DROP POLICY IF EXISTS "Users can delete own service orders" ON public.ordens_servico;

-- estoque
DROP POLICY IF EXISTS "All authenticated users can view stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can insert stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can update stock" ON public.estoque;
DROP POLICY IF EXISTS "Admins can delete stock" ON public.estoque;

-- logs_atividades
DROP POLICY IF EXISTS "Admins can view all logs" ON public.logs_atividades;
DROP POLICY IF EXISTS "All authenticated users can insert logs" ON public.logs_atividades;

-- tecnicos
DROP POLICY IF EXISTS "All authenticated users can view technicians" ON public.tecnicos;
DROP POLICY IF EXISTS "Admins can insert technicians" ON public.tecnicos;
DROP POLICY IF EXISTS "Admins can update technicians" ON public.tecnicos;
DROP POLICY IF EXISTS "Admins can delete technicians" ON public.tecnicos;

-- atividades
DROP POLICY IF EXISTS "All authenticated users can view activities" ON public.atividades;
DROP POLICY IF EXISTS "All authenticated users can insert activities" ON public.atividades;

-- Now drop and recreate the functions
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_current_user_id();

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Re-create users table policies
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

-- Re-create clientes table policies
CREATE POLICY "Users can view own clients" 
ON public.clientes FOR SELECT 
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'admin'
);
CREATE POLICY "Users can insert own clients" 
ON public.clientes FOR INSERT 
WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own clients" 
ON public.clientes FOR UPDATE 
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'admin'
);
CREATE POLICY "Users can delete own clients" 
ON public.clientes FOR DELETE 
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'admin'
);

-- Re-create ordens_servico table policies
CREATE POLICY "Users can view own service orders" 
ON public.ordens_servico FOR SELECT 
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'admin'
);
CREATE POLICY "Users can insert own service orders" 
ON public.ordens_servico FOR INSERT 
WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own service orders" 
ON public.ordens_servico FOR UPDATE 
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'admin'
);
CREATE POLICY "Users can delete own service orders" 
ON public.ordens_servico FOR DELETE 
USING (
  user_id = auth.uid() OR 
  public.get_current_user_role() = 'admin'
);

-- Re-create estoque table policies
CREATE POLICY "All authenticated users can view stock" 
ON public.estoque FOR SELECT 
USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can insert stock" 
ON public.estoque FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "Admins can update stock" 
ON public.estoque FOR UPDATE 
USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Admins can delete stock" 
ON public.estoque FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Re-create logs_atividades table policies
CREATE POLICY "Admins can view all logs" 
ON public.logs_atividades FOR SELECT 
USING (public.get_current_user_role() = 'admin');
CREATE POLICY "All authenticated users can insert logs" 
ON public.logs_atividades FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Re-create tecnicos table policies
CREATE POLICY "All authenticated users can view technicians" 
ON public.tecnicos FOR SELECT 
USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can insert technicians" 
ON public.tecnicos FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "Admins can update technicians" 
ON public.tecnicos FOR UPDATE 
USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Admins can delete technicians" 
ON public.tecnicos FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Re-create atividades table policies
CREATE POLICY "All authenticated users can view activities" 
ON public.atividades FOR SELECT 
USING (auth.uid() IS NOT NULL);
CREATE POLICY "All authenticated users can insert activities" 
ON public.atividades FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- (Optional) reindex for performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email_ativo ON public.usuarios(email, ativo);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_user_id ON public.ordens_servico(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_atividades_usuario_id ON public.logs_atividades(usuario_id);

