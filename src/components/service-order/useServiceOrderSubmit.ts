
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ServiceOrderData } from "./FormFields";
import { WEBHOOK_URL } from "./constants";

export function useServiceOrderSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (osData: ServiceOrderData, resetForm: () => void) => {
    if (!osData.customerName || !osData.customerWhatsapp || !osData.deviceModel || !osData.repairType || !osData.technician) {
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
      customerWhatsapp: osData.customerWhatsapp,
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
      const response = await fetch(WEBHOOK_URL, {
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
        resetForm();
      } else {
        throw new Error("Falha ao enviar webhook");
      }
    } catch (error) {
      console.error("Erro ao disparar webhook:", error);
      
      toast({
        title: "OS Gerada (Webhook falhou)",
        description: `OS Nº ${osNumber} criada para ${osData.customerName}. Erro na notificação automática.`,
        variant: "destructive",
      });
      
      resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading
  };
}
