
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { hashPassword, verifyPassword, sanitizeEmail, sanitizeString } from '@/lib/auth';
import { userLoginSchema, userRegisterSchema } from '@/lib/validation';

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
        // Verify the session is still valid by checking if user exists
        const { data: userExists } = await supabase
          .from('usuarios')
          .select('id, nome_completo, email, cargo, ativo')
          .eq('id', userData.id)
          .eq('ativo', true)
          .single();

        if (userExists) {
          setUser(userExists as User);
        } else {
          localStorage.removeItem('hitech_auth_data');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('hitech_auth_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      setIsLoading(true);

      // Validate input
      const validatedData = userLoginSchema.parse({ email, senha });
      const sanitizedEmail = sanitizeEmail(validatedData.email);

      console.log('Tentativa de login para:', sanitizedEmail);

      // Buscar usuário no banco
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', sanitizedEmail)
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

      // Verificar senha com hash
      const senhaValida = await verifyPassword(validatedData.senha, usuario.senha_hash);

      if (!senhaValida) {
        throw new Error('Senha incorreta');
      }

      // Salvar dados da sessão com type casting correto
      const userData: User = {
        id: usuario.id,
        nome_completo: sanitizeString(usuario.nome_completo),
        email: usuario.email,
        cargo: usuario.cargo as 'admin' | 'tecnico' | 'atendente',
        ativo: usuario.ativo
      };

      localStorage.setItem('hitech_auth_data', JSON.stringify(userData));
      setUser(userData);

      // Log da atividade
      await logActivity('login', `Login realizado por ${userData.nome_completo}`, usuario.id);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userData.nome_completo}`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro interno do sistema';
      if (error.message.includes('não encontrado') || error.message.includes('Senha incorreta')) {
        errorMessage = 'Email ou senha incorretos';
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
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

      // Validate input
      const validatedData = userRegisterSchema.parse(dados);

      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(validatedData.email);
      const sanitizedNome = sanitizeString(validatedData.nome_completo);

      // Hash password
      const hashedPassword = await hashPassword(validatedData.senha);

      const { error } = await supabase
        .from('usuarios')
        .insert({
          nome_completo: sanitizedNome,
          email: sanitizedEmail,
          senha_hash: hashedPassword,
          cargo: validatedData.cargo,
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
      
      let errorMessage = error.message || 'Erro interno do sistema';
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
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
      await supabase
        .from('logs_atividades')
        .insert({
          usuario_id: usuarioId || user?.id,
          acao: sanitizeString(acao),
          descricao: sanitizeString(descricao)
        });
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
