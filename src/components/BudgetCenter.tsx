
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Plus, Eye, CheckCircle, Clock, XCircle, Filter, Search, History } from "lucide-react";

interface StatusHistory {
  status: string;
  changedBy: string;
  changedAt: string;
}

interface Budget {
  id: number;
  osNumber: string;
  customerName: string;
  device: string;
  status: string;
  laborValue: string;
  partsValue: string;
  totalValue: string;
  createdAt: string;
  services: string;
  parts: string;
  statusHistory: StatusHistory[];
}

export function BudgetCenter() {
  const [showNewBudget, setShowNewBudget] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [newBudget, setNewBudget] = useState({
    osNumber: "",
    customerName: "",
    device: "",
    services: "",
    parts: "",
    laborValue: "",
    partsValue: "",
    totalValue: "",
    notes: ""
  });
  const { toast } = useToast();

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      osNumber: "02741",
      customerName: "João Silva",
      device: "Dell G3",
      status: "Pendente",
      laborValue: "R$ 150,00",
      partsValue: "R$ 300,00",
      totalValue: "R$ 450,00",
      createdAt: "2024-06-09",
      services: "Substituição de tela",
      parts: "Tela 15.6\" Full HD",
      statusHistory: [
        { status: "Aberta", changedBy: "Sistema", changedAt: "2024-06-09 10:00" },
        { status: "Pendente", changedBy: "Daniel Victor", changedAt: "2024-06-09 14:30" }
      ]
    },
    {
      id: 2,
      osNumber: "02740",
      customerName: "Ana Costa",
      device: "Lenovo ThinkPad",
      status: "Aprovado",
      laborValue: "R$ 80,00",
      partsValue: "R$ 120,00",
      totalValue: "R$ 200,00",
      createdAt: "2024-06-08",
      services: "Troca de teclado",
      parts: "Teclado ABNT2",
      statusHistory: [
        { status: "Aberta", changedBy: "Sistema", changedAt: "2024-06-08 09:15" },
        { status: "Pendente", changedBy: "Samuel", changedAt: "2024-06-08 11:00" },
        { status: "Aprovado", changedBy: "Ana Costa", changedAt: "2024-06-08 16:45" }
      ]
    },
    {
      id: 3,
      osNumber: "02739",
      customerName: "Pedro Santos",
      device: "MacBook Air",
      status: "Rejeitado",
      laborValue: "R$ 200,00",
      partsValue: "R$ 800,00",
      totalValue: "R$ 1.000,00",
      createdAt: "2024-06-07",
      services: "Troca de placa mãe",
      parts: "Placa mãe MacBook Air",
      statusHistory: [
        { status: "Aberta", changedBy: "Sistema", changedAt: "2024-06-07 08:30" },
        { status: "Pendente", changedBy: "Heinenger", changedAt: "2024-06-07 10:15" },
        { status: "Rejeitado", changedBy: "Pedro Santos", changedAt: "2024-06-07 18:20" }
      ]
    }
  ]);

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.osNumber.includes(searchTerm) ||
                         budget.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.services.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const budgetDate = new Date(budget.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = budgetDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = budgetDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = budgetDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBudget.osNumber || !newBudget.customerName || !newBudget.totalValue) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newBudgetItem: Budget = {
      id: Date.now(),
      osNumber: newBudget.osNumber,
      customerName: newBudget.customerName,
      device: newBudget.device,
      status: "Aberta",
      laborValue: newBudget.laborValue,
      partsValue: newBudget.partsValue,
      totalValue: newBudget.totalValue,
      createdAt: new Date().toISOString().split('T')[0],
      services: newBudget.services,
      parts: newBudget.parts,
      statusHistory: [
        { status: "Aberta", changedBy: "Sistema", changedAt: new Date().toLocaleString('pt-BR') }
      ]
    };

    setBudgets([newBudgetItem, ...budgets]);

    toast({
      title: "Orçamento criado!",
      description: `Orçamento para OS #${newBudget.osNumber} foi criado`,
    });

    setNewBudget({
      osNumber: "",
      customerName: "",
      device: "",
      services: "",
      parts: "",
      laborValue: "",
      partsValue: "",
      totalValue: "",
      notes: ""
    });
    setShowNewBudget(false);
  };

  const handleStatusChange = (budgetId: number, newStatus: string) => {
    const updatedBudgets = budgets.map(budget => {
      if (budget.id === budgetId) {
        const updatedHistory = [...budget.statusHistory, {
          status: newStatus,
          changedBy: "Usuário Atual",
          changedAt: new Date().toLocaleString('pt-BR')
        }];
        return { ...budget, status: newStatus, statusHistory: updatedHistory };
      }
      return budget;
    });

    setBudgets(updatedBudgets);

    toast({
      title: "Status atualizado!",
      description: `OS #${budgets.find(b => b.id === budgetId)?.osNumber} alterada para ${newStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
      case "Em andamento":
        return "bg-blue-100 text-blue-800";
      case "Finalizada":
        return "bg-purple-100 text-purple-800";
      case "Cancelada":
        return "bg-gray-100 text-gray-800";
      case "Aberta":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="h-4 w-4" />;
      case "Pendente":
        return <Clock className="h-4 w-4" />;
      case "Rejeitado":
        return <XCircle className="h-4 w-4" />;
      case "Em andamento":
        return <Clock className="h-4 w-4" />;
      case "Finalizada":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelada":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = budgets.filter(budget => budget.status === "Pendente").length;
  const approvedCount = budgets.filter(budget => budget.status === "Aprovado").length;
  const totalValue = budgets
    .filter(budget => budget.status === "Aprovado")
    .reduce((sum, budget) => sum + parseFloat(budget.totalValue.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Central de Orçamento
        </h1>
        <p className="text-muted-foreground">
          Gerencie orçamentos com controle completo de status e histórico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total aprovado</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, OS, aparelho ou serviço..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Aberta">Aberta</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Rejeitado">Rejeitado</SelectItem>
              <SelectItem value="Finalizada">Finalizada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as datas</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowNewBudget(!showNewBudget)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {showNewBudget && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Orçamento</CardTitle>
            <CardDescription>
              Preencha os detalhes do orçamento para aprovação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="osNumber">Número da OS *</Label>
                  <Input
                    id="osNumber"
                    placeholder="Ex: 02741"
                    value={newBudget.osNumber}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, osNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Cliente *</Label>
                  <Input
                    id="customerName"
                    placeholder="Nome do cliente"
                    value={newBudget.customerName}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device">Aparelho</Label>
                  <Input
                    id="device"
                    placeholder="Modelo do aparelho"
                    value={newBudget.device}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, device: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="services">Serviços</Label>
                  <Textarea
                    id="services"
                    placeholder="Descreva os serviços a serem realizados"
                    rows={3}
                    value={newBudget.services}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, services: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parts">Peças Necessárias</Label>
                  <Textarea
                    id="parts"
                    placeholder="Liste as peças necessárias"
                    rows={3}
                    value={newBudget.parts}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, parts: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laborValue">Valor da Mão de Obra</Label>
                  <Input
                    id="laborValue"
                    placeholder="R$ 0,00"
                    value={newBudget.laborValue}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, laborValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partsValue">Valor das Peças</Label>
                  <Input
                    id="partsValue"
                    placeholder="R$ 0,00"
                    value={newBudget.partsValue}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, partsValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalValue">Valor Total *</Label>
                  <Input
                    id="totalValue"
                    placeholder="R$ 0,00"
                    value={newBudget.totalValue}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, totalValue: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações adicionais sobre o orçamento"
                  rows={2}
                  value={newBudget.notes}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Criar Orçamento</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewBudget(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredBudgets.map((budget) => (
          <Card key={budget.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium">OS #{budget.osNumber}</h3>
                    <Select
                      value={budget.status}
                      onValueChange={(value) => handleStatusChange(budget.id, value)}
                    >
                      <SelectTrigger className="w-auto h-auto p-0 border-none">
                        <Badge className={getStatusColor(budget.status)}>
                          {getStatusIcon(budget.status)}
                          <span className="ml-1">{budget.status}</span>
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberta">Aberta</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        <SelectItem value="Finalizada">Finalizada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedHistory(expandedHistory === budget.id ? null : budget.id)}
                    >
                      <History className="h-4 w-4 mr-1" />
                      Histórico
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Cliente:</span>
                      <p>{budget.customerName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Aparelho:</span>
                      <p>{budget.device}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Serviço:</span>
                      <p>{budget.services}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Data:</span>
                      <p>{new Date(budget.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Mão de obra:</span>
                      <p>{budget.laborValue}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Peças:</span>
                      <p>{budget.partsValue}</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Total:</span>
                      <p className="font-bold text-primary">{budget.totalValue}</p>
                    </div>
                  </div>
                  
                  {expandedHistory === budget.id && budget.statusHistory.length > 0 && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Histórico de Alterações:
                      </h4>
                      <div className="space-y-2">
                        {budget.statusHistory.map((history, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-background rounded border-l-2 border-primary">
                            <div>
                              <span className="font-medium text-sm">{history.status}</span>
                              <p className="text-xs text-muted-foreground">por {history.changedBy}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{history.changedAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBudgets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum orçamento encontrado</p>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                ? "Tente ajustar os filtros de busca" 
                : "Crie seu primeiro orçamento"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
