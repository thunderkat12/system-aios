
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, FileText, Package, DollarSign, Clock, CheckCircle, RefreshCw, Send } from "lucide-react";
import { useSupabaseDashboard } from "@/hooks/useSupabaseDashboard";
import { useState } from "react";
import type { ViewType } from "@/pages/Index";

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const { stats, isLoading, refreshData, sendWebhookData } = useSupabaseDashboard();
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const { toast } = useToast();

  const handleSendWebhook = async () => {
    setIsSendingWebhook(true);
    try {
      const success = await sendWebhookData();
      
      toast({
        title: success ? "Webhook enviado com sucesso!" : "Erro no envio",
        description: success 
          ? "Dados do dashboard enviados para n8n com sucesso" 
          : "Falha ao enviar dados para o webhook",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Falha ao conectar com o webhook",
        variant: "destructive",
      });
    } finally {
      setIsSendingWebhook(false);
    }
  };

  const handleCardClick = (view: ViewType) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  const dashboardStats = [
    {
      title: "Clientes Ativos",
      value: stats.activeClients.toString(),
      description: "Total de clientes",
      icon: Users,
      color: "text-blue-600",
      clickAction: () => handleCardClick("customers")
    },
    {
      title: "OS Abertas",
      value: stats.openOS.toString(),
      description: "Em andamento",
      icon: FileText,
      color: "text-orange-600",
      clickAction: () => handleCardClick("service-orders")
    },
    {
      title: "OS Finalizadas",
      value: stats.completedOS.toString(),
      description: "Concluídas",
      icon: CheckCircle,
      color: "text-green-600",
      clickAction: () => handleCardClick("history")
    },
    {
      title: "Faturamento",
      value: `R$ ${stats.revenue.toLocaleString('pt-BR')}`,
      description: "Total arrecadado",
      icon: DollarSign,
      color: "text-emerald-600",
      clickAction: () => handleCardClick("budget")
    },
    {
      title: "Estoque Baixo",
      value: stats.lowStockItems.toString(),
      description: "Itens para repor",
      icon: Package,
      color: "text-red-600",
      clickAction: () => handleCardClick("stock")
    },
    {
      title: "Tempo Médio",
      value: stats.averageTime,
      description: "Por reparo",
      icon: Clock,
      color: "text-purple-600",
      clickAction: () => handleCardClick("history")
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema - Hi-Tech Soluções em Informática
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
          <Button 
            onClick={handleSendWebhook}
            disabled={isSendingWebhook}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSendingWebhook ? "Enviando..." : "Enviar Webhook"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat) => (
          <Card 
            key={stat.title} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={stat.clickAction}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick("history")}>
          <CardHeader>
            <CardTitle>Técnicos Responsáveis</CardTitle>
            <CardDescription>Performance da equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.technicians.map((tech) => (
                <div key={tech.name} className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tech.activeJobs} ativos • {tech.completedJobs} finalizados
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{tech.activeJobs}</div>
                    <div className="text-xs text-muted-foreground">Ativos</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick("history")}>
          <CardHeader>
            <CardTitle>Últimas Atividades</CardTitle>
            <CardDescription>Movimentações recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 border-l-2 border-primary bg-card rounded">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">Atividade do sistema</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
              {stats.recentActivities.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
