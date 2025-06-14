
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { clientSchema, ClientData } from '@/lib/validation';

export interface Client {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  ativo: boolean | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Sanitization function (XSS protection)
const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '').slice(0, 1000);
};

export function useClientsData() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, user } = useAuth();

  const fetchClients = async () => {
    if (!user || !userProfile) return { data: [], error: 'Usuário não autenticado' };
    
    try {
      setIsLoading(true);
      
      // Implement user-based access control using Supabase user ID
      let query = supabase.from('clientes').select('*');
      
      // Admins can see all clients, others only their own
      if (userProfile.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('nome');

      if (error) {
        throw error;
      }

      setClients(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: 'Erro ao carregar clientes' };
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: ClientData) => {
    if (!user || !userProfile) return { data: null, error: 'Usuário não autenticado' };

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
        user_id: user.id // Use Supabase user ID
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert(sanitizedClient)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchClients();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao adicionar cliente' };
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientData>) => {
    if (!user || !userProfile) return { data: null, error: 'Usuário não autenticado' };

    try {
      // Check if user owns this client or is admin
      const { data: existingClient } = await supabase
        .from('clientes')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingClient) {
        return { data: null, error: 'Cliente não encontrado' };
      }

      if (userProfile.role !== 'admin' && existingClient.user_id !== user.id) {
        return { data: null, error: 'Acesso negado' };
      }

      // Validate and sanitize inputs
      if (Object.keys(clientData).length > 0) {
        clientSchema.partial().parse(clientData);
      }

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
        throw error;
      }

      await fetchClients();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao atualizar cliente' };
    }
  };

  const deleteClient = async (id: string) => {
    if (!user || !userProfile) return { error: 'Usuário não autenticado' };

    try {
      // Check if user owns this client or is admin
      const { data: existingClient } = await supabase
        .from('clientes')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingClient) {
        return { error: 'Cliente não encontrado' };
      }

      if (userProfile.role !== 'admin' && existingClient.user_id !== user.id) {
        return { error: 'Acesso negado' };
      }

      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchClients();
      return { error: null };
    } catch (error) {
      return { error: 'Erro ao excluir cliente' };
    }
  };

  useEffect(() => {
    if (user && userProfile) {
      fetchClients();
    }
  }, [user, userProfile]);

  return {
    clients,
    isLoading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
}
