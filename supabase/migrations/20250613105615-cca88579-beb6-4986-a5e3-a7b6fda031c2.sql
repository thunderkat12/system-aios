
-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  tipo TEXT NOT NULL, -- 'nova_os', 'os_finalizada', 'estoque_baixo', etc
  descricao TEXT NOT NULL,
  referencia_id UUID, -- ID da OS, cliente, etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais de técnicos
INSERT INTO public.tecnicos (nome) VALUES 
  ('Daniel Victor'),
  ('Heinenger'),
  ('Samuel')
ON CONFLICT DO NOTHING;

-- Inserir alguns produtos de exemplo no estoque
INSERT INTO public.estoque (nome, categoria, marca, quantidade, valor_unitario, estoque_minimo) VALUES 
  ('Tela 15.6"', 'Peças', 'Dell', 2, 250.00, 5),
  ('Memória RAM 8GB', 'Peças', 'Kingston', 8, 180.00, 3),
  ('HD 1TB', 'Peças', 'Seagate', 4, 220.00, 2),
  ('Fonte 500W', 'Peças', 'Corsair', 6, 150.00, 3),
  ('Teclado Notebook', 'Peças', 'Genérico', 12, 45.00, 5)
ON CONFLICT DO NOTHING;

-- Habilitar Row Level Security (básico para desenvolvimento)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento (em produção, ajustar conforme necessário)
CREATE POLICY "Permitir tudo clientes" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Permitir tudo ordens_servico" ON public.ordens_servico FOR ALL USING (true);
CREATE POLICY "Permitir tudo estoque" ON public.estoque FOR ALL USING (true);
CREATE POLICY "Permitir tudo tecnicos" ON public.tecnicos FOR ALL USING (true);
CREATE POLICY "Permitir tudo atividades" ON public.atividades FOR ALL USING (true);
