
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authRateLimit } from '@/lib/authRateLimit';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'tecnico' | 'atendente';
  full_name: string;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('usuarios')
        .select('id, email, cargo, nome_completo, created_at')
        .eq('email', user.email)
        .eq('ativo', true)
        .single();

      if (error) {
        console.log('Profile not found, user needs to complete registration');
        setUserProfile(null);
      } else if (profile) {
        setUserProfile({
          id: profile.id,
          email: profile.email,
          role: profile.cargo as 'admin' | 'tecnico' | 'atendente',
          full_name: profile.nome_completo,
          created_at: profile.created_at
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'tecnico' | 'atendente') => {
    try {
      if (!email || !password || !fullName || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role
          }
        }
      });

      if (error) throw error;

      // Create user profile in usuarios table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: email.toLowerCase().trim(),
            nome_completo: fullName.trim(),
            cargo: role,
            senha_hash: 'SUPABASE_MANAGED',
            ativo: true
          });

        if (profileError) {
          console.log('Profile creation warning:', profileError.message);
        }
      }

      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });

      return { success: true, error: null };
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado';
      } else if (error.message?.includes('password')) {
        errorMessage = 'Senha deve ter pelo menos 6 caracteres';
      } else if (error.message?.includes('email')) {
        errorMessage = 'Email inválido';
      }

      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    const identifier = email.toLowerCase().trim();
    
    // Check rate limit
    const rateCheck = authRateLimit.checkRateLimit(identifier);
    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.timeRemaining || 0) / 60);
      toast({
        title: "Muitas tentativas de login",
        description: `Aguarde ${minutes} minuto(s) antes de tentar novamente.`,
        variant: "destructive"
      });
      return { success: false, error: "Muitas tentativas de login" };
    }

    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password
      });

      if (error) {
        authRateLimit.recordAttempt(identifier, false);
        
        const remaining = authRateLimit.getRemainingAttempts(identifier);
        const warningMessage = remaining > 0 
          ? ` (${remaining} tentativas restantes)`
          : '';

        toast({
          title: "Erro no login",
          description: `Usuário ou senha inválidos.${warningMessage}`,
          variant: "destructive"
        });
        return { success: false, error: "Usuário ou senha inválidos." };
      }

      authRateLimit.recordAttempt(identifier, true);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!"
      });

      return { success: true, error: null };
    } catch (error: any) {
      authRateLimit.recordAttempt(identifier, false);
      
      toast({
        title: "Erro no login",
        description: "Usuário ou senha inválidos.",
        variant: "destructive"
      });
      return { success: false, error: "Usuário ou senha inválidos." };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Erro no login com Google",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Erro no login com Google",
        description: "Falha ao conectar com Google",
        variant: "destructive"
      });
      return { success: false, error: "Falha ao conectar com Google" };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setUserProfile(null);

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado do sistema",
      });
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    userProfile,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!session
  };
}
