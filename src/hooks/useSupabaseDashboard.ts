
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  activeClients: number;
  openOS: number;
  completedOS: number;
  revenue: number;
  lowStockItems: number;
  averageTime: string;
  technicians: Array<{
    name: string;
    activeJobs: number;
    completedJobs: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    time: string;
    user: string;
  }>;
}

export function useSupabaseDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeClients: 0,
    openOS: 0,
    completedOS: 0,
    revenue: 0,
    lowStockItems: 0,
    averageTime: "0 dias",
    technicians: [],
    recentActivities: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Buscar clientes ativos
      const { data: clientes } = await supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true);

      // Buscar OS abertas
      const { data: osAbertas } = await supabase
        .from('ordens_servico')
        .select('*')
        .in('status', ['Em Andamento', 'Aguardando Peças', 'Aguardando Aprovação']);

      // Buscar OS finalizadas
      const { data: osFinalizadas } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('status', 'Finalizada');

      // Calcular faturamento total das OS finalizadas
      const faturamentoTotal = osFinalizadas?.reduce((total, os) => total + (Number(os.valor) || 0), 0) || 0;

      // Buscar itens com estoque baixo
      const { data: estoque } = await supabase
        .from('estoque')
        .select('*');

      const estoqueBaixo = estoque?.filter(item => 
        item.quantidade <= (item.estoque_minimo || 5) || item.quantidade === 0
      ) || [];

      // Buscar técnicos e suas estatísticas
      const { data: tecnicos } = await supabase
        .from('tecnicos')
        .select('*')
        .eq('ativo', true);

      const technicianStats = await Promise.all(
        tecnicos?.map(async (tecnico) => {
          const { data: osAtivas } = await supabase
            .from('ordens_servico')
            .select('*')
            .eq('tecnico_responsavel', tecnico.nome)
            .in('status', ['Em Andamento', 'Aguardando Peças', 'Aguardando Aprovação']);

          const { data: osCompletas } = await supabase
            .from('ordens_servico')
            .select('*')
            .eq('tecnico_responsavel', tecnico.nome)
            .eq('status', 'Finalizada');

          return {
            name: tecnico.nome,
            activeJobs: osAtivas?.length || 0,
            completedJobs: osCompletas?.length || 0
          };
        }) || []
      );

      // Buscar até 3 atividades recentes
      const { data: atividades } = await supabase
        .from('atividades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      const recentActivities = atividades?.map(atividade => ({
        id: atividade.id,
        type: atividade.tipo,
        description: atividade.descricao,
        time: getTimeAgo(atividade.created_at || ''),
        user: "Sistema",
      })) || [];

      // Calcular tempo médio de reparo
      let averageTime = "0 dias";
      if (osFinalizadas && osFinalizadas.length > 0) {
        const temposReparo = osFinalizadas
          .filter(os => os.created_at && os.finalizada_em)
          .map(os => {
            const inicio = new Date(os.created_at!);
            const fim = new Date(os.finalizada_em!);
            return Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
          });

        if (temposReparo.length > 0) {
          const mediaEmDias = temposReparo.reduce((a, b) => a + b, 0) / temposReparo.length;
          averageTime = `${mediaEmDias.toFixed(1)} dias`;
        }
      }

      setStats({
        activeClients: clientes?.length || 0,
        openOS: osAbertas?.length || 0,
        completedOS: osFinalizadas?.length || 0,
        revenue: faturamentoTotal,
        lowStockItems: estoqueBaixo.length,
        averageTime,
        technicians: technicianStats,
        recentActivities
      });

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar cada 30 segundos
  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Permite refresh imediato ao disparar alguma ação
  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    stats,
    isLoading,
    refreshData
  };
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `${diffInMinutes}min`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
}
