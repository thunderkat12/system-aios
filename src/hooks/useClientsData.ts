
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { clientSchema, ClientData } from '@/lib/validation';
import { sanitizeString } from '@/lib/auth';

export interface Client {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  ativo: boolean | null;
  user_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useClientsData() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseAuth();

  const fetchClients = async () => {
    if (!user) return { data: [], error: 'Usuário não autenticado' };
    
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

  const addClient = async (clientData: ClientData) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' };

    try {
      // Validate input
      const validatedData = clientSchema.parse(clientData);

      // Sanitize inputs
      const sanitizedClient = {
        nome: sanitizeString(validatedData.nome),
        telefone: validatedData.telefone ? sanitizeString(validatedData.telefone) : null,
        email: validatedData.email ? sanitizeString(validatedData.email) : null,
        endereco: validatedData.endereco ? sanitizeString(validatedData.endereco) : null,
        ativo: true,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert(sanitizedClient)
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

  const updateClient = async (id: string, clientData: Partial<ClientData>) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' };

    try {
      // Validate input if provided
      if (Object.keys(clientData).length > 0) {
        clientSchema.partial().parse(clientData);
      }

      // Sanitize inputs
      const sanitizedData: any = { updated_at: new Date().toISOString() };
      
      if (clientData.nome) sanitizedData.nome = sanitizeString(clientData.nome);
      if (clientData.telefone !== undefined) {
        sanitizedData.telefone = clientData.telefone ? sanitizeString(clientData.telefone) : null;
      }
      if (clientData.email !== undefined) {
        sanitizedData.email = clientData.email ? sanitizeString(clientData.email) : null;
      }
      if (clientData.endereco !== undefined) {
        sanitizedData.endereco = clientData.endereco ? sanitizeString(clientData.endereco) : null;
      }

      const { data, error } = await supabase
        .from('clientes')
        .update(sanitizedData)
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
    if (!user) return { error: 'Usuário não autenticado' };

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
    if (user) {
      fetchClients();
    }
  }, [user]);

  return {
    clients,
    isLoading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
}
