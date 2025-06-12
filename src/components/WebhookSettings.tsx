
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import { WebhookConfig, EditForm } from './webhook/types';
import { sendWebhookTest } from './webhook/webhookUtils';
import { WebhookStats } from './webhook/WebhookStats';
import { WebhookCard } from './webhook/WebhookCard';
import { WebhookInstructions } from './webhook/WebhookInstructions';

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

  const [editForm, setEditForm] = useState<EditForm>({
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

    try {
      const success = await sendWebhookTest(webhook);

      const updatedWebhooks = webhooks.map(w => 
        w.id === webhook.id 
          ? { 
              ...w, 
              lastTest: new Date().toLocaleString('pt-BR'),
              lastTestStatus: (success ? 'success' : 'error') as 'success' | 'error'
            }
          : w
      );
      setWebhooks(updatedWebhooks);

      toast({
        title: success ? "Teste realizado com sucesso!" : "Erro no teste",
        description: success 
          ? `Webhook ${webhook.name} respondeu corretamente`
          : `Falha ao testar webhook`,
        variant: success ? "default" : "destructive",
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

      <WebhookStats webhooks={webhooks} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Webhooks Configurados</h2>
        
        {webhooks.map((webhook) => (
          <WebhookCard
            key={webhook.id}
            webhook={webhook}
            editingWebhook={editingWebhook}
            testingWebhook={testingWebhook}
            editForm={editForm}
            setEditForm={setEditForm}
            onEdit={handleEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingWebhook(null)}
            onTest={handleTestWebhook}
            onToggle={toggleWebhook}
          />
        ))}
      </div>

      <WebhookInstructions />
    </div>
  );
}
