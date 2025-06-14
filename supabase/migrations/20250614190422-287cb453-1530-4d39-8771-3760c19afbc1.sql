
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
