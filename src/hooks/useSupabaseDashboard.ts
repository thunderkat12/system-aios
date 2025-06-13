
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
      const { data: estoqueBaixo } = await supabase
        .from('estoque')
        .select('*')
        .lt('quantidade', 5);

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

      // Buscar atividades recentes
      const { data: atividades } = await supabase
        .from('atividades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentActivities = atividades?.map(atividade => ({
        id: atividade.id,
        type: atividade.tipo,
        description: atividade.descricao,
        time: getTimeAgo(atividade.created_at)
      })) || [];

      setStats({
        activeClients: clientes?.length || 0,
        openOS: osAbertas?.length || 0,
        completedOS: osFinalizadas?.length || 0,
        revenue: faturamentoTotal,
        lowStockItems: estoqueBaixo?.length || 0,
        averageTime: "3.2 dias", // Pode ser calculado com base nas datas
        technicians: technicianStats,
        recentActivities
      });

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWebhookData = async () => {
    const webhookUrl = "https://n8n.grapeassist.com/webhook/dash_diario";
    
    const dashboardData = {
      timestamp: new Date().toISOString(),
      data_hora_envio: new Date().toLocaleString('pt-BR'),
      clientes_ativos: stats.activeClients,
      os_abertas: stats.openOS,
      os_finalizadas: stats.completedOS,
      faturamento_total: `R$ ${stats.revenue.toLocaleString('pt-BR')}`,
      estoque_baixo: stats.lowStockItems,
      tempo_medio_reparo: stats.averageTime,
      tecnicos_responsaveis: stats.technicians,
      ultimas_atividades: stats.recentActivities,
      empresa: "Hi-Tech Soluções"
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dashboardData),
      });

      return response.ok;
    } catch (error) {
      console.error("Erro ao enviar webhook:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    isLoading,
    refreshData: fetchDashboardData,
    sendWebhookData
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
