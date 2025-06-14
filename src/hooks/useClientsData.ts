
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  ativo: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export function useClientsData() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return { data: [], error };
      }

      setClients(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return { data: [], error };
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert(client)
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar cliente:', error);
        return { data: null, error };
      }

      await fetchClients();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      return { data: null, error };
    }
  };

  const updateClient = async (id: string, client: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update({ ...client, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        return { data: null, error };
      }

      await fetchClients();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { data: null, error };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir cliente:', error);
        return { error };
      }

      await fetchClients();
      return { error: null };
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
}
