
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
      // Check if there's a valid session in localStorage
      const authData = localStorage.getItem('hitech_auth_data');
      if (authData) {
        const userData = JSON.parse(authData);
        
        // Verify the session is still valid by checking if user exists and is active
        const { data: userExists, error } = await supabase
          .from('usuarios')
          .select('id, nome_completo, email, cargo, ativo')
          .eq('id', userData.id)
          .eq('ativo', true)
          .single();

        if (error || !userExists) {
          // Session is invalid, clear it
          localStorage.removeItem('hitech_auth_data');
          setUser(null);
        } else {
          // Session is valid, set user
          setUser(userExists as User);
        }
      }
    } catch (error) {
      // Clear invalid session data
      localStorage.removeItem('hitech_auth_data');
      setUser(null);
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

      // Query user from database
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', sanitizedEmail)
        .eq('ativo', true)
        .limit(1);

      if (error) {
        throw new Error('Erro interno do sistema');
      }

      if (!usuarios || usuarios.length === 0) {
        throw new Error('Email ou senha incorretos');
      }

      const usuario = usuarios[0];

      // Verify password
      const senhaValida = await verifyPassword(validatedData.senha, usuario.senha_hash);

      if (!senhaValida) {
        throw new Error('Email ou senha incorretos');
      }

      // Create user session
      const userData: User = {
        id: usuario.id,
        nome_completo: sanitizeString(usuario.nome_completo),
        email: usuario.email,
        cargo: usuario.cargo as 'admin' | 'tecnico' | 'atendente',
        ativo: usuario.ativo
      };

      // Store session with expiration (24 hours)
      const sessionData = {
        ...userData,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      localStorage.setItem('hitech_auth_data', JSON.stringify(sessionData));
      setUser(userData);

      // Log activity
      await logActivity('login', `Login realizado por ${userData.nome_completo}`, usuario.id);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userData.nome_completo}`,
      });

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Email ou senha incorretos';
      
      if (error.errors) {
        // Zod validation error
        errorMessage = 'Dados inválidos fornecidos';
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

      // Only admins can register new users
      if (!user || user.cargo !== 'admin') {
        throw new Error('Apenas administradores podem cadastrar usuários');
      }

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
        if (error.code === '23505') {
          throw new Error('Este email já está cadastrado');
        }
        throw new Error('Erro ao cadastrar usuário');
      }

      await logActivity('create_user', `Novo usuário ${sanitizedNome} foi criado`);

      toast({
        title: "Usuário cadastrado com sucesso!",
        description: "O novo usuário já pode fazer login no sistema",
      });

      return { success: true };
    } catch (error: any) {
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
      // Silent fail on logout
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
      // Silent fail on logging
    }
  };

  // Check for session expiration periodically
  useEffect(() => {
    const checkSessionExpiration = () => {
      const authData = localStorage.getItem('hitech_auth_data');
      if (authData) {
        try {
          const sessionData = JSON.parse(authData);
          if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
            // Session expired
            localStorage.removeItem('hitech_auth_data');
            setUser(null);
            toast({
              title: "Sessão expirada",
              description: "Sua sessão expirou. Faça login novamente.",
              variant: "destructive",
            });
          }
        } catch (error) {
          // Invalid session data, clear it
          localStorage.removeItem('hitech_auth_data');
          setUser(null);
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkSessionExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, toast]);

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
