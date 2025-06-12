
export const REPAIR_TYPES = [
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

export const TECHNICIANS = ["Daniel Victor", "Heinenger", "Samuel"];

// Webhooks para integração com n8n
export const WEBHOOKS = {
  ORDEM_SERVICO: "https://n8n.grapeassist.com/webhook/ordem_de_servico",
  RELATORIO_OS: "https://n8n.grapeassist.com/webhook/relatorio-os"
};

export const PAYMENT_METHODS = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "PIX",
  "Transferência Bancária"
];
