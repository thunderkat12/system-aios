
-- Remover constraints de chave estrangeira (opcional, boa prática se as tabelas referenciam entre si)
ALTER TABLE IF EXISTS public.estoque DROP CONSTRAINT IF EXISTS estoque_user_id_fkey;
ALTER TABLE IF EXISTS public.clientes DROP CONSTRAINT IF EXISTS clientes_user_id_fkey;
ALTER TABLE IF EXISTS public.ordens_servico DROP CONSTRAINT IF EXISTS ordens_servico_user_id_fkey;
ALTER TABLE IF EXISTS public.ordens_servico DROP CONSTRAINT IF EXISTS ordens_servico_cliente_id_fkey;
ALTER TABLE IF EXISTS public.empresa_config DROP CONSTRAINT IF EXISTS empresa_config_user_id_fkey;
ALTER TABLE IF EXISTS public.logs_atividades DROP CONSTRAINT IF EXISTS logs_atividades_usuario_id_fkey;

-- Apagar tabelas (ordem importa para respeitar FK)
DROP TABLE IF EXISTS public.empresa_config CASCADE;
DROP TABLE IF EXISTS public.estoque CASCADE;
DROP TABLE IF EXISTS public.ordens_servico CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.logs_atividades CASCADE;
DROP TABLE IF EXISTS public.tecnicos CASCADE;
DROP TABLE IF EXISTS public.atividades CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.n8n_chat_histories CASCADE;
DROP TABLE IF EXISTS public.vendas CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.CRM CASCADE;
DROP TABLE IF EXISTS public.Tabela CASCADE;

-- Remover funções customizadas (opcional, depende das suas necessidades)
DROP FUNCTION IF EXISTS public.get_current_user_id CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role CASCADE;
DROP FUNCTION IF EXISTS public.get_empresa_config CASCADE;
DROP FUNCTION IF EXISTS public.create_empresa_config CASCADE;
DROP FUNCTION IF EXISTS public.update_empresa_config CASCADE;
DROP FUNCTION IF EXISTS public.set_empresa_config_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.match_documents CASCADE;

-- Remover índices personalizados (opcional)
DROP INDEX IF EXISTS public.idx_clientes_user_id;
DROP INDEX IF EXISTS public.idx_ordens_servico_user_id;
DROP INDEX IF EXISTS public.idx_usuarios_email;
DROP INDEX IF EXISTS public.idx_logs_atividades_usuario_id;
DROP INDEX IF EXISTS public.idx_empresa_config_user_id;
DROP INDEX IF EXISTS public.idx_usuarios_email_ativo;
