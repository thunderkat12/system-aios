
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile from our usuarios table
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('usuarios')
                .select('id, email, cargo, nome_completo, created_at')
                .eq('email', session.user.email)
                .eq('ativo', true)
                .single();

              if (profile) {
                setUserProfile({
                  id: profile.id,
                  email: profile.email,
                  role: profile.cargo as 'admin' | 'tecnico' | 'atendente',
                  full_name: profile.nome_completo,
                  created_at: profile.created_at
                });
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'tecnico' | 'atendente') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;

      // Create user profile in our usuarios table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: email,
            nome_completo: fullName,
            cargo: role,
            senha_hash: 'SUPABASE_MANAGED', // Placeholder since Supabase manages passwords
            ativo: true
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta!`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      let errorMessage = 'Email ou senha incorretos';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Confirme seu email antes de fazer login';
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
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
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    userProfile,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session
  };
}
