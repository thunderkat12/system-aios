
import { WebhookConfig } from './types';

export const createTestData = (webhook: WebhookConfig) => {
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

  return testData;
};

export const sendWebhookTest = async (webhook: WebhookConfig): Promise<boolean> => {
  const testData = createTestData(webhook);
  
  console.log(`Testando webhook ${webhook.name}:`, testData);

  const response = await fetch(webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testData),
  });

  return response.ok;
};
