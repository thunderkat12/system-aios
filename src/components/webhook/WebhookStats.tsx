
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TestTube } from "lucide-react";
import { WebhookConfig } from './types';

interface WebhookStatsProps {
  webhooks: WebhookConfig[];
}

export function WebhookStats({ webhooks }: WebhookStatsProps) {
  return (
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
  );
}
