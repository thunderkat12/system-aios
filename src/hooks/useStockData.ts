import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { stockSchema, StockData } from '@/lib/validation';

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

// Sanitization function (XSS protection)
const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '').slice(0, 1000);
};

export function useStockData() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, user } = useAuth();

  const fetchStockItems = async () => {
    if (!user || !userProfile) return { data: [], error: 'Usuário não autenticado' };
    
    try {
      setIsLoading(true);
      
      // All users can view stock, but only admins can modify
      const { data, error } = await supabase
        .from('estoque')
        .select('*')
        .order('nome');

      if (error) {
        throw error;
      }

      setStockItems(data || []);
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: 'Erro ao carregar estoque' };
    } finally {
      setIsLoading(false);
    }
  };

  const addStockItem = async (itemData: StockData) => {
    if (!user || !userProfile) return { data: null, error: 'Usuário não autenticado' };
    if (userProfile.role !== 'admin') return { data: null, error: 'Apenas administradores podem adicionar itens ao estoque' };

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
        throw error;
      }

      await fetchStockItems();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao adicionar item' };
    }
  };

  const updateStockItem = async (id: string, itemData: Partial<StockData>) => {
    if (!user || !userProfile) return { data: null, error: 'Usuário não autenticado' };
    if (userProfile.role !== 'admin') return { data: null, error: 'Apenas administradores podem atualizar o estoque' };

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
        throw error;
      }

      await fetchStockItems();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao atualizar item' };
    }
  };

  const deleteStockItem = async (id: string) => {
    if (!user || !userProfile) return { error: 'Usuário não autenticado' };
    if (userProfile.role !== 'admin') return { error: 'Apenas administradores podem excluir itens do estoque' };

    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchStockItems();
      return { error: null };
    } catch (error) {
      return { error: 'Erro ao excluir item' };
    }
  };

  useEffect(() => {
    if (user && userProfile) {
      fetchStockItems();
    }
  }, [user, userProfile]);

  return {
    stockItems,
    isLoading,
    fetchStockItems,
    addStockItem,
    updateStockItem,
    deleteStockItem
  };
}
