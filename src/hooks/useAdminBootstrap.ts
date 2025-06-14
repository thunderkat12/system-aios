
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Este hook cria o usuário admin@hitech.com no Auth e na tabela usuarios se não existir.
 * Senha padrão: admin123
 * Use em qualquer tela que será montada por um admin.
 */
export function useAdminBootstrap() {
  const { toast } = useToast();

  useEffect(() => {
    let running = false;
    async function createAdminIfNeeded() {
      if (running) return;
      running = true;

      // 1. Tenta encontrar no Supabase Auth
      let { data: usersAuth, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100
      });
      if (error) {
        toast({
          title: "Erro ao buscar usuários no Auth Supabase",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const adminAuth = usersAuth?.users.find(
        (u) => u.email === "admin@hitech.com"
      );

      // 2. Se não existe, criar
      if (!adminAuth) {
        const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
          email: "admin@hitech.com",
          password: "admin123",
          email_confirm: true,
        });
        if (signUpError) {
          toast({
            title: "Erro ao criar admin no Auth",
            description: signUpError.message,
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Usuário admin@hitech.com criado no Auth",
          description: "Senha padrão: admin123",
        });
      }

      // 3. Checa se existe na tabela usuarios
      const { data: udata } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', 'admin@hitech.com')
        .maybeSingle();

      if (!udata) {
        await supabase.from("usuarios").insert({
          email: "admin@hitech.com",
          nome_completo: "Administrador",
          cargo: "admin",
          senha_hash: "SUPABASE_MANAGED",
          ativo: true,
        });
        toast({
          title: "Usuário admin cadastrado na tabela usuarios",
          description: "Senha padrão: admin123"
        });
      }
    }
    createAdminIfNeeded();
    return () => {
      running = false;
    };
  }, []);
}

