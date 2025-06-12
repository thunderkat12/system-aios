
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebhookInstructions() {
  return (
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
  );
}
