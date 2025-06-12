
import { useState, useEffect } from 'react';

interface DashboardStats {
  activeClients: number;
  openOS: number;
  completedOS: number;
  revenue: number;
  lowStockItems: number;
  averageTime: string;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    activeClients: 127,
    openOS: 23,
    completedOS: 89,
    revenue: 12450,
    lowStockItems: 5,
    averageTime: "3.2 dias"
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateStats = () => {
    setIsLoading(true);
    // Simular atualização dos dados
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        activeClients: prev.activeClients + Math.floor(Math.random() * 5),
        openOS: Math.max(0, prev.openOS + Math.floor(Math.random() * 10) - 5),
        completedOS: prev.completedOS + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
        lowStockItems: Math.max(0, prev.lowStockItems + Math.floor(Math.random() * 3) - 1),
      }));
      setIsLoading(false);
    }, 1000);
  };

  const sendWebhookData = async (webhookUrl: string) => {
    if (!webhookUrl) return;

    const dashboardData = {
      timestamp: new Date().toISOString(),
      stats: {
        activeClients: stats.activeClients,
        openOS: stats.openOS,
        completedOS: stats.completedOS,
        revenue: `R$ ${stats.revenue.toLocaleString('pt-BR')}`,
        lowStockItems: stats.lowStockItems,
        averageTime: stats.averageTime
      },
      company: "Hi-Tech Soluções"
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
      console.error("Erro ao enviar dados do dashboard:", error);
      return false;
    }
  };

  return {
    stats,
    isLoading,
    updateStats,
    sendWebhookData
  };
}
