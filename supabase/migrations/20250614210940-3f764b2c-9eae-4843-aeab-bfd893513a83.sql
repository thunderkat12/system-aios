
-- Restaurar estrutura completa do banco de dados do zero

-- Criar tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  cargo TEXT NOT NULL CHECK (cargo IN ('admin', 'tecnico', 'atendente')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true
);

-- Criar tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS public.ordens_servico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  numero_os TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  cliente_nome TEXT NOT NULL,
  dispositivo TEXT NOT NULL,
  tipo_reparo TEXT NOT NULL,
  tecnico_responsavel TEXT NOT NULL,
  status TEXT DEFAULT 'Em Andamento' CHECK (status IN ('Em Andamento', 'Finalizada', 'Aguardando Peças', 'Aguardando Aprovação', 'Cancelada')),
  valor DECIMAL(10,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finalizada_em TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de estoque
CREATE TABLE IF NOT EXISTS public.estoque (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT,
  marca TEXT,
  quantidade INTEGER NOT NULL DEFAULT 0,
  valor_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
  estoque_minimo INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de técnicos
CREATE TABLE IF NOT EXISTS public.tecnicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de atividades/histórico
CREATE TABLE IF NOT EXISTS public.atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  referencia_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de logs de atividades
CREATE TABLE IF NOT EXISTS public.logs_atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id),
  acao TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de configuração da empresa
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

-- Criar funções de segurança
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

-- Função para buscar configuração da empresa
CREATE OR REPLACE FUNCTION public.get_empresa_config(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  nome_empresa TEXT,
  tema_primario TEXT,
  tema_secundario TEXT,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ec.id,
    ec.user_id,
    ec.nome_empresa,
    ec.tema_primario,
    ec.tema_secundario,
    ec.webhook_url,
    ec.created_at,
    ec.updated_at
  FROM public.empresa_config ec
  WHERE ec.user_id = p_user_id;
END;
$$;

-- Função para criar configuração da empresa
CREATE OR REPLACE FUNCTION public.create_empresa_config(
  p_user_id UUID,
  p_nome_empresa TEXT,
  p_tema_primario TEXT,
  p_tema_secundario TEXT,
  p_webhook_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  nome_empresa TEXT,
  tema_primario TEXT,
  tema_secundario TEXT,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.empresa_config (user_id, nome_empresa, tema_primario, tema_secundario, webhook_url)
  VALUES (p_user_id, p_nome_empresa, p_tema_primario, p_tema_secundario, p_webhook_url)
  RETURNING empresa_config.id INTO new_id;
  
  RETURN QUERY
  SELECT 
    ec.id,
    ec.user_id,
    ec.nome_empresa,
    ec.tema_primario,
    ec.tema_secundario,
    ec.webhook_url,
    ec.created_at,
    ec.updated_at
  FROM public.empresa_config ec
  WHERE ec.id = new_id;
END;
$$;

-- Função para atualizar configuração da empresa
CREATE OR REPLACE FUNCTION public.update_empresa_config(
  p_user_id UUID,
  p_nome_empresa TEXT,
  p_tema_primario TEXT,
  p_tema_secundario TEXT,
  p_webhook_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  nome_empresa TEXT,
  tema_primario TEXT,
  tema_secundario TEXT,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.empresa_config 
  SET 
    nome_empresa = p_nome_empresa,
    tema_primario = p_tema_primario,
    tema_secundario = p_tema_secundario,
    webhook_url = p_webhook_url,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN QUERY
  SELECT 
    ec.id,
    ec.user_id,
    ec.nome_empresa,
    ec.tema_primario,
    ec.tema_secundario,
    ec.webhook_url,
    ec.created_at,
    ec.updated_at
  FROM public.empresa_config ec
  WHERE ec.user_id = p_user_id;
END;
$$;

-- Trigger para updated_at na empresa_config
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

-- Habilitar Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresa_config ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
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

-- Políticas para clientes
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

-- Políticas para ordens de serviço
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

-- Políticas para estoque
CREATE POLICY "All authenticated users can view stock" 
ON public.estoque FOR SELECT 
USING (public.get_current_user_id() IS NOT NULL);

CREATE POLICY "Admins can insert stock" 
ON public.estoque FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update stock" 
ON public.estoque FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete stock" 
ON public.estoque FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Políticas para logs
CREATE POLICY "Admins can view all logs" 
ON public.logs_atividades FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "All authenticated users can insert logs" 
ON public.logs_atividades FOR INSERT 
WITH CHECK (public.get_current_user_id() IS NOT NULL);

-- Políticas para técnicos
CREATE POLICY "All authenticated users can view technicians" 
ON public.tecnicos FOR SELECT 
USING (public.get_current_user_id() IS NOT NULL);

CREATE POLICY "Admins can insert technicians" 
ON public.tecnicos FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update technicians" 
ON public.tecnicos FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete technicians" 
ON public.tecnicos FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Políticas para atividades
CREATE POLICY "All authenticated users can view activities" 
ON public.atividades FOR SELECT 
USING (public.get_current_user_id() IS NOT NULL);

CREATE POLICY "All authenticated users can insert activities" 
ON public.atividades FOR INSERT 
WITH CHECK (public.get_current_user_id() IS NOT NULL);

-- Políticas para empresa_config
CREATE POLICY "User can read own config or admin can read all"
  ON public.empresa_config FOR SELECT
  USING (
    user_id = public.get_current_user_id() OR
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "User can insert own config"
  ON public.empresa_config FOR INSERT
  WITH CHECK (
    user_id = public.get_current_user_id()
  );

CREATE POLICY "User can update own config or admin"
  ON public.empresa_config FOR UPDATE
  USING (
    user_id = public.get_current_user_id() OR
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "User can delete own config or admin"
  ON public.empresa_config FOR DELETE
  USING (
    user_id = public.get_current_user_id() OR
    public.get_current_user_role() = 'admin'
  );

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email_ativo ON public.usuarios(email, ativo);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_user_id ON public.ordens_servico(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_atividades_usuario_id ON public.logs_atividades(usuario_id);
CREATE INDEX IF NOT EXISTS idx_empresa_config_user_id ON public.empresa_config(user_id);

-- Inserir dados iniciais
INSERT INTO public.tecnicos (nome) VALUES 
  ('Daniel Victor'),
  ('Heinenger'),
  ('Samuel')
ON CONFLICT DO NOTHING;

INSERT INTO public.estoque (nome, categoria, marca, quantidade, valor_unitario, estoque_minimo) VALUES 
  ('Tela 15.6"', 'Peças', 'Dell', 2, 250.00, 5),
  ('Memória RAM 8GB', 'Peças', 'Kingston', 8, 180.00, 3),
  ('HD 1TB', 'Peças', 'Seagate', 4, 220.00, 2),
  ('Fonte 500W', 'Peças', 'Corsair', 6, 150.00, 3),
  ('Teclado Notebook', 'Peças', 'Genérico', 12, 45.00, 5)
ON CONFLICT DO NOTHING;

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO public.usuarios (nome_completo, email, senha_hash, cargo) 
VALUES ('Administrador', 'admin@hitech.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;
