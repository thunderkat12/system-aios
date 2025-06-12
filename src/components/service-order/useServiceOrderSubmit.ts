
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ServiceOrderData } from "./FormFields";
import { WEBHOOKS } from "./constants";

export function useServiceOrderSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (osData: ServiceOrderData, resetForm: () => void) => {
    if (!osData.customerName || !osData.customerWhatsapp || !osData.deviceModel || !osData.repairType || !osData.technician || !osData.problemDescription) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (*)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const osNumber = Math.floor(Math.random() * 90000) + 10000;
    
    const webhookData = {
      // Dados do cliente
      customerName: osData.customerName,
      customerWhatsapp: osData.customerWhatsapp,
      customerCpfCnpj: osData.customerCpfCnpj,
      
      // Dados do equipamento
      deviceModel: osData.deviceModel,
      deviceBrand: osData.deviceBrand,
      
      // Dados do serviço
      repairType: osData.repairType,
      problemDescription: osData.problemDescription,
      technician: osData.technician,
      priority: osData.priority,
      observations: osData.observations,
      
      // Dados financeiros
      estimatedValue: osData.estimatedValue,
      paymentMethod: osData.paymentMethod,
      
      // Dados do sistema
      osNumber: osNumber,
      timestamp: new Date().toISOString(),
      company: "Hi-Tech Soluções",
      status: "Aberta"
    };

    console.log("Enviando dados para webhook n8n (ordem_de_servico):", webhookData);

    try {
      const response = await fetch(WEBHOOKS.ORDEM_SERVICO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        toast({
          title: "Ordem de Serviço Gerada!",
          description: `OS Nº ${osNumber} criada para ${osData.customerName}. Automação n8n ativada com sucesso.`,
        });

        console.log("Webhook ordem_de_servico disparado com sucesso para n8n");
        resetForm();
      } else {
        throw new Error("Falha ao enviar webhook");
      }
    } catch (error) {
      console.error("Erro ao disparar webhook:", error);
      
      toast({
        title: "OS Gerada (Webhook falhou)",
        description: `OS Nº ${osNumber} criada para ${osData.customerName}. Erro na automação n8n.`,
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
