
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
      const { data, error } = await supabase
        .from('empresa_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading empresa config:', error);
        return;
      }

      if (data) {
        setConfig(data);
        setHasConfig(true);
        // Aplicar tema
        applyTheme(data.tema_primario, data.tema_secundario);
      } else {
        setHasConfig(false);
      }
    } catch (error) {
      console.error('Error loading empresa config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createConfig = async (configData: Omit<EmpresaConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .insert({
          user_id: user.id,
          ...configData
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating config:', error);
        return { success: false, error: error.message };
      }

      setConfig(data);
      setHasConfig(true);
      applyTheme(data.tema_primario, data.tema_secundario);

      toast({
        title: "Configuração salva!",
        description: "Sua conta foi configurada com sucesso.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating config:', error);
      return { success: false, error: error.message };
    }
  };

  const updateConfig = async (updates: Partial<Omit<EmpresaConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !config) return { success: false, error: 'Configuração não encontrada' };

    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating config:', error);
        return { success: false, error: error.message };
      }

      setConfig(data);
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

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating config:', error);
      return { success: false, error: error.message };
    }
  };

  const applyTheme = (primario: string, secundario: string) => {
    const root = document.documentElement;
    
    // Converter hex para HSL para usar no Tailwind
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
