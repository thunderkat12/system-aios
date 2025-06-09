
export function NotificationInfo() {
  return (
    <div className="bg-card p-4 rounded-lg border">
      <h3 className="font-medium text-sm mb-2">📲 Notificação Automática</h3>
      <p className="text-sm text-muted-foreground">
        Ao gerar a OS, o cliente receberá uma mensagem via WhatsApp com:
        • Nome do técnico responsável
        • Tipo de reparo previsto
        • Número da OS para acompanhamento
      </p>
    </div>
  );
}
