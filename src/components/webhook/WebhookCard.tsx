
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, TestTube, Edit } from "lucide-react";
import { WebhookConfig, EditForm } from './types';
import { WebhookEditForm } from './WebhookEditForm';

interface WebhookCardProps {
  webhook: WebhookConfig;
  editingWebhook: string | null;
  testingWebhook: string | null;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  onEdit: (webhook: WebhookConfig) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onTest: (webhook: WebhookConfig) => void;
  onToggle: (webhookId: string) => void;
}

export function WebhookCard({
  webhook,
  editingWebhook,
  testingWebhook,
  editForm,
  setEditForm,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onTest,
  onToggle
}: WebhookCardProps) {
  const isEditing = editingWebhook === webhook.id;

  return (
    <Card>
      <CardContent className="pt-6">
        {isEditing ? (
          <WebhookEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
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
                  onClick={() => onEdit(webhook)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onTest(webhook)}
                  disabled={testingWebhook === webhook.id || !webhook.isActive}
                >
                  <TestTube className="h-4 w-4" />
                  {testingWebhook === webhook.id ? "Testando..." : "Testar"}
                </Button>
                <Button 
                  variant={webhook.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onToggle(webhook.id)}
                >
                  {webhook.isActive ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
