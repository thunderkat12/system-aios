
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StockItem } from "@/hooks/useStockData";
import { ActivityLogger } from '@/components/ActivityLogger';

interface StockFormProps {
  editingItem: StockItem | null;
  onSubmit: (item: any) => Promise<void>;
  onCancel: () => void;
}

export function StockForm({ editingItem, onSubmit, onCancel }: StockFormProps) {
  const [formData, setFormData] = useState({
    nome: editingItem?.nome || "",
    categoria: editingItem?.categoria || "",
    marca: editingItem?.marca || "",
    quantidade: editingItem?.quantidade?.toString() || "",
    estoque_minimo: editingItem?.estoque_minimo?.toString() || "",
    valor_unitario: editingItem?.valor_unitario?.toString() || ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.quantidade || !formData.estoque_minimo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);

      // Registrar atividade se estoque baixo
      const quantidade = parseInt(formData.quantidade);
      const minimo = parseInt(formData.estoque_minimo);
      if (quantidade <= minimo) {
        await ActivityLogger.logLowStock(formData.nome, quantidade);
      }
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? "Editar Item" : "Adicionar Novo Item"}</CardTitle>
        <CardDescription>
          {editingItem ? "Atualize as informações da peça" : "Cadastre uma nova peça no estoque"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Nome da Peça *</Label>
              <Input
                id="itemName"
                placeholder="Ex: Tela 15.6 Full HD"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Telas, Teclados, etc."
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                placeholder="Ex: Dell, Samsung, etc."
                value={formData.marca}
                onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorUnitario">Valor Unitário</Label>
              <Input
                id="valorUnitario"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.valor_unitario}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_unitario: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Estoque Mínimo *</Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.estoque_minimo}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque_minimo: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {editingItem ? "Atualizar Item" : "Adicionar Item"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
