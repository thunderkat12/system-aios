
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Plus, Eye, CheckCircle, Clock, XCircle } from "lucide-react";

export function BudgetCenter() {
  const [showNewBudget, setShowNewBudget] = useState(false);
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

  // Dados mockados para demonstração
  const budgets = [
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
      parts: "Tela 15.6\" Full HD"
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
      parts: "Teclado ABNT2"
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
      parts: "Placa mãe MacBook Air"
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Rejeitado":
        return "bg-red-100 text-red-800";
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
          Defina previamente o que será avaliado para aprovação de reparo
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

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Orçamentos</h2>
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
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium">OS #{budget.osNumber}</h3>
                    <Badge className={getStatusColor(budget.status)}>
                      {getStatusIcon(budget.status)}
                      <span className="ml-1">{budget.status}</span>
                    </Badge>
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
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
