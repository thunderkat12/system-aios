
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Package, DollarSign, Clock, CheckCircle } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Clientes Ativos",
      value: "127",
      description: "+12% este mês",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "OS Abertas",
      value: "23",
      description: "Em andamento",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      title: "OS Finalizadas",
      value: "89",
      description: "Este mês",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Faturamento",
      value: "R$ 12.450",
      description: "+8% este mês",
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Estoque Baixo",
      value: "5",
      description: "Itens para repor",
      icon: Package,
      color: "text-red-600",
    },
    {
      title: "Tempo Médio",
      value: "3.2 dias",
      description: "Por reparo",
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  const technicians = [
    { name: "Daniel Victor", activeJobs: 8, completedJobs: 34 },
    { name: "Heinenger", activeJobs: 7, completedJobs: 28 },
    { name: "Samuel", activeJobs: 8, completedJobs: 27 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema - Hi-Tech Soluções em Informática
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
        <Card>
          <CardHeader>
            <CardTitle>Técnicos Responsáveis</CardTitle>
            <CardDescription>Performance da equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicians.map((tech) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Últimas Atividades</CardTitle>
            <CardDescription>Movimentações recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 border-l-2 border-primary bg-card rounded">
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova OS #02741</p>
                  <p className="text-xs text-muted-foreground">Notebook Dell G3 - Samuel</p>
                </div>
                <span className="text-xs text-muted-foreground">2min</span>
              </div>
              <div className="flex items-center gap-3 p-2 border-l-2 border-green-500 bg-card rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">OS #02738 finalizada</p>
                  <p className="text-xs text-muted-foreground">MacBook Pro - Daniel</p>
                </div>
                <span className="text-xs text-muted-foreground">15min</span>
              </div>
              <div className="flex items-center gap-3 p-2 border-l-2 border-orange-500 bg-card rounded">
                <Package className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Estoque baixo</p>
                  <p className="text-xs text-muted-foreground">Tela 15.6" - 2 unidades</p>
                </div>
                <span className="text-xs text-muted-foreground">1h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
