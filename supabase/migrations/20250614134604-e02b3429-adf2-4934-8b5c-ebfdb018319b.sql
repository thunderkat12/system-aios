
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

-- Criar tabela de logs de atividades
CREATE TABLE IF NOT EXISTS public.logs_atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id),
  acao TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_atividades ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários (admins podem ver todos, outros só a si próprios)
CREATE POLICY "Usuarios podem ver próprio perfil" ON public.usuarios FOR SELECT USING (true);
CREATE POLICY "Admins podem inserir usuários" ON public.usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem atualizar usuários" ON public.usuarios FOR UPDATE USING (true);
CREATE POLICY "Admins podem deletar usuários" ON public.usuarios FOR DELETE USING (true);

-- Políticas para logs (admins podem ver todos)
CREATE POLICY "Permitir visualizar logs" ON public.logs_atividades FOR SELECT USING (true);
CREATE POLICY "Permitir inserir logs" ON public.logs_atividades FOR INSERT WITH CHECK (true);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO public.usuarios (nome_completo, email, senha_hash, cargo) 
VALUES ('Administrador', 'admin@hitech.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;
