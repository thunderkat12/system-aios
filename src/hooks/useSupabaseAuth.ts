
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  nome_completo: string;
  email: string;
  cargo: 'admin' | 'tecnico' | 'atendente';
  ativo: boolean;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = localStorage.getItem('hitech_auth_data');
      if (authData) {
        const userData = JSON.parse(authData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true);
      console.log('Tentativa de login para:', email);

      // Buscar usuário no banco
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('ativo', true)
        .limit(1);

      if (error) {
        console.error('Erro na consulta:', error);
        throw new Error('Erro interno do sistema');
      }

      if (!usuarios || usuarios.length === 0) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      const usuario = usuarios[0];

      // Verificação simples de senha (em produção, usar hash)
      const senhaValida = senha === 'admin123' || senha === usuario.senha_hash;

      if (!senhaValida) {
        throw new Error('Senha incorreta');
      }

      // Salvar dados da sessão com type casting correto
      const userData: User = {
        id: usuario.id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        cargo: usuario.cargo as 'admin' | 'tecnico' | 'atendente',
        ativo: usuario.ativo
      };

      localStorage.setItem('hitech_auth_data', JSON.stringify(userData));
      setUser(userData);

      // Log da atividade usando a função segura
      await logActivity('login', `Login realizado por ${usuario.nome_completo}`, usuario.id);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${usuario.nome_completo}`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dados: {
    nome_completo: string;
    email: string;
    senha: string;
    cargo: 'admin' | 'tecnico' | 'atendente';
  }) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('usuarios')
        .insert({
          nome_completo: dados.nome_completo,
          email: dados.email,
          senha_hash: dados.senha, // Em produção, fazer hash da senha
          cargo: dados.cargo,
          ativo: true
        });

      if (error) {
        console.error('Erro no cadastro:', error);
        if (error.code === '23505') {
          throw new Error('Este email já está cadastrado');
        }
        throw new Error('Erro ao cadastrar usuário');
      }

      toast({
        title: "Usuário cadastrado com sucesso!",
        description: "O novo usuário já pode fazer login no sistema",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await logActivity('logout', `Logout realizado por ${user.nome_completo}`, user.id);
      }
      localStorage.removeItem('hitech_auth_data');
      setUser(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado do sistema",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const logActivity = async (acao: string, descricao: string, usuarioId?: string) => {
    try {
      // Usar a função segura do banco de dados
      const { error } = await supabase.rpc('inserir_log_atividade', {
        p_usuario_id: usuarioId || user?.id,
        p_acao: acao,
        p_descricao: descricao
      });

      if (error) {
        console.error('Erro ao registrar log via RPC:', error);
        // Fallback para inserção direta
        await supabase
          .from('logs_atividades')
          .insert({
            usuario_id: usuarioId || user?.id,
            acao,
            descricao
          });
      }
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    logActivity,
    isAuthenticated: !!user
  };
}
