
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceOrder {
  id: string;
  numero_os: string;
  cliente_id: string | null;
  cliente_nome: string;
  dispositivo: string;
  tipo_reparo: string;
  tecnico_responsavel: string;
  status: string | null;
  valor: number | null;
  observacoes: string | null;
  created_at?: string;
  updated_at?: string;
  finalizada_em?: string | null;
}

export function useServiceOrdersData() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServiceOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ordens de serviço:', error);
        return { data: [], error };
      }

      setServiceOrders(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar ordens de serviço:', error);
      return { data: [], error };
    } finally {
      setIsLoading(false);
    }
  };

  const addServiceOrder = async (order: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .insert(order)
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar OS:', error);
        return { data: null, error };
      }

      await fetchServiceOrders();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao adicionar OS:', error);
      return { data: null, error };
    }
  };

  const updateServiceOrder = async (id: string, order: Partial<ServiceOrder>) => {
    try {
      const updateData = { 
        ...order, 
        updated_at: new Date().toISOString()
      };

      // Se está finalizando a OS, adicionar data de finalização
      if (order.status === 'Finalizada' && !order.finalizada_em) {
        updateData.finalizada_em = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('ordens_servico')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar OS:', error);
        return { data: null, error };
      }

      await fetchServiceOrders();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar OS:', error);
      return { data: null, error };
    }
  };

  const deleteServiceOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir OS:', error);
        return { error };
      }

      await fetchServiceOrders();
      return { error: null };
    } catch (error) {
      console.error('Erro ao excluir OS:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  return {
    serviceOrders,
    isLoading,
    fetchServiceOrders,
    addServiceOrder,
    updateServiceOrder,
    deleteServiceOrder
  };
}
