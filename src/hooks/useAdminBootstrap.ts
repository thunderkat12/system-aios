
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Este hook cria o usuário admin@hitech.com no Auth e na tabela usuarios se não existir.
 * Senha padrão: admin123456
 * Use em qualquer tela que será montada por um admin.
 */
export function useAdminBootstrap() {
  const { toast } = useToast();

  useEffect(() => {
    let running = false;
    async function createAdminIfNeeded() {
      if (running) return;
      running = true;

      try {
        // 1. Primeiro, tentar fazer login para verificar se o usuário já existe
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: "admin@hitech.com",
          password: "admin123456"
        });

        if (signInData?.user) {
          // Admin já existe e conseguiu fazer login
          await supabase.auth.signOut(); // Sair para não interferir com o usuário atual
          console.log("Admin user already exists");
          return;
        }

        // 2. Se não conseguiu fazer login, criar o usuário
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: "admin@hitech.com",
          password: "admin123456",
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: "Administrador",
              role: "admin"
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            console.log("Admin user already exists in auth");
          } else {
            console.error("Error creating admin user:", signUpError);
            toast({
              title: "Erro ao criar usuário admin",
              description: signUpError.message,
              variant: "destructive"
            });
          }
          return;
        }

        // 3. Criar entrada na tabela usuarios se o usuário foi criado com sucesso
        if (signUpData?.user) {
          const { error: profileError } = await supabase
            .from('usuarios')
            .upsert({
              id: signUpData.user.id,
              email: "admin@hitech.com",
              nome_completo: "Administrador",
              cargo: "admin",
              senha_hash: "SUPABASE_MANAGED",
              ativo: true
            }, {
              onConflict: 'email'
            });

          if (profileError) {
            console.error("Error creating admin profile:", profileError);
          } else {
            toast({
              title: "Usuário admin criado com sucesso",
              description: "Email: admin@hitech.com | Senha: admin123456"
            });
          }

          // Sair para não interferir com o usuário atual
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Error in admin bootstrap:", error);
      } finally {
        running = false;
      }
    }

    createAdminIfNeeded();
  }, [toast]);
}
