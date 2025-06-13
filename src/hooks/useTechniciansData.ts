
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Technician {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean | null;
  created_at?: string;
}

export function useTechniciansData() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTechnicians = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tecnicos')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar técnicos:', error);
        return { data: [], error };
      }

      setTechnicians(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
      return { data: [], error };
    } finally {
      setIsLoading(false);
    }
  };

  const addTechnician = async (technician: Omit<Technician, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tecnicos')
        .insert(technician)
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar técnico:', error);
        return { data: null, error };
      }

      await fetchTechnicians();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao adicionar técnico:', error);
      return { data: null, error };
    }
  };

  const updateTechnician = async (id: string, technician: Partial<Technician>) => {
    try {
      const { data, error } = await supabase
        .from('tecnicos')
        .update(technician)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar técnico:', error);
        return { data: null, error };
      }

      await fetchTechnicians();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar técnico:', error);
      return { data: null, error };
    }
  };

  const deleteTechnician = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tecnicos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir técnico:', error);
        return { error };
      }

      await fetchTechnicians();
      return { error: null };
    } catch (error) {
      console.error('Erro ao excluir técnico:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  return {
    technicians,
    isLoading,
    fetchTechnicians,
    addTechnician,
    updateTechnician,
    deleteTechnician
  };
}
