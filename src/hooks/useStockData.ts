
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { stockSchema, StockData } from '@/lib/validation';
import { sanitizeString } from '@/lib/auth';

export interface StockItem {
  id: string;
  nome: string;
  categoria: string | null;
  marca: string | null;
  quantidade: number;
  estoque_minimo: number | null;
  valor_unitario: number | null;
  valor_total?: number | null;
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useStockData() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseAuth();

  const fetchStockItems = async () => {
    if (!user) return { data: [], error: 'Usuário não autenticado' };
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('estoque')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar estoque:', error);
        return { data: [], error };
      }

      setStockItems(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      return { data: [], error };
    } finally {
      setIsLoading(false);
    }
  };

  const addStockItem = async (itemData: StockData) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' };
    if (user.cargo !== 'admin') return { data: null, error: 'Apenas administradores podem adicionar itens ao estoque' };

    try {
      // Validate input
      const validatedData = stockSchema.parse(itemData);

      // Sanitize inputs
      const sanitizedItem = {
        nome: sanitizeString(validatedData.nome),
        categoria: validatedData.categoria ? sanitizeString(validatedData.categoria) : null,
        marca: validatedData.marca ? sanitizeString(validatedData.marca) : null,
        quantidade: validatedData.quantidade,
        estoque_minimo: validatedData.estoque_minimo || 5,
        valor_unitario: validatedData.valor_unitario || null
      };

      const { data, error } = await supabase
        .from('estoque')
        .insert(sanitizedItem)
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar item:', error);
        return { data: null, error };
      }

      await fetchStockItems();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      return { data: null, error };
    }
  };

  const updateStockItem = async (id: string, itemData: Partial<StockData>) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' };
    if (user.cargo !== 'admin') return { data: null, error: 'Apenas administradores podem atualizar o estoque' };

    try {
      // Validate input if provided
      if (Object.keys(itemData).length > 0) {
        stockSchema.partial().parse(itemData);
      }

      // Sanitize inputs
      const sanitizedData: any = { updated_at: new Date().toISOString() };
      
      if (itemData.nome) sanitizedData.nome = sanitizeString(itemData.nome);
      if (itemData.categoria !== undefined) {
        sanitizedData.categoria = itemData.categoria ? sanitizeString(itemData.categoria) : null;
      }
      if (itemData.marca !== undefined) {
        sanitizedData.marca = itemData.marca ? sanitizeString(itemData.marca) : null;
      }
      if (itemData.quantidade !== undefined) sanitizedData.quantidade = itemData.quantidade;
      if (itemData.estoque_minimo !== undefined) sanitizedData.estoque_minimo = itemData.estoque_minimo;
      if (itemData.valor_unitario !== undefined) sanitizedData.valor_unitario = itemData.valor_unitario;

      const { data, error } = await supabase
        .from('estoque')
        .update(sanitizedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar item:', error);
        return { data: null, error };
      }

      await fetchStockItems();
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      return { data: null, error };
    }
  };

  const deleteStockItem = async (id: string) => {
    if (!user) return { error: 'Usuário não autenticado' };
    if (user.cargo !== 'admin') return { error: 'Apenas administradores podem excluir itens do estoque' };

    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir item:', error);
        return { error };
      }

      await fetchStockItems();
      return { error: null };
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchStockItems();
    }
  }, [user]);

  return {
    stockItems,
    isLoading,
    fetchStockItems,
    addStockItem,
    updateStockItem,
    deleteStockItem
  };
}
