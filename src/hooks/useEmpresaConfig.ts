
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmpresaConfig {
  id: string;
  user_id: string;
  nome_empresa: string;
  tema_primario: string;
  tema_secundario: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export function useEmpresaConfig() {
  const [config, setConfig] = useState<EmpresaConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasConfig, setHasConfig] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadConfig();
    }
  }, [user]);

  const loadConfig = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase.rpc as any)("get_empresa_config", { p_user_id: user.id });

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading empresa config:', error);
        toast({
          title: "Erro de segurança",
          description: "Acesso negado à configuração da empresa.",
          variant: "destructive"
        });
        setHasConfig(false);
        setConfig(null);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        const configData = data[0] as EmpresaConfig;
        setConfig(configData);
        setHasConfig(true);
        applyTheme(configData.tema_primario, configData.tema_secundario);
      } else {
        setHasConfig(false);
        setConfig(null);
      }
    } catch (error) {
      console.error('Error loading empresa config:', error);
      setHasConfig(false);
      setConfig(null);
      toast({
        title: "Falha de autenticação",
        description: "Não foi possível carregar a configuração da empresa: tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createConfig = async (
    configData: Omit<EmpresaConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      // Always pass the user_id from the session
      const { data, error } = await (supabase.rpc as any)("create_empresa_config", {
        p_user_id: user.id,
        p_nome_empresa: configData.nome_empresa,
        p_tema_primario: configData.tema_primario,
        p_tema_secundario: configData.tema_secundario,
        p_webhook_url: configData.webhook_url || null
      });

      if (error) {
        console.error('Error creating config:', error);
        toast({
          title: "Erro ao criar configuração",
          description: error.message === "new row violates row-level security policy for table \"empresa_config\""
            ? "Você não tem permissão para criar esta configuração."
            : error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      if (Array.isArray(data) && data.length > 0) {
        const newConfig = data[0] as EmpresaConfig;
        setConfig(newConfig);
        setHasConfig(true);
        applyTheme(newConfig.tema_primario, newConfig.tema_secundario);

        toast({
          title: "Configuração salva!",
          description: "Sua conta foi configurada com sucesso.",
        });

        return { success: true, data: newConfig };
      }

      return { success: false, error: 'Falha ao criar configuração' };
    } catch (error: any) {
      console.error('Error creating config:', error);
      toast({
        title: "Falha de autenticação",
        description: "Não foi possível criar a configuração: tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const updateConfig = async (
    updates: Partial<Omit<EmpresaConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user || !config) return { success: false, error: 'Configuração não encontrada' };

    try {
      const { data, error } = await (supabase.rpc as any)("update_empresa_config", {
        p_user_id: user.id,
        p_nome_empresa: updates.nome_empresa || config.nome_empresa,
        p_tema_primario: updates.tema_primario || config.tema_primario,
        p_tema_secundario: updates.tema_secundario || config.tema_secundario,
        p_webhook_url: updates.webhook_url !== undefined ? updates.webhook_url : config.webhook_url
      });

      if (error) {
        console.error('Error updating config:', error);
        toast({
          title: "Erro ao atualizar configuração",
          description: error.message === "row update violates row-level security policy for table \"empresa_config\""
            ? "Você não tem permissão para atualizar esta configuração."
            : error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      if (Array.isArray(data) && data.length > 0) {
        const updatedConfig = data[0] as EmpresaConfig;
        setConfig(updatedConfig);
        if (updates.tema_primario || updates.tema_secundario) {
          applyTheme(
            updates.tema_primario || config.tema_primario,
            updates.tema_secundario || config.tema_secundario
          );
        }
        toast({
          title: "Configuração atualizada!",
          description: "Suas alterações foram salvas com sucesso.",
        });

        return { success: true, data: updatedConfig };
      }

      return { success: false, error: 'Falha ao atualizar configuração' };
    } catch (error: any) {
      console.error('Error updating config:', error);
      toast({
        title: "Falha de autenticação",
        description: "Não foi possível atualizar a configuração: tente novamente.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const applyTheme = (primario: string, secundario: string) => {
    const root = document.documentElement;
    const hexToHsl = (hex: string): string => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
      }
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h: any, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d) + (g < b ? 6 : 0); break;
          case g: h = ((b - r) / d) + 2; break;
          case b: h = ((r - g) / d) + 4; break;
        }
        h /= 6;
      }
      h = Math.round(360 * h);
      s = Math.round(100 * (s ?? 0));
      l = Math.round(100 * l);
      return `${h} ${s}% ${l}%`;
    };

    root.style.setProperty('--primary', hexToHsl(primario));
    root.style.setProperty('--secondary', hexToHsl(secundario));
  };

  return {
    config,
    isLoading,
    hasConfig,
    createConfig,
    updateConfig,
    loadConfig
  };
}
