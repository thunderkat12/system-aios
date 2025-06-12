
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, Globe, CheckCircle, XCircle, TestTube, Edit } from "lucide-react";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  event: string;
  description: string;
  isActive: boolean;
  lastTest?: string;
  lastTestStatus?: 'success' | 'error';
}

export function WebhookSettings() {
  const [editingWebhook, setEditingWebhook] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const { toast } = useToast();

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "ordem_servico",
      name: "Webhook - Ordem de Serviço",
      url: "https://n8n.grapeassist.com/webhook/ordem_de_servico",
      event: "Criação de OS",
      description: "Dispara quando uma nova ordem de serviço é criada",
      isActive: true,
      lastTest: "2024-06-12 14:30",
      lastTestStatus: 'success'
    },
    {
      id: "relatorio_os",
      name: "Webhook - Relatório OS",
      url: "https://n8n.grapeassist.com/webhook/relatorio-os",
      event: "Finalização de OS",
      description: "Dispara quando uma OS é finalizada com dados de venda",
      isActive: true,
      lastTest: "2024-06-11 09:15",
      lastTestStatus: 'success'
    }
  ]);

  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
    description: ""
  });

  const handleEdit = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook.id);
    setEditForm({
      name: webhook.name,
      url: webhook.url,
      description: webhook.description
    });
  };

  const handleSaveEdit = () => {
    if (!editForm.name || !editForm.url) {
      toast({
        title: "Erro",
        description: "Nome e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setWebhooks(webhooks.map(webhook => 
      webhook.id === editingWebhook 
        ? { 
            ...webhook, 
            name: editForm.name, 
            url: editForm.url, 
            description: editForm.description 
          }
        : webhook
    ));

    toast({
      title: "Webhook atualizado!",
      description: "As configurações foram salvas com sucesso",
    });

    setEditingWebhook(null);
    setEditForm({ name: "", url: "", description: "" });
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    setTestingWebhook(webhook.id);

    // Dados de teste baseados no tipo de webhook
    let testData = {};
    
    if (webhook.id === "ordem_servico") {
      testData = {
        customerName: "Cliente Teste",
        customerWhatsapp: "(11) 99999-9999",
        customerCpfCnpj: "123.456.789-00",
        deviceModel: "Notebook Dell",
        deviceBrand: "Dell",
        repairType: "Teste de sistema",
        problemDescription: "Teste de webhook",
        technician: "Daniel Victor",
        priority: "Normal",
        estimatedValue: "R$ 100,00",
        paymentMethod: "PIX",
        osNumber: 99999,
        timestamp: new Date().toISOString(),
        company: "Hi-Tech Soluções",
        status: "Teste"
      };
    } else if (webhook.id === "relatorio_os") {
      testData = {
        osNumber: 99999,
        customerName: "Cliente Teste",
        finalizedAt: new Date().toISOString(),
        totalValue: "R$ 100,00",
        paymentMethods: {
          dinheiro: "R$ 50,00",
          pix: "R$ 50,00"
        },
        technician: "Daniel Victor",
        services: "Teste de webhook",
        status: "Finalizada - Teste"
      };
    }

    console.log(`Testando webhook ${webhook.name}:`, testData);

    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const updatedWebhooks = webhooks.map(w => 
        w.id === webhook.id 
          ? { 
              ...w, 
              lastTest: new Date().toLocaleString('pt-BR'),
              lastTestStatus: (response.ok ? 'success' : 'error') as 'success' | 'error'
            }
          : w
      );
      setWebhooks(updatedWebhooks);

      toast({
        title: response.ok ? "Teste realizado com sucesso!" : "Erro no teste",
        description: response.ok 
          ? `Webhook ${webhook.name} respondeu corretamente`
          : `Falha ao testar webhook. Status: ${response.status}`,
        variant: response.ok ? "default" : "destructive",
      });

    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      
      const updatedWebhooks = webhooks.map(w => 
        w.id === webhook.id 
          ? { 
              ...w, 
              lastTest: new Date().toLocaleString('pt-BR'),
              lastTestStatus: 'error' as 'error'
            }
          : w
      );
      setWebhooks(updatedWebhooks);

      toast({
        title: "Erro no teste",
        description: "Falha ao conectar com o webhook",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, isActive: !webhook.isActive }
        : webhook
    ));

    const webhook = webhooks.find(w => w.id === webhookId);
    toast({
      title: `Webhook ${webhook?.isActive ? 'desativado' : 'ativado'}!`,
      description: `${webhook?.name} foi ${webhook?.isActive ? 'desativado' : 'ativado'} com sucesso`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Configurações de Webhooks
        </h1>
        <p className="text-muted-foreground">
          Gerencie as integrações com automações externas (n8n)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks Ativos</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {webhooks.filter(w => w.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {webhooks.length} configurados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Teste</CardTitle>
            <TestTube className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {webhooks.filter(w => w.lastTestStatus === 'success').length}
            </div>
            <p className="text-xs text-muted-foreground">com sucesso</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Webhooks Configurados</h2>
        
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardContent className="pt-6">
              {editingWebhook === webhook.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookName">Nome do Webhook</Label>
                    <Input
                      id="webhookName"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome descritivo do webhook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">URL do Webhook</Label>
                    <Input
                      id="webhookUrl"
                      value={editForm.url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookDescription">Descrição</Label>
                    <Input
                      id="webhookDescription"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva quando este webhook é disparado"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit}>
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingWebhook(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{webhook.name}</h3>
                        <Badge 
                          className={webhook.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                          }
                        >
                          {webhook.isActive ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Ativo</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" />Inativo</>
                          )}
                        </Badge>
                        {webhook.lastTestStatus && (
                          <Badge 
                            className={webhook.lastTestStatus === 'success'
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                            }
                          >
                            Último teste: {webhook.lastTestStatus === 'success' ? 'Sucesso' : 'Erro'}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Evento:</span>
                          <p>{webhook.event}</p>
                        </div>
                        <div>
                          <span className="font-medium">URL:</span>
                          <p className="font-mono text-xs break-all">{webhook.url}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Descrição:</span>
                        <p>{webhook.description}</p>
                      </div>
                      {webhook.lastTest && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Último teste: {webhook.lastTest}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(webhook)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestWebhook(webhook)}
                        disabled={testingWebhook === webhook.id || !webhook.isActive}
                      >
                        <TestTube className="h-4 w-4" />
                        {testingWebhook === webhook.id ? "Testando..." : "Testar"}
                      </Button>
                      <Button 
                        variant={webhook.isActive ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleWebhook(webhook.id)}
                      >
                        {webhook.isActive ? "Desativar" : "Ativar"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Como usar os Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-2 text-sm">
            <p><strong>Webhook de Ordem de Serviço:</strong> Enviado automaticamente quando uma nova OS é criada, contendo todos os dados do cliente, equipamento e serviço.</p>
            <p><strong>Webhook de Relatório:</strong> Enviado quando uma OS é finalizada, incluindo dados de pagamento e valores recebidos.</p>
            <p><strong>Teste:</strong> Use o botão "Testar" para verificar se o webhook está funcionando corretamente. Dados simulados serão enviados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
