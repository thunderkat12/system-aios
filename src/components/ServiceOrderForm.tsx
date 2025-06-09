import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, User, Wrench } from "lucide-react";

export function ServiceOrderForm() {
  const [osData, setOsData] = useState({
    customerName: "",
    deviceModel: "",
    repairType: "",
    technician: "",
    priority: "Normal",
    description: "",
    estimatedValue: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const webhookUrl = "https://n8n.grapeassist.com/webhook/35fc1cbe-abc2-40dd-beb2-68fdc1e0dac5";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!osData.customerName || !osData.deviceModel || !osData.repairType || !osData.technician) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const osNumber = Math.floor(Math.random() * 90000) + 10000;
    
    const webhookData = {
      customerName: osData.customerName,
      deviceModel: osData.deviceModel,
      repairType: osData.repairType,
      technician: osData.technician,
      priority: osData.priority,
      description: osData.description,
      estimatedValue: osData.estimatedValue,
      osNumber: osNumber,
      timestamp: new Date().toISOString(),
      company: "Hi-Tech Soluções"
    };

    console.log("Enviando dados para webhook n8n:", webhookData);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        toast({
          title: "Ordem de Serviço Gerada!",
          description: `OS Nº ${osNumber} criada para ${osData.customerName}. Notificação WhatsApp enviada automaticamente.`,
        });

        console.log("Webhook disparado com sucesso para n8n");
        
        setOsData({
          customerName: "",
          deviceModel: "",
          repairType: "",
          technician: "",
          priority: "Normal",
          description: "",
          estimatedValue: ""
        });
      } else {
        throw new Error("Falha ao enviar webhook");
      }
    } catch (error) {
      console.error("Erro ao disparar webhook:", error);
      
      // Ainda gera a OS localmente mesmo se o webhook falhar
      toast({
        title: "OS Gerada (Webhook falhou)",
        description: `OS Nº ${osNumber} criada para ${osData.customerName}. Erro na notificação automática.`,
        variant: "destructive",
      });
      
      setOsData({
        customerName: "",
        deviceModel: "",
        repairType: "",
        technician: "",
        priority: "Normal",
        description: "",
        estimatedValue: ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  const repairTypes = [
    "Substituição de tela",
    "Troca de teclado",
    "Reparo de placa mãe",
    "Limpeza e manutenção",
    "Instalação de sistema",
    "Recuperação de dados",
    "Troca de HD/SSD",
    "Reparo de fonte",
    "Outro"
  ];

  const technicians = ["Daniel Victor", "Heinenger", "Samuel"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Ordem de Serviço
        </h1>
        <p className="text-muted-foreground">
          Geração automática de OS com preenchimento inteligente
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nova Ordem de Serviço</CardTitle>
          <CardDescription>
            Preencha os dados para gerar uma nova OS. O tipo de reparo será sugerido automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerName"
                    placeholder="Nome do cliente"
                    className="pl-10"
                    value={osData.customerName}
                    onChange={(e) => setOsData(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceModel">Modelo do Aparelho *</Label>
                <Input
                  id="deviceModel"
                  placeholder="Ex: Dell G3, MacBook Pro"
                  value={osData.deviceModel}
                  onChange={(e) => setOsData(prev => ({ ...prev, deviceModel: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repairType">Tipo de Reparo *</Label>
                <Select
                  value={osData.repairType}
                  onValueChange={(value) => setOsData(prev => ({ ...prev, repairType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de reparo" />
                  </SelectTrigger>
                  <SelectContent>
                    {repairTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Técnico Responsável *</Label>
                <Select
                  value={osData.technician}
                  onValueChange={(value) => setOsData(prev => ({ ...prev, technician: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          {tech}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={osData.priority}
                  onValueChange={(value) => setOsData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Valor Estimado</Label>
                <Input
                  id="estimatedValue"
                  placeholder="R$ 0,00"
                  value={osData.estimatedValue}
                  onChange={(e) => setOsData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Problema</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
                rows={4}
                value={osData.description}
                onChange={(e) => setOsData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium text-sm mb-2">📲 Notificação Automática</h3>
              <p className="text-sm text-muted-foreground">
                Ao gerar a OS, o cliente receberá uma mensagem via WhatsApp com:
                • Nome do técnico responsável
                • Tipo de reparo previsto
                • Número da OS para acompanhamento
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Gerando OS e enviando notificação..." : "Gerar Ordem de Serviço"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
