
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StockItem {
  id: string;
  nome: string;
  categoria: string | null;
  marca: string | null;
  quantidade: number;
  estoque_minimo: number | null;
  valor_unitario: number | null;
  valor_total?: number | null;
  created_at?: string;
  updated_at?: string;
}

export function useStockData() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStockItems = async () => {
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

  const addStockItem = async (item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('estoque')
        .insert(item)
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

  const updateStockItem = async (id: string, item: Partial<StockItem>) => {
    try {
      const { data, error } = await supabase
        .from('estoque')
        .update({ ...item, updated_at: new Date().toISOString() })
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
    fetchStockItems();
  }, []);

  return {
    stockItems,
    isLoading,
    fetchStockItems,
    addStockItem,
    updateStockItem,
    deleteStockItem
  };
}
