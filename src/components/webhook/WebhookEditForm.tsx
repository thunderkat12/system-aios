
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditForm } from './types';

interface WebhookEditFormProps {
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  onSave: () => void;
  onCancel: () => void;
}

export function WebhookEditForm({ editForm, setEditForm, onSave, onCancel }: WebhookEditFormProps) {
  return (
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
        <Button onClick={onSave}>
          Salvar
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
