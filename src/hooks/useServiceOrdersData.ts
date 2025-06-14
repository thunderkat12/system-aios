
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { serviceOrderSchema, ServiceOrderData } from '@/lib/validation';
import { sanitizeString } from '@/lib/auth';

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
  user_id: string;
  created_at?: string;
  updated_at?: string;
  finalizada_em?: string | null;
}

export function useServiceOrdersData() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseAuth();

  const fetchServiceOrders = async () => {
    if (!user) return { data: [], error: 'Usuário não autenticado' };
    
    try {
      setIsLoading(true);
      
      // Implement user-based access control
      let query = supabase.from('ordens_servico').select('*');
      
      // Admins can see all orders, others only their own
      if (user.cargo !== 'admin') {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

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

  const addServiceOrder = async (orderData: ServiceOrderData) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' };

    try {
      // Validate input
      const validatedData = serviceOrderSchema.parse(orderData);

      // Sanitize inputs
      const sanitizedOrder = {
        numero_os: sanitizeString(validatedData.numero_os),
        cliente_nome: sanitizeString(validatedData.cliente_nome),
        dispositivo: sanitizeString(validatedData.dispositivo),
        tipo_reparo: sanitizeString(validatedData.tipo_reparo),
        tecnico_responsavel: sanitizeString(validatedData.tecnico_responsavel),
        status: validatedData.status ? sanitizeString(validatedData.status) : 'Em Andamento',
        valor: validatedData.valor || null,
        observacoes: validatedData.observacoes ? sanitizeString(validatedData.observacoes) : null,
        user_id: user.id // Always associate with current user
      };

      const { data, error } = await supabase
        .from('ordens_servico')
        .insert(sanitizedOrder)
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

  const updateServiceOrder = async (id: string, orderData: Partial<ServiceOrderData>) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' };

    try {
      // Validate input if provided
      if (Object.keys(orderData).length > 0) {
        serviceOrderSchema.partial().parse(orderData);
      }

      // Check if user owns this service order or is admin
      const { data: existingOrder } = await supabase
        .from('ordens_servico')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingOrder) {
        return { data: null, error: 'Ordem de serviço não encontrada' };
      }

      if (user.cargo !== 'admin' && existingOrder.user_id !== user.id) {
        return { data: null, error: 'Acesso negado: você não pode editar esta OS' };
      }

      const updateData: any = { 
        updated_at: new Date().toISOString()
      };

      // Sanitize inputs
      if (orderData.numero_os) updateData.numero_os = sanitizeString(orderData.numero_os);
      if (orderData.cliente_nome) updateData.cliente_nome = sanitizeString(orderData.cliente_nome);
      if (orderData.dispositivo) updateData.dispositivo = sanitizeString(orderData.dispositivo);
      if (orderData.tipo_reparo) updateData.tipo_reparo = sanitizeString(orderData.tipo_reparo);
      if (orderData.tecnico_responsavel) updateData.tecnico_responsavel = sanitizeString(orderData.tecnico_responsavel);
      if (orderData.status) {
        updateData.status = sanitizeString(orderData.status);
        // Se está finalizando a OS, adicionar data de finalização
        if (orderData.status === 'Finalizada') {
          updateData.finalizada_em = new Date().toISOString();
        }
      }
      if (orderData.valor !== undefined) updateData.valor = orderData.valor;
      if (orderData.observacoes !== undefined) {
        updateData.observacoes = orderData.observacoes ? sanitizeString(orderData.observacoes) : null;
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
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      // Check if user owns this service order or is admin
      const { data: existingOrder } = await supabase
        .from('ordens_servico')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existingOrder) {
        return { error: 'Ordem de serviço não encontrada' };
      }

      if (user.cargo !== 'admin' && existingOrder.user_id !== user.id) {
        return { error: 'Acesso negado: você não pode excluir esta OS' };
      }

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
    if (user) {
      fetchServiceOrders();
    }
  }, [user]);

  return {
    serviceOrders,
    isLoading,
    fetchServiceOrders,
    addServiceOrder,
    updateServiceOrder,
    deleteServiceOrder
  };
}
