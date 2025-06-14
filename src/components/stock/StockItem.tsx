
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { StockItem as StockItemType } from "@/hooks/useStockData";

interface StockItemProps {
  item: StockItemType;
  onEdit: (item: StockItemType) => void;
  onDelete: (id: string) => void;
}

export function StockItem({ item, onEdit, onDelete }: StockItemProps) {
  const calculateStatus = (quantidade: number, estoqueMinimo: number | null) => {
    if (quantidade === 0) return "Esgotado";
    if (estoqueMinimo && quantidade <= estoqueMinimo) return "Baixo";
    return "Normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Esgotado":
        return "bg-red-100 text-red-800";
      case "Baixo":
        return "bg-yellow-100 text-yellow-800";
      case "Normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const status = calculateStatus(item.quantidade, item.estoque_minimo);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium">{item.nome}</h3>
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Categoria:</span> {item.categoria || "N/A"}
              </div>
              <div>
                <span className="font-medium">Marca:</span> {item.marca || "N/A"}
              </div>
              <div>
                <span className="font-medium">Quantidade:</span> {item.quantidade}
              </div>
              <div>
                <span className="font-medium">Mínimo:</span> {item.estoque_minimo || "N/A"}
              </div>
              <div>
                <span className="font-medium">Valor Unit.:</span> {item.valor_unitario ? `R$ ${item.valor_unitario.toFixed(2)}` : "N/A"}
              </div>
              <div>
                <span className="font-medium">Valor Total:</span> {item.valor_unitario ? `R$ ${(item.valor_unitario * item.quantidade).toFixed(2)}` : "N/A"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir "{item.nome}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.id)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
